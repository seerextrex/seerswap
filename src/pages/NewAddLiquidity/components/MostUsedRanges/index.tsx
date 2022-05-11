import { range } from "lodash";
import { useMemo } from "react";
import "./index.scss";

interface IMostUsedRanges {
    handlePresetRangeSelection: ({ type, min, max }: { type: PresetRanges; min: number; max: number }) => void;
}

enum PresetRanges {
    SAFE,
    RISK,
    POPULAR,
    FULL,
}

export function MostUsedRanges({ handlePresetRangeSelection }: IMostUsedRanges) {
    const popularRange = useMemo(() => {
        return [0, 100];
    }, []);

    const ranges = useMemo(() => {
        return [
            {
                type: PresetRanges.SAFE,
                title: "Safe",
                min: 20,
                max: 50,
            },
            {
                type: PresetRanges.RISK,
                title: "Risk",
                min: 10,
                max: 20,
            },
            {
                type: PresetRanges.POPULAR,
                title: "Trending",
                min: popularRange[0],
                max: popularRange[1],
            },
            {
                type: PresetRanges.FULL,
                title: "Full",
                min: 0,
                max: 100,
            },
        ];
    }, [popularRange]);

    return (
        <div style={{ borderLeft: "1px solid #36f" }} className={"pl-1"}>
            <div className="mb-1">Pre-set ranges</div>
            {ranges.map((range, i) => (
                <button className="mr-05 mb-05" onClick={() => handlePresetRangeSelection(range)} key={i}>
                    {range.title}
                </button>
            ))}
        </div>
    );
}
