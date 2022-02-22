import { useCallback } from 'react'
import { SUPPORTED_WALLETS } from '../../constants/wallet'
import { useActiveWeb3React } from '../../hooks/web3'
import { clearAllTransactions } from '../../state/transactions/actions'
import { shortenAddress } from '../../utils'
import { ExplorerDataType, getExplorerLink } from '../../utils/getExplorerLink'
import { AutoRow } from '../Row'
import Copy from './Copy'
import Transaction from './Transaction'

import { injected } from '../../connectors'
import Identicon from '../Identicon'
import { ExternalLink as LinkIcon } from 'react-feather'
import { LinkStyledButton, TYPE } from '../../theme'
import { Trans } from '@lingui/macro'
import { useAppDispatch } from 'state/hooks'
import {
    AccountControl,
    AccountGroupingRow,
    AccountSection,
    AddressLink,
    CloseColor,
    CloseIcon,
    HeaderRow,
    IconWrapper,
    InfoCard,
    LowerSection,
    TransactionListWrapper,
    UpperSection,
    WalletAction,
    WalletName,
    YourAccount
} from './styled'
import { EthereumWindow } from '../../models/types'

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
            <WalletName>
                <Trans>Connected with {name}</Trans>
            </WalletName>
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
            <UpperSection>
                <CloseIcon onClick={toggleWalletModal}>
                    <CloseColor />
                </CloseIcon>
                <HeaderRow>
                    <Trans>Account</Trans>
                </HeaderRow>
                <AccountSection>
                    <YourAccount>
                        <InfoCard>
                            <AccountGroupingRow>
                                {formatConnectorName()}
                                <div>
                                    {connector !== injected && (
                                        <WalletAction
                                            style={{
                                                fontSize: '.825rem',
                                                fontWeight: 400,
                                                marginRight: '8px',
                                                color: '#080064'
                                            }}
                                            onClick={() => {
                                                ;(connector as any).close()
                                            }}
                                        >
                                            <Trans>Disconnect</Trans>
                                        </WalletAction>
                                    )}
                                </div>
                            </AccountGroupingRow>
                            <AccountGroupingRow id='web3-account-identifier-row'>
                                <AccountControl>
                                    {ENSName ? (
                                        <>
                                            <div>
                                                {getStatusIcon()}
                                                <p> {ENSName}</p>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div>
                                                {getStatusIcon()}
                                                <p> {account && shortenAddress(account)}</p>
                                            </div>
                                        </>
                                    )}
                                </AccountControl>
                            </AccountGroupingRow>
                            <AccountGroupingRow>
                                {ENSName ? (
                                    <>
                                        <AccountControl>
                                            <div>
                                                {account && (
                                                    <Copy toCopy={account}>
                            <span style={{ marginLeft: '4px', color: '#080064' }}>
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
                                                        <LinkIcon size={16} />
                                                        <span style={{
                                                            marginLeft: '4px',
                                                            color: '#080064'
                                                        }}>
                              <Trans>View on Explorer</Trans>
                            </span>
                                                    </AddressLink>
                                                )}
                                            </div>
                                        </AccountControl>
                                    </>
                                ) : (
                                    <>
                                        <AccountControl>
                                            <div>
                                                {account && (
                                                    <Copy toCopy={account}>
                            <span style={{ marginLeft: '4px', color: '#080064' }}>
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
                                                        <LinkIcon size={16} color='#080064' />
                                                        <span style={{
                                                            marginLeft: '4px',
                                                            color: '#080064'
                                                        }}>
                              <Trans>View on Explorer</Trans>
                            </span>
                                                    </AddressLink>
                                                )}
                                            </div>
                                        </AccountControl>
                                    </>
                                )}
                            </AccountGroupingRow>
                        </InfoCard>
                    </YourAccount>
                </AccountSection>
            </UpperSection>
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
