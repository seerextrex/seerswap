import styled, { css } from 'styled-components/macro'
import { lighten } from 'polished'

export const ToolbarWrapper = styled.div`
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
export const ToolbarChartTypeWrapper = styled.div`
  ${({ theme }) => theme.mediaWidth.upToSmall`
  &:first-of-type {
    margin-bottom: 1rem;
  }
`}
`
export const ToolbarOptionsTitle = styled.div`
  margin-bottom: 1rem;
  font-weight: 500;
`
export const ToolbarOptions = styled.ul`
  margin: 0;
  padding: 0;
`
export const ToolbarOptionsItem = styled.li<{ selected: boolean }>`
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

  ${({ theme }) => theme.mediaWidth.upToSmall`
    margin-bottom: 10px;
  `}
`
