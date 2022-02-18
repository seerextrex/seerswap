import { Trans } from '@lingui/macro'
import { L2_CHAIN_IDS, SupportedChainId, SupportedL2ChainId } from 'constants/chains'
import { useActiveWeb3React } from 'hooks/web3'
import { useCallback, useState } from 'react'
import { useArbitrumAlphaAlert, useDarkModeManager } from 'state/user/hooks'
import { useETHBalances } from 'state/wallet/hooks'
import { CHAIN_INFO } from '../../constants/chains'
import { NetBody, NetL2Icon, NetLinkOutCircle, NetLinkOutToBridge, CloseIcon, Header, RootWrapper, ContentWrapper } from './styled'

export function NetworkAlert() {
    const { account, chainId } = useActiveWeb3React()
    const [darkMode] = useDarkModeManager()
    const [arbitrumAlphaAcknowledged, setArbitrumAlphaAcknowledged] = useArbitrumAlphaAlert()
    const [locallyDismissed, setLocallyDimissed] = useState(false)
    const userEthBalance = useETHBalances(account ? [account] : [])?.[account ?? '']

    const dismiss = useCallback(() => {
        if (userEthBalance?.greaterThan(0)) {
            setArbitrumAlphaAcknowledged(true)
        } else {
            setLocallyDimissed(true)
        }
    }, [setArbitrumAlphaAcknowledged, userEthBalance])
    if (!chainId || !L2_CHAIN_IDS.includes(chainId) || arbitrumAlphaAcknowledged || locallyDismissed) {
        return null
    }
    const info = CHAIN_INFO[chainId as SupportedL2ChainId]
    const depositUrl = [SupportedChainId.OPTIMISM, SupportedChainId.OPTIMISTIC_KOVAN].includes(chainId)
        ? `${info.bridge}?chainId=1`
        : info.bridge

    return (
        <RootWrapper chainId={chainId} darkMode={darkMode} logoUrl={info.logoUrl}>
            <CloseIcon onClick={dismiss} />
            <ContentWrapper>
                <NetL2Icon src={info.logoUrl} />
                <Header>
                    <Trans>Algebra on {info.label}</Trans>
                </Header>
                <NetBody>
                    <Trans>
                        This is an alpha release of Algebra on the {info.label} network. You must
                        bridge L1 assets to the network to
                        swap them.
                    </Trans>
                </NetBody>
            </ContentWrapper>
            <NetLinkOutToBridge href={depositUrl}>
                <Trans>Deposit to {info.label}</Trans>
                <NetLinkOutCircle />
            </NetLinkOutToBridge>
        </RootWrapper>
    )
}
