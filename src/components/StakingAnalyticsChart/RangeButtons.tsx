import React from 'react'
import {RangeButtonsWrapper, ToolbarOptionsItem} from './styled'

const buttonsData = [
    {title: 'Day'},
    {title: 'Week'},
    {title: 'Month'},
    {title: 'All'}
]

const RangeButtons = ({setSpan, span} : {setSpan : any, span: string}) => {
    return (
        <RangeButtonsWrapper>
            {
                buttonsData.map((item, i) =>
                    <ToolbarOptionsItem key={i} onClick={() => {setSpan(item.title)}} selected={span === item.title}>
                        {item.title}
                    </ToolbarOptionsItem>)
            }
        </RangeButtonsWrapper>
    )
}
export default RangeButtons
