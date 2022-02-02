import { CSSProperties } from 'react'
import { Token } from '@uniswap/sdk-core'
import { AutoRow, RowFixed } from 'components/Row'
import { AutoColumn } from 'components/Column'
import CurrencyLogo from 'components/CurrencyLogo'
import { TYPE } from 'theme'
import useTheme from 'hooks/useTheme'
import { ButtonPrimary } from 'components/Button'
import { useIsUserAddedToken, useIsTokenActive } from 'hooks/Tokens'
import { Trans } from '@lingui/macro'
import { TokenSection, CheckIcon, NameOverflow } from './styled'

export default function ImportRow({
                                    token,
                                    style,
                                    dim,
                                    showImportView,
                                    setImportToken
                                  }: {
  token: Token
  style?: CSSProperties
  dim?: boolean
  showImportView: () => void
  setImportToken: (token: Token) => void
}) {
  const theme = useTheme()

  // check if already active on list or local storage tokens
  const isAdded = useIsUserAddedToken(token)
  const isActive = useIsTokenActive(token)

  return (
    <TokenSection style={style}>
      <CurrencyLogo currency={token} size={'24px'} style={{ opacity: dim ? '0.6' : '1' }} />
      <AutoColumn gap='4px' style={{ opacity: dim ? '0.6' : '1' }}>
        <AutoRow>
          <TYPE.body style={{ color: '#080064' }} fontWeight={500}>
            {token.symbol}
          </TYPE.body>
          <TYPE.darkGray ml='8px' fontWeight={300}>
            <NameOverflow style={{ color: '#080064' }} title={token.name}>
              {token.name}
            </NameOverflow>
          </TYPE.darkGray>
        </AutoRow>
      </AutoColumn>
      {!isActive && !isAdded ? (
        <ButtonPrimary
          width='fit-content'
          padding='6px 12px'
          fontWeight={500}
          fontSize='14px'
          onClick={() => {
            setImportToken && setImportToken(token)
            showImportView()
          }}
        >
          <Trans>Import</Trans>
        </ButtonPrimary>
      ) : (
        <RowFixed style={{ minWidth: 'fit-content' }}>
          <CheckIcon />
          <TYPE.main color={theme.green1}>
            <Trans>Active</Trans>
          </TYPE.main>
        </RowFixed>
      )}
    </TokenSection>
  )
}
