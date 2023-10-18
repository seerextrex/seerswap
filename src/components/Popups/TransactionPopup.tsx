import { AlertCircle, CheckCircle } from "react-feather";
import { useWeb3React } from "@web3-react/core";
import { ExternalLink } from "../../theme";
import { ExplorerDataType, getExplorerLink } from "../../utils/getExplorerLink";
import { t, Trans } from "@lingui/macro";

interface TransactionPopupProps {
    hash: string;
    success?: boolean;
    summary?: string;
}

export default function TransactionPopup({ hash, success, summary }: TransactionPopupProps) {
    const { chainId } = useWeb3React();

    return (
        <div id={success ? `transaction-success-toast` : `transaction-failed-toast`} className={`${hash} f f-ac`}>
            <div className={"pr-1"}>{success ? <CheckCircle color={"var(--green)"} size={"1.5rem"} /> : <AlertCircle color={"var(--red)"} size={"1.5rem"} />}</div>
            <div>
                <div className={"mb-025"}>{summary ?? t`Hash: ` + hash.slice(0, 8) + "..." + hash.slice(58, 65)}</div>
                {chainId && (
                    <ExternalLink href={getExplorerLink(chainId, hash, ExplorerDataType.TRANSACTION)}>
                        <Trans>View on Explorer</Trans>
                    </ExternalLink>
                )}
            </div>
        </div>
    );
}
