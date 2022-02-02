import { Trans } from '@lingui/macro'
import { ReactNode } from 'react'
import { StyledToggle, BaseToggleElement } from './styled'

interface ToggleProps {
  id?: string
  isActive: boolean
  toggle: () => void
  checked?: ReactNode
  unchecked?: ReactNode
}

export default function Toggle({
  id,
  isActive,
  toggle,
  checked = <Trans>On</Trans>,
  unchecked = <Trans>Off</Trans>,
}: ToggleProps) {
  return (
    <StyledToggle id={id} isActive={isActive} onClick={toggle}>
      <BaseToggleElement isActive={isActive} isOnSwitch={true}>
        {checked}
      </BaseToggleElement>
      <BaseToggleElement isActive={!isActive} isOnSwitch={false}>
        {unchecked}
      </BaseToggleElement>
    </StyledToggle>
  )
}
