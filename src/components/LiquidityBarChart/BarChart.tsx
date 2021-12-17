import { useEffect, useMemo, useRef } from 'react'
import * as d3 from 'd3'
import { scaleLinear } from 'd3'

interface BarChartInterface {
  data
  dimensions: {
    width: number
    height: number
    margin: { top: number; right: number; bottom: number; left: number }
  }
  isMobile: boolean
}

export default function BarChart({ data = [], dimensions, isMobile }: BarChartInterface) {
  const svgRef = useRef(null)
  const { width, height, margin } = dimensions
  const svgWidth = width + margin.left + margin.right + 10
  const svgHeight = height + margin.bottom + margin.top

  const xTicks = 601

  const tickWidth = useMemo(() => {
    return dimensions.width / xTicks
  }, [dimensions])

  const maxXScale = useMemo(() => data.reduce((acc, el) => (el.price0 > acc ? el.price0 : acc), 0), [data])

  const { xScale, yScale } = useMemo(() => {
    const scales = {
      xScale: scaleLinear().domain([0, xTicks]).range([0, width]),
      yScale: scaleLinear()
        .domain([0, d3.max(data, (v) => v.activeLiquidity)])
        .range([height, 0]),
    }

    return scales
  }, [current, zoomLevels.initialMin, zoomLevels.initialMax, innerWidth, series, innerHeight, zoom])

  useEffect(() => {
    if (data.length === 0) return

    const svgEl = d3.select(svgRef.current)
    svgEl.selectAll('*').remove()

    const svg = svgEl.append('g').attr('transform', `translate(${margin.left}, ${margin.top})`)

    // svgEl.on('mouseenter', () => {
    //   Line.style('display', 'block')
    //   InfoRectGroup.style('display', 'block')
    //   Focus.style('display', 'block')
    // })

    // svgEl.on('mouseleave', () => {
    //   Line.style('display', 'none')
    //   InfoRectGroup.style('display', 'none')
    //   Focus.style('display', 'none')
    // })

    // svgEl.on('tap', () => {
    //   Line.style('display', 'block')
    //   InfoRectGroup.style('display', 'block')
    //   Focus.style('display', 'block')
    // })

    const xAxisGroup = svg
      .append('g')
      .attr('transform', `translate(0, ${height})`)
      .call(d3.axisBottom(xScale).ticks(xTicks).tickSizeOuter(0))
    xAxisGroup.selectAll('line').attr('stroke', 'rgba(255, 255, 255, 0)').attr('id', 'xline')
    xAxisGroup.selectAll('text').attr('opacity', 0.5).attr('color', 'white').attr('font-size', '0.75rem')

    // const y = d3
    //   .scaleLinear()
    //   .domain([
    //     d3.min(_chartData, (d) => (d.value > 0 ? d.value - d.value * 0.2 : 0)),
    //     d3.max(_chartData, (d) => +d.value + d.value * 0.2),
    //   ])
    //   .range([height, 0])

    // const yAxisGroup = svg.append('g').call(
    //   d3
    //     .axisLeft(y)
    //     .ticks(10)
    //     .tickFormat((val) => `${type === ChartType.FEES ? `${val}%` : `$${val}`}`)
    //     .tickSize(-width)
    // )

    // yAxisGroup.selectAll('line').attr('stroke', 'rgba(255, 255, 255, 0.1)').attr('id', 'xline')
    // yAxisGroup.select('.domain').remove()
    // yAxisGroup.selectAll('text').attr('opacity', 0.5).attr('color', 'white').attr('font-size', '0.75rem')

    //Gradient
    // svg
    //   .append('linearGradient')
    //   .attr('id', 'gradient')
    //   .attr('x1', '0%')
    //   .attr('y1', '0%')
    //   .attr('x2', '0%')
    //   .attr('y2', '100%')
    //   .selectAll('stop')
    //   .data([
    //     {
    //       offset: '0%',
    //       color: 'rgba(99, 192, 248, 0.75)',
    //     },
    //     {
    //       offset: '100%',
    //       color: 'rgba(99, 192, 248, 0)',
    //     },
    //   ])
    //   .enter()
    //   .append('stop')
    //   .attr('offset', (d) => d.offset)
    //   .attr('stop-color', (d) => d.color)

    // Chart data visualize
    // svg
    //   .append('path')
    //   .datum(_chartData)
    //   .attr('fill', 'none')
    //   .attr('stroke', '#63c0f8')
    //   .attr('stroke-width', 2)
    //   .attr(
    //     'd',
    //     d3
    //       .line()
    //       .curve(d3.curveBumpX)
    //       .x(function (d) {
    //         return xScale(d.timestamp)
    //       })
    //       .y(function (d) {
    //         return y(d.value)
    //       })
    //   )

    // svg
    //   .append('path')
    //   .datum(_chartData)
    //   .attr('fill', 'url(#gradient)')
    //   .attr(
    //     'd',
    //     d3
    //       .area()
    //       .curve(d3.curveBumpX)
    //       .x((d) => xScale(d.timestamp))
    //       .y0((d) => y(d3.min(_chartData, (d) => (d.value > 0 ? d.value - d.value * 0.2 : 0))))
    //       .y1((d) => y(d.value))
    //   )

    // xAxisGroup
    //   .selectAll('.tick')
    //   .nodes()
    //   .map((el, i) => {
    //     const xTranslate = d3
    //       .select(el)
    //       .attr('transform')
    //       .match(/\((.*?)\)/)[1]
    //       .split(',')[0]

    //     if (isMobile && span !== ChartSpan.WEEK) {
    //       d3.select(el)
    //         .selectAll('text')
    //         .style('text-anchor', 'end')
    //         .attr('dx', '-.8em')
    //         .attr('dy', '.15em')
    //         .attr('transform', 'rotate(-65)')
    //     }

    //     if (isMobile && i % 2 === 0) {
    //       d3.select(el).attr('display', 'none')
    //     } else if (i % 2 === 0 && span !== ChartSpan.WEEK) {
    //       d3.select(el).attr('display', 'none')
    //     }

    //     // d3.select(el).attr('transform', `translate(${+xTranslate + +tickWidth}, 0)`)

    //     const hoverHandle = function (e) {
    //       const isOverflowing = Number(xTranslate) + 150 + 16 > dimensions.width
    //       const date = new Date(_chartData[i]?.timestamp)
    //       Line.attr('x1', `${xTranslate}px`).attr('x2', `${xTranslate}px`)
    //       InfoRectGroup.attr(
    //         'transform',
    //         `translate(${isOverflowing ? Number(xTranslate) - 150 - 16 : Number(xTranslate) + 16},10)`
    //       )
    //       InfoRectFeeText.property(
    //         'innerHTML',
    //         `${type === ChartType.FEES ? 'Fee:' : type === ChartType.TVL ? 'TVL:' : 'Volume:'} ${
    //           type !== ChartType.FEES ? '$' : ''
    //         }${Number(_chartData[i]?.value).toFixed(2)}${type === ChartType.FEES ? '%' : ''}`
    //       )
    //       InfoRectDateText.property(
    //         'innerHTML',
    //         span === ChartSpan.DAY
    //           ? `${date.getHours() < 10 ? `0${date.getHours()}` : date.getHours()}:${
    //               date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes()
    //             }:${date.getSeconds() < 10 ? `0${date.getSeconds()}` : date.getSeconds()}`
    //           : `${date.getDate()}/${date.getMonth() - 1}/${date.getFullYear()}`
    //       )
    //       Focus.attr('transform', `translate(${xScale(_chartData[i].timestamp)},${y(_chartData[i]?.value)})`)
    //     }

    //     const rect = d3
    //       .create('svg:rect')
    //       .attr('x', `${xTranslate - tickWidth / 2}px`)
    //       .attr('y', `-${0}px`)
    //       .attr('width', `${tickWidth}px`)
    //       .attr('height', `${dimensions.height}px`)
    //       .attr('fill', 'transparent')
    //       .on('mouseover', hoverHandle)
    //       .on('touchmove', hoverHandle)

    //     svg.node().append(rect.node())
    //   })

    // svg.append(() => InfoRectGroup.node())
    // svg.append(() => Line.node())
    // svg.append(() => Focus.node())
  }, [data])

  return <svg ref={svgRef} style={{ overflow: 'visible' }} width={svgWidth} height={svgHeight} />
}
