import { AbstractConnector } from '@web3-react/abstract-connector'
import { SUPPORTED_WALLETS } from '../../constants/wallet'
import Option from './Option'
import { injected } from '../../connectors'
import { Trans } from '@lingui/macro'
import { ErrorButton, ErrorGroup, LoadingMessage, LoadingWrapper, PendingSection, StyledLoader } from './styled'

interface PendingView {
    connector?: AbstractConnector
    error?: boolean
    setPendingError: (error: boolean) => void
    tryActivation: (connector: AbstractConnector) => void
    errorMessage: string
}

export default function PendingView({ connector, error = false, setPendingError, tryActivation, errorMessage }:PendingView ) {
    const isMetamask = window?.ethereum?.isMetaMask

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
                                    setPendingError(false)
                                    connector && tryActivation(connector)
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
                const option = SUPPORTED_WALLETS[key]
                if (option.connector === connector) {
                    if (option.connector === injected) {
                        if (isMetamask && option.name !== 'MetaMask') {
                            return null
                        }
                        if (!isMetamask && option.name === 'MetaMask') {
                            return null
                        }
                    }
                    return (
                        <Option
                            id={`connect-${key}`}
                            key={key}
                            clickable={false}
                            color={option.color}
                            header={errorMessage}
                            subheader={option.description}
                            icon={option.iconURL}
                        />
                    )
                }
                return null
            })}
        </PendingSection>
    )
}
