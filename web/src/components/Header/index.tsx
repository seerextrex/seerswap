import React, { useCallback, useContext, useMemo, useState } from "react";
import { useETHBalances } from "state/wallet/hooks";
// @ts-ignore
import Logo from "../../assets/images/seerswap.jpg";
import { useAccount } from 'wagmi';
import { ConnectKitButton } from 'connectkit';
import NetworkCard from "./NetworkCard";
import { useIsNetworkFailed } from "../../hooks/useIsNetworkFailed";
import usePrevious from "../../hooks/usePrevious";
import { isMobile } from "react-device-detect";
import { BalanceText } from "./styled";
import "./index.scss";
import { NavLink } from "react-router-dom";
import { Trans } from "@lingui/macro";

import AlgebraConfig from "algebra.config";
import { ArrowUpRight, Link } from "react-feather";
import { ThemeContext } from "styled-components/macro";
import { ReactComponent as Close } from "../../assets/images/x.svg";

export default function Header() {
    const [showBanner, setShowBanner] = useState(true);

    const { address: account, chain } = useAccount();
    const currentChainId = chain?.id;
    const theme = useContext(ThemeContext);

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

    if (currentChainId === AlgebraConfig.CHAIN_PARAMS.chainId) {
        chainValue = AlgebraConfig.CHAIN_PARAMS.nativeCurrency.symbol;
    }

    const handleBlur = useCallback((e: React.ChangeEvent<HTMLLabelElement>) => {
        const target = e.target.control as HTMLInputElement;

        if (!target) return;

        setTimeout(() => (target.checked = false), 100);
    }, []);

    return (
        <>
            {showBanner && (
                <div
                    style={{
                        width: "100%",
                        minHeight: "45px",
                        background: theme.winterMainButton,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        textAlign: "center",
                        padding: "0.75rem",
                        gap: "10px",
                        fontSize: "14px",
                    }}
                >
                    <div
                        style={{
                            width: "100%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            textAlign: "center",
                            flexWrap: "wrap",
                            gap: "10px",
                        }}
                    >
                        <p>
                            Make sure you are on <span style={{ fontWeight: "bold" }}>app.seerswap.org</span>
                        </p>
                    </div>
                    <button
                        style={{
                            background: "none",
                            color: "inherit",
                            border: "none",
                            padding: "0",
                            font: "inherit",
                            cursor: "pointer",
                            outline: "inherit",
                        }}
                        onClick={() => setShowBanner(false)}
                    >
                        <Close />
                    </button>
                </div>
            )}
            <div className={"header__wrapper flex-s-between w-100 pv-1 pl-2"}>
                <a className={"header__logo hover-op trans-op mxs_mr-1"} href=".">
                    <img src={Logo} alt="logo" />
                </a>
                <div className={"header__links"}>
                    <NavLink className={"header__links__link hover-op"} activeClassName={"header__links__link--active"} id={`swap-nav-link`} to={"/swap"}>
                        <Trans>Swap</Trans>
                    </NavLink>
                    <NavLink
                        className={"header__links__link hover-op trans-op"}
                        id={`pool-nav-link`}
                        to={"/pool"}
                        isActive={(match, { pathname }) =>
                            Boolean(match) || pathname.startsWith("/add") || pathname.startsWith("/remove") || pathname.startsWith("/increase") || pathname.startsWith("/find")
                        }
                        activeClassName={"header__links__link--active"}
                    >
                        <Trans>Positions</Trans>
                    </NavLink>
                    <NavLink className={"header__links__link hover-op"} activeClassName={"header__links__link--active"} id={`farming-nav-link`} to={"/farming"}>
                        <span>
                            <Trans>Farming</Trans>
                        </span>
                        <span className={"header__farming-circle"} />
                    </NavLink>
                    <NavLink className={"header__links__link hover-op"} activeClassName={"header__links__link--active"} id={`info-nav-link`} to={"/info"}>
                        <Trans>Markets</Trans>
                    </NavLink>
                    {/* <a className={"header__links__link hover-op"} id={`info-nav-link`} href="https://swapr.eth.limo" target="_blank" style={{ display: "flex", alignItems: "center" }}>
                    <Trans>Swap</Trans>
                    <ArrowUpRight width={18} style={{ marginLeft: "4px" }} />
                </a> */}
                </div>

                <div className={"header__account flex-s-between"}>
                    <NetworkCard />

                    {(account && currentChainId === AlgebraConfig.CHAIN_PARAMS.chainId && userEthBalance) || networkFailed ? (
                        <BalanceText style={{ flexShrink: 0 }} px="0.85rem" fontWeight={500}>
                            {_userEthBalance?.toFixed(2)} {!isMobile && chainValue}
                        </BalanceText>
                    ) : null}
                    <ConnectKitButton
                        customTheme={{
                            "--ck-connectbutton-hover-background": "#40444f",
                            "--ck-overlay-background": "rgba(0, 0, 0, 0.8)",
                            "--ck-modal-box-shadow": "0px 4px 16px rgba(0, 0, 0, 0.2)",
                        }}
                        mode="light"
                        theme="midnight"
                    />
                </div>
            </div>
        </>
    );
}
