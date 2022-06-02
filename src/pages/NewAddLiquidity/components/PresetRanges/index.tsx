import { Trans } from "@lingui/macro";
import { range } from "lodash";
import { useEffect, useMemo, useState } from "react";
import { Layers } from "react-feather";
import { useAppDispatch } from "state/hooks";
import { useActivePreset } from "state/mint/v3/hooks";
import { Presets } from "state/mint/v3/reducer";
import "./index.scss";

export interface IPresetArgs {
    type: Presets;
    min: number;
    max: number;
}

interface IPresetRanges {
    isStablecoinPair: boolean;
    activePreset: Presets | null;
    handlePresetRangeSelection: (preset: IPresetArgs | null) => void;
}

enum PresetProfits {
    VERY_LOW,
    LOW,
    MEDIUM,
    HIGH,
}

export function PresetRanges({ isStablecoinPair, activePreset, handlePresetRangeSelection }: IPresetRanges) {
    const ranges = useMemo(() => {
        if (isStablecoinPair)
            return [
                {
                    type: Presets.STABLE,
                    title: "Stablecoins",
                    min: 0.984,
                    max: 1.01,
                    risk: PresetProfits.VERY_LOW,
                    profit: PresetProfits.HIGH,
                },
            ];

        return [
            {
                type: Presets.FULL,
                title: "Full range",
                min: 0,
                max: Infinity,
                risk: PresetProfits.VERY_LOW,
                profit: PresetProfits.VERY_LOW,
            },
            {
                type: Presets.SAFE,
                title: "Safe",
                min: 0.8,
                max: 1.4,
                risk: PresetProfits.LOW,
                profit: PresetProfits.LOW,
            },
            {
                type: Presets.NORMAL,
                title: "Common",
                min: 0.9,
                max: 1.2,
                risk: PresetProfits.MEDIUM,
                profit: PresetProfits.MEDIUM,
            },
            {
                type: Presets.RISK,
                title: "Expert",
                min: 0.95,
                max: 1.1,
                risk: PresetProfits.HIGH,
                profit: PresetProfits.HIGH,
            },
        ];
    }, [isStablecoinPair]);

    return (
        <div className={"preset-ranges-wrapper pl-1 mxs_pl-0 mxs_mb-2 ms_pl-0 ms_mb-2"}>
            <div className="mb-1 f f-ac">
                <Layers style={{ display: "block", transform: "rotate(90deg)" }} size={15} />
                <span className="ml-05">
                    <Trans>Preset ranges</Trans>
                </span>
            </div>
            {ranges.map((range, i) => (
                <div className="i-f" key={i}>
                    <button
                        className={`preset-ranges__button ${activePreset === range.type ? "active" : ""} mr-05`}
                        onClick={() => {
                            handlePresetRangeSelection(range);
                            if (activePreset == range.type) {
                                handlePresetRangeSelection(null);
                            } else {
                                handlePresetRangeSelection(range);
                            }
                        }}
                        key={i}
                    >
                        <div>{range.title}</div>
                    </button>
                    {(() => {
                        if (activePreset === range.type) {
                            const color = [PresetProfits.VERY_LOW, PresetProfits.LOW].includes(range.risk) ? "low" : range.risk === PresetProfits.MEDIUM ? "medium" : "high";

                            return (
                                <div className="preset-ranges__description">
                                    <div className="f mb-05">
                                        <span>Risk:</span>
                                        <div className="f f-ac f-jc ml-a">
                                            {[0, 1, 2, 3, 4].map((_, i) => (
                                                <span key={i} className="preset-ranges__circle" style={{ background: i <= range.risk ? "#25a0ff" : "#42637b" }}></span>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="f">
                                        <span>Profit:</span>
                                        <div className="f f-ac f-jc ml-a">
                                            {[0, 1, 2, 3, 4].map((_, i) => (
                                                <span
                                                    key={i}
                                                    className="preset-ranges__circle"
                                                    style={{ width: "10px", height: "10px", marginLeft: "5px", borderRadius: "50%", background: i <= range.profit ? "#25a0ff" : "#42637b" }}
                                                ></span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            );
                        }
                        return;
                    })()}
                </div>
            ))}
        </div>
    );
}
