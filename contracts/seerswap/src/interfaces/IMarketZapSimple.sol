// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

/**
 * @title IMarketZapSimple
 * @notice Minimal interface for MarketZapSimple contract.
 */
interface IMarketZapSimple {
    /**
     * @notice Execute zap into market and optionally stake into farms.
     * @param market Market to zap into.
     * @param collateralToken Collateral token.
     * @param splitAmount Amount to split.
     * @param pools Pool addresses.
     * @param minLiquidities Minimum liquidities.
     * @param slippageBps Slippage tolerance.
     * @param deadline Transaction deadline.
     * @param rewardTokens Reward token for each pool (address(0) to skip).
     * @param endTimes End time for each farm.
     * @return tokenIds Created NFT IDs.
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
    ) external returns (uint256[] memory tokenIds);
    
    /**
     * @notice Check if pool is whitelisted.
     * @param pool Pool address.
     * @return Whether pool is whitelisted.
     */
    function whitelistedPools(address pool) external view returns (bool);
}