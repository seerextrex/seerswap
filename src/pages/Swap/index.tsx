import { Trans } from '@lingui/macro'
import { Currency, CurrencyAmount, Token, TradeType } from '@uniswap/sdk-core'
import { Trade as V2Trade } from '@uniswap/v2-sdk'
import { Trade as V3Trade } from 'lib/src'
import { NetworkAlert } from 'components/NetworkAlert/NetworkAlert'
import { AdvancedSwapDetails } from 'components/swap/AdvancedSwapDetails'
import UnsupportedCurrencyFooter from 'components/swap/UnsupportedCurrencyFooter'
import { MouseoverTooltip, MouseoverTooltipContent } from 'components/Tooltip'
import JSBI from 'jsbi'
import { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { ArrowDown, ArrowLeft, CheckCircle, HelpCircle, Info } from 'react-feather'
import { Link, RouteComponentProps } from 'react-router-dom'
import { Text } from 'rebass'
import styled, { ThemeContext } from 'styled-components/macro'
import AddressInputPanel from '../../components/AddressInputPanel'
import { ButtonConfirmed, ButtonError, ButtonGray, ButtonLight, ButtonPrimary } from '../../components/Button'
import { GreyCard } from '../../components/Card'
import { AutoColumn } from '../../components/Column'
import CurrencyInputPanel from '../../components/CurrencyInputPanel'
import CurrencyLogo from '../../components/CurrencyLogo'
import Loader from '../../components/Loader'
import Row, { AutoRow, RowFixed } from '../../components/Row'
import BetterTradeLink from '../../components/swap/BetterTradeLink'
import confirmPriceImpactWithoutFee from '../../components/swap/confirmPriceImpactWithoutFee'
import ConfirmSwapModal from '../../components/swap/ConfirmSwapModal'
import { ArrowWrapper, Dots, SwapCallbackError, Wrapper } from '../../components/swap/styleds'
import SwapHeader from '../../components/swap/SwapHeader'
import TradePrice from '../../components/swap/TradePrice'
import { SwitchLocaleLink } from '../../components/SwitchLocaleLink'
import TokenWarningModal from '../../components/TokenWarningModal'
import { useAllTokens, useCurrency } from '../../hooks/Tokens'
import { ApprovalState, useApproveCallbackFromTrade } from '../../hooks/useApproveCallback'
import { V3TradeState } from '../../hooks/useBestV3Trade'
import useENSAddress from '../../hooks/useENSAddress'
import { useERC20PermitFromTrade, UseERC20PermitState } from '../../hooks/useERC20Permit'
import { useIsSwapUnsupported } from '../../hooks/useIsSwapUnsupported'
import { useSwapCallback } from '../../hooks/useSwapCallback'
import useToggledVersion, { Version } from '../../hooks/useToggledVersion'
import { useUSDCValue } from '../../hooks/useUSDCPrice'
import useWrapCallback, { WrapType } from '../../hooks/useWrapCallback'
import { useActiveWeb3React } from '../../hooks/web3'
import { useWalletModalToggle } from '../../state/application/hooks'
import { Field } from '../../state/swap/actions'
import {
  useDefaultsFromURLSearch,
  useDerivedSwapInfo,
  useSwapActionHandlers,
  useSwapState,
} from '../../state/swap/hooks'
import { useExpertModeManager, useUserSingleHopOnly } from '../../state/user/hooks'
import { HideSmall, LinkStyledButton, TYPE } from '../../theme'
import { computeFiatValuePriceImpact } from '../../utils/computeFiatValuePriceImpact'
import { getTradeVersion } from '../../utils/getTradeVersion'
import { isTradeBetter } from '../../utils/isTradeBetter'
import { maxAmountSpend } from '../../utils/maxAmountSpend'
import { warningSeverity } from '../../utils/prices'
import AppBody from '../AppBody'
import { usePoolDynamicFee } from '../../hooks/usePoolDynamicFee'
import { usePool } from '../../hooks/usePools'
import { Helmet } from 'react-helmet'

import ReactGA from 'react-ga'
import { opacify } from 'polished'

const StyledInfo = styled(Info)`
  opacity: 0.4;
  color: ${({ theme }) => theme.text1};
  height: 16px;
  width: 16px;
  :hover {
    opacity: 0.8;
  }
`

export default function Swap({ history }: RouteComponentProps) {
  const { account } = useActiveWeb3React()
  const loadedUrlParams = useDefaultsFromURLSearch()

  // token warning stuff
  const [loadedInputCurrency, loadedOutputCurrency] = [
    useCurrency(loadedUrlParams?.inputCurrencyId),
    useCurrency(loadedUrlParams?.outputCurrencyId),
  ]
  const [dismissTokenWarning, setDismissTokenWarning] = useState<boolean>(false)
  const urlLoadedTokens: Token[] = useMemo(
    () => [loadedInputCurrency, loadedOutputCurrency]?.filter((c): c is Token => c?.isToken ?? false) ?? [],
    [loadedInputCurrency, loadedOutputCurrency]
  )
  const handleConfirmTokenWarning = useCallback(() => {
    setDismissTokenWarning(true)
  }, [])

  // dismiss warning if all imported tokens are in active lists
  const defaultTokens = useAllTokens()
  const importTokensNotInDefault =
    urlLoadedTokens &&
    urlLoadedTokens.filter((token: Token) => {
      return !Boolean(token.address in defaultTokens)
    })

  const theme = useContext(ThemeContext)

  // toggle wallet when disconnected
  const toggleWalletModal = useWalletModalToggle()

  // for expert mode
  const [isExpertMode] = useExpertModeManager()

  // get version from the url
  const toggledVersion = useToggledVersion()

  // swap state
  const { independentField, typedValue, recipient } = useSwapState()
  const {
    v2Trade,
    v3TradeState: { trade: v3Trade, state: v3TradeState },
    toggledTrade: trade,
    allowedSlippage,
    currencyBalances,
    parsedAmount,
    currencies,
    inputError: swapInputError,
  } = useDerivedSwapInfo(toggledVersion)

  const {
    wrapType,
    execute: onWrap,
    inputError: wrapInputError,
  } = useWrapCallback(currencies[Field.INPUT], currencies[Field.OUTPUT], typedValue)

  const showWrap: boolean = wrapType !== WrapType.NOT_APPLICABLE
  const { address: recipientAddress } = useENSAddress(recipient)

  const parsedAmounts = useMemo(
    () =>
      showWrap
        ? {
            [Field.INPUT]: parsedAmount,
            [Field.OUTPUT]: parsedAmount,
          }
        : {
            [Field.INPUT]: independentField === Field.INPUT ? parsedAmount : trade?.inputAmount,
            [Field.OUTPUT]: independentField === Field.OUTPUT ? parsedAmount : trade?.outputAmount,
          },
    [independentField, parsedAmount, showWrap, trade]
  )

  const fiatValueInput = useUSDCValue(parsedAmounts[Field.INPUT])
  const fiatValueOutput = useUSDCValue(parsedAmounts[Field.OUTPUT])
  const priceImpact = computeFiatValuePriceImpact(fiatValueInput, fiatValueOutput)

  const { onSwitchTokens, onCurrencySelection, onUserInput, onChangeRecipient } = useSwapActionHandlers()
  const isValid = !swapInputError
  const dependentField: Field = independentField === Field.INPUT ? Field.OUTPUT : Field.INPUT

  const handleTypeInput = useCallback(
    (value: string) => {
      onUserInput(Field.INPUT, value)
    },
    [onUserInput]
  )
  const handleTypeOutput = useCallback(
    (value: string) => {
      onUserInput(Field.OUTPUT, value)
    },
    [onUserInput]
  )

  // reset if they close warning without tokens in params
  const handleDismissTokenWarning = useCallback(() => {
    setDismissTokenWarning(true)
    history.push('/swap/')
  }, [history])

  // modal and loading
  const [{ showConfirm, tradeToConfirm, swapErrorMessage, attemptingTxn, txHash }, setSwapState] = useState<{
    showConfirm: boolean
    tradeToConfirm: V3Trade<Currency, Currency, TradeType> | undefined
    attemptingTxn: boolean
    swapErrorMessage: string | undefined
    txHash: string | undefined
  }>({
    showConfirm: false,
    tradeToConfirm: undefined,
    attemptingTxn: false,
    swapErrorMessage: undefined,
    txHash: undefined,
  })

  const formattedAmounts = {
    [independentField]: typedValue,
    [dependentField]: showWrap
      ? parsedAmounts[independentField]?.toExact() ?? ''
      : parsedAmounts[dependentField]?.toSignificant(6) ?? '',
  }

  const userHasSpecifiedInputOutput = Boolean(
    currencies[Field.INPUT] && currencies[Field.OUTPUT] && parsedAmounts[independentField]?.greaterThan(JSBI.BigInt(0))
  )

  const routeNotFound = !trade?.route
  const isLoadingRoute = toggledVersion === Version.v3 && V3TradeState.LOADING === v3TradeState

  let dynamicFee
  let currencyA, currencyB

  if (trade?.swaps[0]?.route?.pools[0]) {
    dynamicFee = trade?.swaps[0]?.route?.pools[0].fee
  }

  // check whether the user has approved the router on the input token
  const [approvalState, approveCallback] = useApproveCallbackFromTrade(trade, allowedSlippage)
  const {
    state: signatureState,
    signatureData,
    gatherPermitSignature,
  } = useERC20PermitFromTrade(trade, allowedSlippage)

  const handleApprove = useCallback(async () => {
    if (signatureState === UseERC20PermitState.NOT_SIGNED && gatherPermitSignature) {
      try {
        await gatherPermitSignature()
      } catch (error) {
        // try to approve if gatherPermitSignature failed for any reason other than the user rejecting it
        if (error?.code !== 4001) {
          await approveCallback()
        }
      }
    } else {
      await approveCallback()
      ReactGA.event({
        category: 'Swap',
        action: 'Approve',
        label: [trade?.inputAmount.currency.symbol, toggledVersion].join('/'),
      })
    }
  }, [approveCallback, gatherPermitSignature, signatureState])

  // check if user has gone through approval process, used to show two step buttons, reset on token change
  const [approvalSubmitted, setApprovalSubmitted] = useState<boolean>(false)

  // mark when a user has submitted an approval, reset onTokenSelection for input field
  useEffect(() => {
    if (approvalState === ApprovalState.PENDING) {
      setApprovalSubmitted(true)
    }
  }, [approvalState, approvalSubmitted])

  const maxInputAmount: CurrencyAmount<Currency> | undefined = maxAmountSpend(currencyBalances[Field.INPUT])
  const showMaxButton = Boolean(maxInputAmount?.greaterThan(0) && !parsedAmounts[Field.INPUT]?.equalTo(maxInputAmount))

  // the callback to execute the swap
  const { callback: swapCallback, error: swapCallbackError } = useSwapCallback(
    trade,
    allowedSlippage,
    recipient,
    signatureData
  )

  const [singleHopOnly] = useUserSingleHopOnly()

  const handleSwap = useCallback(() => {
    if (!swapCallback) {
      return
    }
    if (priceImpact && !confirmPriceImpactWithoutFee(priceImpact)) {
      return
    }
    setSwapState({ attemptingTxn: true, tradeToConfirm, showConfirm, swapErrorMessage: undefined, txHash: undefined })
    swapCallback()
      .then((hash) => {
        setSwapState({ attemptingTxn: false, tradeToConfirm, showConfirm, swapErrorMessage: undefined, txHash: hash })
        ReactGA.event({
          category: 'Swap',
          action:
            recipient === null
              ? 'Swap w/o Send'
              : (recipientAddress ?? recipient) === account
              ? 'Swap w/o Send + recipient'
              : 'Swap w/ Send',
          label: [
            trade?.inputAmount?.currency?.symbol,
            trade?.outputAmount?.currency?.symbol,
            getTradeVersion(trade),
            'MH',
          ].join('/'),
        })
      })
      .catch((error) => {
        setSwapState({
          attemptingTxn: false,
          tradeToConfirm,
          showConfirm,
          swapErrorMessage: error.message,
          txHash: undefined,
        })
      })
  }, [
    swapCallback,
    priceImpact,
    tradeToConfirm,
    showConfirm,
    recipient,
    recipientAddress,
    account,
    trade,
    singleHopOnly,
  ])

  // errors
  const [showInverted, setShowInverted] = useState<boolean>(false)

  // warnings on the greater of fiat value price impact and execution price impact
  const priceImpactSeverity = useMemo(() => {
    const executionPriceImpact = trade?.priceImpact
    return warningSeverity(
      executionPriceImpact && priceImpact
        ? executionPriceImpact.greaterThan(priceImpact)
          ? executionPriceImpact
          : priceImpact
        : executionPriceImpact ?? priceImpact
    )
  }, [priceImpact, trade])

  // show approve flow when: no error on inputs, not approved or pending, or approved in current session
  // never show if price impact is above threshold in non expert mode
  const showApproveFlow =
    !swapInputError &&
    (approvalState === ApprovalState.NOT_APPROVED ||
      approvalState === ApprovalState.PENDING ||
      (approvalSubmitted && approvalState === ApprovalState.APPROVED)) &&
    !(priceImpactSeverity > 3 && !isExpertMode)

  const handleConfirmDismiss = useCallback(() => {
    setSwapState({ showConfirm: false, tradeToConfirm, attemptingTxn, swapErrorMessage, txHash })
    // if there was a tx hash, we want to clear the input
    if (txHash) {
      onUserInput(Field.INPUT, '')
    }
  }, [attemptingTxn, onUserInput, swapErrorMessage, tradeToConfirm, txHash])

  const handleAcceptChanges = useCallback(() => {
    setSwapState({ tradeToConfirm: trade, swapErrorMessage, txHash, attemptingTxn, showConfirm })
  }, [attemptingTxn, showConfirm, swapErrorMessage, trade, txHash])

  const handleInputSelect = useCallback(
    (inputCurrency) => {
      setApprovalSubmitted(false) // reset 2 step UI for approvals
      onCurrencySelection(Field.INPUT, inputCurrency)
    },
    [onCurrencySelection]
  )

  const handleMaxInput = useCallback(() => {
    maxInputAmount && onUserInput(Field.INPUT, maxInputAmount.toExact())
    ReactGA.event({
      category: 'Swap',
      action: 'Max',
    })
  }, [maxInputAmount, onUserInput])

  const handleOutputSelect = useCallback(
    (outputCurrency) => {
      onCurrencySelection(Field.OUTPUT, outputCurrency)
    },
    [onCurrencySelection]
  )

  const swapIsUnsupported = useIsSwapUnsupported(currencies?.INPUT, currencies?.OUTPUT)

  //TODO
  const priceImpactTooHigh = priceImpactSeverity > 3 && !isExpertMode

  return (
    <>
      <Helmet>
        <title>Algebra — Swap</title>
      </Helmet>
      <TokenWarningModal
        isOpen={importTokensNotInDefault.length > 0 && !dismissTokenWarning}
        tokens={importTokensNotInDefault}
        onConfirm={handleConfirmTokenWarning}
        onDismiss={handleDismissTokenWarning}
      />
      <NetworkAlert />
      <AppBody>
        <SwapHeader allowedSlippage={allowedSlippage} dynamicFee={dynamicFee} />
        <Wrapper id="swap-page">
          <ConfirmSwapModal
            isOpen={showConfirm}
            trade={trade}
            originalTrade={tradeToConfirm}
            onAcceptChanges={handleAcceptChanges}
            attemptingTxn={attemptingTxn}
            txHash={txHash}
            recipient={recipient}
            allowedSlippage={allowedSlippage}
            onConfirm={handleSwap}
            swapErrorMessage={swapErrorMessage}
            onDismiss={handleConfirmDismiss}
          />

          <AutoColumn gap={'md'}>
            <div style={{ padding: '5px', backgroundColor: 'rgba(50,50,50,0.6)', borderRadius: '14px' }}>
              <CurrencyInputPanel
                label={
                  independentField === Field.OUTPUT && !showWrap ? <Trans>From (at most)</Trans> : <Trans>From</Trans>
                }
                value={formattedAmounts[Field.INPUT]}
                showMaxButton={showMaxButton}
                currency={currencies[Field.INPUT]}
                onUserInput={handleTypeInput}
                onMax={handleMaxInput}
                fiatValue={fiatValueInput ?? undefined}
                onCurrencySelect={handleInputSelect}
                otherCurrency={currencies[Field.OUTPUT]}
                showCommonBases={true}
                id="swap-currency-input"
                locked={false}
                hideCurrency={false}
                hideInput={false}
                showBalance={true}
                disabled={false}
                shallow={false}
                swap
              />
              <ArrowWrapper
                clickable
                onClick={() => {
                  setApprovalSubmitted(false) // reset 2 step UI for approvals
                  onSwitchTokens()
                }}
              >
                <svg width="11" height="21" viewBox="0 0 11 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M10.0287 6.01207C10.2509 6.2384 10.6112 6.2384 10.8334 6.01207C11.0555 5.78575 11.0555 5.4188 10.8334 5.19247L5.90232 0.169745C5.68012 -0.0565819 5.31988 -0.0565819 5.09768 0.169745L0.166647 5.19247C-0.055548 5.4188 -0.055548 5.78575 0.166647 6.01207C0.388841 6.2384 0.749091 6.2384 0.971286 6.01207L5.5 1.39915L10.0287 6.01207Z"
                    fill="#031F34"
                  />
                  <path
                    d="M10.0287 14.9879C10.2509 14.7616 10.6112 14.7616 10.8334 14.9879C11.0555 15.2143 11.0555 15.5812 10.8334 15.8075L5.90232 20.8303C5.68012 21.0566 5.31988 21.0566 5.09768 20.8303L0.166646 15.8075C-0.0555484 15.5812 -0.0555484 15.2143 0.166646 14.9879C0.388841 14.7616 0.749091 14.7616 0.971285 14.9879L5.5 19.6009L10.0287 14.9879Z"
                    fill="#031F34"
                  />
                </svg>
              </ArrowWrapper>
              <CurrencyInputPanel
                value={formattedAmounts[Field.OUTPUT]}
                onUserInput={handleTypeOutput}
                label={independentField === Field.INPUT && !showWrap ? <Trans>To (at least)</Trans> : <Trans>To</Trans>}
                showMaxButton={true}
                hideBalance={false}
                fiatValue={fiatValueOutput ?? undefined}
                priceImpact={priceImpact}
                currency={currencies[Field.OUTPUT]}
                onCurrencySelect={handleOutputSelect}
                otherCurrency={currencies[Field.INPUT]}
                showCommonBases={true}
                id="swap-currency-output"
                locked={false}
                hideCurrency={false}
                hideInput={false}
                showBalance={true}
                disabled={false}
                shallow={false}
                swap
              />
            </div>

            {recipient !== null && !showWrap ? (
              <>
                <AutoRow justify="space-between" style={{ padding: '0 1rem' }}>
                  <ArrowWrapper clickable={false}>
                    <ArrowDown size="16" color={theme.text2} />
                  </ArrowWrapper>
                  <LinkStyledButton id="remove-recipient-button" onClick={() => onChangeRecipient(null)}>
                    <Trans>- Remove send</Trans>
                  </LinkStyledButton>
                </AutoRow>
                <AddressInputPanel id="recipient" value={recipient} onChange={onChangeRecipient} />
              </>
            ) : null}

            {showWrap ? null : (
              <Row style={{ justifyContent: !trade ? 'center' : 'space-between' }}>
                {trade ? (
                  <RowFixed>
                    <TradePrice
                      price={trade.executionPrice}
                      showInverted={showInverted}
                      setShowInverted={setShowInverted}
                    />
                    <MouseoverTooltipContent
                      onOpen={() => {
                        ReactGA.event({
                          category: 'Swap',
                          action: 'Transaction Details Tooltip Open',
                        })
                      }}
                      content={<AdvancedSwapDetails trade={trade} allowedSlippage={allowedSlippage} />}
                    >
                      <StyledInfo />
                    </MouseoverTooltipContent>
                  </RowFixed>
                ) : null}
              </Row>
            )}

            <div>
              {swapIsUnsupported ? (
                <ButtonPrimary disabled={true} style={{ backgroundColor: '#0e0a19' }}>
                  <TYPE.main mb="4px">
                    <Trans>Unsupported Asset</Trans>
                  </TYPE.main>
                </ButtonPrimary>
              ) : !account ? (
                <ButtonLight
                  style={{
                    backgroundColor: theme.winterMainButton,
                    color: 'white',
                  }}
                  onClick={toggleWalletModal}
                >
                  <Trans>Connect Wallet</Trans>
                </ButtonLight>
              ) : showWrap ? (
                <ButtonPrimary disabled={Boolean(wrapInputError)} onClick={onWrap}>
                  {wrapInputError ??
                    (wrapType === WrapType.WRAP ? (
                      <Trans>Wrap</Trans>
                    ) : wrapType === WrapType.UNWRAP ? (
                      <Trans>Unwrap</Trans>
                    ) : null)}
                </ButtonPrimary>
              ) : routeNotFound && userHasSpecifiedInputOutput ? (
                <GreyCard style={{ textAlign: 'center', backgroundColor: '#0e0a19' }}>
                  <TYPE.main mb="4px">
                    {isLoadingRoute ? (
                      <Dots>
                        <Trans>Loading</Trans>
                      </Dots>
                    ) : singleHopOnly ? (
                      <Trans>Insufficient liquidity for this trade. Try enabling multi-hop trades.</Trans>
                    ) : (
                      <Trans>Insufficient liquidity for this trade.</Trans>
                    )}
                  </TYPE.main>
                </GreyCard>
              ) : showApproveFlow ? (
                <AutoRow style={{ flexWrap: 'nowrap', width: '100%' }}>
                  <AutoColumn style={{ width: '100%' }} gap="12px">
                    <ButtonConfirmed
                      onClick={handleApprove}
                      disabled={
                        approvalState !== ApprovalState.NOT_APPROVED ||
                        approvalSubmitted ||
                        signatureState === UseERC20PermitState.SIGNED
                      }
                      style={{ background: theme.winterMainButton, color: 'white' }}
                      width="100%"
                      altDisabledStyle={approvalState === ApprovalState.PENDING} // show solid button while waiting
                      confirmed={
                        approvalState === ApprovalState.APPROVED || signatureState === UseERC20PermitState.SIGNED
                      }
                    >
                      <AutoRow
                        justify="space-between"
                        style={{
                          flexWrap: 'nowrap',
                          display: 'flex',
                          justifyContent: 'center',
                          background: theme.winterMainButton,
                          color: 'white',
                        }}
                      >
                        <span
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            background: theme.winterMainButton,
                            color: 'white',
                          }}
                        >
                          <CurrencyLogo
                            currency={currencies[Field.INPUT]}
                            size={'24px'}
                            style={{ marginRight: '8px', flexShrink: 0 }}
                          />
                          {/* we need to shorten this string on mobile */}
                          {approvalState === ApprovalState.APPROVED || signatureState === UseERC20PermitState.SIGNED ? (
                            <Trans>You can now trade {currencies[Field.INPUT]?.symbol}</Trans>
                          ) : (
                            <Trans>Allow Algebra to use your {currencies[Field.INPUT]?.symbol}</Trans>
                          )}
                        </span>
                        {approvalState === ApprovalState.PENDING ? (
                          <Loader stroke="white" style={{ marginLeft: '5px' }} />
                        ) : (approvalSubmitted && approvalState === ApprovalState.APPROVED) ||
                          signatureState === UseERC20PermitState.SIGNED ? (
                          <CheckCircle size="20" style={{ marginLeft: '5px' }} color={theme.green1} />
                        ) : (
                          <MouseoverTooltip
                            text={
                              <Trans>
                                You must give the Algebra smart contracts permission to use your{' '}
                                {currencies[Field.INPUT]?.symbol}. You only have to do this once per token.
                              </Trans>
                            }
                          >
                            <HelpCircle size="20" color={'white'} style={{ marginLeft: '8px' }} />
                          </MouseoverTooltip>
                        )}
                      </AutoRow>
                    </ButtonConfirmed>
                    <ButtonError
                      onClick={() => {
                        if (isExpertMode) {
                          handleSwap()
                        } else {
                          setSwapState({
                            tradeToConfirm: trade,
                            attemptingTxn: false,
                            swapErrorMessage: undefined,
                            showConfirm: true,
                            txHash: undefined,
                          })
                        }
                      }}
                      style={{
                        backgroundColor:
                          !isValid ||
                          (approvalState !== ApprovalState.APPROVED && signatureState !== UseERC20PermitState.SIGNED) ||
                          priceImpactTooHigh ||
                          priceImpactSeverity
                            ? '#200714'
                            : theme.winterMainButton,
                        color:
                          !isValid ||
                          (approvalState !== ApprovalState.APPROVED && signatureState !== UseERC20PermitState.SIGNED) ||
                          priceImpactTooHigh ||
                          priceImpactSeverity
                            ? '#8a255a'
                            : 'white',
                        border:
                          !isValid ||
                          (approvalState !== ApprovalState.APPROVED && signatureState !== UseERC20PermitState.SIGNED) ||
                          priceImpactTooHigh ||
                          priceImpactSeverity
                            ? '1px solid #2d1421'
                            : `1px solid ${({ theme }) => theme.winterMainButton}`,
                      }}
                      width="100%"
                      id="swap-button"
                      disabled={
                        !isValid ||
                        (approvalState !== ApprovalState.APPROVED && signatureState !== UseERC20PermitState.SIGNED) ||
                        priceImpactTooHigh
                      }
                      error={isValid && priceImpactSeverity > 2}
                    >
                      <Text fontSize={16} fontWeight={500}>
                        {priceImpactTooHigh ? (
                          <Trans>High Price Impact</Trans>
                        ) : priceImpactSeverity > 2 ? (
                          <Trans>Swap Anyway</Trans>
                        ) : (
                          <Trans>Swap</Trans>
                        )}
                      </Text>
                    </ButtonError>
                  </AutoColumn>
                </AutoRow>
              ) : (
                <ButtonError
                  onClick={() => {
                    if (isExpertMode) {
                      handleSwap()
                    } else {
                      setSwapState({
                        tradeToConfirm: trade,
                        attemptingTxn: false,
                        swapErrorMessage: undefined,
                        showConfirm: true,
                        txHash: undefined,
                      })
                    }
                  }}
                  id="swap-button"
                  disabled={!isValid || priceImpactTooHigh || !!swapCallbackError}
                  error={isValid && priceImpactSeverity > 2 && !swapCallbackError}
                >
                  <Text fontSize={20} fontWeight={500}>
                    {swapInputError ? (
                      swapInputError
                    ) : priceImpactTooHigh ? (
                      <Trans>Price Impact Too High</Trans>
                    ) : priceImpactSeverity > 2 ? (
                      <Trans>Swap Anyway</Trans>
                    ) : (
                      <Trans>Swap</Trans>
                    )}
                  </Text>
                </ButtonError>
              )}
              {isExpertMode && swapErrorMessage ? <SwapCallbackError error={swapErrorMessage} /> : null}
            </div>
          </AutoColumn>
        </Wrapper>
      </AppBody>
      <SwitchLocaleLink />
      {!swapIsUnsupported ? null : (
        <UnsupportedCurrencyFooter show={swapIsUnsupported} currencies={[currencies.INPUT, currencies.OUTPUT]} />
      )}
    </>
  )
}
