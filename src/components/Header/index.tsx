import { useCallback, useMemo } from "react";
import { useETHBalances } from "state/wallet/hooks";
// @ts-ignore
import Logo from "../../assets/images/swapr-logo.svg";
import { useWeb3React } from "@web3-react/core";
import Web3Status from "../Web3Status";
import NetworkCard from "./NetworkCard";
import { useIsNetworkFailed } from "../../hooks/useIsNetworkFailed";
import usePrevious from "../../hooks/usePrevious";
import { isMobile } from "react-device-detect";
import { BalanceText } from "./styled";
import "./index.scss";
import { NavLink } from "react-router-dom";
import { Trans } from "@lingui/macro";

import AlgebraConfig from "algebra.config";

export default function Header() {
    const { account, chainId } = useWeb3React();

    const userEthBalance = useETHBalances(account ? [account] : [])?.[account ?? ""];

    const prevEthBalance = usePrevious(userEthBalance);

    const _userEthBalance = useMemo(() => {
        if (!userEthBalance) {
            return prevEthBalance;
        }

        return userEthBalance;
    }, [userEthBalance]);

    const networkFailed = useIsNetworkFailed();

    let chainValue;

    if (chainId === AlgebraConfig.CHAIN_PARAMS.chainId) {
        chainValue = AlgebraConfig.CHAIN_PARAMS.nativeCurrency.symbol;
    }

    const handleBlur = useCallback((e: React.ChangeEvent<HTMLLabelElement>) => {
        const target = e.target.control as HTMLInputElement;

        if (!target) return;

        setTimeout(() => (target.checked = false), 100);
    }, []);

    return (
        <div className={"header__wrapper flex-s-between w-100 pv-1 pl-2"}>
            <a className={"header__logo hover-op trans-op mxs_mr-1"} href=".">
                <img src={Logo} alt="logo" />
            </a>
            <div className={"header__links"}>
                <NavLink
                    className={"header__links__link hover-op trans-op"}
                    id={`pool-nav-link`}
                    to={"/pool"}
                    isActive={(match, { pathname }) =>
                        Boolean(match) || pathname.startsWith("/add") || pathname.startsWith("/remove") || pathname.startsWith("/increase") || pathname.startsWith("/find")
                    }
                    activeClassName={"header__links__link--active"}
                >
                    <Trans>Pool</Trans>
                </NavLink>
                <NavLink className={"header__links__link hover-op"} activeClassName={"header__links__link--active"} id={`info-nav-link`} to={"/info"}>
                    <Trans>Info</Trans>
                </NavLink>
            </div>

            <div className={"header__account flex-s-between"}>
                {account && (
                    <>
                        <NetworkCard />
                        {(chainId === AlgebraConfig.CHAIN_PARAMS.chainId && account && userEthBalance) || networkFailed ? (
                            <BalanceText style={{ flexShrink: 0 }} px="0.85rem" fontWeight={500}>
                                {_userEthBalance?.toFixed(5)} {!isMobile && chainValue}
                            </BalanceText>
                        ) : null}
                    </>
                )}
                <Web3Status />
            </div>
        </div>
    );
}
