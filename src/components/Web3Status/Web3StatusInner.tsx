import { UnsupportedChainIdError, useWeb3React } from "@web3-react/core";
import useENSName from "../../hooks/useENSName";
import { useSortedRecentTransactions } from "../../hooks/useSortedRecentTransactions";
import { useHasSocks } from "../../hooks/useSocksBalance";
import { useWalletModalToggle } from "../../state/application/hooks";
import { useContext } from "react";
import { ThemeContext } from "styled-components/macro";
import { NetworkIcon, Text, Web3StatusConnect, Web3StatusConnected, Web3StatusError } from "./styled";
import { RowBetween } from "../Row";
import { Trans } from "@lingui/macro";
import Loader from "../Loader";
import { Sock } from "./Sock";
import { shortenAddress } from "../../utils";
import { StatusIcon } from "./StatusIcon";

export async function addPolygonNetwork() {
    try {
        await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [
                {
                    chainId: "137",
                },
            ],
        });
    } catch (switchError: any) {
        // This error code indicates that the chain has not been added to MetaMask.
        if (switchError.code === 4902) {
            try {
                await window?.ethereum?.request({
                    method: "wallet_addEthereumChain",
                    params: [
                        {
                            chainId: "137",
                            chainName: "Polygon Mainnet",
                            nativeCurrency: {
                                name: "MATIC",
                                symbol: "MATIC",
                                decimals: 18,
                            },
                            blockExplorerUrls: ["https://polygonscan.com/"],
                            rpcUrls: ["https://polygon-mainnet.infura.io/v3/a4f8e4693b7a465da0848c3f82732f23"],
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

    const pending = sortedRecentTransactions.filter((tx) => !tx.receipt).map((tx) => tx.hash);

    const hasPendingTransactions = !!pending.length;
    const hasSocks = useHasSocks();
    const toggleWalletModal = useWalletModalToggle();

    const theme = useContext(ThemeContext);

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
                        <Text>{ENSName || shortenAddress(account)}</Text>
                    </>
                )}
                {!hasPendingTransactions && connector && <StatusIcon connector={connector} />}
            </Web3StatusConnected>
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
