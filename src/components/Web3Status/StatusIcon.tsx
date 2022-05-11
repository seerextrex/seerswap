import { AbstractConnector } from "@web3-react/abstract-connector";
import { injected, ontoconnector, walletconnector } from '../../connectors'
import Identicon from "../Identicon";
import WalletConnectImg from "../../assets/images/walletConnectionIcon.svg";
import OntoImg from '../../assets/images/onto-logo.svg'

import "./index.scss";

export function StatusIcon({ connector }: { connector: AbstractConnector }) {
    if (connector === injected) {
        return <Identicon />;
    }
    if (connector === walletconnector) {
        return <img className="account-img" style={{ width: "18px", height: "18px" }} src={WalletConnectImg} alt="" />;
    }
    if (connector === ontoconnector) {
        return <img className="account-img" style={{ width: "21px", height: "21px" }} src={OntoImg} alt="" />;
    }
    return null;
}
