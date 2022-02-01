import { useState } from 'react'
import { TYPE, CloseIcon, ExternalLink } from 'theme'
import { ButtonEmpty } from 'components/Button'
import Modal from 'components/Modal'
import Card, { OutlineCard } from 'components/Card'
import { RowBetween, AutoRow } from 'components/Row'
import { AutoColumn } from 'components/Column'
import CurrencyLogo from 'components/CurrencyLogo'
import { useActiveWeb3React } from 'hooks/web3'
import { Currency, Token } from '@uniswap/sdk-core'
import { useUnsupportedTokens } from '../../hooks/Tokens'
import { ExplorerDataType, getExplorerLink } from '../../utils/getExplorerLink'
import { Trans } from '@lingui/macro'
import { DetailsFooter, AddressText } from './styled'

export default function UnsupportedCurrencyFooter({
  show,
  currencies,
}: {
  show: boolean
  currencies: (Currency | undefined)[]
}) {
  const { chainId } = useActiveWeb3React()
  const [showDetails, setShowDetails] = useState(false)

  const tokens =
    chainId && currencies
      ? currencies.map((currency) => {
          return currency?.wrapped
        })
      : []

  const unsupportedTokens: { [address: string]: Token } = useUnsupportedTokens()

  return (
    <DetailsFooter show={show}>
      <Modal isOpen={showDetails} onDismiss={() => setShowDetails(false)}>
        <Card padding="2rem">
          <AutoColumn gap="lg">
            <RowBetween>
              <TYPE.mediumHeader>
                <Trans>Unsupported Assets</Trans>
              </TYPE.mediumHeader>
              <CloseIcon onClick={() => setShowDetails(false)} />
            </RowBetween>
            {tokens.map((token) => {
              return (
                token &&
                unsupportedTokens &&
                Object.keys(unsupportedTokens).includes(token.address) && (
                  <OutlineCard key={token.address?.concat('not-supported')}>
                    <AutoColumn gap="10px">
                      <AutoRow gap="5px" align="center">
                        <CurrencyLogo currency={token} size={'24px'} />
                        <TYPE.body fontWeight={500}>{token.symbol}</TYPE.body>
                      </AutoRow>
                      {chainId && (
                        <ExternalLink href={getExplorerLink(chainId, token.address, ExplorerDataType.ADDRESS)}>
                          <AddressText>{token.address}</AddressText>
                        </ExternalLink>
                      )}
                    </AutoColumn>
                  </OutlineCard>
                )
              )
            })}
            <AutoColumn gap="lg">
              <TYPE.body fontWeight={500}>
                <Trans>
                  Some assets are not available through this interface because they may not work well with the smart
                  contracts or we are unable to allow trading for legal reasons.
                </Trans>
              </TYPE.body>
            </AutoColumn>
          </AutoColumn>
        </Card>
      </Modal>
      <ButtonEmpty padding={'0'} onClick={() => setShowDetails(true)}>
        <TYPE.blue>
          <Trans>Read more about unsupported assets</Trans>
        </TYPE.blue>
      </ButtonEmpty>
    </DetailsFooter>
  )
}
