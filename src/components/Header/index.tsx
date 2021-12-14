import { Trans } from '@lingui/macro'
import useScrollPosition from '@react-hook/window-scroll'
import { darken } from 'polished'
import { useMemo, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { Text } from 'rebass'
import { useShowClaimPopup, useToggleSelfClaimModal } from 'state/application/hooks'
import { useDarkModeManager } from 'state/user/hooks'
import { useETHBalances } from 'state/wallet/hooks'
import styled from 'styled-components/macro'
import Logo from '../../assets/svg/logo.svg'
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
  padding-top: 55px;

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

const HeaderControls = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-self: flex-end;
  background-color: #b38280;
  border: 4px solid #713937;
  background-image: url(${WoodenSlob});
  background-repeat: repeat;
  background-size: 27px 40px;
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
  // background-color: ${({ theme }) => theme.bg0};
  background-color: #b38280;
  border: 4px solid #713937;
  background-image: url(${WoodenSlob});
  background-repeat: repeat;
  background-size: 27px 40px;
  width: fit-content;
  padding: 4px;
  border-radius: 16px;
  display: grid;
  grid-auto-flow: column;
  grid-gap: 30px;
  overflow: visible;
  align-items: center;
  ${({ theme }) => theme.mediaWidth.upToLarge`
    // justify-self: center;  
    `};
  ${({ theme }) => theme.mediaWidth.upToMedium`
    justify-self: center;
  `};
  ${({ theme }) => theme.mediaWidth.upToMedium`
    flex-direction: row;
    justify-content: space-between;
    justify-self: center;
    z-index: 99;
    position: fixed;
    bottom: 1rem;
    // transform: translate(-50%);
    margin: 0 auto;
    // background-color: ${({ theme }) => theme.bg0};
    // border: 1px solid ${({ theme }) => theme.bg2};
    // box-shadow: 0px 6px 10px rgb(0 0 0 / 2%);
  `};

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

  @media (max-width: 1366px) {
    grid-auto-flow: unset;
    left: 65px;
    top: 100px;
  }

  @media (max-width: 1144px) {
    grid-auto-flow: column;
    transform: translateX(-50%);
    left: 50%;
    background-color: black;
    bottom: 1rem;
    flex-direction: row;
    justify-content: space-between;
    justify-self: center;
    z-index: 99;
    position: fixed;
    top: unset;
  }

  @media (max-width: 500px) {
    display: flex;
    max-width: 100%;
    //margin-left: 10px;
  }
`

const AccountElement = styled.div<{ active: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  background-color: ${({ theme, active }) => (!active ? theme.bg1 : theme.bg1)};
  border-radius: 12px;
  white-space: nowrap;
  width: 100%;
  cursor: pointer;

  :focus {
    border: 1px solid blue;
  }
`

const UNIAmount = styled(AccountElement)`
  color: white;
  padding: 4px 8px;
  height: 36px;
  font-weight: 500;
  background-color: ${({ theme }) => theme.bg3};
  background: radial-gradient(174.47% 188.91% at 1.84% 0%, #ff007a 0%, #2172e5 100%), #edeef2;
`

const UNIWrapper = styled.span`
  width: fit-content;
  position: relative;
  cursor: pointer;

  :hover {
    opacity: 0.8;
  }

  :active {
    opacity: 0.9;
  }
`

const BalanceText = styled(Text)`
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    display: none;
  `};
  cursor: default;
`

const Title = styled.a`
  display: flex;
  align-items: center;
  pointer-events: auto;
  justify-self: flex-start;
  margin-right: 12px;
  text-decoration: none;
  background-color: #b38280;
  border: 4px solid #713937;
  background-image: url(${WoodenSlob});
  background-repeat: repeat;
  background-size: 27px 40px;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    // justify-self: center;
  `};
  :hover {
    cursor: pointer;
  }
`

const AlgIcon = styled.div`
  transition: transform 0.3s ease;

  & > img {
    width: 160px;
  }

  :hover {
    transform: scale(1.2);
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
  border-radius: 160px;
  outline: none;
  cursor: pointer;
  text-decoration: none;
  color: ${({ theme }) => theme.text2};
  font-size: 1rem;
  width: fit-content;
  font-weight: 500;
  padding: 14px 20px;
  word-break: break-word;
  white-space: nowrap;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    border-radius: 16px;
  `}
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    padding: 14px 15px;
  `}

  &.${activeClassName} {
    // border-radius: 12px;
    font-weight: 600;
    // color: ${({ theme }) => theme.text1};
    // background-color: ${({ theme }) => theme.bg2};
    // background-color: #0f2e40;
    color: #48b9cd;
  }

  &:not(.${activeClassName}) {
    & :hover,
    &:focus {
      color: ${({ theme }) => darken(0.1, theme.text1)};
      // background-color: rgba(15, 46, 64, 0.4);
    }
  }
`

export default function Header() {
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

  const [darkMode] = useDarkModeManager()

  const [showUniBalanceModal, setShowUniBalanceModal] = useState(false)
  const showClaimPopup = useShowClaimPopup()

  const scrollY = useScrollPosition()

  let chainValue

  if (chainId === 137) {
    chainValue = 'MATIC'
  }

  return (
    <HeaderFrame showBackground={scrollY > 45}>
      <Title href=".">
        <AlgIcon>
          <img width={'160px'} src={window.innerWidth < 501 ? Logo_logo : darkMode ? LogoDark : Logo} alt="logo" />
        </AlgIcon>
      </Title>
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
        </StyledNavLink>
        <StyledNavLink id={`migrate-nav-link`} to={'/migrate'}>
          Migrate
        </StyledNavLink>
        <StyledNavLink id={`info-nav-link`} to={'/info'}>
          Info
        </StyledNavLink>
      </HeaderLinks>

      <HeaderControls>
        <NetworkCard />
        <HeaderElement>
          <AccountElement active={!!account} style={{ pointerEvents: 'auto' }}>
            {(chainId === 137 && account && userEthBalance) || networkFailed ? (
              <BalanceText
                style={{ flexShrink: 0 }}
                pl="0.75rem"
                pt="0.75rem"
                pb="0.75rem"
                pr="0.5rem"
                fontWeight={500}
              >
                {_userEthBalance?.toSignificant(3)} {chainValue}
              </BalanceText>
            ) : null}
            <Web3Status />
          </AccountElement>
        </HeaderElement>
      </HeaderControls>
    </HeaderFrame>
  )
}
