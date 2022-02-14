import React from 'react'
import { Trans } from '@lingui/macro'
import { TYPE } from '../../theme'
import { FilterPanelItemWrapper } from './styleds'

interface FilterPanelProps {
    closedPositions: any
    setClosedPositions: any
    item: string
}

const FilterPanelItem = ({ closedPositions, setClosedPositions, item }: FilterPanelProps) => {
    return (
        <FilterPanelItemWrapper>
            <label>
                <TYPE.body>
                    <Trans>{item}</Trans>
                </TYPE.body>
            </label>
            <input
                type='checkbox'
                onChange={() => setClosedPositions(!closedPositions)}
                checked={!closedPositions}
            />
        </FilterPanelItemWrapper>
    )
}


export default FilterPanelItem
