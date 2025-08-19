// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// Minimal interfaces
interface IERC20 {
    function balanceOf(address account) external view returns (uint256);
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
    function transfer(address to, uint256 amount) external returns (bool);
    function approve(address spender, uint256 amount) external returns (bool);
}

interface IERC721 {
    function approve(address to, uint256 tokenId) external;
    function transferFrom(address from, address to, uint256 tokenId) external;
}

interface INonfungiblePositionManager {
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

    struct DecreaseLiquidityParams {
        uint256 tokenId;
        uint128 liquidity;
        uint256 amount0Min;
        uint256 amount1Min;
        uint256 deadline;
        address token0;
        address token1;
    }

    function mint(MintParams calldata params)
        external
        returns (uint256 tokenId, uint128 liquidity, uint256 amount0, uint256 amount1);
    function decreaseLiquidity(DecreaseLiquidityParams calldata params)
        external
        returns (uint256 amount0, uint256 amount1);
}

interface IFarmingCenter {
    struct Deposit {
        uint256 L2TokenId;
        uint32 numberOfFarms;
        bool inLimitFarming;
        address owner;
    }

    struct IncentiveKey {
        address rewardToken;
        address bonusRewardToken;
        address pool;
        uint256 nonce;
    }

    function deposits(uint256 tokenId) external view returns (Deposit memory);
    function enterFarming(IncentiveKey memory key, uint256 tokenId, uint256 tokensLocked, bool isLimit) external;
    function exitFarming(IncentiveKey memory key, uint256 tokenId, bool isLimit) external;
    function collectRewards(
        IncentiveKey memory key,
        uint256 tokenId
    )
        external
        returns (uint256 reward, uint256 bonusReward);
    function withdrawToken(uint256 tokenId, address to, bytes memory data) external;
}

// Minimal interfaces - only what we use
interface IRouter {
    function splitPosition(address collateralToken, address market, uint256 amount) external;
}

/**
 * @title Zap
 * @author SeerSwap
 * @notice Immutable contract for atomic liquidity provision and farming for prediction markets.
 * @dev KISS - Keep It Simple Stupid. Following Kleros guidelines.
 */
contract Zap {
    // Immutable storage
    IRouter public immutable router;
    INonfungiblePositionManager public immutable positionManager;
    IFarmingCenter public immutable farmingCenter;
    address public immutable rewardToken;

    /**
     * @notice Constructor sets immutable addresses.
     * @param _router Seer router for splitting positions.
     * @param _positionManager Algebra position manager for minting.
     * @param _farmingCenter Farming center for staking (optional).
     * @param _rewardToken Reward token for farming (optional).
     */
    constructor(address _router, address _positionManager, address _farmingCenter, address _rewardToken) {
        router = IRouter(_router);
        positionManager = INonfungiblePositionManager(_positionManager);
        farmingCenter = IFarmingCenter(_farmingCenter);
        rewardToken = _rewardToken;
    }

    function zap(
        IERC20 collateralToken,
        address market,
        uint256 splitAmount,
        uint256 totalAmount,
        INonfungiblePositionManager.MintParams[] calldata mintParams,
        IFarmingCenter.IncentiveKey[] calldata keys
    )
        external
        returns (uint256[] memory tokenIds)
    {
        collateralToken.transferFrom(msg.sender, address(this), totalAmount);
        collateralToken.approve(address(router), splitAmount);
        router.splitPosition(address(collateralToken), market, splitAmount);

        // Add liquidity and stake
        uint256 paramsLength = mintParams.length;
        tokenIds = new uint256[](paramsLength);
        for (uint256 i; i < paramsLength; i++) {
            // Mint position
            (uint256 tokenId,,,) = positionManager.mint(mintParams[i]);
            tokenIds[i] = tokenId;

            // Approve and stake into farming
            IERC721(address(positionManager)).approve(address(farmingCenter), tokenId);
            // send the NFT to the farming center
            IERC721(address(positionManager)).transferFrom(address(this), address(farmingCenter), tokenId);
            uint256 l2TokenId = farmingCenter.deposits(tokenId).L2TokenId;
            farmingCenter.enterFarming(keys[i], tokenIds[i], 0, false);
            // transfer to msg.sender
            IERC721(address(farmingCenter)).transferFrom(address(this), msg.sender, l2TokenId);
        }
        // return excess collateral to msg.sender
        collateralToken.transfer(msg.sender, collateralToken.balanceOf(address(this)));
        // due to slippage we might have some extra outcome token dust in zap, ignore for now
    }

    function unzap(
        IFarmingCenter.IncentiveKey[] memory keys,
        uint256[] calldata tokenIds,
        INonfungiblePositionManager.DecreaseLiquidityParams[] calldata params
    )
        external
    {
        // before unzapping: approval all farming nfts to zap contract
        // after unzapping: remove approval all farming nfts to zap contract
        for (uint256 i; i < tokenIds.length; i++) {
            // transfer tokenIds[i] farming l2 nft to zap from msg.sender
            farmingCenter.collectRewards(keys[i], tokenIds[i]);
            uint256 l2TokenId = farmingCenter.deposits(tokenIds[i]).L2TokenId;
            IERC721(address(farmingCenter)).transferFrom(msg.sender, address(this), l2TokenId);
            farmingCenter.exitFarming(keys[i], tokenIds[i], false);
            // withdraw tokenId from farming center
            farmingCenter.withdrawToken(tokenIds[i], address(this), "");
            // decrease liquidity from position manager
            (uint256 amount0, uint256 amount1) = positionManager.decreaseLiquidity(params[i]);
            // transfer amount0 and amount1 to msg.sender
            IERC20(params[i].token0).transfer(msg.sender, amount0);
            IERC20(params[i].token1).transfer(msg.sender, amount1);
        }
        // after claim reward from eoa or batch 7702
    }
}
