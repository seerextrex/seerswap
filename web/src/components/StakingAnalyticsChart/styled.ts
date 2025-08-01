import styled, { css } from 'styled-components/macro'


//Page
export const StakingAnalyticsChartWrapper = styled.div`
  max-width: 1000px;
  width: 100%;
  background-color: #052445;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  margin: 1rem 0;
`

//Chart
export const ChartWrapper = styled.div`
  display: flex;
  flex-direction: column;
`

//RangeButtons
export const RangeButtonsWrapper = styled.ul`
  padding: 0;
`
export const ToolbarOptionsItem = styled.li<{selected?: boolean}>`
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

  ${({ selected }) =>
    selected &&
    css`
            background-color: #2a87d9;
            cursor: default;
          `}
  ${({ theme }) => theme.mediaWidth.upToSmall`
    margin-bottom: 10px;
  `}
`
