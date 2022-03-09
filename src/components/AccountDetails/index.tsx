import { useCallback } from 'react'
import { SUPPORTED_WALLETS } from '../../constants/wallet'
import { useActiveWeb3React } from '../../hooks/web3'
import { clearAllTransactions } from '../../state/transactions/actions'
import { shortenAddress } from '../../utils'
import { ExplorerDataType, getExplorerLink } from '../../utils/getExplorerLink'
import { AutoRow } from '../Row'
import Copy from './Copy'
import Transaction from './Transaction'
import { ReactComponent as Close } from '../../assets/images/x.svg'
import { injected } from '../../connectors'
import Identicon from '../Identicon'
import { ExternalLink as LinkIcon } from 'react-feather'
import { LinkStyledButton, TYPE } from '../../theme'
import { Trans } from '@lingui/macro'
import { useAppDispatch } from 'state/hooks'
import { AccountControl, AccountGroupingRow, AddressLink, IconWrapper, LowerSection, TransactionListWrapper, WalletAction } from './styled'
import { EthereumWindow } from '../../models/types'
import './index.scss'

function renderTransactions(transactions: string[]) {
    return (
        <TransactionListWrapper>
            {transactions.map((hash, i) => {
                return <Transaction key={i} hash={hash} />
            })}
        </TransactionListWrapper>
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
    const { chainId, account, connector } = useActiveWeb3React()
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
            <div className={'fs-085 mb-05'}>
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

    return (
        <>
            <div className={'pos-r'}>
                <div className={'flex-s-between w-100 c-w mb-1'}>
                    <Trans>Account</Trans>
                    <span onClick={toggleWalletModal}>
                        <Close />
                    </span>
                </div>
                <div className={'account-details p-1 mb-15 br-12 c-w'}>
                    {formatConnectorName()}
                    <div>
                        {connector !== injected && (
                            <WalletAction
                                onClick={() => {
                                    (connector as any).close()
                                }}
                            >
                                <Trans>Disconnect</Trans>
                            </WalletAction>
                        )}
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
                    <div>
                        {ENSName ? (
                            <AccountControl>
                                <div>
                                    {account && (
                                        <Copy toCopy={account}>
                                                <span>
                                                  <Trans>Copy Address</Trans>
                                                </span>
                                        </Copy>
                                    )}
                                    {chainId && account && (
                                        <AddressLink
                                            hasENS={!!ENSName}
                                            isENS={true}
                                            href={getExplorerLink(chainId, ENSName, ExplorerDataType.ADDRESS)}
                                        >
                                            <LinkIcon size={'1rem'} color='var(--primary)' />
                                            <span>
                                                    <Trans>View on Explorer</Trans>
                                                </span>
                                        </AddressLink>
                                    )}
                                </div>
                            </AccountControl>
                        ) : (
                            <>
                                <AccountControl>
                                    <div>
                                        {account && (
                                            <Copy toCopy={account}>
                                                <span>
                                                  <Trans>Copy Address</Trans>
                                                </span>
                                            </Copy>
                                        )}
                                        {chainId && account && (
                                            <AddressLink
                                                hasENS={!!ENSName}
                                                isENS={false}
                                                href={getExplorerLink(chainId, account, ExplorerDataType.ADDRESS)}
                                            >
                                                <LinkIcon size={'1rem'} color='var(--primary)' />
                                                <span>
                                                  <Trans>View on Explorer</Trans>
                                                </span>
                                            </AddressLink>
                                        )}
                                    </div>
                                </AccountControl>
                            </>
                        )}
                    </div>
                </div>
            </div>
            {!!pendingTransactions.length || !!confirmedTransactions.length ? (
                <LowerSection>
                    <AutoRow mb={'1rem'} style={{ justifyContent: 'space-between' }}>
                        <TYPE.body style={{ color: '#080064' }}>
                            <Trans>Recent Transactions</Trans>
                        </TYPE.body>
                        <LinkStyledButton onClick={clearAllTransactionsCallback}>
                            <Trans>(clear all)</Trans>
                        </LinkStyledButton>
                    </AutoRow>
                    {renderTransactions(pendingTransactions)}
                    {renderTransactions(confirmedTransactions)}
                </LowerSection>
            ) : (
                <LowerSection>
                    <TYPE.body color={'#080064'}>
                        <Trans>Your transactions will appear here...</Trans>
                    </TYPE.body>
                </LowerSection>
            )}
        </>
    )
}
