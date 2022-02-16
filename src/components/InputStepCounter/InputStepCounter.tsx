import { ReactNode, useCallback, useEffect, useState } from 'react'
import { AutoColumn } from 'components/Column'
import { FeeAmount } from 'lib/src'
import { Minus, Plus } from 'react-feather'
import { ButtonLabel, FocusedOutlineCard, InputRow, InputTitle, SmallButton, StyledInput } from './styled'


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
    initial,
    disabled
}: StepCounterProps) => {
    //  for focus state, styled components doesnt let you select input parent container
    const [active, setActive] = useState(false)

    // let user type value and only update parent value on blur
    const [localValue, setLocalValue] = useState('')
    const [useLocalValue, setUseLocalValue] = useState(false)

    // animation if parent value updates local value
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
            }, 0)
        }
    }, [localValue, useLocalValue, value])

    return (
        <FocusedOutlineCard initial={initial} active={active} onFocus={handleOnFocus}
                            onBlur={handleOnBlur} width={width}>
            <AutoColumn gap='6px'>
                <div style={{ display: 'flex', position: 'absolute', right: '1rem' }}>
                    {!locked && (
                        <SmallButton onClick={handleDecrement}
                                     disabled={decrementDisabled || disabled}>
                            <ButtonLabel disabled={decrementDisabled || disabled} fontSize='12px'>
                                <Minus size={18} />
                            </ButtonLabel>
                        </SmallButton>
                    )}

                    {!locked && (
                        <SmallButton onClick={handleIncrement}
                                     disabled={incrementDisabled || disabled}>
                            <ButtonLabel disabled={incrementDisabled || disabled} fontSize='12px'>
                                <Plus size={18} />
                            </ButtonLabel>
                        </SmallButton>
                    )}
                </div>

                <InputTitle fontSize={16} textAlign='left'>
                    {title}
                </InputTitle>

                <InputRow style={{ marginTop: '8px' }}>
                    <StyledInput
                        className='rate-input-0'
                        value={localValue}
                        fontSize='20px'
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
