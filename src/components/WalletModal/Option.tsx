import React from 'react'
import { ExternalLink } from '../../theme'
import {
  OptionCardLeft,
  OptionCardClickable,
  GreenCircle,
  CircleWrapper,
  HeaderText,
  SubHeader,
  IconWrapper
} from './styled'


export default function Option({
                                 link = null,
                                 clickable = true,
                                 size,
                                 onClick = null,
                                 color,
                                 header,
                                 subheader = null,
                                 icon,
                                 active = false,
                                 id
                               }: {
  link?: string | null
  clickable?: boolean
  size?: number | null
  onClick?: null | (() => void)
  color: string
  header: React.ReactNode
  subheader: React.ReactNode | null
  icon: string
  active?: boolean
  id: string
}) {
  const content = (
    <OptionCardClickable id={id} onClick={onClick} clickable={clickable && !active} active={active}>
      <OptionCardLeft>
        <HeaderText color={color}>
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
        </HeaderText>
        {subheader && <SubHeader>{subheader}</SubHeader>}
      </OptionCardLeft>
      <IconWrapper size={size}>
        <img src={icon} alt={'Icon'} />
      </IconWrapper>
    </OptionCardClickable>
  )
  if (link) {
    return <ExternalLink href={link}>{content}</ExternalLink>
  }

  return content
}
