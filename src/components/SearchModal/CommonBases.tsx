import { Trans } from '@lingui/macro'
import { Text } from 'rebass'
import { Currency } from '@uniswap/sdk-core'
import styled from 'styled-components/macro'

import { COMMON_BASES } from '../../constants/routing'
import { currencyId } from '../../utils/currencyId'
import { AutoColumn } from '../Column'
import QuestionHelper from '../QuestionHelper'
import { AutoRow } from '../Row'
import CurrencyLogo from '../CurrencyLogo'
import { useActiveWeb3React } from '../../hooks/web3'
import { SupportedChainId } from '../../constants/chains'

const MobileWrapper = styled(AutoColumn)`
  // ${({ theme }) => theme.mediaWidth.upToSmall`
  //   display: none;
  // `};
`

const BaseWrapper = styled.div<{ disable?: boolean }>`
  border: 1px solid ${({ theme, disable }) => (disable ? 'transparent' : '#3881a5')};
  border-radius: 10px;
  display: flex;
  padding: 6px;

  align-items: center;
  :hover {
    cursor: ${({ disable }) => !disable && 'pointer'};
    background-color: ${({ theme, disable }) => !disable && '#9ddcfb'};
  }

  color: ${({ theme, disable }) => disable && theme.text3};
  background-color: ${({ theme, disable }) => disable && '#e5e5e5'};
  filter: ${({ disable }) => disable && 'grayscale(1)'};
`

export default function CommonBases({
  _chainId,
  onSelect,
  selectedCurrency,
}: {
  _chainId?: number
  selectedCurrency?: Currency | null
  onSelect: (currency: Currency) => void
}) {
  // const bases = typeof _chainId !== 'undefined' ? COMMON_BASES[_chainId] ?? [] : []
  const bases = COMMON_BASES[SupportedChainId.POLYGON]

  const { chainId } = useActiveWeb3React()

  return bases.length > 0 ? (
    <MobileWrapper gap="md">
      <AutoRow>
        <Text fontWeight={500} fontSize={14}>
          <Trans>Common bases</Trans>
        </Text>
      </AutoRow>
      <AutoRow gap="4px">
        {bases.map((currency: Currency) => {
          const isSelected = selectedCurrency?.equals(currency)
          return (
            <BaseWrapper
              onClick={() => !isSelected && onSelect(currency)}
              disable={isSelected}
              key={currencyId(currency, chainId)}
            >
              <CurrencyLogo currency={currency} style={{ marginRight: 8 }} />
              <Text fontWeight={500} fontSize={16}>
                {currency.symbol}
              </Text>
            </BaseWrapper>
          )
        })}
      </AutoRow>
    </MobileWrapper>
  ) : null
}
