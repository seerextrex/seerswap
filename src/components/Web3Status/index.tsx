import { useWeb3React } from "@web3-react/core";
import { NetworkContextName } from "../../constants/misc";
import useENSName from "../../hooks/useENSName";
import WalletModal from "../WalletModal";
import { useSortedRecentTransactions } from "../../hooks/useSortedRecentTransactions";
import { Web3StatusInner } from "./Web3StatusInner";

export default function Web3Status() {
    const { active, account } = useWeb3React();
    const contextNetwork = useWeb3React(NetworkContextName);
    const { ENSName } = useENSName(account ?? undefined);

    const sortedRecentTransactions = useSortedRecentTransactions();

    const pending = sortedRecentTransactions.filter((tx) => !tx.receipt).map((tx) => tx.hash);
    const confirmed = sortedRecentTransactions.filter((tx) => tx.receipt).map((tx) => tx.hash);

    if (!contextNetwork.active && !active) {
        return <div>Connecting to MetaMask...</div>;
    }

    return (
        <>
            <Web3StatusInner />
            <WalletModal ENSName={ENSName ?? undefined} pendingTransactions={pending} confirmedTransactions={confirmed} />
        </>
    );
}
