import * as d3 from 'd3'
import {useEffect, useMemo, useRef} from 'react'
import dayjs from "dayjs";

interface BrushProps {
    width: number
    focusHeight: number
    data: any[]
    margin: any
    X: any
    updateChartData: any
}

export default function Brush({data, focusHeight, width, margin, updateChartData, X}: BrushProps) {
    const focusRef = useRef(null)

    const tiks = useMemo(() => {
        const min = d3.min(data, d => new Date(d.date).getTime())
        const current = new Date().getTime()
        return Math.ceil((current - min) / (1000 * 60 * 60 * 24))
    }, [])

    useEffect(() => {
        const focusEl = d3.select(focusRef.current)
        focusEl.selectAll('*').remove()

        const focus = focusEl
            .attr('viewBox', [0, 0, width, focusHeight])
            .style('display', 'block')

        const focusLine = (x, y) => d3.line()
            .defined(d => !isNaN(d.value))
            .curve(d3.curveBumpX)
            .x(d => x(new Date(d.date)))
            .y(d => y(d.value))

        const focusX = d3.scaleUtc()
            .domain([d3.min(data, d => new Date(d.date)), Date.now()])
            .range([margin.left, width])

        const focusY = d3.scaleLinear()
            .domain([0, d3.max(data, d => +d.value)])
            .range([focusHeight - margin.bottom, margin.top])

        const focusXAxis = (g, x, height) => g
            .attr('transform', `translate(0,${height - margin.bottom})`)
            // .call(d3.axisBottom(x).ticks(tiks).tickSizeOuter(0))
            // .selectAll('.tick')
            // .nodes()
            // .map((el, i) => {
            //     if (i % 2 !== 0) {
            //         d3.select(el).attr('display', 'none')
            //     }
            // })

        const focusYAxis = (g, y, title) => g
            .attr('transform', `translate(${margin.left},0)`)
            .call(d3.axisLeft(y))
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
            .attr('stroke', '#63c0f8')
            .attr('stroke-width', 1)
            .attr('d', focusLine(focusX, focusY.copy().range([focusHeight - margin.bottom, 4])))

        const brush = d3.brushX()
            .extent([[margin.left, 0.5], [width - margin.right, focusHeight - margin.bottom + 0.5]])
            .on('brush', brushed)
            .on('end', brushended)

        const defaultSelection = [focusX(X[X.length - (Math.round(((X.length / 100) * 25)) === 0 ? 2 : Math.round(((X.length / 100) * 25)))]), focusX.range()[1] - margin.right]

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

        function brushed({selection}) {
            if (selection) {
                const div = Math.round(870 / X.length)
                const minX = Math.floor(selection[0] / div)
                const maxX = Math.floor(selection[1] / div)

                updateChartData([data[minX]?.date, data[maxX]?.date === undefined ? data[maxX -1]?.date : data[maxX]?.date])

                focus.property('value', selection.map(focusX.invert, focusX).map(d3.utcDay.round))
                focus.dispatch('input')
            }
        }

        function brushended({selection}) {
            if (!selection) {
                gb.call(brush.move, defaultSelection)
                return
            }
        }
    }, [data])


    return (
        <svg ref={focusRef} width={width} height={focusHeight}/>
    )
}