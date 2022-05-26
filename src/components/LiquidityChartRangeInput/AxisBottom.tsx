import React, { useEffect, useMemo } from "react";
import { Axis as d3Axis, axisBottom, NumberValue, ScaleLinear, select } from "d3";
import { StyledGroup } from "./styled";

const Axis = ({ axisGenerator }: { axisGenerator: d3Axis<NumberValue> }) => {
    const axisRef = (axis: SVGGElement) => {
        axis && select(axis).call(axisGenerator);
        // .call((g) => g.select('.domain').remove())
    };

    return <g ref={axisRef} />;
};

export const AxisBottom = ({ xScale, innerHeight, offset = 0 }: { xScale: ScaleLinear<number, number>; innerHeight: number; offset?: number }) => {
    useEffect(() => {
        // const firstTickText = select('.tick').attr('transform', (v) => {
        //   return v === 0 || v === 0.0 ? 'translate(10,0)' : ''
        // })
        // if (firstTickText && (firstTickText === '0' || firstTickText === '0.0')) {
        //   select('.tick:first-child').attr('transform', 'translate(10,0)')
        // }
    }, [xScale, offset, innerHeight]);

    return useMemo(
        () => (
            <StyledGroup transform={`translate(0, ${innerHeight + offset})`}>
                <Axis axisGenerator={axisBottom(xScale).ticks(6).tickSizeOuter(0)} />
            </StyledGroup>
        ),
        [innerHeight, offset, xScale]
    );
};
