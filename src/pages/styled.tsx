import styled, { createGlobalStyle } from 'styled-components/macro'

export const StandardPageWrapper = styled.div`
  padding-top: 160px;
  width: 100%;
`

export const IframeBodyWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-top: 3rem;
  padding: 1rem;
  align-items: center;
  flex: 1;
  z-index: 1;
`
const size = {
    mobileS: '320px',
    mobileM: '375px',
    mobileL: '425px',
    tablet: '768px',
    laptop: '1024px',
    laptopL: '1440px',
    desktop: '2560px'
}

export const deviceSizes = {
    mobileS: `(min-width: ${size.mobileS})`,
    mobileM: `(min-width: ${size.mobileM})`,
    mobileL: `(min-width: ${size.mobileL})`,
    tablet: `(min-width: ${size.tablet})`,
    laptop: `(min-width: ${size.laptop})`,
    laptopL: `(min-width: ${size.laptopL})`,
    desktop: `(min-width: ${size.desktop})`,
    desktopL: `(min-width: ${size.desktop})`
}


//App
export const AppWrapper = styled.div`
  display: flex;
  flex-flow: column;
  align-items: flex-start;
  height: 100%;
`
export const AppBodyWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 0 16px 0 16px;
  align-items: center;
  flex: 1;
  z-index: 1;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    padding: 0 16px 16px 16px;
  `};
`
export const HeaderWrapper = styled.div`
  ${({ theme }) => theme.flexRowNoWrap};
  width: 100%;
  justify-content: space-between;
  top: 0;
  z-index: 2;
`
export const Marginer = styled.div`
`
export const BugReportLink = styled.a`
  position: fixed;
  bottom: 1rem;
  left: 1rem;
  color: #36f;
  text-decoration: none;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    display: none;
  `}
`
export const NetworkFailedCard = styled.div`
  position: fixed;
  bottom: 3rem;
  right: 1rem;
  padding: 1rem;
  border-radius: 8px;
  background-color: #f65c5c;
  border: 1px solid #852020;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    position: unset;
    width: calc(100% - 2rem);
    left: unset;
    right: unset;
    margin-bottom: 0;
    margin-top: 0.5rem;
  `}
`
export const InternetError = styled.div`
  width: 100%;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
  h2 {
    color: white;
    font-size: 40px;
    text-align: center;
  }
`
export const GlobalStyle = createGlobalStyle`
  button {
    cursor: pointer;
  }
`

//AppBody
export const BodyWrapper = styled.div<{ margin?: string; maxWidth?: string }>`
  position: relative;
  max-width: ${({ maxWidth }) => maxWidth ?? '610px'};
  width: 100%;
  background: ${({ theme }) => theme.winterBackground};
  border-radius: 20px;
  margin: 5rem auto auto;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    margin-top: 1rem;
    border-radius: 20px;
  `}
  &::before,
  &::after {
    display: block;
    content: '';
    position: absolute;
  }

  &::after {
    right: 0;
    width: 51px;
    height: 90px;
    bottom: -45px;
  }

  &::before {
    bottom: -94px;
    width: 62px;
    height: 140px;
  }
`
