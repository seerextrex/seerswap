import { AbstractConnector } from '@web3-react/abstract-connector'
import { UnsupportedChainIdError, useWeb3React } from '@web3-react/core'
import { useEffect, useState } from 'react'
import { isMobile } from 'react-device-detect'
// @ts-ignore
import MetamaskIcon from '../../assets/svg/metamask-logo.svg'
import { injected, OntoWalletConnector } from '../../connectors'
import { SUPPORTED_WALLETS } from '../../constants/wallet'
import usePrevious from '../../hooks/usePrevious'
import { ApplicationModal } from '../../state/application/actions'
import { useModalOpen, useWalletModalToggle } from '../../state/application/hooks'
import AccountDetails from '../AccountDetails'
import { Trans } from '@lingui/macro'
import Modal from '../Modal'
import Option from './Option'
import PendingView from './PendingView'
import ReactGA from 'react-ga'
import { addPolygonNetwork } from 'components/Web3Status/Web3StatusInner'

import { OptionGrid, Wrapper } from './styled'
import Card from '../../shared/components/Card/Card'
import { ReactComponent as Close } from '../../assets/images/x.svg'
import { UserRejectedRequestError, WalletConnectConnector } from '@web3-react/walletconnect-connector'
import { ArrowLeft } from 'react-feather'
import { log } from 'util'

const WALLET_VIEWS = {
    OPTIONS: 'options',
    OPTIONS_SECONDARY: 'options_secondary',
    ACCOUNT: 'account',
    PENDING: 'pending'
}

interface WalletModalProps {
    pendingTransactions: string[]; // hashes of pending
    confirmedTransactions: string[]; // hashes of confirmed
    ENSName?: string;
}

