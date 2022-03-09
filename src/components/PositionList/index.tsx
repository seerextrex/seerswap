import PositionListItem from 'components/PositionListItem'
import React, { useMemo } from 'react'
import { Trans } from '@lingui/macro'
import { PositionPool } from '../../models/interfaces'

type PositionListProps = React.PropsWithChildren<{
    positions: PositionPool[]
}>

export default function PositionList({ positions }: PositionListProps) {
    const _positions = useMemo(() => {
        if (!positions) {
            return []
        }

        return positions.filter((position) => !position.onFarming)
    }, [positions])

    const _positionsOnFarming = useMemo(() => {
        if (!positions) {
            return []
        }

        return positions.filter((position) => position.onFarming)
    }, [positions])

    return (
        <>
            <div className={'flex-s-between w-100'}>
                <div>
                    <Trans>Your positions</Trans>
                    {positions && ' (' + positions.length + ')'}
                </div>
                <span className={'hide-xs'}>
                    <Trans>Status</Trans>
                </span>
            </div>
            {_positionsOnFarming.map((p) => {
                return <PositionListItem key={p.tokenId.toString()} positionDetails={p} />
            })}
            {_positions.map((p) => {
                return <PositionListItem key={p.tokenId.toString()} positionDetails={p} />
            })}
        </>
    )
}
