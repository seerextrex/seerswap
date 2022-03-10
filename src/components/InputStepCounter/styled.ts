import styled from 'styled-components/macro'
import { darken } from 'polished'
import { OutlineCard } from '../Card'
import NumericalInput from '../NumericalInput'
import { ButtonGray } from '../Button'
import { TYPE } from '../../theme'

export const InputRow = styled.div``
export const SmallButton = styled(ButtonGray)`
  border-radius: 8px;
  padding: 2px 4px;
  margin-left: 10px;
  background: #759fe3;
  &:hover {
    background-color: ${darken(0.05, '#759fe3')};
  }
`
export const FocusedOutlineCard = styled(OutlineCard)<{ active?: boolean; pulsing?: boolean; initial: boolean }>`
  background-color: var(--ebony-clay);
  position: relative;
  padding: 2rem;
  border-radius: 10px;
  margin-bottom: ${({ initial }) => (initial ? '' : '1rem')};

  &:first-of-type {
    margin-right: ${({ initial }) => (initial ? '1rem' : '')};
    ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    margin: 0 0 1rem 0;
  `}
  }
`
export const StyledInput = styled(NumericalInput)<{ usePercent?: boolean }>`
  background-color: transparent;
  text-align: left;
  width: 100%;
  font-weight: 500;
  max-width: unset;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    font-size: 16px;
  `};

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    font-size: 12px;
  `};
`
export const InputTitle = styled(TYPE.small)`
  color: white;
  font-size: 12px;
  font-weight: 600;
  font-family: Montserrat, sans-serif;
`
export const ButtonLabel = styled(TYPE.white)<{ disabled: boolean }>`
  display: flex;
  color: ${({ theme, disabled }) => (disabled ? theme.text2 : theme.text1)} !important;
`
