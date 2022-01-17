import styled, {keyframes} from 'styled-components/macro'
import {Helmet} from 'react-helmet'
import {useCurrency} from '../../hooks/Tokens'
import Slider from '../../components/Slider'
import useDebouncedChangeHandler from '../../hooks/useDebouncedChangeHandler'
import {useBurnV3ActionHandlers, useBurnV3State} from '../../state/burn/v3/hooks'
import {ButtonConfirmed} from '../../components/Button'
import React, {useCallback, useEffect, useMemo, useState} from 'react'
import RealStakerInputRange from './RealStakerInputRange'
import RealStakerRangeButtons from './RealStakerRangeButtons'
import RealStakerResBlocks from './RealStakerResBlocks'
import {NavLink} from 'react-router-dom'
import StakerStatistic from '../../assets/images/StakerStatisticBackground.svg'
import {useCurrencyBalance} from '../../state/wallet/hooks'
import {useActiveWeb3React} from '../../hooks/web3'
import {useRealStakerHandlers} from '../../hooks/useRealStaker'
import {ApprovalState, useApproveCallback} from '../../hooks/useApproveCallback'
import {REAL_STAKER_ADDRESS} from '../../constants/addresses'
import Loader from '../../components/Loader'
import {ALGEBRA_POLYGON} from '../../constants/tokens'
import {useInfoSubgraph} from '../../hooks/subgraph/useInfoSubgraph'
import {BigNumber} from 'ethers'
import {formatEther, formatUnits, parseUnits} from 'ethers/lib/utils'
import RealStakerUnstakeModal from './RealStakerUnstakeModal'
import {useUSDCValue} from '../../hooks/useUSDCPrice'
import {Currency, CurrencyAmount} from '@uniswap/sdk-core'
import {tryParseAmount} from '../../state/swap/hooks'
import {useAllTransactions} from '../../state/transactions/hooks'
import {useWalletModalToggle} from '../../state/application/hooks'
import {isArray} from "util"
import {ArrowDown, ArrowUp, RefreshCw} from "react-feather"
import Frozen from "./Frozen"
import {darken} from "polished"

const PageWrapper = styled.div`
  min-width: ${(props) => props.width};
  background-color: #202635;
  border-radius: 16px;
  padding: 26px 30px 27px;

  ${({theme}) => theme.mediaWidth.upToSmall`
    min-width: 100%;
  `}
`
const StakeTitle = styled.h1`
  width: 100%;
  margin: 0;
  font-size: 20px;
`
export const SilderWrapper = styled.div`
  width: 100%;
  margin: 0;
`
export const StakerSlider = styled(Slider)`
  &::-webkit-slider-runnable-track {
    background: #4a5982;
    height: 5px;
    border-radius: 20px;
  }

  &::-moz-range-track {
    background: #4a5982;
    height: 5px;
    border-radius: 20px;
  }

  &::-moz-range-progress {
    background-color: #5d32ed;
    height: 5px;
    border-radius: 20px;
  }

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    height: ${({size}) => size}px;
    width: ${({size}) => size}px;
    background-color: #2e3957;
    border-radius: 100%;
    border: 7px solid #6f86c9;
    transform: translateY(-50%);
    color: ${({theme}) => theme.bg1};

    &:hover,
    &:focus {
      box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.1), 0px 4px 8px rgba(0, 0, 0, 0.08), 0px 16px 24px rgba(0, 0, 0, 0.06),
      0px 24px 32px rgba(0, 0, 0, 0.04);
    }
  }

  &::-moz-range-thumb {
    height: ${({size}) => size}px;
    width: ${({size}) => size}px;
    background-color: #2e3957;
    border-radius: 100%;
    border: 7px solid #6f86c9;
    color: ${({theme}) => theme.bg1};

    &:hover,
    &:focus {
      box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.1), 0px 4px 8px rgba(0, 0, 0, 0.08), 0px 16px 24px rgba(0, 0, 0, 0.06),
      0px 24px 32px rgba(0, 0, 0, 0.04);
    }
  }
`
export const StakeButton = styled(ButtonConfirmed)`
  border-radius: 8px !important;
  width: 100%;
  margin-top: 24px;

  ${({theme}) => theme.mediaWidth.upToSmall`
    margin-top: 0;
  `}
`
const EarnedStakedWrapper = styled.div`
  margin: 27px 0;
  min-width: ${(props) => props.width};
  background-color: #202635;
  padding: 25px 33px 30px;
  border-radius: 16px;

  ${({theme}) => theme.mediaWidth.upToSmall`
    min-width: 100%;
    display: flex;
    flex-direction: column;
  `}
`
const StakerStatisticWrapper = styled(NavLink)`
  position: relative;
  min-width: 765px;
  height: 107px;
  text-decoration: none;

  h2,
  p {
    color: white;
    text-decoration: none;
    margin: 0 0 0 27px;
    font-size: 16px;
  }

  h2 {
    margin: 17px 0 6px 27px;
    font-size: 20px;
    font-weight: 600;
  }

  ${({theme}) => theme.mediaWidth.upToSmall`
    min-width: 100%;
    display: flex;
    align-items: center;
    height: unset;
    padding: 15px 20px;
    
    img {
        height: unset;
    }
    
    h2,p {
        margin: 0 10px;
        z-index: 10;
    }
  `}
`
const StakerStatisticBackground = styled.img`
  height: 107px;
  width: 100%;
  position: absolute;
  left: 0;
  top: 0;
`
const ResBlocksTitle = styled.div`
  margin-bottom: 25px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;

  h3 {
    margin: 0;
  }
`
const ResBlocksWrapper = styled.div`
  display: flex;
  justify-content: space-between;

  ${({theme}) => theme.mediaWidth.upToSmall`
    flex-direction: column;
  `}
`

