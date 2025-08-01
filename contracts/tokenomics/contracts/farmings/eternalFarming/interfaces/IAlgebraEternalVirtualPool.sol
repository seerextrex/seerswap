// SPDX-License-Identifier: GPL-2.0-or-later
pragma solidity >=0.7.5;
pragma abicoder v2;

import '../../IAlgebraVirtualPoolBase.sol';

interface IAlgebraEternalVirtualPool is IAlgebraVirtualPoolBase {
    /// @notice Get reserves of rewards in one call
    /// @return reserve0 The reserve of token0
    /// @return reserve1 The reserve of token1
    function rewardReserves() external view returns (uint256 reserve0, uint256 reserve1);

    /// @notice Get rates of rewards in one call
    /// @return rate0 The rate of token0, rewards / sec
    /// @return rate1 The rate of token1, rewards / sec
    function rewardRates() external view returns (uint128 rate0, uint128 rate1);

    /// @notice Change reward rates
    /// @param rate0 The new rate of main token distribution per sec
    /// @param rate1 The new rate of bonus token distribution per sec
    function setRates(uint128 rate0, uint128 rate1) external;

    /// @dev This function is called from the farming contract to update rewards for users
    function distributeRewards() external;

    function addRewards(uint256 token0Amount, uint256 token1Amount) external;

    function decreaseRewards(uint256 token0Amount, uint256 token1Amount) external;

    function getInnerRewardsGrowth(
        int24 bottomTick,
        int24 topTick
    ) external view returns (uint256 rewardGrowthInside0, uint256 rewardGrowthInside1);

    function rewardRate0() external returns (uint128);

    function rewardRate1() external returns (uint128);

    function rewardReserve0() external returns (uint256);

    function rewardReserve1() external returns (uint256);
}
