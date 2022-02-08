import styled, { css } from 'styled-components/macro'
import { NavLink } from 'react-router-dom'
import { ClickableText, Label } from 'components/Text'
import { DarkGreyCard } from '../Card'

export const PageButtonsWrapper = styled.div`
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
export const LabelStyled = styled(Label)<{center?: boolean}>`
  font-size: 14px;
  justify-content: flex-start;
`
export const ClickableTextStyled = styled(ClickableText)<{center?: boolean}>`
  font-size: 14px;
  justify-content: flex-start;
  text-align: start;
`
export const Wrapper = styled(DarkGreyCard)`
  width: 100%;
  background-color: rgba(60, 97, 126, 0.5);
  ${({ theme }) => theme.mediaWidth.upToMedium`
    min-width: 900px;
  `};
`
export const ResponsiveGrid = styled.div`
    display: grid;
    position: relative;
    grid-gap: 1em;
    align-items: center;
    grid-template-columns: 20px 2.3fr repeat(5, 1fr);
    @media screen and (max-width: 1000px) {
        grid-template-columns: 20px 2.1fr repeat(5, 1fr);
    }
`
export const ChartBadge = styled(NavLink)`
  background: #36f;
  margin-left: 10px;
  border-radius: 6px;
  padding: 2px 3px;
  & > * {
    display: block;
  }
`
export const LinkWrapper = styled.a`
  display: flex;
  text-decoration: none;
  svg {
    margin-left: 8px;
  }
`
export const HelperDropdown = styled.span`
  position: absolute;
  display: none;
  right: 0;
  font-size: 12px;
  bottom: -2.5rem;
  padding: 7px 9px;
  white-space: nowrap;
  background: white;
  border-radius: 4px;
  color: black;
  z-index: 30;
`
export const HelperDropdownPart = styled.span`
  padding: 2px 6px;
  background-color: #d6d6d6;
  border-radius: 4px;
  color: #2d2d2d;
`

export const APRWrapper = styled.span`
  position: relative;
  &:hover {
    & > ${HelperDropdown} {
      display: block;
    }
  }
`

export const FarmingLink = styled(NavLink)<{ apr: boolean }>`
  color: white;
  text-decoration: none;

  ${({ apr }) =>
    apr &&
    css`
      padding: 4px;
      border-radius: 3px;
      color: white;
      background-color: #36f;
      text-decoration: underline;

      &:hover {
        color: #01ffff;
      }
    `}
`
