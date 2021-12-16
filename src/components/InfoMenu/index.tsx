import styled from 'styled-components/macro'
import { Calendar, Zap, PlusCircle, Award, AlignJustify, StopCircle, Grid } from 'react-feather'
import { Link, NavLink } from 'react-router-dom'
import { deviceSizes } from '../../pages/styled'

import WoodenSlob from '../../assets/svg/wooden-slob.svg'
import WoodenRope from '../../assets/svg/wooden-rope.svg'

const MenuList = styled.ul`
  padding: 0 1rem;
  margin: 0;
  list-style-type: none;
  display: flex;
  width: 300px;
  justify-content: center;

  background-color: #b38280;
  border: 4px solid #713937;
  border-radius: 16px;
  background-image: url(${WoodenSlob});
  background-repeat: repeat;
  background-size: 27px 40px;
  position: relative;

  &::before,
  &::after {
    content: '';
    background-image: url(${WoodenRope});
    width: 5px;
    height: 51px;
    position: absolute;
    top: -55px;
  }

  &::before {
    left: 30%;
  }

  &::after {
    right: 30%;
  }

  ${({ theme }) => theme.mediaWidth.upToSmall`{
    min-width: 100%;
    display: flex;
  }`}

  ${({ theme }) => theme.mediaWidth.upToLarge`

  &::before,
  &::after {
    display: none;
  }
`}
`

const MenuListItem = styled.li`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 50%;
  padding: 10px 0;
  color: white;
  text-decoration: none;
  border-radius: 0;
  &:first-of-type {
    // border-radius: 8px 0 0 8px;
  }
  &:last-of-type {
    // border-radius: 0 8px 8px 0;
  }

  ${({ theme }) => theme.mediaWidth.upToSmall`{
    white-space: nowrap;
    width: unset;
    padding: 10px 16px;
    &:first-of-type {
      border-radius: unset;
    }
    &:last-of-type {
      border-radius: unset;
    }
  }`}
`
const MenuListItemIcon = styled.span`
  margin-right: 6px;
  & > svg {
    display: block;
  }
`
const MenuListItemTitle = styled.span`
  font-family: Montserrat;
  line-height: 24px;
`

const infoMenuList = [
  {
    title: 'Pools',
    icon: <Grid size={18}></Grid>,
    link: 'pools',
  },
  {
    title: 'Tokens',
    icon: <StopCircle size={18}></StopCircle>,
    link: 'tokens',
  },
]

export function InfoMenu() {
  return (
    <MenuList>
      {infoMenuList.map((el, i) => (
        <MenuListItem
          as={NavLink}
          to={`/info/${el.link}`}
          activeStyle={{
            borderBottom: '3px solid #ffbf00',
            color: '#ffd967',
            fontWeight: 600,
          }}
          key={i}
        >
          <MenuListItemIcon>{el.icon}</MenuListItemIcon>
          <MenuListItemTitle>{el.title}</MenuListItemTitle>
        </MenuListItem>
      ))}
    </MenuList>
  )
}
