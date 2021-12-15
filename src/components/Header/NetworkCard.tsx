import { Trans } from '@lingui/macro'
import { YellowCard } from 'components/Card'
import { useOnClickOutside } from 'hooks/useOnClickOutside'
import { useActiveWeb3React } from 'hooks/web3'
import { useEffect, useRef, useState } from 'react'
import { ArrowDownCircle, ChevronDown, ToggleLeft } from 'react-feather'
import { ApplicationModal } from 'state/application/actions'
import { useModalOpen, useToggleModal } from 'state/application/hooks'
import styled, { css } from 'styled-components/macro'
import { ExternalLink } from 'theme'
import { switchToNetwork } from 'utils/switchToNetwork'
import { CHAIN_INFO, L2_CHAIN_IDS, SupportedChainId, SupportedL2ChainId } from '../../constants/chains'

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
const L2Wrapper = styled.div`
  ${BaseWrapper}
`
const BaseMenuItem = css`
  align-items: center;
  background-color: transparent;
  border-radius: 12px;
  color: ${({ theme }) => theme.text2};
  cursor: pointer;
  display: flex;
  flex: 1;
  flex-direction: row;
  font-size: 16px;
  font-weight: 400;
  justify-content: space-between;
  :hover {
    color: ${({ theme }) => theme.text1};
    text-decoration: none;
  }
`
const DisabledMenuItem = styled.div`
  ${BaseMenuItem}
  align-items: center;
  background-color: ${({ theme }) => theme.bg2};
  cursor: auto;
  display: flex;
  font-size: 10px;
  font-style: italic;
  justify-content: center;
  :hover,
  :active,
  :focus {
    color: ${({ theme }) => theme.text2};
  }
`
const FallbackWrapper = styled(YellowCard)`
  ${BaseWrapper}
  background: #0f1940;
  color: white;
  border: 1px solid #0b1462;
  width: auto;
  border-radius: 12px;
  padding: 8px 12px;
  width: 100%;
`
const Icon = styled.img`
  width: 16px;
  margin-right: 2px;

  ${({ theme }) => theme.mediaWidth.upToSmall`
  margin-right: 4px;

  `};
`

const MenuFlyout = styled.span`
  background-color: ${({ theme }) => theme.bg1};
  border: 1px solid ${({ theme }) => theme.bg0};

  box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.01), 0px 4px 8px rgba(0, 0, 0, 0.04), 0px 16px 24px rgba(0, 0, 0, 0.04),
    0px 24px 32px rgba(0, 0, 0, 0.01);
  border-radius: 12px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  font-size: 1rem;
  position: absolute;
  left: 0rem;
  top: 3rem;
  z-index: 100;
  width: 237px;
  ${({ theme }) => theme.mediaWidth.upToMedium`
   
    bottom: unset;
    top: 4.5em
    right: 0;

  `};
  > {
    padding: 12px;
  }
  > :not(:first-child) {
    margin-top: 8px;
  }
  > :not(:last-child) {
    margin-bottom: 8px;
  }
`
const LinkOutCircle = styled(ArrowDownCircle)`
  transform: rotate(230deg);
  width: 16px;
  height: 16px;
  opacity: 0.6;
`
const MenuItem = styled(ExternalLink)`
  ${BaseMenuItem}
`
const ButtonMenuItem = styled.button`
  ${BaseMenuItem}
  border: none;
  box-shadow: none;
  color: ${({ theme }) => theme.text2};
  outline: none;
  padding: 0;
`
const NetworkInfo = styled.button<{ chainId: SupportedChainId }>`
  align-items: center;
  background-color: ${({ theme }) => theme.bg0};
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.bg0};
  color: ${({ theme }) => theme.text1};
  display: flex;
  flex-direction: row;
  font-weight: 500;
  font-size: 12px;
  height: 100%;
  margin: 0;
  height: 38px;
  padding: 0.7rem;

  :hover,
  :focus {
    cursor: pointer;
    outline: none;
    border: 1px solid ${({ theme }) => theme.bg3};
  }
`
const NetworkName = styled.div<{ chainId: SupportedChainId }>`
  border-radius: 6px;
  font-size: 16px;
  font-weight: 500;
  padding: 0 2px 0.5px 4px;
  margin: 0 2px;
  white-space: pre;
  ${({ theme }) => theme.mediaWidth.upToSmall`
   display: none;
  `};
`

