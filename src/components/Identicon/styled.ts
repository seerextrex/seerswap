import styled from 'styled-components/macro'

export const StyledIdenticonContainer = styled.div`
    height: 1rem;
    width: 1rem;
    border-radius: 1.125rem;
    background-color: ${({ theme }) => theme.bg4};

    ${({ theme }) => theme.mediaWidth.upToSmall`
        display: none;
    `}
`
