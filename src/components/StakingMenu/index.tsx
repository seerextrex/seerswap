import { AlignJustify, Award, Calendar, PlusCircle, Zap } from 'react-feather'
import { NavLink } from 'react-router-dom'
import { FarmingInfoLabel } from '../Header/styled'
import { useAppSelector } from '../../state/hooks'
import { MenuList, MenuListItem, MenuListItemIcon, MenuListItemTitle } from './styled'

const stakingMenuList = [
    {
        title: 'My farms',
        icon: <AlignJustify size={18} />,
        link: 'farms'
    },
    {
        title: 'My rewards',
        icon: <Award size={18} />,
        link: 'rewards'
    },
    {
        title: 'Current events',
        icon: <Zap size={18} />,
        link: 'current-events'
    },
    {
        title: 'Future events',
        icon: <Calendar size={18} />,
        link: 'future-events'
    },
    {
        title: 'Create event',
        icon: <PlusCircle size={18} />,
        link: 'create-event'
    }
]

export function StakingMenu() {
    const { startTime } = useAppSelector(state => state.farming)
    return (
        <MenuList>
            {stakingMenuList.map((el, i) => (
                <MenuListItem
                    as={NavLink}
                    to={`/farming/${el.link}`}
                    activeStyle={{
                        borderBottom: '3px solid #ffbf00',
                        color: '#ffd967',
                        fontWeight: 600
                    }}
                    key={i}
                >
                    {el.title === 'Future events' ?
                        <FarmingInfoLabel isEvents={Boolean(startTime.trim())} /> : null}
                    <MenuListItemIcon>{el.icon}</MenuListItemIcon>
                    <MenuListItemTitle>{el.title}</MenuListItemTitle>
                </MenuListItem>
            ))}
        </MenuList>
    )
}
