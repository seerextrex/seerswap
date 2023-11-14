import styled, { css } from "styled-components/macro";
import { ButtonSecondary } from "../Button";
import { darken } from "polished";
import { Activity } from "react-feather";

const Web3StatusGeneric = styled(ButtonSecondary)`
    ${({ theme }) => theme.flexRowNoWrap}
    width: 100%;
    align-items: center;
    border-radius: 8px;
    cursor: pointer;
    user-select: none;
    border-radius: var(--radius-border-radius-12, 12px);

    background: var(--surface-theme-dark-brand, linear-gradient(180deg, #9185f7 0%, #6f58f6 100%));
    box-shadow: 0px 1px 3px -1px rgba(17, 12, 34, 0.12);
    color: var(--white);
    padding: 8px 16px;

    :hover {
        background: var(--surface-theme-dark-brand, linear-gradient(180deg, #7d72e6 0%, #4c33d6 100%));
    }

    :disabled {
        color: #938dcc7f;
        background: var(--surface-theme-dark-brand, linear-gradient(180deg, #4e4c66 0%, #3a374c 100%));
        border-color: transparent;
        cursor: not-allowed;
    }

    :focus {
        box-shadow: none;
        outline: none;
    }
`;

export const Web3StatusError = styled(Web3StatusGeneric)`
    background: none;
    background-color: ${({ theme }) => theme.red1};
    border: 1px solid ${({ theme }) => theme.red1};
    color: ${({ theme }) => theme.white};
    font-weight: 500;

    :hover,
    :focus {
        background: none;
        background-color: ${({ theme }) => darken(0.1, theme.red1)};
    }
`;
export const Web3StatusConnect = styled(Web3StatusGeneric)<{ faded?: boolean }>`
    background-color: ${({ theme }) => theme.winterMainButton};
    border: 1px solid ${({ theme }) => theme.winterMainButton};
    padding: 10px 36px;

    color: white;
    font-weight: 500;

    :hover,
    :focus {
        border: 1px solid ${({ theme }) => darken(0.05, theme.winterMainButton)};
        background-color: ${({ theme }) => darken(0.05, theme.winterMainButton)};
        color: white;
    }

    ${({ theme }) => theme.mediaWidth.upToSmall`
      padding: 10px 16px;
    `}
`;
export const Web3StatusConnected = styled(Web3StatusGeneric)<{ pending?: boolean }>`
    background-color: ${({ pending, theme }) => (pending ? theme.primary1 : theme.bg0)};
    color: ${({ pending, theme }) => (pending ? theme.white : theme.text1)};
    padding: 10px 0 10px 10px;
    font-weight: 500;

    ${({ theme }) => theme.mediaWidth.upToSmall`
    font-size: 15px;
  `}
`;
export const Text = styled.p`
    flex: 1 1 auto;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin: 0 0.5rem 0 0.25rem;
    font-size: 1rem;
    width: fit-content;
    font-weight: 500;

    ${({ theme }) => theme.mediaWidth.upToSmall`
      font-size: 11px;
  `}
`;
export const NetworkIcon = styled(Activity)`
    margin-left: 0.25rem;
    margin-right: 0.5rem;
    width: 16px;
    height: 16px;
`;
