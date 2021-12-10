import { BigNumber } from '@ethersproject/bignumber'
import { RouteComponentProps } from 'react-router'
import { useV3NFTPositionManagerContract } from '../../hooks/useContract'
import { useActiveWeb3React } from '../../hooks/web3'
import { useWalletModalToggle } from '../../state/application/hooks'
import { useTransactionAdder } from '../../state/transactions/hooks'
import { useV3PositionFromTokenId } from '../../hooks/useV3Positions'
import { useDerivedPositionInfo } from '../../hooks/useDerivedPositionInfo'
import { useIsExpertMode, useUserSlippageToleranceWithDefault } from '../../state/user/hooks'
import { CurrencyDropdown, ScrollablePage, StyledInput } from '../AddLiquidity/styled'
import styled, { css, keyframes } from 'styled-components/macro'
import { useCurrency } from '../../hooks/Tokens'
import {
  useV3MintState,
  useV3MintActionHandlers,
  useRangeHopCallbacks,
  useV3DerivedMintInfo,
} from '../../state/mint/v3/hooks'
import { useCallback, useEffect, useMemo, useState } from 'react'
import useTransactionDeadline from '../../hooks/useTransactionDeadline'
import { useUSDCValue } from '../../hooks/useUSDCPrice'
import { maxAmountSpend } from '../../utils/maxAmountSpend'
import { ApprovalState, useApproveCallback } from '../../hooks/useApproveCallback'
import { NONFUNGIBLE_POSITION_MANAGER_ADDRESSES } from '../../constants/addresses'
import { ZERO_PERCENT } from '../../constants/misc'
import { Currency, CurrencyAmount, Percent } from '@uniswap/sdk-core'
import { Field, Bound } from '../../state/mint/v3/actions'
import { currencyId } from '../../utils/currencyId'
import { WMATIC_EXTENDED } from '../../constants/tokens'
import CurrencyInputPanel from '../../components/CurrencyInputPanel'
import RangeSelector from '../../components/RangeSelector'
import LiquidityChartRangeInput from '../../components/LiquidityChartRangeInput'
import { NonfungiblePositionManager as NonFunPosMan } from './nft-manager'
import _abi from '../../abis/non-fun-pos-man.json'
import { calculateGasMargin } from '../../utils/calculateGasMargin'
import { TransactionResponse } from '@ethersproject/abstract-provider'
import { t } from '@lingui/macro'
import { FeeAmount } from '../../lib/src/constants'
import { SupportedChainId } from '../../constants/chains'
import { useIsSwapUnsupported } from '../../hooks/useIsSwapUnsupported'
import { AlertCircle, Download } from 'react-feather'
import PDFAlgebra from '../../assets/pdf/Algebra_Tech_Paper.pdf'
import { darken } from 'polished'
import SettingsTab from '../../components/Settings'
import { RowFixed } from '../../components/Row'
import usePrevious from '../../hooks/usePrevious'

import ReactGA from 'react-ga'

const pulsating = (color: string) => keyframes`
  0% {
    border-color: rgba(32, 38, 53, 1);
  }
  50% {
    border-color: rgba(167, 10, 255, 1);
  }
  100% {
    border-color: rgba(32, 38, 53, 1);
  }
`

const PageWrapper = styled.div`
  max-width: 900px;
  width: 100%;
`
const LiquidityWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  background: #020018;
  padding: 2rem;
  border-radius: 1rem;
`
const TokenPair = styled.div`
  display: flex;
  width: 100%;
`

const TokenItem = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  // height: 120px;
  ${({ noPadding }) =>
    !noPadding &&
    css`
      padding: 1rem;
      border: 1px solid #202635;
    `}
  border-radius: 1rem;
  &:first-of-type {
    margin-right: 0.5rem;
  }
  &:last-of-type {
    margin-left: 0.5rem;
  }
  ${({ highPrice }) =>
    highPrice &&
    css`
      border-color: #d33636;
      border-radius: 1rem 1rem 0 0;
    `}
`

const MaxButton = styled.button`
  position: absolute;
  right: 1rem;
  top: 19px;
  border: none;
  border-radius: 6px;
  padding: 8px 12px;
  background: #0f2e40;
  color: #43adc1;
  font-family: Montserrat;
  font-weight: 600;
  &:hover {
    background-color: ${darken(0.01, '#0f2e40')};
  }
`

const PoolInfo = styled.div`
  display: flex;
  margin-top: 1rem;
`

const PoolInfoItem = styled.div`
  position: relative;
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid #202635;

  animation: ${({ pulse }) => pulse && pulsating('red')} 3s linear infinite;

  &:first-of-type {
    margin-right: 0.5rem;
  }
  &:last-of-type {
    margin-left: 0.5rem;
  }
`
const PoolInfoItemTitle = styled.span`
  font-family: Montserrat;
  font-weight: 600;
  white-space: nowrap;
  margin-right: 10px;
`

