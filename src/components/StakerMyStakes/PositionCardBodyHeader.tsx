import React from 'react'
import { FarmingType } from '../../models/enums'

interface PositionCardBodyHeaderProps {
    farmingType: number
    date: string
    eternalFarming?: any
    enteredInEternalFarming?: any

}

export default function PositionCardBodyHeader({ farmingType, date, enteredInEternalFarming, eternalFarming }: PositionCardBodyHeaderProps) {
    return (
        <div className={'flex-s-between b mb-1 fs-125'}>
            {farmingType === FarmingType.FINITE ? 'Limit ' : 'Infinite '} Farming
            {farmingType === FarmingType.ETERNAL && enteredInEternalFarming && eternalFarming && (
                <span className={'fs-085 l'}>
                        <span>Entered at: </span>
                        <span>{date.slice(0, -3)}</span>
                    </span>
            )}
        </div>
    )
};