const spinAnimation = keyframes`
  100% {
    transform: rotate(360deg);
  }
`

const ReloadButton = styled.button`
  background-color: transparent;
  border: none;
  animation: ${(props) => (props.refreshing ? spinAnimation : '')} infinite 3s;
  cursor: pointer;

  &:disabled {
    opacity: 0.5;
    cursor: default;
  }
`
const FrozenDropDown = styled.button`
  color: white !important;
  display: flex;
  width: 170px;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  background-color: #08537E;
  border: none;
  font-size: 13px;
  padding: 3px 7px 3px 14px;
  border-radius: 5px;

  &:disabled {
    background-color: ${darken(.05, '#08537E')};
    cursor: default;
  }

  ${({theme}) => theme.mediaWidth.upToSmall`
    padding-left: 7px;
    width: 150px;
  `}
`

const LeftBlock = styled.div`
  display: flex;
  align-items: center;
  width: 40%;
  justify-content: space-between;

  ${({theme}) => theme.mediaWidth.upToSmall`
    width: 86%;
  `}
`

export default function RealStakerPage({}) {
    const currencyId = '0x0169eC1f8f639B32Eec6D923e24C2A2ff45B9DD6'
    const {chainId, account} = useActiveWeb3React()
    const {percent} = useBurnV3State()
    const {onPercentSelect} = useBurnV3ActionHandlers()
    const {
        stakerHash,
        stakerHandler,
        stakerClaimHandler,
        stakerUnstakeHandler,
        frozenStakedHandler,
        frozenStaked
    } = useRealStakerHandlers()
    const {
        getStakes: {stakesResult, stakesLoading, fetchStakingFn},
    } = useInfoSubgraph()
    const toggleWalletModal = useWalletModalToggle()

    const baseCurrency = useCurrency(currencyId)

    //balances
    const balance = useCurrencyBalance(account ?? undefined, baseCurrency)

    const _balance = useMemo(() => {
        return balance
    }, [balance])

    const numBalance = useMemo(() => {
        if (!balance) return 0
        return balance
    }, [balance])

    const [percentForSlider, onPercentSelectForSlider] = useDebouncedChangeHandler(percent, onPercentSelect)
    const [unstakePercent, setUnstakePercent] = useState(0)
    const [openModal, setOpenModal] = useState(false)
    const [amountValue, setAmountValue] = useState('')
    const [earned, setEarned] = useState(BigNumber.from('0'))
    const [staked, setStaked] = useState(BigNumber.from('0'))
    const [unstaked, setUnstaked] = useState('')
    const [unstakeAmount, setUnstakeAmount] = useState(0)
    const [algbCourse, setAlbgCourse] = useState(BigNumber.from('0'))
    const [showFrozen, setFrozen] = useState(false)
    const [loadingClaim, setLoadingClaim] = useState(false)

    const now = Date.now

    const [approval, approveCallback] = useApproveCallback(balance, chainId ? REAL_STAKER_ADDRESS[chainId] : undefined)
    const valueAmount: CurrencyAmount<Currency> | undefined = tryParseAmount(amountValue.toString(), baseCurrency)
    const earnedAmount: CurrencyAmount<Currency> | undefined = tryParseAmount(
        earned !== 0 ? formatEther(earned._hex) : earned.toString(),
        baseCurrency
    )
    const stakedAmount: CurrencyAmount<Currency> | undefined = tryParseAmount(
        staked !== 0 ? formatEther(staked._hex) : staked.toString(),
        baseCurrency
    )
    const unstakedAmount: CurrencyAmount<Currency> | undefined = tryParseAmount(unstaked.toString(), baseCurrency)

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
        if (!isArray(frozenStaked) || !stakesResult?.factories) return

        const formatedData = frozenStaked?.map((el, i) => {
            if (!el.xALGBAmount) return

            return BigNumber.from(el?.xALGBAmount)
                .mul(BigNumber.from(stakesResult?.factories[0]?.ALGBbalance))
                .div(BigNumber.from(stakesResult?.factories[0]?.xALGBtotalSupply))
        })

        return formatedData.reduce((prev, cur) => {
            return prev?.add(cur)
        }, BigNumber.from('0'))
    }, [frozenStaked, account, stakesResult])


    const allXALGBFreeze = useMemo(() => {
        if (!isArray(frozenStaked) || !stakesResult?.factories) return

        const formatedData = frozenStaked?.map((el, i) => {
            if (!el.xALGBAmount) return

            return BigNumber.from(el?.xALGBAmount)
        })

        return formatedData.reduce((prev, cur) => {
            return prev?.add(cur)
        }, BigNumber.from('0'))
    }, [frozenStaked, account, stakesResult])

    const stakedFreeze = useMemo(() => {
        if (!isArray(frozenStaked)) return

        const formatedData = frozenStaked?.map((el, i) => {
            return BigNumber.from(el?.stakedALGBAmount)
        })
        return formatedData.reduce((prev, cur) => prev.add(cur), BigNumber.from('0'))
    }, [frozenStaked, account])

    const earnedFreeze = useMemo(() => {

        if (!allFreeze || !stakedFreeze) return

        return allFreeze.sub(stakedFreeze)
    }, [allFreeze, stakedFreeze])

    useEffect(() => {
        if (!account) return

        fetchStakingFn(account.toLowerCase())
        frozenStakedHandler(account)

    }, [account])

    //get data for staked and earned
    useEffect(() => {
        if (stakesResult || !account) return
        fetchStakingFn(account.toLowerCase())
    }, [_balance])

    //calc amount when choose range in slider
    useEffect(() => {
        if (!numBalance) return

        if (percentForSlider === 0) {
            setAmountValue('')
        } else if (percentForSlider === 100) {
            setAmountValue(numBalance?.toSignificant(4))
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

        setEarned(
            BigNumber.from(stakesResult.stakes[0]?.xALGBAmount || '0')
                .mul(BigNumber.from(stakesResult.factories[0].ALGBbalance))
                .div(BigNumber.from(stakesResult.factories[0].xALGBtotalSupply))
                .sub(BigNumber.from(stakesResult.stakes[0]?.stakedALGBAmount || '0'))
                .sub(earnedFreeze)
        )

        if (+stakesResult?.factories[0].xALGBtotalSupply !== 0) {
            setAlbgCourse(
                BigNumber.from(stakesResult.factories[0].ALGBbalance)
                    .div(BigNumber.from(stakesResult.factories[0].xALGBtotalSupply))
            )
        }
        if (!stakesResult?.stakes[0]) {
            return setStaked(BigNumber.from('0'))
        }
        setStaked(BigNumber.from(stakesResult?.stakes[0]?.stakedALGBAmount).sub(stakedFreeze))
    }, [stakesResult, stakedFreeze, earnedFreeze])

    //calc unstake amount
    useEffect(() => {
        setUnstakeAmount(staked.add(earned))
    }, [staked, earned])

    //stake handler invoked from keyboard
    const enterHandler = useCallback((e) => {
        if (e.charCode === 13) {
            if (!(+amountValue > +balance?.toSignificant(4))) {
                stakerHandler(amountValue)
                onPercentSelectForSlider(0)
                if (percentForSlider === 0) {
                    setAmountValue('')
                }
            }
        }
    }, [])

    return (
        <>
            <Helmet>
                <title>Algebra — Staking</title>
            </Helmet>
            <PageWrapper width={'765px'}>
                <StakeTitle>Stake ALGB</StakeTitle>
                <div onKeyPress={(e) => enterHandler(e)}>
                    <RealStakerInputRange
                        amountValue={amountValue}
                        setAmountValue={setAmountValue}
                        baseCurrency={baseCurrency}
                        fiatValue={fiatValue}
                    />
                </div>
                {numBalance == 0 && balance ? (
                    <NavLink to={''} style={{textDecoration: 'none'}}>
                        <StakeButton>BUY ALGB</StakeButton>
                    </NavLink>
                ) : (
                    <>
                        <SilderWrapper>
                            <StakerSlider value={percentForSlider} onChange={onPercentSelectForSlider} size={22}/>
                        </SilderWrapper>
                        <RealStakerRangeButtons onPercentSelect={onPercentSelect} showCalculate={false}/>
                        {approval === ApprovalState.NOT_APPROVED ? (
                            <StakeButton onClick={approveCallback}>Approve token</StakeButton>
                        ) : approval === ApprovalState.UNKNOWN && account === null ? (
                            <StakeButton onClick={toggleWalletModal}>Connect to a wallet</StakeButton>
                        ) : approval === ApprovalState.UNKNOWN ? (
                            <StakeButton>
                                <Loader stroke={'white'} size={'19px'}/>
                            </StakeButton>
                        ) : approval === ApprovalState.APPROVED ? (
                            <StakeButton
                                onClick={() => {
                                    stakerHandler(amountValue)
                                    onPercentSelectForSlider(0)
                                    if (percentForSlider === 0) {
                                        setAmountValue('')
                                    }
                                }}
                                disabled={+amountValue > +balance?.toSignificant(4) || amountValue === ''}
                            >
                                {+amountValue > +balance?.toSignificant(4) ? 'Insufficient ALGB balance' : 'Stake'}
                            </StakeButton>
                        ) : <StakeButton>
                            <Loader stroke={'white'} size={'19px'}/>
                        </StakeButton>}
                    </>
                )}
            </PageWrapper>
            <EarnedStakedWrapper width={'765px'}>
                <ResBlocksTitle>
                    <LeftBlock>
                        <h3>Balance</h3>
                        {
                            frozenStaked?.length !== 0 &&
                            <FrozenDropDown onClick={() => {
                                setFrozen(!showFrozen)
                            }}>
                                {!allFreeze ? <Loader size={'16px'}
                                                      stroke={'white'}/> : `${(+formatEther(allFreeze || BigNumber.from('0'))).toFixed(2) < 0.01 ? '<' : ''} ${(+formatEther(allFreeze)).toFixed(2)}`} ALGB
                                Frozen {showFrozen ? <ArrowUp size={'16px'}/> : <ArrowDown size={'16px'}/>}
                            </FrozenDropDown>
                        }
                    </LeftBlock>
                    {showFrozen && frozenStaked?.length !== 0 && frozenStaked?.some(el => +Math.floor(el.timestamp * 1000) > now()) ?
                        <Frozen data={frozenStaked} earnedFreeze={earnedFreeze} now={now}/> : null}
                    <ReloadButton disabled={loadingClaim} onClick={reloadClaim} refreshing={loadingClaim}>
                        <RefreshCw style={{display: 'block'}} size={18} stroke={'white'}/>
                    </ReloadButton>
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
            </EarnedStakedWrapper>
            <StakerStatisticWrapper to={''}>
                <StakerStatisticBackground src={StakerStatistic}/>
                <h2>Statistics</h2>
                <p>APY / APR / Fees →</p>
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
        </>
    )
}
