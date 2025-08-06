import React from "react";
import { Trans } from "@lingui/macro";

interface LowValueFilterProps {
    isActive: boolean;
    onToggle: (active: boolean) => void;
}

const LowValueFilter = ({ isActive, onToggle }: LowValueFilterProps) => {
    return (
        <label className="filter-checkbox">
            <input 
                type="checkbox" 
                checked={isActive} 
                onChange={(e) => onToggle(e.target.checked)}
            />
            <span className="filter-label">
                <Trans>Hide positions &lt; $1</Trans>
            </span>
        </label>
    );
};

export default LowValueFilter;