import styled from 'styled-components/macro'
import { SupportedChainId, SupportedL2ChainId } from '../../constants/chains'
import { ArbitrumWrapperBackgroundDarkMode, ArbitrumWrapperBackgroundLightMode, OptimismWrapperBackgroundDarkMode, OptimismWrapperBackgroundLightMode } from './NetworkAlert'
import { ArrowDownCircle } from 'react-feather'
import { ExternalLink, MEDIA_WIDTHS } from '../../theme'


//AddLiquidityNetworkAlert
export const L2Icon = styled.img`
  display: none;
  height: 40px;
  margin: auto 20px auto 4px;
  width: 40px;
  @media screen and (min-width: ${MEDIA_WIDTHS.upToMedium}px) {
    display: block;
  }
`
export const DesktopTextBreak = styled.div`
  display: none;
  @media screen and (min-width: ${MEDIA_WIDTHS.upToMedium}px) {
    display: block;
  }
`
export const Wrapper = styled.div<{ chainId: SupportedL2ChainId; darkMode: boolean; logoUrl: string }>`
  ${({ chainId, darkMode }) =>
    [SupportedChainId.OPTIMISM, SupportedChainId.OPTIMISTIC_KOVAN].includes(chainId)
        ? darkMode
            ? OptimismWrapperBackgroundDarkMode
            : OptimismWrapperBackgroundLightMode
        : darkMode
            ? ArbitrumWrapperBackgroundDarkMode
            : ArbitrumWrapperBackgroundLightMode};
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding: 12px;
  position: relative;
  width: 100%;

  :before {
    background-image: url(${({ logoUrl }) => logoUrl});
    background-repeat: no-repeat;
    background-size: 300px;
    content: '';
    height: 300px;
    opacity: 0.1;
    position: absolute;
    transform: rotate(25deg) translate(-90px, -40px);
    width: 300px;
    z-index: -1;
  }
  @media screen and (min-width: ${MEDIA_WIDTHS.upToMedium}px) {
    flex-direction: row;
    padding: 16px 20px;
  }
`
export const Body = styled.div`
  font-size: 12px;
  line-height: 143%;
  margin: 12px;
  @media screen and (min-width: ${MEDIA_WIDTHS.upToMedium}px) {
    flex: 1 1 auto;
    margin: auto 0;
  }
`
export const LinkOutCircle = styled(ArrowDownCircle)`
  transform: rotate(230deg);
  width: 20px;
  height: 20px;
  margin-left: 12px;
`
export const LinkOutToBridge = styled(ExternalLink)`
  align-items: center;
  background-color: black;
  border-radius: 16px;
  color: white;
  display: flex;
  font-size: 14px;
  justify-content: space-between;
  margin: 0;
  max-height: 47px;
  padding: 16px 12px;
  text-decoration: none;
  width: auto;
  :hover,
  :focus,
  :active {
    background-color: black;
  }
  @media screen and (min-width: ${MEDIA_WIDTHS.upToMedium}px) {
    margin: auto 0 auto auto;
    padding: 14px 16px;
    min-width: 226px;
  }
`
