import { Trans } from '@lingui/macro'
import { Text } from 'rebass'
import { Currency } from '@uniswap/sdk-core'
import { COMMON_BASES } from '../../constants/routing'
import { currencyId } from '../../utils/currencyId'
import { AutoRow } from '../Row'
import CurrencyLogo from '../CurrencyLogo'
import { useActiveWeb3React } from '../../hooks/web3'
import { SupportedChainId } from '../../constants/chains'
import { BaseWrapper, MobileWrapper } from './styled'

export default function CommonBases({
                                      onSelect,
                                      selectedCurrency
                                    }: {
  selectedCurrency?: Currency | null
  onSelect: (currency: Currency) => void
}) {

  const bases = COMMON_BASES[SupportedChainId.POLYGON]

  const { chainId } = useActiveWeb3React()

  return bases.length > 0 ? (
    <MobileWrapper gap='md'>
      <AutoRow>
        <Text fontWeight={500} fontSize={14}>
          <Trans>Common bases</Trans>
        </Text>
      </AutoRow>
      <AutoRow gap='4px'>
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
