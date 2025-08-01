import styled, { css } from "styled-components/macro";
import { darken } from "polished";
import { skeletonGradient } from "../../theme/styles/skeleton";
import { stringToColour } from "../../utils/stringToColour";
import gradient from "random-gradient";
import { NavLink } from "react-router-dom";

export const TokenIcon = styled.div<{ name?: string; skeleton: boolean; logo: string }>`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 35px;
    height: 35px;
    background-color: ${({ name }) => (name ? stringToColour(name).background : "#5aa7df")};
    border: 1px solid ${({ name }) => (name ? stringToColour(name).border : "#5aa7df")};
    color: ${({ name }) => (name ? stringToColour(name).text : "#5aa7df")};
    border-radius: 50%;
    user-select: none;

    ${({ skeleton }) => (skeleton ? skeletonGradient : null)}
    background: ${({ logo }) => (logo ? `url(${logo})` : "")};
    background-size: contain;
    background-repeat: no-repeat;

    &:nth-of-type(2) {
        margin-left: -8px;
    }
`;
export const NFTPositionIcon = styled.div<{ name: string; skeleton?: boolean }>`
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    font-size: 12px;
    width: 35px;
    height: 35px;
    border-radius: 50%;
    margin-top: 2px;
    background: ${({ name }) => (name ? gradient("token" + name) : "")};
    ${({ skeleton }) =>
        skeleton &&
        css`
            background: rgba(60, 97, 126, 0.5);
            ${skeletonGradient}
        `};
`;
export const NFTPositionDescription = styled.div<{ skeleton?: boolean }>`
    margin-left: 10px;
    line-height: 18px;

    ${({ skeleton }) =>
        skeleton &&
        css`
            & > * {
                background: rgba(60, 97, 126, 0.5);
                border-radius: 6px;
                ${skeletonGradient}
            }

            & > ${NFTPositionIndex} {
                height: 18px;
                width: 40px;
                margin-bottom: 3px;
                margin-top: 2px;
            }

            & > ${NFTPositionLink} {
                height: 13px;
                width: 60px;
                display: inline-block;
            }
        `}
`;
export const NFTPositionIndex = styled.div``;

export const NFTPositionLink = styled.a`
    font-size: 13px;
    color: white;

    &:hover {
        color: #01ffff;
    }
`;

export const PositionCardBody = styled.div`
    display: flex;

    ${({ theme }) => theme.mediaWidth.upToSmall`
    flex-direction: column;
  `}
`;

export const PositionCardEvent = styled.div`
    display: flex;
    width: 100%;
    flex-direction: column;
    background-color: #11446c;
    padding: 1rem;
    border-radius: 8px;

    &:first-of-type {
        margin-right: 1rem;
    }

    ${({ theme }) => theme.mediaWidth.upToSmall`
    &:first-of-type {
      margin-bottom: 1rem;
    }
  `}
`;

export const PositionCardEventTitle = styled.div`
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 1rem;
    display: flex;
    justify-content: space-between;
`;
export const TimeWrapper = styled.span`
    font-size: 14px;
    font-weight: 400;
    line-height: 21px;
`;

export const PositionCardStats = styled.div`
    display: flex;
    margin-bottom: 1rem;

    ${({ theme }) => theme.mediaWidth.upToSmall`
    flex-direction: column;
  `}
`;

export const PositionCardStatsItemWrapper = styled.div`
    display: flex;
    margin-right: 1rem;
    width: 100%;

    &:nth-of-type(2n) {
        margin-left: 1rem;
    }

    ${({ theme }) => theme.mediaWidth.upToSmall`
    margin-right: 0;

    &:first-of-type {
      margin-bottom: 1rem;
    }

    &:last-of-type {
      margin-left: 0;
    }
  `}
`;

export const PositionCardStatsItem = styled.div`
    display: flex;
    flex-direction: column;
    margin-left: 10px;
`;

