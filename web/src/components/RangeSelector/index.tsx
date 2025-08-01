import { Trans } from '@lingui/macro'
import { Currency, Price, Token } from '@uniswap/sdk-core'
import StepCounter from 'components/InputStepCounter/InputStepCounter'
import { AutoColumn } from 'components/Column'
import { Bound } from 'state/mint/v3/actions'
import { RowBetweenSrtyled } from './styled'


interface RangeSelectorProps {
    priceLower?: Price<Token, Token>
    priceUpper?: Price<Token, Token>
    getDecrementLower: () => string
    getIncrementLower: () => string
    getDecrementUpper: () => string
    getIncrementUpper: () => string
    onLeftRangeInput: (typedValue: string) => void
    onRightRangeInput: (typedValue: string) => void
    currencyA?: Currency | null
    currencyB?: Currency | null
    feeAmount?: number
    ticksAtLimit: { [bound in Bound]?: boolean | undefined }
    initial: boolean
    disabled: boolean
}

// currencyA is the base token
export default function RangeSelector({
    priceLower,
    priceUpper,
    onLeftRangeInput,
    onRightRangeInput,
    getDecrementLower,
    getIncrementLower,
    getDecrementUpper,
    getIncrementUpper,
    currencyA,
    currencyB,
    feeAmount,
    ticksAtLimit,
    initial,
    disabled
}: RangeSelectorProps) {
    const tokenA = (currencyA ?? undefined)?.wrapped
    const tokenB = (currencyB ?? undefined)?.wrapped
    const isSorted = tokenA && tokenB && tokenA.sortsBefore(tokenB)

    const leftPrice = isSorted ? priceLower : priceUpper?.invert()
    const rightPrice = isSorted ? priceUpper : priceLower?.invert()

    return (
        <AutoColumn gap='md'>
            <RowBetweenSrtyled style={{ flexDirection: initial ? 'row' : 'column' }}>
                <StepCounter
                    value={ticksAtLimit[Bound.LOWER] ? '0' : leftPrice?.toSignificant(5) ?? ''}
                    onUserInput={onLeftRangeInput}
                    width='100%'
                    decrement={isSorted ? getDecrementLower : getIncrementUpper}
                    increment={isSorted ? getIncrementLower : getDecrementUpper}
                    decrementDisabled={ticksAtLimit[Bound.LOWER]}
                    incrementDisabled={ticksAtLimit[Bound.LOWER]}
                    feeAmount={feeAmount}
                    label={leftPrice ? `${currencyB?.symbol}` : '-'}
                    title={<Trans>Min Price</Trans>}
                    tokenA={currencyA?.symbol}
                    tokenB={currencyB?.symbol}
                    initial={initial}
                    disabled={disabled}
                    style={{ marginTop: '1rem' }}
                />
                <StepCounter
                    value={ticksAtLimit[Bound.UPPER] ? '∞' : rightPrice?.toSignificant(5) ?? ''}
                    onUserInput={onRightRangeInput}
                    width='100%'
                    decrement={isSorted ? getDecrementUpper : getIncrementLower}
                    increment={isSorted ? getIncrementUpper : getDecrementLower}
                    incrementDisabled={ticksAtLimit[Bound.UPPER]}
                    decrementDisabled={ticksAtLimit[Bound.UPPER]}
                    feeAmount={feeAmount}
                    label={rightPrice ? `${currencyB?.symbol}` : '-'}
                    tokenA={currencyA?.symbol}
                    tokenB={currencyB?.symbol}
                    title={<Trans>Max Price</Trans>}
                    initial={initial}
                    disabled={disabled}
                />
            </RowBetweenSrtyled>
        </AutoColumn>
    )
}
