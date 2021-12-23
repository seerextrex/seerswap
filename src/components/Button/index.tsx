import styled from 'styled-components/macro'
import { darken } from 'polished'

import { RowBetween } from '../Row'
import { ChevronDown, Check } from 'react-feather'
import { Button as RebassButton, ButtonProps as ButtonPropsOriginal } from 'rebass/styled-components'
import useTheme from 'hooks/useTheme'

type ButtonProps = Omit<ButtonPropsOriginal, 'css'>

const Base = styled(RebassButton)<
  {
    padding?: string
    width?: string
    $borderRadius?: string
    altDisabledStyle?: boolean
  } & ButtonProps
>`
  padding: ${({ padding }) => padding ?? '16px'};
  width: ${({ width }) => width ?? '100%'};
  font-weight: 500;
  text-align: center;
  border-radius: ${({ $borderRadius }) => $borderRadius ?? '20px'};
  outline: none;
  border: 1px solid transparent;
  color: white;
  text-decoration: none;
  display: flex;
  justify-content: center;
  flex-wrap: nowrap;
  align-items: center;
  cursor: pointer;
  position: relative;
  z-index: 1;
  &:disabled {
    cursor: auto;
    pointer-events: none;
  }

  will-change: transform;
  transition: transform 450ms ease;
  transform: perspective(1px) translateZ(0);

  > * {
    user-select: none;
  }

  > a {
    text-decoration: none;
  }
`

export const ButtonPrimary = styled(Base)`
  background-color: ${({ theme }) => theme.winterMainButton};
  color: white;
  &:focus {
    box-shadow: 0 0 0 1pt ${({ theme }) => darken(0.05, theme.winterMainButton)};
    background-color: ${({ theme }) => darken(0.05, theme.winterMainButton)};
  }
  &:hover {
    background-color: ${({ theme }) => darken(0.05, theme.winterMainButton)};
  }
  &:active {
    box-shadow: 0 0 0 1pt ${({ theme }) => darken(0.1, theme.winterMainButton)};
    background-color: ${({ theme }) => darken(0.1, theme.winterMainButton)};
  }
  &:disabled {
    background-color: ${({ theme, altDisabledStyle, disabled }) =>
      altDisabledStyle ? (disabled ? theme.winterMainButton : theme.winterDisabledButton) : theme.winterDisabledButton};
    color: ${({ theme }) => theme.text2};
    cursor: auto;
    box-shadow: none;
    border: 1px solid transparent;
    outline: none;
  }
`

export const ButtonLight = styled(Base)`
  background-color: ${({ theme }) => '#6ec2eb'};
  color: ${({ theme }) => 'white'};
  font-size: 16px;
  font-weight: 500;
  &:focus {
    box-shadow: 0 0 0 1pt ${({ theme, disabled }) => !disabled && darken(0.03, '#6ec2eb')};
    background-color: ${({ theme, disabled }) => !disabled && darken(0.03, '#6ec2eb')};
  }
  &:hover {
    background-color: ${({ theme, disabled }) => !disabled && darken(0.03, '#6ec2eb')};
  }
  &:active {
    box-shadow: 0 0 0 1pt ${({ theme, disabled }) => !disabled && darken(0.05, '#6ec2eb')};
    background-color: ${({ theme, disabled }) => !disabled && darken(0.05, '#6ec2eb')};
  }
  :disabled {
    opacity: 0.4;
    :hover {
      cursor: auto;
      background-color: ${({ theme }) => '#6ec2eb'};
      box-shadow: none;
      border: 1px solid transparent;
      outline: none;
    }
  }
`

export const ButtonGray = styled(Base)`
  background-color: ${({ theme }) => theme.winterMainButton};
  color: ${({ theme }) => theme.text2};
  font-size: 16px;
  font-weight: 500;

  &:hover {
    background-color: ${({ theme, disabled }) => !disabled && darken(0.05, theme.winterMainButton)};
  }
  &:active {
    background-color: ${({ theme, disabled }) => !disabled && darken(0.1, theme.winterDisabledButton)};
  }
`

export const ButtonSecondary = styled(Base)`
  border: 1px solid ${({ theme }) => theme.primary4};
  color: ${({ theme }) => theme.winterMainButton};
  background-color: transparent;
  font-size: 16px;
  border-radius: 12px;
  padding: ${({ padding }) => (padding ? padding : '10px')};

  &:focus {
    box-shadow: 0 0 0 1pt ${({ theme }) => theme.primary4};
    border: 1px solid ${({ theme }) => theme.primary3};
  }
  &:hover {
    border: 1px solid ${({ theme }) => theme.primary3};
  }
  &:active {
    box-shadow: 0 0 0 1pt ${({ theme }) => theme.primary4};
    border: 1px solid ${({ theme }) => theme.primary3};
  }
  &:disabled {
    opacity: 50%;
    cursor: auto;
  }
  a:hover {
    text-decoration: none;
  }
`

export const ButtonOutlined = styled(Base)`
  // border: 1px solid ${({ theme }) => theme.winterDisabledButton};
  background-color: ${({ theme }) => 'rgba(60,97,126,0.5)'};
  color: ${({ theme }) => theme.text1};
  &:focus {
    box-shadow: 0 0 0 1px ${({ theme }) => theme.bg4};
  }
  &:hover {
    box-shadow: 0 0 0 1px ${({ theme }) => theme.bg4};
  }
  &:active {
    box-shadow: 0 0 0 1px ${({ theme }) => theme.bg4};
  }
  &:disabled {
    opacity: 50%;
    cursor: auto;
  }
`

