// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "../../swapr/periphery/contracts/interfaces/INonfungiblePositionManager.sol";
import "../../swapr/core/contracts/interfaces/IAlgebraPool.sol";
import "../../swapr/tokenomics/contracts/interfaces/IFarmingCenter.sol";

// Minimal interfaces - only what we use
interface IRouter {
    function splitPosition(address collateralToken, address market, uint256 amount) external;
}

/**
 * @title MarketZapSimple
 * @author SeerSwap
 * @notice Immutable contract for atomic liquidity provision and farming for prediction markets.
 * @dev KISS - Keep It Simple Stupid. Following Kleros guidelines.
 */
contract MarketZapSimple {
    // Immutable storage
    IRouter public immutable router;
    IPositionManager public immutable positionManager;
    IFarmingCenter public immutable farmingCenter;
    address public immutable rewardToken;

    mapping(uint256 => address) public owner;

    // Errors
    error Unauthorized();
    error InvalidPool();
    error InvalidAmount();
    error DeadlineExpired();
    error InsufficientTokens();

    // Events
    event Zapped(address indexed sender, address indexed market, uint256[] tokenIds);

    /**
     * @notice Constructor sets immutable addresses.
     * @param _router Seer router for splitting positions.
     * @param _positionManager Algebra position manager for minting.
     * @param _farmingCenter Farming center for staking (optional).
     * @param _rewardToken Reward token for farming (optional).
     */
    constructor(address _router, address _positionManager, address _farmingCenter, address _rewardToken) {
        router = IRouter(_router);
        positionManager = IPositionManager(_positionManager);
        farmingCenter = IFarmingCenter(_farmingCenter);
        rewardToken = _rewardToken;
    }

    function zap(
        IERC20 collateralToken,
        uint256 splitAmount,
        INonfungiblePositionManager.MintParams[] calldata params,
        uint256 startTime,
        uint256 endTime
    )
        external
        returns (uint256[] memory tokenIds)
    {
        collateralToken.transferFrom(msg.sender, address(this), splitAmount);
        collateralToken.approve(address(router), splitAmount);
        router.splitPosition(collateralToken, splitAmount);

        // Add liquidity and stake
        uint256 paramsLength = params.length;
        tokenIds = new uint256[](paramsLength);
        for (uint256 i; i < paramsLength; i++) {
            // Mint position
            (uint256 tokenId,,,) = positionManager.mint(params[i]);
            tokenIds[i] = tokenId;

            // Approve and stake into farming
            IERC721(address(positionManager)).approve(address(farmingCenter), tokenId);
            // send the NFT to the farming center
            IERC721(address(positionManager)).transferFrom(address(this), address(farmingCenter), tokenId);
            uint256 l2TokenId = farmingCenter.deposits(tokenId).L2TokenId;
            // transfer all farming l2 nfts to msg.sender
            IERC721(address(farmingCenter)).transferFrom(address(farmingCenter), msg.sender, l2TokenId);
        }
    }

    function enterFarming(
        IncentiveKey[] memory keys,
        uint256[] calldata tokenIds,
        uint256 startTime,
        uint256 endTime
    )
        external
    {
        // must approve all tokens to the farming center
        for (uint256 i; i < tokenIds.length; i++) {
            farmingCenter.enterFarming(keys[i], tokenIds[i], 0, false);
        }
    }

    function exitFarming(IncentiveKey[] memory keys, uint256[] calldata tokenIds) external {
        for (uint256 i; i < tokenIds.length; i++) {
            farmingCenter.exitFarming(keys[i], tokenIds[i], false);
        }
    }

    function collectRewards(IncentiveKey[] memory keys, uint256[] calldata tokenIds) external {
        for (uint256 i; i < tokenIds.length; i++) {
            farmingCenter.collectRewards(keys[i], tokenIds[i]);
        }
    }

    function claimRewards(IncentiveKey[] memory keys, uint256[] calldata tokenIds) external {
        for (uint256 i; i < tokenIds.length; i++) {
            farmingCenter.claimRewards(keys[i], tokenIds[i]);
        }
    }
}
