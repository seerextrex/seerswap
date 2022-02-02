import styled from 'styled-components/macro'
import { NavLink } from 'react-router-dom'
import { Label, ClickableText } from 'components/Text'
import { DarkGreyCard } from '../Card'

export const  PageButtons = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 0.2em;
  margin-bottom: 0.5em;
`
export const Arrow = styled.div<{ faded: boolean }>`
  color: white;
  opacity: ${(faded) => faded ? 0.3 : 1};
  padding: 0 20px;
  user-select: none;
  :hover {
    cursor: pointer;
  }
`
export const  LabelStyled = styled(Label)`
  font-size: 14px;
  justify-content: flex-start;
`
export const  ClickableTextStyled = styled(ClickableText)`
  font-size: 14px;
  justify-content: flex-start;
  text-align: start;
`
export const  Wrapper = styled(DarkGreyCard)`
  width: 100%;
  background-color: rgba(60, 97, 126, 0.5);
  ${({ theme }) => theme.mediaWidth.upToMedium`
    min-width: 900px;
  `};
`
export const  ResponsiveGrid = styled.div`
  display: grid;
  position: relative;
  grid-gap: 1em;
  align-items: center;

  grid-template-columns: 20px 2.3fr repeat(4, 1fr);

  @media screen and (max-width: 1000px) {
    grid-template-columns: 20px 2.1fr repeat(4, 1fr);
    & :nth-child(3) {
      display: none;
    }
  }
`
export const  ChartBadge = styled(NavLink)`
  background: #36f;
  margin-left: 10px;
  border-radius: 6px;
  padding: 2px 3px;
  & > * {
    display: block;
  }
`
export const  LinkWrapper = styled.a`
  display: flex;
  text-decoration: none;
  svg {
    margin-left: 8px;
  }
`