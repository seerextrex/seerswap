import { StopCircle, Grid } from 'react-feather'
import { NavLink } from 'react-router-dom'
import { MenuList, MenuListItemIcon, MenuListItemTitle, MenuListItem } from './styled'

const infoMenuList = [
  {
    title: 'Pools',
    icon: <Grid size={18}/>,
    link: 'pools',
  },
  {
    title: 'Tokens',
    icon: <StopCircle size={18}/>,
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
