import styled from 'styled-components/macro'
import { X } from 'react-feather'

export const  ModalContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 1rem;
  width: 100%;
  background-color: ${({ theme }) => theme.bg2};
  border-radius: 20px;
`
export const  StyledCloseIcon = styled(X)`
  height: 20px;
  width: 20px;
  :hover {
    cursor: pointer;
  }

  > * {
    stroke: ${({ theme }) => theme.text1};
  }
`