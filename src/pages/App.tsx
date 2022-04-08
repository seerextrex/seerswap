import ApeModeQueryParamReader from "hooks/useApeModeQueryParamReader";
import { Route, Switch } from "react-router-dom";
import ErrorBoundary from "../components/ErrorBoundary";
import Header from "../components/Header";
import Polling from "../components/Header/Polling";
import Popups from "../components/Popups";
import Web3ReactManager from "../components/Web3ReactManager";
import DarkModeQueryParamReader from "../theme/DarkModeQueryParamReader";
import { RedirectDuplicateTokenIds } from "./AddLiquidity/redirects";
import RemoveLiquidityV3 from "./RemoveLiquidity/V3";
import Swap from "./Swap";
import { RedirectPathToSwapOnly, RedirectToSwap } from "./Swap/redirects";
import { Pool } from "lib/src";
import MigrateV2Pair from "./MigrateV2/MigrateV2Pair";
import MigrateV2 from "./MigrateV2";
import { ExternalLink } from "react-feather";
import React, { useEffect } from "react";
import CautionModal from "../components/CautionModal";
import PoolFinder from "./PoolFinder";
import { useInternet } from "../hooks/useInternet";
import { useIsNetworkFailed } from "../hooks/useIsNetworkFailed";
import Loader from "../components/Loader";
import GoogleAnalyticsReporter from "../components/analytics/GoogleAnalyticsReporter";
import { GasPrice } from "../components/Header/GasPrice";
import { useFarmingActionsHandlers } from "../state/farming/hooks";
import { useActiveWeb3React } from "../hooks/web3";
import { BugReportLink, GlobalStyle, InternetError, Marginer, NetworkFailedCard } from "./styled";
import Footer from "components/Footer";

const RealStakerPage = React.lazy(() => import("./RealStakerPage"));
const StakingAnalyticsPage = React.lazy(() => import("./StakingAnalyticsPage"));
const AddLiquidity = React.lazy(() => import("./AddLiquidity"));
const PoolPage = React.lazy(() => import("./Pool"));
const StakingPage = React.lazy(() => import("./Staking/StakingPage"));
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
    const { onIsFarming } = useFarmingActionsHandlers();
    const networkFailed = useIsNetworkFailed();

    useEffect(() => {
        onIsFarming();
    }, []);
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
                    <div className={"w-100 maw-1180 ph-1 pt-3 mh-a pb-4"} style={{ zIndex: 3, marginBottom: "5rem" }}>
                        <CautionModal />
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
                                    <span>Connecting to Polygon</span>
                                </div>
                            </NetworkFailedCard>
                        )}
                        <div className={"pb-2 mm_pb-2 mxs_pb-2"} style={{ zIndex: 2 }}>
                            <Popups />
                            <React.Suspense fallback={<p>Loading....</p>}>
                                <Switch>
                                    <Route strict path="/farming" component={StakingPage} />

                                    <Route strict path="/info" component={InfoPage} />

                                    <Route exact strict path="/send" component={RedirectPathToSwapOnly} />
                                    <Route exact strict path="/swap/:outputCurrency" component={RedirectToSwap} />
                                    <Route exact strict path="/swap" component={Swap} />

                                    <Route exact strict path="/pool/find" component={PoolFinder} />
                                    <Route exact strict path="/pool" component={PoolPage} />
                                    <Route exact strict path="/pool/:tokenId" component={PositionPage} />

                                    <Route exact strict path="/add/:currencyIdA?/:currencyIdB?/:feeAmount?" component={RedirectDuplicateTokenIds} />
                                    <Route exact strict path="/increase/:currencyIdA?/:currencyIdB?/:tokenId?" component={AddLiquidity} />
                                    <Route exact strict path="/remove/:tokenId" component={RemoveLiquidityV3} />
                                    <Route exact strict path="/migrate" component={MigrateV2} />
                                    <Route exact strict path="/migrate/:address" component={MigrateV2Pair} />

                                    <Route exact strict path="/staking" component={RealStakerPage} />
                                    <Route exact strict path="/staking/analytics" component={StakingAnalyticsPage} />

                                    <Route component={RedirectPathToSwapOnly} />
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
