import { useCallback, useEffect } from "react";
import { SUPPORTED_WALLETS } from "../../constants/wallet";
import { useAccount, useDisconnect } from "wagmi";
import { clearAllTransactions } from "../../state/transactions/actions";
import { shortenAddress } from "../../utils";
import { ExplorerDataType, getExplorerLink } from "../../utils/getExplorerLink";
import Copy from "./Copy";
import Transaction from "./Transaction";
import { ReactComponent as Close } from "../../assets/images/x.svg";
import Identicon from "../Identicon";
import { ExternalLink as LinkIcon } from "react-feather";
import { ExternalLink } from "../../theme";
import { Trans } from "@lingui/macro";
import { useAppDispatch } from "state/hooks";
import { IconWrapper, WalletAction } from "./styled";
import { EthereumWindow } from "../../models/types";
import "./index.scss";
import Card from "../../shared/components/Card/Card";

function renderTransactions(transactions: string[]) {
    return (
        <div>
            {transactions.map((hash, i) => {
                return (
                    <div className={"mb-025"} key={i}>
                        <Transaction hash={hash} />
                    </div>
                );
            })}
        </div>
    );
}

interface AccountDetailsProps {
    toggleWalletModal: () => void;
    pendingTransactions: string[];
    confirmedTransactions: string[];
    ENSName?: string;
    openOptions: () => void;
}

export default function AccountDetails({ toggleWalletModal, pendingTransactions, confirmedTransactions, ENSName }: AccountDetailsProps) {
    const { address: account, chain, connector: activeConnector } = useAccount();
    const chainId = chain?.id;
    const { disconnect } = useDisconnect();
    const dispatch = useAppDispatch();

    function formatConnectorName() {
        const { ethereum } = window as unknown as EthereumWindow;
        const isMetaMask = !!(ethereum && ethereum.isMetaMask);
        const connectorName = activeConnector?.name;
        const name = Object.keys(SUPPORTED_WALLETS)
            .filter((k) => SUPPORTED_WALLETS[k].connectorId === activeConnector?.id && (SUPPORTED_WALLETS[k].name === "Browser Wallet" ? !isMetaMask : true))
            .map((k) => SUPPORTED_WALLETS[k].name)[0] || connectorName || 'Unknown Connector';

        return (
            <div className={`fs-085 ${name === "Metamask" && "mb-05"}`}>
                <Trans>Connected with {name}</Trans>
            </div>
        );
    }

    function getStatusIcon() {
        // activeConnector.id can be 'injected', 'walletConnect', 'coinbaseWallet', etc.
        if (activeConnector?.id === 'injected' || activeConnector?.id === 'metaMask') {
            return (
                <IconWrapper size={16}>
                    <Identicon />
                </IconWrapper>
            );
        }
        // Potentially return other icons based on activeConnector.id
        return null;
    }

    const clearAllTransactionsCallback = useCallback(() => {
        if (chainId) dispatch(clearAllTransactions({ chainId }));
    }, [dispatch, chainId]);

    return (
        <>
            <div className={"pos-r"}>
                <div className={"flex-s-between w-100 c-w mb-1"}>
                    <Trans>Account</Trans>
                    <span className={"cur-p hover-op trans-op"} onClick={toggleWalletModal}>
                        <Close />
                    </span>
                </div>
                <div className={"account-details p-1 mb-15 br-12 c-w"}>
                    <div className={"f f-ac mb-05"}>
                        {formatConnectorName()}
                        <WalletAction onClick={() => disconnect()}>
                            <Trans>Disconnect</Trans>
                        </WalletAction>
                    </div>
                    <div className={"l f f-ac c-w mb-05"} id="web3-account-identifier-row">
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
                    <div className={"f"}>
                        {ENSName ? (
                            <>
                                {account && (
                                    <Copy toCopy={account}>
                                        <Trans>Copy Address</Trans>
                                    </Copy>
                                )}
                                {chainId && account && (
                                    <ExternalLink href={getExplorerLink(chainId, ENSName, ExplorerDataType.ADDRESS)}>
                                        <LinkIcon size={"1rem"} color="var(--primary)" />
                                        <span className={"ml-025 c-p hover-line"}>
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
                                        <LinkIcon size={"1rem"} color="var(--primary)" />
                                        <span className={"ml-025 c-p hover-line"}>
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
                <Card isDark classes={"br-12 mt-1 p-1"}>
                    <div className={"c-p flex-s-between mb-05"}>
                        <Trans>Recent Transactions</Trans>
                        <button className={"br-0 bg-t c-p p-0 hover-line"} onClick={clearAllTransactionsCallback}>
                            <Trans>(clear all)</Trans>
                        </button>
                    </div>
                    {renderTransactions(pendingTransactions)}
                    {renderTransactions(confirmedTransactions)}
                </Card>
            ) : (
                <Card isDark classes={"f c f-ac f-jc br-12 mt-1 h-200"}>
                    <Trans>Your transactions will appear here...</Trans>
                </Card>
            )}
        </>
    );
}
