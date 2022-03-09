import React from 'react'
import { FarmingType } from '../../models/enums'
import './index.scss'

interface PositionCardBodyHeaderProps {
    farmingType: number
    date: string
    eternalFarming?: any
    enteredInEternalFarming?: any

}

export default function PositionCardBodyHeader({ farmingType, date, enteredInEternalFarming, eternalFarming }: PositionCardBodyHeaderProps) {
    return (
        <div className={`flex-s-between b mb-1 fs-125 ${farmingType === FarmingType.ETERNAL ? 'farming-card-header' : ''}`}>
            <span className={'w-100'}>{farmingType === FarmingType.FINITE ? 'Limit ' : 'Infinite '} Farming</span>
            {farmingType === FarmingType.ETERNAL && enteredInEternalFarming && eternalFarming && (
                <span className={'fs-085 l w-100'}>
                        <span>Entered at: </span>
                        <span>{date.slice(0, -3)}</span>
                    </span>
            )}
        </div>
    )
};
