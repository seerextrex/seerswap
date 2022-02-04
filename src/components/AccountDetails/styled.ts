import styled from 'styled-components/macro'
import { ExternalLink, LinkStyledButton } from '../../theme'
import { ButtonSecondary } from '../Button'
import { ReactComponent as Close } from '../../assets/images/x.svg'

//index
export const HeaderRow = styled.div`
    ${({ theme }) => theme.flexRowNoWrap};
    padding: 1rem 1rem;
    font-weight: 500;
    color: ${(props) => (props.color === 'blue' ? ({ theme }) => theme.primary1 : 'inherit')};
    ${({ theme }) => theme.mediaWidth.upToMedium`
    padding: 1rem;
  `};
`
export const UpperSection = styled.div`
    position: relative;
    color: #080064;

    h5 {
        margin: 0 0 0.5rem 0;
        font-size: 1rem;
        font-weight: 400;
    }

    h5:last-child {
        margin-bottom: 0;
    }

    h4 {
        margin-top: 0;
        font-weight: 500;
    }
`
export const InfoCard = styled.div`
    padding: 1rem;
    border: 1px solid ${({ theme }) => theme.bg3};
    border-radius: 20px;
    position: relative;
    display: grid;
    grid-row-gap: 12px;
    margin-bottom: 20px;
`
export const AccountGroupingRow = styled.div`
    ${({ theme }) => theme.flexRowNoWrap};
    justify-content: space-between;
    align-items: center;
    font-weight: 400;
    color: ${({ theme }) => theme.text1};

    div {
        ${({ theme }) => theme.flexRowNoWrap}
        align-items: center;
    }
`
export const AccountSection = styled.div`
    padding: 0 1rem;
    ${({ theme }) => theme.mediaWidth.upToMedium`padding: 0rem 1rem 1.5rem 1rem;`};
`
export const YourAccount = styled.div`
    h5 {
        margin: 0 0 1rem 0;
        font-weight: 400;
    }

    h4 {
        margin: 0;
        font-weight: 500;
    }
`
export const LowerSection = styled.div`
    ${({ theme }) => theme.flexColumnNoWrap}
    padding: 1.5rem;
    flex-grow: 1;
    overflow: auto;
    background-color: rgb(179, 230, 255);
    border-bottom-left-radius: 20px;
    border-bottom-right-radius: 20px;

    h5 {
        margin: 0;
        font-weight: 400;
        color: ${({ theme }) => theme.text3};
    }
`
export const AccountControl = styled.div`
    display: flex;
    justify-content: space-between;
    min-width: 0;
    width: 100%;

    font-weight: 500;
    font-size: 1.25rem;

    a:hover {
        text-decoration: underline;
    }

    p {
        min-width: 0;
        margin: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        color: #080064;
    }
`
export const AddressLink = styled(ExternalLink)<{ hasENS: boolean; isENS: boolean }>`
    font-size: 0.825rem;
    color: ${({ theme }) => theme.text3};
    margin-left: 1rem;
    display: flex;

    :hover {
        color: #080064;
    }
`
export const CloseIcon = styled.div`
    position: absolute;
    right: 1rem;
    top: 14px;

    &:hover {
        cursor: pointer;
        opacity: 0.6;
    }
`
export const CloseColor = styled(Close)`
    path {
        stroke: ${({ theme }) => theme.text4};
    }
`
export const WalletName = styled.div`
    width: initial;
    font-size: 0.825rem;
    font-weight: 500;
    color: #080064;
`
export const IconWrapper = styled.div<{ size?: number }>`
    ${({ theme }) => theme.flexColumnNoWrap};
    align-items: center;
    justify-content: center;
    margin-right: 8px;

    & > img,
    span {
        height: ${({ size }) => (size ? size + 'px' : '32px')};
        width: ${({ size }) => (size ? size + 'px' : '32px')};
    }

    ${({ theme }) => theme.mediaWidth.upToMedium`
    align-items: flex-end;
  `};
`
export const TransactionListWrapper = styled.div`
    ${({ theme }) => theme.flexColumnNoWrap};
`
export const WalletAction = styled(ButtonSecondary)`
    width: fit-content;
    font-weight: 400;
    margin-left: 8px;
    font-size: 0.825rem;
    padding: 4px 6px;

    :hover {
        cursor: pointer;
        text-decoration: underline;
    }
`
export const MainWalletAction = styled(WalletAction)`
    color: ${({ theme }) => theme.primary1};
`

//Copy
export const CopyIcon = styled(LinkStyledButton)`
    color: ${({ theme }) => theme.text3};
    flex-shrink: 0;
    display: flex;
    text-decoration: none;
    font-size: 0.825rem;

    :hover,
    :active,
    :focus {
        text-decoration: none;
        color: ${({ theme }) => theme.text2};
    }
`
export const TransactionStatusText = styled.span`
    margin-left: 0.25rem;
    font-size: 0.825rem;
    ${({ theme }) => theme.flexRowNoWrap};
    align-items: center;
    color: #080064;
`

//Transaction
export const TransactionWrapper = styled.div``
export const TransactionsStatusText = styled.div`
    margin-right: 0.5rem;
    display: flex;
    align-items: center;

    :hover {
        text-decoration: underline;
    }
`
export const TransactionState = styled(ExternalLink)<{ pending: boolean; success?: boolean }>`
    display: flex;
    justify-content: space-between;
    align-items: center;
    text-decoration: none !important;
    border-radius: 0.5rem;
    padding: 0.25rem 0;
    font-weight: 500;
    font-size: 0.825rem;
    color: ${({ theme }) => theme.winterDisabledButton};
`
export const TransIconWrapper = styled.div<{ pending: boolean; success?: boolean }>`
    color: ${({
        pending,
        success,
        theme
    }) => (pending ? theme.primary1 : success ? theme.green1 : theme.red1)};
    position: relative;
    z-index: 10;
`
export const TransCloseIcon = styled.div`
    position: relative;
    z-index: 10;
    color: ${({ theme }) => theme.red1}
`
export const IconsWrapper = styled.div`
    display: flex;
    gap: .3rem;
`
