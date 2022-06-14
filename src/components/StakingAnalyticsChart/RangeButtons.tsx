import React from "react";
import "./index.scss";

import { t } from "@lingui/macro";

const buttonsData = [{ title: t`Day` }, { title: t`Week` }, { title: t`Month` }, { title: t`All` }];

const RangeButtons = ({ setSpan, span }: { setSpan: any; span: string }) => {
    return (
        <ul className={"flex-center"}>
            {buttonsData.map((item, i) => (
                <li
                    className={"stacking-chart-card__buttons mr-05 br-8 pv-025 ph-05"}
                    key={i}
                    onClick={() => {
                        setSpan(item.title);
                    }}
                    data-selected={span === item.title}
                >
                    {item.title}
                </li>
            ))}
        </ul>
    );
};
export default RangeButtons;
