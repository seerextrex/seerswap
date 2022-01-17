import styled from 'styled-components/macro'

const Banner = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  // height: 100px;
  padding: 1.5rem;
  border-radius: 1rem;
  background-color: ${({ theme }) => theme.winterMainButton};
  color: white;
  box-shadow: 0px 0px 10px #4d2bcc;
  border: 2px solid ${({ theme }) => theme.winterMainButton};
  font-family: Montserrat;
`

const BannerPart = styled.div`
  font-family: inherit;
  & > * {
    font-family: inherit;
  }
`

const BannerTitle = styled.div`
  font-size: 21px;
  font-weight: 600;
  margin-bottom: 1rem;
`
const BannerDescription = styled.div`
  max-width: 450px;
`
const BannerSubtitle = styled.div`
  text-transform: uppercase;
  font-size: 12px;
  font-weight: 600;
  margin-bottom: 0.5rem;
`
const BannerTime = styled.div`
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 1rem;
`
const BannerButton = styled.button`
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

export function StakingBanner() {
  return (
    <Banner>
      <BannerPart>
        <BannerTitle>Year-long deposit</BannerTitle>
        <BannerDescription>
          Deposit your NFT-s in 100 different pools for more then 100 different rewards
        </BannerDescription>
      </BannerPart>
      <BannerPart style={{ textAlign: 'right' }}>
        <BannerSubtitle>Starts in</BannerSubtitle>
        <BannerTime>10 days 12:21:03</BannerTime>
        <BannerButton>View pools</BannerButton>
      </BannerPart>
    </Banner>
  )
}
