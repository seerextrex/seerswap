import { Helmet } from "react-helmet";
import { useCurrency } from "../../hooks/Tokens";
import useDebouncedChangeHandler from "../../hooks/useDebouncedChangeHandler";
import { useBurnV3ActionHandlers, useBurnV3State } from "../../state/burn/v3/hooks";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import RealStakerInputRange from "./RealStakerInputRange";
import RealStakerRangeButtons from "./RealStakerRangeButtons";
import RealStakerResBlocks from "./RealStakerResBlocks";
import { NavLink } from "react-router-dom";
import { useCurrencyBalance } from "../../state/wallet/hooks";
import { useActiveWeb3React } from "../../hooks/web3";
import { useRealStakerHandlers } from "../../hooks/useRealStaker";
import { ApprovalState, useApproveCallback } from "../../hooks/useApproveCallback";
import { REAL_STAKER_ADDRESS } from "../../constants/addresses";
import Loader from "../../components/Loader";
import { useInfoSubgraph } from "../../hooks/subgraph/useInfoSubgraph";
import { BigNumber } from "ethers";
import { formatEther, formatUnits, parseUnits } from "ethers/lib/utils";
import RealStakerUnstakeModal from "./RealStakerUnstakeModal";
import { useUSDCValue } from "../../hooks/useUSDCPrice";
import { Currency, CurrencyAmount } from "@uniswap/sdk-core";
import { tryParseAmount } from "../../state/swap/hooks";
import { useWalletModalToggle } from "../../state/application/hooks";
import { ArrowDown, ArrowUp, Percent, RefreshCw, X } from "react-feather";
import FrozenModal from "./Frozen";
import { FrozenDropDown, LeftBlock, ReloadButton, RightBlock } from "./styled";
import "./index.scss";
import Slider from "../../components/Slider";
import "algebra-packeges";
import Modal from "components/Modal";
import { t, Trans } from "@lingui/macro";
import { useSortedRecentTransactions } from "../../hooks/useSortedRecentTransactions";
import { useAllTransactions } from "../../state/transactions/hooks";
import { UnstakingInterface } from "../../models/interfaces";

export enum Action {
    CLAIM,
    UNSTAKE,
}

