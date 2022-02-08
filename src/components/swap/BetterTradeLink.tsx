import { stringify } from 'qs'
import { useMemo } from 'react'
import { useLocation } from 'react-router'
import { Link } from 'react-router-dom'
import useParsedQueryString from '../../hooks/useParsedQueryString'
import { DEFAULT_VERSION, Version } from '../../hooks/useToggledVersion'
import { HideSmall, SmallOnly, TYPE } from '../../theme'
import { Zap } from 'react-feather'
import { ResponsiveButton } from './styled'

export default function BetterTradeLink({
    version,
    otherTradeNonexistent = false
}: {
    version: Version
    otherTradeNonexistent: boolean
}) {
    const location = useLocation()
    const search = useParsedQueryString()

    const linkDestination = useMemo(() => {
        return {
            ...location,
            search: `?${stringify({
                ...search,
                use: version !== DEFAULT_VERSION ? version : undefined
            })}`
        }
    }, [location, search, version])

    return (
        <ResponsiveButton as={Link} to={linkDestination}>
            <Zap size={12} style={{ marginRight: '0.25rem' }} />
            <HideSmall>
                <TYPE.small style={{ lineHeight: '120%' }} fontSize={12}>
                    {otherTradeNonexistent
                        ? `No liquidity! Click to trade with ${version.toUpperCase()}`
                        : `Get a better price on ${version.toUpperCase()}`}
                </TYPE.small>
            </HideSmall>
            <SmallOnly>
                <TYPE.small style={{ lineHeight: '120%' }} fontSize={12}>
                    {otherTradeNonexistent
                        ? `No liquidity! Click to trade with ${version.toUpperCase()}`
                        : `Better ${version.toUpperCase()} price`}
                </TYPE.small>
            </SmallOnly>
        </ResponsiveButton>
    )
}