export default function WalletModal({ pendingTransactions, confirmedTransactions, ENSName }: WalletModalProps) {
    // important that these are destructed from the account-specific web3-react context
    const { active, account, connector, activate, error, setError } = useWeb3React()


    const [walletView, setWalletView] = useState(WALLET_VIEWS.ACCOUNT)
    const [pendingWallet, setPendingWallet] = useState<AbstractConnector | undefined>()
    const [pendingError, setPendingError] = useState<boolean>()
    const [errorMessage, setErrorMessage] = useState<string>('')

    const walletModalOpen = useModalOpen(ApplicationModal.WALLET)
    const toggleWalletModal = useWalletModalToggle()

    const previousAccount = usePrevious(account)

    // close on connection, when logged out before
    useEffect(() => {
        if (account && !previousAccount && walletModalOpen) {
            toggleWalletModal()
        }
    }, [account, previousAccount, toggleWalletModal, walletModalOpen])

    // always reset to account view
    useEffect(() => {
        if (walletModalOpen) {
            setPendingError(false)
            setWalletView(WALLET_VIEWS.ACCOUNT)
        }
    }, [walletModalOpen])

    // close modal when a connection is successful
    const activePrevious = usePrevious(active)
    const connectorPrevious = usePrevious(connector)
    useEffect(() => {
        if (walletModalOpen && ((active && !activePrevious) || (connector && connector !== connectorPrevious && !error))) {
            setWalletView(WALLET_VIEWS.ACCOUNT)
        }
    }, [setWalletView, active, error, connector, walletModalOpen, activePrevious, connectorPrevious])

    const tryActivation = async (connector: AbstractConnector | undefined) => {
        let name = ''
        Object.keys(SUPPORTED_WALLETS).map((key) => {
            if (connector === SUPPORTED_WALLETS[key].connector) {
                return (name = SUPPORTED_WALLETS[key].name)
            }
            return true
        })

        ReactGA.event({
            category: 'Wallet',
            action: 'Change Wallet',
            label: name
        })

        setPendingWallet(connector)
        setWalletView(WALLET_VIEWS.PENDING)

        if (connector instanceof WalletConnectConnector) {
            connector.walletConnectProvider = undefined
        }

        if (connector instanceof OntoWalletConnector) {

        }

        connector &&
        activate(connector, undefined, true)
            .then(async () => {
                const walletAddress = await connector.getAccount()
                if (walletAddress) {
                    setWalletView(WALLET_VIEWS.ACCOUNT)
                }
            })
            .catch((error) => {
                console.error(error)
                if (error instanceof UnsupportedChainIdError) {
                    setErrorMessage('Please connect to the Polygon network.')
                    setPendingError(true)
                    setError(error)
                } else if (error instanceof UserRejectedRequestError) {
                    setWalletView(WALLET_VIEWS.ACCOUNT)
                } else {
                    setPendingError(true)
                }
            })
    }

    // get wallets user can switch too, depending on device/browser
    function getOptions() {
        const isMetamask = window.ethereum && window.ethereum.isMetaMask

        return Object.keys(SUPPORTED_WALLETS).map((key) => {
            const option = SUPPORTED_WALLETS[key]
            // check for mobile options
            if (isMobile) {
                //disable portis on mobile for now
                if (!window.web3 && !window.ethereum && option.mobile) {
                    return (
                        <Option
                            onClick={() => {
                                option.connector !== connector && !option.href && tryActivation(option.connector)
                            }}
                            id={`connect-${key}`}
                            key={key}
                            active={option.connector && option.connector === connector}
                            color={option.color}
                            link={option.href}
                            header={option.name}
                            subheader={null}
                            icon={option.iconURL}
                        />
                    )
                }
                return null
            }

            // overwrite injected when needed
            if (option.connector === injected) {
                // don't show injected if there's no injected provider
                if (!(window.web3 || window.ethereum)) {
                    if (option.name === 'MetaMask') {
                        return <Option id={`connect-${key}`} key={key} color={'#E8831D'} header={<Trans>Install Metamask</Trans>} subheader={null} link={'https://metamask.io/'} icon={MetamaskIcon} />
                    } else {
                        return null //dont want to return install twice
                    }
                }
                // don't return metamask if injected provider isn't metamask
                else if (option.name === 'MetaMask' && !isMetamask) {
                    return null
                }
                // likewise for generic
                else if (option.name === 'Injected' && isMetamask) {
                    return null
                }
            }

            // return rest of options
            return (
                !isMobile &&
                !option.mobileOnly && (
                    <Option
                        id={`connect-${key}`}
                        onClick={() => {
                            option.connector === connector ? setWalletView(WALLET_VIEWS.ACCOUNT) : !option.href && tryActivation(option.connector)
                        }}
                        key={key}
                        active={option.connector === connector}
                        color={option.color}
                        link={option.href}
                        header={option.name}
                        subheader={null} //use option.descriptio to bring back multi-line
                        icon={option.iconURL}
                    />
                )
            )
        })
    }

    function getModalContent() {
        if (error) {
            return (
                <div className={'c-w b'}>
                    <div className={'flex-s-between'}>
                        {error instanceof UnsupportedChainIdError ? <Trans>Wrong Network</Trans> : <Trans>Error connecting</Trans>}

                        <div className={'cur-p hover-op'} onClick={toggleWalletModal}>
                            <Close />
                        </div>
                    </div>
                    <div className={'pt-1'}>
                        {error instanceof UnsupportedChainIdError ? (
                            <>
                                <h5 className={'mb-1'}>
                                    <Trans>Please connect to the Polygon network.</Trans>
                                </h5>
                                {isMobile ? (
                                    <p>Add Polygon network to your metamask app.</p>
                                ) : (
                                    <button
                                        className={'btn primary p-1 w-100 b'}
                                        onClick={addPolygonNetwork}>
                                        Connect to Polygon
                                    </button>
                                )}
                            </>
                        ) : (
                            <Trans>Error connecting. Try refreshing the page.</Trans>
                        )}
                    </div>
                </div>
            )
        }
        if (account && walletView === WALLET_VIEWS.ACCOUNT) {
            return (
                <AccountDetails
                    toggleWalletModal={toggleWalletModal}
                    pendingTransactions={pendingTransactions}
                    confirmedTransactions={confirmedTransactions}
                    ENSName={ENSName}
                    openOptions={() => setWalletView(WALLET_VIEWS.OPTIONS)}
                />
            )
        }
        return (
            <div className={'pos-r'}>
                <div className={'flex-s-between'}>
                    {walletView !== WALLET_VIEWS.ACCOUNT ? (
                        <span
                            className={'hover-op f cur-p'}
                            onClick={() => {
                                setPendingError(false)
                                setWalletView(WALLET_VIEWS.ACCOUNT)
                            }}
                        >
                            <Trans><ArrowLeft size={'1rem'} className={'mr-025'} /> Back</Trans>
                        </span>
                    ) : (
                        <span className={'c-w'}>
                            <Trans>Connect Wallet</Trans>
                        </span>
                    )}
                    <div className={'cur-p hover-op'} onClick={toggleWalletModal}>
                        <Close />
                    </div>
                </div>

                <Card isDark classes={'p-1 br-12 mt-1'}>
                    {walletView === WALLET_VIEWS.PENDING ? (
                        <PendingView
                            connector={pendingWallet}
                            error={pendingError}
                            setPendingError={setPendingError}
                            tryActivation={tryActivation}
                            errorMessage={errorMessage} />
                    ) : (
                        <OptionGrid>{getOptions()}</OptionGrid>
                    )}
                </Card>
            </div>
        )
    }

    return (
        <Modal isOpen={walletModalOpen} onDismiss={toggleWalletModal} minHeight={false} maxHeight={90}>
            <Wrapper>{getModalContent()}</Wrapper>
        </Modal>
    )
}
