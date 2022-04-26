import React, { useEffect, useMemo, useRef } from 'react'
import { area, axisBottom, axisLeft, create, curveBumpX, easeCircleOut, interpolate, line, max, min, scaleLinear, scaleTime, select } from 'd3'
import dayjs from 'dayjs'
import { ChartSpan, ChartType } from '../../models/enums'
import { FeeChart, FormattedFeeChart, PriceRangeChart } from '../../models/interfaces'
import { ChartToken } from '../../models/enums/poolInfoPage'
import { convertLocalDate } from '../../utils/convertDate'
import { convertDateTime } from '../../utils/time'
import { stringToColour } from '../../utils/stringToColour'

interface ChartInterface {
    feeData: FeeChart
    dimensions: {
        width: number
        height: number
        margin: { top: number; right: number; bottom: number; left: number }
    }
    span: ChartSpan
    type: ChartType
    isMobile: boolean
    tokens: {
        token0: string | undefined
        token1: string | undefined
    }
    token: number
    positions: {
        closed: PriceRangeChart | null,
        opened: PriceRangeChart | null
    }
    selected: string[]
}

export default function Chart({ feeData: { data, previousData }, span, type, dimensions, isMobile, tokens: { token0, token1 }, token, positions: { closed, opened }, selected }: ChartInterface) {
    const svgRef = useRef(null)
    const { width, height, margin } = dimensions
    const svgWidth = width + margin.left + margin.right + 10
    const svgHeight = height + margin.bottom + margin.top

    const firstNonEmptyValue = useMemo(() => {
        if (!previousData) return null

        if (previousData[0]) {
            return {
                value: previousData[0].value,
                timestamp: previousData[0].timestamp
            }
        } else {
            return null
        }
    }, [data, previousData])

    const xTicks = useMemo(() => {
        switch (span) {
            case ChartSpan.DAY:
                return 24
            case ChartSpan.MONTH:
                return 31
            case ChartSpan.WEEK:
                return 7
        }
    }, [span])

    const tickWidth = useMemo(() => {
        switch (span) {
            case ChartSpan.DAY:
                return dimensions.width / 24
            case ChartSpan.MONTH:
                return dimensions.width / 31
            case ChartSpan.WEEK:
                return dimensions.width / 7
        }
    }, [span, dimensions, data])

    const _chartData = useMemo(() => {
        if (!data || data.length === 0) return []

        const _span = span !== ChartSpan.DAY ? 'day' : 'hour'

        let sameDays: (FormattedFeeChart | undefined)[] = []
        let res = []

        if (data.length === 0 || (data[1] && dayjs(data[1].timestamp).isSame(data[0]?.timestamp))) {
            res.push({
                value: data[0]?.value,
                timestamp: data[0]?.timestamp
            })
        }
        // console.log(data)

        for (let i = span === ChartSpan.DAY ? 0 : 1; i < data.length; i++) {
            if (dayjs(data[i]?.timestamp).startOf(span !== ChartSpan.DAY ? 'day' : _span).isSame(dayjs(data[i - 1]?.timestamp).startOf(_span))) {
                sameDays.push(data[i])
            } else {
                if (sameDays.length !== 0) {
                    res.push(sameDays.reduce((prev, cur) => (
                        {// @ts-ignore
                            timestamp: cur.timestamp,
                            value:
                                span === ChartSpan.DAY || type === ChartType.FEES || type === ChartType.VOLUME || type === ChartType.PRICE
                                    // @ts-ignore
                                    ? prev.value + cur.value
                                    // @ts-ignore
                                    : Math.max(prev.value, cur.value)
                        }), { value: 0, timestamp: new Date() }
                    ))
                    if (type === ChartType.FEES || type === ChartType.PRICE) {
                        // @ts-ignore
                        res[res.length - 1].value = res[res.length - 1].value / sameDays.length
                    }
                } else {
                    res.push({
                        value: data[i]?.value,
                        timestamp: data[i]?.timestamp
                    })
                }
                sameDays = []
            }
        }

        // console.log(sameDays)

        if (sameDays.length !== 0) {
            res.push(sameDays.reduce(
                (prev, cur) => {
                    return {
                        // @ts-ignore
                        timestamp: cur.timestamp,
                        value:
                            span === ChartSpan.DAY || type === ChartType.FEES || type === ChartType.VOLUME || type === ChartType.PRICE
                                // @ts-ignore
                                ? prev.value + cur.value
                                // @ts-ignore
                                : Math.max(prev.value, cur.value)
                    }
                }, {
                    value: 0,
                    timestamp: new Date()
                }))
            if (type === ChartType.FEES || type === ChartType.PRICE) {
                // @ts-ignore
                res[res.length - 1].value = res[res.length - 1].value / sameDays.length
            }
        }

        if (res.length === 0) {
            res = res.concat([...data])
        }

        // console.log(res)
        // console.log(res, data)

        res = res.map((date) => ({
            timestamp: new Date(dayjs(date?.timestamp).startOf(_span).unix() * 1000),
            value: date?.value
        }))

        let _data = []

        if (res.length < xTicks) {
            const firstRealDay = dayjs(res[0].timestamp).startOf(_span)
            const lastRealDay = dayjs(res[res.length - 1].timestamp).startOf(_span)

            const firstAdditionalDay = dayjs(Date.now())
                .startOf(_span)
                .subtract(xTicks - 1, _span)
                .startOf(_span)
            const lastAdditionalDay = dayjs(Date.now()).startOf(_span)

            if (firstRealDay > firstAdditionalDay) {
                for (let i = firstAdditionalDay.unix(); i < firstRealDay.unix(); i += span === ChartSpan.DAY ? 3600 : 24 * 3600) {
                    _data.push({
                        timestamp: new Date(i * 1000),
                        value: type === ChartType.VOLUME ? 0 : firstNonEmptyValue ? firstNonEmptyValue.value : 0
                    })
                }
            }

            _data.push({
                timestamp: new Date(res[0].timestamp),
                value: res[0].value
            })


            let last = _data[_data.length - 1]

            for (let i = 1; i < res.length; i++) {
                const isNext = dayjs(res[i].timestamp)
                    .startOf(_span)
                    .subtract(1, _span)
                    .isSame(dayjs(res[i - 1].timestamp).startOf(_span))

                if (isNext) {
                    _data.push({
                        timestamp: new Date(dayjs(res[i].timestamp).startOf(_span).unix() * 1000),
                        value: res[i].value
                    })
                } else {
                    const difference = dayjs(res[i].timestamp).startOf(_span).diff(last.timestamp, _span)

                    for (let j = 1; j <= difference; j++) {
                        const nextDay = new Date(dayjs(last.timestamp).startOf(_span).add(1, _span).startOf(_span).unix() * 1000)

                        _data.push({
                            timestamp: nextDay,
                            value:
                                type === ChartType.VOLUME
                                    ? dayjs(nextDay)
                                        .startOf(_span)
                                        .isSame(dayjs(new Date(res[i].timestamp)).startOf(_span))
                                        ? res[i].value
                                        : 0
                                    : last.value
                        })

                        last = _data[_data.length - 1]
                    }
                }
                last = res[i]
            }

            if (lastRealDay < lastAdditionalDay) {
                for (let i = lastRealDay.add(1, _span).unix(); i <= lastAdditionalDay.unix(); i += span === ChartSpan.DAY ? 3600 : 24 * 3600) {
                    _data.push({
                        timestamp: new Date(i * 1000),
                        value: type === ChartType.VOLUME ? 0 : res[res.length - 1].value
                    })
                }
            }
        } else {
            _data = [...res]
        }

        return [..._data]
    }, [data, previousData])

    const xScale = useMemo(() => scaleTime()
            // @ts-ignore
            .domain([min(_chartData, (d) => new Date(d.timestamp)), max(_chartData, (d) => new Date(d.timestamp))])
            .range([0, width]),
        [span, _chartData])

    const yScale = useMemo(() => scaleLinear()
            // @ts-ignore
            .domain([min(_chartData, d => (d.value > 0 ? d.value - d.value * 0.2 : 0)), max(_chartData, d => +d.value + d.value * 0.2)])
            .range([height, 0]),
        [span, _chartData, token])


    const priceRects = useMemo(() => {
        const res: any[] = []
        for (const key in opened) {
            // if (selected.some(item => item !== key)) continue
            if (selected.some(item => item === key)) {
                const pos = opened[key]
                const _token0Range = pos.token0Range.sort((a, b) => a - b)
                const _token1Range = pos.token1Range.sort((a, b) => a - b)

                let token1Height = Math.abs(yScale(_token0Range[1]) - yScale(_token0Range[0]))
                let token0Height = yScale(_token1Range[0]) - yScale(_token1Range[1])

                let outOfChart = false


                if (token === ChartToken.TOKEN1) {
                    if (yScale(_token0Range[1]) < 0 && yScale(_token0Range[1]) + token1Height > height) {
                        console.log(height)
                        outOfChart = true
                        token1Height = height
                    } else if (yScale(_token0Range[1]) < 0) {
                        outOfChart = true
                        token1Height = token1Height - Math.abs(yScale(_token0Range[1]))
                    }
                }
                if (token === ChartToken.TOKEN0) {
                    console.log(yScale(_token1Range[1]))
                    if (yScale(_token1Range[1]) < 0 && yScale(_token1Range[1]) + token0Height > height) {
                        outOfChart = true
                        token0Height = height
                    } else if (yScale(_token1Range[1]) < 0) {
                        outOfChart = true
                        token0Height = token0Height - Math.abs(yScale(_token1Range[1]))
                    } else if (yScale(_token1Range[1]) + token0Height > height) {
                        outOfChart = true
                        token0Height = token0Height - (yScale(_token1Range[1]) + token0Height - height)
                    }
                }

                const rect = create('svg:rect')
                    .append('rect')
                    .attr('id', `pos-${key}`)
                    .attr('width', xScale(+pos.startTime * 1000) < 0 ? width : width - xScale(+pos.startTime * 1000))
                    .attr('height', token === ChartToken.TOKEN1 ? token1Height : token0Height)
                    .attr('fill', stringToColour(key).background)
                    .attr('y', token === ChartToken.TOKEN1 ? (outOfChart ? 0 : yScale(_token0Range[1])) : (outOfChart ? 0 : yScale(_token1Range[1])))
                    .attr('x', xScale(+pos.startTime * 1000) < 0 ? 0 : xScale(+pos.startTime * 1000))
                    .style('opacity', '0.1')
                res.push(rect)
            }
        }

        for (const key in closed) {
            // if (selected.some(item => item !== key)) continue
            if (selected.some(item => item === key)) {
                const pos = closed[key]

                if (!pos.endTime) return

                const _token0Range = pos.token0Range.sort((a, b) => a - b)
                const _token1Range = pos.token1Range.sort((a, b) => a - b)

                let token1Height = Math.abs(yScale(_token0Range[1]) - yScale(_token0Range[0]))
                let token0Height = yScale(_token1Range[0]) - yScale(_token1Range[1])
                let widthPos = (xScale(+pos.endTime * 1000) - xScale(+pos.startTime * 1000)) - Math.abs(xScale(+pos.startTime * 1000))

                let outOfChart = false

                if (token === ChartToken.TOKEN1) {
                    if (yScale(_token0Range[1]) < 0) {
                        outOfChart = true
                        token1Height = token1Height - Math.abs(yScale(_token0Range[1]))
                    }
                } else {
                    if (yScale(_token1Range[1]) + token0Height > height) {
                        outOfChart = true
                        token0Height = token0Height - (yScale(_token1Range[1]) + token0Height - height)
                    }
                }


                if (span === ChartSpan.WEEK || span === ChartSpan.MONTH) {
                    let widthDif = 0
                    if (xScale(+pos.endTime * 1000) > width) {
                        widthDif = (xScale(+pos.endTime * 1000) - width)
                    }
                    widthPos = (xScale(+pos.endTime * 1000) - xScale(+pos.startTime * 1000)) - widthDif
                }

                const rect = create('svg:rect')
                    .append('rect')
                    .attr('id', `pos-${key}`)
                    .attr('width', widthPos)
                    .attr('height', `${token === ChartToken.TOKEN1 ? token1Height : token0Height}`)
                    .attr('fill', 'black')
                    .attr('y', token === ChartToken.TOKEN1 ? (outOfChart ? 0 : yScale(_token0Range[1])) : yScale(_token1Range[1]))
                    .attr('x', xScale(+pos.startTime * 1000) < 0 ? 0 : xScale(+pos.startTime * 1000))
                    .style('opacity', '0.4')
                res.push(rect)
            }
        }
        return res
    }, [closed, opened, token, yScale, _chartData, selected])

    const pricesRangesGroup = create('svg:g')
        .style('pointer-events', 'none')


    const Line = create('svg:line')
        .attr('id', 'pointer2')
        .attr('x1', '0px')
        .attr('y1', '0px')
        .attr('x2', '0px')
        .attr('y2', height)
        .style('stroke-width', 1)
        .style('stroke-dasharray', '5, 5')
        .style('stroke', 'var(--primary)')
        .style('display', 'none')

    const LineHorizontal = create('svg:line')
        .attr('id', 'pointer3')
        .attr('x1', '0px')
        .attr('y1', 0)
        .attr('x2', width)
        .attr('y2', 0)
        .style('stroke-width', 1)
        .style('stroke-dasharray', '5, 5')
        .style('stroke', 'var(--primary)')
        .style('display', 'none')

    const InfoRectGroup = create('svg:g')
        .style('pointer-events', 'none')
        .style('display', 'none')

    const InfoRect = create('svg:rect')
        .append('rect')
        .attr('id', 'info-label')
        .attr('width', `${type === ChartType.PRICE ? '190px' : '160px'}`)
        .attr('height', '68px')
        .attr('rx', '12')
        .style('fill', 'var(--primary)')

    const InfoRectFeeText = create('svg:text')
        .attr('transform', `translate(${type === ChartType.PRICE ? '95' : '80'}, 25)`)
        .attr('fill', 'white')
        .attr('text-anchor', 'middle')
        .attr('alignment-baseline', 'central')
        .attr('font-size', '22px')

    const InfoRectDateText = create('svg:text')
        .attr('transform', 'translate(80, 50)')
        .attr('fill', 'white')
        .attr('text-anchor', 'middle')
        .attr('alignment-baseline', 'central')
        .attr('font-size', '12px')

    if (InfoRectGroup) {
        // @ts-ignore
        InfoRectGroup.node().append(InfoRect.node())
        // @ts-ignore
        InfoRectGroup.node().append(InfoRectFeeText.node())
        // @ts-ignore
        InfoRectGroup.node().append(InfoRectDateText.node())
    }

    const Focus = create('svg:circle')
        .style('fill', 'white')
        .attr('stroke', 'var(--primary)')
        .attr('stroke-width', '2')
        .attr('r', 5.5)
        .style('opacity', 1)
        .style('display', 'none')


    useEffect(() => {
        if (!data || data.length === 0) return

        const svgEl = select(svgRef.current)
        svgEl.selectAll('*').remove()

        const svg = svgEl
            .append('g')
            .attr('transform', `translate(${margin.left}, ${margin.top})`)


        svg
            .on('mouseenter', () => {
                Line.style('display', 'block')
                LineHorizontal.style('display', 'block')
                InfoRectGroup.style('display', 'block')
                Focus.style('display', 'block')
            })

        svg
            .on('mouseleave', () => {
                Line.style('display', 'none')
                LineHorizontal.style('display', 'none')
                InfoRectGroup.style('display', 'none')
                Focus.style('display', 'none')
            })

        svg
            .on('tap', () => {
                Line.style('display', 'block')
                LineHorizontal.style('display', 'block')
                InfoRectGroup.style('display', 'block')
                Focus.style('display', 'block')
            })

        const xAxisGroup = svg
            .append('g')
            .attr('transform', `translate(0, ${height})`)
            .call(axisBottom(xScale).ticks(xTicks).tickSizeOuter(0))
        xAxisGroup.selectAll('line').attr('stroke', 'rgba(255, 255, 255, 0)').attr('id', 'xline')
        xAxisGroup.selectAll('text').attr('opacity', 0.5).attr('color', 'white').attr('font-size', '0.75rem')

        const yAxisGroup = svg.append('g').call(
            axisLeft(yScale)
                .ticks(10)
                .tickFormat((val) => `${type === ChartType.FEES ? `${val}%` : type === ChartType.PRICE ? `${val}` : `$${val >= 1000 ? `${+val / 1000}k` : val}`}`)
                .tickSize(-width)
        )

        yAxisGroup.selectAll('line').attr('stroke', 'var(--mirage)').attr('id', 'xline')
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
                    color: 'var(--primary-hover)'
                },
                {
                    offset: '100%',
                    color: 'transparent'
                }
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
            .attr('stroke', 'var(--primary)')
            .attr('stroke-width', 2)
            // @ts-ignore
            .attr('d', line()
                .curve(curveBumpX)
                .x(function(d) {
                    // @ts-ignore
                    return xScale(d.timestamp)
                })
                .y(function(d) {
                    // @ts-ignore
                    return yScale(d.value)
                })
            )
            .transition()
            .duration(1000)
            .ease(easeCircleOut)
            .attrTween('stroke-dasharray', function() {
                const length = this.getTotalLength()
                return interpolate(`0,${length}`, `${length},${length}`)
            })

        svg
            .append('path')
            .datum(_chartData)
            .attr('fill', 'url(#gradient)')
            // @ts-ignore
            .attr('d', area()
                .curve(curveBumpX)
                // @ts-ignore
                .x((d) => xScale(d.timestamp))
                // @ts-ignore
                .y0((d) => yScale(min(_chartData, (d) => (d.value > 0 ? d.value - d.value * 0.2 : 0))))
                // @ts-ignore
                .y1((d) => yScale(d.value))
            )
            .style('opacity', 0)
            .transition()
            .delay(900)
            .duration(500)
            .ease(easeCircleOut)
            .style('opacity', 1)

        xAxisGroup
            .selectAll('.tick')
            .nodes()
            .map((el, i) => {
                // @ts-ignore
                const xTranslate = select(el)
                    .attr('transform')
                    .match(/\((.*?)\)/)[1]
                    .split(',')[0]

                if (isMobile && span !== ChartSpan.WEEK) {
                    select(el)
                        .selectAll('text')
                        .style('text-anchor', 'end')
                        .attr('dx', '-.8em')
                        .attr('dy', '.15em')
                        .attr('transform', 'rotate(-65)')
                }

                if (isMobile && i % 2 === 0) {
                    select(el).attr('display', 'none')
                } else if (i % 2 === 0 && span !== ChartSpan.WEEK) {
                    select(el).attr('display', 'none')
                }

                const hoverHandle = function(e: any) {
                    const isOverflowing = Number(xTranslate) + 150 + 16 > dimensions.width
                    const date = new Date(_chartData[i]?.timestamp)
                    Line.attr('x1', `${xTranslate}px`).attr('x2', `${xTranslate}px`)
                    //@ts-ignore
                    LineHorizontal.attr('y1', `${yScale(_chartData[i]?.value)}px`).attr('y2', `${yScale(_chartData[i]?.value)}px`)
                    //@ts-ignore
                    InfoRectGroup.attr('transform', `translate(${isOverflowing ? Number(xTranslate) - 150 - 16 : Number(xTranslate) - (type === ChartType.PRICE ? 95 : 80)},${yScale(_chartData[i]?.value) - 68})`)
                    InfoRectFeeText.property('innerHTML', `
                        ${type === ChartType.PRICE || type === ChartType.FEES ? '' : '$'}
                        ${Number(_chartData[i]?.value).toFixed(type === ChartType.FEES ? 3 : type === ChartType.PRICE ? 5 : 2)}
                        ${type === ChartType.FEES ? '%' : type === ChartType.PRICE ? `${token === ChartToken.TOKEN0 ? token0 : token1}` : ''}`
                    )
                    InfoRectDateText.property('innerHTML', `${convertLocalDate(date)} ${span === ChartSpan.DAY ? convertDateTime(date) : ''}`)
                    // @ts-ignore
                    Focus.attr('transform', `translate(${xScale(_chartData[i].timestamp)},${yScale(_chartData[i]?.value)})`)
                }

                const rect = create('svg:rect')
                    .attr('x', `${+xTranslate - tickWidth / 2}px`)
                    .attr('y', `-${0}px`)
                    .attr('width', `${tickWidth}px`)
                    .attr('height', `${dimensions.height}px`)
                    .attr('fill', 'transparent')
                    .on('mouseover', hoverHandle)
                    .on('touchmove', hoverHandle)

                // @ts-ignore
                svg.node().append(rect.node())
            })

        priceRects?.forEach(item => {
            pricesRangesGroup.node()?.append(item.node())
        })
        svg.append(() => Line.node())
        svg.append(() => LineHorizontal.node())
        svg.append(() => pricesRangesGroup.node())
        svg.append(() => InfoRectGroup.node())
        svg.append(() => Focus.node())
    }, [data, selected])

    return <svg ref={svgRef} style={{ overflow: 'visible' }} width={svgWidth} height={svgHeight} />
}
