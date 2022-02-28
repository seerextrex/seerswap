import React from 'react'
import { NavLink } from 'react-router-dom'
import './index.scss'

interface MenuProps {
    items: {
        title: string
        icon: JSX.Element
        link: string
    } []
}

const Menu = ({ items }: MenuProps) => {
    return (
        <ul className={'menu-wrapper'}>
            {
                items.map((el, i) =>
                <NavLink key={i} to={el.link} className={'menu-wrapper__item mr-1'} activeClassName={'menu-wrapper__item--active'}>
                    {el.icon}
                    {el.title}
                </NavLink>)
            }
        </ul>
    )
}

export default Menu
