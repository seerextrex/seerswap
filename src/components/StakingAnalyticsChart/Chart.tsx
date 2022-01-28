import * as d3 from 'd3'
import {useEffect, useMemo, useRef} from 'react'
import {ChardDataInterface} from './index'
import {isMobile} from "react-device-detect"
import {ChartWrapper} from './styled'

interface ChartProps {
    fData: ChardDataInterface[]
    data2?: ChardDataInterface[] | undefined
    margin: { left: number, top: number, right: number, bottom: number }
    dimensions: { width: number, height: number }
    type: string
    colors: string[]
}

export default function Chart({fData, data2,  margin, dimensions, type, colors}: ChartProps) {
    const data = useMemo(() => type === 'apr' || type === 'ALGBfromVault' ? fData.slice(0, fData.length - 1): fData,[fData])
    const svgRef = useRef(null)
    const X = useMemo(() => d3.map(data, d => new Date(d.date)), [data])
    const Y = useMemo(() => d3.map(data, d => +(d.value)), [data])
    const Y2 = useMemo(() => d3.map(data2 || [], d => +d.value), [data2])
    const I = d3.range(X.length)
    // Compute default domains.
    const yDomain = useMemo(() => [0, d3.max([...Y, ...Y2])], [Y, Y2])
    const xDomain = useMemo(() => [d3.min(X), d3.max(X)], [X])

    const tickWidth = useMemo(() => {
        return dimensions.width / data.length
    }, [dimensions, data])

    useEffect(() => {
        const svgEl = d3.select(svgRef.current)
        svgEl.selectAll('*').remove()

        const svg = svgEl
            .append('g')
            .attr('width', dimensions.width)
            .attr('height', dimensions.height)
            .attr('viewBox', [0, 0, dimensions.width, dimensions.height])

        // Construct scales and axes.
        const xScale = d3.scaleUtc(xDomain, [margin.left, dimensions.width - margin.right])
        const yScale = d3.scaleLinear(yDomain, [dimensions.height - margin.bottom, margin.top])
        const xAxis = d3.axisBottom(xScale).ticks(data.length < 3 ? 1 : data.length < 4 ? 2 : data.length)
        const yAxis = d3.axisLeft(yScale).ticks(dimensions.height / 40).tickFormat(val =>  val >= 1000_000 ? `${+val / 1000000}m` : `${val >= 1000 ? `${+val / 1000}k` : val}`)

        // Construct a focus line.
        const Line = d3
            .create('svg:line')
            .attr('id', 'pointer2')
            .attr('x1', '0px')
            .attr('y1', margin.top)
            .attr('x2', '0px')
            .attr('y2', dimensions.height - margin.bottom)
            .style('stroke-width', 1)
            .style('stroke', '#595f6e')
            .style('display', 'none')

        // Construct a chart line.
        const line = d3.line()
            .curve(d3.curveBumpX)
            .x(i => xScale(X[i]))
            .y(i => yScale(Y[i]))

        const line2 = d3.line()
            .curve(d3.curveBumpX)
            .x(i => xScale(X[i]))
            .y(i => yScale(Y2[i]))

        //Construct infoLabel
        const InfoRectGroup = d3.create('svg:g').style('pointer-events', 'none').style('display', 'none')

        const InfoRect = d3
            .create('svg:rect')
            .append('rect')
            .attr('id', 'info-label')
            .attr('width', '150px')
            .attr('height', `${data2?.length === 0 ? '60px' : '90px'}`)
            .attr('rx', '6')
            .style('fill', '#12151d')

        const InfoRectFeeText = d3
            .create('svg:text')
            .attr('transform', 'translate(16, 25)')
            .attr('fill', 'white')
            .attr('font-weight', '600')
            .attr('font-size', '14px')

        const InfoRectFeeText2 = d3
            .create('svg:text')
            .attr('transform', 'translate(16, 50)')
            .attr('fill', 'white')
            .attr('font-weight', '600')
            .attr('font-size', '14px')

        const InfoRectColor = d3
            .create('svg:rect')
            .attr('transform', 'translate(130, 15)')
            .attr('width', '10px')
            .attr('height', '10px')
            .attr('rx', '2')

        const InfoRectColor2 = d3
            .create('svg:rect')
            .attr('transform', 'translate(130, 40)')
            .attr('width', '10px')
            .attr('height', '10px')
            .attr('rx', '2')

        const InfoRectDateText = d3
            .create('svg:text')
            .attr('transform', `translate(16, ${data2?.length === 0 ? '45' : '75'})`)
            .attr('fill', 'white')
            .attr('font-weight', '500')
            .attr('font-size', '12px')
            .attr('fill', '#b0b0b0')

        InfoRectGroup.node().append(InfoRect.node())
        InfoRectGroup.node().append(InfoRectFeeText.node())
        InfoRectGroup.node().append(InfoRectDateText.node())
        InfoRectGroup.node().append(InfoRectColor.node())
        if (data2?.length !== 0) {
            InfoRectGroup.node().append(InfoRectFeeText2.node())
            InfoRectGroup.node().append(InfoRectColor2.node())
        }


        const Focus = d3
            .create('svg:circle')
            .style('fill', 'white')
            .attr('stroke', colors[0])
            .attr('stroke-width', '2')
            .attr('r', 5.5)
            .style('opacity', 1)
            .style('display', 'none')

        const Focus2 = d3
            .create('svg:circle')
            .style('fill', 'white')
            .attr('stroke', colors[1])
            .attr('stroke-width', '2')
            .attr('r', 5.5)
            .style('opacity', 1)
            .style('display', 'none')

      const yGroup = svg.append('g')
            .attr('transform', `translate(${margin.left},0)`)
            .attr('opacity', 0.5)
            .attr('color', 'white')
            .call(yAxis)
            .call(g => g.select('.domain').remove())
            .call(g => g.selectAll('.tick line').clone()
                .attr('x2', dimensions.width - margin.left - margin.right)
                .attr('stroke-opacity', 0.1))

        const xGroup = svg.append('g')
            .attr('transform', `translate(0,${dimensions.height - margin.bottom})`)
            .call(xAxis)

        xGroup.selectAll('text')
            .attr('opacity', 0.5)
            .attr('color', 'white')

        svg.append('path')
            .attr('fill', 'none')
            .attr('d', line(I))
            .attr('stroke-width', 2)
            .attr('stroke', colors[0])
            .transition()
            .duration(1000)
            .ease(d3.easeCircle)
            .attrTween('stroke-dasharray', function () {
                const length = this.getTotalLength()
                return d3.interpolate(`0,${length}`, `${length},${length}`)
            })

        if (data2?.length !== 0) {
            svg.append('path')
                .attr('fill', 'none')
                .attr('d', line2(I))
                .attr('stroke-width', 2)
                .attr('stroke', colors[1])
                .transition()
                .duration(1000)
                .ease(d3.easeCircle)
                .attrTween('stroke-dasharray', function () {
                    const length = this.getTotalLength()
                    return d3.interpolate(`0,${length}`, `${length},${length}`)
                })
        }

        xGroup
            .selectAll('.tick')
            .nodes()
            .map((el, i) => {
                if (isMobile) {
                 d3.select(el)
                     .selectAll('text')
                     .style('text-anchor', 'end')
                     .attr('dx', '-.8em')
                     .attr('dy', '.15em')
                     .attr('transform', 'rotate(-65)')
                     .attr('transform', 'rotate(-65)')
                }
                if (i % 2 === 0) {
                    if (data.length > 14) {
                        d3.select(el).attr('display', 'none')
                    }
                }
                const xTranslate = d3.select(el)
                    .attr('transform')
                    .match(/\((.*?)\)/)[1]
                    .split(',')[0]

                const rect = d3
                    .create('svg:rect')
                    .attr('x', `${xTranslate - tickWidth / 2}px`)
                    .attr('y', `-${0}px`)
                    .attr('width', `${tickWidth}px`)
                    .attr('height', `${dimensions.height}px`)
                    .attr('fill', 'transparent')
                    .on('mouseover', (e) => {

                        const isOverflowing = (Number(xTranslate) + 150 + 16) > dimensions.width

                        Line.attr('x1', `${xTranslate}px`).attr('x2', `${xTranslate}px`)
                        InfoRectGroup.attr(
                            'transform',
                            `translate(${isOverflowing ? Number(xTranslate) - (isMobile ? 145 : 160) : Number(xTranslate) + (isMobile ? -5 : 10)},10)`
                        )
                        const val1 = +parseFloat(data[i]?.value).toFixed(3)
                        const val2 = +parseFloat(data2[i]?.value.toString()).toFixed(3)
                        const textVal = data2?.length !== 0 ? (val2 < val1 ? val1 : val2) : val1
                        const textVal2 = val1 < val2 ? val1 : val2

                        InfoRectFeeText.property('innerHTML', `Value: ${type === 'apr' ? Number(val1) : (textVal >= 1000_000 ? `${(textVal / 1000_000).toFixed(2)}m` : textVal >= 1000 ? `${(textVal / 1000).toFixed(2)}k` : textVal.toFixed(2))} ${type === 'apr' ? '%' : ''}`)
                        InfoRectColor.attr('fill', data2?.length !== 0 ? (val1 < val2 ? colors[1] : colors[0]) : colors[0])
                        InfoRectFeeText2.property('innerHTML', `Value: ${type === 'apr' ? Number(val2) : (textVal2 >= 1000_000 ? `${(textVal2 / 1000_000).toFixed(2)}m` : textVal2 >= 1000 ? `${(textVal2 / 1000).toFixed(2)}k` : textVal2.toFixed(2))} ${type === 'apr' ? '%' : ''}`)
                        InfoRectColor2.attr('fill', val2 === val1 ? colors[1] : val2 < val1 ? colors[1] : colors[0])
                        InfoRectDateText.property('innerHTML', `${data[i]?.date}`)

                        Focus.attr('transform', `translate(${xScale(new Date(data[i]?.date))},${yScale(+data[i]?.value)})`)
                        if (data2?.length !== 0) {
                            Focus2.attr('transform', `translate(${xScale(new Date(data[i]?.date))},${yScale(data2[i]?.value)})`)
                        }
                    })
                svg.node().append(rect.node())
            })

        svgEl.on('mouseenter', () => {
            Line.style('display', 'block')
            InfoRectGroup.style('display', 'block')
            Focus.style('display', 'block')
            Focus2.style('display', `${data2?.length !== 0 ? 'block': 'none'}`)
        })

        svgEl.on('mouseleave', () => {
            Line.style('display', 'none')
            InfoRectGroup.style('display', 'none')
            Focus.style('display', 'none')
            Focus2.style('display', 'none')
        })

        svg.append(() => Line.node())
        svg.append(() => Focus.node())
        svg.append(() => InfoRectGroup.node())
        svg.append(() => Focus2.node())
    }, [data, xDomain])

    return (
        <ChartWrapper>
            <svg ref={svgRef} width={dimensions.width} height={dimensions.height}/>
        </ChartWrapper>
    )
}