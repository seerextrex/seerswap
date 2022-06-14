import { useEffect, useMemo, useRef } from "react";
import { axisBottom, create, max, scaleBand, scaleLinear, select } from "d3";
import { ProcessedData } from "../../models/interfaces";
import { t, Trans } from "@lingui/macro";

interface BarChartProps {
    data: ProcessedData[] | undefined;
    dimensions: {
        width: number;
        height: number;
        margin: { top: number; right: number; bottom: number; left: number };
    };
    activeTickIdx: number | undefined;
    isMobile: boolean;
}

export default function BarChart({ data, activeTickIdx, dimensions }: BarChartProps) {
    const svgRef = useRef(null);
    const { width, height, margin } = dimensions;
    const svgWidth = width + margin.left + margin.right + 10;
    const svgHeight = height + margin.bottom + margin.top;

    const token0 = useMemo(() => {
        if (!data) return;
        return data[0].token0;
    }, [data]);
    const token1 = useMemo(() => {
        if (!data) return;
        return data[0].token1;
    }, [data]);

    const activeTickIdxInRange = useMemo(() => {
        if (!activeTickIdx || !data || data.length === 0) return;

        return data.findIndex((v: any) => v.index === activeTickIdx);
    }, [activeTickIdx, data]);

    useEffect(() => {
        if (!data || data.length === 0 || !Array.isArray(data) || !activeTickIdxInRange) return;

        const xDomain = new Set(data.map((v) => v.price0));
        const yDomain = [0, max(data, (v) => v.activeLiquidity)];

        const xScale = scaleBand(xDomain, [0, width]);
        // @ts-ignore
        const yScale = scaleLinear(yDomain, [height, 0]);

        const svgEl = select(svgRef.current);

        svgEl.selectAll("*").remove();

        const InfoRectGroup = create("svg:g").style("pointer-events", "none").style("display", "none");

        const InfoRect = create("svg:rect").append("rect").attr("id", "info-label").attr("width", "220px").attr("height", "90px").attr("rx", "6").style("fill", "#12151d");

        const InfoRectPrice0 = create("svg:text").attr("transform", "translate(16, 25)").attr("fill", "white").attr("font-weight", "600").attr("font-size", "12px");

        const InfoRectPrice1 = create("svg:text").attr("transform", "translate(16, 50)").attr("fill", "white").attr("font-weight", "600").attr("font-size", "12px");

        const InfoRectPriceLocked = create("svg:text").attr("transform", "translate(16, 75)").attr("fill", "white").attr("font-weight", "600").attr("font-size", "12px");

        const InfoCurrentCircle = create("svg:circle").attr("fill", "var(--green)").attr("r", "5px").attr("cx", "200px").attr("cy", "21px").attr("display", "none");

        //TODO rewrite to div
        // @ts-ignore
        InfoRectGroup.node().append(InfoRect.node());
        // @ts-ignore
        InfoRectGroup.node().append(InfoRectPrice0.node());
        // @ts-ignore
        InfoRectGroup.node().append(InfoRectPrice1.node());
        // @ts-ignore
        InfoRectGroup.node().append(InfoRectPriceLocked.node());
        // @ts-ignore
        InfoRectGroup.node().append(InfoCurrentCircle.node());

        const svg = svgEl.append("g").attr("transform", `translate(${margin.left}, ${margin.top})`);

        svg.on("mouseenter", () => {
            InfoRectGroup.style("display", "block");
        });

        svg.on("mouseleave", () => {
            InfoRectGroup.style("display", "none");
        });

        svg.on("tap", () => {
            InfoRectGroup.style("display", "block");
        });

        const xAxisGroup = svg
            .append("g")
            .attr("transform", `translate(0, ${height})`)
            .call(
                axisBottom(xScale)
                    .ticks(601)
                    .tickFormat((v) => (v < 0.01 ? v.toFixed(4) : v.toFixed(2)))
                    .tickSizeOuter(0)
            );
        xAxisGroup.selectAll("line").attr("stroke", "rgba(255, 255, 255, 0)").attr("id", "xline");
        xAxisGroup
            .selectAll("text")
            .attr("opacity", 0.5)
            .attr("color", "white")
            .attr("font-size", "0.75rem")
            .nodes()
            .map((el, i) => {
                if (i % 75 !== 0) {
                    select(el).attr("display", "none");
                }
            });

        if (activeTickIdxInRange) {
            svg.append("circle")
                .attr("fill", "var(--green)")
                .attr("r", "5px")
                .attr("cx", (xScale(data[activeTickIdxInRange]?.price0) ?? 0) + 2)
                .attr("cy", -9);

            svg.append("text")
                .attr("transform", `translate(${(xScale(data[activeTickIdxInRange].price0) ?? 0) + 15}, ${-5})`)
                .attr("fill", "var(--green)")
                .attr("font-size", "12px")
                .property("innerHTML", t`Current price`);
        }

        svg.append("g")
            .selectAll("rect")
            .data(data)
            .join("rect")
            .attr("fill", "var(--primary)")
            .attr("x", (i) => xScale(i.price0) || 0)
            .attr("y", (i) => yScale(i.activeLiquidity))
            .attr("height", (i) => yScale(0) - yScale(i.activeLiquidity))
            .attr("width", xScale.bandwidth());

        svg.append("g")
            .selectAll("rect")
            .data(data)
            .join("rect")
            .attr("x", (i) => xScale(i.price0) || 0)
            .attr("y", 0)
            .attr("height", height)
            .attr("width", xScale.bandwidth())
            .attr("fill", (v) => (v.isCurrent ? "var(--green)" : "transparent"))
            .on("mouseover", (d, v) => {
                const highlight = select(d.target);
                highlight.attr("fill", "rgba(255,255,255,0.5)");
                const xTranslate = xScale(v.price0);
                const isOverflowing = Number(xTranslate) + 150 + 16 > dimensions.width;
                InfoRectGroup.attr("transform", `translate(${isOverflowing ? Number(xTranslate) - 220 - 16 : Number(xTranslate) + 16},10)`);

                if (v.index === activeTickIdxInRange) {
                    InfoCurrentCircle.attr("display", "block");
                } else {
                    InfoCurrentCircle.attr("display", "none");
                }

                const isLower0 = v.price0 < 0.01;
                const isLower1 = v.price1 < 0.01;
                const isLowerTVL = v.tvlToken0 < 0.01;

                InfoRectPrice0.property("innerHTML", t`${data[0].token0} Price: ${isLower0 ? v.price0.toFixed(4) : v.price0.toFixed(3)} ${data[0].token1}`);
                InfoRectPrice1.property("innerHTML", t`${data[0].token1} Price: ${isLower1 ? v.price1.toFixed(4) : v.price1.toFixed(3)} ${data[0].token0}`);

                InfoRectPriceLocked.property(
                    "innerHTML",
                    t`${v.index < activeTickIdxInRange ? token0 : token1} Locked: ${isLowerTVL ? v.tvlToken0.toFixed(4) : v.tvlToken0.toFixed(2)} ${v.index >= activeTickIdxInRange ? token1 : token0}`
                );
            })
            .on("mouseleave", (d, v) => {
                const rect = select(d.target);
                rect.attr("fill", v.isCurrent ? "var(--green)" : "transparent");
            })
            .on("mouseleave", (d, v) => {
                const rect = select(d.target);
                rect.attr("fill", v.isCurrent ? "#fffb0f" : "transparent");
            });

        svg.append(() => InfoRectGroup.node());
    }, [data, activeTickIdxInRange]);

    return <svg ref={svgRef} width={svgWidth} height={svgHeight} />;
}
