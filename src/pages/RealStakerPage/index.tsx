import { Helmet } from 'react-helmet'
import { useCurrency } from '../../hooks/Tokens'
import useDebouncedChangeHandler from '../../hooks/useDebouncedChangeHandler'
import { useBurnV3ActionHandlers, useBurnV3State } from '../../state/burn/v3/hooks'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import RealStakerInputRange from './RealStakerInputRange'
import RealStakerRangeButtons from './RealStakerRangeButtons'
import RealStakerResBlocks from './RealStakerResBlocks'
import { NavLink } from 'react-router-dom'
import { useCurrencyBalance } from '../../state/wallet/hooks'
import { useActiveWeb3React } from '../../hooks/web3'
import { useRealStakerHandlers } from '../../hooks/useRealStaker'
import { ApprovalState, useApproveCallback } from '../../hooks/useApproveCallback'
import { REAL_STAKER_ADDRESS } from '../../constants/addresses'
import Loader from '../../components/Loader'
import { useInfoSubgraph } from '../../hooks/subgraph/useInfoSubgraph'
import { BigNumber } from 'ethers'
import { formatEther, formatUnits, parseUnits } from 'ethers/lib/utils'
import RealStakerUnstakeModal from './RealStakerUnstakeModal'
import { useUSDCValue } from '../../hooks/useUSDCPrice'
import { Currency, CurrencyAmount } from '@uniswap/sdk-core'
import { tryParseAmount } from '../../state/swap/hooks'
import { useWalletModalToggle } from '../../state/application/hooks'
import { isArray } from 'util'
import { ArrowDown, ArrowUp, RefreshCw } from 'react-feather'
import Frozen from './Frozen'
import {
  RealStakerPageWrapper,
  PageWrapper,
  StakeTitle,
  SilderWrapper,
  StakerSlider,
  EarnedStakedWrapper,
  StakerStatisticWrapper,
  ResBlocksTitle,
  ResBlocksWrapper,
  ReloadButton,
  FrozenDropDown,
  LeftBlock,
  RightBlock,
  XALGBCousreWrapper,
  XALGBBalance,
  XALGBCourse,
  StakeButton
} from './styled'

