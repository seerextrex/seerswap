import styled from 'styled-components/macro'
import { ClickableText, Label } from '../Text'
import { DarkGreyCard } from '../Card'
import { RowFixed } from '../Row'
import CurrencyLogo from '../CurrencyLogo'


export const Wrapper = styled(DarkGreyCard)`
  width: 100%;
  background-color: rgba(60, 97, 126, 0.5);
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    min-width: 600px;
  `};
`
export const ResponsiveGrid = styled.div`
  display: grid;
  grid-gap: 1em;
  align-items: center;
  position: relative;

  grid-template-columns: 20px 2.3fr repeat(4, 1fr);

  ${({ theme }) => theme.mediaWidth.upToMedium`
     grid-template-columns: 20px 1fr .6fr repeat(3, 1fr);
  `};
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
     grid-template-columns: 20px 2fr repeat(4, 1fr);
  `};
`
export const LinkWrapper = styled.a`
  display: flex;
  text-decoration: none;
  :hover {
    cursor: pointer;
    opacity: 0.7;
  }
`
export const ResponsiveLogo = styled(CurrencyLogo)`
  @media screen and (max-width: 670px) {
    width: 16px;
    height: 16px;
  }
`
const LabelTitle = styled(Label)`
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    min-width: 93px !important;
  `};
`
export const ClickableTextStyled = styled(ClickableText)`
justify-content: flex-start;
`
export const LabelTitleStyled = styled(LabelTitle)`
justify-content: flex-start;
`
export const CurrencyRow = styled(RowFixed)`
  margin-right: .3rem;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    display: none;
  `}
`
export const CurrencyRowWrapper = styled.div`
  display: flex;
  align-items: center;
`
