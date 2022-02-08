import {
    axisLeft,
    brushX,
    curveBumpX,
    line,
    max,
    min,
    scaleLinear,
    scaleUtc,
    select,
    utcDay
} from 'd3'
import { useEffect, useRef } from 'react'

interface BrushProps {
    width: number
    focusHeight: number
    data: any[]
    data2?: any[]
    colors: string[]
    margin: any
    X: any
    updateChartData: any
}

export default function Brush({
    data,
    data2,
    colors,
    focusHeight,
    width,
    margin,
    updateChartData,
    X
}: BrushProps) {
    const focusRef = useRef(null)

    useEffect(() => {
        const focusEl = select(focusRef.current)
        focusEl.selectAll('*').remove()

        const focus = focusEl
            .attr('viewBox', [0, 0, width, focusHeight])
            .style('display', 'block')

        const focusLine = (x, y) => line()
            .defined(d => !isNaN(d.value))
            .curve(curveBumpX)
            .x(d => x(new Date(d.date)))
            .y(d => y(d.value))

        const focusX = scaleUtc()
            .domain([min(data, d => new Date(d.date)), Date.now()])
            .range([margin.left, width])

        const focusY = scaleLinear()
            .domain([0, max(data, d => +d.value)])
            .range([focusHeight - margin.bottom, margin.top])

        const focusLine2 = (x, y) => line()
            .defined(d => !isNaN(d.value))
            .curve(curveBumpX)
            .x(d => x(new Date(d.date)))
            .y(d => y(d.value))

        const focusX2 = scaleUtc()
            .domain([min(data, d => new Date(d.date)), Date.now()])
            .range([margin.left, width])

        const focusY2 = scaleLinear()
            .domain([0, max(data, d => +d.value)])
            .range([focusHeight - margin.bottom, margin.top])

        const focusXAxis = (g, x, height) => g
            .attr('transform', `translate(0,${height - margin.bottom})`)

        const focusYAxis = (g, y, title) => g
            .attr('transform', `translate(${margin.left},0)`)
            .call(axisLeft(y))
            .call(g => g.select('.domain').remove())
            .call(g => g.selectAll('.title').data([title]).join('text')
                .attr('class', 'title')
                .attr('x', -margin.left)
                .attr('y', 10)
                .attr('fill', 'currentColor')
                .attr('text-anchor', 'start')
                .text(title))

        focus.append('g')
            .call(focusXAxis, focusX, focusHeight)

        focus.append('path')
            .datum(data)
            .attr('fill', 'none')
            .attr('stroke', colors[0])
            .attr('stroke-width', 1)
            .attr('d', focusLine(focusX, focusY.copy().range([focusHeight - margin.bottom, 4])))

        if (data2) {
            focus.append('path')
                .datum(data2)
                .attr('fill', 'none')
                .attr('stroke', colors[1])
                .attr('stroke-width', 1)
                .attr('d', focusLine2(focusX2, focusY2.copy().range([focusHeight - margin.bottom, 4])))
        }

        const brush = brushX()
            .extent([[margin.left, 0.5], [width - margin.right, focusHeight - margin.bottom + 0.5]])
            .on('brush', brushed)
            .on('end', brushended)

        const defaultSelection = [focusX.range()[0], focusX.range()[1] - margin.right]

        const gb = focus.append('g')
            .call(brush)
            .call(brush.touchable, [1, 7])
            .call(brush.move, defaultSelection)


        const brushItem = gb
            .select('.selection')
            .attr('fill', '#000')
            .attr('stroke', 'none')
            .attr('rx', '5')
            .attr('ry', '5')

        function brushed({ selection }) {
            if (selection) {
                focus.property('value', selection.map(focusX.invert, focusX).map(utcDay.round))
                focus.dispatch('input')
            }
        }

        function brushended({ selection }) {
            if (!selection) {
                gb.call(brush.move, defaultSelection)
                return
            }
            const div = Math.round(900 / X.length)
            const minX = Math.floor(selection[0] / div)
            const maxX = Math.floor(selection[1] / div)

            updateChartData([data[minX - 1]?.date === undefined ? data[minX]?.date : data[minX - 1]?.date, data[maxX]?.date === undefined ? data[maxX - 1]?.date : data[maxX]?.date])
        }
    }, [data, data2])


    return (
        <svg ref={focusRef} width={width} height={focusHeight} />
    )
}
