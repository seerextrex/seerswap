import React from 'react'
import { BodyWrapper } from './styled'

/**
 * The styled container element that wraps the content of most pages and the tabs.
 */
export default function AppBody({ children, ...rest }: { children: React.ReactNode, style?: any }) {
    return <BodyWrapper {...rest}>{children}</BodyWrapper>
}
