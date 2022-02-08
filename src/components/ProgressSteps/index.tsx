import { useContext } from 'react'
import { ThemeContext } from 'styled-components/macro'
import { TYPE } from '../../theme'
import { Circle, CircleRow, Grouping, Wrapper } from './styled'

interface ProgressCirclesProps {
    steps: boolean[]
    disabled?: boolean
}

/**
 * Based on array of steps, create a step counter of circles.
 * A circle can be enabled, disabled, or confirmed. States are derived
 * from previous step.
 *
 * An extra circle is added to represent the ability to swap, add, or remove.
 * This step will never be marked as complete (because no 'txn done' state in body ui).
 *
 * @param steps  array of booleans where true means step is complete
 */
export default function ProgressCircles({
    steps,
    disabled = false,
    ...rest
}: ProgressCirclesProps) {
    const theme = useContext(ThemeContext)

    return (
        <Wrapper justify={'center'} {...rest}>
            <Grouping>
                {steps.map((step, i) => {
                    return (
                        <CircleRow key={i}>
                            <Circle confirmed={step}
                                    disabled={disabled || (!steps[i - 1] && i !== 0)}>
                                {step ? '✓' : i + 1 + '.'}
                            </Circle>
                            <TYPE.main color={theme.text4}>|</TYPE.main>
                        </CircleRow>
                    )
                })}
                <Circle
                    disabled={disabled || !steps[steps.length - 1]}>{steps.length + 1 + '.'}</Circle>
            </Grouping>
        </Wrapper>
    )
}
