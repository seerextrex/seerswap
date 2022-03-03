import { Plus } from "react-feather";
import { useActiveWeb3React } from "../../hooks/web3";
import { useWalletModalToggle } from "../../state/application/hooks";
import { convertDateTime, getCountdownTime } from "../../utils/time";
import { getProgress } from "../../utils/getProgress";
import Loader from "../Loader";
import CurrencyLogo from "../CurrencyLogo";
import {
    Card,
    FutureCard,
    CardHeader,
    EventEndTime,
    EventProgress,
    EventProgressInner,
    LoadingShim,
    PoolsSymbols,
    RewardAmount,
    RewardSymbol,
    RewardWrapper,
    StakeButton,
    StakeDate,
    StakeInfo,
    Subtitle,
    TokenIcon,
    TokensIcons,
} from "./styled";
import { useMemo } from "react";
import { convertLocalDate } from "../../utils/convertDate";
import { Token } from "@uniswap/sdk-core";
import { SupportedChainId } from "../../constants/chains";
import { WrappedCurrency } from "../../models/types";
import { formatAmount, formatAmountTokens } from "utils/numbers";

interface StakerEventCardProps {
    active?: boolean;
    skeleton?: any;
    now?: number;
    refreshing?: boolean;
    stakeHandler?: () => void;
    event?: {
        pool?: any;
        createdAtTimestamp?: string;
        rewardToken?: any;
        bonusRewardToken?: any;
        reward?: number;
        bonusReward?: number;
        startTime?: number;
        endTime?: number;
        apr?: number;
    };
    eternal?: boolean;
    secret?: boolean;
}

