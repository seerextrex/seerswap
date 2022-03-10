import styled, { css, keyframes } from 'styled-components/macro'
import { NavLink } from 'react-router-dom'
import { darken } from 'polished'

const pulsating = (color: string) => keyframes`
  0% {
    border-color: rgba(32, 38, 53, 1);
  }
  50% {
    border-color: rgba(167, 10, 255, 1);
  }
  100% {
    border-color: rgba(32, 38, 53, 1);
  }
`
export const PageWrapper = styled.div`
  max-width: 900px;
  width: 100%;
  background-color: ${({ theme }) => theme.winterBackground};
  border-radius: 20px;
  margin-top: 5rem;
  margin-bottom: 5rem;

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    margin-top: 1rem;
    margin-bottom: 4rem;
  `}
`
export const Navigation = styled(NavLink)`
  display: flex;
  align-items: center;
  text-decoration: none;
  color: white;
  font-size: 16px;
  font-weight: 600;
`
export const LiquidityWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 2rem;
  border-radius: 20px;
  background-color: ${({ theme }) => theme.winterBackground};
`
export const TokenPair = styled.div`
  display: flex;
  width: 100%;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    flex-direction: column;
  `}
`
export const TokenItem = styled.div<{ noPadding?: boolean; highPrice?: boolean }>`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  background-color: var(--ebony-clay);
  ${({ noPadding }) =>
    !noPadding &&
    css`
      padding: 1rem;
      // border: 1px solid #202635;
    `}
  border-radius: 1rem;

  &:first-of-type {
    margin-right: 0.5rem;
  }

  &:last-of-type {
    margin-left: 0.5rem;
  }

  ${({ highPrice }) =>
    highPrice &&
    css`
      // border-color: #d33636;
      border-radius: 1rem 1rem 0 0;
    `}
  ${({ theme }) => theme.mediaWidth.upToSmall`
    margin: 0 0 1rem 0!important;
    padding: 1rem 1rem 2rem 1rem;
  `}
`
export const TokenItemBottomInputWrapper = styled.div`
  display: flex;

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    height: 60px;
  `}
`
export const MaxButton = styled.button`
  position: absolute;
  right: 1rem;
  top: 19px;
  border: none;
  border-radius: 6px;
  padding: 8px 12px;
  background: ${({ theme }) => theme.winterMainButton};
  color: white;
  font-family: Montserrat, sans-serif;
  font-weight: 600;
  z-index: 10;

  &:hover {
    background-color: ${({ theme }) => darken(0.05, theme.winterMainButton)};
  }
`
export const PoolInfo = styled.div`
  display: flex;
  margin-top: 1rem;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    flex-direction: column;
  `}
`
export const PoolInfoItem = styled.div<{ pulse: boolean }>`
  position: relative;
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: 1rem;
  border-radius: 8px;
  background-color: rgba(60, 97, 126, 0.5);

  animation: ${({ pulse }) => pulse && pulsating('red')} 3s linear infinite;

  &:first-of-type {
    margin-right: 0.5rem;
  }

  &:last-of-type {
    margin-left: 0.5rem;
  }

  ${({ theme }) => theme.mediaWidth.upToSmall`
    margin: 5px 0!important;
    flex-direction: column;
  `}
`
export const PoolInfoItemTitle = styled.span`
  font-family: Montserrat, sans-serif;
  font-weight: 600;
  white-space: nowrap;
  margin-right: 10px;
  ${({ theme }) => theme.mediaWidth.upToSmall`
  margin: 2px 5px 0 0;
  `}
`
export const PoolInfoItemValue = styled.span`
  font-family: Montserrat, sans-serif;
  margin-right: 10px;
  white-space: nowrap;
`
export const PoolInfoItemValueMetric = styled.span`
  color: white;
  font-size: 12px;
  line-height: 21px;
  white-space: nowrap;
