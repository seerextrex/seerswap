// SPDX-License-Identifier: BUSL-1.1
pragma solidity =0.7.6;

import '@cryptoalgebra/v1.9-core/contracts/libraries/TickManager.sol';

import '@cryptoalgebra/v1.9-core/contracts/libraries/FullMath.sol';
import '@cryptoalgebra/v1.9-core/contracts/libraries/Constants.sol';
import '@cryptoalgebra/v1.9-core/contracts/libraries/LowGasSafeMath.sol';

import './interfaces/IAlgebraEternalVirtualPool.sol';

import '../AlgebraVirtualPoolBase.sol';

contract EternalVirtualPool is AlgebraVirtualPoolBase, IAlgebraEternalVirtualPool {
    using TickManager for mapping(int24 => TickManager.Tick);
    using LowGasSafeMath for uint256;

    uint128 public override rewardRate0;
    uint128 public override rewardRate1;

    uint256 public override rewardReserve0;
    uint256 public override rewardReserve1;

    uint256 public totalRewardGrowth0;
    uint256 public totalRewardGrowth1;

    constructor(
        address _farmingCenterAddress,
        address _farmingAddress,
        address _pool
    ) AlgebraVirtualPoolBase(_farmingCenterAddress, _farmingAddress, _pool) {
        prevTimestamp = uint32(block.timestamp);
    }

    // @inheritdoc IAlgebraEternalVirtualPool
    function rewardReserves() external view override returns (uint256 reserve0, uint256 reserve1) {
        return (rewardReserve0, rewardReserve1);
    }

    /// @inheritdoc IAlgebraEternalVirtualPool
    function rewardRates() external view override returns (uint128 rate0, uint128 rate1) {
        return (rewardRate0, rewardRate1);
    }

    /// @inheritdoc IAlgebraEternalVirtualPool
    function distributeRewards() external override onlyFarming {
        _increaseCumulative(uint32(block.timestamp));
    }

    // @inheritdoc IAlgebraEternalVirtualPool
    function addRewards(uint256 token0Amount, uint256 token1Amount) external override onlyFarming {
        _increaseCumulative(uint32(block.timestamp));
        if (token0Amount > 0) rewardReserve0 = rewardReserve0.add(token0Amount);
        if (token1Amount > 0) rewardReserve1 = rewardReserve1.add(token1Amount);
    }

    // @inheritdoc IAlgebraEternalVirtualPool
    function decreaseRewards(uint256 token0Amount, uint256 token1Amount) external override onlyFarming {
        _increaseCumulative(uint32(block.timestamp));
        if (token0Amount > 0) rewardReserve0 = rewardReserve0.sub(token0Amount);
        if (token1Amount > 0) rewardReserve1 = rewardReserve1.sub(token1Amount);
    }

    // @inheritdoc IAlgebraEternalVirtualPool
    function setRates(uint128 rate0, uint128 rate1) external override onlyFarming {
        _increaseCumulative(uint32(block.timestamp));
        (rewardRate0, rewardRate1) = (rate0, rate1);
    }

    // @inheritdoc IAlgebraEternalVirtualPool
    function getInnerRewardsGrowth(
        int24 bottomTick,
        int24 topTick
    ) external view override returns (uint256 rewardGrowthInside0, uint256 rewardGrowthInside1) {
        return ticks.getInnerFeeGrowth(bottomTick, topTick, globalTick, totalRewardGrowth0, totalRewardGrowth1);
    }

    function _crossTick(int24 nextTick) internal override returns (int128 liquidityDelta) {
        return ticks.cross(nextTick, totalRewardGrowth0, totalRewardGrowth1, globalSecondsPerLiquidityCumulative, 0, 0);
    }

    function _increaseCumulative(uint32 currentTimestamp) internal override returns (Status) {
        uint256 timeDelta = currentTimestamp - prevTimestamp; // safe until timedelta > 136 years
        if (timeDelta == 0) return Status.ACTIVE; // only once per block

        uint256 _currentLiquidity = currentLiquidity; // currentLiquidity is uint128
        if (_currentLiquidity > 0) {
            (uint256 _rewardRate0, uint256 _rewardRate1) = (rewardRate0, rewardRate1);
            uint256 _rewardReserve0 = _rewardRate0 > 0 ? rewardReserve0 : 0;
            uint256 _rewardReserve1 = _rewardRate1 > 0 ? rewardReserve1 : 0;

            if (_rewardReserve0 > 0) {
                uint256 reward0 = _rewardRate0 * timeDelta;
                if (reward0 > _rewardReserve0) reward0 = _rewardReserve0;
                rewardReserve0 = _rewardReserve0 - reward0;
                totalRewardGrowth0 += FullMath.mulDiv(reward0, Constants.Q128, _currentLiquidity);
            }

            if (_rewardReserve1 > 0) {
                uint256 reward1 = _rewardRate1 * timeDelta;
                if (reward1 > _rewardReserve1) reward1 = _rewardReserve1;
                rewardReserve1 = _rewardReserve1 - reward1;
                totalRewardGrowth1 += FullMath.mulDiv(reward1, Constants.Q128, _currentLiquidity);
            }
            globalSecondsPerLiquidityCumulative += (uint160(timeDelta) << 128) / uint160(_currentLiquidity);
            prevTimestamp = currentTimestamp; // duplicated for gas optimization
        } else {
            timeOutside += uint32(timeDelta);
            prevTimestamp = currentTimestamp; // duplicated for gas optimization
        }

        return Status.ACTIVE;
    }

    function _updateTick(
        int24 tick,
        int24 currentTick,
        int128 liquidityDelta,
        bool isTopTick
    ) internal override returns (bool updated) {
        return
            ticks.update(tick, currentTick, liquidityDelta, totalRewardGrowth0, totalRewardGrowth1, 0, 0, 0, isTopTick);
    }
}
