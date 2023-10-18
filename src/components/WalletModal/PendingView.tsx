import { SUPPORTED_WALLETS } from "../../constants/wallet";
import Option from "./Option";
import { injected } from "../../connectors";
import { Trans } from "@lingui/macro";
import { ErrorButton, ErrorGroup, LoadingMessage, LoadingWrapper, PendingSection, StyledLoader } from "./styled";
import { Connector } from "@web3-react/types";

interface PendingView {
    connector?: Connector;
    error?: boolean;
    tryActivation: (connector: Connector) => void;
    errorMessage?: string;
}

export default function PendingView({ connector, error = false, tryActivation, errorMessage }: PendingView) {
    const isMetamask = window?.ethereum?.isMetaMask;

    return (
        <PendingSection>
            <LoadingMessage error={error}>
                <LoadingWrapper>
                    {error ? (
                        <ErrorGroup>
                            <div>
                                <Trans>Error connecting</Trans>
                            </div>
                            <ErrorButton
                                onClick={() => {
                                    connector && tryActivation(connector);
                                }}
                            >
                                <Trans>Try Again</Trans>
                            </ErrorButton>
                        </ErrorGroup>
                    ) : (
                        <>
                            <StyledLoader />
                            <Trans>Initializing...</Trans>
                        </>
                    )}
                </LoadingWrapper>
            </LoadingMessage>
            {Object.keys(SUPPORTED_WALLETS).map((key) => {
                const option = SUPPORTED_WALLETS[key];
                if (option.connector === connector) {
                    if (option.connector === injected) {
                        if (isMetamask && option.name !== "MetaMask") {
                            return null;
                        }
                        if (!isMetamask && option.name === "MetaMask") {
                            return null;
                        }
                    }
                    return <Option id={`connect-${key}`} key={key} clickable={false} color={option.color} header={errorMessage} subheader={option.description} icon={option.iconURL} />;
                }
                return null;
            })}
        </PendingSection>
    );
}
