import PositionListItem from 'components/PositionListItem'
import React, { useMemo } from 'react'
import { Trans } from '@lingui/macro'
import { DesktopHeader, MobileHeader } from './styled'
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
            <DesktopHeader>
                <div>
                    <Trans>Your positions</Trans>
                    {positions && ' (' + positions.length + ')'}
                </div>
                <div>
                    <Trans>Status</Trans>
                </div>
            </DesktopHeader>
            <MobileHeader>
                <Trans>Your positions</Trans>
            </MobileHeader>
            {_positionsOnFarming.map((p) => {
                return <PositionListItem key={p.tokenId.toString()} positionDetails={p} />
            })}
            {_positions.map((p) => {
                return <PositionListItem key={p.tokenId.toString()} positionDetails={p} />
            })}
        </>
    )
}
