import React from 'react'
import { Trans } from '@lingui/macro'
import { TYPE } from '../../theme'
import { FilterPanelItemWrapper } from './styleds'
import Toggle from '../../components/Toggle'

interface FilterPanelProps {
    item: {
        title: string
        method: (v: boolean) => void
        checkValue: boolean
    }
}

const FilterPanelItem = ({ item }: FilterPanelProps) => {

    return (
        <FilterPanelItemWrapper>
            <label>
                <TYPE.body>
                    <Trans>{item.title}</Trans>
                </TYPE.body>
            </label>
            <Toggle
                isActive={!item.checkValue}
                toggle={() => item.method(!item.checkValue)}
            />
        </FilterPanelItemWrapper>
    )
}


export default FilterPanelItem
