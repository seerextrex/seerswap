import { Trans } from "@lingui/macro";
import { useWeb3React } from "@web3-react/core";
import { Connector } from "@web3-react/types";
import { AutoColumn } from "components/Column";
import { useCallback, useEffect, useState } from "react";
import { ArrowLeft } from "react-feather";
import styled from "styled-components/macro";

import METAMASK_ICON_URL from "../../assets/svg/metamask-logo.svg";
import { ReactComponent as Close } from "../../assets/images/x.svg";
import { injected } from "../../connectors";
import { SUPPORTED_WALLETS } from "../../constants/wallet";
import { useModalOpen, useWalletModalToggle } from "../../state/application/hooks";
import AccountDetails from "../AccountDetails";
import Modal from "../Modal";
import Option from "./Option";
import PendingView from "./PendingView";
import { ApplicationModal } from "../../state/application/actions";

const CloseIcon = styled.div`
    position: absolute;
    right: 1rem;
    top: 14px;
    &:hover {
        cursor: pointer;
        opacity: 0.6;
    }
`;

const CloseColor = styled(Close)`
    path {
        stroke: ${({ theme }) => theme.text4};
    }
`;

const Wrapper = styled.div`
    ${({ theme }) => theme.flexColumnNoWrap}
    margin: 0;
    padding: 0;
    width: 100%;
`;

const HeaderRow = styled.div`
    ${({ theme }) => theme.flexRowNoWrap};
    padding: 1rem 1rem;
    font-weight: 500;
    color: ${(props) => (props.color === "blue" ? ({ theme }) => theme.primary1 : "inherit")};
    ${({ theme }) => theme.mediaWidth.upToMedium`
    padding: 1rem;
  `};
`;

const ContentWrapper = styled.div`
    background-color: ${({ theme }) => theme.bg0};
    padding: 1rem;
    border-bottom-left-radius: 20px;
    border-bottom-right-radius: 20px;
    ${({ theme }) => theme.mediaWidth.upToMedium`padding: 1rem`};
`;

const UpperSection = styled.div`
    position: relative;
    h5 {
        margin: 0;
        margin-bottom: 0.5rem;
        font-size: 1rem;
        font-weight: 400;
    }
    h5:last-child {
        margin-bottom: 0px;
    }
    h4 {
        margin-top: 0;
        font-weight: 500;
    }
`;

const OptionGrid = styled.div`
    display: grid;
    grid-gap: 10px;
    ${({ theme }) => theme.mediaWidth.upToMedium`
    grid-template-columns: 1fr;
    grid-gap: 10px;
  `};
`;

const HoverText = styled.div`
    text-decoration: none;
    color: ${({ theme }) => theme.text1};
    display: flex;
    align-items: center;

    :hover {
        cursor: pointer;
    }
`;

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
    pendingTransactions: string[]; // hashes of pending
    confirmedTransactions: string[]; // hashes of confirmed
    ENSName?: string;
}) {
    const { connector, account } = useWeb3React();

    const [walletView, setWalletView] = useState(WALLET_VIEWS.ACCOUNT);

    const [pendingConnector, setPendingConnector] = useState<Connector | undefined>();
    // const pendingError = useAppSelector((state) => (pendingConnector ? state.wallet.errorByWallet[getWalletForConnector(pendingConnector)] : undefined));
    const pendingError = false;

    const walletModalOpen = useModalOpen(ApplicationModal.WALLET);
    const toggleWalletModal = useWalletModalToggle();

    const openOptions = useCallback(() => {
        setWalletView(WALLET_VIEWS.OPTIONS);
    }, [setWalletView]);

    useEffect(() => {
        if (walletModalOpen) {
            setWalletView(account ? WALLET_VIEWS.ACCOUNT : WALLET_VIEWS.OPTIONS);
        }
    }, [walletModalOpen, setWalletView, account]);

    useEffect(() => {
        if (pendingConnector && walletView !== WALLET_VIEWS.PENDING) {
            // updateWalletError({ wallet: getWalletForConnector(pendingConnector), error: undefined });
            setPendingConnector(undefined);
        }
    }, [pendingConnector, walletView]);

    const tryActivation = useCallback(async (connector: Connector) => {
        // const wallet = getWalletForConnector(connector);

        try {
            setPendingConnector(connector);
            setWalletView(WALLET_VIEWS.PENDING);
            // dispatch(updateWalletError({ wallet, error: undefined }));

            await connector.activate();

            // dispatch(updateSelectedWallet({ wallet }));
        } catch (error) {
            console.debug(`web3-react connection error: ${error}`);
            // dispatch(updateWalletError({ wallet, error: error.message }));
        }
    }, []);

    // get wallets user can switch too, depending on device/browser
    function getOptions() {
        const isMetamask = !!window.ethereum?.isMetaMask;
        return Object.keys(SUPPORTED_WALLETS).map((key) => {
            const option = SUPPORTED_WALLETS[key];
            const isActive = option.connector === connector;

            const optionProps = {
                active: isActive,
                id: `connect-${key}`,
                link: option.href,
                header: option.name,
                color: option.color,
                key,
                icon: option.iconURL,
            };

            // overwrite injected when needed
            if (option.connector === injected) {
                // don't show injected if there's no injected provider
                if (!(window.web3 || window.ethereum)) {
                    if (option.name === "MetaMask") {
                        return (
                            <Option
                                id={`connect-${key}`}
                                key={key}
                                color={"#E8831D"}
                                header={<Trans>Install Metamask</Trans>}
                                subheader={null}
                                link={"https://metamask.io/"}
                                icon={METAMASK_ICON_URL}
                            />
                        );
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
                <Option
                    {...optionProps}
                    onClick={() => {
                        option.connector === connector ? setWalletView(WALLET_VIEWS.ACCOUNT) : !option.href && option.connector && tryActivation(option.connector);
                    }}
                    subheader={null} //use option.descriptio to bring back multi-line
                />
            );
        });
    }

    function getModalContent() {
        if (walletView === WALLET_VIEWS.ACCOUNT) {
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
        } else if (walletView === WALLET_VIEWS.ACCOUNT || !!account) {
            headerRow = (
                <HeaderRow color="blue">
                    <HoverText onClick={() => setWalletView(account ? WALLET_VIEWS.ACCOUNT : WALLET_VIEWS.OPTIONS)}>
                        <ArrowLeft />
                    </HoverText>
                </HeaderRow>
            );
        } else {
            headerRow = (
                <HeaderRow>
                    <HoverText>
                        <Trans>Connect a wallet</Trans>
                    </HoverText>
                </HeaderRow>
            );
        }

        return (
            <UpperSection>
                <CloseIcon onClick={toggleWalletModal}>
                    <CloseColor />
                </CloseIcon>
                {headerRow}
                <ContentWrapper>
                    <AutoColumn gap="16px">
                        {walletView === WALLET_VIEWS.PENDING && pendingConnector && <PendingView connector={pendingConnector} error={!!pendingError} tryActivation={tryActivation} />}
                        {walletView !== WALLET_VIEWS.PENDING && <OptionGrid data-cy="option-grid">{getOptions()}</OptionGrid>}
                    </AutoColumn>
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
