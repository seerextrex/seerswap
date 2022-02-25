import React from 'react'
import useHttpLocations from '../../hooks/useHttpLocations'
import { StyledListLogo } from './styled'

interface ListLogoProps {
    logoURI: string
    size?: string
    style?: React.CSSProperties
    alt?: string
}

export default function ListLogo({ logoURI, style, size = '24px', alt }: ListLogoProps) {
    const srcs: string[] = useHttpLocations(logoURI)

    return <StyledListLogo alt={alt} size={size} srcs={srcs} style={style} />
}