export const PositionCardStatsItemTitle = styled.div`
    font-weight: 600;
    font-size: 12px;
    text-transform: uppercase;
`;

export const PositionCardStatsItemValue = styled.div<{ title: any }>`
    font-size: 16px;
    line-height: 25px;
`;

export const PositionCardMock = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    justify-content: center;
    width: 100%;
    height: 100%;
    min-height: 92px;
`;

export const TokensNames = styled.div<{ skeleton?: boolean }>`
    margin-left: 0.5rem;

    ${({ theme }) => theme.mediaWidth.upToMedium`
    margin-left: .2rem;
    font-size: 14px;
  `}
    & > * {
        ${({ skeleton }) =>
            skeleton
                ? css`
                      width: 40px;
                      height: 16px;
                      background: #5aa7df;
                      margin-bottom: 3px;
                      border-radius: 4px;
                      ${skeletonGradient}
                  `
                : null}
    }
`;

export const EmptyMock = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 400px;

    & > * {
        margin-bottom: 1rem;
    }
`;

export const SendModal = styled.div`
    display: flex;
    flex-direction: column;
    padding: 2rem;
    width: 100%;
`;

export const ModalTitle = styled.div`
    margin-bottom: 1rem;
    font-size: 18px;
    font-weight: 600;
    color: #080064;
`;

export const RecipientInput = styled.input`
    padding: 8px;
    border: none;
    border-radius: 8px;
    width: 100%;
`;

export const SendNFTButton = styled.button`
    padding: 10px 16px;
    width: 100%;
    color: white;
    background-color: ${({ theme }) => theme.winterMainButton};
    border-radius: 8px;
    border: none;

    &:disabled {
        opacity: 0.4;
    }
`;

export const MoreButton = styled.button<{ single?: boolean }>`
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    background-color: white;
    color: #6f58f6;
    border-radius: 4px;
    padding: 8px;
    height: 30px;
    font-weight: 600;

    &:first-of-type {
        margin: auto 0 auto auto;
    }

    &:last-of-type {
        margin: ${({ single }) => (single ? "auto 0 auto auto" : "auto 0 auto 1rem")};
    }

    &:hover {
        background-color: ${darken(0.1, "#fff")};
    }

    ${({ theme }) => theme.mediaWidth.upToSmall`
    margin: 0 0 1rem 0;

    &:first-of-type {
      margin: 0 0 1rem;
    }

    &:last-of-type {
      margin: 0;
    }

  `}
`;
export const SendNFTWarning = styled.div`
    margin-bottom: 1rem;
    padding: 8px 12px;
    background: #e4e46b;
    color: #333303;
    border-radius: 8px;
`;

export const EventProgress = styled.div`
    width: 100%;
    height: 16px;
    margin-top: 6px;
    border-radius: 6px;
    background-color: white;
    position: relative;
    padding: 4px;
`;
export const EventEndTime = styled.div`
    line-height: 16px;
    font-size: 13px;
    position: relative;
    margin-bottom: 3px;
`;

export const EventProgressInner = styled.div.attrs(({ progress }: { progress: number }) => ({
    style: {
        width: `${progress}%`,
    },
}))<{ progress: number }>`
    height: 100%;
    background-color: #5bb7ff;
    border-radius: 6px;
    transition-duration: 0.5s;

    ${skeletonGradient}
`;

export const CheckOutLink = styled(NavLink)`
    color: white;
    font-size: 14px;
    text-decoration: none;
    background-color: #6F58F6;
    padding: 8px 12px;
    border-radius: 8px;
    font-weight: 600;

    &:hover {
        background-color: ${({ theme }) => darken(0.05, theme.winterMainButton)}};
    }
`;

export const PositionNotDepositedText = styled.div`
    font-size: 14px;
    margin-bottom: 8px;
`;

//IsActive
export const PositionRange = styled.div`
    display: flex;
    align-items: center;
    font-size: 14px;
`;
