import React from "react";
import "./index.scss";

interface AutoColumnProps {
    children?: any;
    gap?: "0" | "1" | "2" | "3";
    justify?: "stretch" | "center" | "start" | "end" | "flex-start" | "flex-end" | "space-between";
}

const AutoColumn = ({ children, gap, justify }: AutoColumnProps) => {
    return <div className={`auto-column-wrapper ${gap && `rg-${gap}`}`}>{children}</div>;
};

export default AutoColumn;
