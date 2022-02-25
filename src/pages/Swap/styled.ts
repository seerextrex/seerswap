import styled from 'styled-components/macro'
import { Info } from 'react-feather'
import IphoneBanner from '../../assets/images/iphone-contest.png'
import IphoneBannerMobile from '../../assets/images/iphone-contest-mobile.png'
import AppBody from '../AppBody'

export const StyledInfo = styled(Info)`
    opacity: 0.6;
    color: #2f567b;
    height: 16px;
    width: 16px;

    :hover {
        opacity: 0.8;
    }
`

export const ContestBanner = styled.a`
    position: absolute;
    display: flex;
    top: -6rem;
    color: white;
    background-image: url(${IphoneBanner});
    width: 100%;
    height: 110px;
    text-decoration: none;
    background-size: cover;

    ${({ theme }) => theme.mediaWidth.upToSmall`
        top: -5.5rem;
        background-image: url(${IphoneBannerMobile});
        background-size: contain;
        background-repeat: no-repeat;
  `}

`
export const ContestBannerTitle = styled.div`
    display: flex;
    align-items: center;
    justify-content: flex-end;
    font-size: 20px;
    text-transform: uppercase;
    font-weight: 600;
    margin-left: auto;
    margin-top: 1.3rem;
    margin-right: 2rem;

    ${({ theme }) => theme.mediaWidth.upToSmall`
    display: none;
`}
`

export const ContestBannerTitleIphone = styled.span`
    color: #F4BE32;
`

export const ContestArrow = styled.span`
    ${({ theme }) => theme.mediaWidth.upToSmall`
        display: none;
    `}
`

export const WrappedAppBody = styled(AppBody)`
    ${({ theme }) => theme.mediaWidth.upToSmall`
        margin-top: 2rem;
    `}
`