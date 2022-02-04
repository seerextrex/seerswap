import styled from 'styled-components/macro'
import { darken } from 'polished'

//index
export const Wrapper = styled.div`
  position: relative;
  width: 100%;
  padding: 1rem;
  margin-top: 1rem;
  border-radius: 10px;
  background-color: #052445;
  display: flex;
  align-items: center;
  justify-content: center;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    margin-left: -1.3rem;
    margin-right: -1.3rem;
    width: unset;
    display: flex;
    flex-direction: column;
    border-radius: 20px;
  `}
`
export const MockLoading = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 360px;
  padding: 0 16px;
  max-width: 1000px;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    width: 100%;
  `}
`
export const ZoomButtonsWrapper = styled.div`
  display: flex;
  position: absolute;
  right: 1rem;
  top: 1rem;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    position: static;
  `}
`
export const ZoomButton = styled.button`
  border-radius: 50%;
  border: none;
  width: 32px;
  height: 32px;
  background-color: #a9c6e6;
  color: #052445;
  font-weight: 700;
  &:last-of-type {
    margin-left: 10px;
  }

  &:not(:disabled) {
    &:hover {
      background-color: ${darken(0.1, '#a9c6e6')};
    }
  }

  &:disabled {
    opacity: 0.3;
  }
`

//BarChart
export const ChartSvg = styled.svg`
  overflow: visible;
  border-radius: 10px;
`
