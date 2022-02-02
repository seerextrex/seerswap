import styled from "styled-components/macro"
import {NavLink} from "react-router-dom"

export const StakingAnalyticsPageWrapper = styled.div`
  width: 100%;
  max-width: 950px;
  margin-bottom: 5rem;
`
export const LoaderWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 470px;
  margin: 1rem 0;
  background-color: #052445;
  border-radius: 16px;
  ${({theme}) => theme.mediaWidth.upToMedium`
     height: 363px;
  `}
`
export const BackButton = styled(NavLink)`
  margin-top: 10px;
  text-decoration: none;
  color: white;
  font-size: 16px;
  display: flex;
  align-items: center;
  width: fit-content;
  position: relative;
  z-index: 100;

  p {
    margin: 0 0 0 5px;
  }
`
export const ChartTitleWrapper = styled.div`
  display: flex;
  justify-content: start;
  
  ${({theme}) => theme.mediaWidth.upToSmall`
    flex-direction: column;
  `}
`
export const ChartTitleLeft = styled.div`
  text-align: left;

`
export const ChartTitleRight = styled.div`
  text-align: right;
  margin-left: 2rem;
  ${({theme}) => theme.mediaWidth.upToSmall`
     margin-left: 0;
     margin-top: .5rem;
     text-align: left;
  `}

`
export const ColorRect = styled.div`
  width: 20px;
  height: 20px;
  background-color: ${({stroke}) => stroke};
  border-radius: 5px;
`
export const ColorTextWrapper = styled.div`
  display: flex;
  align-items: center;
`
export const ChartTitle = styled.h2`
  color: white;
  margin: 0;
`
export const ChartHint = styled.p`
  margin: 5px 0 0 0;
  color: white;
  ${({theme}) => theme.mediaWidth.upToSmall`
    font-size: 14px;
  `}
`
export const ChartCard = styled.div`
  background-color: ${({theme}) => theme.winterBackground};
  border-radius: 16px;
  padding: 1rem 2rem;
  margin: 1rem 0;
  ${({theme}) => theme.mediaWidth.upToSmall`
    padding: .7rem 1.2rem;
  `}
`