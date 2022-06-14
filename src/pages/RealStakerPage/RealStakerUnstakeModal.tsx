import RealStakerRangeButtons from "./RealStakerRangeButtons";
import React, { Dispatch } from "react";
import { StakerSlider } from "./styled";
import Modal from "../../components/Modal";
import RealStakerUnstakeInputRange from "./RealStakerUnstakeInputRange";
import { formatEther } from "ethers/lib/utils";
import { CurrencyAmount, Token } from "@uniswap/sdk-core";
import { BigNumber } from "@ethersproject/bignumber";
import { FactorySubgraph, StakeSubgraph, SubgraphResponseStaking } from "../../models/interfaces";
import "./index.scss";
import { t } from "@lingui/macro";

interface UnstakeModalProps {
    openModal: boolean;
    setOpenModal: any;
    unstaked: string;
    setUnstaked: any;
    baseCurrency: BigNumber;
    unstakePercent: number;
    setUnstakePercent: any;
    onPercentSelect: Dispatch<number>;
    unstakeHandler: any;
    stakedResult: string | null | SubgraphResponseStaking<FactorySubgraph[], StakeSubgraph[]>;
    fiatValue: CurrencyAmount<Token> | null;
    allXALGBFreeze: BigNumber | undefined;
}

export default function RealStakerUnstakeModal({
    openModal,
    setOpenModal,
    unstaked,
    setUnstaked,
    baseCurrency,
    unstakePercent,
    setUnstakePercent,
    onPercentSelect,
    unstakeHandler,
    stakedResult,
    fiatValue,
    allXALGBFreeze,
}: UnstakeModalProps) {
    const enerHandler = (e: any) => {
        if (e.charCode === 13 && +unstaked !== 0) {
            unstakeHandler(unstaked, stakedResult, baseCurrency, allXALGBFreeze);
            setUnstaked("");
            setUnstakePercent(0);
            setOpenModal(false);
        }
    };
    return (
        <Modal
            isOpen={openModal}
            onDismiss={() => {
                setOpenModal(false);
                setUnstaked("");
                setUnstakePercent(0);
            }}
            maxHeight={300}
        >
            <div
                className={"unstake-wrapper mh-1 mb-1"}
                onKeyPress={(e) => {
                    enerHandler(e);
                }}
            >
                <RealStakerUnstakeInputRange amountValue={unstaked} setAmountValue={setUnstaked} baseCurrency={formatEther(baseCurrency)} fiatValue={fiatValue} />
                <div className={"w-100"}>
                    <StakerSlider value={unstakePercent} onChange={setUnstakePercent} size={22} disabled={false} />
                </div>
                <RealStakerRangeButtons onPercentSelect={onPercentSelect} balance={formatEther(baseCurrency)} />
                <button
                    className={"btn primary w-100 pa-1 mt-1"}
                    onClick={() => {
                        unstakeHandler(unstaked, stakedResult, baseCurrency, allXALGBFreeze);
                        setUnstaked("");
                        setUnstakePercent(0);
                        setOpenModal(false);
                    }}
                    disabled={+unstaked > +formatEther(baseCurrency) || unstaked === ""}
                >
                    {+unstaked > +formatEther(baseCurrency) ? t`Insufficient ALGB balance` : t`Unstake`}
                </button>
            </div>
        </Modal>
    );
}
