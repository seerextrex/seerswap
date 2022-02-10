import styled from 'styled-components/macro'
import { AutoColumn } from '../Column'
import { MEDIA_WIDTHS } from 'theme'
import { X } from 'react-feather'
import { AutoRow } from '../Row'


//index
export const MobilePopupWrapper = styled.div<{ height: string | number }>`
  position: relative;
  max-width: 100%;
  display: none;
  height: ${({ height }) => height};
  margin: ${({ height }) => (height ? '0 auto;' : 0)};
  margin-bottom: ${({ height }) => (height ? '20px' : 0)}};
  ${({ theme }) => theme.mediaWidth.upToSmall`
    display: block;
  `};
`
export const MobilePopupInner = styled.div`
  height: 99%;
  overflow-x: auto;
  overflow-y: hidden;
  display: flex;
  flex-direction: row;
  -webkit-overflow-scrolling: touch;
  ::-webkit-scrollbar {
    display: none;
  }
`
export const StopOverflowQuery = `@media screen and (min-width: ${MEDIA_WIDTHS.upToMedium + 1}px) and (max-width: ${
    MEDIA_WIDTHS.upToMedium + 500
}px)`
export const FixedPopupColumn = styled(AutoColumn)<{ extraPadding: boolean; xlPadding: boolean }>`
  position: fixed;
  top: ${({ extraPadding }) => (extraPadding ? '134px' : '56px')};
  right: 1rem;
  max-width: 355px !important;
  width: 100%;
  z-index: 1000000;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    display: none;
  `};

  ${StopOverflowQuery} {
    top: ${({ extraPadding, xlPadding }) => (xlPadding ? '134px' : extraPadding ? '134px' : '56px')};
  }
`

//PopupItem
export const StyledClose = styled(X)`
  position: absolute;
  right: 10px;
  top: 10px;

  :hover {
    cursor: pointer;
  }
`
export const Popup = styled.div`
  display: inline-block;
  width: 100%;
  padding: 1em 35px 1rem 1rem;
  background-color: ${({ theme }) => theme.winterBackground};
  position: relative;
  border-radius: 10px;
  overflow: hidden;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    min-width: 290px;
    &:not(:last-of-type) {
      margin-right: 20px;
    }
  `}
`

//TransactionPopup
export const RowNoFlex = styled(AutoRow)`
  flex-wrap: nowrap;
`
