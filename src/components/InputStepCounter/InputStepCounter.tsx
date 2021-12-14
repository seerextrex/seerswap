import { useState, useCallback, useEffect, ReactNode } from 'react'
import { OutlineCard } from 'components/Card'
import { Input as NumericalInput } from '../NumericalInput'
import styled, { keyframes } from 'styled-components/macro'
import { TYPE } from 'theme'
import { AutoColumn } from 'components/Column'
import { ButtonGray } from 'components/Button'
import { FeeAmount } from 'lib/src'
import { Trans } from '@lingui/macro'
import { Plus, Minus } from 'react-feather'
import { darken } from 'polished'

const pulse = (color: string) => keyframes`
  0% {
    box-shadow: 0 0 0 0 ${color};
  }

  70% {
    box-shadow: 0 0 0 2px ${color};
  }

  100% {
    box-shadow: 0 0 0 0 ${color};
  }
`

const InputRow = styled.div``

const SmallButton = styled(ButtonGray)`
  border-radius: 8px;
  padding: 2px 4px;
  margin-left: 10px;
  background: #759fe3;
  &:hover {
    background-color: ${darken(0.001, '#0f2e40')};
  }
`

const FocusedOutlineCard = styled(OutlineCard)<{ active?: boolean; pulsing?: boolean }>`
  background-color: unset;
  position: relative;
  padding: 1rem;
  border-radius: 10px;
  border: 1px solid #202635;
  margin-bottom: ${({ initial }) => (initial ? '' : '1rem')};

  &:first-of-type {
    margin-right: ${({ initial }) => (initial ? '1rem' : '')};
  }
`

const StyledInput = styled(NumericalInput)<{ usePercent?: boolean }>`
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

const InputTitle = styled(TYPE.small)`
  color: ${({ theme }) => theme.text2};
  font-size: 12px;
  font-weight: 600;
  font-family: Montserrat;
`

const ButtonLabel = styled(TYPE.white)<{ disabled: boolean }>`
  display: flex;
  color: ${({ theme, disabled }) => (disabled ? theme.text2 : theme.text1)} !important;
`

interface StepCounterProps {
  value: string
  onUserInput: (value: string) => void
  decrement: () => string
  increment: () => string
  decrementDisabled?: boolean
  incrementDisabled?: boolean
  feeAmount?: FeeAmount
  label?: string
  width?: string
  locked?: boolean // disable input
  title: ReactNode
  tokenA: string | undefined
  tokenB: string | undefined
  initial: boolean
  disabled: boolean
}

const StepCounter = ({
  value,
  decrement,
  increment,
  decrementDisabled = false,
  incrementDisabled = false,
  width,
  locked,
  onUserInput,
  title,
  tokenA,
  tokenB,
  initial,
  disabled,
}: StepCounterProps) => {
  //  for focus state, styled components doesnt let you select input parent container
  const [active, setActive] = useState(false)

  // let user type value and only update parent value on blur
  const [localValue, setLocalValue] = useState('')
  const [useLocalValue, setUseLocalValue] = useState(false)

  // animation if parent value updates local value
  const [pulsing, setPulsing] = useState<boolean>(false)

  const handleOnFocus = () => {
    setUseLocalValue(true)
    setActive(true)
  }

  const handleOnBlur = useCallback(() => {
    setUseLocalValue(false)
    setActive(false)
    onUserInput(localValue) // trigger update on parent value
  }, [localValue, onUserInput])

  // for button clicks
  const handleDecrement = useCallback(() => {
    setUseLocalValue(false)
    onUserInput(decrement())
  }, [decrement, onUserInput])

  const handleIncrement = useCallback(() => {
    setUseLocalValue(false)
    onUserInput(increment())
  }, [increment, onUserInput])

  useEffect(() => {
    if (localValue !== value && !useLocalValue) {
      setTimeout(() => {
        setLocalValue(value) // reset local value to match parent
        setPulsing(true) // trigger animation
        setTimeout(function () {
          setPulsing(false)
        }, 1800)
      }, 0)
    }
  }, [localValue, useLocalValue, value])

  return (
    <FocusedOutlineCard initial={initial} active={active} onFocus={handleOnFocus} onBlur={handleOnBlur} width={width}>
      <AutoColumn gap="6px">
        <div style={{ display: 'flex', position: 'absolute', right: '1rem' }}>
          {!locked && (
            <SmallButton onClick={handleDecrement} disabled={decrementDisabled || disabled}>
              <ButtonLabel disabled={decrementDisabled || disabled} fontSize="12px">
                <Minus size={18} />
              </ButtonLabel>
            </SmallButton>
          )}

          {!locked && (
            <SmallButton onClick={handleIncrement} disabled={incrementDisabled || disabled}>
              <ButtonLabel disabled={incrementDisabled || disabled} fontSize="12px">
                <Plus size={18} />
              </ButtonLabel>
            </SmallButton>
          )}
        </div>

        <InputTitle fontSize={16} textAlign="left">
          {title}
        </InputTitle>

        <InputRow style={{ marginTop: '8px' }}>
          <StyledInput
            className="rate-input-0"
            value={localValue}
            fontSize="20px"
            disabled={disabled || locked}
            onUserInput={(val) => {
              setLocalValue(val.trim())
            }}
          />
        </InputRow>
      </AutoColumn>
    </FocusedOutlineCard>
  )
}

export default StepCounter