export const ButtonYellow = styled(Base)`
  background-color: ${({ theme }) => theme.yellow3};
  color: white;
  &:focus {
    box-shadow: 0 0 0 1pt ${({ theme }) => darken(0.05, theme.yellow3)};
    background-color: ${({ theme }) => darken(0.05, theme.yellow3)};
  }
  &:hover {
    background-color: ${({ theme }) => darken(0.05, theme.yellow3)};
  }
  &:active {
    box-shadow: 0 0 0 1pt ${({ theme }) => darken(0.1, theme.yellow3)};
    background-color: ${({ theme }) => darken(0.1, theme.yellow3)};
  }
  &:disabled {
    background-color: ${({ theme }) => theme.yellow3};
    opacity: 50%;
    cursor: auto;
  }
`

export const ButtonEmpty = styled(Base)`
  background-color: transparent;
  // color: ${({ theme }) => theme.winterMainButton};
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;

  &:focus {
    text-decoration: underline;
  }
  &:hover {
    text-decoration: none;
  }
  &:active {
    text-decoration: none;
  }
  &:disabled {
    opacity: 50%;
    cursor: auto;
  }
`

export const ButtonText = styled(Base)`
  padding: 0;
  width: fit-content;
  background: none;
  text-decoration: none;
  &:focus {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    text-decoration: underline;
  }
  &:hover {
    // text-decoration: underline;
    opacity: 0.9;
  }
  &:active {
    text-decoration: underline;
  }
  &:disabled {
    opacity: 50%;
    cursor: auto;
  }
`

const ButtonConfirmedStyle = styled(Base)`
  background-color: ${({ theme }) => theme.bg3};
  color: ${({ theme }) => theme.text1};
  /* border: 1px solid ${({ theme }) => theme.green1}; */

  &:disabled {
    opacity: 50%;
    background-color: ${({ theme }) => theme.winterDisabledButton};
    color: ${({ theme }) => theme.text2};
    cursor: auto;
  }
`

const ButtonErrorStyle = styled(Base)`
  background-color: ${({ theme }) => theme.winterMainButton};

  &:focus {
    box-shadow: 0 0 0 1pt ${({ theme }) => darken(0.05, theme.red1)};
    background-color: ${({ theme }) => darken(0.05, theme.red1)};
  }
  &:hover {
    background-color: ${({ theme }) => darken(0.05, theme.red1)};
  }
  &:active {
    box-shadow: 0 0 0 1pt ${({ theme }) => darken(0.1, theme.red1)};
    background-color: ${({ theme }) => darken(0.1, theme.red1)};
  }
  &:disabled {
    opacity: 50%;
    cursor: auto;
    box-shadow: none;
    color: rgb(195, 197, 203);
    background-color: ${({ theme }) => '#073c66'};
    border: 1px solid ${({ theme }) => '#073c66'};
  }
`

export function ButtonConfirmed({
  confirmed,
  altDisabledStyle,
  ...rest
}: { confirmed?: boolean; altDisabledStyle?: boolean } & ButtonProps) {
  if (confirmed) {
    return <ButtonConfirmedStyle {...rest} />
  } else {
    return <ButtonPrimary {...rest} altDisabledStyle={altDisabledStyle} />
  }
}

export function ButtonError({ error, ...rest }: { error?: boolean } & ButtonProps) {
  if (error) {
    return <ButtonErrorStyle {...rest} />
  } else {
    return <ButtonPrimary {...rest} />
  }
}

export function ButtonDropdown({ disabled = false, children, ...rest }: { disabled?: boolean } & ButtonProps) {
  return (
    <ButtonPrimary {...rest} disabled={disabled}>
      <RowBetween>
        <div style={{ display: 'flex', alignItems: 'center' }}>{children}</div>
        <ChevronDown size={24} />
      </RowBetween>
    </ButtonPrimary>
  )
}

export function ButtonDropdownLight({ disabled = false, children, ...rest }: { disabled?: boolean } & ButtonProps) {
  return (
    <ButtonOutlined {...rest} disabled={disabled}>
      <RowBetween>
        <div style={{ display: 'flex', alignItems: 'center' }}>{children}</div>
        <ChevronDown size={24} />
      </RowBetween>
    </ButtonOutlined>
  )
}

const ActiveOutlined = styled(ButtonOutlined)`
  border: 1px solid;
  border-color: ${({ theme }) => theme.winterMainButton};
`

const Circle = styled.div`
  height: 20px;
  width: 20px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.winterMainButton};
  display: flex;
  align-items: center;
  justify-content: center;
`

const CheckboxWrapper = styled.div`
  width: 30px;
  padding: 0 10px;
  position: absolute;
  top: 10px;
  right: 10px;
`

const ResponsiveCheck = styled(Check)`
  size: 13px;
`

export function ButtonRadioChecked({ active = false, children, ...rest }: { active?: boolean } & ButtonProps) {
  const theme = useTheme()

  if (!active) {
    return (
      <ButtonOutlined $borderRadius="12px" padding="12px 8px" {...rest}>
        {<RowBetween>{children}</RowBetween>}
      </ButtonOutlined>
    )
  } else {
    return (
      <ActiveOutlined {...rest} padding="12px 8px" $borderRadius="12px">
        {
          <RowBetween>
            {children}
            <CheckboxWrapper>
              <Circle>
                <ResponsiveCheck size={13} stroke={theme.white} />
              </Circle>
            </CheckboxWrapper>
          </RowBetween>
        }
      </ActiveOutlined>
    )
  }
}
