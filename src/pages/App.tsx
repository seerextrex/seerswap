import ApeModeQueryParamReader from "hooks/useApeModeQueryParamReader";
import { Route, Switch } from "react-router-dom";
import ErrorBoundary from "../components/ErrorBoundary";
import Header from "../components/Header";
import Popups from "../components/Popups";
import Web3ReactManager from "../components/Web3ReactManager";
import DarkModeQueryParamReader from "../theme/DarkModeQueryParamReader";
import { RedirectDuplicateTokenIdsNew } from "./AddLiquidity/redirects";
import RemoveLiquidityV3 from "./RemoveLiquidity/V3";
import Swap from "./Swap";
import { RedirectPathToPoolOnly, RedirectToSwap } from "./Swap/redirects";
import { Pool } from "lib/src";
import React, { useEffect } from "react";
import CautionModal from "../components/CautionModal";
import { useInternet } from "../hooks/useInternet";
import { useIsNetworkFailed } from "../hooks/useIsNetworkFailed";
import Loader from "../components/Loader";
import GoogleAnalyticsReporter from "../components/analytics/GoogleAnalyticsReporter";
import { useActiveWeb3React } from "../hooks/web3";
import { GlobalStyle, Marginer, NetworkFailedCard } from "./styled";
import Footer from "components/Footer";
import { t, Trans } from "@lingui/macro";

import "./index.scss";

import AlgebraConfig from "algebra.config";

const AddLiquidity = React.lazy(() => import("./AddLiquidity"));
const FarmingPage = React.lazy(() => import("./Farming/FarmingPage"));
const PoolPage = React.lazy(() => import("./Pool"));
const PositionPage = React.lazy(() => import("./Pool/PositionPage"));
const InfoPage = React.lazy(() => import("./InfoPage"));

export default function App() {
    Object.defineProperty(Pool.prototype, "tickSpacing", {
        get() {
            return 60;
        },
    });
    const internet = useInternet();
    const { account } = useActiveWeb3React();
    const networkFailed = useIsNetworkFailed();

    useEffect(() => {
        if (!account) return;

        type __window = Window & { dataLayer: any };
        const _window = window as unknown as __window;

        _window.dataLayer = _window.dataLayer || [];
        _window.dataLayer.push({
            event: "userId",
            user_id: account,
        });
    }, [account]);

    return (
        <ErrorBoundary>
            <GlobalStyle />
            <Route component={DarkModeQueryParamReader} />
            <Route component={ApeModeQueryParamReader} />
            <Route component={GoogleAnalyticsReporter} />
            <Web3ReactManager>
                <>
                    <Header />
                    <div className={"app-body w-100 maw-1180 ph-1 pt-3 mh-a pb-4 mm_pt-5"} style={{ zIndex: 3, marginBottom: "5rem" }}>
                        {/* {!internet && (
                            <InternetError>
                                <h2>Network ERROR</h2>
                            </InternetError>
                        )} */}
                        {networkFailed && (
                            <NetworkFailedCard>
                                <div style={{ display: "flex" }}>
                                    <Loader
                                        style={{
                                            display: "inline-block",
                                            margin: "auto 8px auto 0",
                                        }}
                                        stroke={"white"}
                                    />
                                    <span>{t`Connecting to ${AlgebraConfig.CHAIN_PARAMS.chainName}`}</span>
                                </div>
                            </NetworkFailedCard>
                        )}
                        <div className={"pb-2 mm_pb-2 mxs_pb-2"} style={{ zIndex: 2 }}>
                            <Popups />
                            <React.Suspense
                                fallback={
                                    <p>
                                        <Trans>Loading...</Trans>
                                    </p>
                                }
                            >
                                <Switch>
                                    <Route strict path="/info" component={InfoPage} />

                                    {/* <Route strict path="/farming" component={FarmingPage} /> */}

                                    <Route exact strict path="/send" component={RedirectPathToPoolOnly} />
                                    {/* <Route exact strict path="/swap/:outputCurrency" component={RedirectToSwap} />
                                    <Route exact strict path="/swap" component={Swap} /> */}

                                    <Route exact strict path="/pool" component={PoolPage} />
                                    <Route exact strict path="/pool/:tokenId" component={PositionPage} />

                                    <Route exact strict path="/add/:currencyIdA?/:currencyIdB?/:step?" component={RedirectDuplicateTokenIdsNew} />

                                    <Route exact strict path="/increase/:currencyIdA?/:currencyIdB?/:tokenId?" component={AddLiquidity} />
                                    <Route exact strict path="/remove/:tokenId" component={RemoveLiquidityV3} />

                                    <Route component={RedirectPathToPoolOnly} />
                                </Switch>
                            </React.Suspense>
                            <Marginer />
                        </div>
                    </div>
                    <Footer />
                </>
            </Web3ReactManager>
        </ErrorBoundary>
    );
}
