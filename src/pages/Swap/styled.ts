import styled from 'styled-components/macro'
import { Info } from 'react-feather'
import IphoneBanner from '../../assets/images/iphone-contest.png'

export const StyledInfo = styled(Info)`
  opacity: 0.6;
  color: #2f567b;
  height: 16px;
  width: 16px;

  :hover {
    opacity: 0.8;
  }
`

export const ContestBanner = styled.div`
  position: absolute;
  display: flex;
  top: -6rem;
  background-image: url(${IphoneBanner});
  width: calc(100% - 5px);
  height: 110px;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    display: none;
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
`

export const ContestBannerTitleIphone = styled.span`
  color: #F4BE32;
`
