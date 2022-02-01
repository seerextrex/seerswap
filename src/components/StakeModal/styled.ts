import styled, { css, keyframes } from 'styled-components/macro'
import { darken } from 'polished'
import gradient from 'random-gradient'

const skeletonAnimation = keyframes`
  100% {
    transform: translateX(100%);
  }
`
const skeletonGradient = css`
  position: relative;
  overflow: hidden;

  &::after {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    transform: translateX(-100%);
    background-image: linear-gradient(90deg,
    rgba(91, 105, 141, 0) 0,
    rgba(91, 105, 141, 0.2) 25%,
    rgba(91, 105, 141, 0.5) 60%,
    rgba(91, 105, 141, 0));
    animation-name: ${skeletonAnimation};
    animation-duration: 1.5s;
    animation-iteration-count: infinite;
    content: '';
  }
`
export const ModalWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 1rem;
  color: #080064;
`
export const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 1rem;
`
export const CloseModalButton = styled.button`
  background: transparent;
  border: none;
`
export const ModalBody = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 400px;
  max-height: 400px;
  overflow: auto;
`
export const NFTPositionsRow = styled.div`
  width: 100%;
  margin-bottom: 8px;
`
export const NFTPosition = styled.div<{ selected: boolean }>`
  display: inline-flex;
  cursor: pointer;
  position: relative;
  width: calc(33% - 8px);
  border-radius: 1rem;
  border: 1px solid ${({ selected }) => (selected ? '#3970FF' : 'rgba(60, 97, 126, 0.5)')};
  padding: 8px;
  margin-right: 9px;
  transition-duration: 0.2s;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    width: calc(50% - 5px);
    margin-bottom: 5px;
    &:nth-of-type(2n) {
      margin-right: 0;
    }
  `}
`
export const NFTPositionSelectCircle = styled.div<{ selected: boolean }>`
  position: absolute;
  width: 20px;
  height: 20px;
  top: 8px;
  right: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition-duration: .2s;
  border: 1px solid ${({ selected }) => (selected ? '#3970FF' : 'rgba(60, 97, 126, 0.5)')};
  background-color: ${({ selected }) => (selected ? '#3970FF' : 'transparent')}
`
export const NFTPositionIcon = styled.div<{ skeleton: boolean; name: string }>`
  width: 45px;
  height: 45px;
  border-radius: 50%;
  background: ${({ name }) => (name ? gradient('token' + name) : '')};
  ${({ skeleton }) =>
          skeleton &&
          css`
            background: rgba(60, 97, 126, 0.5);
            ${skeletonGradient}
          `};
`
export const NFTPositionDescription = styled.div<{ skeleton: boolean }>`
  margin-left: 10px;
  line-height: 22px;

  ${({ skeleton }) =>
          skeleton &&
          css`
            & > * {
              background: rgba(60, 97, 126, 0.5);
              border-radius: 6px;
              ${skeletonGradient}
            }

            & > ${NFTPositionIndex} {
              height: 18px;
              width: 40px;
              margin-bottom: 3px;
              margin-top: 2px;
            }

            & > ${NFTPositionLink} {
              height: 13px;
              width: 60px;
              display: inline-block;
            }
          `}
`
export const NFTPositionIndex = styled.div``
export const NFTPositionLink = styled.a`
  font-size: 13px;
`
export const StakeButton = styled.button`
  background: ${({ theme }) => theme.winterMainButton};
  border: none;
  padding: 1rem;
  color: white;
  border-radius: 8px;

  &:hover {
    background: ${({ theme }) => darken(0.05, theme.winterMainButton)};
  }

  &:disabled {
    background: ${({ theme }) => theme.winterDisabledButton};
    cursor: default;
  }
`
export const StakeButtonLoader = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
`
export const EmptyMock = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 350px;
  align-items: center;
  justify-content: center;
`