import React from 'react'
import { Trans } from '@lingui/macro'
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
        <div>
            <div className={'mb-05'}>
                <Trans>{item.title}</Trans>
            </div>
            <Toggle
                isActive={!item.checkValue}
                toggle={() => item.method(!item.checkValue)}
                checked={<Trans>Show</Trans>}
                unchecked={<Trans>Hide</Trans>}
            />
        </div>
    )
}


export default FilterPanelItem
