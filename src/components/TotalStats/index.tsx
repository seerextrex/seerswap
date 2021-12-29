import { useState } from 'react'
import styled from 'styled-components/macro'

const TotalStatsTooltipWrapper = styled.div`
  width: 100%;
`

const TotalStatsBookmark = styled.button`
  width: 50px;
  height: 30px;
  display: flex;
  border-radius: 6px 6px 0 0;
  border: none;
`

const TotalStatsBody = styled.div`
  will-change: height;
  height: 0px;
  overflow: hidden;
  width: 100%;

  ${({ toggled }) =>
    toggled &&
    `
        height: 100px; 
    `}
`

export default function TotalStats() {
  const [toggled, toggle] = useState(false)

  return (
    <TotalStatsTooltipWrapper>
      <TotalStatsBookmark onClick={() => toggle(!toggled)}></TotalStatsBookmark>
      <TotalStatsBody toggled={toggled}>hello</TotalStatsBody>
    </TotalStatsTooltipWrapper>
  )
}
