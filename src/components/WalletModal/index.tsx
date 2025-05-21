import { Trans } from "@lingui/macro";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { Connector as WagmiConnector, CreateConnectorFn } from "wagmi";
import { AutoColumn } from "components/Column";
import { useCallback, useEffect, useState } from "react";
import { ArrowLeft } from "react-feather";

import METAMASK_ICON_URL from "../../assets/svg/metamask-logo.svg";
import { ReactComponent as Close } from "../../assets/images/x.svg";
import { SUPPORTED_WALLETS, WalletInfo } from "../../constants/wallet";
import { useModalOpen, useWalletModalToggle } from "../../state/application/hooks";
import AccountDetails from "../AccountDetails";
import Modal from "../Modal";
import Option, { OptionProps } from "./Option";
import PendingView, { PendingViewProps } from "./PendingView";
import { ApplicationModal } from "../../state/application/actions";

import {
    ContentWrapper,
    HeaderRow,
    HoverText,
    OptionGrid,
    Wrapper,
    CloseIcon,
} from "./styled";

// Define WALLET_VIEWS locally
const WALLET_VIEWS = {
    OPTIONS: "options",
    ACCOUNT: "account",
    PENDING: "pending",
};

export default function WalletModal({
    pendingTransactions,
    confirmedTransactions,
    ENSName,
}: {
    pendingTransactions: string[];
    confirmedTransactions: string[];
    ENSName?: string;
}) {
    const { address: account, connector: activeWagmiConnector, isConnected } = useAccount();
    const { connect, connectors, error: connectError, isPending, variables } = useConnect();
    const { disconnect } = useDisconnect();

    const pendingConnectorCandidate = variables?.connector;

    const [walletView, setWalletView] = useState(WALLET_VIEWS.OPTIONS);
    const walletModalOpen = useModalOpen(ApplicationModal.WALLET);
    const toggleWalletModal = useWalletModalToggle();

    const openOptions = useCallback(() => {
        setWalletView(WALLET_VIEWS.OPTIONS);
    }, [setWalletView]);

    useEffect(() => {
        if (walletModalOpen) {
            setWalletView(isConnected ? WALLET_VIEWS.ACCOUNT : WALLET_VIEWS.OPTIONS);
        }
    }, [walletModalOpen, setWalletView, isConnected]);

    const tryActivation = useCallback(
        (connectorToActivate: WagmiConnector | CreateConnectorFn) => {
            setWalletView(WALLET_VIEWS.PENDING);
            connect({ connector: connectorToActivate });
        },
        [connect, setWalletView]
    );

    function getOptions() {
        const isMetamask = typeof window !== 'undefined' && window?.ethereum?.isMetaMask;

        return connectors.map((wagmiConnector) => {
            let walletInfo: WalletInfo | undefined = undefined;

            if (wagmiConnector.id === 'injected' && isMetamask) {
                walletInfo = Object.values(SUPPORTED_WALLETS).find(info => info.connectorId === 'metaMask');
            }
            if (!walletInfo) {
                walletInfo = Object.values(SUPPORTED_WALLETS).find(info => info.connectorId === wagmiConnector.id);
            }
            if (!walletInfo && wagmiConnector.id === 'injected') {
                walletInfo = Object.values(SUPPORTED_WALLETS).find(info => info.connectorId === 'injected');
            }

            const optionName = walletInfo?.name || wagmiConnector.name;
            const defaultIcon = METAMASK_ICON_URL;
            const connectorIcon = 'icon' in wagmiConnector ? wagmiConnector.icon : undefined;
            const icon = walletInfo?.iconURL || connectorIcon || defaultIcon;

            if (wagmiConnector.id === 'metaMask' && 'ready' in wagmiConnector && !wagmiConnector.ready) {
                return (
                    <Option
                        id={`connect-${wagmiConnector.id}-install`}
                        key={`connect-${wagmiConnector.id}-install`}
                        color={walletInfo?.color || "#E8831D"}
                        header={<Trans>Install MetaMask</Trans>}
                        subheader={null}
                        link={"https://metamask.io/"}
                        icon={icon}
                        clickable={false}
                    />
                );
            }

            const optionProps: OptionProps = {
                id: `connect-${wagmiConnector.id}`,
                onClick: () => tryActivation(wagmiConnector),
                header: optionName,
                subheader: walletInfo?.description || null,
                icon: icon,
                active: activeWagmiConnector?.id === wagmiConnector.id,
                color: walletInfo?.color || '#000000',
            };

            return <Option {...optionProps} key={wagmiConnector.id} />;
        });
    }

    function getModalContent() {
        let pendingConnectorForView: WagmiConnector | undefined = undefined;
        if (pendingConnectorCandidate && 'ready' in pendingConnectorCandidate) {
            pendingConnectorForView = pendingConnectorCandidate as WagmiConnector;
        }

        if (isPending && pendingConnectorCandidate) {
            const pendingViewProps: PendingViewProps = {
                connector: pendingConnectorForView,
                error: !!connectError,
                onBack: () => setWalletView(WALLET_VIEWS.OPTIONS),
                tryActivation: () => tryActivation(pendingConnectorCandidate),
            };
            return <PendingView {...pendingViewProps} />;
        }

        if (connectError && walletView === WALLET_VIEWS.PENDING && !isPending) {
            let lastAttemptedConnectorForView: WagmiConnector | undefined = undefined;
            if (pendingConnectorCandidate && 'ready' in pendingConnectorCandidate) {
                lastAttemptedConnectorForView = pendingConnectorCandidate as WagmiConnector;
            }
            const pendingViewProps: PendingViewProps = {
                connector: lastAttemptedConnectorForView,
                error: true,
                errorMessage: (connectError && typeof connectError.message === 'string') ? connectError.message : "An unknown error occurred.",
                onBack: () => setWalletView(WALLET_VIEWS.OPTIONS),
                tryActivation: pendingConnectorCandidate ? () => tryActivation(pendingConnectorCandidate) : () => setWalletView(WALLET_VIEWS.OPTIONS),
            };
            return <PendingView {...pendingViewProps} />;
        }

        if (walletView === WALLET_VIEWS.ACCOUNT && isConnected) {
            return (
                <AccountDetails
                    toggleWalletModal={toggleWalletModal}
                    pendingTransactions={pendingTransactions}
                    confirmedTransactions={confirmedTransactions}
                    ENSName={ENSName}
                    openOptions={openOptions}
                />
            );
        }

        let headerRow;
        if (walletView === WALLET_VIEWS.PENDING) {
            headerRow = null;
        } else if (walletView === WALLET_VIEWS.ACCOUNT || isConnected) {
            headerRow = (
                <HeaderRow color="blue">
                    <HoverText onClick={() => setWalletView(isConnected ? WALLET_VIEWS.ACCOUNT : WALLET_VIEWS.OPTIONS)}>
                        <ArrowLeft />
                    </HoverText>
                    <CloseIcon onClick={toggleWalletModal} />
                </HeaderRow>
            );
        } else {
            headerRow = (
                <HeaderRow>
                    <HoverText>
                        <Trans>Connect a wallet</Trans>
                    </HoverText>
                    <CloseIcon onClick={toggleWalletModal} />
                </HeaderRow>
            );
        }

        return (
            <ContentWrapper>
                {headerRow}
                {walletView === WALLET_VIEWS.OPTIONS && <OptionGrid>{getOptions()}</OptionGrid>}
                {walletView === WALLET_VIEWS.OPTIONS && connectError && !isPending && (
                    <AutoColumn style={{ marginTop: '1rem', textAlign: 'center' }}>
                        <div style={{ color: 'red' }}>
                            {(connectError && typeof connectError.message === 'string') ? (
                                <Trans>Error connecting: {connectError.message}</Trans>
                            ) : (
                                <Trans>An unknown error occurred while connecting.</Trans>
                            )}
                        </div>
                        {pendingConnectorCandidate && (
                            <button onClick={() => tryActivation(pendingConnectorCandidate)} style={{ marginTop: '0.5rem' }}>
                                Try Again with {pendingConnectorCandidate.name || 'selected wallet'}
                            </button>
                        )}
                    </AutoColumn>
                )}
            </ContentWrapper>
        );
    }

    return (
        <Modal isOpen={walletModalOpen} onDismiss={toggleWalletModal} minHeight={false} maxHeight={90}>
            <Wrapper>{getModalContent()}</Wrapper>
        </Modal>
    );
}
