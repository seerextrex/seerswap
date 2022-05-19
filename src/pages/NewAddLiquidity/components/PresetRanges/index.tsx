import { Trans } from "@lingui/macro";
import { range } from "lodash";
import { useMemo } from "react";
import { Layers } from "react-feather";
import "./index.scss";

interface IPresetRanges {
    handlePresetRangeSelection: ({ type, min, max }: { type: Presets; min: number; max: number }) => void;
}

enum Presets {
    SAFE,
    RISK,
    POPULAR,
    FULL,
}

export function PresetRanges({ handlePresetRangeSelection }: IPresetRanges) {
    const popularRange = useMemo(() => {
        return [0, 100];
    }, []);

    const ranges = useMemo(() => {
        return [
            {
                type: Presets.SAFE,
                title: "Safe",
                min: 20,
                max: 50,
            },
            {
                type: Presets.RISK,
                title: "Risk",
                min: 10,
                max: 20,
            },
            {
                type: Presets.POPULAR,
                title: "Trending",
                min: popularRange[0],
                max: popularRange[1],
            },
            {
                type: Presets.FULL,
                title: "Full range",
                min: 0,
                max: 100,
            },
        ];
    }, [popularRange]);

    return (
        <div className={"preset-ranges-wrapper pl-1"}>
            <div className="mb-1 f f-ac">
                <Layers style={{ display: "block", transform: "rotate(90deg)" }} size={15} />
                <span className="ml-05">
                    <Trans>Preset ranges</Trans>
                </span>
            </div>
            {ranges.map((range, i) => (
                <button className={`preset-ranges__button ${i === 0 ? "active" : ""} mr-05`} onClick={() => handlePresetRangeSelection(range)} key={i}>
                    {range.title}
                </button>
            ))}
        </div>
    );
}
