import Identicon from "../Identicon";
import WalletConnectImg from "../../assets/images/walletConnectionIcon.svg";
import { Connector } from "@web3-react/types";

import "./index.scss";
import { injected, walletConnect } from "../../connectors";

export function StatusIcon({ connector }: { connector: Connector }) {
    if (connector === injected) {
        return <Identicon />;
    }
    if (connector === walletConnect) {
        return <img className="account-img" style={{ width: "18px", height: "18px" }} src={WalletConnectImg} alt="" />;
    }
    return null;
}
