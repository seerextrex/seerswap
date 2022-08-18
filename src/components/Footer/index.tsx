import { Trans } from "@lingui/macro";
import { GasPrice } from "components/Header/GasPrice";
import Polling from "components/Header/Polling";
import { PoweredByAlgebra } from "components/Header/PoweredByAlgebra";
import Loader from "components/Loader";
import { BugReportLink, NetworkFailedCard } from "pages/styled";
import { ExternalLink } from "react-feather";
import "./index.scss";

export default function Footer() {
    return (
        <footer className={"footer-wrapper f f-jb mt-1"}>
            {/* <BugReportLink target="_blank" rel="noopener noreferrer" href="https://algebra.finance/bug-report/">
                <span>
                    <Trans>Report a bug</Trans>
                </span>
                <span className={"ml-05"}>
                    <ExternalLink size={14} stroke={"white"} />
                </span>
            </BugReportLink> */}
            <div className={"f w-100 f-jb f-ac"}>
                {/* <span className={"mr-1"}>
                    <GasPrice />
                </span> */}
                <span className={"ml-a mr-a"}>
                    <PoweredByAlgebra />
                </span>
                <span>
                    <Polling />
                </span>
            </div>
        </footer>
    );
}
