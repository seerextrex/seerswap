import { select } from "d3"
import stc from "string-to-color"

export function setTooltipPricePositions(height0: number, height1: number, y: number, res: any[], halfOfHeight: number, outOfChartTooltipRect: any, outOfChartTooltipText: any, outOfChartTooltipGroup: any, outOfChartTooltipChevron: any, rect: any, height: number, i: number, positionNumber: string) {
    if (height1 < 0 || height0 < 0) {

        const clonedRect = select(outOfChartTooltipRect).node().clone()
        const clonedChevron = select(outOfChartTooltipChevron).node().clone()
        const clonedGroup = select(outOfChartTooltipGroup).node().clone()
        const clonedText = select(outOfChartTooltipText).node().clone()

        clonedGroup.append(() => clonedRect.node())
        clonedGroup.append(() => clonedChevron.node())
        clonedGroup.append(() => clonedText.node())

        clonedText
            .property('innerHTML', positionNumber)

        clonedRect
            .attr('fill', stc(positionNumber))

        clonedChevron
            .attr('fill', stc(positionNumber))

        const marginLeft = i > 0 ? ((80 * i) + (i > 1 ? 0 : 10)) : 20

        if (y > halfOfHeight) {

            clonedChevron
                .style("transform", "translate(30px, 18px) rotate(45deg)");

            clonedGroup
                .attr('transform', `translate(${marginLeft}, ${height - 40})`)


        } else {

            clonedChevron
                .style("transform", "translate(30px, -7px) rotate(45deg)");

            clonedGroup
                .attr('transform', `translate(${marginLeft}, 10)`)

        }
        res.push(clonedGroup)
    } else {
        res.push(rect)
    }
}

