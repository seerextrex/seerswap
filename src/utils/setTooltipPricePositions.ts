export function setTooltipPricePositions(height0: number, height1: number, y: number, res: any[], halfOfHeight: number, outOfChartTooltipRect: any, outOfChartTooltipText: any, outOfChartTooltipGroup: any, rect: any, height: number, i: number) {
    if (height1 < 0 || height0 < 0) {

        if (y > halfOfHeight) {

            outOfChartTooltipRect
                .attr('x', i > 0 ? 100 + (10 * i) : 0)
                .attr('y', height - 40)
                .attr('fill', 'blue')
                .attr('rx', '6')

            outOfChartTooltipText
                .attr('transform', `translate(${20 * (i + 1)}, 390)`)
                .property('innerHTML', `VNIZ`)
            res.push(outOfChartTooltipGroup)
        } else {
            outOfChartTooltipRect
                .attr('x', 0)
                .attr('y', 0)

            outOfChartTooltipText
                .property('innerHTML', `VVERH`)
            res.push(outOfChartTooltipGroup)
        }
    } else {
        res.push(rect)
    }
}
