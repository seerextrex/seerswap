import styled, { css, keyframes } from 'styled-components/macro'
import Row from '../Row'
import { Text } from 'rebass'
import { NavLink } from 'react-router-dom'
import { darken } from 'polished'
import WoodenSlob from '../../assets/svg/wooden-slob.svg'
import WoodenRope from '../../assets/svg/wooden-rope.svg'
import LogoIcicles from '../../assets/svg/logo-icicles.svg'
import { YellowCard } from 'components/Card'
import { TYPE } from '../../theme'

//index
const activeClassName = 'ACTIVE'
export const HeaderFrame = styled.div<{ showBackground: boolean }>`
  display: flex;
  grid-template-columns: 120px 1fr 120px;
  align-items: center;
  justify-content: space-between;
  flex-direction: row;
  width: 100%;
  top: 0;
  position: relative;
  z-index: 21;
  background-position: ${({ showBackground }) => (showBackground ? '0 -100%' : '0 0')};
  background-size: 100% 200%;
  box-shadow: 0 0 0 1px ${({ theme, showBackground }) => (showBackground ? theme.bg2 : 'transparent;')};
  transition: background-position 0.1s, box-shadow 0.1s;
  background-blend-mode: hard-light;
  padding: 50px 1rem 1rem;

  ${({ theme }) => theme.mediaWidth.upToLarge`
    grid-template-columns: 48px 1fr 1fr;
  `};

  ${({ theme }) => theme.mediaWidth.upToMedium`
    padding:  1rem;
    grid-template-columns: 1fr 1fr;
  `};

  ${({ theme }) => theme.mediaWidth.upToSmall`
    padding:  1rem;
    grid-template-columns: 36px 1fr;
  `};
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`{
    padding: 0.5rem 1rem;
  }`}
`
export const HeaderControls = styled.div`
  display: flex;
  position: relative;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  justify-self: flex-end;
  background-repeat: repeat;
  background-size: 27px 40px;
  height: 64px;
  padding: 1rem;
  border-radius: 16px;

  background-color: #b38280;
  border: 4px solid #713937;
  background-image: url(${WoodenSlob});

  &::before,
  &::after {
    content: '';
    background-image: url(${WoodenRope});
    width: 5px;
    height: 51px;
    position: absolute;
    top: -55px;
  }

  &::before {
    left: 15%;
  }

  &::after {
    right: 15%;
  }

  ${({ theme }) => theme.mediaWidth.upToSmall`
    padding: 0 1rem;
  `}
`
export const HeaderElement = styled.div`
  display: flex;
  align-items: center;

  /* addresses safari's lack of support for "gap" */

  & > *:not(:first-child) {
    margin-left: 8px;
  }

  ${({ theme }) => theme.mediaWidth.upToMedium`
    align-items: center;
  `};
`
export const HeaderLinks = styled(Row)`
  position: absolute;
  transform: translateX(-50%);
  left: 50%;
  justify-self: center;
  background-color: #b38280;
  border: 4px solid #713937;
  background-image: url(${WoodenSlob});
  background-repeat: repeat;
  background-size: 27px 40px;
  width: fit-content;
  padding: 0 16px;
  border-radius: 16px;
  display: grid;
  grid-auto-flow: column;
  grid-gap: 30px;
  overflow: visible;
  align-items: center;

  &::before,
  &::after {
    content: '';
    background-image: url(${WoodenRope});
    width: 5px;
    height: 54px;
    position: absolute;
    top: -58px;
  }

  &::before {
    left: 15%;
  }

  &::after {
    right: 15%;
  }

  ${({ theme }) => theme.mediaWidth.upToLarge`
  position: relative;
  transform: unset;
  left: unset;
  overflow: auto;
  `}

  ${({ theme }) => theme.mediaWidth.upToMedium`
  position: fixed;
  bottom: 1rem;
  transform: translateX(-50%);
  left: 50%;
  flex-direction: row;
  justify-content: space-between;
  justify-self: center;
  z-index: 99;
  margin: 0 auto;

  &::before,
  &::after {
    display: none;
  }
`};

  ${({ theme }) => theme.mediaWidth.upToSmall`
  position: fixed;
  transform: translateX(-50%);
  left: 50%;
  bottom: 1rem;
    overflow: auto;
    width: calc(100% - 1rem);
    margin-right: -1rem;
    &::before, &::after {
      display: none;
    }

  `}
`
export const AccountElement = styled.div<{ active: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  background-color: #713937;
  border-radius: 8px;
  white-space: nowrap;
  width: 100%;
  cursor: pointer;

  :focus {
    border: 1px solid blue;
  }

  ${({ theme }) => theme.mediaWidth.upToSmall`
    font-size: 14px;
  `}
`
export const BalanceText = styled(Text)`
  cursor: default;
`
export const LogoWrapper = styled.div`
  position: relative;
`
export const Title = styled.a`
  display: flex;
  z-index: 5;
  position: relative;
  width: 250px;
  height: 64px;
  align-items: center;
  border-radius: 16px;
  pointer-events: auto;
  justify-self: flex-start;
  text-decoration: none;
  background-color: #b38280;
  border: 4px solid #9eb7cd;
  background-image: url(${WoodenSlob});
  background-repeat: repeat;
  background-size: 27px 40px;

  :hover {
    cursor: pointer;
  }

  &::before,
  &::after {
    content: '';
    background-image: url(${WoodenRope});
    width: 5px;
    height: 51px;
    position: absolute;
    top: -55px;
  }

  &::before {
    left: 15%;
  }

  &::after {
    right: 15%;
  }

  ${({ theme }) => theme.mediaWidth.upToLarge`
    width: 200px;
  `}

  ${({ theme }) => theme.mediaWidth.upToSmall`
    width: 150px;
    margin-right: 10px;
  `}
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    width: 80px;
  `}
`
export const TitleIce = styled.div`
  width: 100%;
  height: 100%;
  background-color: RGBA(51, 182, 255, 0.5);
  border-radius: 11px;
`
export const TitleIcicle = styled.div`
  background-image: url(${LogoIcicles});
  background-repeat: no-repeat;
  background-size: 98%;
  width: 100%;
  height: 75px;
  position: absolute;
  display: block;
  z-index: 4;
  top: 18px;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    display: none;
  `}
