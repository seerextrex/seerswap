import { useCallback, useEffect, useState } from 'react'
import styled, { css } from 'styled-components/macro'
import { lighten } from 'polished'

const ToolbarWrapper = styled.div`
  width: 100%;
  padding: 1rem 0 0;
  display: flex;
  justify-content: space-between;
`
const ToolbarChartTypeWrapper = styled.div``
const ToolbarOptions = styled.ul`
  margin: 0;
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

  &:hover {
    background-color: ${({ selected }) => !selected && lighten(0.05, '#202635')};
  }

  ${({ selected }) =>
    selected &&
    css`
      background-color: #2a87d9;
      cursor: default;
    `}
`


export default function PoolInfoChartToolbar({chartTypes, chartSpans, type, span, setType, setSpan} : {
  chartTypes: any
  chartSpans: any
  type: number
  span: number
  setType: any
  setSpan: any
}) {


  return (
    <ToolbarWrapper>
      <ToolbarChartTypeWrapper>
        <ToolbarOptions>
          {chartTypes.map((el, i) => (
            <ToolbarOptionsItem selected={type === el.type} onClick={() => setType(el.type)} key={i}>
              {el.title}
            </ToolbarOptionsItem>
          ))}
        </ToolbarOptions>
      </ToolbarChartTypeWrapper>
      <ToolbarChartTypeWrapper>
        <ToolbarOptions>
          {chartSpans.map((el, i) => (
            <ToolbarOptionsItem selected={span === el.type} onClick={() => setSpan(el.type)} key={i}>
              {el.title}
            </ToolbarOptionsItem>
          ))}
        </ToolbarOptions>
      </ToolbarChartTypeWrapper>
    </ToolbarWrapper>
  )
}
