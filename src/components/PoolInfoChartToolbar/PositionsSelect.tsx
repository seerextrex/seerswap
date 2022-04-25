import React, { useEffect, useMemo, useState } from 'react'
import { PriceRangeChart } from '../../models/interfaces'

interface PositionsSelectProps {
    positions: {
        closed: PriceRangeChart | null
        opened: PriceRangeChart | null
    }
}

export default function PositionsSelect({ positions: { closed, opened } }: PositionsSelectProps) {

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
                start: closed[key].startTime
            })
        }
        return res
    }, [closed])

    return (
        <div>
            Opened
            {
                _opened.map(item =>
                    <div key={item.id}>{item.id} {item.start}</div>
                )
            }
            Closed
            {
                _closed.map(item =>
                    <div key={item.id}>{item.id} {item.start}</div>)
            }
        </div>
    )
};
