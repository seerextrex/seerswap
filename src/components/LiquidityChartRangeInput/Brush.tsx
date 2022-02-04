import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { BrushBehavior, brushX, D3BrushEvent, ScaleLinear, select } from 'd3'
import usePrevious from 'hooks/usePrevious'
import { LabelGroup, Tooltip, TooltipBackground } from './styled'

// flips the handles draggers when close to the container edges
const FLIP_HANDLE_THRESHOLD_PX = 20

// margin to prevent tick snapping from putting the brush off screen
const BRUSH_EXTENT_MARGIN_PX = 2

const compare = (a1: [number, number], a2: [number, number]): boolean => a1[0] !== a2[0] || a1[1] !== a2[1]

export const Brush = ({
    id,
    xScale,
    interactive,
    brushLabelValue,
    brushExtent,
    setBrushExtent,
    innerWidth,
    innerHeight,
    westHandleColor,
    eastHandleColor
}: {
    id: string
    xScale: ScaleLinear<number, number>
    interactive: boolean
    brushLabelValue: (d: 'w' | 'e', x: number) => string
    brushExtent: [number, number]
    setBrushExtent: (extent: [number, number]) => void
    innerWidth: number
    innerHeight: number
    westHandleColor: string
    eastHandleColor: string
}) => {
    const brushRef = useRef<SVGGElement | null>(null)
    const brushBehavior = useRef<BrushBehavior<SVGGElement> | null>(null)

    // only used to drag the handles on brush for performance
    const [localBrushExtent, setLocalBrushExtent] = useState<[number, number] | null>(brushExtent)
    const [showLabels, setShowLabels] = useState(false)
    const [hovering, setHovering] = useState(false)

    const previousBrushExtent = usePrevious(brushExtent)

    const brushed = useCallback(
        ({ type, selection }: D3BrushEvent<unknown>) => {
            if (!selection) {
                setLocalBrushExtent(null)
                return
            }

            const scaled = (selection as [number, number]).map(xScale.invert) as [number, number]

            // avoid infinite render loop by checking for change
            if (type === 'end' && compare(brushExtent, scaled)) {
                setBrushExtent(scaled)
            }

            setLocalBrushExtent(scaled)
        },
        [xScale, brushExtent, setBrushExtent]
    )

    // keep local and external brush extent in sync
    // i.e. snap to ticks on bruhs end
    useEffect(() => {
        setLocalBrushExtent(brushExtent)
    }, [brushExtent])

    // initialize the brush
    useEffect(() => {
        if (!brushRef.current) return

        brushBehavior.current = brushX<SVGGElement>()
            .extent([
                [Math.max(0 + BRUSH_EXTENT_MARGIN_PX, xScale(0)), 0],
                [innerWidth - BRUSH_EXTENT_MARGIN_PX, innerHeight]
            ])
            .handleSize(30)
            .filter(() => interactive)
            .on('brush end', brushed)

        brushBehavior.current(select(brushRef.current))

        if (previousBrushExtent && compare(brushExtent, previousBrushExtent)) {
            select(brushRef.current)
                .transition()
                .call(brushBehavior.current.move as any, brushExtent.map(xScale))
        }

        // brush linear gradient
        select(brushRef.current).selectAll('.selection').attr('stroke', 'none').attr('fill', 'none')
        // .attr('fill', `url(#${id}-gradient-selection)`)
    }, [brushExtent, brushed, id, innerHeight, innerWidth, interactive, previousBrushExtent, xScale])

    // respond to xScale changes only
    useEffect(() => {
        if (!brushRef.current || !brushBehavior.current) return

        brushBehavior.current.move(select(brushRef.current) as any, brushExtent.map(xScale) as any)
    }, [brushExtent, xScale])

    // show labels when local brush changes
    useEffect(() => {
        setShowLabels(true)
        const timeout = setTimeout(() => setShowLabels(false), 1500)
        return () => clearTimeout(timeout)
    }, [localBrushExtent])

    // variables to help render the SVGs
    const flipWestHandle = localBrushExtent && xScale(localBrushExtent[0]) > FLIP_HANDLE_THRESHOLD_PX
    const flipEastHandle = localBrushExtent && xScale(localBrushExtent[1]) > innerWidth - FLIP_HANDLE_THRESHOLD_PX

    const showWestArrow = localBrushExtent && (xScale(localBrushExtent[0]) < 0 || xScale(localBrushExtent[1]) < 0)
    const showEastArrow =
        localBrushExtent && (xScale(localBrushExtent[0]) > innerWidth || xScale(localBrushExtent[1]) > innerWidth)

    const westHandleInView =
        localBrushExtent && xScale(localBrushExtent[0]) >= 0 && xScale(localBrushExtent[0]) <= innerWidth
    const eastHandleInView =
        localBrushExtent && xScale(localBrushExtent[1]) >= 0 && xScale(localBrushExtent[1]) <= innerWidth

    return useMemo(
        () => (
            <>
                <defs>
                    <linearGradient id={`${id}-gradient-selection`} x1='0%' y1='100%' x2='100%'
                                    y2='100%'>
                        <stop stopColor={westHandleColor} />
                        <stop stopColor={eastHandleColor} offset='1' />
                    </linearGradient>

                    {/* clips at exactly the svg area */}
                    <clipPath id={`${id}-brush-clip`}>
                        <rect x='0' y='0' width={innerWidth} height={innerHeight} />
                    </clipPath>
                </defs>

                {/* will host the d3 brush */}
                <g
                    ref={brushRef}
                    clipPath={`url(#${id}-brush-clip)`}
                    onMouseEnter={() => setHovering(true)}
                    onMouseLeave={() => setHovering(false)}
                />

                {/* custom brush handles */}
                {localBrushExtent && (
                    <>
                        {/* west handle */}
                        <g transform={`translate(${Math.max(0, xScale(localBrushExtent[0]))}, 0)`}>
                            <svg width={xScale(localBrushExtent[1]) - xScale(localBrushExtent[0])}>
                                <line
                                    stroke='#267cc1'
                                    strokeWidth='3'
                                    x1='0'
                                    x2={xScale(localBrushExtent[1])}
                                    y1={innerHeight - 2}
                                    y2={innerHeight - 2}
                                ></line>
                            </svg>
                        </g>

                        {westHandleInView ? (
                            <g
                                transform={`translate(${Math.max(0, xScale(localBrushExtent[0])) + 7}, ${innerHeight - 9}), scale(${
                                    flipWestHandle ? '-1' : '1'
                                }, 1)`}
                            >
                                <g style={{ userSelect: 'none', pointerEvents: 'none' }}>
                                    {/* <Handle color={westHandleColor} d={brushHandlePath(innerHeight)} />
                  <HandleAccent d={brushHandleAccentPath()} /> */}
                                    <path
                                        d='M12.5 7C12.5 10.0376 10.0376 12.5 7 12.5C3.96243 12.5 1.5 10.0376 1.5 7C1.5 3.96243 3.96243 1.5 7 1.5C10.0376 1.5 12.5 3.96243 12.5 7Z'
                                        fill='white'
                                        stroke='#267cc1'
                                        strokeWidth='3'
                                    />
                                    <line x1={7} x2={7} y1={0} y2={-innerHeight} stroke='#267cc1'
                                          strokeWidth='2'></line>
                                </g>

                                <LabelGroup
                                    visible={true}
                                    transform={`translate(0,${-innerHeight + 30}), scale(${flipWestHandle ? '1' : '-1'}, 1)`}
                                >
                                    <TooltipBackground y='0' x='12' height='15' width='30' rx='4' />
                                    <Tooltip y='8' x='-27' transform={`scale(-1, 1)`}
                                             dominantBaseline='middle'>
                                        {brushLabelValue('e', localBrushExtent[0])}
                                    </Tooltip>
                                </LabelGroup>
                            </g>
                        ) : null}

                        {/* east handle */}
                        {eastHandleInView ? (
                            <g
                                transform={`translate(${xScale(localBrushExtent[1]) - 7}, ${innerHeight - 9}), scale(${
                                    flipEastHandle ? '-1' : '1'
                                }, 1)`}
                            >
                                <g style={{ userSelect: 'none', pointerEvents: 'none' }}>
                                    {/* <Handle color={eastHandleColor} d={brushHandlePath(innerHeight)} />
                  <HandleAccent d={brushHandleAccentPath()} /> */}
                                    <path
                                        d='M12.5 7C12.5 10.0376 10.0376 12.5 7 12.5C3.96243 12.5 1.5 10.0376 1.5 7C1.5 3.96243 3.96243 1.5 7 1.5C10.0376 1.5 12.5 3.96243 12.5 7Z'
                                        fill='white'
                                        stroke='#267cc1'
                                        strokeWidth='3'
                                    />
                                    <line x1={7} x2={7} y1={0} y2={-innerHeight} stroke='#267cc1'
                                          strokeWidth='2'></line>
                                </g>

                                <LabelGroup
                                    transform={`translate(0,${-innerHeight + 30}), scale(${flipEastHandle ? '-1' : '1'}, 1)`}
                                    visible={true}
                                >
                                    <TooltipBackground y='0' x='12' height='15' width='30' rx='4' />
                                    <Tooltip y='8' x='27' dominantBaseline='middle'>
                                        {brushLabelValue('e', localBrushExtent[1])}
                                    </Tooltip>
                                </LabelGroup>
                            </g>
                        ) : null}

                        {/* {showWestArrow && <OffScreenHandle color={westHandleColor} />}

            {showEastArrow && (
              <g transform={`translate(${innerWidth}, 0) scale(-1, 1)`}>
                <OffScreenHandle color={eastHandleColor} />
              </g>
            )} */}
                    </>
                )}
            </>
        ),
        [
            brushLabelValue,
            eastHandleColor,
            eastHandleInView,
            flipEastHandle,
            flipWestHandle,
            hovering,
            id,
            innerHeight,
            innerWidth,
            localBrushExtent,
            showEastArrow,
            showLabels,
            showWestArrow,
            westHandleColor,
            westHandleInView,
            xScale
        ]
    )
}
