import styled from 'styled-components/macro'
import { darken } from 'polished'

export const CautionModalInner = styled.div`
  padding: 2rem;
  line-height: 26px;
  color: #080064;
`
export const CautionList = styled.ul`
  list-style: decimal;
`
export const CautionListItem = styled.li`
  margin-bottom: 1rem;
`
export const AgreeButton = styled.button`
  background-color: #36f;
  color: white;
  padding: 12px 16px;
  width: 100%;
  margin-top: 1rem;
  border-radius: 10px;
  text-transform: uppercase;
  font-size: 16px;
  font-weight: 600;
  border: none;

  &:hover {
    background-color: ${darken(0.1, '#36f')};
  }
`