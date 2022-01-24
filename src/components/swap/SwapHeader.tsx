import { Trans } from '@lingui/macro'
import styled from 'styled-components/macro'
import SettingsTab from '../Settings'
import { Percent } from '@uniswap/sdk-core'

import { RowBetween, RowFixed } from '../Row'
import { TYPE } from '../../theme'
import { useEffect, useRef } from 'react'

const StyledSwapHeader = styled.div`
  padding: 30px 40px 16px 40px;
  width: 100%;
  color: ${({ theme }) => theme.text2};
`

function usePrevious(value) {
  const ref = useRef()
  useEffect(() => {
    ref.current = value
  })
  return ref.current
}

export default function SwapHeader({
  allowedSlippage,
  dynamicFee = null,
}: {
  allowedSlippage: Percent
  dynamicFee: number
}) {
  return (
    <StyledSwapHeader>
      <RowBetween>
        <RowFixed style={{ justifyContent: 'space-between', width: '100%', minHeight: '30px'}}>
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
