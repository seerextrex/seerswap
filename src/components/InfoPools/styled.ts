import styled from 'styled-components/macro'

export const PageWrapper = styled.div`
  width: 100%;
  background-color: ${({ theme }) => theme.winterBackground};
  ${({ theme }) => theme.mediaWidth.upToMedium`
    max-width: 720px!important;
    overflow-x: scroll;
    border-radius: 8px;
  `};
`
export const MockLoading = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 500px;
`