import styled from 'styled-components/macro'

export const QuestionWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  width: 18px;
  height: 18px;
  border: none;
  outline: none;
  cursor: default;
  border-radius: 36px;
  font-size: 12px;
  background-color: var(--primary-hover);
  color: white;

  :hover,
  :focus {
    opacity: 0.7;
  }
`
export const QuestionMark = styled.span`
  font-size: 14px;
`
