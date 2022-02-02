import { Bound, Field } from '../../state/mint/v3/actions'
import { AutoColumn } from 'components/Column'
import { Currency, CurrencyAmount, Price } from '@uniswap/sdk-core'
import { Position } from 'lib/src'
import { PositionPreview } from 'components/PositionPreview'
import { ReviewWrapper } from './styled'

export function Review({
                         position,
                         outOfRange,
                         ticksAtLimit
                       }: {
  position?: Position
  existingPosition?: Position
  parsedAmounts: { [field in Field]?: CurrencyAmount<Currency> }
  priceLower?: Price<Currency, Currency>
  priceUpper?: Price<Currency, Currency>
  outOfRange: boolean
  ticksAtLimit: { [bound in Bound]?: boolean | undefined }
}) {
  return (
    <ReviewWrapper>
      <AutoColumn gap='lg'>
        {position ? (
          <PositionPreview
            position={position}
            inRange={!outOfRange}
            ticksAtLimit={ticksAtLimit}
            title={'Selected Range'}
          />
        ) : null}
      </AutoColumn>
    </ReviewWrapper>
  )
}
