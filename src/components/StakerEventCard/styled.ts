import styled, { css, keyframes } from 'styled-components/macro'
import { stringToColour } from '../../utils/stringToColour'
import { darken } from 'polished'

const  skeletonAnimation = keyframes`
  100% {
    transform: translateX(100%);
  }
`
const  skeletonGradient = css`
  position: relative;
  overflow: hidden;
  &::after {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    transform: translateX(-100%);
    background-image: linear-gradient(
      90deg,
      rgba(91, 105, 141, 0) 0,
      rgba(94, 131, 225, 0.25) 25%,
      rgba(94, 131, 225, 0.5) 60%,
      rgba(91, 105, 141, 0)
    );
    animation-name: ${skeletonAnimation};
    animation-duration: 1.5s;
    animation-iteration-count: infinite;
    content: '';
  }
`
export const  LoadingShim = styled.div`
  display: flex;
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 5;
`
export const  Card = styled.div<{refreshing?: boolean; skeleton?: boolean}>`
  display: flex;
  position: relative;
  flex-direction: column;
  padding: 1rem;
  border-radius: 1rem;
  background: rgba(60, 97, 126, 0.5);
  width: calc(33% - 8px);

  ${({ refreshing }) =>
  refreshing
    ? css`
          & > * {
            &:not(${LoadingShim}) {
              opacity: 0.4;
            }
          }
        `
    : null}

  ${({ theme }) => theme.mediaWidth.upToSmall`{
    width: 100%;
    margin-bottom: 1rem;
  }`}

  ${({ skeleton }) =>
  skeleton &&
  css`
      background-color: #89c4ef;
    `}
`
export const  CardHeader = styled.div`
  display: flex;
  margin-bottom: 1rem;
`
export const  TokenIcon = styled.div<{name?: string; logo?: string; skeleton: boolean}>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 35px;
  height: 35px;
  background-color: ${({ name }) => (name ? stringToColour(name).background : '#5aa7df')};
  border: 1px solid ${({ name }) => (name ? stringToColour(name).border : '#5aa7df')};
  color: ${({ name }) => (name ? stringToColour(name).text : '#5aa7df')};
  border-radius: 50%;
  user-select: none;
  background: ${({ logo }) => (logo ? `url(${logo})` : '')};
  background-repeat: no-repeat;
  background-size: contain;

  &:last-of-type {
    margin-left: -9px;
  }

  ${({ skeleton }) => (skeleton ? skeletonGradient : null)}
`
export const  TokensIcons = styled.div`
  display: flex;
  margin-right: 1rem;
`
export const  Subtitle = styled.div<{skeleton?: boolean}>`
  color: white;
  text-transform: uppercase;
  font-size: 12px;
  font-weight: 600;

  ${({ skeleton }) =>
  skeleton
    ? css`
          width: 50px;
          height: 15.2px;
          background-color: #5aa7df;
          border-radius: 6px;
          margin-bottom: 3px;

          ${skeletonGradient}
        `
    : null}
`
export const  PoolsSymbols = styled.div<{skeleton?: boolean}>`
  ${({ skeleton }) =>
  skeleton
    ? css`
          background: #5aa7df;
          border-radius: 6px;
          height: 16.2px;

          ${skeletonGradient}
        `
    : null}
`
export const  RewardWrapper = styled.div<{skeleton?: boolean}>`
  display: flex;
  padding: 8px;
  background-color: #2b5e91;
  border-radius: 8px;
  margin-bottom: 1rem;

  ${Subtitle} {
    color: #6bc5e1;
  }

  ${({ skeleton }) =>
  skeleton
    ? css`
          background-color: #5aa7df;
          border: 1px solid #5aa7df;

          ${skeletonAnimation}
        `
    : null}
`
export const  RewardAmount = styled.div<{skeleton?: boolean; title?: number | string}>`
  margin: auto 0 auto auto;
  font-size: 18px;

  ${({ skeleton }) =>
  skeleton
    ? css`
          background-color: #5aa7df;
          width: 70px;
          height: 19.2px;
          border-radius: 6px;

          ${skeletonGradient}
        `
    : null}
`
export const  RewardSymbol = styled.div<{skeleton?: boolean}>`
  ${({ skeleton }) =>
  skeleton
    ? css`
          background-color: #5aa7df;
          height: 16.2px;
          width: 50px;
          border-radius: 6px;
          ${skeletonGradient}
        `
    : null}
`
export const  StakeInfo = styled.div<{active: boolean}>`
  display: flex;
  margin-bottom: ${({ active }) => (active ? '10px' : '1rem')};
  justify-content: space-between;
`
export const  StakeDate = styled.div<{skeleton?: boolean}>`
  ${({ skeleton }) =>
  skeleton
    ? css`
          width: 100px;
          height: 16.2px;
          background-color: #5aa7df;
          border-radius: 6px;

          &:not(:last-of-type) {
            margin-bottom: 3px;
          }
          ${skeletonGradient}
        `
    : null}
`
export const  EventProgress = styled.div<{skeleton?: boolean}>`
  width: 100%;
  height: 16px;
  margin-top: 6px;
  border-radius: 6px;
  background-color: white;
  position: relative;
  padding: 4px;

  ${({ skeleton }) =>
  skeleton
    ? css`
          background-color: #5aa7df;
          margin-top: 3px;
          ${skeletonGradient}
        `
    : null}
`
export const  EventEndTime = styled.div<{skeleton?: boolean}>`
  line-height: 16px;
  font-size: 13px;
  position: relative;
  text-align: center;
  margin-bottom: 3px;

  ${({ skeleton }) =>
  skeleton
    ? css`
          & > span {
            display: inline-block;
            border-radius: 6px;
            background-color: #5aa7df;
            height: 13px;
            width: 100px;
            ${skeletonGradient}
          }
        `
    : null}
`
export const  EventProgressInner = styled.div.attrs(({ progress }) => ({
  style: {
    width: `${progress}%`,
  },
}))`
  height: 100%;
  background-color: #5bb7ff;
  border-radius: 6px;
  transition-duration: 0.5s;

  ${skeletonGradient}
`
export const  StakeButton = styled.button<{skeleton: boolean}>`
  width: 100%;
  border: none;
  background: ${({ theme }) => theme.winterMainButton};
  color: white;
  border-radius: 8px;
  padding: 8px 12px;
  font-weight: 500;
  margin-top: 10px;

  &:hover {
    background-color: ${({ theme }) => darken(0.05, theme.winterMainButton)};
  }
  ${({ skeleton }) =>
  skeleton
    ? css`
          background-color: #5aa7df;
          height: 32px;
          ${skeletonGradient};
        `
    : null}
`