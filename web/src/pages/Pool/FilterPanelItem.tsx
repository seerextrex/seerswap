import React from "react";
import { Trans } from "@lingui/macro";

interface FilterPanelProps {
    item: {
        method: (v: boolean) => void;
        checkValue: boolean;
    };
}

const FilterPanelItem = ({ item: { method, checkValue } }: FilterPanelProps) => {
    return (
        <label className="filter-checkbox">
            <input 
                type="checkbox" 
                checked={checkValue} 
                onChange={(e) => method(e.target.checked)}
            />
            <span className="filter-label">
                <Trans>Hide closed positions</Trans>
            </span>
        </label>
    );
};

export default FilterPanelItem;
