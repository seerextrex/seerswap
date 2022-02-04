import styled, { keyframes } from 'styled-components/macro'

const spinAnimation = keyframes`
  100% {
    transform: rotate(360deg);
  }
`
export const Title = styled.div`
  display: flex;
  align-items: center;
  font-size: 21px;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #2a7ed2;
`
export const TitleName = styled.span`
  margin-right: 1rem;
`
export const ReloadButton = styled.button<{ refreshing: boolean }>`
  background-color: transparent;
  border: none;
  animation: ${({ refreshing }) => refreshing ? spinAnimation : ''} infinite 3s;
  cursor: pointer;
  &:disabled {
    opacity: 0.5;
    cursor: default;
  }
`
