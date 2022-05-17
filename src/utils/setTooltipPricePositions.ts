import stc from "string-to-color"

export function setTooltipPricePositions(height0: number, height1: number, y: number, res: any[], halfOfHeight: number, outOfChartTooltipRect: any, outOfChartTooltipText: any, outOfChartTooltipGroup: any, rect: any, height: number, i: number, positionNumber: string) {
    if (height1 < 0 || height0 < 0) {

        if (y > halfOfHeight) {

            //? eto massiv?
            outOfChartTooltipRect
                .attr('fill', stc(positionNumber))

            outOfChartTooltipGroup
                .attr('x', i > 0 ? 100 + (10 * i) : 10)
                .attr('y', height - 30)

            outOfChartTooltipText
                .property('innerHTML', positionNumber)

            res.push(outOfChartTooltipGroup)
        } else {
            outOfChartTooltipRect
                .attr('x', 0)
                .attr('y', 0)

            outOfChartTooltipText
                .property('innerHTML', positionNumber)
            res.push(outOfChartTooltipGroup)
        }
    } else {
        //? mutaetsya ref??
        res.push(rect)
    }
}

