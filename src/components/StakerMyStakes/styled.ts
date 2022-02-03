import styled, { css } from 'styled-components/macro'
import { darken } from 'polished'
import { skeletonGradient } from '../../theme/styles/skeleton'

export const Stakes = styled.div`
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  overflow-x: hidden;
`
export const TokenIcon = styled.div<{ skeleton: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 35px;
  height: 35px;
  background-color: #5aa7df;
  border: 1px solid #5aa7df;
  color: #5aa7df;
  border-radius: 50%;
  user-select: none;
  ${({ skeleton }) => (skeleton ? skeletonGradient : null)}
  background-size: contain;
  background-repeat: no-repeat;

  &:nth-of-type(2) {
    margin-left: -8px;
  }
`
export const Stake = styled.div<{ navigatedTo: boolean }>`
  display: flex;
  padding: 8px 0;
  margin-bottom: 16px;
  font-family: Montserrat, sans-serif;
  width: 100%;

  & > * {
    &:not(:last-of-type) {
      max-width: calc(100% / 6);
      min-width: calc(100% / 6);
    }
  }

  ${({ theme }) => theme.mediaWidth.upToSmall`
    flex-direction: column;
    background: rgba(60, 97, 126, 0.5);
    padding: 1rem;
    border-radius: 8px;

    & > * {
      &:not(:last-of-type) {
        max-width: 100%;
        min-width: 100%;
      }
    }
  `}

  ${({ navigatedTo }) =>
          navigatedTo &&
          css`
            background-color: ${darken(0.05, 'rgba(91,183,255,0.6)')};
            border-radius: 5px;
            padding: 8px 5px;
          `}
`
export const StakeId = styled.div`
  display: flex;
  align-items: center;
  min-width: 96px !important;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    margin-bottom: 1rem;

    &::before {
      content: "ID";
      margin-right: 1rem;
    }
  `}
`
export const StakePool = styled.div`
  display: flex;
  align-items: center;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    margin-bottom: 1rem;
    &::before {
      content: "Pool";
      margin-right: 1rem;
    }
`}
`
export const StakeReward = styled.div<{ reward?: string }>`
  display: flex;
  align-items: center;

  & > ${TokenIcon} {
  }

  ${({ theme, reward }) => theme.mediaWidth.upToSmall`
  margin-bottom: 1rem;
  &::before {
    content: "${reward || 'Reward'}";
    margin-right: 1rem;
  }
`}
`
export const StakeCountdown = styled.div<{ skeleton?: boolean }>`
  font-size: 16px;
  margin: auto;
  display: flex;


  max-width: 105px !important;
  min-width: 105px !important;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    margin: 0 0 1rem 0;
    max-width: unset !important;
    min-width: unset !important;
    
     &::before {
    content: "End Time";
    margin-right: 1rem;
  }
  `}
  & > * {
    ${({ skeleton }) =>
            skeleton
                    ? css`
                      width: 80px;
                      height: 16px;
                      background: #5aa7df;
                      border-radius: 4px;

                      ${skeletonGradient}
                    `
                    : null}
  }
`
export const StakeActions = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
`
export const StakeButton = styled.button<{ skeleton?: boolean; }>`
  border: none;
  border-radius: 8px;
  padding: 8px 12px;
  background-color: ${({ skeleton, theme }) => (skeleton ? '#5aa7df' : theme.winterMainButton)};
  color: white;
  min-width: 126px;

  &:hover {
    background-color: ${({ theme }) => darken(0.05, theme.winterMainButton)};
  }

  ${({ disabled }) =>
          disabled &&
          css`
            opacity: 0.4;
            cursor: default;
          `}

  ${({ skeleton }) =>
          skeleton
                  ? css`
                    ${skeletonGradient};
                    width: 80px;
                  `
                  : null}

  ${({ theme }) => theme.mediaWidth.upToSmall`
    width: 100%;
  `}
`
export const StakeListHeader = styled.div`
  display: flex;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #202635;

  & > * {
    max-width: calc(100% / 6);
    min-width: calc(100% / 6);
    font-weight: 500;
    color: white;
  }

  ${({ theme }) => theme.mediaWidth.upToSmall`
    padding-bottom: 0;
    display: none;
    `};
`
export const TokensNames = styled.div<{ skeleton?: boolean }>`
  margin-left: .5rem;

  ${({ theme }) => theme.mediaWidth.upToMedium`
    margin-left: .2rem;
    font-size: 14px;
  `}
  & > * {
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
export const EmptyMock = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 400px;

  & > * {
    margin-bottom: 1rem;
  }
`
export const SendModal = styled.div`
  display: flex;
  flex-direction: column;
  padding: 2rem;
  width: 100%;
`
export const ModalTitle = styled.div`
  margin-bottom: 1rem;
  font-size: 18px;
  font-weight: 600;
  color: #080064;
`
export const RecipientInput = styled.input`
  padding: 8px;
  border: none;
  border-radius: 8px;
  width: 100%;
`
export const SendNFTButton = styled.button`
  padding: 10px 16px;
  width: 100%;
  color: white;
  background-color: ${({ theme }) => theme.winterMainButton};
  border-radius: 8px;
  border: none;

  &:disabled {
    opacity: 0.4;
  }
`
export const MoreButton = styled.button`
  border: none;
  background-color: transparent;
`
export const SendNFTWarning = styled.div`
  margin-bottom: 1rem;
  padding: 8px 12px;
  background: #e4e46b;
  color: #333303;
  border-radius: 8px;
`