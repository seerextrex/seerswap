import { Currency, Percent, TradeType } from '@uniswap/sdk-core'
import { Trade as V2Trade } from '@uniswap/v2-sdk'
import { Trade as V3Trade } from 'lib/src'
import { useContext, useState } from 'react'
import { AlertTriangle } from 'react-feather'
import { Text } from 'rebass'
import { ThemeContext } from 'styled-components/macro'
import { useUSDCValue } from '../../hooks/useUSDCPrice'
import { TYPE } from '../../theme'
import { ButtonPrimary } from '../Button'
import { isAddress, shortenAddress } from '../../utils'
import { computeFiatValuePriceImpact } from '../../utils/computeFiatValuePriceImpact'
import { FiatValue } from '../CurrencyInputPanel/FiatValue'
import CurrencyLogo from '../CurrencyLogo'
import { RowBetween, RowFixed } from '../Row'
import { SwapModalHeaderArrowWrapper, SwapShowAcceptChanges, TruncatedText } from './styled'
import { Trans } from '@lingui/macro'
import { AdvancedSwapDetails } from './AdvancedSwapDetails'
import { LightCard } from '../Card'
import TradePrice from '../swap/TradePrice'
import { WrappedCurrency } from '../../models/types'
import Card from '../../shared/components/Card/Card'

interface SwapModalHeaderProps {
    trade: V2Trade<Currency, Currency, TradeType> | V3Trade<Currency, Currency, TradeType>
    allowedSlippage: Percent
    recipient: string | null
    showAcceptChanges: boolean
    onAcceptChanges: () => void
}

