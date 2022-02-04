import styled from 'styled-components/macro'
import { darken } from 'polished'

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 400px;
`
export const RequestButton = styled.a`
  border: none;
  border-radius: 8px;
  background-color: ${({ theme }) => theme.winterMainButton};
  padding: 8px 16px;
  color: white;
  text-decoration: none;
  display: flex;
  justify-content: center;

  &:hover {
    background-color: ${({ theme }) => darken(0.05, theme.winterMainButton)};
  }

`
