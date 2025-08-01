import { t, Trans } from "@lingui/macro";
import React from "react";
import { TYPE } from "theme";
import "./index.scss";

interface PageButtonsProps {
    page: number;
    maxPage: number;
    setPage: (a: number) => void;
}

export default function PageButtons({ page, maxPage, setPage }: PageButtonsProps) {
    return (
        <div className={"table-page-buttons-wrapper mt-1"}>
            <div
                onClick={() => {
                    setPage(page === 1 ? page : page - 1);
                }}
            >
                <div className={"table-page-button mt-1"}>←</div>
            </div>
            <div className={"mt-1"}>
                <TYPE.body>{t`Page ${page} of ${maxPage}`}</TYPE.body>
            </div>
            <div
                onClick={() => {
                    setPage(page === maxPage ? page : page + 1);
                }}
            >
                <div className={"table-page-button mt-1"}>→</div>
            </div>
        </div>
    );
}
