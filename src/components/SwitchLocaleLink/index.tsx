import { useMemo } from 'react'
import { DEFAULT_LOCALE, SupportedLocale } from '../../constants/locales'
import { navigatorLocale, useActiveLocale } from '../../hooks/useActiveLocale'
import { useLocationLinkProps } from 'hooks/useLocationLinkProps'

const useTargetLocale = (activeLocale: SupportedLocale) => {
    const browserLocale = useMemo(() => navigatorLocale(), [])

    if (browserLocale && (browserLocale !== DEFAULT_LOCALE || activeLocale !== DEFAULT_LOCALE)) {
        if (activeLocale === browserLocale) {
            return DEFAULT_LOCALE
        } else {
            return browserLocale
        }
    }
    return null
}

export function SwitchLocaleLink() {
    const activeLocale = useActiveLocale()
    const targetLocale = useTargetLocale(activeLocale)

    const { to } = useLocationLinkProps(targetLocale)

    if (!targetLocale || !to) return null

    return <></>
}
