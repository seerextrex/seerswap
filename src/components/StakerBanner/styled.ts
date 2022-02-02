import styled from 'styled-components/macro'

export const  Banner = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  padding: 1.5rem;
  border-radius: 1rem;
  background-color: ${({ theme }) => theme.winterMainButton};
  color: white;
  box-shadow: 0 0 10px #4d2bcc;
  border: 2px solid ${({ theme }) => theme.winterMainButton};
  font-family: Montserrat, sans-serif;
`
export const  BannerPart = styled.div`
  font-family: inherit;
  & > * {
    font-family: inherit;
  }
`
export const  BannerTitle = styled.div`
  font-size: 21px;
  font-weight: 600;
  margin-bottom: 1rem;
`
export const  BannerDescription = styled.div`
  max-width: 450px;
`
export const  BannerSubtitle = styled.div`
  text-transform: uppercase;
  font-size: 12px;
  font-weight: 600;
  margin-bottom: 0.5rem;
`
export const  BannerTime = styled.div`
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 1rem;
`
export const  BannerButton = styled.button`
  border: none;
  color: white;
  background-color: #eea332;
  border-radius: 6px;
  max-width: 180px;
  min-width: 180px;
  padding: 8px 12px;
  font-weight: 600;
  text-transform: uppercase;
`