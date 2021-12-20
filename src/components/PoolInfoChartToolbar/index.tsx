import { useCallback, useContext, useEffect, useState } from 'react'
import styled, { css, ThemeContext } from 'styled-components/macro'
import { lighten } from 'polished'
import { ChartType } from '../../pages/PoolInfoPage'

const ToolbarWrapper = styled.div`
  width: 100%;
  padding: 1rem 0 0;
  display: flex;
  justify-content: space-between;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    flex-direction: column;
    &:first-of-type {
      margin-bottom: 1rem;
    }
  `}
`
const ToolbarChartTypeWrapper = styled.div`
  ${({ theme }) => theme.mediaWidth.upToSmall`
  &:first-of-type {
    margin-bottom: 1rem;
  }
`}
`

const ToolbarOptionsTitle = styled.div`
  margin-bottom: 1rem;
  font-weight: 500;
`

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

export default function PoolInfoChartToolbar({
  chartTypes,
  chartSpans,
  type,
  span,
  setType,
  setSpan,
}: {
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
        <ToolbarOptionsTitle>Chart type</ToolbarOptionsTitle>
        <ToolbarOptions>
          {chartTypes.map((el, i) => (
            <ToolbarOptionsItem selected={type === el.type} onClick={() => setType(el.type)} key={i}>
              {el.title}
            </ToolbarOptionsItem>
          ))}
        </ToolbarOptions>
      </ToolbarChartTypeWrapper>
      {type !== ChartType.LIQUIDITY && (
        <ToolbarChartTypeWrapper>
          <ToolbarOptionsTitle>Chart span</ToolbarOptionsTitle>
          <ToolbarOptions>
            {chartSpans.map((el, i) => (
              <ToolbarOptionsItem selected={span === el.type} onClick={() => setSpan(el.type)} key={i}>
                {el.title}
              </ToolbarOptionsItem>
            ))}
          </ToolbarOptions>
        </ToolbarChartTypeWrapper>
      )}
    </ToolbarWrapper>
  )
}
