import React, { useEffect, useRef, useState } from 'react'
import { Check, ChevronLeft } from 'react-feather'
import { useActiveWeb3React } from '../../hooks/web3'
import { useOnClickOutside } from '../../hooks/useOnClickOutside'
import { ApplicationModal } from '../../state/application/actions'
import { useModalOpen, useToggleModal } from '../../state/application/hooks'
import { useDarkModeManager } from 'state/user/hooks'
import { CHAIN_INFO, L2_CHAIN_IDS, SupportedChainId } from 'constants/chains'
import { LOCALE_LABEL, SUPPORTED_LOCALES, SupportedLocale } from 'constants/locales'
import { useLocationLinkProps } from 'hooks/useLocationLinkProps'
import { useActiveLocale } from 'hooks/useActiveLocale'
import { ExternalMenuItem, InternalLinkMenuItem, MenuFlyout, NewMenuFlyout, NewMenuItem, StyledMenu, StyledMenuButton, StyledMenuIcon, ToggleMenuItem } from './styled'

export enum FlyoutAlignment {
    LEFT = 'LEFT',
    RIGHT = 'RIGHT',
}


function LanguageMenuItem({
    locale,
    active,
    key
}: { locale: SupportedLocale; active: boolean; key: string }) {
    const { to, onClick } = useLocationLinkProps(locale)

    if (!to) return null

    return (
        <InternalLinkMenuItem onClick={onClick} key={key} to={to}>
            <div>{LOCALE_LABEL[locale]}</div>
            {active && <Check opacity={0.6} size={16} />}
        </InternalLinkMenuItem>
    )
}

function LanguageMenu({ close }: { close: () => void }) {
    const activeLocale = useActiveLocale()

    return (
        <MenuFlyout>
            <ToggleMenuItem onClick={close}>
                <ChevronLeft size={16} />
            </ToggleMenuItem>
            {SUPPORTED_LOCALES.map((locale) => (
                <LanguageMenuItem locale={locale} active={activeLocale === locale} key={locale} />
            ))}
        </MenuFlyout>
    )
}

export default function Menu() {
    const { account, chainId } = useActiveWeb3React()

    const node = useRef<HTMLDivElement>()
    const open = useModalOpen(ApplicationModal.MENU)
    const toggle = useToggleModal(ApplicationModal.MENU)
    useOnClickOutside(node, open ? toggle : undefined)
    const openClaimModal = useToggleModal(ApplicationModal.ADDRESS_CLAIM)
    const showUNIClaimOption = Boolean(!!account && !!chainId && !L2_CHAIN_IDS.includes(chainId))
    const { infoLink } = CHAIN_INFO[chainId ? chainId : SupportedChainId.POLYGON]

    const [darkMode, toggleDarkMode] = useDarkModeManager()

    const [menu, setMenu] = useState<'main' | 'lang'>('main')

    useEffect(() => {
        setMenu('main')
    }, [open])

    return (
        <StyledMenu ref={node as any}>
            <StyledMenuButton onClick={toggle}>
                <StyledMenuIcon />
            </StyledMenuButton>

            {open &&
                (() => {
                    switch (menu) {
                        case 'lang':
                            return <LanguageMenu close={() => setMenu('main')} />
                        case 'main':
                        default:
                            return
                    }
                })()}
        </StyledMenu>
    )
}

interface NewMenuProps {
    flyoutAlignment?: FlyoutAlignment
    ToggleUI?: React.FunctionComponent
    menuItems: {
        content: any
        link: string
        external: boolean
    }[]
}

export const NewMenu = ({
    flyoutAlignment = FlyoutAlignment.RIGHT,
    ToggleUI,
    menuItems,
    ...rest
}: NewMenuProps) => {
    const node = useRef<HTMLDivElement>()
    const open = useModalOpen(ApplicationModal.POOL_OVERVIEW_OPTIONS)
    const toggle = useToggleModal(ApplicationModal.POOL_OVERVIEW_OPTIONS)
    useOnClickOutside(node, open ? toggle : undefined)
    const ToggleElement = ToggleUI || StyledMenuIcon
    return (
        <StyledMenu ref={node as any} {...rest}>
            <ToggleElement onClick={toggle} />
            {open && (
                <NewMenuFlyout flyoutAlignment={flyoutAlignment}>
                    {menuItems.map(({ content, link, external }, i) =>
                        external ? (
                            <ExternalMenuItem href={link} key={i}>
                                {content}
                            </ExternalMenuItem>
                        ) : (
                            <NewMenuItem to={link} key={i}>
                                {content}
                            </NewMenuItem>
                        )
                    )}
                </NewMenuFlyout>
            )}
        </StyledMenu>
    )
}
