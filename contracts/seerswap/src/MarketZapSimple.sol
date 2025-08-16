// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

// Minimal interfaces - only what we use
interface IRouter {
    function splitPosition(address collateralToken, address market, uint256 amount) external;
}

interface IPositionManager {
    struct MintParams {
        address token0;
        address token1;
        int24 tickLower;
        int24 tickUpper;
        uint256 amount0Desired;
        uint256 amount1Desired;
        uint256 amount0Min;
        uint256 amount1Min;
        address recipient;
        uint256 deadline;
    }
    
    function mint(MintParams calldata params) external payable returns (
        uint256 tokenId,
        uint128 liquidity,
        uint256 amount0,
        uint256 amount1
    );
}

interface IPool {
    function token0() external view returns (address);
    function token1() external view returns (address);
    function tickSpacing() external view returns (int24);
}

interface IFarmingCenter {
    function enterFarming(
        address rewardToken,
        address bonusRewardToken,
        address pool,
        uint256 startTime,
        uint256 endTime,
        uint256 tokenId
    ) external;
}

/**
 * @title MarketZapSimple
 * @author SeerSwap
 * @notice Immutable contract for atomic liquidity provision and farming for prediction markets.
 * @dev KISS - Keep It Simple Stupid. Following Kleros guidelines.
 */
contract MarketZapSimple {
    // Constants
    uint256 private constant BASIS_POINTS = 10000;
    int24 private constant MIN_TICK = -887272;
    int24 private constant MAX_TICK = 887272;
    
    // Immutable storage
    IRouter public immutable router;
    IPositionManager public immutable positionManager;
    IFarmingCenter public immutable farmingCenter;
    address public immutable owner;
    
    // Single storage slot for whitelist
    mapping(address => bool) public whitelistedPools;
    
    // Events
    event Zapped(address indexed user, address indexed market, uint256[] tokenIds);
    event PoolWhitelisted(address indexed pool, bool status);
    
    // Errors
    error Unauthorized();
    error InvalidPool();
    error InvalidAmount();
    error DeadlineExpired();
    error InsufficientTokens();
    
    /**
     * @notice Constructor sets immutable addresses.
     * @param _router Seer router for splitting positions.
     * @param _positionManager Algebra position manager for minting.
     * @param _farmingCenter Farming center for staking (optional).
     */
    constructor(
        address _router,
        address _positionManager,
        address _farmingCenter
    ) {
        router = IRouter(_router);
        positionManager = IPositionManager(_positionManager);
        farmingCenter = IFarmingCenter(_farmingCenter);
        owner = msg.sender;
    }
    
    /**
     * @notice Execute zap into market and optionally stake into farms.
     * @dev O(n) where n is number of pools. UNTRUSTED.
     * @param market Market address to zap into.
     * @param collateralToken Collateral token address.
     * @param splitAmount Amount to split (calculated off-chain).
     * @param pools Pool addresses (must be whitelisted).
     * @param minLiquidities Minimum liquidity for each pool.
     * @param slippageBps Slippage in basis points.
     * @param deadline Transaction deadline.
     * @param rewardTokens Reward token for each pool (address(0) to skip farming).
     * @param endTimes End time for each farm (ignored if not farming).
     * @return tokenIds NFT position token IDs created.
     */
    function zap(
        address market,
        address collateralToken,
        uint256 splitAmount,
        address[] calldata pools,
        uint256[] calldata minLiquidities,
        uint256 slippageBps,
        uint256 deadline,
        address[] calldata rewardTokens,
        uint256[] calldata endTimes
    ) external returns (uint256[] memory tokenIds) {
        // Step 1: Verify
        if (block.timestamp > deadline) revert DeadlineExpired();
        if (pools.length == 0 || pools.length != minLiquidities.length) revert InvalidAmount();
        if (pools.length != rewardTokens.length || pools.length != endTimes.length) revert InvalidAmount();
        if (slippageBps >= BASIS_POINTS) revert InvalidAmount();
        
        uint256 poolsLength = pools.length;
        for (uint256 i; i < poolsLength;) {
            if (!whitelistedPools[pools[i]]) revert InvalidPool();
            unchecked { ++i; }
        }
        
        // Step 2: State changes (transfer collateral)
        IERC20(collateralToken).transferFrom(msg.sender, address(this), splitAmount);
        
        // Step 3: External interactions
        // Split position to get outcome tokens
        IERC20(collateralToken).approve(address(router), splitAmount);
        router.splitPosition(collateralToken, market, splitAmount);
        
        // Add liquidity and optionally stake
        tokenIds = new uint256[](poolsLength);
        for (uint256 i; i < poolsLength;) {
            IPool pool = IPool(pools[i]);
            address token0 = pool.token0();
            address token1 = pool.token1();
            int24 tickSpacing = pool.tickSpacing();
            
            // Determine token ordering
            bool isToken0Outcome = token0 != collateralToken;
            address outcomeToken = isToken0Outcome ? token0 : token1;
            
            // For simplicity, assume 1:1 ratio (UI calculates optimal ratio)
            uint256 collateralNeeded = splitAmount;
            
            // Calculate minimums with slippage
            uint256 amount0Min = (isToken0Outcome ? splitAmount : collateralNeeded) * (BASIS_POINTS - slippageBps) / BASIS_POINTS;
            uint256 amount1Min = (isToken0Outcome ? collateralNeeded : splitAmount) * (BASIS_POINTS - slippageBps) / BASIS_POINTS;
            
            // Approve tokens for position manager
            IERC20(outcomeToken).approve(address(positionManager), splitAmount);
            IERC20(collateralToken).approve(address(positionManager), collateralNeeded);
            
            // Mint position
            (uint256 tokenId, , , ) = positionManager.mint(IPositionManager.MintParams({
                token0: token0,
                token1: token1,
                tickLower: (MIN_TICK / tickSpacing) * tickSpacing,
                tickUpper: (MAX_TICK / tickSpacing) * tickSpacing,
                amount0Desired: isToken0Outcome ? splitAmount : collateralNeeded,
                amount1Desired: isToken0Outcome ? collateralNeeded : splitAmount,
                amount0Min: amount0Min,
                amount1Min: amount1Min,
                recipient: address(this),
                deadline: deadline
            }));
            
            if (tokenId == 0) revert InsufficientTokens();
            tokenIds[i] = tokenId;
            
            // If reward token provided, stake the NFT, otherwise transfer to user
            if (rewardTokens[i] != address(0) && address(farmingCenter) != address(0)) {
                // Approve and stake into farming
                IERC721(address(positionManager)).approve(address(farmingCenter), tokenId);
                farmingCenter.enterFarming(
                    rewardTokens[i],
                    rewardTokens[i], // Same as bonus for simplicity
                    pools[i],
                    block.timestamp,
                    endTimes[i],
                    tokenId
                );
                // NFT is now in farming center, controlled by user
            } else {
                // Transfer NFT to user if not farming
                IERC721(address(positionManager)).transferFrom(address(this), msg.sender, tokenId);
            }
            
            unchecked { ++i; }
        }
        
        // Return leftover collateral
        uint256 leftoverCollateral = IERC20(collateralToken).balanceOf(address(this));
        if (leftoverCollateral > 0) {
            IERC20(collateralToken).transfer(msg.sender, leftoverCollateral);
        }
        
        emit Zapped(msg.sender, market, tokenIds);
    }

    /**
     * @notice Required for NFT transfers.
     */
    function onERC721Received(address, address, uint256, bytes calldata) external pure returns (bytes4) {
        return this.onERC721Received.selector;
    }
}