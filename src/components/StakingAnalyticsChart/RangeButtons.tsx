import React from 'react'
import styled, {css} from "styled-components/macro"
import {lighten} from "polished"

const buttonsData = [
    {title: 'Day'},
    {title: 'Week'},
    {title: 'Month'},
    {title: 'All'}
]

const RangeButtonsWrapper = styled.ul`
  padding: 0;
`

const ToolbarOptionsItem = styled.li`
  display: inline-flex;
  padding: 6px 10px;
  border-radius: 6px;
  background-color: #202635;
  user-select: none;
  cursor: pointer;
  margin-right: 8px;

  &:last-of-type {
    margin-right: 0;
  }

  ${({selected}) =>
          selected &&
          css`
            background-color: #2a87d9;
            cursor: default;
          `}
  ${({theme}) => theme.mediaWidth.upToSmall`
    margin-bottom: 10px;
  `}
`


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