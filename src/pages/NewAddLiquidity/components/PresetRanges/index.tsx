import { Trans } from "@lingui/macro";
import { range } from "lodash";
import { useMemo, useState } from "react";
import { Layers } from "react-feather";
import "./index.scss";

interface IPresetRanges {
    isStablecoinPair: boolean;
    handlePresetRangeSelection: ({ type, min, max }: { type: Presets; min: number; max: number }) => void;
}

enum Presets {
    SAFE,
    RISK,
    NORMAL,
    FULL,
    STABLE,
}

enum PresetProfits {
    VERY_LOW = "Very low",
    LOW = "Low",
    MEDIUM = "Medium",
    HIGH = "High",
}

export function PresetRanges({ isStablecoinPair, handlePresetRangeSelection }: IPresetRanges) {
    const [selectedPreset, selectPreset] = useState<Presets | null>(null);

    const popularRange = useMemo(() => {
        return [0, 100];
    }, []);

    const ranges = useMemo(() => {
        if (isStablecoinPair)
            return [
                {
                    type: Presets.STABLE,
                    title: "Stablecoins",
                    min: 0,
                    max: 100,
                    risk: PresetProfits.VERY_LOW,
                    profit: PresetProfits.VERY_LOW,
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
                title: "Normal",
                min: 0.9,
                max: 1.2,
                risk: PresetProfits.MEDIUM,
                profit: PresetProfits.MEDIUM,
            },
            {
                type: Presets.RISK,
                title: "Risky",
                min: 0.95,
                max: 1.1,
                risk: PresetProfits.HIGH,
                profit: PresetProfits.HIGH,
            },
        ];
    }, [popularRange, isStablecoinPair]);

    return (
        <div className={"preset-ranges-wrapper pl-1"}>
            <div className="mb-1 f f-ac">
                <Layers style={{ display: "block", transform: "rotate(90deg)" }} size={15} />
                <span className="ml-05">
                    <Trans>Preset ranges</Trans>
                </span>
            </div>
            {ranges.map((range, i) => (
                <div className="i-f" key={i}>
                    <button
                        className={`preset-ranges__button ${selectedPreset === range.type ? "active" : ""} mr-05`}
                        onClick={() => {
                            handlePresetRangeSelection(range);
                            if (selectedPreset == range.type) {
                                selectPreset(null);
                            } else {
                                selectPreset(range.type);
                            }
                        }}
                        key={i}
                    >
                        <div>{range.title}</div>
                    </button>
                    {(() => {
                        if (selectedPreset === range.type) {
                            const color = [PresetProfits.VERY_LOW, PresetProfits.LOW].includes(range.risk) ? "low" : range.risk === PresetProfits.MEDIUM ? "medium" : "high";

                            return (
                                <div className="preset-ranges__description">
                                    <div className="f mb-05">
                                        <span>Risk:</span>
                                        <span className={`preset-ranges__description-risk ml-a ${color}`}>{range.risk}</span>
                                    </div>
                                    <div className="f">
                                        <span>Profit:</span>
                                        <span className={`preset-ranges__description-profit ml-a ${color}`}>{range.profit}</span>
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
