import styled from 'styled-components/macro'
import { Calendar, Zap, PlusCircle, Award, AlignJustify, Codesandbox } from 'react-feather'
import { Link, NavLink } from 'react-router-dom'
import { deviceSizes } from '../../pages/styled'
import {FarmingInfoLabel} from "../Header";
import {useAppSelector} from "../../state/hooks";

const MenuList = styled.ul`
  padding: 0;
  margin: 0;
  list-style-type: none;
  ${({ theme }) => theme.mediaWidth.upToSmall`{
    min-width: 100%;
    display: flex;
  }`}
`

const MenuListItem = styled.li`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20%;
  padding: 10px 0;
  font-weight: 600;
  position: relative;
  // background-color: #202635;
  color: white;
  text-decoration: none;
  border-radius: 0;
  &:not(:first-of-type) {
    // border-left: 1px solid #2c313f;
  }
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

const stakingMenuList = [
  {
    title: 'My farms',
    icon: <AlignJustify size={18}></AlignJustify>,
    link: 'farms',
  },
  {
    title: 'My rewards',
    icon: <Award size={18}></Award>,
    link: 'rewards',
  },
  {
    title: 'Current events',
    icon: <Zap size={18}></Zap>,
    link: 'current-events',
  },
  {
    title: 'Future events',
    icon: <Calendar size={18}></Calendar>,
    link: 'future-events',
  },
  {
    title: 'Eternal farms',
    icon: <Codesandbox size={18}></Codesandbox>,
    link: 'eternal-farms',
  },
]

export function StakingMenu() {
  const {startTime} = useAppSelector(state => state.farming)
  return (
    <MenuList>
      {stakingMenuList.map((el, i) => (
        <MenuListItem
          as={NavLink}
          to={`/farming/${el.link}`}
          activeStyle={{
            borderBottom: '3px solid #ffbf00',
            color: '#ffd967',
            fontWeight: 600,
          }}
          key={i}
        >
          {el.title === 'Future events' ? <FarmingInfoLabel isEvents={startTime.trim()}/> : null}
          <MenuListItemIcon>{el.icon}</MenuListItemIcon>
          <MenuListItemTitle>{el.title}</MenuListItemTitle>
        </MenuListItem>
      ))}
    </MenuList>
  )
}
