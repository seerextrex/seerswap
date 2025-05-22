import React from "react";
import { Trans } from "@lingui/macro";
import Toggle from "../../components/Toggle";

interface FilterPanelProps {
    method: (v: boolean) => void;
    checkValue: boolean;
}

const FilterPanelItem = ({ method, checkValue }: FilterPanelProps) => {
    return (
        <div>
            <Toggle isActive={checkValue} toggle={() => method(!checkValue)} checked={<Trans>All positions</Trans>} unchecked={<Trans>Active positions</Trans>} />
        </div>
    );
};

export default FilterPanelItem;
