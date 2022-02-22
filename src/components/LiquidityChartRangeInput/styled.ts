import styled from 'styled-components/macro'
import { ButtonGray } from '../Button'

//index
export const ChartWrapper = styled.div`
  position: relative;
  justify-content: center;
  align-content: center;
`

//Area
export const Path = styled.path<{ fill: string | undefined }>`
  opacity: 0.5;
  stroke: ${({ fill }) => fill ?? '#4B4B4B'};
  fill: ${({ fill }) => fill ?? '#4B4B4B'};
`

//AxisBottom
export const StyledGroup = styled.g`
  line {
    display: none;
  }

  text {
    color: ${({ theme }) => theme.text2};
    transform: translateY(5px);
    font-family: Montserrat, sans-serif;
  }
`

//Brush
export const LabelGroup = styled.g<{ visible: boolean }>`
  opacity: ${({ visible }) => (visible ? '1' : '0')};
  transition: opacity 300ms;
`
export const TooltipBackground = styled.rect`
  fill: ${({ theme }) => '#3f3f40'};
`
export const Tooltip = styled.text`
  text-anchor: middle;
  font-size: 9px;
  font-family: Montserrat, sans-serif;
  fill: ${({ theme }) => theme.text1};
`

//Line
export const StyledLine = styled.line`
  opacity: 0.5;
  stroke-width: 1;
  stroke: white;
  fill: none;
`

//Zoom
export const Wrapper = styled.div<{ count: number }>`
  display: grid;
  grid-template-columns: repeat(${({ count }) => count.toString()}, 1fr);
  grid-gap: 6px;
  position: absolute;
  background-color: #2026356b;
  border-radius: 4px;
  top: 0;
  right: 0;
`
export const Button = styled(ButtonGray)`
  &:hover {
    background-color: transparent;
  }
  width: 32px;
  height: 32px;
  padding: 4px;
  background-color: transparent;
`
export const ZoomOverlay = styled.rect`
  fill: transparent;
  cursor: grab;

  &:active {
    cursor: grabbing;
  }
`
