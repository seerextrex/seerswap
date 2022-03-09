import styled, { keyframes } from 'styled-components/macro'
import { ButtonConfirmed } from '../../components/Button'
import { Info } from 'react-feather'
import Badge from '../../components/Badge'
import Loader from '../../components/Loader'
import { CurrencyDropdown } from '../AddLiquidity/styled'
import { SmallMaxButton } from '../RemoveLiquidity/styled'
import Slider from '../../components/Slider'
import { NavLink } from 'react-router-dom'
import { darken } from 'polished'
// @ts-ignore
import StakerStatistic from '../../assets/images/StakerStatisticBackground.svg'

//All
export const StakeButton = styled(ButtonConfirmed)`
    border-radius: 8px !important;
    width: 100%;
    margin-top: 24px;
    font-weight: 600;

    ${({ theme }) => theme.mediaWidth.upToSmall`
    margin-top: 0;
  `}
`

//StakerPage
export const RealStakerPageWrapper = styled.div`
    margin-bottom: 5rem;
    width: 765px;
    margin-top: 1rem;

    ${({ theme }) => theme.mediaWidth.upToSmall`
    width: 100%;
  `}
`
export const PageWrapper = styled.div`
    min-width: 100%;
    background-color: ${({ theme }) => theme.winterBackground};
    border-radius: 16px;
    padding: 26px 30px 27px;

    input[type=range]:disabled {
        cursor: default;
    }

    input[type=range]:disabled::-webkit-slider-thumb {
        border: ${({ theme }) => `7px solid ${theme.winterDisabledButton}`};
    }

    input[type=range]:disabled::-moz-range-thumb {
        border: ${({ theme }) => `7px solid ${theme.winterDisabledButton}`};
    }

    ${({ theme }) => theme.mediaWidth.upToSmall`
    min-width: 100%;
    padding: 26px 15px 27px;
  `}
`
export const StakeTitle = styled.h1`
    width: 100%;
    margin: 0;
    font-size: 20px;
`
export const SilderWrapper = styled.div`
    width: 100%;
    margin: 0;
`
export const StakerSlider = styled(Slider)<{ disabled?: boolean }>`
    &::-webkit-slider-runnable-track {
        background: ${({ theme }) => theme.winterDisabledButton};
        height: 5px;
        border-radius: 20px;
    }

    &::-moz-range-track {
        background: ${({ theme }) => theme.winterDisabledButton};
        height: 5px;
        border-radius: 20px;
    }

    &::-moz-range-progress {
        background-color: ${({ theme }) => theme.winterMainButton};
        height: 5px;
        border-radius: 20px;
    }

    &::-webkit-slider-thumb {
        -webkit-appearance: none;
        height: ${({ size }) => size}px;
        width: ${({ size }) => size}px;
        background: white;
        border-radius: 100%;
        border: ${({ theme }) => `7px solid ${theme.winterMainButton}`};
        transform: translateY(-40%);
        color: ${({ theme }) => theme.bg1};

        &:hover,
        &:focus {
            box-shadow: 0 0 1px rgba(0, 0, 0, 0.1), 0 4px 8px rgba(0, 0, 0, 0.08), 0 16px 24px rgba(0, 0, 0, 0.06), 0 24px 32px rgba(0, 0, 0, 0.04);
        }
    }

    &::-moz-range-thumb {
        height: ${({ size }) => size}px;
        width: ${({ size }) => size}px;
        background: white;
        border-radius: 100%;
        border: ${({ theme }) => `7px solid ${theme.winterMainButton}`};
        color: ${({ theme }) => theme.bg1};

        &:hover,
        &:focus {
            box-shadow: 0 0 1px rgba(0, 0, 0, 0.1), 0 4px 8px rgba(0, 0, 0, 0.08), 0 16px 24px rgba(0, 0, 0, 0.06), 0 24px 32px rgba(0, 0, 0, 0.04);
        }

        &:disabled {
            border: ${({ theme }) => `7px solid ${theme.winterDisabledButton}`};
        }
    }
`
export const EarnedStakedWrapper = styled.div`
    margin: 2rem 0;
    min-width: 100%;
    background-color: ${({ theme }) => theme.winterBackground};
    padding: 25px 30px 30px;
    border-radius: 16px;

    ${({ theme }) => theme.mediaWidth.upToSmall`
    min-width: 100%;
    display: flex;
    flex-direction: column;
    padding: 25px 15px 30px;
  `}
`
export const StakerStatisticWrapper = styled(NavLink)`
    position: relative;
    display: inline-block;
    min-width: 765px;
    height: 107px;
    text-decoration: none;
    background-color: ${({ theme }) => theme.winterBackground};
    background-image: url("${StakerStatistic}");
    background-repeat: no-repeat;
    background-position-y: 80%;
    border-radius: 16px;
    padding: 2rem 1rem 0 1rem;

    h2, p {
        color: white;
        text-decoration: none;
        margin: 0 0 0 .5rem;
        font-size: 15px;
        position: relative;
    }

    h2 {
        font-size: 20px;
        font-weight: 600;
    }

    ${({ theme }) => theme.mediaWidth.upToSmall`
    min-width: 100%;
    display: flex;
    align-items: center;
    height: unset;
    padding: 15px 10px;

    img {
        height: unset;
    }
    p {
        font-size: 13px;
    }

    h2,p {
        margin: 0 10px;
        z-index: 10;
    }
    h2 {
        margin-left: 1rem;

  `}
`
export const ResBlocksTitle = styled.div`
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: relative;

    h3 {
        margin: 0;
    }
`
export const ResBlocksWrapper = styled.div`
    display: flex;
    justify-content: space-between;

    ${({ theme }) => theme.mediaWidth.upToSmall`
    flex-direction: column;
  `}
`
export const spinAnimation = keyframes`
    100% {
        transform: rotate(360deg);
    }
`
export const ReloadButton = styled.button<{ refreshing: boolean }>`
    background-color: transparent;
    border: none;
    animation: ${({ refreshing }) => refreshing ? spinAnimation : ''} infinite 3s;
    cursor: pointer;

    &:disabled {
        opacity: 0.5;
        cursor: default;
    }
`
export const FrozenDropDown = styled.button`
    color: white !important;
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    background-color: #08537E;
    border: none;
    font-size: 13px;
    padding: .2rem 1rem;
    border-radius: 5px;
    margin-right: 1rem;
    white-space: nowrap;
    width: 100%;

    &:disabled {
        background-color: ${darken(.05, '#08537E')};
        cursor: default;
    }

    ${({ theme }) => theme.mediaWidth.upToSmall`
    width: 100%;
    padding: .2rem .4rem;
  `}
`
export const LeftBlock = styled.div`
    display: flex;
    align-items: center;
    width: calc(50% - 1rem);
    justify-content: start;
`
export const RightBlock = styled.div`
    width: calc(50% - 1rem);
    margin-left: auto;
    display: flex;
    justify-content: right;
`
export const XALGBCousreWrapper = styled.div`
    display: flex;
    justify-content: space-between;
    font-size: 13px;
    margin: 1rem 0 0 0;
    background: linear-gradient(90deg, var(--primary-disabled) 56%, var(--primary));
    border-radius: 8px;

`
export const XALGBBalance = styled.span`
    padding: .5rem 1rem;
    display: inline-block;
    border-radius: 8px 0 0 8px;
    min-width: 70%;
    ${({ theme }) => theme.mediaWidth.upToSmall`
    min-width: 50%;
    padding: .5rem;
  `}
`
export const XALGBCourse = styled.span`
    padding: .5rem 1rem;
    border-radius: 0 8px 8px 0;
    min-width: 30%;
    text-align: right;
    ${({ theme }) => theme.mediaWidth.upToSmall`
  padding: .5rem;
    min-width: 50%;
  `}
`

//ResBlock
export const ResPageWrapper = styled.div`
    width: 100%;
    background-color: rgba(60, 97, 126, 0.5);
    border-radius: 16px;
    position: relative;
    padding: 1.5rem 1rem 1rem;

    &:first-child {
        margin-right: 1rem;
    }

    &:last-child {
        margin-left: 1rem;
    }

    ${({ theme }) => theme.mediaWidth.upToSmall`
    &:first-child {
      margin-right: unset;
    }
    &:last-child {
      margin-left: unset;
    }
  `}
    h2 {
        color: white;
        font-size: 16px;
        margin: 0;
    }

    h3 {
        font-size: 19px;
        font-weight: 600;
        margin: 10px 0 4px 0;
        cursor: default;
        width: fit-content;
    }

    p {
        color: #B1BAD3;
        font-size: 14px;
        cursor: default;
        margin: 0 0 10px;
    }

    ${({ theme }) => theme.mediaWidth.upToSmall`
    min-width: 80%;
    &:first-child {
    margin-bottom: 1rem;
  }
  `}
`
export const AmountTitle = styled.div`
    display: block;
    background-color: white;
    color: black;
    position: absolute;
    font-size: 14px;
    padding: 3px 7px;
    top: 12%;
    left: 30%;
    border-radius: 5px;
`
export const TitleWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
`
export const InfoStyled = styled(Info)`
    cursor: pointer;
`
export const EarnedBadge = styled(Badge)`
    position: absolute;
    font-size: 13px;
    top: -4rem;
    right: 0;
    max-width: 210px;
    text-align: left;
    padding: .5rem 1rem;
`
export const ResButton = styled(StakeButton)`
    margin-top: unset;
    padding: 12px;
`

//Frozen
export const FrozenWrapper = styled.div`
    width: 100%;
    background-color: #02253e;
    height: 190px;
    position: absolute;
    top: 40px;
    z-index: 100;
    border-radius: 16px;
    padding: 25px 30px;
    overflow-y: auto;
    ${({ theme }) => theme.mediaWidth.upToSmall`
     padding: 1rem;
    `}
`
export const FrozenTransaction = styled.div`
    display: flex;
    color: white;
    justify-content: space-between;

    p {
        color: white !important;
        font-size: 16px !important;
        margin: 5px 0 !important;
        font-weight: 600;
    }

    ${({ theme }) => theme.mediaWidth.upToSmall`
    flex-direction: column;
    background-color: #202635;
    padding: 5px 7px;
    border-radius: 10px;
  `}
`
export const Time = styled.p`
    min-width: 90px;
    text-align: center;
`
export const TimeWrapper = styled.div`
    display: flex;
    color: white !important;
    font-size: 16px !important;
    margin: 7px 0 !important;
    font-weight: 600;
    align-items: center;

    p {
        margin: 0 !important;
    }
`
export const LoaderStyled = styled(Loader)`
    margin: auto;
`

//InputRange
export const CurrencyInputPanelWrapper = styled.div`
    width: 100%;
    background-color: ${({ theme }) => theme.winterDisabledButton};
    margin: 26px 0 32px 0;
    border-radius: 16px;
    padding: 20px 24px;
    min-height: 150px;

    img {
        width: 36px;
        height: 36px;
    }
`
export const CurrencyTop = styled(CurrencyDropdown)<{ style: any }>`
    span {
        font-size: 21px;
    }

    div {
        padding: 0;
    }
`
export const CurrencyBottom = styled(CurrencyDropdown)<{ style: any }>`
    span {
        cursor: default;

        &:hover {
            cursor: default;
        }
    }
`

//RangeButtons
export const StakerSmallMaxButton = styled(SmallMaxButton)`
    background: ${({ theme }) => theme.winterMainButton};
    border: 1px solid transparent;
    box-sizing: border-box;

    &:disabled {
        background: ${({ theme }) => theme.winterDisabledButton};
        border: 1px solid transparent;
        cursor: default;
    }
`
export const ButtonsWrapper = styled.div`
    margin: 0;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;

    ${({ theme }) => theme.mediaWidth.upToSmall`
    flex-direction: column;
    align-items: start;
    margin-bottom: 20px;
  `}
    p {
        cursor: pointer;

        &:hover {
            color: rgb(222, 222, 222);
        }
    }
`

//UnstakeModal
export const ContentModal = styled.div`
    width: 100%;
    padding: 5px 30px 20px;
    ${({ theme }) => theme.mediaWidth.upToSmall`
    padding: 5px 15px 20px;
  `}
`

//UnstakeInputRange
export const UnstakeCurrencyInputPanelWrapper = styled(CurrencyInputPanelWrapper)`
    span {
        color: #C3C5CB;
        cursor: default;

        &:hover {
            cursor: default;
            color: #C3C5CB;
        }
    }

    ${({ theme }) => theme.mediaWidth.upToSmall`
    padding: 20px 0 10px 12px;
    margin: 15px 0 10px;
  `}
`
export const UnstakeTitle = styled.div`
    font-size: 18px;
    font-weight: 600;
    display: flex;
    align-items: center;
    color: white;

    img {
        margin-right: 10px;
    }
`
