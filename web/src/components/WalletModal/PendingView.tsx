import { SUPPORTED_WALLETS } from "../../constants/wallet";
import Option from "./Option";
import { Trans } from "@lingui/macro";
import { ErrorButton, ErrorGroup, LoadingMessage, LoadingWrapper, PendingSection, StyledLoader } from "./styled";
import { Connector as WagmiConnector } from 'wagmi';

export interface PendingViewProps {
    connector?: WagmiConnector;
    error?: boolean;
    tryActivation: (connector: WagmiConnector) => void;
    errorMessage?: string;
    onBack: () => void;
}

export default function PendingView({ connector, error = false, tryActivation, errorMessage, onBack }: PendingViewProps) {
    const isMetamask = typeof window !== 'undefined' && window?.ethereum?.isMetaMask;

    return (
        <PendingSection>
            <LoadingMessage error={error}>
                <LoadingWrapper>
                    {error ? (
                        <ErrorGroup>
                            <div>
                                <Trans>Error connecting</Trans> {errorMessage && `: ${errorMessage}`}
                            </div>
                            <ErrorButton
                                onClick={() => {
                                    if (connector) {
                                        tryActivation(connector);
                                    } else {
                                        onBack();
                                    }
                                }}
                            >
                                <Trans>Try Again</Trans>
                            </ErrorButton>
                            <ErrorButton onClick={onBack} style={{ marginLeft: '10px' }}>
                                <Trans>Back</Trans>
                            </ErrorButton>
                        </ErrorGroup>
                    ) : (
                        <>
                            <StyledLoader />
                            <Trans>Initializing...</Trans> {connector?.name && `with ${connector.name}`}
                        </>
                    )}
                </LoadingWrapper>
            </LoadingMessage>
            {connector && SUPPORTED_WALLETS[connector.id.toUpperCase()] && (() => {
                const option = SUPPORTED_WALLETS[connector.id.toUpperCase()] ||
                    (connector.id === 'injected' && SUPPORTED_WALLETS['METAMASK']) ||
                    Object.values(SUPPORTED_WALLETS).find(sw => sw.connectorId === connector.id);

                if (option) {
                    if (option.connectorId === 'metaMask' || (option.connectorId === 'injected' && connector.name === 'MetaMask')) {
                        if (isMetamask && option.name !== "MetaMask" && connector.name !== "MetaMask") {
                            return null;
                        }
                        if (!isMetamask && option.name === "MetaMask") {
                            return null;
                        }
                    }
                    return (
                        <Option
                            id={`connect-${option.connectorId}`}
                            key={option.connectorId}
                            clickable={false}
                            color={option.color}
                            header={option.name}
                            subheader={option.description}
                            icon={option.iconURL}
                        />
                    );
                }
                return null;
            })()}
        </PendingSection>
    );
}
