import { AbstractConnector } from "@web3-react/abstract-connector";
import { UnsupportedChainIdError, useWeb3React } from "@web3-react/core";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";
import { useEffect, useState } from "react";
import { isMobile } from "react-device-detect";
// @ts-ignore
import MetamaskIcon from "../../assets/svg/metamask-logo.svg";
import { injected } from "../../connectors";
import { SUPPORTED_WALLETS } from "../../constants/wallet";
import usePrevious from "../../hooks/usePrevious";
import { ApplicationModal } from "../../state/application/actions";
import { useModalOpen, useWalletModalToggle } from "../../state/application/hooks";
import AccountDetails from "../AccountDetails";
import { Trans } from "@lingui/macro";
import Modal from "../Modal";
import Option from "./Option";
import PendingView from "./PendingView";
import { Frown } from "react-feather";
import ReactGA from "react-ga";
import { CloseColor, CloseIcon, ContentWrapper, ConnectNetwork, HeaderRow, HoverText, OptionGrid, UpperSection, Wrapper } from "./styled";

const WALLET_VIEWS = {
    OPTIONS: "options",
    OPTIONS_SECONDARY: "options_secondary",
    ACCOUNT: "account",
    PENDING: "pending",
};

export default function WalletModal({
    pendingTransactions,
    confirmedTransactions,
    ENSName,
}: {
    pendingTransactions: string[]; // hashes of pending
    confirmedTransactions: string[]; // hashes of confirmed
    ENSName?: string;
}) {
    // important that these are destructed from the account-specific web3-react context
    const { active, account, connector, activate, error } = useWeb3React();

    const [walletView, setWalletView] = useState(WALLET_VIEWS.ACCOUNT);

    const [pendingWallet, setPendingWallet] = useState<AbstractConnector | undefined>();

    const [pendingError, setPendingError] = useState<boolean>();

    const walletModalOpen = useModalOpen(ApplicationModal.WALLET);
    const toggleWalletModal = useWalletModalToggle();

    const previousAccount = usePrevious(account);

    // close on connection, when logged out before
    useEffect(() => {
        if (account && !previousAccount && walletModalOpen) {
            toggleWalletModal();
        }
    }, [account, previousAccount, toggleWalletModal, walletModalOpen]);

    // always reset to account view
    useEffect(() => {
        if (walletModalOpen) {
            setPendingError(false);
            setWalletView(WALLET_VIEWS.ACCOUNT);
        }
    }, [walletModalOpen]);

    // close modal when a connection is successful
    const activePrevious = usePrevious(active);
    const connectorPrevious = usePrevious(connector);
    useEffect(() => {
        if (walletModalOpen && ((active && !activePrevious) || (connector && connector !== connectorPrevious && !error))) {
            setWalletView(WALLET_VIEWS.ACCOUNT);
        }
    }, [setWalletView, active, error, connector, walletModalOpen, activePrevious, connectorPrevious]);

    const tryActivation = async (connector: AbstractConnector | undefined) => {
        let name = "";
        Object.keys(SUPPORTED_WALLETS).map((key) => {
            if (connector === SUPPORTED_WALLETS[key].connector) {
                return (name = SUPPORTED_WALLETS[key].name);
            }
            return true;
        });
        // log selected wallet

        ReactGA.event({
            category: "Wallet",
            action: "Change Wallet",
            label: name,
        });

        setPendingWallet(connector); // set wallet for pending view
        setWalletView(WALLET_VIEWS.PENDING);

        // if the connector is walletconnect and the user has already tried to connect, manually reset the connector
        if (connector instanceof WalletConnectConnector && connector.walletConnectProvider?.wc?.uri) {
            connector.walletConnectProvider = undefined;
        }

        connector &&
            activate(connector, undefined, true).catch((error) => {
                if (error instanceof UnsupportedChainIdError) {
                    activate(connector); // a little janky...can't use setError because the connector isn't set
                } else {
                    setPendingError(true);
                }
            });
    };

    // get wallets user can switch too, depending on device/browser
    function getOptions() {
        const isMetamask = window.ethereum && window.ethereum.isMetaMask;

        if (!isMetamask && isMobile) {
            return (
                <div>
                    <Frown stroke={"#080064"} />
                    <p>Mobile devices are not currently supported. Please use your desktop.</p>
                </div>
            );
        }

        return Object.keys(SUPPORTED_WALLETS).map((key) => {
            const option = SUPPORTED_WALLETS[key];
            // check for mobile options
            if (isMobile) {
                //disable portis on mobile for now
                if (!window.web3 && !window.ethereum && option.mobile) {
                    return (
                        <Option
                            onClick={() => {
                                option.connector !== connector && !option.href && tryActivation(option.connector);
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
                    );
                }
                return null;
            }

            // overwrite injected when needed
            if (option.connector === injected) {
                // don't show injected if there's no injected provider
                if (!(window.web3 || window.ethereum)) {
                    if (option.name === "MetaMask") {
                        return <Option id={`connect-${key}`} key={key} color={"#E8831D"} header={<Trans>Install Metamask</Trans>} subheader={null} link={"https://metamask.io/"} icon={MetamaskIcon} />;
                    } else {
                        return null; //dont want to return install twice
                    }
                }
                // don't return metamask if injected provider isn't metamask
                else if (option.name === "MetaMask" && !isMetamask) {
                    return null;
                }
                // likewise for generic
                else if (option.name === "Injected" && isMetamask) {
                    return null;
                }
            }

            // return rest of options
            return (
                !isMobile &&
                !option.mobileOnly && (
                    <Option
                        id={`connect-${key}`}
                        onClick={() => {
                            option.connector === connector ? setWalletView(WALLET_VIEWS.ACCOUNT) : !option.href && tryActivation(option.connector);
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
            );
        });
    }

    function getModalContent() {
        if (error) {
            return (
                <UpperSection>
                    <CloseIcon onClick={toggleWalletModal}>
                        <CloseColor />
                    </CloseIcon>
                    <HeaderRow>{error instanceof UnsupportedChainIdError ? <Trans>Wrong Network</Trans> : <Trans>Error connecting</Trans>}</HeaderRow>
                    <ContentWrapper>
                        {error instanceof UnsupportedChainIdError ? (
                            <>
                                <h5>
                                    <Trans>Please connect to the Polygon network.</Trans>
                                </h5>
                                {isMobile ? <p>Add Polygon network to your metamask app.</p> : <ConnectNetwork onClick={addPolygonNetwork}>Connect to Polygon</ConnectNetwork>}
                            </>
                        ) : (
                            <Trans>Error connecting. Try refreshing the page.</Trans>
                        )}
                    </ContentWrapper>
                </UpperSection>
            );
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
            );
        }
        return (
            <UpperSection>
                <CloseIcon onClick={toggleWalletModal}>
                    <CloseColor />
                </CloseIcon>
                {walletView !== WALLET_VIEWS.ACCOUNT ? (
                    <HeaderRow color="#080064">
                        <HoverText
                            style={{ color: "#080064" }}
                            onClick={() => {
                                setPendingError(false);
                                setWalletView(WALLET_VIEWS.ACCOUNT);
                            }}
                        >
                            <Trans>Back</Trans>
                        </HoverText>
                    </HeaderRow>
                ) : (
                    <HeaderRow color="#080064">
                        <HoverText style={{ color: "#080064" }}>
                            <Trans>Connect Wallet</Trans>
                        </HoverText>
                    </HeaderRow>
                )}

                <ContentWrapper>
                    {walletView === WALLET_VIEWS.PENDING ? (
                        <PendingView connector={pendingWallet} error={pendingError} setPendingError={setPendingError} tryActivation={tryActivation} />
                    ) : (
                        <OptionGrid>{getOptions()}</OptionGrid>
                    )}
                </ContentWrapper>
            </UpperSection>
        );
    }

    return (
        <Modal isOpen={walletModalOpen} onDismiss={toggleWalletModal} minHeight={false} maxHeight={90}>
            <Wrapper>{getModalContent()}</Wrapper>
        </Modal>
    );
}
