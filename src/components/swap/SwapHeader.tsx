import { Trans } from '@lingui/macro'
import SettingsTab from '../Settings'
import { Percent } from '@uniswap/sdk-core'
import { RowBetween, RowFixed } from '../Row'
import { TYPE } from '../../theme'
import { StyledSwapHeader } from './styled'

export default function SwapHeader({
                                     allowedSlippage,
                                     dynamicFee = null
                                   }: {
  allowedSlippage: Percent
  dynamicFee: number | null
}) {
  return (
    <StyledSwapHeader>
      <RowBetween>
        <RowFixed style={{ justifyContent: 'space-between', width: '100%', minHeight: '30px' }}>
          <TYPE.black fontWeight={500} fontSize={16} style={{ marginRight: '8px' }}>
            <Trans>Swap</Trans>
          </TYPE.black>
          {dynamicFee && (
            <TYPE.black
              fontWeight={500}
              fontSize={16}
              style={{ marginRight: '8px', padding: '4px 6px', borderRadius: '6px', backgroundColor: '#426de1' }}
            >
              <Trans>{`Fee is ${dynamicFee / 10000}%`}</Trans>
            </TYPE.black>
          )}
        </RowFixed>
        <RowFixed>
          <SettingsTab placeholderSlippage={allowedSlippage} />
        </RowFixed>
      </RowBetween>
    </StyledSwapHeader>
  )
}
