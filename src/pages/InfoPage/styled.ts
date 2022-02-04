import styled from 'styled-components/macro'
import { AutoColumn } from '../../components/Column'

export const PageWrapper = styled(AutoColumn)`
  max-width: 995px;
  width: 100%;

  ${({ theme }) => theme.mediaWidth.upToMedium`
    max-width: 800px;
  `};

  ${({ theme }) => theme.mediaWidth.upToSmall`
    max-width: 600px;
  `};
`
export const InnerWrapper = styled(AutoColumn)`
  ${({ theme }) => theme.mediaWidth.upToSmall`{
    min-width: 100%;
  }`}
`
export const MainContentWrapper = styled.div`
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  min-width: 100%;
`
export const MenuWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  margin-bottom: 2rem;
  margin-top: 2rem;
  font-weight: 600;

  ${({ theme }) => theme.mediaWidth.upToSmall`{
    overflow: auto;
    width: 100%;
    margin-top: 1rem;
    margin-bottom: 1rem;
  }`}
`
export const BodyWrapper = styled.div`
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.winterBackground};
  padding: 2rem 40px;
  border-radius: 20px;
  margin-bottom: 5rem;

  @media screen and (max-width: 1081px) {
    padding: 2rem 40px 4rem;
  }

  ${({ theme }) => theme.mediaWidth.upToSmall`
    padding: 1rem 12px;
  `}
`
