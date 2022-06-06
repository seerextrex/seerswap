import Loader from "components/Loader";
import { useEffect, useMemo, useState } from "react";
import { CheckCircle } from "react-feather";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "state/hooks";
import { setAddLiquidityTxHash, setShowNewestPosition } from "state/mint/v3/actions";
import { useAddLiquidityTxHash } from "state/mint/v3/hooks";
import { useAllTransactions, useTransactionAdder } from "state/transactions/hooks";
import "./index.scss";

interface IAftermath {
    done?: boolean;
}

export function Aftermath({ done }: IAftermath) {
    const [isConfirmed, toggleIsConfirmed] = useState(false);

    const allTransactions = useAllTransactions();

    const dispatch = useAppDispatch();
    const txHash = useAddLiquidityTxHash();

    const sortedRecentTransactions = useMemo(() => {
        const txs = Object.values(allTransactions);
        return txs.filter((tx) => new Date().getTime() - tx.addedTime < 86_400_000).sort((a, b) => b.addedTime - a.addedTime);
    }, [allTransactions]);

    const confirmed = useMemo(() => sortedRecentTransactions.filter((tx) => tx.receipt).map((tx) => tx.hash), [sortedRecentTransactions, allTransactions]);

    const test = useMemo(() => sortedRecentTransactions.filter((tx) => tx.receipt), [sortedRecentTransactions, allTransactions])

    useEffect(() => {
            console.log('ttttt', test)
    }, [test])

    useEffect(() => {
        if (confirmed.some((hash) => hash === txHash)) {
            toggleIsConfirmed(true);
            dispatch(setAddLiquidityTxHash({ txHash: "" }));
            dispatch(setShowNewestPosition({ showNewestPosition: true }));
        }
    }, [confirmed, txHash]);

    return (
        <div className="f c f-ac f-jc w-100" style={{ height: "calc(414px + 4rem)" }}>
            {isConfirmed ? (
                <>
                    <div>
                        {" "}
                        <CheckCircle size={"36px"} stroke={"var(--green)"} />
                    </div>
                    <div className="mt-1 fs-125">Liquidity added!</div>
                    <Link to={"/pool"} className="go-to-pools mt-2">
                        Go to pools
                    </Link>
                </>
            ) : (
                <>
                    <div>
                        <Loader size={"36px"} stroke={"white"} />
                    </div>
                    <div className="mt-1 fs-125">Adding liquidity</div>
                </>
            )}
        </div>
    );
}
