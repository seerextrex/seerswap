import styled from 'styled-components/macro'
import { AutoColumn } from '../../components/Column'
// @ts-ignore
import WoodenSlob from '../../assets/svg/wooden-slob.svg'
// @ts-ignore
import WoodenRope from '../../assets/svg/wooden-rope.svg'
import { RowBetween, RowFixed } from '../../components/Row'
import { ButtonPrimary } from '../../components/Button'
import { darken } from 'polished'


//All
export const PageWrapper = styled(AutoColumn)`
  max-width: 1000px;
  width: 100%;

  ${({ theme }) => theme.mediaWidth.upToMedium`
    max-width: 800px;
  `};

  ${({ theme }) => theme.mediaWidth.upToSmall`
    max-width: 600px;
  `};
`
export const MainContentWrapper = styled.div`
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  ${({ theme }) => theme.mediaWidth.upToSmall`{
    min-width: 100%;
  }`}
`

//StakingPage
export const InnerWrapper = styled(AutoColumn)`
  ${({ theme }) => theme.mediaWidth.upToSmall`{
    min-width: 100%;
  }`}
`
export const MenuWrapper = styled.div`
  width: 100%;
  margin-bottom: 2rem;
  margin-top: 2rem;
  padding: 0 1rem;
  font-weight: 600;
  z-index: 999;

  background-color: #b38280;
  border: 4px solid #713937;
  border-radius: 16px;
  background-image: url(${WoodenSlob});
  background-repeat: repeat;
  background-size: 27px 40px;
  position: relative;

  &::before,
  &::after {
    content: '';
    // background-image: url(${WoodenRope});
    width: 5px;
    height: 51px;
    position: absolute;
    top: -55px;
  }

  &::before {
    left: 40%;
  }

  &::after {
    right: 40%;
  }

  ${({ theme }) => theme.mediaWidth.upToSmall`{
    overflow: auto;
    width: 100%;
  }`}

  ${({ theme }) => theme.mediaWidth.upToLarge`

  &::before,
&::after {
  display: none;
}
`}
`
export const BodyWrapper = styled.div`
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.winterBackground};
  padding: 2rem;
  border-radius: 20px;
  margin-bottom: 5rem;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    padding: 1rem;
  `}
`
export const MockScreen = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 300px;

  & > p {
    text-align: center;
  }
`
export const ConnectWalletButton = styled.button`
  border: 1px solid ${({ theme }) => theme.winterMainButton};
  background-color: ${({ theme }) => theme.winterMainButton};
  color: white;
  padding: 8px 12px;
  font-size: 16px;
    font-weight: 600;
  border-radius: 10px;
    &:hover {
        background-color:  ${({ theme }) => darken(0.05, theme.winterMainButton)};
    }
`

//StakingPoolPage
export const TitleRow = styled(RowBetween)`
  color: ${({ theme }) => theme.text2};
  ${({ theme }) => theme.mediaWidth.upToSmall`
    flex-wrap: wrap;
    gap: 12px;
    width: 100%;
  `};
`
export const ButtonRow = styled(RowFixed)`
  & > *:not(:last-child) {
    margin-left: 8px;
  }

  ${({ theme }) => theme.mediaWidth.upToSmall`
    width: 100%;
    flex-direction: row;
    justify-content: space-between;
    flex-direction: row-reverse;
  `};
`
export const ResponsiveButtonPrimary = styled(ButtonPrimary)`
  border-radius: 12px;
  padding: 6px 8px;
  width: fit-content;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    flex: 1 1 auto;
    width: 100%;
  `};
`
export const TokenCard = styled.div`
  display: flex;
  flex-direction: column;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  margin-right: 0.5rem;
  width: calc(50% - 0.5rem);
  background-color: ${({ theme }) => theme.bg0};
  &:nth-child(2n) {
    margin-right: 0;
    margin-left: 0.5rem;
  }
`
export const TokenLogo = styled.div`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background:-moz-linear-gradient(128deg, rgba(255, 0, 99, 1) 0%, rgba(255, 187, 0, 1) 17%, rgba(249, 255, 0, 1) 33%, rgba(76, 175, 80, 1) 48%, rgba(0, 188, 212, 1) 64%, rgba(76, 83, 175, 1) 84%, rgba(238, 130, 238, 1) 100%);
  background:-webkit-linear-gradient(128deg, rgba(255, 0, 99, 1) 0%, rgba(255, 187, 0, 1) 17%, rgba(249, 255, 0, 1) 33%, rgba(76, 175, 80, 1) 48%, rgba(0, 188, 212, 1) 64%, rgba(76, 83, 175, 1) 84%, rgba(238, 130, 238, 1) 100%);
  background:-o-linear-gradient(128deg, rgba(255, 0, 99, 1) 0%, rgba(255, 187, 0, 1) 17%, rgba(249, 255, 0, 1) 33%, rgba(76, 175, 80, 1) 48%, rgba(0, 188, 212, 1) 64%, rgba(76, 83, 175, 1) 84%, rgba(238, 130, 238, 1) 100%);
  filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#EE82EE', endColorstr='#FF0063', GradientType=0 );
  background:-ms-linear-gradient(128deg, rgba(255, 0, 99, 1) 0%, rgba(255, 187, 0, 1) 17%, rgba(249, 255, 0, 1) 33%, rgba(76, 175, 80, 1) 48%, rgba(0, 188, 212, 1) 64%, rgba(76, 83, 175, 1) 84%, rgba(238, 130, 238, 1) 100%);
  background:linear-gradient(128deg, rgba(255, 0, 99, 1) 0%, rgba(255, 187, 0, 1) 17%, rgba(249, 255, 0, 1) 33%, rgba(76, 175, 80, 1) 48%, rgba(0, 188, 212, 1) 64%, rgba(76, 83, 175, 1) 84%, rgba(238, 130, 238, 1) 100%);
  border: 2px solid #a431ce;
  margin-right: 1rem;
`
