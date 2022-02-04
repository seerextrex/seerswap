import styled from 'styled-components/macro'

export const MessageWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 20rem;
`
export const Message = styled.h2`
  color: ${({ theme }) => theme.secondary1};
`