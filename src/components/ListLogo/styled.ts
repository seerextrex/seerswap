import styled from 'styled-components/macro'
import Logo from '../Logo'

export const StyledListLogo = styled(Logo)<{ size: string }>`
    width: ${({ size }) => size};
    height: ${({ size }) => size};
`
