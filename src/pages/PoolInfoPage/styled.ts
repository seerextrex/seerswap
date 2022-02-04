import styled from 'styled-components/macro'

export const Wrapper = styled.div`
  min-width: 915px;
  max-width: 995px;
  display: flex;
  flex-direction: column;

  ${({ theme }) => theme.mediaWidth.upToMedium`
    min-width: unset;
    width: 100%;
  `}
`
export const BodyWrapper = styled.div`
  display: flex;
  width: 100%;
`
export const ChartWrapper = styled.div`
  width: 100%;
`
export const LoaderMock = styled.div`
  height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
`
