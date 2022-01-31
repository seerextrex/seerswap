import { Trans } from '@lingui/macro'
import { CHAIN_INFO, L2_CHAIN_IDS, SupportedChainId, SupportedL2ChainId } from 'constants/chains'
import { useActiveWeb3React } from 'hooks/web3'
import { useArbitrumAlphaAlert, useDarkModeManager } from 'state/user/hooks'
import { Wrapper, Body, DesktopTextBreak, LinkOutCircle, LinkOutToBridge, L2Icon } from './styled'

export function MinimalNetworkAlert() {
  const { chainId } = useActiveWeb3React()
  const [darkMode] = useDarkModeManager()
  const [arbitrumAlphaAcknowledged] = useArbitrumAlphaAlert()

  if (!chainId || !L2_CHAIN_IDS.includes(chainId) || arbitrumAlphaAcknowledged) {
    return null
  }
  const info = CHAIN_INFO[chainId as SupportedL2ChainId]
  const depositUrl = [SupportedChainId.OPTIMISM, SupportedChainId.OPTIMISTIC_KOVAN].includes(chainId)
    ? `${info.bridge}?chainId=1`
    : info.bridge
  return (
    <Wrapper darkMode={darkMode} chainId={chainId} logoUrl={info.logoUrl}>
      <L2Icon src={info.logoUrl} />
      <Body>
        <Trans>This is an alpha release of Algebra on the {info.label} network.</Trans>
        <DesktopTextBreak /> <Trans>You must bridge L1 assets to the network to use them.</Trans>
      </Body>
      <LinkOutToBridge href={depositUrl}>
        <Trans>Deposit to {info.label}</Trans>
        <LinkOutCircle />
      </LinkOutToBridge>
    </Wrapper>
  )
}
