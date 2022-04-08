import React from 'react'
import './index.scss'

const buttonsData = [
    { title: 'Day' },
    { title: 'Week' },
    { title: 'Month' },
    { title: 'All' }
]

const RangeButtons = ({ setSpan, span }: { setSpan: any, span: string }) => {
    return (
        <ul className={'flex-center'}>
            {
                buttonsData.map((item, i) =>
                    <li className={'stacking-chart-card__buttons mr-05 br-8 pv-025 ph-05'} key={i} onClick={() => {
                        setSpan(item.title)
                    }} data-selected={span === item.title}>
                        {item.title}
                    </li>)
            }
        </ul>
    )
}
export default RangeButtons
