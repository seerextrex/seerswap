import React from 'react'
import { ExternalLink } from '../../theme'
import { CircleWrapper, GreenCircle, IconWrapper } from './styled'

interface OptionProps {
    link?: string | null
    clickable?: boolean
    size?: number | null
    onClick?: any
    color: string
    header: React.ReactNode
    subheader: React.ReactNode | null
    icon: string
    active?: boolean
    id: string
}

export default function Option({ link = null, clickable = true, size, onClick = null, color, header, subheader = null, icon, active = false, id }: OptionProps) {
    const content = (
        <button className={'btn primary bg-ecl flex-s-between w-100 p-1'} id={id} onClick={onClick} data-clickable={clickable && !active}>
            <div className={'f f-jc f-ac h-100'}>
                <div color={color}>
                    {active ? (
                        <CircleWrapper>
                            <GreenCircle>
                                <div />
                            </GreenCircle>
                        </CircleWrapper>
                    ) : (
                        ''
                    )}
                    {header}
                </div>
                {subheader && <div className={'fs-075 ml-05'}>{subheader}</div>}
            </div>
            <IconWrapper size={size}>
                <img src={icon} alt={'Icon'} />
            </IconWrapper>
        </button>
    )
    if (link) {
        return <ExternalLink href={link}>{content}</ExternalLink>
    }

    return content
}