const PoolInfoItemValue = styled.span`
  font-family: Montserrat;
  margin-right: 10px;
  white-space: nowrap;
`

const PoolInfoItemValueMetric = styled.span`
  color: #b7b7b7;
  font-size: 12px;
  line-height: 21px;
  white-space: nowrap;
`

const TechPaperHint = styled.div`
  z-index: 10;
  position: absolute;
  display: flex;
  visibility: hidden;
  flex-direction: column;
  background-color: #9c7edc;
  padding: 1rem;
  border-radius: 8px;
  color: white;
  right: 1rem;
  top: 100%;
  margin-top: -8px;
  box-shadow: 0 0 10px rgba(156, 126, 220, 0.18);
  opacity: 0;
  transition-duration: 0.2s;
  cursor: default;

  &:before {
    content: '';
    width: 100%;
    height: 30px;
    position: absolute;
    top: 0;
    left: 0;
    margin-top: -20px;
  }
`

const TechPaperHintTitle = styled.div``

const TechPaperDownloadButton = styled.a`
display: flex;
align-items: center;
justify-content: center;
width: 100%;
background-color: #7b4ed9;
color: white;
border: none;
border-radius: 6px;
padding: 6px;
text-decoration: none;

&:hover {
  background-color: ${darken(0.05, '#7b4ed9')}
}
}
`

const HelperCirlce = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  background-color: #9c7edc;
  color: white;
  font-size: 12px;
  cursor: pointer;

  &:hover {
    & > ${TechPaperHint} {
      visibility: visible;
      opacity: 1;
    }
  }
`

const Title = styled.div`
  position: relative;
  font-size: 18px;
  font-family: Montserrat;
  font-weight: 600;
  padding: 1rem 0;
  border-top: 1px solid #202635;
  margin-top: 1rem;
`

const Warning = styled.div`
  position: absolute;
  right: 0px;
  padding: 8px 16px;
  top: 10px;
  font-size: 13px;
  background: #69270d;
  color: #e55d47;
  border-radius: 6px;
  font-weight: 500;
`
const Error = styled(Warning)`
  color: #ed0f24;
  background-color: #2a0909;
  width: 100%;
  text-align: center;
`

const PriceRangeWrapper = styled.div`
  display: flex;
  width: 100%;
  // height: 250px;
  // margin-bottom: 1rem;
`
const PriceRangeChart = styled.div`
  height: 100%;
  flex: 2;
  border-radius: 6px;
  border: 1px solid #202635;
`
const PriceRangeInputs = styled.div`
  height: 100%;
  flex: 1;
  margin-left: ${({ initial }) => (initial ? '0' : '1rem')};
`

const AddLiquidityMessage = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  background-color: #35260a;
  color: #ffb300;
  border-radius: 8px;
  padding: 14px 16px;
  font-size: 13px;
`

const AddLiquidityButton = styled.button`
  // width: 100%;
  padding: 8px 16px;
  height: 2.8rem;
  background: rgb(96, 31, 179) none repeat scroll 0% 0%;
  cursor: pointer;
  color: white;
  border: medium none;
  border-radius: 10px;
  font-size: 16px;
  font-family: Montserrat;
  margin-left: auto;
  white-space: nowrap;

  &:disabled {
    background-color: #2c1051;
    color: #5f3794;
    font-weight: 600;
  }
`

const FullRangeButton = styled.button`
  width: 100%;
  background: #0f2e40;
  color: #43adc1;
  border: none;
  font-family: Montserrat;
  font-weight: 600;
  border-radius: 6px;
  padding: 7px;

  &:hover {
    background-color: ${darken(0.01, '#0f2e40')};
  }
`

const ApproveButton = styled.button`
  background: #601fb3;
  padding: 10px;
  border-radius: 8px;
  border: none;
  margin: 25px auto auto;
  width: 100%;
  color: white;
`

const PairNotSelectedMock = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 451px;
`
const HigherPrice = styled.div`
  position: absolute;
  border: 1px solid #d33636;
  background-color: #3b1515;
  color: white;
  padding: 8px 10px;
  border-radius: 0 0 1rem 1rem;
  z-index: 5;
  bottom: -2rem;
  right: -1px;
  left: -1px;
  text-align: center;