export default function RealStakerPage({}) {
    const currencyId = "0x0169eC1f8f639B32Eec6D923e24C2A2ff45B9DD6";
    const { chainId, account } = useActiveWeb3React();
    const { percent } = useBurnV3State();
    const { onPercentSelect } = useBurnV3ActionHandlers();
    const {
        stakerHandler,
        stakerClaimHandler,
        stakerUnstakeHandler,
        frozenStakedHandler,
        frozenStaked,
        claimLoading,
        unstakeLoading,
        stakeLoading,
        stakeHash,
        setStakedHash,
        claimgHash,
        setClaimHash,
        unstakeHash,
        setUnstakeHash,
    } = useRealStakerHandlers();
    const {
        getStakes: { stakesResult, fetchStakingFn },
    } = useInfoSubgraph();
    const toggleWalletModal = useWalletModalToggle();
    const baseCurrency = useCurrency(currencyId);
    const [calcModal, toggleCalcModal] = useState(false);

    //transactions
    const allTransactions = useAllTransactions();
    const sortedRecentTransactions = useSortedRecentTransactions();
    const confirmed = useMemo(() => sortedRecentTransactions.filter((tx) => tx.receipt).map((tx) => tx.hash), [sortedRecentTransactions, allTransactions]);

    //balances
    const balance = useCurrencyBalance(account ?? undefined, baseCurrency ?? undefined);
    const _balance = useMemo(() => (!balance ? "" : balance.toSignificant(4)), [balance]);
    const numBalance = useMemo(() => (!balance ? 0 : balance), [balance]);

    const [percentForSlider, onPercentSelectForSlider] = useDebouncedChangeHandler(percent, onPercentSelect);
    const [unstakePercent, setUnstakePercent] = useState<number>(0);
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [amountValue, setAmountValue] = useState<string>("");
    const [earned, setEarned] = useState<BigNumber>(BigNumber.from("0"));
    const [staked, setStaked] = useState<BigNumber>(BigNumber.from("0"));
    const [unstaked, setUnstaked] = useState<string>("");
    const [unstakeAmount, setUnstakeAmount] = useState<BigNumber>(BigNumber.from("0"));
    const [algbCourse, setAlbgCourse] = useState<BigNumber>(BigNumber.from("0"));
    const [algbCourseShow, setAlbgCourseShow] = useState<number>(1);
    const [xALGBBalance, setXALGB] = useState<string>("");
    const [showFrozen, setFrozen] = useState<boolean>(false);
    const [loadingClaim, setLoadingClaim] = useState<boolean>(false);
    const [staking, setStaking] = useState<UnstakingInterface>({ id: null, state: null });
    const [claiming, setClaiming] = useState<UnstakingInterface>({ id: null, state: null });
    const [unstaking, setUnstaking] = useState<UnstakingInterface>({ id: null, state: null });

    const now = Date.now;

    const [approval, approveCallback] = useApproveCallback(balance, chainId ? REAL_STAKER_ADDRESS[chainId] : undefined);
    const valueAmount: CurrencyAmount<Currency> | undefined = tryParseAmount(amountValue.toString(), baseCurrency ?? undefined);
    const earnedAmount: CurrencyAmount<Currency> | undefined = tryParseAmount(formatEther(earned), baseCurrency ?? undefined);
    const stakedAmount: CurrencyAmount<Currency> | undefined = tryParseAmount(formatEther(staked), baseCurrency ?? undefined);
    const unstakedAmount: CurrencyAmount<Currency> | undefined = tryParseAmount(unstaked.toString(), baseCurrency ?? undefined);

    const fiatValue = useUSDCValue(valueAmount);
    const fiatValueEarned = useUSDCValue(earnedAmount);
    const fiatValueStaked = useUSDCValue(stakedAmount);
    const fiatUnstakedAmount = useUSDCValue(unstakedAmount);

    const allFreeze = useMemo(() => {
        if (typeof stakesResult === "string") return;

        if (!Array.isArray(frozenStaked) || !stakesResult?.factories) return;

        const formatedData = frozenStaked.map((el) =>
            BigNumber.from(el?.xALGBAmount).mul(BigNumber.from(stakesResult.factories[0]?.ALGBbalance)).div(BigNumber.from(stakesResult.factories[0]?.xALGBtotalSupply))
        );

        return formatedData.reduce((prev, cur) => prev?.add(cur), BigNumber.from("0"));
    }, [frozenStaked, account, stakesResult]);

    const allFreezeArr = useMemo(() => {
        if (typeof stakesResult === "string") return;

        if (!Array.isArray(frozenStaked) || !stakesResult?.factories) return;

        return frozenStaked?.map((el) =>
            BigNumber.from(el?.xALGBAmount).mul(BigNumber.from(stakesResult?.factories[0]?.ALGBbalance)).div(BigNumber.from(stakesResult?.factories[0]?.xALGBtotalSupply))
        );
    }, [frozenStaked, account, stakesResult]);

    const allXALGBFreeze = useMemo(() => {
        if (typeof stakesResult === "string") return;

        if (!Array.isArray(frozenStaked) || !stakesResult?.factories) return;

        const formatedData = frozenStaked?.map((el) => BigNumber.from(el?.xALGBAmount));

        return formatedData.reduce((prev, cur) => prev.add(cur), BigNumber.from("0"));
    }, [frozenStaked, account, stakesResult]);

    const stakedFreeze = useMemo(() => {
        if (!Array.isArray(frozenStaked)) return;

        const formatedData = frozenStaked?.map((el) => BigNumber.from(el?.stakedALGBAmount));

        return formatedData.reduce((prev, cur) => prev.add(cur), BigNumber.from("0"));
    }, [frozenStaked, account]);

    const stakedFreezeArr = useMemo(() => {
        if (!Array.isArray(frozenStaked)) return;

        return frozenStaked?.map((el) => BigNumber.from(el?.stakedALGBAmount));
    }, [frozenStaked, account]);

    const earnedFreezeArr = useMemo(() => {
        if (!allFreezeArr || !stakedFreezeArr) return;

        const res = [BigNumber.from("0")];

        for (let i = 0; i < allFreezeArr.length; i++) {
            res.push(allFreezeArr[i].sub(stakedFreezeArr[i]));
        }
        return res;
    }, [allFreezeArr, stakedFreezeArr]);

    const earnedFreeze = useMemo(() => {
        if (!allFreeze || !stakedFreeze) return;

        return allFreeze.sub(stakedFreeze);
    }, [allFreeze, stakedFreeze]);

    //stake handler invoked from keyboard
    const enterHandler = useCallback(
        (e) => {
            if (e.charCode === 13) {
                if (!balance) return;
                if (!(+amountValue > +balance?.toSignificant(4))) {
                    stakerHandler(amountValue);
                    onPercentSelectForSlider(0);
                    if (percentForSlider === 0) {
                        setAmountValue("");
                    }
                }
            }
        },
        [amountValue]
    );

    const reloadClaim = useCallback(() => {
        if (!account) return;
        setLoadingClaim(true);
        fetchStakingFn(account.toLowerCase())
            .then(() => {
                frozenStakedHandler(account);
            })
            .then(() => {
                setLoadingClaim(false);
            });
    }, [account]);

    useEffect(() => {
        fetchStakingFn(account ?? undefined);

        if (!account) return;

        frozenStakedHandler(account.toLowerCase());

        if (+_balance === 0) {
            onPercentSelectForSlider(0);
        }
    }, [account, _balance]);

    //calc amount when choose range in slider
    useEffect(() => {
        if (!numBalance) return;

        if (percentForSlider === 0) {
            setAmountValue("");
        } else if (percentForSlider === 100) {
            setAmountValue(numBalance?.toSignificant(30));
        } else {
            setAmountValue(formatEther(parseUnits(numBalance?.toSignificant(4), 18).div(BigNumber.from("100")).mul(percentForSlider)));
        }
    }, [percentForSlider]);

    //calc unstakeAmount when choose range in slider
    useEffect(() => {
        if (unstakePercent === 0) {
            setUnstaked("");
        } else if (unstakePercent === 100) {
            setUnstaked(formatUnits(BigNumber.from(unstakeAmount), 18));
        } else {
            setUnstaked(formatUnits(BigNumber.from(unstakeAmount).div(100).mul(unstakePercent), 18));
        }
    }, [unstakePercent]);

    //calc staked, earned, algbCourse
    useEffect(() => {
        if (!stakesResult || typeof stakesResult === "string" || !earnedFreeze || !stakedFreeze) return;

        if (+stakesResult.factories[0].xALGBtotalSupply !== 0) {
            setEarned(
                BigNumber.from(stakesResult.stakes[0]?.xALGBAmount || "0")
                    .mul(BigNumber.from(stakesResult.factories[0].ALGBbalance))
                    .div(BigNumber.from(stakesResult.factories[0].xALGBtotalSupply))
                    .sub(BigNumber.from(stakesResult.stakes[0]?.stakedALGBAmount || "0"))
                    .sub(earnedFreeze)
            );
        }

        if (+stakesResult?.factories[0].xALGBtotalSupply !== 0) {
            setAlbgCourseShow(+stakesResult.factories[0].ALGBbalance / +stakesResult.factories[0].xALGBtotalSupply);
            setAlbgCourse(BigNumber.from(stakesResult.factories[0].ALGBbalance).div(BigNumber.from(stakesResult.factories[0].xALGBtotalSupply)));
        }

        if (!stakesResult?.stakes[0]) {
            return setStaked(BigNumber.from("0"));
        }
        const xALGBSplit = formatUnits(BigNumber.from(stakesResult?.stakes[0].xALGBAmount), 18).split(".");
        setXALGB(`${xALGBSplit[0]}.${xALGBSplit[1].slice(0, 3)}`);
        setStaked(BigNumber.from(stakesResult?.stakes[0]?.stakedALGBAmount).sub(stakedFreeze));
    }, [stakesResult, stakedFreeze, earnedFreeze]);

    //calc unstake amount
    useEffect(() => {
        setUnstakeAmount(staked.add(earned));
    }, [staked, earned]);

    useEffect(() => {
        if (staking.state === "done") {
            setStaking({ id: null, state: null });
            setStakedHash({ hash: null });
            return;
        }

        if (typeof stakeHash === "string") {
            setStaking({ id: null, state: null });
        } else if (confirmed.includes(String(stakeHash.hash))) {
            setStaking({ id: stakeHash.hash, state: "done" });
        }
    }, [confirmed, stakeHash]);

    useEffect(() => {
        if (claiming.state === "done") {
            setClaiming({ id: null, state: null });
            setClaimHash({ hash: null });
            return;
        }

        if (typeof claimgHash === "string") {
            setClaiming({ id: null, state: null });
        } else if (confirmed.includes(String(claimgHash.hash))) {
            setClaiming({ id: claimgHash.hash, state: "done" });
        }
    }, [confirmed, claimgHash]);

    useEffect(() => {
        if (unstaking.state === "done") {
            setUnstaking({ id: null, state: null });
            setUnstakeHash({ hash: null });
            return;
        }

        if (typeof unstakeHash === "string") {
            setUnstaking({ id: null, state: null });
        } else if (confirmed.includes(String(unstakeHash.hash))) {
            setUnstaking({ id: unstakeHash.hash, state: "done" });
        }
    }, [confirmed, unstakeHash]);

    return (
        <div className={"real-staker-page maw-765 mh-a"}>
            <Modal fitContent={true} dangerouslyBypassFocusLock={true} isOpen={calcModal} onHide={() => toggleCalcModal(false)} onDismiss={() => {}}>
                <div>
                    <div className="mb-1 f f-jb f-ac">
                        <Trans>Calculate Profit</Trans>
                        <div onClick={() => toggleCalcModal(false)} className={"cur-p hover-op trans-op"}>
                            <X />
                        </div>
                    </div>
                    <div>
                        {/* @ts-ignore */}
                        <calculator-algb balance={balance && balance.toSignificant(30)}></calculator-algb>
                    </div>
                </div>
            </Modal>
            <Helmet>
                <title>{t`Algebra — Staking`}</title>
            </Helmet>
            <div className={"stake-wrapper p-2 br-24 mxs_p-1"} onKeyPress={(e) => enterHandler(e)}>
                <div className="f f-ac f-jb">
                    <h1 className={"stake-wrapper__title"}>
                        <Trans>Stake ALGB</Trans>
                    </h1>
                    <button className="stake__calculate-button f btn primary" onClick={() => toggleCalcModal(true)}>
                        <Percent size={"18px"} strokeWidth={"2.5px"} />
                        <span className="ml-05">
                            <Trans>Calculate profit</Trans>
                        </span>
                    </button>
                </div>
                <RealStakerInputRange amountValue={amountValue} setAmountValue={setAmountValue} baseCurrency={baseCurrency} fiatValue={fiatValue} />
                {numBalance == 0 && balance ? (
                    <NavLink to={""} style={{ textDecoration: "none" }}>
                        <button>
                            <Trans>BUY ALGB</Trans>
                        </button>
                    </NavLink>
                ) : (
                    <>
                        <div className={"slider-wrapper"}>
                            <Slider value={percentForSlider} onChange={onPercentSelectForSlider} size={22} disabled={+_balance === 0} />
                        </div>
                        <RealStakerRangeButtons onPercentSelect={onPercentSelect} balance={_balance} />
                        {approval === ApprovalState.NOT_APPROVED ? (
                            <button className={"btn primary w-100 pa-1 mt-1"} onClick={approveCallback}>
                                <Trans>Approve token</Trans>
                            </button>
                        ) : approval === ApprovalState.UNKNOWN && account === null ? (
                            <button className={"btn primary w-100 pa-1 mt-1"} onClick={toggleWalletModal}>
                                <Trans>Connect Wallet</Trans>
                            </button>
                        ) : approval === ApprovalState.UNKNOWN ? (
                            <button className={"btn primary w-100 pa-1 mt-1 f f-jc"}>
                                <Loader stroke={"white"} size={"1rem"} />
                            </button>
                        ) : approval === ApprovalState.APPROVED ? (
                            <button
                                className={"btn primary w-100 pa-1 mt-1"}
                                onClick={() => {
                                    stakerHandler(amountValue).then(() => {
                                        onPercentSelectForSlider(0);
                                        if (percentForSlider === 0) {
                                            setAmountValue("");
                                        }
                                    });
                                }}
                                disabled={(balance && +amountValue > +balance.toSignificant(30)) || amountValue === "" || (stakeLoading && staking && staking.state !== "done")}
                            >
                                {stakeLoading && staking && staking.state !== "done" ? (
                                    <div className={"f f-jc f-ac"}>
                                        <Loader stroke={"var(--white)"} size={"1rem"} />{" "}
                                        <span className={"ml-05"}>
                                            <Trans>Staking</Trans>
                                        </span>
                                    </div>
                                ) : balance && +amountValue > +balance.toSignificant(30) ? (
                                    t`Insufficient ALGB balance`
                                ) : (
                                    t`Stake`
                                )}
                            </button>
                        ) : (
                            <button className={"btn primary w-100 pa-1 mt-1"}>
                                <Loader stroke={"white"} size={"1rem"} />
                            </button>
                        )}
                    </>
                )}
            </div>
            <div className={"earned-wrapper p-2 mv-2 br-24 ms_p-1"}>
                <h2 className={"earned-wrapper__title mb-1 "}>
                    <LeftBlock>
                        <h3 className={"fs-125"}>
                            <Trans>Balance</Trans>
                        </h3>
                    </LeftBlock>
                    <RightBlock>
                        {frozenStaked?.length !== 0 && (
                            <FrozenDropDown
                                onClick={() => {
                                    setFrozen(!showFrozen);
                                }}
                            >
                                {!allFreeze ? (
                                    <Loader size={"1rem"} stroke={"white"} />
                                ) : (
                                    `${+(+formatEther(allFreeze || BigNumber.from("0"))).toFixed(2) < 0.01 ? "<" : ""} ${(+formatEther(allFreeze)).toFixed(2)}`
                                )}{" "}
                                <Trans>ALGB Frozen {showFrozen ? <ArrowUp size={"1rem"} /> : <ArrowDown size={"1rem"} />}</Trans>
                            </FrozenDropDown>
                        )}
                        <ReloadButton disabled={loadingClaim} onClick={reloadClaim} refreshing={loadingClaim}>
                            <RefreshCw style={{ display: "block" }} size={18} stroke={"white"} />
                        </ReloadButton>
                    </RightBlock>
                    {showFrozen && frozenStaked.length !== 0 && typeof frozenStaked !== "string" && frozenStaked.some((el) => +Math.floor(+el.timestamp * 1000) > now()) ? (
                        <FrozenModal data={frozenStaked} earnedFreeze={earnedFreezeArr} now={now} />
                    ) : null}
                </h2>
                <div className={"flex-s-between rg-1 mxs_fd-c"}>
                    <RealStakerResBlocks
                        action={Action.CLAIM}
                        currency={fiatValueEarned}
                        amount={earned}
                        title={t`EARNED`}
                        handler={() => {
                            stakerClaimHandler(earned, stakesResult);
                        }}
                        algbCourse={algbCourse}
                        loading={claimLoading && claiming && claiming.state !== "done"}
                    />
                    <RealStakerResBlocks
                        action={Action.UNSTAKE}
                        currency={fiatValueStaked}
                        amount={staked}
                        title={t`STAKED`}
                        handler={() => {
                            setOpenModal(true);
                        }}
                        algbCourse={algbCourse}
                        loading={unstakeLoading && claiming && claiming.state !== "done"}
                    />
                </div>
                <div className={"xalgb-wrapper flex-s-between br-8 mt-1"}>
                    <span className={"pv-05 ph-1"}>{!account ? "" : t`You have ${xALGBBalance} xALGB`}</span>
                    <span className={"pv-05 ph-1"}>1 xALGB = {algbCourseShow.toFixed(2)} ALGB</span>
                </div>
            </div>
            <NavLink className={"statistic-wrapper w-100"} to={"staking/analytics"}>
                <div>
                    <h2 className={"ml-05"}>
                        <Trans>Statistics</Trans>
                    </h2>
                    <p className={"mt-05 ml-05"}>
                        <Trans>Minted / Staked Amount / Total Supply →</Trans>
                    </p>
                </div>
            </NavLink>
            <RealStakerUnstakeModal
                openModal={openModal}
                setOpenModal={setOpenModal}
                unstakePercent={unstakePercent}
                setUnstakePercent={setUnstakePercent}
                setUnstaked={setUnstaked}
                unstaked={unstaked}
                baseCurrency={unstakeAmount}
                onPercentSelect={setUnstakePercent}
                stakedResult={stakesResult}
                unstakeHandler={stakerUnstakeHandler}
                fiatValue={fiatUnstakedAmount}
                allXALGBFreeze={allXALGBFreeze}
            />
        </div>
    );
}
