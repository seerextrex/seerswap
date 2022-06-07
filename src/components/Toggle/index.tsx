import { Trans } from '@lingui/macro'
import { ReactNode } from 'react'
import './index.scss'

interface ToggleProps {
    id?: string
    isActive: boolean
    toggle: () => void
    checked?: ReactNode
    unchecked?: ReactNode
}

export default function Toggle({ id, isActive, toggle, checked = <Trans>On</Trans>, unchecked = <Trans>Off</Trans> }: ToggleProps) {
    return (
        <button className={'toggle-button f br-12'} id={id} onClick={toggle}>
            <span className={'br-8 c-w hover-op trans-op'} data-isactive={isActive}>
                {checked}
            </span>
            <span className={'br-8 c-w hover-op trans-op'} data-isactive={!isActive}>
                {unchecked}
            </span>
        </button>
    )
}
