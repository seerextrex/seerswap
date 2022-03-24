import CurrencyLogo from "components/CurrencyLogo";
import { FARMING_CENTER } from "constants/addresses";
import { SupportedChainId } from "constants/chains";
import { ALGEBRA_POLYGON } from "constants/tokens";
import { ApprovalState, useApproveCallback } from "hooks/useApproveCallback";
import { useActiveWeb3React } from "hooks/web3";
import { WrappedCurrency } from "models/types";
import { CurrencyDropdown } from "pages/AddLiquidity/styled";
import { useCallback, useMemo, useState } from "react";
import { useCurrencyBalance } from "state/wallet/hooks";
import "./index.scss";

import { CurrencyAmount } from "@uniswap/sdk-core";

export default function StakeModalFarmingTiers({ tiersLimits, tiersMultipliers, selectTier }: { tiersLimits: any; tiersMultipliers: any; selectTier: any }) {
    const { account } = useActiveWeb3React();

    const [selectedTier, setSelectedTier] = useState(0);

    const balance = useCurrencyBalance(account ?? undefined, ALGEBRA_POLYGON ?? undefined);
    const _balance = useMemo(() => (!balance ? "" : balance.toSignificant(4)), [balance]);

    const _amountForApprove = useMemo(() => {
        switch (selectedTier) {
            case 1:
                return CurrencyAmount.fromRawAmount(ALGEBRA_POLYGON, tiersLimits.low);
            case 2:
                return CurrencyAmount.fromRawAmount(ALGEBRA_POLYGON, tiersLimits.medium);
            case 3:
                return CurrencyAmount.fromRawAmount(ALGEBRA_POLYGON, tiersLimits.high);
            default:
                return undefined;
        }
    }, [selectedTier]);

    const [approval, approveCallback] = useApproveCallback(_amountForApprove, FARMING_CENTER[SupportedChainId.POLYGON]);

    const showApproval = approval !== ApprovalState.APPROVED && !!_amountForApprove;

    const handleTier = useCallback(
        (tier) => {
            setSelectedTier(tier);

            if (approval === ApprovalState.NOT_APPROVED) return;

            selectTier(tier);
        },
        [approval]
    );

    return (
        <div className="p-1 mb-2 f c" style={{ borderRadius: "8px", border: "1px solid red" }}>
            <div className="f w-100">
                <button className="p-1 f c mr-1 w-100 farming-tier" data-selected={selectedTier === 1} onClick={() => handleTier(1)} style={{ borderRadius: "6px", border: "1px solid blue" }}>
                    <div className="mb-05">Tier 1</div>
                    <div className="f f-jb w-100">
                        <span>From {tiersLimits.low / 1000000000000000000} ALGB</span>
                        <span>+ {tiersMultipliers.low / 100}%</span>
                    </div>
                </button>
                <button className="p-1 f c mr-1 w-100 farming-tier" data-selected={selectedTier === 2} onClick={() => handleTier(2)} style={{ borderRadius: "6px", border: "1px solid blue" }}>
                    <div className="mb-05">Tier 2</div>
                    <div className="f f-jb w-100">
                        <span>From {tiersLimits.medium / 1000000000000000000} ALGB</span>
                        <span>+ {tiersMultipliers.medium / 100}%</span>
                    </div>
                </button>
                <button className="p-1 f c w-100 farming-tier" data-selected={selectedTier === 3} onClick={() => handleTier(3)} style={{ borderRadius: "6px", border: "1px solid blue" }}>
                    <div className="mb-05">Tier 3</div>
                    <div className="f f-jb w-100">
                        <span>From {tiersLimits.high / 1000000000000000000} ALGB</span>
                        <span>+ {tiersMultipliers.high / 100}%</span>
                    </div>
                </button>
            </div>
            <div className="mt-1 f-ac f">
                <div>
                    <div className="mb-05 b">You have</div>
                    <div className="f">
                        <CurrencyLogo currency={ALGEBRA_POLYGON as WrappedCurrency} />
                        <div className="ml-05" style={{ lineHeight: "24px" }}>
                            {_balance} ALGB
                        </div>
                    </div>
                </div>
                <div className="ml-a">
                    {showApproval && (
                        <button onClick={approveCallback} className="btn primary p-05">
                            Approve ALGB
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
