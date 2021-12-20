import { useEffect, useMemo, useRef } from 'react'
import * as d3 from 'd3'
import { scaleBand, scaleLinear } from 'd3'

interface BarChartInterface {
  data
  dimensions: {
    width: number
    height: number
    margin: { top: number; right: number; bottom: number; left: number }
  }
  isMobile: boolean
}

export default function BarChart({ data, dimensions, isMobile }: BarChartInterface) {
  const svgRef = useRef(null)
  const { width, height, margin } = dimensions
  const svgWidth = width + margin.left + margin.right + 10
  const svgHeight = height + margin.bottom + margin.top

  const activeTickIdx = useMemo(() => {
    if (!data) return

    let idx
    for (const i of data) {
      if (i.isCurrent === true) {
        idx = i.index
      }
    }

    return idx
  }, [data])

  const token0 = useMemo(() => {
    if (!data) return
    return data[0].token0
  }, [data])

  const token1 = useMemo(() => {
    if (!data) return
    return data[0].token1
  }, [data])

  useEffect(() => {
    if (!data || data.length === 0 || !Array.isArray(data) || !activeTickIdx) return

    const xDomain = new Set(data.map((v) => v.price0))
    const yDomain = [0, d3.max(data, (v) => v.activeLiquidity)]

    const xScale = d3.scaleBand(xDomain, [0, width])
    const yScale = d3.scaleLinear(yDomain, [height, 0])

    const svgEl = d3.select(svgRef.current)

    svgEl.selectAll('*').remove()

    const InfoRectGroup = d3.create('svg:g').style('pointer-events', 'none').style('display', 'none')

    const InfoRect = d3
      .create('svg:rect')
      .append('rect')
      .attr('id', 'info-label')
      .attr('width', '220px')
      .attr('height', '90px')
      .attr('rx', '6')
      .style('fill', '#12151d')

    const InfoRectPrice0 = d3
      .create('svg:text')
      .attr('transform', 'translate(16, 25)')
      .attr('fill', 'white')
      .attr('font-weight', '600')
      .attr('font-size', '12px')

    const InfoRectPrice1 = d3
      .create('svg:text')
      .attr('transform', 'translate(16, 50)')
      .attr('fill', 'white')
      .attr('font-weight', '600')
      .attr('font-size', '12px')

    const InfoRectPriceLocked = d3
      .create('svg:text')
      .attr('transform', 'translate(16, 75)')
      .attr('fill', 'white')
      .attr('font-weight', '600')
      .attr('font-size', '12px')

    const InfoCurrentCircle = d3
      .create('svg:circle')
      .attr('fill', '#fffb0f')
      .attr('r', '5px')
      .attr('cx', '180px')
      .attr('cy', '21px')
      .attr('display', 'none')

    InfoRectGroup.node().append(InfoRect.node())
    InfoRectGroup.node().append(InfoRectPrice0.node())
    InfoRectGroup.node().append(InfoRectPrice1.node())
    InfoRectGroup.node().append(InfoRectPriceLocked.node())
    InfoRectGroup.node().append(InfoCurrentCircle.node())

    const svg = svgEl.append('g').attr('transform', `translate(${margin.left}, ${margin.top})`)

    svgEl.on('mouseenter', () => {
      InfoRectGroup.style('display', 'block')
    })

    svgEl.on('mouseleave', () => {
      InfoRectGroup.style('display', 'none')
    })

    svgEl.on('tap', () => {
      InfoRectGroup.style('display', 'block')
    })

    svg
      .append('circle')
      .attr('fill', 'yellow')
      .attr('r', '5px')
      .attr('cx', xScale(data[activeTickIdx].price0))
      .attr('cy', height + 10)

    svg
      .append('text')
      .attr('transform', `translate(${xScale(data[activeTickIdx].price0) + 10}, ${height + 14})`)
      .attr('fill', 'yellow')
      .attr('font-size', '12px')
      .property('innerHTML', 'Current price')

    const bar = svg
      .append('g')
      .selectAll('rect')
      .data(data)
      .join('rect')
      .attr('x', (i) => xScale(i.price0))
      .attr('y', (i) => yScale(i.activeLiquidity))
      .attr('height', (i) => yScale(0) - yScale(i.activeLiquidity))
      .attr('width', xScale.bandwidth())
      .attr('fill', (v) => (v.isCurrent ? '#fffb0f' : '#63c0f8'))

    svg
      .append('g')
      .attr('fill', 'transparent')
      .selectAll('rect')
      .data(data)
      .join('rect')
      .attr('x', (i) => xScale(i.price0))
      .attr('y', 0)
      .attr('height', height)
      .attr('width', xScale.bandwidth())
      .on('mouseover', (d, v) => {
        const highlight = d3.select(d.target)
        highlight.attr('fill', 'rgba(255,255,255,0.5)')
        const xTranslate = xScale(v.price0)
        const isOverflowing = Number(xTranslate) + 150 + 16 > dimensions.width
        InfoRectGroup.attr(
          'transform',
          `translate(${isOverflowing ? Number(xTranslate) - 220 - 16 : Number(xTranslate) + 16},10)`
        )

        if (v.index === activeTickIdx) {
          InfoCurrentCircle.attr('display', 'block')
        } else {
          InfoCurrentCircle.attr('display', 'none')
        }

        InfoRectPrice0.property('innerHTML', `${data[0].token0} Price: ${v.price0.toFixed(2)} ${data[0].token1}`)
        InfoRectPrice1.property('innerHTML', `${data[0].token1} Price: ${v.price1.toFixed(2)} ${data[0].token0}`)

        InfoRectPriceLocked.property(
          'innerHTML',
          `${v.index < activeTickIdx ? token0 : token1} Locked: ${v.tvlToken0.toFixed(2)} ${
            v.index >= activeTickIdx ? token1 : token0
          }`
        )
      })
      .on('mouseleave', (d) => {
        const rect = d3.select(d.target)
        rect.attr('fill', 'transparent')
      })

    svg.append(() => InfoRectGroup.node())
  }, [data, activeTickIdx])

  return (
    <svg
      ref={svgRef}
      style={{ overflow: 'visible', backgroundColor: '#081a2d', borderRadius: '10px' }}
      width={svgWidth}
      height={svgHeight}
    />
  )
}
