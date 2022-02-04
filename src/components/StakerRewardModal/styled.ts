import styled from 'styled-components/macro'
import { stringToColour } from '../../utils/stringToColour'

export const ModalWrapper = styled.div`
  display: flex;
  width: 100%;
`
export const ModalHeader = styled.div`
  display: flex;
  width: 100%;
`
export const RewardTokenIcon = styled.div<{ name?: any }>`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  margin-right: 1rem;
  width: 35px;
  height: 35px;
  background-color: ${({ name }) => (name ? stringToColour(name).background : '#3d4a6a')};
  border: 1px solid ${({ name }) => (name ? stringToColour(name).border : '#3d4a6a')};
  color: ${({ name }) => (name ? stringToColour(name).text : '#3d4a6a')};
`
export const RewardTokenInfo = styled.div`
  & > * {
    font-family: Montserrat, sans-serif;
    font-size: 15px;
  }
`
export const ClaimRewardButton = styled.button`
  border: none;
  border-radius: 8px;
  background-color: #4829bb;
  color: white;
  margin-left: auto;
  padding: 8px 16px;
`
