import styled, { css } from 'styled-components/macro'
import { darken } from 'polished'
import { skeletonGradient } from '../../theme/styles/skeleton'

export const  LoadingShim = styled.div`
  display: flex;
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 5;
`
export const  Rewards = styled.div`
  display: flex;
  flex-direction: column;
  max-height: 450px;
  min-height: 450px;
  border-radius: 8px;
  overflow: auto;
`
export const  RewardsRow = styled.div`
  display: flex;
  margin-bottom: 8px;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    flex-direction: column;
  `}
`
export const  Reward = styled.div<{ refreshing?: boolean; skeleton?: boolean }>`
  display: flex;
  position: relative;
  padding: 8px 16px;
  border-radius: 16px;
  border: 1px solid rgba(60, 97, 126, 0.5);
  font-family: Montserrat, sans-serif;
  width: calc(33% - 4px);
  height: 55px;
  background: rgba(60, 97, 126, 0.5);

  & > * {
    &:not(${LoadingShim}) {
      opacity: ${({ refreshing }) => (refreshing ? '0.5' : '1')};
    }
  }

  &:not(:nth-of-type(3n)) {
    margin-right: 8px;
  }
  ${({ theme }) => theme.mediaWidth.upToSmall`
     width: 100%;
     margin-bottom: 20px;
     &:not(:nth-of-type(3n)) {
      margin-right: 0;
    }
  `}

  ${({ skeleton }) =>
  skeleton &&
  css`
      background-color: #89c4ef;
      border: none;
    `}
`
export const  RewardTokenIcon = styled.div<{skeleton?: boolean}>`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  margin-right: 1rem;
  width: 35px;
  height: 35px;
  background-color: #5aa7df;
  border: 1px solid #5aa7df;
  color: #5aa7df;
  background-size: contain;

  ${({ skeleton }) => (skeleton ? skeletonGradient : null)}
`
export const  RewardTokenInfo = styled.div<{skeleton?: boolean}>`
  & > * {
    font-family: Montserrat, sans-serif;
    font-size: 15px;
    ${({ skeleton }) =>
  skeleton
    ? css`
            width: 40px;
            height: 16px;
            background: #5aa7df;
            margin-bottom: 3px;
            border-radius: 4px;
            ${skeletonGradient}
          `
    : null}
  }
`
export const  RewardClaimButton = styled.button<{skeleton?: boolean}>`
  border: none;
  border-radius: 8px;
  background-color: ${({ theme }) => theme.winterMainButton};
  color: white;
  margin: 0 0 0 auto;
  padding: 8px 12px;
  cursor: pointer;
  font-family: Montserrat, sans-serif;
  min-width: 60px;

  ${({ skeleton }) =>
  skeleton
    ? css`
          width: 60px;
          background-color: #5aa7df;
          ${skeletonGradient};
        `
    : null}
  &:hover {
    background-color: ${({ theme }) => darken(0.05, theme.winterMainButton)};
  }
  &:disabled {
    opacity: 0.4;
    cursor: default;
  }
`
export const  EmptyMock = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 400px;

  & > * {
    margin-bottom: 1rem;
  }
`