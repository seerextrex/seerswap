import { UnsupportedChainIdError, useWeb3React } from "@web3-react/core";
import useENSName from "../../hooks/useENSName";
import { useSortedRecentTransactions } from "../../hooks/useSortedRecentTransactions";
import { useHasSocks } from "../../hooks/useSocksBalance";
import { useWalletModalToggle } from "../../state/application/hooks";
import { NetworkIcon, Text, Web3StatusConnect, Web3StatusConnected, Web3StatusError } from "./styled";
import { RowBetween } from "../Row";
import { Trans } from "@lingui/macro";
import Loader from "../Loader";
import { Sock } from "./Sock";
import { shortenAddress } from "../../utils";
import { StatusIcon } from "./StatusIcon";
import { EthereumWindow } from "models/types";
import { OntoWrongChainModal } from "components/OntoWrongChainModal";
import { useState } from "react";

export async function addPolygonNetwork() {
    const _window = window as EthereumWindow;

    try {
        await _window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [
                {
                    chainId: "0x89",
                },
            ],
        });
        window.location.reload();
    } catch (switchError: any) {
        // This error code indicates that the chain has not been added to MetaMask.
        if (switchError.code === 4902) {
            try {
                await _window?.ethereum?.request({
                    method: "wallet_addEthereumChain",
                    params: [
                        {
                            chainId: "0x89",
                            chainName: "Polygon Mainnet",
                            nativeCurrency: {
                                name: "MATIC",
                                symbol: "MATIC",
                                decimals: 18,
                            },
                            blockExplorerUrls: ["https://polygonscan.com/"],
                            rpcUrls: ["https://polygon-rpc.com"],
                        },
                    ],
                });
            } catch (addError) {
                // handle "add" error
            }
        }
        // handle other "switch" errors
    }
}

export function Web3StatusInner() {
    const { account, connector, error } = useWeb3React();
    const { ENSName } = useENSName(account ?? undefined);
    const sortedRecentTransactions = useSortedRecentTransactions();

    const ontoWrongChainWarning = !!localStorage.getItem("ontoWarning");

    const pending = sortedRecentTransactions.filter((tx) => !tx.receipt).map((tx) => tx.hash);

    const hasPendingTransactions = !!pending.length;
    const hasSocks = useHasSocks();
    const toggleWalletModal = useWalletModalToggle();

    const [ontoHelper, toggleOntoHelper] = useState(false);

    if (account) {
        return (
            <Web3StatusConnected id="web3-status-connected" style={{ background: "transparent", color: "white", border: "none" }} onClick={toggleWalletModal} pending={hasPendingTransactions}>
                {hasPendingTransactions ? (
                    <RowBetween>
                        <Text>
                            <Trans>{pending?.length} Pending</Trans>
                        </Text>{" "}
                        <Loader stroke="white" />
                    </RowBetween>
                ) : (
                    <>
                        {hasSocks ? <Sock /> : null}
                        <Text>{ENSName || shortenAddress(account, 2)}</Text>
                    </>
                )}
                {!hasPendingTransactions && connector && <StatusIcon connector={connector} />}
            </Web3StatusConnected>
        );
    } else if (ontoWrongChainWarning) {
        return (
            <>
                {ontoHelper && <OntoWrongChainModal handleClose={() => toggleOntoHelper(false)} />}
                <Web3StatusError onClick={() => toggleOntoHelper(true)}>
                    <NetworkIcon />
                    <Text>
                        <Trans>Connect to Polygon</Trans>
                    </Text>
                </Web3StatusError>
            </>
        );
    } else if (error) {
        return (
            <Web3StatusError onClick={addPolygonNetwork}>
                <NetworkIcon />
                <Text>{error instanceof UnsupportedChainIdError ? <Trans>Connect to Polygon</Trans> : <Trans>Error</Trans>}</Text>
            </Web3StatusError>
        );
    } else {
        return (
            <Web3StatusConnect id="connect-wallet" onClick={toggleWalletModal} faded={!account}>
                <Text>
                    <Trans>Connect Wallet</Trans>
                </Text>
            </Web3StatusConnect>
        );
    }
}
