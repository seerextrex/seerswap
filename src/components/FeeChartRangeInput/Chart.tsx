import React, { useEffect, useMemo, useRef, useState } from 'react'
import * as d3 from 'd3'
import { daysCount } from './index'

import dayjs from 'dayjs'
import { ChartSpan } from '../../pages/PoolInfoPage'

function sameDay(d1, d2) {
  return d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate()
}

interface ChartInterface {
  feeData:
    | {
        changesCount: number
        fee: number
        id: string
        pool: string
        timestamp: number
        endFee: number
        maxFee: number
        minFee: number
        startFee: number
      }[]
    | undefined

  dimensions: {
    width: number
    height: number
    margin: { top: number; right: number; bottom: number; left: number }
  }

  span: ChartSpan
  startDate: number
}

export default function Chart({ feeData = [], span, dimensions, startDate }: ChartInterface) {
  const svgRef = useRef(null)
  const { width, height, margin } = dimensions
  const svgWidth = width + margin.left + margin.right + 10
  const svgHeight = height + margin.bottom + margin.top

  const days = useMemo(() => {
    if (feeData.length === 0) return 0
    return daysCount(
      new Date(feeData[0].timestamp * 1000).getMonth(),
      new Date(feeData[0].timestamp * 1000).getFullYear()
    )
  }, [feeData])

  const chartData = useMemo(() => {
    if (feeData.length === 0) return []

    return feeData.map((item) => ({
      time: new Date(item.timestamp * 1000),
      fee: item.fee / item.changesCount / 10000,
      start: item.startFee,
      end: item.endFee,
      high: item.maxFee,
      low: item.minFee,
    }))
  }, [feeData])

  const tickWidth = useMemo(() => {
    //Todo auto length
    switch (span) {
      case ChartSpan.DAY:
        return dimensions.width / 24
      case ChartSpan.MONTH:
        return dimensions.width / 30
      case ChartSpan.WEEK:
        return dimensions.width / 7
    }
  }, [span, dimensions, feeData])

  const _chartData = useMemo(() => {
    if (chartData.length === 0) return

    let sameDays = []
    const res = []

    for (let i = 1; i < chartData.length; i++) {
      if (sameDay(new Date(chartData[i].time), new Date(chartData[i - 1].time))) {
        sameDays.push(chartData[i])
      } else {
        if (sameDays.length !== 0) {
          res.push(
            sameDays.reduce(
              (prev, cur) => {
                return { time: cur.time, fee: prev.fee + cur.fee }
              },
              {
                fee: 0,
                time: null,
              }
            )
          )
          res[res.length - 1].fee = res[res.length - 1].fee / sameDays.length
        }

        sameDays = []
      }
    }

    if (res.length !== 0) {
      res.push(
        sameDays.reduce(
          (prev, cur) => {
            return { time: cur.time, fee: prev.fee + cur.fee }
          },
          {
            fee: 0,
            time: null,
          }
        )
      )
      res[res.length - 1].fee = res[res.length - 1].fee / sameDays.length
    }

    const newA = []

    return [...newA, ...res]
  }, [chartData, feeData])

  const xScale = useMemo(() => {
    return d3
      .scaleTime()
      .domain([d3.min(_chartData, (d) => new Date(d.time)), d3.max(_chartData, (d) => new Date(d.time))])
      .range([0, width])
  }, [span, dimensions, _chartData])

  // useEffect(() => {
  //   const kek: any[] = []
  //   for (let i = 0; i < feeData.length; i++) {
  //     if (feeData[i - 1] !== undefined) {
  //       if (
  //         new Date(feeData[i - 1].timestamp * 1000).getHours() + 1 !==
  //         new Date(feeData[i].timestamp * 1000).getHours()
  //       ) {
  //         for (
  //           let j = new Date(feeData[i - 1].timestamp * 1000).getHours();
  //           j < new Date(feeData[i].timestamp * 1000).getHours();
  //           j++
  //         ) {
  //           kek.push(j)
  //         }
  //       } else {
  //         kek.push(new Date(feeData[i].timestamp * 1000).getHours())
  //       }
  //     }
  //   }
  //   console.log(
  //     kek,
  //     feeData.map((item) => new Date(item.timestamp * 1000).getHours())
  //   )
  // }, [feeData])

  const Line = d3
    .create('svg:line')
    .attr('id', 'pointer2')
    .attr('x1', '0px')
    .attr('y1', 0)
    .attr('x2', '0px')
    .attr('y2', height)
    .style('stroke-width', 1)
    .style('stroke', '#595f6e')
    .style('display', 'none')

  const InfoRectGroup = d3.create('svg:g').style('pointer-events', 'none').style('display', 'none')

  const InfoRect = d3
    .create('svg:rect')
    .append('rect')
    .attr('id', 'info-label')
    .attr('width', '150px')
    .attr('height', '60px')
    .attr('rx', '6')
    .style('fill', '#12151d')

  const InfoRectFeeText = d3
    .create('svg:text')
    .attr('transform', 'translate(16, 25)')
    .attr('fill', 'white')
    .attr('font-weight', '600')
    .attr('font-size', '14px')

  const InfoRectDateText = d3
    .create('svg:text')
    .attr('transform', 'translate(16, 45)')
    .attr('fill', 'white')
    .attr('font-weight', '500')
    .attr('font-size', '12px')
    .attr('fill', '#b0b0b0')

  InfoRectGroup.node().append(InfoRect.node())
  InfoRectGroup.node().append(InfoRectFeeText.node())
  InfoRectGroup.node().append(InfoRectDateText.node())

  const Focus = d3
    .create('svg:circle')
    .style('fill', 'white')
    .attr('stroke', '#00cab2')
    .attr('stroke-width', '2')
    .attr('r', 5.5)
    .style('opacity', 1)
    .style('display', 'none')

  const xTicks = useMemo(() => {
    switch (span) {
      case ChartSpan.DAY:
        return 24
      case ChartSpan.MONTH:
        return 30
      case ChartSpan.WEEK:
        return 7
    }
  }, [span])

  useEffect(() => {
    if (feeData.length === 0) return

    const svgEl = d3.select(svgRef.current)
    svgEl.selectAll('*').remove()

    const svg = svgEl.append('g').attr('transform', `translate(${margin.left}, ${margin.top})`)

    svgEl.on('mouseenter', () => {
      Line.style('display', 'block')
      InfoRectGroup.style('display', 'block')
      Focus.style('display', 'block')
    })

    svgEl.on('mouseleave', () => {
      Line.style('display', 'none')
      InfoRectGroup.style('display', 'none')
      Focus.style('display', 'none')
    })

    const xAxisGroup = svg.append('g').attr('transform', `translate(0, ${height})`).call(
      d3.axisBottom(xScale).ticks(xTicks).tickSizeOuter(0)
      // .tickFormat('%H')
    )
    // xAxisGroup.select('.domain').remove()
    xAxisGroup.selectAll('line').attr('stroke', 'rgba(255, 255, 255, 0)').attr('id', 'xline')

    // yAxis
    const y = d3
      .scaleLinear()
      .domain([d3.min(_chartData, (d) => +d.fee - 0.01), d3.max(_chartData, (d) => +d.fee + 0.01)])
      .range([height, 0])

    const yAxisGroup = svg.append('g').call(
      d3
        .axisLeft(y)
        .ticks(10)
        .tickFormat((val) => `${val}%`)
        .tickSize(-width)
    )

    yAxisGroup.selectAll('line').attr('stroke', 'rgba(255, 255, 255, 0.1)').attr('id', 'xline')
    yAxisGroup.select('.domain').remove()
    yAxisGroup.selectAll('text').attr('opacity', 0.5).attr('color', 'white').attr('font-size', '0.75rem')

    //Gradient
    svg
      .append('linearGradient')
      .attr('id', 'gradient')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '0%')
      .attr('y2', '100%')
      .selectAll('stop')
      .data([
        {
          offset: '0%',
          color: 'rgba(4,120,106,0.75)',
        },
        {
          offset: '100%',
          color: 'rgba(163,218,211,0)',
        },
      ])
      .enter()
      .append('stop')
      .attr('offset', (d) => d.offset)
      .attr('stop-color', (d) => d.color)

    // Chart data visualize
    svg
      .append('path')
      .datum(_chartData)
      .attr('fill', 'none')
      .attr('stroke', '#00cab2')
      .attr('stroke-width', 2)
      .attr(
        'd',
        d3
          .line()
          .curve(d3.curveBumpX)
          .x(function (d) {
            console.log('d time', d.time, xScale(d.time))
            return xScale(d.time)
          })
          .y(function (d) {
            return y(d.fee)
          })
      )

    svg
      .append('path')
      .datum(_chartData)
      .attr('fill', 'url(#gradient)')
      .attr(
        'd',
        d3
          .area()
          .curve(d3.curveBumpX)
          .x((d) => xScale(d.time))
          .y0((d) => y(d3.min(_chartData, (d) => +d.fee - 0.01)))
          .y1((d) => y(d.fee))
      )

    xAxisGroup
      .selectAll('.tick')
      .nodes()
      .map((el, i) => {
        console.log('EL', el)
        const xTranslate = d3
          .select(el)
          .attr('transform')
          .match(/\((.*?)\)/)[1]
          .split(',')[0]

        d3.select(el).attr('transform', `translate(${+xTranslate + +tickWidth}, 0)`)

        const rect = d3
          .create('svg:rect')
          .attr('x', `${xTranslate - tickWidth / 2}px`)
          .attr('y', `-${0}px`)
          .attr('width', `${tickWidth}px`)
          .attr('height', `${dimensions.height}px`)
          .attr('fill', 'transparent')
          .on('mouseover', (e) => {
            const isOverflowing = Number(xTranslate) + 150 + 16 > dimensions.width
            const date = new Date(_chartData[i]?.time)
            Line.attr('x1', `${xTranslate}px`).attr('x2', `${xTranslate}px`)
            InfoRectGroup.attr(
              'transform',
              `translate(${isOverflowing ? Number(xTranslate) - 150 - 16 : Number(xTranslate) + 16},10)`
            )
            InfoRectFeeText.property('innerHTML', `Fee: ${_chartData[i]?.fee.toFixed(3)}`)
            InfoRectDateText.property('innerHTML', `${date.getDate()}/${date.getMonth() - 1}/${date.getFullYear()}`)
            Focus.attr('transform', `translate(${xTranslate},${y(_chartData[i]?.fee)})`)
          })

        svg.node().append(rect.node())
      })

    svg.append(() => InfoRectGroup.node())
    svg.append(() => Line.node())
    svg.append(() => Focus.node())
  }, [feeData])

  return <svg ref={svgRef} width={svgWidth} height={svgHeight} />
}