export function StakerEventCard({
    active,
    skeleton,
    refreshing,
    stakeHandler,
    now,
    event: { pool, createdAtTimestamp, rewardToken, bonusRewardToken, reward, bonusReward, startTime, endTime, apr } = {},
    eternal,
    secret,
}: StakerEventCardProps) {
    const { account } = useActiveWeb3React();
    const toggleWalletModal = useWalletModalToggle();

    const _startTime = useMemo(() => {
        if (!startTime) return [];

        const date = new Date(+startTime * 1000);

        return [convertLocalDate(date), convertDateTime(date)];
    }, [startTime]);

    const _endTime = useMemo(() => {
        if (!endTime) return [];

        const date = new Date(+endTime * 1000);

        return [convertLocalDate(date), convertDateTime(date)];
    }, [endTime]);

    if (secret) {
        return (
            <FutureCard>
                <CardHeader style={{ opacity: ".6" }}>
                    <TokensIcons>
                        <CurrencyLogo currency={new Token(SupportedChainId.POLYGON, "0x7ceb23fd6bc0add59e62ac25578270cff1b9f619", 18, "WETH") as WrappedCurrency} size={"35px"} />
                        <CurrencyLogo currency={new Token(SupportedChainId.POLYGON, "0x2791bca1f2de4661ed88a30c99a7a9449aa84174", 18, "USDC") as WrappedCurrency} size={"35px"} />
                    </TokensIcons>
                    <div>
                        <Subtitle>POOL</Subtitle>
                        <PoolsSymbols>{`WETH / USDC`}</PoolsSymbols>
                    </div>
                </CardHeader>
                <RewardWrapper style={{ marginBottom: "6px", opacity: ".6" }}>
                    <CurrencyLogo currency={new Token(SupportedChainId.POLYGON, "0x0169ec1f8f639b32eec6d923e24c2a2ff45b9dd6", 18, "ALGB") as WrappedCurrency} size={"35px"} />
                    <div style={{ marginLeft: "1rem" }}>
                        <Subtitle style={{ color: "rgb(138, 190, 243)" }}>{"Reward"}</Subtitle>
                        <RewardSymbol>{"ALGB"}</RewardSymbol>
                    </div>
                    <RewardAmount title={"1000000"}>
                        <span>{formatAmountTokens(1000000)}</span>
                    </RewardAmount>
                </RewardWrapper>
                <div style={{ position: "relative", opacity: ".6" }}>
                    <div
                        style={{
                            position: "absolute",
                            left: "calc(50% - 11px)",
                            top: "-15px",
                            backgroundColor: "rgb(19, 56, 93)",
                            borderRadius: "50%",
                            padding: "3px",
                        }}
                    >
                        <Plus style={{ display: "block" }} size={18} />
                    </div>
                </div>
                <RewardWrapper style={{ opacity: ".6" }}>
                    <CurrencyLogo currency={new Token(SupportedChainId.POLYGON, "0x0169ec1f8f639b32eec6d923e24c2a2ff45b9dd6", 18, "ALGB") as WrappedCurrency} size={"35px"} />
                    <div style={{ marginLeft: "1rem" }}>
                        <Subtitle style={{ color: "rgb(138, 190, 243)" }}>{"Bonus"}</Subtitle>
                        <RewardSymbol>{"ALGB"}</RewardSymbol>
                    </div>
                    <RewardAmount title={"400000"}>
                        <span>{formatAmountTokens(400000)}</span>
                    </RewardAmount>
                </RewardWrapper>
                <StakeInfo style={{ opacity: ".6" }} active>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                        <Subtitle>Start</Subtitle>
                        <span>{convertLocalDate(new Date(1647543600 * 1000))}</span>
                        <span>{convertDateTime(new Date(1647543600 * 1000))}</span>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                        <Subtitle>End</Subtitle>
                        <span>{convertLocalDate(new Date(1648148400 * 1000))}</span>
                        <span>{convertDateTime(new Date(1648148400 * 1000))}</span>
                    </div>
                </StakeInfo>
                <EventEndTime>
                    <span>{`will be available in ${getCountdownTime(1647356400, Date.now())}`}</span>
                </EventEndTime>
                <EventProgress>
                    <EventProgressInner progress={Math.round((100 * 1647356400) / Date.now())} />
                </EventProgress>
                <span style={{ marginTop: "1rem", fontSize: "14px", lineHeight: "21px", padding: "6px 8px", borderRadius: "6px", textAlign: "center", backgroundColor: "#333aa0" }}>
                    ⚡Upcoming farm
                </span>
            </FutureCard>
        );
    }

    return skeleton ? (
        <Card skeleton>
            <CardHeader>
                <TokensIcons>
                    <TokenIcon skeleton />
                    <TokenIcon skeleton />
                </TokensIcons>
                <div>
                    <Subtitle skeleton />
                    <PoolsSymbols skeleton />
                </div>
            </CardHeader>
            <RewardWrapper skeleton style={{ marginBottom: "6px" }}>
                <TokenIcon skeleton />
                <div style={{ marginLeft: "1rem" }}>
                    <Subtitle skeleton />
                    <RewardSymbol skeleton />
                </div>
                <RewardAmount skeleton />
            </RewardWrapper>
            <div style={{ position: "relative" }}>
                <div
                    style={{
                        position: "absolute",
                        left: "calc(50% - 11px)",
                        top: "-15px",
                        backgroundColor: "#5aa7df",
                        borderRadius: "50%",
                        padding: "3px",
                    }}
                >
                    <Plus style={{ display: "block" }} size={18} />
                </div>
            </div>
            <RewardWrapper skeleton>
                <TokenIcon skeleton />
                <div style={{ marginLeft: "1rem" }}>
                    <Subtitle skeleton />
                    <RewardSymbol skeleton />
                </div>
                <RewardAmount skeleton />
            </RewardWrapper>
            <StakeInfo active>
                <div>
                    <Subtitle skeleton />
                    <StakeDate skeleton />
                    <StakeDate skeleton />
                </div>
                <div>
                    <Subtitle skeleton />
                    <StakeDate skeleton />
                    <StakeDate skeleton />
                </div>
            </StakeInfo>
            {active ? (
                <>
                    <EventEndTime skeleton>
                        <span />
                    </EventEndTime>
                    <EventProgress skeleton />
                </>
            ) : (
                <StakeButton skeleton />
            )}
        </Card>
    ) : (
        <Card refreshing={refreshing}>
            {refreshing && (
                <LoadingShim>
                    <Loader size={"18px"} stroke={"white"} style={{ margin: "auto" }} />
                </LoadingShim>
            )}
            <CardHeader>
                <TokensIcons>
                    <CurrencyLogo currency={new Token(SupportedChainId.POLYGON, pool.token0.id, 18, pool.token0.symbol) as WrappedCurrency} size={"35px"} />
                    <CurrencyLogo currency={new Token(SupportedChainId.POLYGON, pool.token1.id, 18, pool.token1.symbol) as WrappedCurrency} size={"35px"} />
                </TokensIcons>
                <div>
                    <Subtitle>POOL</Subtitle>
                    <PoolsSymbols>{`${pool.token0.symbol} / ${pool.token1.symbol}`}</PoolsSymbols>
                </div>
            </CardHeader>
            <RewardWrapper style={{ marginBottom: "6px" }}>
                <CurrencyLogo currency={new Token(SupportedChainId.POLYGON, rewardToken.id, 18, rewardToken.symbol) as WrappedCurrency} size={"35px"} />
                <div style={{ marginLeft: "1rem" }}>
                    <Subtitle style={{ color: "rgb(138, 190, 243)" }}>{"Reward"}</Subtitle>
                    <RewardSymbol>{rewardToken.symbol}</RewardSymbol>
                </div>
                {reward && <RewardAmount title={reward.toString()}>{eternal ? <span /> : <span>{formatAmountTokens(reward)}</span>}</RewardAmount>}
            </RewardWrapper>
            <div style={{ position: "relative" }}>
                <div
                    style={{
                        position: "absolute",
                        left: "calc(50% - 11px)",
                        top: "-15px",
                        backgroundColor: "rgb(19, 56, 93)",
                        borderRadius: "50%",
                        padding: "3px",
                    }}
                >
                    <Plus style={{ display: "block" }} size={18} />
                </div>
            </div>
            {bonusReward && bonusReward > 0 && (
                <RewardWrapper>
                    <CurrencyLogo currency={new Token(SupportedChainId.POLYGON, bonusRewardToken.id, 18, bonusRewardToken.symbol) as WrappedCurrency} size={"35px"} />
                    <div style={{ marginLeft: "1rem" }}>
                        <Subtitle style={{ color: "rgb(138, 190, 243)" }}>{"Bonus"}</Subtitle>
                        <RewardSymbol>{bonusRewardToken.symbol}</RewardSymbol>
                    </div>
                    {bonusReward && <RewardAmount title={bonusReward.toString()}>{eternal ? <span /> : <span>{formatAmountTokens(bonusReward, 1)}</span>}</RewardAmount>}
                </RewardWrapper>
            )}
            {!eternal && (
                <StakeInfo active>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                        <Subtitle>Start</Subtitle>
                        <span>{startTime && _startTime[0]}</span>
                        <span>{startTime && _startTime[1]}</span>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                        <Subtitle>End</Subtitle>
                        <span>{endTime && _endTime[0]}</span>
                        <span>{endTime && _endTime[1]}</span>
                    </div>
                </StakeInfo>
            )}
            {!eternal && (
                <EventEndTime>
                    {active ? <span>{`ends in ${getCountdownTime(endTime ?? 0, now ?? Date.now())}`}</span> : <span>{`starts in ${getCountdownTime(startTime ?? 0, now ?? Date.now())}`}</span>}
                </EventEndTime>
            )}
            {!eternal && (
                <EventProgress>
                    {active ? (
                        <EventProgressInner progress={Math.round(getProgress(startTime, endTime, now))} />
                    ) : (
                        <EventProgressInner progress={Math.round(getProgress(Number(createdAtTimestamp), startTime, now))} />
                    )}
                </EventProgress>
            )}
            {eternal && (
                <RewardWrapper style={{ justifyContent: "space-between" }}>
                    <Subtitle style={{ fontSize: "14px", color: "white", textTransform: "none", lineHeight: "19px" }}>{"Overall APR:"}</Subtitle>
                    <RewardSymbol>{`${apr?.toFixed(2)}%`}</RewardSymbol>
                </RewardWrapper>
            )}
            {account && !active ? (
                <StakeButton style={{ marginTop: eternal ? "0" : "17px" }} onClick={stakeHandler} skeleton={skeleton}>
                    Farm
                </StakeButton>
            ) : (
                !active && (
                    <StakeButton style={{ marginTop: eternal ? "0" : "17px" }} onClick={toggleWalletModal} skeleton={skeleton}>
                        Connect Wallet
                    </StakeButton>
                )
            )}
        </Card>
    );
}