`

const DEFAULT_ADD_IN_RANGE_SLIPPAGE_TOLERANCE = new Percent(50, 10_000)

export default function AddLiquidityPage({
  match: {
    params: { currencyIdA, currencyIdB, feeAmount: feeAmountFromUrl, tokenId },
  },
  history,
}: RouteComponentProps<{ currencyIdA?: string; currencyIdB?: string; feeAmount?: string; tokenId?: string }>) {
  const { account, chainId, library } = useActiveWeb3React()
  const toggleWalletModal = useWalletModalToggle() // toggle wallet when disconnected
  const expertMode = useIsExpertMode()
  const addTransaction = useTransactionAdder()
  const positionManager = useV3NFTPositionManagerContract()

  // check for existing position if tokenId in url
  const { position: existingPositionDetails, loading: positionLoading } = useV3PositionFromTokenId(
    tokenId ? BigNumber.from(tokenId) : undefined
  )
  const hasExistingPosition = !!existingPositionDetails && !positionLoading

  const { position: existingPosition } = useDerivedPositionInfo(existingPositionDetails)
  const prevExistingPosition = usePrevious(existingPosition)
  const _existingPosition = useMemo(() => {
    if (!existingPosition && prevExistingPosition) {
      return {
        ...prevExistingPosition,
      }
    }
    return {
      ...existingPosition,
    }
  }, [existingPosition])

  const feeAmount = 500

  const baseCurrency = useCurrency(currencyIdA)
  const currencyB = useCurrency(currencyIdB)
  // prevent an error if they input ETH/WETH
  //TODO
  const quoteCurrency =
    baseCurrency && currencyB && baseCurrency.wrapped.equals(currencyB.wrapped) ? undefined : currencyB

  // mint state
  const { independentField, typedValue, startPriceTypedValue } = useV3MintState()

  const derivedMintInfo = useV3DerivedMintInfo(
    baseCurrency ?? undefined,
    quoteCurrency ?? undefined,
    feeAmount,
    baseCurrency ?? undefined,
    _existingPosition
  )
  const prevDerivedMintInfo = usePrevious({ ...derivedMintInfo })

  const {
    pool,
    ticks,
    dependentField,
    price,
    pricesAtTicks,
    parsedAmounts,
    currencyBalances,
    position,
    noLiquidity,
    currencies,
    errorMessage,
    invalidPool,
    invalidRange,
    outOfRange,
    depositADisabled,
    depositBDisabled,
    invertPrice,
    ticksAtLimit,
    dynamicFee,
  } = useMemo(() => {
    if ((!derivedMintInfo.pool || !derivedMintInfo.price || derivedMintInfo.noLiquidity) && prevDerivedMintInfo) {
      return {
        ...prevDerivedMintInfo,
      }
    }
    return {
      ...derivedMintInfo,
    }
  }, [derivedMintInfo])

  const { onFieldAInput, onFieldBInput, onLeftRangeInput, onRightRangeInput, onStartPriceInput } =
    useV3MintActionHandlers(noLiquidity)

  const isValid = !errorMessage && !invalidRange

  // modal and loading
  const [showConfirm, setShowConfirm] = useState<boolean>(false)
  const [attemptingTxn, setAttemptingTxn] = useState<boolean>(false) // clicked confirm

  // capital efficiency warning
  const [showCapitalEfficiencyWarning, setShowCapitalEfficiencyWarning] = useState(false)

  useEffect(() => setShowCapitalEfficiencyWarning(false), [baseCurrency, quoteCurrency, dynamicFee])

  // txn values
  const deadline = useTransactionDeadline() // custom from users settings

  const [txHash, setTxHash] = useState<string>('')

  // get formatted amounts
  const formattedAmounts = {
    [independentField]: typedValue,
    [dependentField]: parsedAmounts[dependentField]?.toSignificant(6) ?? '',
  }

  const usdcValues = {
    [Field.CURRENCY_A]: useUSDCValue(parsedAmounts[Field.CURRENCY_A]),
    [Field.CURRENCY_B]: useUSDCValue(parsedAmounts[Field.CURRENCY_B]),
  }

  const usdcAIsGreaterThen10000 = useMemo(() => {
    if (!usdcValues[Field.CURRENCY_A]) {
      return
    }

    return +usdcValues[Field.CURRENCY_A].toFixed().split('.')[0] >= 10000
  }, [parsedAmounts])

  const usdcBIsGreaterThen10000 = useMemo(() => {
    if (!usdcValues[Field.CURRENCY_B]) {
      return
    }
    return +usdcValues[Field.CURRENCY_B].toFixed().split('.')[0] >= 10000
  }, [parsedAmounts])

  // get the max amounts user can add
  const maxAmounts: { [field in Field]?: CurrencyAmount<Currency> } = [Field.CURRENCY_A, Field.CURRENCY_B].reduce(
    (accumulator, field) => {
      return {
        ...accumulator,
        [field]: maxAmountSpend(currencyBalances[field]),
      }
    },
    {}
  )

  const atMaxAmounts: { [field in Field]?: CurrencyAmount<Currency> } = [Field.CURRENCY_A, Field.CURRENCY_B].reduce(
    (accumulator, field) => {
      return {
        ...accumulator,
        [field]: maxAmounts[field]?.equalTo(parsedAmounts[field] ?? '0'),
      }
    },
    {}
  )

  // check whether the user has approved the router on the tokens
  const [approvalA, approveACallback] = useApproveCallback(
    parsedAmounts[Field.CURRENCY_A],
    chainId ? NONFUNGIBLE_POSITION_MANAGER_ADDRESSES[chainId] : undefined
  )
  const [approvalB, approveBCallback] = useApproveCallback(
    parsedAmounts[Field.CURRENCY_B],
    chainId ? NONFUNGIBLE_POSITION_MANAGER_ADDRESSES[chainId] : undefined
  )

  const allowedSlippage = useUserSlippageToleranceWithDefault(
    outOfRange ? ZERO_PERCENT : DEFAULT_ADD_IN_RANGE_SLIPPAGE_TOLERANCE
  )

  async function onAdd() {
    if (!chainId || !library || !account) return

    if (!positionManager || !baseCurrency || !quoteCurrency) {
      return
    }

    if (position && account && deadline) {
      const useNative = baseCurrency.isNative ? baseCurrency : quoteCurrency.isNative ? quoteCurrency : undefined

      const { calldata, value } =
        hasExistingPosition && tokenId
          ? NonFunPosMan.addCallParameters(position, {
              tokenId,
              slippageTolerance: allowedSlippage,
              deadline: deadline.toString(),
              useNative,
            })
          : NonFunPosMan.addCallParameters(position, {
              slippageTolerance: allowedSlippage,
              recipient: account,
              deadline: deadline.toString(),
              useNative,
              createPool: noLiquidity,
            })

      const { calldata: calldata2, value: _value } = NonFunPosMan.addCallParameters(position, {
        slippageTolerance: allowedSlippage,
        recipient: account,
        deadline: deadline.toString(),
        useNative,
        createPool: noLiquidity,
      })

      const txn: { to: string; data: string; value: string } = {
        to: NONFUNGIBLE_POSITION_MANAGER_ADDRESSES[chainId],
        data: calldata,
        value,
      }

      setAttemptingTxn(true)

      library
        .getSigner()
        .estimateGas(txn)
        .then((estimate) => {
          const newTxn = {
            ...txn,
            gasLimit: calculateGasMargin(chainId, estimate),
            gasPrice: 70000000000,
          }

          return library
            .getSigner()
            .sendTransaction(newTxn)
            .then((response: TransactionResponse) => {
              setAttemptingTxn(false)
              addTransaction(response, {
                summary: noLiquidity
                  ? t`Create pool and add ${baseCurrency?.symbol}/${quoteCurrency?.symbol} liquidity`
                  : t`Add ${baseCurrency?.symbol}/${quoteCurrency?.symbol} liquidity`,
              })
              setTxHash(response.hash)
            })
        })
        .catch((error) => {
          console.error('Failed to send transaction', error)
          setAttemptingTxn(false)
          // we only care if the error is something _other_ than the user rejected the tx
          if (error?.code !== 4001) {
            console.error(error)
          }
        })
    } else {
      return
    }
  }

  const handleCurrencySelect = useCallback(
    (currencyNew: Currency, currencyIdOther?: string): (string | undefined)[] => {
      const currencyIdNew = currencyId(currencyNew, chainId)

      let chainSymbol

      if (chainId === 137) {
        chainSymbol = 'MATIC'
      }

      if (currencyIdNew === currencyIdOther) {
        // not ideal, but for now clobber the other if the currency ids are equal
        return [currencyIdNew, undefined]
      } else {
        // prevent weth + eth
        const isETHOrWETHNew =
          currencyIdNew === chainSymbol ||
          (chainId !== undefined && currencyIdNew === WMATIC_EXTENDED[chainId]?.address)
        const isETHOrWETHOther =
          currencyIdOther !== undefined &&
          (currencyIdOther === chainSymbol ||
            (chainId !== undefined && currencyIdOther === WMATIC_EXTENDED[chainId]?.address))

        if (isETHOrWETHNew && isETHOrWETHOther) {
          return [currencyIdNew, undefined]
        } else {
          return [currencyIdNew, currencyIdOther]
        }
      }
    },
    [chainId]
  )

  const handleCurrencyASelect = useCallback(
    (currencyANew: Currency) => {
      const [idA, idB] = handleCurrencySelect(currencyANew, currencyIdB)
      if (idB === undefined) {
        history.push(`/add/${idA}`)
      } else {
        history.push(`/add/${idA}/${idB}`)
      }
    },
    [handleCurrencySelect, currencyIdB, history]
  )

  const handleCurrencyBSelect = useCallback(
    (currencyBNew: Currency) => {
      const [idB, idA] = handleCurrencySelect(currencyBNew, currencyIdA)
      if (idA === undefined) {
        history.push(`/add/${idB}`)
      } else {
        history.push(`/add/${idA}/${idB}`)
      }
    },
    [handleCurrencySelect, currencyIdA, history]
  )

  const mustCreateSeparately = noLiquidity && chainId !== SupportedChainId.POLYGON

  const handleDismissConfirmation = useCallback(() => {
    setShowConfirm(false)
    // if there was a tx hash, we want to clear the input
    if (txHash) {
      onFieldAInput('')
      // dont jump to pool page if creating
      if (!mustCreateSeparately) {
        history.push('/pool')
      }
    }
    setTxHash('')
  }, [history, mustCreateSeparately, onFieldAInput, txHash])

  const addIsUnsupported = useIsSwapUnsupported(currencies?.CURRENCY_A, currencies?.CURRENCY_B)

  const clearAll = useCallback(() => {
    onFieldAInput('')
    onFieldBInput('')
    onLeftRangeInput('')
    onRightRangeInput('')
    history.push(`/add`)
  }, [history, onFieldAInput, onFieldBInput, onLeftRangeInput, onRightRangeInput])

  // get value and prices at ticks
  const { [Bound.LOWER]: tickLower, [Bound.UPPER]: tickUpper } = ticks
  const { [Bound.LOWER]: priceLower, [Bound.UPPER]: priceUpper } = pricesAtTicks

  const { getDecrementLower, getIncrementLower, getDecrementUpper, getIncrementUpper, getSetFullRange } =
    useRangeHopCallbacks(baseCurrency ?? undefined, quoteCurrency ?? undefined, dynamicFee, tickLower, tickUpper, pool)

  // we need an existence check on parsed amounts for single-asset deposits
  const showApprovalA = approvalA !== ApprovalState.APPROVED && !!parsedAmounts[Field.CURRENCY_A]
  const showApprovalB = approvalB !== ApprovalState.APPROVED && !!parsedAmounts[Field.CURRENCY_B]

  const pendingText = mustCreateSeparately
    ? `Creating ${currencies[Field.CURRENCY_A]?.symbol}/${currencies[Field.CURRENCY_B]?.symbol} ${
        dynamicFee ? dynamicFee / 10000 : ''
      }% Pool`
    : `Supplying ${!depositADisabled ? parsedAmounts[Field.CURRENCY_A]?.toSignificant(6) : ''} ${
        !depositADisabled ? currencies[Field.CURRENCY_A]?.symbol : ''
      } ${!outOfRange ? 'and' : ''} ${!depositBDisabled ? parsedAmounts[Field.CURRENCY_B]?.toSignificant(6) : ''} ${
        !depositBDisabled ? currencies[Field.CURRENCY_B]?.symbol : ''
      }`

  return (
    <>
      <PageWrapper>
        <LiquidityWrapper>
          <div style={{ marginBottom: '2rem', fontFamily: 'Montserrat', fontSize: '21px', display: 'flex' }}>
            <span style={{ marginLeft: 'auto' }}>Add Liquidity</span>
            <RowFixed style={{ marginLeft: 'auto' }}>
              <SettingsTab placeholderSlippage={allowedSlippage} />
            </RowFixed>
          </div>
          <TokenPair>
            <TokenItem noPadding>
              <CurrencyDropdown
                centered={true}
                value={formattedAmounts[Field.CURRENCY_A]}
                onUserInput={onFieldAInput}
                hideInput={true}
                onMax={() => {
                  onFieldAInput(maxAmounts[Field.CURRENCY_A]?.toExact() ?? '')
                }}
                onCurrencySelect={handleCurrencyASelect}
                showMaxButton={!atMaxAmounts[Field.CURRENCY_A]}
                currency={currencies[Field.CURRENCY_A]}
                id="add-liquidity-input-tokena"
                showCommonBases
                showBalance={false}
              />
            </TokenItem>
            <TokenItem noPadding>
              <CurrencyDropdown
                centered={true}
                value={formattedAmounts[Field.CURRENCY_B]}
                hideInput={true}
                onUserInput={onFieldBInput}
                onCurrencySelect={handleCurrencyBSelect}
                onMax={() => {
                  onFieldBInput(maxAmounts[Field.CURRENCY_B]?.toExact() ?? '')
                }}
                showMaxButton={!atMaxAmounts[Field.CURRENCY_B]}
                currency={currencies[Field.CURRENCY_B]}
                id="add-liquidity-input-tokenb"
                showCommonBases
                showBalance={false}
              />
            </TokenItem>
          </TokenPair>
          {baseCurrency && quoteCurrency && account ? (
            <>
              <PoolInfo>
                <PoolInfoItem>
                  <PoolInfoItemTitle>{`${noLiquidity ? 'Initial' : 'Current'} Fee:`}</PoolInfoItemTitle>
                  <span style={{ display: 'flex' }}>
                    <PoolInfoItemValue>{noLiquidity ? '0.05' : dynamicFee / 10000}%</PoolInfoItemValue>
                    <HelperCirlce>
                      <span style={{ userSelect: 'none' }}>?</span>
                      <TechPaperHint>
                        <TechPaperHintTitle>
                          <span style={{ fontSize: '16px', fontWeight: 600 }}>📄 Tech paper</span>
                        </TechPaperHintTitle>
                        <div style={{ fontSize: '14px', lineHeight: '18px', marginTop: '10px' }}>
                          Check out how dynamic fee is calculated
                        </div>
                        <div style={{ marginTop: '10px', width: '100%' }}>
                          <TechPaperDownloadButton download="Algebra-Tech-Paper.pdf" href={PDFAlgebra}>
                            <span>
                              <Download size={16} color={'white'} />
                            </span>
                            <span style={{ marginLeft: '10px' }}>Download .PDF</span>
                          </TechPaperDownloadButton>
                        </div>
                      </TechPaperHint>
                    </HelperCirlce>
                  </span>
                </PoolInfoItem>
                {price && baseCurrency && quoteCurrency && !noLiquidity ? (
                  <PoolInfoItem>
                    <PoolInfoItemTitle>Current Price:</PoolInfoItemTitle>
                    <span style={{ display: 'flex' }}>
                      <PoolInfoItemValue>
                        {invertPrice ? price.invert().toSignificant(6) : price.toSignificant(6)}
                      </PoolInfoItemValue>
                      <PoolInfoItemValueMetric>
                        {quoteCurrency?.symbol} per {baseCurrency.symbol}
                      </PoolInfoItemValueMetric>
                    </span>
                  </PoolInfoItem>
                ) : (
                  <PoolInfoItem pulse={!startPriceTypedValue}>
                    <PoolInfoItemTitle>Starting Price</PoolInfoItemTitle>
                    <span style={{ display: 'flex' }}>
                      <PoolInfoItemValue style={{ marginTop: '-1px' }}>
                        <StyledInput
                          style={{ textAlign: 'right', backgroundColor: 'transparent' }}
                          // placeholder={}
                          className="start-price-input"
                          value={startPriceTypedValue}
                          onUserInput={onStartPriceInput}
                        />
                      </PoolInfoItemValue>
                      <PoolInfoItemValueMetric>
                        {quoteCurrency?.symbol} per {baseCurrency.symbol}
                      </PoolInfoItemValueMetric>
                    </span>
                  </PoolInfoItem>
                )}
              </PoolInfo>

              {account && (
                <>
                  <div
                    style={
                      !startPriceTypedValue && !price ? { opacity: 0.2, pointerEvents: 'none', userSelect: 'none' } : {}
                    }
                  >
                    <Title>
                      Price Range
                      {outOfRange && (
                        <Warning>
                          <span>Warning: Price is out of range</span>
                          <span>
                            <HelperCirlce style={{ marginLeft: '10px', backgroundColor: '#af461c' }}>
                              <span style={{ userSelect: 'none' }}>?</span>
                              <TechPaperHint>
                                <TechPaperHintTitle>
                                  <span style={{ fontSize: '16px', fontWeight: 600 }}>📄 Tech paper</span>
                                </TechPaperHintTitle>
                                <div style={{ fontSize: '14px', lineHeight: '18px', marginTop: '10px' }}>
                                  Check out how dynamic fee is calculated
                                </div>
                                <div style={{ marginTop: '10px', width: '100%' }}>
                                  <TechPaperDownloadButton download="Algebra-Tech-Paper.pdf" href={PDFAlgebra}>
                                    <span>
                                      <Download size={16} color={'white'} />
                                    </span>
                                    <span style={{ marginLeft: '10px' }}>Download .PDF</span>
                                  </TechPaperDownloadButton>
                                </div>
                              </TechPaperHint>
                            </HelperCirlce>
                          </span>
                        </Warning>
                      )}
                      {invalidRange && <Error>Error: The Min price must be lower than the Max price</Error>}
                    </Title>
                    <PriceRangeWrapper>
                      {price && baseCurrency && quoteCurrency && !noLiquidity && (
                        <PriceRangeChart>
                          <LiquidityChartRangeInput
                            currencyA={baseCurrency ?? undefined}
                            currencyB={quoteCurrency ?? undefined}
                            feeAmount={dynamicFee}
                            ticksAtLimit={ticksAtLimit}
                            price={
                              price ? parseFloat((invertPrice ? price.invert() : price).toSignificant(8)) : undefined
                            }
                            priceLower={priceLower}
                            priceUpper={priceUpper}
                            onLeftRangeInput={onLeftRangeInput}
                            onRightRangeInput={onRightRangeInput}
                            interactive={!hasExistingPosition}
                          />
                        </PriceRangeChart>
                      )}
                      <PriceRangeInputs initial={noLiquidity}>
                        <RangeSelector
                          priceLower={priceLower}
                          priceUpper={priceUpper}
                          getDecrementLower={getDecrementLower}
                          getIncrementLower={getIncrementLower}
                          getDecrementUpper={getDecrementUpper}
                          getIncrementUpper={getIncrementUpper}
                          onLeftRangeInput={onLeftRangeInput}
                          onRightRangeInput={onRightRangeInput}
                          currencyA={baseCurrency}
                          currencyB={quoteCurrency}
                          feeAmount={dynamicFee}
                          ticksAtLimit={ticksAtLimit}
                          initial={noLiquidity}
                          disabled={!startPriceTypedValue && !price}
                        />
                        {!noLiquidity && (
                          <FullRangeButton
                            onClick={() => {
                              getSetFullRange()

                              ReactGA.event({
                                category: 'Liquidity',
                                action: 'Full Range Clicked',
                              })
                            }}
                          >
                            Full Range
                          </FullRangeButton>
                        )}
                      </PriceRangeInputs>

                      {/* <Row>
                                  <ButtonYellow
                                    padding="8px"
                                    marginRight="8px"
                                    $borderRadius="8px"
                                    width="auto"
                                    onClick={() => {
                                      setShowCapitalEfficiencyWarning(false)
                                      getSetFullRange()
                                    }}
                                  >
                                    <TYPE.black fontSize={13} color="black">
                                      <Trans>I Understand</Trans>
                                    </TYPE.black>
                                  </ButtonYellow>
                                </Row> */}
                    </PriceRangeWrapper>
                  </div>

                  <div
                    style={
                      (!startPriceTypedValue && !price) || !priceLower || !priceUpper || invalidRange
                        ? {
                            opacity: 0.2,
                            userSelect: 'none',
                            pointerEvents: 'none',
                          }
                        : {}
                    }
                  >
                    <Title>
                      Deposit Amounts
                      {/* <PriceRangeWarning>Warning: Price is out of range</PriceRangeWarning> */}
                    </Title>
                    <TokenPair
                      style={{
                        height: '145px',
                        marginBottom: usdcAIsGreaterThen10000 || usdcBIsGreaterThen10000 ? '2rem' : '1rem',
                      }}
                    >
                      <TokenItem highPrice={usdcAIsGreaterThen10000}>
                        {usdcAIsGreaterThen10000 && (
                          <HigherPrice>During Alpha limit is $10,000 in one token</HigherPrice>
                        )}
                        {!atMaxAmounts[Field.CURRENCY_A] && !depositADisabled && (
                          <MaxButton
                            disabled={(!startPriceTypedValue && !price) || !priceLower || !priceUpper || invalidRange}
                            onClick={() => onFieldAInput(maxAmounts[Field.CURRENCY_A]?.toFixed() ?? '')}
                          >
                            Max
                          </MaxButton>
                        )}
                        <CurrencyDropdown
                          value={formattedAmounts[Field.CURRENCY_A]}
                          onUserInput={onFieldAInput}
                          hideInput={true}
                          onMax={() => {
                            onFieldAInput(maxAmounts[Field.CURRENCY_A]?.toFixed() ?? '')
                          }}
                          onCurrencySelect={handleCurrencyASelect}
                          showMaxButton={!atMaxAmounts[Field.CURRENCY_A]}
                          currency={currencies[Field.CURRENCY_A]}
                          id="add-liquidity-input-tokena"
                          showCommonBases
                          showBalance={true}
                          disabled={(!startPriceTypedValue && !price) || !priceLower || !priceUpper}
                          shallow={true}
                        />
                        <div style={{ display: 'flex' }}>
                          <div style={{ width: '100%' }}>
                            <CurrencyInputPanel
                              value={formattedAmounts[Field.CURRENCY_A]}
                              onUserInput={onFieldAInput}
                              onMax={() => {
                                onFieldAInput(maxAmounts[Field.CURRENCY_A]?.toExact() ?? '')
                              }}
                              showMaxButton={!atMaxAmounts[Field.CURRENCY_A]}
                              currency={currencies[Field.CURRENCY_A]}
                              id="add-liquidity-input-tokena"
                              fiatValue={usdcValues[Field.CURRENCY_A]}
                              showCommonBases
                              locked={depositADisabled}
                              hideCurrency={true}
                              hideInput={depositADisabled}
                              disabled={(!startPriceTypedValue && !price) || !priceLower || !priceUpper || invalidRange}
                              shallow={true}
                            />
                          </div>
                          {showApprovalA && !depositADisabled && (
                            <div style={{ display: 'flex', width: '100%' }}>
                              <ApproveButton onClick={approveACallback} disabled={approvalA === ApprovalState.PENDING}>
                                {approvalA === ApprovalState.PENDING
                                  ? `Approving ${currencies[Field.CURRENCY_A]?.symbol}`
                                  : `Approve ${currencies[Field.CURRENCY_A]?.symbol}`}
                              </ApproveButton>
                            </div>
                          )}
                        </div>
                      </TokenItem>
                      <TokenItem highPrice={usdcBIsGreaterThen10000}>
                        {usdcBIsGreaterThen10000 && (
                          <HigherPrice>During Alpha limit is $10,000 in one token</HigherPrice>
                        )}
                        {!atMaxAmounts[Field.CURRENCY_B] && !depositBDisabled && (
                          <MaxButton
                            disabled={(!startPriceTypedValue && !price) || !priceLower || !priceUpper || invalidRange}
                            onClick={() => onFieldBInput(maxAmounts[Field.CURRENCY_B]?.toExact() ?? '')}
                          >
                            Max
                          </MaxButton>
                        )}
                        <CurrencyDropdown
                          value={formattedAmounts[Field.CURRENCY_B]}
                          hideInput={true}
                          onUserInput={onFieldBInput}
                          onCurrencySelect={handleCurrencyBSelect}
                          currency={currencies[Field.CURRENCY_B]}
                          id="add-liquidity-input-tokenb"
                          showCommonBases
                          showBalance={true}
                          disabled={(!startPriceTypedValue && !price) || !priceLower || !priceUpper || invalidRange}
                          shallow={true}
                        />
                        <div style={{ display: 'flex' }}>
                          <div style={{ width: '100%' }}>
                            <CurrencyInputPanel
                              value={formattedAmounts[Field.CURRENCY_B]}
                              onUserInput={onFieldBInput}
                              onMax={() => {
                                onFieldBInput(maxAmounts[Field.CURRENCY_B]?.toExact() ?? '')
                              }}
                              showMaxButton={!atMaxAmounts[Field.CURRENCY_B]}
                              fiatValue={usdcValues[Field.CURRENCY_B]}
                              currency={currencies[Field.CURRENCY_B]}
                              id="add-liquidity-input-tokenb"
                              showCommonBases
                              locked={depositBDisabled}
                              hideCurrency={true}
                              hideInput={depositBDisabled}
                              showBalance={true}
                              disabled={(!startPriceTypedValue && !price) || !priceLower || !priceUpper || invalidRange}
                              shallow={true}
                            />
                          </div>
                          {showApprovalB && !depositBDisabled && (
                            <div style={{ display: 'flex', width: '100%' }}>
                              <ApproveButton onClick={approveBCallback} disabled={approvalB === ApprovalState.PENDING}>
                                {approvalB === ApprovalState.PENDING
                                  ? `Approving ${currencies[Field.CURRENCY_B]?.symbol}`
                                  : `Approve ${currencies[Field.CURRENCY_B]?.symbol}`}
                              </ApproveButton>
                            </div>
                          )}
                        </div>
                      </TokenItem>
                    </TokenPair>
                  </div>
                </>
              )}
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {noLiquidity && account && (
                  <AddLiquidityMessage>
                    <AlertCircle size={16} color={'currentColor'} />
                    <span style={{ marginLeft: '10px' }}>Due to pool creating gas fee will be higher</span>
                  </AddLiquidityMessage>
                )}
                <div style={{ display: 'flex', alignItems: 'center', marginTop: '1rem' }}>
                  {errorMessage && (startPriceTypedValue || price) && priceLower && priceUpper && !invalidRange && (
                    <Error style={{ position: 'relative', padding: '14px 16px', marginRight: '1rem', top: 0 }}>
                      {errorMessage}
                    </Error>
                  )}
                  <AddLiquidityButton
                    onClick={() => {
                      // expertMode ? onAdd() : setShowConfirm(true)
                      onAdd()
                    }}
                    disabled={
                      (!isValid && !!parsedAmounts[Field.CURRENCY_A] && !!parsedAmounts[Field.CURRENCY_B]) ||
                      mustCreateSeparately ||
                      !isValid ||
                      (approvalA !== ApprovalState.APPROVED && !depositADisabled) ||
                      (approvalB !== ApprovalState.APPROVED && !depositBDisabled) ||
                      usdcAIsGreaterThen10000 ||
                      usdcBIsGreaterThen10000
                    }
                  >
                    Add Liquidity
                  </AddLiquidityButton>
                </div>
              </div>
            </>
          ) : account ? (
            <PairNotSelectedMock>Please select a token pair</PairNotSelectedMock>
          ) : (
            <PairNotSelectedMock>
              <AddLiquidityButton onClick={toggleWalletModal} style={{ margin: 'auto' }}>
                Connect to a wallet
              </AddLiquidityButton>
            </PairNotSelectedMock>
          )}
        </LiquidityWrapper>
      </PageWrapper>
    </>
  )
}
