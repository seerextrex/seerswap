// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

/// @title ZapMath Library
/// @notice Mathematical calculations for optimal zapping into prediction markets
library ZapMath {
    uint256 internal constant Q96 = 2**96;
    uint256 internal constant SCALE = 1e18;
    
    /// @notice Calculate the price ratio from sqrtPriceX96
    /// @param sqrtPriceX96 The square root price as a Q64.96
    /// @param isToken0Outcome Whether token0 is the outcome token
    /// @return ratio The price ratio scaled by 1e18
    function calculatePriceRatio(
        uint160 sqrtPriceX96,
        bool isToken0Outcome
    ) internal pure returns (uint256 ratio) {
        // Calculate price = (sqrtPriceX96)^2 / 2^192
        uint256 sqrtPriceSquared = uint256(sqrtPriceX96) * uint256(sqrtPriceX96);
        uint256 priceScaled = (sqrtPriceSquared * SCALE) / (Q96 * Q96);
        
        if (isToken0Outcome) {
            // token0 is outcome, token1 is collateral
            // Price represents collateral/outcome
            ratio = priceScaled;
        } else {
            // token0 is collateral, token1 is outcome
            // Price represents outcome/collateral
            // We need the inverse: collateral/outcome
            ratio = priceScaled == 0 ? SCALE : (SCALE * SCALE) / priceScaled;
        }
    }
    
    /// @notice Calculate collateral needed for a given outcome amount
    /// @param outcomeAmount Amount of outcome tokens
    /// @param priceRatio Price ratio (collateral/outcome) scaled by 1e18
    /// @return collateralAmount Amount of collateral needed
    function calculateCollateralNeeded(
        uint256 outcomeAmount,
        uint256 priceRatio
    ) internal pure returns (uint256 collateralAmount) {
        collateralAmount = (outcomeAmount * priceRatio) / SCALE;
    }
    
    /// @notice Calculate minimum amounts with slippage protection
    /// @param desiredAmount The desired amount
    /// @param slippageBasisPoints Slippage tolerance in basis points (e.g., 50 = 0.5%)
    /// @return minAmount The minimum acceptable amount
    function calculateMinimumAmount(
        uint256 desiredAmount,
        uint256 slippageBasisPoints
    ) internal pure returns (uint256 minAmount) {
        require(slippageBasisPoints < 10000, "Invalid slippage");
        minAmount = (desiredAmount * (10000 - slippageBasisPoints)) / 10000;
    }
}