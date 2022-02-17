import styled from 'styled-components/macro'

export const Wrapper = styled.div`
    width: 100%;
    padding: 1rem;
    margin-top: 1rem;
    border-radius: 10px;
    background-color: #052445;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    position: relative;
    ${({ theme }) => theme.mediaWidth.upToSmall`
    margin-left: -1.3rem;
    margin-right: -1.3rem;
    width: unset;
    border-radius: 20px;
  `}
`
export const MockLoading = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 360px;
    padding: 0 16px;
    max-width: 1000px;
`

export const ToggleToken = styled.div`
    position: absolute !important;
    right: 1rem;
    top: 1rem;
`