`
export const TechPaperHint = styled.div`
  z-index: 10;
  position: absolute;
  display: flex;
  visibility: hidden;
  flex-direction: column;
  background-color: ${({ theme }) => theme.winterBackground};
  padding: 1rem;
  border-radius: 8px;
  color: white;
  right: 1rem;
  top: 100%;
  margin-top: -8px;
  box-shadow: 0 0 10px rgba(156, 126, 220);
  opacity: 0;
  transition-duration: 0.2s;
  cursor: default;

  &:before {
    content: '';
    width: 100%;
    height: 30px;
    position: absolute;
    top: 0;
    left: 0;
    margin-top: -20px;
  }
`
export const TechPaperHintTitle = styled.div``
export const TechPaperDownloadButton = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  background-color: ${({ theme }) => theme.winterMainButton};
  color: white;
  border: none;
  border-radius: 6px;
  padding: 6px;
  text-decoration: none;

  &:hover {
    background-color: ${({ theme }) => darken(0.05, theme.winterMainButton)}
  }
}`
export const HelperCirlce = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  background-color: ${({ theme }) => theme.winterMainButton};
  color: white;
  font-size: 12px;
  cursor: pointer;

  &:hover {
    & > ${TechPaperHint} {
      visibility: visible;
      opacity: 1;
    }
  }
`
export const Title = styled.div`
  position: relative;
  font-size: 18px;
  font-family: Montserrat, sans-serif;
  font-weight: 600;
  padding: 1rem 0;
  margin-top: 1rem;
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
   margin-top: 1rem;
  `}
`
export const Warning = styled.div`
  position: absolute;
  right: 0;
  padding: 8px 16px;
  top: 10px;
  font-size: 13px;
  background: #69270d;
  color: #e55d47;
  border-radius: 6px;
  font-weight: 500;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    top: -1rem;
  `}
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    position: relative;
    width: 100%;
    text-align: center;
    margin-bottom: .4rem;
  `}
`
export const Error = styled(Warning)`
  color: #F55755;
  background-color: transparent;
  border: 1px solid #F55755;
  width: 100%;
  text-align: center;
`
export const PriceRangeWrapper = styled.div`
  display: flex;
  width: 100%;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    flex-direction: column;
  `}
`
export const PriceRangeInputs = styled.div<{ initial: boolean }>`
  height: 100%;
  flex: 1;
  margin-left: ${({ initial }) => (initial ? '0' : '1rem')};
  ${({ theme }) => theme.mediaWidth.upToSmall`
   margin: 1rem 0 0 0;
  `}
`
export const ButtonsWrapper = styled.div`
  display: flex;

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    flex-direction: column;
  `}
`
export const AddLiquidityButton = styled.button<{ disabled?: boolean }>`
  display; flex;
  align-items: center;
  padding: 8px 16px;
  height: 2.8rem;
  background: ${({ theme }) => theme.winterMainButton};
  cursor: pointer;
  color: white;
  border: medium none;
  border-radius: 10px;
  font-size: 16px;
  font-family: Montserrat, sans-serif;
  margin-left: auto;
  white-space: nowrap;

  &:disabled {
    display; flex;
    align-items: center;
    background-color: ${({ theme }) => darken(0.2, theme.winterMainButton)};
    color: ${darken(0.35, 'white')};
    font-weight: 600;
  }

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    width: 100%;
    margin-left: unset;
  `}
`
export const FullRangeButton = styled.button`
  width: 100%;
  background: ${({ theme }) => theme.winterMainButton};
  color: white;
  border: none;
  font-family: Montserrat, sans-serif;
  font-weight: 600;
  border-radius: 6px;
  padding: 7px;

  &:hover {
    background-color: ${({ theme }) => darken(0.05, theme.winterMainButton)};
  }
`
export const ApproveButton = styled.button`
  background: ${({ theme }) => theme.winterMainButton};
  padding: 10px;
  border-radius: 8px;
  border: none;
  margin: 25px auto auto;
  width: 100%;
  color: white;

  &:hover {
    background-color: ${({ theme }) => darken(0.05, theme.winterMainButton)};
  }
`
export const PairNotSelectedMock = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 451px;
`
export const ApproveButtonContainer = styled.div`
  margin-top: 1rem;
`
