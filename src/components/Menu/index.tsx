import React from 'react'
import { NavLink } from 'react-router-dom'
import './index.scss'
import { RefreshCw } from 'react-feather'

interface MenuProps {
    items: {
        title: string
        icon: JSX.Element
        link: string
    } []
    classes?: string
    refreshHandler: any
    isLoading: any
    size: string | number
}

const Menu = ({ items, classes, refreshHandler, isLoading, size }: MenuProps) => {
    return (
        <div className={`w-100 flex-s-between b ${classes}`}>
            <ul className={`menu-wrapper`}>
                {
                    items.map((el, i) =>
                        <NavLink key={i} to={el.link} className={'menu-wrapper__item mr-1 hover-op'} activeClassName={'menu-wrapper__item--active'}>
                            {el.icon}
                            {el.title}
                        </NavLink>)
                }
            </ul>
            {refreshHandler && isLoading !== undefined && (
                <span style={{ marginLeft: 'auto' }}>
                  <button className={'menu-wrapper__refresh hover-op'} disabled={isLoading} onClick={() => refreshHandler()} data-refreshing={isLoading}>
                    <RefreshCw style={{ display: 'block' }} size={size} stroke={'var(--primary)'} />
                  </button>
                </span>)}
        </div>
    )
}

export default Menu
