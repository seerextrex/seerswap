import { t, Trans } from "@lingui/macro";
import { SwitchLocaleLink } from "components/SwitchLocaleLink";
import { useSubgraphPositions, useSubgraphPositionsByMarket } from "hooks/useSubgraphPositionsV2";
import { useAccount } from "wagmi";
import { useMemo } from "react";
import { NavLink } from "react-router-dom";
import { useUserHideClosedPositions, useUserHideLowValuePositions } from "state/user/hooks";
import { Helmet } from "react-helmet";
import Loader from "../../components/Loader";
import FilterPanelItem from "./FilterPanelItem";
import LowValueFilter from "./LowValueFilter";
import Card from "../../shared/components/Card/Card";
import AutoColumn from "../../shared/components/AutoColumn";
import { SwapPoolTabs } from "../../components/NavigationTabs";
import "./index.scss";
import MarketPositionsView from "../../components/MarketPositionsView";
import { Frown } from "react-feather";
import { PositionPoolExtended } from "../../hooks/useSubgraphPositionsV2";
import { calculatePositionValueUSD } from "../../utils/position";

export default function Pool() {
    const { address: account } = useAccount();

    const [userHideClosedPositions, setUserHideClosedPositions] = useUserHideClosedPositions();
    const [userHideLowValuePositions, setUserHideLowValuePositions] = useUserHideLowValuePositions();

    const { loading: positionsLoading, error, refetch } = useSubgraphPositions(account);
    const { positionsByMarket: rawPositionsByMarket } = useSubgraphPositionsByMarket(account);

    const filters = [
        {
            method: setUserHideClosedPositions,
            checkValue: userHideClosedPositions,
        },
    ];

    // Filter positionsByMarket for market view
    const positionsByMarket = useMemo(() => {
        if (!rawPositionsByMarket) return undefined;
        
        const filteredMap = new Map<string, PositionPoolExtended[]>();
        
        rawPositionsByMarket.forEach((positions, marketId) => {
            let filtered = positions;
            
            if (userHideClosedPositions) {
                filtered = filtered.filter(p => p.liquidity > 0n);
            }
            
            if (userHideLowValuePositions) {
                filtered = filtered.filter(p => {
                    const value = calculatePositionValueUSD(p);
                    // Show positions where value can't be determined
                    if (value === null) return true;
                    return value >= 1; // Fixed $1 threshold
                });
            }
            
            // Only add markets that have positions after filtering
            if (filtered.length > 0) {
                filteredMap.set(marketId, filtered);
            }
        });
        
        return filteredMap;
    }, [rawPositionsByMarket, userHideClosedPositions, userHideLowValuePositions]);

    const hasPositions = positionsByMarket && positionsByMarket.size > 0;

    return (
        <>
            <Helmet>
                <title>{t`Pool`}</title>
            </Helmet>
            <Card classes={"card-gradient-shadow br-24 ph-2 pv-1 mxs_ph-1 mv-2"}>
                <SwapPoolTabs active={"pool"} />
                <AutoColumn gap="1">
                    <div className={"pool__header flex-s-between"}>
                        <span className={"fs-125"}>
                            <Trans>Positions Overview</Trans>
                        </span>
                        <div className={"flex-s-between gap-1 mxs_mv-05"}>
                            {hasPositions && (
                                <NavLink className={"btn primary p-05 br-8"} id="join-pool-button" to={`/add`}>
                                    + <Trans>New Position</Trans>
                                </NavLink>
                            )}
                        </div>
                    </div>
                    {account && (
                        <div className={"f mb-05 rg-2 cg-2 mxs_f-jc f-wrap"}>
                            {filters.map((item, key) => (
                                <FilterPanelItem item={item} key={key} />
                            ))}
                            <LowValueFilter
                                isActive={userHideLowValuePositions}
                                onToggle={setUserHideLowValuePositions}
                            />
                        </div>
                    )}
                    <main className={"f c f-ac"}>
                        {!account ? (
                            <div className={"f c f-ac f-jc h-400 w-100 maw-300"}>
                                <Trans>Connect to a wallet to view your liquidity.</Trans>
                            </div>
                        ) : positionsLoading ? (
                            <Loader style={{ margin: "auto" }} stroke="white" size={"2rem"} />
                        ) : error ? (
                            <div className={"f c f-ac f-jc h-400 w-100 maw-300"}>
                                <Frown size={48} />
                                <Trans>Error loading positions</Trans>
                                <button onClick={refetch} className="btn btn-sm mt-1">
                                    <Trans>Retry</Trans>
                                </button>
                            </div>
                        ) : hasPositions ? (
                            <MarketPositionsView positionsByMarket={positionsByMarket} />
                        ) : (
                            <div className={"f c f-ac f-jc h-400 w-100 maw-300"}>
                                <Trans>You do not have any liquidity positions.</Trans>
                                <NavLink style={{ textAlign: "center" }} className={"btn primary pv-05 ph-1 mt-1 w-100"} to={`/add`}>
                                    + <Trans>New Position</Trans>
                                </NavLink>
                            </div>
                        )}
                    </main>
                </AutoColumn>
            </Card>
            <SwitchLocaleLink />
        </>
    );
}
