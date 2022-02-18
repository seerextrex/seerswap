import { useEffect, useMemo, useState } from 'react'
import { useETHBalances } from 'state/wallet/hooks'
// @ts-ignore
import WinterLogo from '../../assets/images/winter-logo.png'
// @ts-ignore
import Logo_logo from '../../assets/svg/alg-logo-svg.svg'
import { useActiveWeb3React } from '../../hooks/web3'
import Web3Status from '../Web3Status'
import NetworkCard from './NetworkCard'
import { useIsNetworkFailed } from '../../hooks/useIsNetworkFailed'
import usePrevious from '../../hooks/usePrevious'
import { isMobile } from 'react-device-detect'
import { useAppSelector } from '../../state/hooks'
import { AccountElement, AlgIcon, BalanceText, FarmingInfoLabel, HeaderControls, HeaderElement, HeaderFrame, HeaderLinks, LogoWrapper, StyledNavLink, Title, TitleIce, TitleIcicle } from './styled'

export default function Header() {
    const { startTime, eternalFarmings } = useAppSelector((state) => state.farming)
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

    let chainValue

    if (chainId === 137) {
        chainValue = 'MATIC'
    }

    useEffect(() => {
        if (startTime.trim() || eternalFarmings) {
            setEvents(true)
        }
    }, [startTime, eternalFarmings])

    return (
        <HeaderFrame showBackground={false}>
            <LogoWrapper>
                <Title href='.'>
                    <TitleIce>
                        <AlgIcon>
                            <img
                                width={'calc(100% - 10px)'}
                                src={window.innerWidth < 501 ? Logo_logo : WinterLogo}
                                alt='logo'
                            />
                        </AlgIcon>
                    </TitleIce>
                </Title>
                <TitleIcicle />
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
                <span style={{ position: 'relative' }}>
            <span>Farming</span>
          <FarmingInfoLabel isEvents={isEvents} />
            </span>
                </StyledNavLink>
                <StyledNavLink id={`staking-nav-link`} to={'/staking'}>
                    Staking
                </StyledNavLink>
                <StyledNavLink id={`info-nav-link`} to={'/info'}>
                    Info
                </StyledNavLink>
            </HeaderLinks>

            <HeaderControls>
                <HeaderElement>
                    <AccountElement active={!!account} style={{ pointerEvents: 'auto' }}>
                        {account &&
                            <>
                                <NetworkCard />
                                {chainId === 137 && account && userEthBalance || networkFailed ? (
                                    <BalanceText
                                        style={{ flexShrink: 0 }}
                                        pl='0.75rem'
                                        pt='0.75rem'
                                        pb='0.75rem'
                                        pr='0.5rem'
                                        fontWeight={500}
                                    >
                                        {_userEthBalance?.toSignificant(3)} {!isMobile && chainValue}
                                    </BalanceText>
                                ) : null}
                            </>}
                        <Web3Status />
                    </AccountElement>
                </HeaderElement>
            </HeaderControls>
        </HeaderFrame>
    )
}
