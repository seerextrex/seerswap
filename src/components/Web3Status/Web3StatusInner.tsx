import { useWeb3React } from "@web3-react/core";
import useENSName from "../../hooks/useENSName";
import { useSortedRecentTransactions } from "../../hooks/useSortedRecentTransactions";
import { useHasSocks } from "../../hooks/useSocksBalance";
import { useWalletModalToggle } from "../../state/application/hooks";
import { NetworkIcon, Text, Web3StatusConnect, Web3StatusConnected, Web3StatusError } from "./styled";
import { RowBetween } from "../Row";
import { t, Trans } from "@lingui/macro";
import Loader from "../Loader";
import { Sock } from "./Sock";
import { shortenAddress } from "../../utils";
import { StatusIcon } from "./StatusIcon";
import { EthereumWindow } from "models/types";
import { OntoWrongChainModal } from "components/OntoWrongChainModal";
import { useState } from "react";

import AlgebraConfig from "algebra.config";

export async function addPolygonNetwork() {
    const _window = window as EthereumWindow;

    try {
        await _window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [
                {
                    chainId: AlgebraConfig.CHAIN_PARAMS.chainIdHex,
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
                            chainId: AlgebraConfig.CHAIN_PARAMS.chainIdHex,
                            chainName: AlgebraConfig.CHAIN_PARAMS.chainName,
                            nativeCurrency: {
                                name: AlgebraConfig.CHAIN_PARAMS.nativeCurrency.name,
                                symbol: AlgebraConfig.CHAIN_PARAMS.nativeCurrency.symbol,
                                decimals: AlgebraConfig.CHAIN_PARAMS.nativeCurrency.decimals,
                            },
                            blockExplorerUrls: [AlgebraConfig.CHAIN_PARAMS.blockExplorerURL],
                            rpcUrls: [AlgebraConfig.CHAIN_PARAMS.rpcURL],
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
    const { account, connector } = useWeb3React();
    const { ENSName } = useENSName(account ?? undefined);
    const sortedRecentTransactions = useSortedRecentTransactions();

    const ontoWrongChainWarning = !!localStorage.getItem("ontoWarning");

    const pending = sortedRecentTransactions.filter((tx) => !tx.receipt).map((tx) => tx.hash);

    const hasPendingTransactions = !!pending.length;
    const hasSocks = useHasSocks();
    const toggleWalletModal = useWalletModalToggle();

    const [ontoHelper, toggleOntoHelper] = useState(false);

    //TODO: hanlde errors
    const error = false;

    if (account) {
        return (
            <Web3StatusConnected id="web3-status-connected" style={{ background: "#181e3e", color: "white", border: "none" }} onClick={toggleWalletModal} pending={hasPendingTransactions}>
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
                    <Text>{t`Connect to ${AlgebraConfig.CHAIN_PARAMS.chainName}`}</Text>
                </Web3StatusError>
            </>
        );
    } else if (error) {
        return (
            <Web3StatusError onClick={addPolygonNetwork}>
                <NetworkIcon />
                <Text>
                    <Trans>Error</Trans>
                </Text>
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
// function WrappedStatusIcon({ connector }: { connector: Connector }) {
//     return (
//       <IconWrapper size={16}>
//         <StatusIcon connector={connector} />
//       </IconWrapper>
//     )
//   }
// export function Web3StatusInner() {
//     const { account, connector, chainId, ENSName } = useWeb3React();

//     const error = useAppSelector((state) => state.wallet.errorByWallet[getWalletForConnector(connector)]);

//     const chainAllowed = chainId && AlgebraConfig.CHAIN_PARAMS.chainId == chainId;

//     const allTransactions = useAllTransactions();

//     const sortedRecentTransactions = useMemo(() => {
//         const txs = Object.values(allTransactions);
//         return txs.filter(isTransactionRecent).sort(newTransactionsFirst);
//     }, [allTransactions]);

//     const pending = sortedRecentTransactions.filter((tx) => !tx.receipt).map((tx) => tx.hash);

//     const hasPendingTransactions = !!pending.length;
//     const hasSocks = useHasSocks();
//     const toggleWalletModal = useWalletModalToggle();

//     if (!chainId) {
//         return null;
//     } else if (!chainAllowed) {
//         return (
//             <Web3StatusError onClick={toggleWalletModal}>
//                 <NetworkIcon />
//                 <Text>
//                     <Trans>Wrong Network</Trans>
//                 </Text>
//             </Web3StatusError>
//         );
//     } else if (error) {
//         return (
//             <Web3StatusError onClick={toggleWalletModal}>
//                 <NetworkIcon />
//                 <Text>
//                     <Trans>Error</Trans>
//                 </Text>
//             </Web3StatusError>
//         );
//     } else if (account) {
//         return (
//             <Web3StatusConnected id="web3-status-connected" onClick={toggleWalletModal} pending={hasPendingTransactions}>
//                 {hasPendingTransactions ? (
//                     <RowBetween>
//                         <Text>
//                             <Trans>{pending?.length} Pending</Trans>
//                         </Text>{" "}
//                         <Loader stroke="white" />
//                     </RowBetween>
//                 ) : (
//                     <>
//                         {hasSocks ? <Sock /> : null}
//                         <Text>{ENSName || shortenAddress(account)}</Text>
//                     </>
//                 )}
//                 {!hasPendingTransactions && connector && <WrappedStatusIcon connector={connector} />}
//             </Web3StatusConnected>
//         );
//     } else {
//         return (
//             <Web3StatusConnect id="connect-wallet" onClick={toggleWalletModal} faded={!account}>
//                 <Text>
//                     <Trans>Connect Wallet</Trans>
//                 </Text>
//             </Web3StatusConnect>
//         );
//     }
// }