export default function NetworkCard() {
  const { chainId, library } = useActiveWeb3React()

  const node = useRef<HTMLDivElement>(null)
  const open = useModalOpen(ApplicationModal.ARBITRUM_OPTIONS)
  const toggle = useToggleModal(ApplicationModal.ARBITRUM_OPTIONS)
  useOnClickOutside(node, open ? toggle : undefined)

  const [implements3085, setImplements3085] = useState(false)
  useEffect(() => {
    // metamask is currently the only known implementer of this EIP
    // here we proceed w/ a noop feature check to ensure the user's version of metamask supports network switching
    // if not, we hide the UI
    if (!library?.provider?.request || !chainId || !library?.provider?.isMetaMask) {
      return
    }
    switchToNetwork({ library, chainId })
      .then((x) => x ?? setImplements3085(true))
      .catch(() => setImplements3085(false))
  }, [library, chainId])

  const info = chainId ? CHAIN_INFO[chainId] : undefined
  if (!chainId || !info || !library || !library?.provider?.isMetaMask) {
    return null
  }

  if (chainId === SupportedChainId.POLYGON) {
    return (
      <div
        style={{
          padding: '8px 12px',
          backgroundColor: '#713937',
          borderRadius: '6px',
          marginRight: '10px',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <span style={{ marginRight: '10px', marginTop: '3px' }}>
          <svg width="18" height="16" viewBox="0 0 18 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M13.5937 4.87164C13.2656 4.6806 12.8437 4.6806 12.4687 4.87164L9.84375 6.44776L8.0625 7.45075L5.48437 9.02687C5.15625 9.21791 4.73437 9.21791 4.35937 9.02687L2.34375 7.78508C2.01562 7.59403 1.78125 7.21194 1.78125 6.78209V4.39403C1.78125 4.01194 1.96875 3.62985 2.34375 3.39105L4.35937 2.19702C4.6875 2.00597 5.10937 2.00597 5.48437 2.19702L7.5 3.43881C7.82812 3.62985 8.0625 4.01194 8.0625 4.44179V6.01791L9.84375 4.96717V3.34328C9.84375 2.9612 9.65625 2.57911 9.28125 2.3403L5.53125 0.0955236C5.20312 -0.0955212 4.78125 -0.0955212 4.40625 0.0955236L0.5625 2.38806C0.1875 2.57911 0 2.9612 0 3.34328V7.83284C0 8.21493 0.1875 8.59702 0.5625 8.83582L4.35937 11.0806C4.6875 11.2716 5.10937 11.2716 5.48437 11.0806L8.0625 9.55224L9.84375 8.50149L12.4219 6.97314C12.75 6.78209 13.1719 6.78209 13.5469 6.97314L15.5625 8.16717C15.8906 8.35821 16.125 8.7403 16.125 9.17015V11.5582C16.125 11.9403 15.9375 12.3224 15.5625 12.5612L13.5937 13.7552C13.2656 13.9463 12.8437 13.9463 12.4687 13.7552L10.4531 12.5612C10.125 12.3701 9.89062 11.9881 9.89062 11.5582V10.0299L8.10937 11.0806V12.6567C8.10937 13.0388 8.29687 13.4209 8.67187 13.6597L12.4687 15.9045C12.7969 16.0955 13.2187 16.0955 13.5937 15.9045L17.3906 13.6597C17.7187 13.4687 17.9531 13.0866 17.9531 12.6567V8.1194C17.9531 7.73731 17.7656 7.35522 17.3906 7.11642L13.5937 4.87164Z"
              fill="#8247E5"
            />
          </svg>
        </span>
        <span>Polygon</span>
      </div>
    )
  }

  return <FallbackWrapper title={info.label}>{info.label}</FallbackWrapper>
}