`
export const AlgIcon = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  & > img {
    width: calc(100% - 30px);
  }

  ${({ theme }) => theme.mediaWidth.upToSmall`{
    & > img {
      width: 130px;
    }
  }`}
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`{
    & > img {
      width: 30px;
    }
  }`}
`
export const StyledNavLink = styled(NavLink).attrs({
  activeClassName
})`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: left;
  outline: none;
  cursor: pointer;
  text-decoration: none;
  color: white;
  font-size: 1rem;
  width: fit-content;
  font-weight: 600;
  padding: 14px 15px;
  word-break: break-word;
  white-space: nowrap;
  border-bottom: 3px solid transparent;
  position: relative;

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    padding: 14px 15px;
  `}
  &.${activeClassName} {
    font-weight: 600;
    color: #ffd967;
    border-bottom: 3px solid #ffbf00;
  }

  &:not(.${activeClassName}) {
    & :hover,
    &:focus {
      color: ${({ theme }) => darken(0.1, theme.text1)};
    }
  }
`
export const FarmingInfoLabel = styled.span<{ isEvents: boolean }>`
  padding: 5px;
  background-color: #ffd967;
  position: absolute;
  border-radius: 50%;
  top: 30%;
  right: 5%;
  display: ${({ isEvents }) => (!isEvents ? 'none' : 'block')};

  ${({ theme }) => theme.mediaWidth.upToMedium`
  top: 20%;
  right: 0%;
  `}
`

//NetworkCard
const BaseWrapper = css`
  position: relative;
  margin-right: 8px;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    justify-self: end;
  `};

  ${({ theme }) => theme.mediaWidth.upToSmall`
    margin: 0 0.5rem 0 0;
    width: initial;
    text-overflow: ellipsis;
    flex-shrink: 1;
  `};
`
export const FallbackWrapper = styled(YellowCard)`
  ${BaseWrapper};
  background: #0f1940;
  color: white;
  border: 1px solid #0b1462;
  border-radius: 12px;
  padding: 8px 12px;
  width: 100%;
`
export const NetworkWrapper = styled.div`
  padding: 8px 0 8px 12px;
  background-color: #713937;
  border-radius: 6px;
  display: flex;
  align-items: center;

    // ${({ theme }) => theme.mediaWidth.upToSmall`
  //   display: none;
  // `};

  ${({ theme }) => theme.mediaWidth.upToSmall`
    display: none;
  `};
`
export const ChainWrapper = styled.span`
  margin-top: 3px;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    margin-top: 1px;
  `}
`

//GasPrice
export const GasPriceWrapper = styled.div`
  position: fixed;
  bottom: 1rem;
  right: 6rem;
  color: #2f567b;
  font-size: 11px;
  opacity: 0.7;

  ${({ theme }) => theme.mediaWidth.upToMedium`
    display: none;
  `}
`

//Pooling
export const StyledPolling = styled.div`
  position: fixed;
  display: flex;
  align-items: center;
  right: 0;
  bottom: 0;
  padding: 1rem;
  color: rgb(91, 183, 255);

  ${({ theme }) => theme.mediaWidth.upToMedium`
    display: none;
  `}
`
export const StyledPollingNumber = styled(TYPE.small)<{ breathe: boolean; hovering: boolean }>`
  transition: opacity 0.25s ease;
  color: #2f567b;
  opacity: ${({ breathe, hovering }) => (hovering ? 0.7 : breathe ? 1 : 0.5)};
  :hover {
    opacity: 1;
  }
`
export const StyledPollingDot = styled.div`
  width: 8px;
  height: 8px;
  min-height: 8px;
  min-width: 8px;
  margin-left: 0.5rem;
  border-radius: 50%;
  position: relative;
  background-color: rgb(91, 183, 255);
`
const rotate360 = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`
export const Spinner = styled.div`
  animation: ${rotate360} 1s cubic-bezier(0.83, 0, 0.17, 1) infinite;
  transform: translateZ(0);

  border-top: 1px solid transparent;
  border-right: 1px solid transparent;
  border-bottom: 1px solid transparent;
  border-left: 2px solid rgb(91, 183, 255);
  background: transparent;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  position: relative;

  left: -3px;
  top: -3px;
`