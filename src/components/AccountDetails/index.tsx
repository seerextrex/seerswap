import { useCallback, useEffect } from 'react'
import { SUPPORTED_WALLETS } from '../../constants/wallet'
import { useActiveWeb3React } from '../../hooks/web3'
import { clearAllTransactions } from '../../state/transactions/actions'
import { shortenAddress } from '../../utils'
import { ExplorerDataType, getExplorerLink } from '../../utils/getExplorerLink'
import Copy from './Copy'
import Transaction from './Transaction'
import { ReactComponent as Close } from '../../assets/images/x.svg'
import { injected, OntoWalletConnector } from '../../connectors'
import Identicon from '../Identicon'
import { ExternalLink as LinkIcon } from 'react-feather'
import { ExternalLink } from '../../theme'
import { Trans } from '@lingui/macro'
import { useAppDispatch } from 'state/hooks'
import { IconWrapper, WalletAction } from './styled'
import { EthereumWindow } from '../../models/types'
import './index.scss'
import Card from '../../shared/components/Card/Card'

function renderTransactions(transactions: string[]) {
    return (
        <div>
            {transactions.map((hash, i) => {
                return <div className={'mb-025'} key={i}>
                    <Transaction hash={hash} />
                </div>
            })}
        </div>
    )
}

interface AccountDetailsProps {
    toggleWalletModal: () => void
    pendingTransactions: string[]
    confirmedTransactions: string[]
    ENSName?: string
    openOptions: () => void
}

export default function AccountDetails({ toggleWalletModal, pendingTransactions, confirmedTransactions, ENSName }: AccountDetailsProps) {
    const { chainId, account, connector, deactivate } = useActiveWeb3React()
    const dispatch = useAppDispatch()

    function formatConnectorName() {
        const { ethereum } = window as unknown as EthereumWindow
        const isMetaMask = !!(ethereum && ethereum.isMetaMask)
        const name = Object.keys(SUPPORTED_WALLETS)
            .filter(
                (k) =>
                    SUPPORTED_WALLETS[k].connector === connector && (connector !== injected || isMetaMask === (k === 'METAMASK'))
            )
            .map((k) => SUPPORTED_WALLETS[k].name)[0]
        return (
            <div className={`fs-085 ${name === 'Metamask' && 'mb-05'}`}>
                <Trans>Connected with {name}</Trans>
            </div>
        )
    }

    function getStatusIcon() {
        if (connector === injected) {
            return (
                <IconWrapper size={16}>
                    <Identicon />
                </IconWrapper>
            )
        }
        return null
    }

    const clearAllTransactionsCallback = useCallback(() => {
        if (chainId) dispatch(clearAllTransactions({ chainId }))
    }, [dispatch, chainId])

    const disconnectHandler = useCallback(() => {
        if (connector instanceof OntoWalletConnector) {
            deactivate()
            connector.close()
            return
        }
        (connector as any).close()
    }, [])

    return (
        <>
            <div className={'pos-r'}>
                <div className={'flex-s-between w-100 c-w mb-1'}>
                    <Trans>Account</Trans>
                    <span className={'cur-p hover-op'} onClick={toggleWalletModal}>
                        <Close />
                    </span>
                </div>
                <div className={'account-details p-1 mb-15 br-12 c-w'}>
                    <div className={'f f-ac mb-05'}>
                        {formatConnectorName()}
                        <WalletAction
                            onClick={() => disconnectHandler()}
                        >
                            <Trans>Disconnect</Trans>
                        </WalletAction>
                    </div>
                    <div className={'l f f-ac c-w mb-05'} id='web3-account-identifier-row'>
                        {ENSName ? (
                            <>
                                {getStatusIcon()}
                                <p> {ENSName}</p>
                            </>
                        ) : (
                            <>
                                {getStatusIcon()}
                                <p> {account && shortenAddress(account)}</p>
                            </>
                        )}
                    </div>
                    <div className={'f'}>
                        {ENSName ? (
                            <>
                                {account && (
                                    <Copy toCopy={account}>
                                        <Trans>Copy Address</Trans>
                                    </Copy>
                                )}
                                {chainId && account && (
                                    <ExternalLink href={getExplorerLink(chainId, ENSName, ExplorerDataType.ADDRESS)}>
                                        <LinkIcon size={'1rem'} color='var(--primary)' />
                                        <span className={'ml-025 c-p hover-line'}>
                                            <Trans>View on Explorer</Trans>
                                        </span>
                                    </ExternalLink>
                                )}
                            </>
                        ) : (
                            <>
                                {account && (
                                    <Copy toCopy={account}>
                                        <Trans>Copy Address</Trans>
                                    </Copy>
                                )}
                                {chainId && account && (
                                    <ExternalLink href={getExplorerLink(chainId, account, ExplorerDataType.ADDRESS)}>
                                        <LinkIcon size={'1rem'} color='var(--primary)' />
                                        <span className={'ml-025 c-p hover-line'}>
                                            <Trans>View on Explorer</Trans>
                                        </span>
                                    </ExternalLink>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
            {!!pendingTransactions.length || !!confirmedTransactions.length ? (
                <Card isDark classes={'br-12 mt-1 p-1'}>
                    <div className={'c-p flex-s-between mb-05'}>
                        <Trans>Recent Transactions</Trans>
                        <button className={'br-0 bg-t c-p p-0 hover-line'} onClick={clearAllTransactionsCallback}>
                            <Trans>(clear all)</Trans>
                        </button>
                    </div>
                    {renderTransactions(pendingTransactions)}
                    {renderTransactions(confirmedTransactions)}
                </Card>
            ) : (
                <Card isDark classes={'f c f-ac f-jc br-12 mt-1 h-200'}>
                    <Trans>Your transactions will appear here...</Trans>
                </Card>
            )}
        </>
    )
}