export default function SwapModalHeader({ trade, allowedSlippage, recipient, showAcceptChanges, onAcceptChanges }: SwapModalHeaderProps) {
    const theme = useContext(ThemeContext)

    const [showInverted, setShowInverted] = useState<boolean>(false)

    const fiatValueInput = useUSDCValue(trade.inputAmount)
    const fiatValueOutput = useUSDCValue(trade.outputAmount)

    return (
        <div>
            <Card isDark classes={'p-1 br-12 mv-05'}>
                <div className={'flex-s-between mb-05'}>
                    <span className={'fs-085'}>
                        <Trans>From</Trans>
                    </span>
                    <FiatValue fiatValue={fiatValueInput} />
                </div>
                <div className={'flex-s-between'}>
                    <div className={'f f-ac'}>
                        <span className={'mr-05'}>
                            <CurrencyLogo currency={trade.inputAmount.currency as WrappedCurrency} size={'1.5rem'} />
                        </span>
                        <Text fontSize={20} fontWeight={500}>
                            {trade.inputAmount.currency.symbol}
                        </Text>
                    </div>
                    <RowFixed gap={'0px'}>
                        <TruncatedText
                            fontSize={24}
                            fontWeight={500}
                            color={showAcceptChanges && trade.tradeType === TradeType.EXACT_OUTPUT ? theme.primary1 : ''}
                        >
                            {trade.inputAmount.toSignificant(6)}
                        </TruncatedText>
                    </RowFixed>
                </div>
            </Card>
            <SwapModalHeaderArrowWrapper>
                {/* <ArrowDown size="16" color={theme.text2} /> */}
                <svg width='11' height='21' viewBox='0 0 11 21' fill='none'
                     xmlns='http://www.w3.org/2000/svg'>
                    <path
                        d='M10.0287 6.01207C10.2509 6.2384 10.6112 6.2384 10.8334 6.01207C11.0555 5.78575 11.0555 5.4188 10.8334 5.19247L5.90232 0.169745C5.68012 -0.0565819 5.31988 -0.0565819 5.09768 0.169745L0.166647 5.19247C-0.055548 5.4188 -0.055548 5.78575 0.166647 6.01207C0.388841 6.2384 0.749091 6.2384 0.971286 6.01207L5.5 1.39915L10.0287 6.01207Z'
                        fill='#70796D'
                    />
                    <path
                        d='M10.0287 14.9879C10.2509 14.7616 10.6112 14.7616 10.8334 14.9879C11.0555 15.2143 11.0555 15.5812 10.8334 15.8075L5.90232 20.8303C5.68012 21.0566 5.31988 21.0566 5.09768 20.8303L0.166646 15.8075C-0.0555484 15.5812 -0.0555484 15.2143 0.166646 14.9879C0.388841 14.7616 0.749091 14.7616 0.971285 14.9879L5.5 19.6009L10.0287 14.9879Z'
                        fill='#70796D'
                    />
                </svg>
            </SwapModalHeaderArrowWrapper>
            <Card isDark classes={'p-1 br-12 mv-05'}>
                <div className={'flex-s-between fs-085 mb-05'}>
                    <Trans>To</Trans>
                    <FiatValue
                        fiatValue={fiatValueOutput}
                        priceImpact={computeFiatValuePriceImpact(fiatValueInput, fiatValueOutput)}
                    />
                </div>
                <div className={'flex-s-between'}>
                    <div className={'f f-ac'}>
                        <span className={'mr-05'}>
                            <CurrencyLogo currency={trade.outputAmount.currency as WrappedCurrency} size={'1.5rem'} />
                        </span>
                        <Text fontSize={20} fontWeight={500}>{trade.outputAmount.currency.symbol}</Text>
                    </div>
                    <RowFixed gap={'0px'}>
                        <TruncatedText fontSize={24} fontWeight={500}>
                            {trade.outputAmount.toSignificant(6)}
                        </TruncatedText>
                    </RowFixed>
                </div>
            </Card>
            <div className={'flex-s-between c-p fs-085 ph-05'}>
                <Trans>Price</Trans>
                <TradePrice price={trade.executionPrice} showInverted={showInverted} setShowInverted={setShowInverted} />
            </div>

            <Card isDark classes={'p-1 br-12 mv-05'}>
                <AdvancedSwapDetails trade={trade} allowedSlippage={allowedSlippage} />
            </Card>

            {showAcceptChanges ? (
                <SwapShowAcceptChanges justify='flex-start' gap={'0px'}>
                    <RowBetween>
                        <RowFixed>
                            <AlertTriangle size={20} style={{ marginRight: '8px', minWidth: 24 }} />
                            <TYPE.main color={'var(--primary)'}>
                                <Trans>Price Updated</Trans>
                            </TYPE.main>
                        </RowFixed>
                        <ButtonPrimary
                            style={{
                                padding: '.5rem',
                                width: 'fit-content',
                                fontSize: '0.825rem',
                                borderRadius: '12px'
                            }}
                            onClick={onAcceptChanges}
                        >
                            <Trans>Accept</Trans>
                        </ButtonPrimary>
                    </RowBetween>
                </SwapShowAcceptChanges>
            ) : null}

            <div>
                {trade.tradeType === TradeType.EXACT_INPUT ? (
                    <TYPE.italic color={'var(--primary)'} fontWeight={400}
                                 textAlign='left' style={{ width: '100%' }}>
                        <Trans>
                            Output is estimated. You will receive at least{' '}
                            <b>
                                {trade.minimumAmountOut(allowedSlippage).toSignificant(6)} {trade.outputAmount.currency.symbol}
                            </b>{' '}
                            or the transaction will revert.
                        </Trans>
                    </TYPE.italic>
                ) : (
                    <TYPE.italic color={'var(--primary)'} fontWeight={400}
                                 textAlign='left' style={{ width: '100%' }}>
                        <Trans>
                            Input is estimated. You will sell at most{' '}
                            <b>
                                {trade.maximumAmountIn(allowedSlippage).toSignificant(6)} {trade.inputAmount.currency.symbol}
                            </b>{' '}
                            or the transaction will revert.
                        </Trans>
                    </TYPE.italic>
                )}
            </div>
            {recipient !== null ? (
                <div>
                    <TYPE.main color={'var(--primary)'}>
                        <Trans>
                            Output will be sent to{' '}
                            <b title={recipient}>{isAddress(recipient) ? shortenAddress(recipient) : recipient}</b>
                        </Trans>
                    </TYPE.main>
                </div>
            ) : null}
        </div>
    )
}
