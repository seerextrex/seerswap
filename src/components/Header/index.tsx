import { Trans } from '@lingui/macro'
import useScrollPosition from '@react-hook/window-scroll'
import { darken } from 'polished'
import { useEffect, useMemo, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { Text } from 'rebass'
import { useShowClaimPopup, useToggleSelfClaimModal } from 'state/application/hooks'
import { useDarkModeManager } from 'state/user/hooks'
import { useETHBalances } from 'state/wallet/hooks'
import styled, { keyframes } from 'styled-components/macro'
import Logo from '../../assets/svg/logo.svg'
import WinterLogo from '../../assets/images/winter-logo.png'
import LogoDark from '../../assets/svg/logo_white.svg'
import Logo_logo from '../../assets/svg/alg-logo-svg.svg'
import { useActiveWeb3React } from '../../hooks/web3'
import Modal from '../Modal'
import Row from '../Row'
import Web3Status from '../Web3Status'
import NetworkCard from './NetworkCard'
import UniBalanceContent from './UniBalanceContent'
import { deviceSizes } from '../../pages/styled'
import { useIsNetworkFailed } from '../../hooks/useIsNetworkFailed'
import usePrevious from '../../hooks/usePrevious'

import WoodenSlob from '../../assets/svg/wooden-slob.svg'
import WoodenRope from '../../assets/svg/wooden-rope.svg'
import LogoIcicles from '../../assets/svg/logo-icicles.svg'

import { isMobile } from 'react-device-detect'
import { useFarmingActionsHandlers } from '../../state/farming/hooks'
import { useAppSelector } from '../../state/hooks'

const HeaderFrame = styled.div<{ showBackground: boolean }>`
  display: flex;
  grid-template-columns: 120px 1fr 120px;
  align-items: center;
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
  width: 100%;
  top: 0;
  position: relative;
  padding: 1rem;
  z-index: 21;
  position: relative;
  /* Background slide effect on scroll. */
  background-image: ${({ theme }) => `linear-gradient(to bottom, transparent 50%, rgba(0,0,0,.9) 50% )}}`};
  background-position: ${({ showBackground }) => (showBackground ? '0 -100%' : '0 0')};
  background-size: 100% 200%;
  box-shadow: 0px 0px 0px 1px ${({ theme, showBackground }) => (showBackground ? theme.bg2 : 'transparent;')};
  transition: background-position 0.1s, box-shadow 0.1s;
  background-blend-mode: hard-light;
  padding-top: 50px;

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

const swingAnimation = keyframes`
0% { transform: rotate(1deg); }
100% { transform: rotate(-1deg); }
`

const HeaderControls = styled.div`
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

const HeaderElement = styled.div`
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

const HeaderLinks = styled(Row)`
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

const AccountElement = styled.div<{ active: boolean }>`
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

const BalanceText = styled(Text)`
  cursor: default;
`

const LogoWrapper = styled.div`
  position: relative;
`

const Title = styled.a`
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

const TitleIce = styled.div`
  width: 100%;
  height: 100%;
  background-color: RGBA(51, 182, 255, 0.5);
  border-radius: 11px;
`
const TitleIcicle = styled.div`
  background-image: url(${LogoIcicles});
  background-repeat: no-repeat;
  background-size: 98%;
  width: 100%;
  height: 106px;
  position: absolute;
  display: block;
  z-index: 4;
  top: 18px;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    display: none;
  `}
`

const AlgIcon = styled.div`
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

const activeClassName = 'ACTIVE'

const StyledNavLink = styled(NavLink).attrs({
  activeClassName,
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
  padding: 14px 20px;
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
      // background-color: rgba(15, 46, 64, 0.4);
    }
  }
`
export const FarmingInfoLabel = styled.span`
  padding: 5px;
  background-color: #ffd967;
  position: absolute;
  border-radius: 50%;
  top: 30%;
  right: 5%;
  display: ${(p) => (!p.isEvents ? 'none' : 'block')};
  
  ${({theme}) => theme.mediaWidth.upToMedium`
  top: 20%;
  right: 0%;
  `}
`

export default function Header() {
  const { startTime } = useAppSelector((state) => state.farming)
  const { account, chainId } = useActiveWeb3React()

  const userEthBalance = useETHBalances(account ? [account] : [])?.[account ?? '']

  const prevEthBalance = usePrevious(userEthBalance)

  const _userEthBalance = useMemo(() => {
    if (!userEthBalance) {
      return prevEthBalance
    }

    return userEthBalance
  }, [userEthBalance])

  const networkFailed = useIsNetworkFailed()

  const [isEvents, setEvents] = useState(false)

  const [darkMode] = useDarkModeManager()

  const [showUniBalanceModal, setShowUniBalanceModal] = useState(false)
  const showClaimPopup = useShowClaimPopup()

  const scrollY = useScrollPosition()

  let chainValue

  if (chainId === 137) {
    chainValue = 'MATIC'
  }

  useEffect(() => {
    if (startTime.trim()) {
      setEvents(true)
    }
  }, [startTime])

  return (
    <HeaderFrame showBackground={false}>
      <LogoWrapper>
        <Title href=".">
          <TitleIce>
            <AlgIcon>
              <img width={'calc(100% - 10px)'} src={window.innerWidth < 501 ? Logo_logo : WinterLogo} alt="logo" />
            </AlgIcon>
          </TitleIce>
        </Title>
        <TitleIcicle></TitleIcicle>
      </LogoWrapper>
      <HeaderLinks>
        <StyledNavLink id={`swap-nav-link`} to={'/swap'}>
          Swap
        </StyledNavLink>
        <StyledNavLink
          id={`pool-nav-link`}
          to={'/pool'}
          isActive={(match, { pathname }) =>
            Boolean(match) ||
            pathname.startsWith('/add') ||
            pathname.startsWith('/remove') ||
            pathname.startsWith('/increase') ||
            pathname.startsWith('/find')
          }
        >
          Pool
        </StyledNavLink>
        <StyledNavLink id={`farming-nav-link`} to={'/farming'}>
          Farming
          <FarmingInfoLabel isEvents={isEvents} />
        </StyledNavLink>
        <StyledNavLink id={`staking-nav-link`} to={'/staking'}>
          Staking
        </StyledNavLink>
        <StyledNavLink id={`info-nav-link`} to={'/info'}>
          Info
        </StyledNavLink>
      </HeaderLinks>

      <HeaderControls account={!!account}>
        <HeaderElement>
          <AccountElement active={!!account} style={{ pointerEvents: 'auto' }}>
            <NetworkCard />
            {(chainId === 137 && account && userEthBalance) || networkFailed ? (
              <BalanceText
                style={{ flexShrink: 0 }}
                pl="0.75rem"
                pt="0.75rem"
                pb="0.75rem"
                pr="0.5rem"
                fontWeight={500}
              >
                {_userEthBalance?.toSignificant(3)} {!isMobile && chainValue}
              </BalanceText>
            ) : null}
            <Web3Status />
          </AccountElement>
        </HeaderElement>
      </HeaderControls>
    </HeaderFrame>
  )
}
