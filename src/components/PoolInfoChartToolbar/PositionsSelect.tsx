import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { PriceRangeChart } from '../../models/interfaces'
import { getPositionPeriod } from '../../utils/time'
import './index.scss'

interface PositionsSelectProps {
    positions: {
        closed: PriceRangeChart | null
        opened: PriceRangeChart | null
    }
    selected: string[]
    setSelected: (a: any) => void
}

export default function PositionsSelect({ positions: { closed, opened }, setSelected, selected }: PositionsSelectProps) {

    const _opened = useMemo(() => {
        const res = []
        for (const key in opened) {
            res.push({
                id: key,
                start: opened[key].startTime
            })
        }
        return res
    }, [opened])
    const _closed = useMemo(() => {
        const res = []
        for (const key in closed) {
            res.push({
                id: key,
                start: closed[key].startTime,
                end: closed[key].endTime
            })
        }
        return res
    }, [closed])

    // console.log(closed)

    const closeHandler = useCallback(e => {
        const target = e.target.control

        if (!target) return

        target.checked = false
    }, [])

    const updateSelect = (id: string) => {
        if (selected.some(el => el === id)) {
            const index = selected.indexOf(id)
            if (index > -1) {
                const temp = [...selected]
                temp.splice(index, 1)
                setSelected(temp)
            }
        } else {
            setSelected((prev: any) => [...prev, id])
        }
    }

    return (
        <div className={'positions-range-input'}>
            <input type='checkbox' id='positions' />
            <label
                htmlFor='positions'
                role={'button'}
                tabIndex={0}
                onBlur={closeHandler}
                className={'positions-range-input__label'}>
                <div className={'ph-1 br-8 pv-025'}>{selected.length === 0 ? 'Select Position' : selected.join(', ')}</div>
                <ul className={'positions-range-input__list'} onClick={(e) => e.preventDefault()}>
                    Opened
                    {
                        _opened.map(item =>
                            <li key={item.id} onClick={() => updateSelect(item.id)}>{item.id} {getPositionPeriod(item.start)}</li>
                        )
                    }
                    Closed
                    {
                        _closed.map(item =>
                            <li key={item.id} onClick={() => updateSelect(item.id)}>{item.id} {getPositionPeriod(item.start, item.end)}</li>)
                    }
                </ul>
            </label>
        </div>
    )
};