export default function RealStakerPage({}) {
  const currencyId = '0x0169eC1f8f639B32Eec6D923e24C2A2ff45B9DD6'
  const { chainId, account } = useActiveWeb3React()
  const { percent } = useBurnV3State()
  const { onPercentSelect } = useBurnV3ActionHandlers()
  const {
    stakerHandler,
    stakerClaimHandler,
    stakerUnstakeHandler,
    frozenStakedHandler,
    frozenStaked
  } = useRealStakerHandlers()
  const { getStakes: { stakesResult, fetchStakingFn } } = useInfoSubgraph()
  const toggleWalletModal = useWalletModalToggle()
  const baseCurrency = useCurrency(currencyId)

  //balances
  const balance = useCurrencyBalance(account ?? undefined, baseCurrency ?? undefined)
  const _balance = useMemo(() => !balance ? '' : balance.toSignificant(4), [balance])
  const numBalance = useMemo(() => !balance ? 0 : balance, [balance])

  const [percentForSlider, onPercentSelectForSlider] = useDebouncedChangeHandler(percent, onPercentSelect)
  const [unstakePercent, setUnstakePercent] = useState(0)
  const [openModal, setOpenModal] = useState(false)
  const [amountValue, setAmountValue] = useState('')
  const [earned, setEarned] = useState(BigNumber.from('0'))
  const [staked, setStaked] = useState(BigNumber.from('0'))
  const [unstaked, setUnstaked] = useState('')
  const [unstakeAmount, setUnstakeAmount] = useState(BigNumber.from('0'))
  const [algbCourse, setAlbgCourse] = useState(BigNumber.from('0'))
  const [algbCourseShow, setAlbgCourseShow] = useState('1')
  const [xALGBBalance, setXALGB] = useState('')
  const [showFrozen, setFrozen] = useState(false)
  const [loadingClaim, setLoadingClaim] = useState(false)

  const now = Date.now

  const [approval, approveCallback] = useApproveCallback(balance, chainId ? REAL_STAKER_ADDRESS[chainId] : undefined)
  const valueAmount: CurrencyAmount<Currency> | undefined = tryParseAmount(amountValue.toString(), baseCurrency ?? undefined)
  const earnedAmount: CurrencyAmount<Currency> | undefined = tryParseAmount(formatEther(earned), baseCurrency ?? undefined)
  const stakedAmount: CurrencyAmount<Currency> | undefined = tryParseAmount(formatEther(staked), baseCurrency ?? undefined)
  const unstakedAmount: CurrencyAmount<Currency> | undefined = tryParseAmount(unstaked.toString(), baseCurrency ?? undefined)

  const fiatValue = useUSDCValue(valueAmount)
  const fiatValueEarned = useUSDCValue(earnedAmount)
  const fiatValueStaked = useUSDCValue(stakedAmount)
  const fiatUnstakedAmount = useUSDCValue(unstakedAmount)

  const reloadClaim = useCallback(() => {
    if (!account) return
    setLoadingClaim(true)
    fetchStakingFn(account.toLowerCase())
      .then(() => {
        frozenStakedHandler(account)
      })
      .then(() => {
        setLoadingClaim(false)
      })
  }, [account])

  const allFreeze = useMemo(() => {
    if (typeof stakesResult === 'string') return

    if (!isArray(frozenStaked) || !stakesResult?.factories) return

    const formatedData = frozenStaked.map((el) => {
      if (!el.xALGBAmount) return

      return BigNumber.from(el?.xALGBAmount)
        .mul(BigNumber.from(stakesResult.factories[0]?.ALGBbalance))
        .div(BigNumber.from(stakesResult.factories[0]?.xALGBtotalSupply))
    })

    return formatedData.reduce((prev, cur) => prev?.add(cur), BigNumber.from('0'))
  }, [frozenStaked, account, stakesResult])

  const allFreezeArr = useMemo(() => {
    if (typeof stakesResult === 'string') return

    if (!isArray(frozenStaked) || !stakesResult?.factories) return

    return frozenStaked?.map(el => {
      if (!el.xALGBAmount) return

      return BigNumber.from(el?.xALGBAmount)
        .mul(BigNumber.from(stakesResult?.factories[0]?.ALGBbalance))
        .div(BigNumber.from(stakesResult?.factories[0]?.xALGBtotalSupply))
    })
  }, [frozenStaked, account, stakesResult])

  const allXALGBFreeze = useMemo(() => {
    if (typeof stakesResult === 'string') return

    if (!isArray(frozenStaked) || !stakesResult?.factories) return

    const formatedData = frozenStaked?.map(el => BigNumber.from(el?.xALGBAmount))

    return formatedData.reduce((prev, cur) => prev.add(cur), BigNumber.from('0'))
  }, [frozenStaked, account, stakesResult])

  const stakedFreeze = useMemo(() => {
    if (!isArray(frozenStaked)) return

    const formatedData = frozenStaked?.map(el => BigNumber.from(el?.stakedALGBAmount))

    return formatedData.reduce((prev, cur) => prev.add(cur), BigNumber.from('0'))
  }, [frozenStaked, account])

  const stakedFreezeArr = useMemo(() => {
    if (!isArray(frozenStaked)) return

    return frozenStaked?.map(el => BigNumber.from(el?.stakedALGBAmount))
  }, [frozenStaked, account])

  const earnedFreezeArr = useMemo(() => {
    if (!allFreezeArr || !stakedFreezeArr) return

    const res = [BigNumber.from('0')]

    for (let i = 0; i < allFreezeArr.length; i++) {
      res.push(allFreezeArr[i].sub(stakedFreezeArr[i]))
    }
    return res
  }, [allFreezeArr, stakedFreezeArr])

  const earnedFreeze = useMemo(() => {
    if (!allFreeze || !stakedFreeze) return

    return allFreeze.sub(stakedFreeze)
  }, [allFreeze, stakedFreeze])

  useEffect(() => {
    if (!account) return

    fetchStakingFn(account.toLowerCase())
    frozenStakedHandler(account.toLowerCase())

    if (+_balance === 0) {
      onPercentSelectForSlider(0)
    }

  }, [account, _balance])

  //calc amount when choose range in slider
  useEffect(() => {
    if (!numBalance) return

    if (percentForSlider === 0) {
      setAmountValue('')
    } else if (percentForSlider === 100) {
      setAmountValue(numBalance?.toSignificant(30))
    } else {
      setAmountValue(formatEther(parseUnits(numBalance?.toSignificant(4), 18).div(BigNumber.from('100')).mul(percentForSlider)))
    }
  }, [percentForSlider])

  //calc unstakeAmount when choose range in slider
  useEffect(() => {
    if (unstakePercent === 0) {
      setUnstaked('')
    } else if (unstakePercent === 100) {
      setUnstaked(formatUnits(BigNumber.from(unstakeAmount), 18))
    } else {
      setUnstaked(formatUnits(BigNumber.from(unstakeAmount).div(100).mul(unstakePercent), 18))
    }
  }, [unstakePercent])

  //calc staked, earned, algbCourse
  useEffect(() => {
    if (!stakesResult || stakesResult === 'failed' || !earnedFreeze || !stakedFreeze) return

    if (+(stakesResult.factories[0].xALGBtotalSupply) !== 0) {

      setEarned(
        BigNumber.from(stakesResult.stakes[0]?.xALGBAmount || '0')
          .mul(BigNumber.from(stakesResult.factories[0].ALGBbalance))
          .div(BigNumber.from(stakesResult.factories[0].xALGBtotalSupply))
          .sub(BigNumber.from(stakesResult.stakes[0]?.stakedALGBAmount || '0'))
          .sub(earnedFreeze)
      )
    }

    if (+stakesResult?.factories[0].xALGBtotalSupply !== 0) {
      setAlbgCourseShow(stakesResult.factories[0].ALGBbalance / stakesResult.factories[0].xALGBtotalSupply)
      setAlbgCourse(
        BigNumber.from(stakesResult.factories[0].ALGBbalance)
          .div(BigNumber.from(stakesResult.factories[0].xALGBtotalSupply))
      )
    }

    if (!stakesResult?.stakes[0]) {
      return setStaked(BigNumber.from('0'))
    }
    const xALGBSplit = formatUnits(BigNumber.from(stakesResult?.stakes[0].xALGBAmount), 18).split('.')
    setXALGB(`${xALGBSplit[0]}.${xALGBSplit[1].slice(0, 3)}`)
    setStaked(BigNumber.from(stakesResult?.stakes[0]?.stakedALGBAmount).sub(stakedFreeze))
  }, [stakesResult, stakedFreeze, earnedFreeze])

  //calc unstake amount
  useEffect(() => {
    setUnstakeAmount(staked.add(earned))
  }, [staked, earned])

  //stake handler invoked from keyboard
  const enterHandler = useCallback((e) => {
    if (e.charCode === 13) {
      if (!balance) return
      if (!(+amountValue > +balance?.toSignificant(4))) {
        stakerHandler(amountValue)
        onPercentSelectForSlider(0)
        if (percentForSlider === 0) {
          setAmountValue('')
        }
      }
    }
  }, [amountValue])

  return (
    <RealStakerPageWrapper>
      <Helmet>
        <title>Algebra — Staking</title>
      </Helmet>
      <PageWrapper onKeyPress={(e) => enterHandler(e)}>
        <StakeTitle>Stake ALGB</StakeTitle>
        <RealStakerInputRange
          amountValue={amountValue}
          setAmountValue={setAmountValue}
          baseCurrency={baseCurrency}
          fiatValue={fiatValue}
        />
        {numBalance == 0 && balance ? (
          <NavLink to={''} style={{ textDecoration: 'none' }}>
            <StakeButton>BUY ALGB</StakeButton>
          </NavLink>
        ) : (
          <>
            <SilderWrapper>
              <StakerSlider value={percentForSlider} onChange={onPercentSelectForSlider} size={22}
                            disabled={+_balance === 0} />
            </SilderWrapper>
            <RealStakerRangeButtons onPercentSelect={onPercentSelect} showCalculate={false}
                                    balance={_balance} />
            {approval === ApprovalState.NOT_APPROVED ? (
              <StakeButton onClick={approveCallback}>Approve token</StakeButton>
            ) : approval === ApprovalState.UNKNOWN && account === null ? (
              <StakeButton onClick={toggleWalletModal}>Connect to a wallet</StakeButton>
            ) : approval === ApprovalState.UNKNOWN ? (
              <StakeButton>
                <Loader stroke={'white'} size={'19px'} />
              </StakeButton>
            ) : approval === ApprovalState.APPROVED ? (
              <StakeButton
                onClick={() => {
                  stakerHandler(amountValue)
                    .then(() => {
                      onPercentSelectForSlider(0)
                      if (percentForSlider === 0) {
                        setAmountValue('')
                      }
                    })
                }}
                disabled={balance && (+amountValue > +balance.toSignificant(30)) || amountValue === ''}
              >
                {balance && (+amountValue > +balance.toSignificant(30)) ? 'Insufficient ALGB balance' : 'Stake'}
              </StakeButton>
            ) : <StakeButton>
              <Loader stroke={'white'} size={'19px'} />
            </StakeButton>}
          </>
        )}
      </PageWrapper>
      <EarnedStakedWrapper>
        <ResBlocksTitle>
          <LeftBlock>
            <h3>Balance</h3>
          </LeftBlock>
          <RightBlock>
            {
              frozenStaked?.length !== 0 &&
              <FrozenDropDown onClick={() => {
                setFrozen(!showFrozen)
              }}>
                {!allFreeze ? <Loader size={'16px'} stroke={'white'} /> :

                  `${+(+formatEther(allFreeze || BigNumber.from('0'))).toFixed(2) < 0.01 ? '<' : ''} ${(+formatEther(allFreeze)).toFixed(2)}`} ALGB

                  Frozen {showFrozen ? <ArrowUp size={'16px'} /> : <ArrowDown size={'16px'} />}
              </FrozenDropDown>
            }
            <ReloadButton disabled={loadingClaim} onClick={reloadClaim} refreshing={loadingClaim}>
              <RefreshCw style={{ display: 'block' }} size={18} stroke={'white'} />
            </ReloadButton>
          </RightBlock>
          {showFrozen && frozenStaked.length !== 0 && typeof frozenStaked !== 'string' && frozenStaked.some(el => +Math.floor(el.timestamp * 1000) > now()) ?
            <Frozen data={frozenStaked} earnedFreeze={earnedFreezeArr} now={now} /> : null}
        </ResBlocksTitle>
        <ResBlocksWrapper>
          <RealStakerResBlocks
            action={'Claim'}
            currency={fiatValueEarned}
            amount={earned}
            title={'EARNED'}
            handler={() => {
              stakerClaimHandler(earned, stakesResult)
            }}
            algbCourse={algbCourse}
          />
          <RealStakerResBlocks
            action={'Unstake'}
            currency={fiatValueStaked}
            amount={staked}
            title={'STAKED'}
            handler={() => {
              setOpenModal(true)
            }}
            algbCourse={algbCourse}
          />
        </ResBlocksWrapper>
        <XALGBCousreWrapper>
          <XALGBBalance>{!account ? '' : `You have ${xALGBBalance} xALGB`}</XALGBBalance>
          <XALGBCourse>1 xALGB = {(+algbCourseShow).toFixed(2)} ALGB</XALGBCourse>
        </XALGBCousreWrapper>
      </EarnedStakedWrapper>
      <StakerStatisticWrapper to={'staking/analytics'}>
        <div>
          <h2>Statistics</h2>
          <p>Minted / Staked Amount / Total Supply →</p>
        </div>
      </StakerStatisticWrapper>
      <RealStakerUnstakeModal
        openModal={openModal}
        setOpenModal={setOpenModal}
        unstakePercent={unstakePercent}
        setUnstakePercent={setUnstakePercent}
        setUnstaked={setUnstaked}
        unstaked={unstaked}
        baseCurrency={unstakeAmount}
        onPercentSelect={setUnstakePercent}
        stakedResult={stakesResult}
        unstakeHandler={stakerUnstakeHandler}
        fiatValue={fiatUnstakedAmount}
        allXALGBFreeze={allXALGBFreeze}
      />
    </RealStakerPageWrapper>
  )
}
