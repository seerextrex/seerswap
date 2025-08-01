import { HelpCircle } from "react-feather";
import React from "react";
import { Trans } from "@lingui/macro";

export const Apr = () => (
    <span className={"table-header__apr"}>
        <span>
            <Trans>🚀 APR</Trans>
        </span>
        <span style={{ marginLeft: "6px" }}>
            <HelpCircle style={{ display: "block" }} color={"white"} size={"1rem"} />
        </span>
        <span className={"helper"}>
            <Trans>
                Based on <span className={"helper-part"}>fees</span> / <span className={"helper-part"}>active liquidity</span>
            </Trans>
        </span>
    </span>
);
