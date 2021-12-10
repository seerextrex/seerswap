import styled, { css, keyframes } from 'styled-components/macro'
import Loader from '../Loader'
import { Send } from 'react-feather'
import {
  MoreButton,
  StakeButton,
  StakeCountdown,
  StakeId,
  StakePool,
  StakeReward,
  TokenIcon,
  TokensNames
} from './index'
import FarmingPositionInfo from '../FarmingPositionInfo'
import { useEffect, useState } from 'react'
import { getCountdownTime } from '../../utils/time'
import { useStakerHandlers } from '../../hooks/useStakerHandlers'

interface StakerMyStakesMobileProps {
  position?: any
  modalHandler: any
  getRewardsHandler: any
  gettingReward: any
  setGettingReward: any
}

const skeletonAnimation = keyframes`
  100% {
    transform: translateX(100%);
  }
`
const skeletonGradient = css`
  position: relative;
  overflow: hidden;
  &::after {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    transform: translateX(-100%);
    background-image: linear-gradient(
      90deg,
      rgba(91, 105, 141, 0) 0,
      rgba(91, 105, 141, 0.2) 25%,
      rgba(91, 105, 141, 0.5) 60%,
      rgba(91, 105, 141, 0)
    );
    animation-name: ${skeletonAnimation};
    animation-duration: 1.5s;
    animation-iteration-count: infinite;
    content: '';
  }
`
const StakeIdStyled = styled.div`
  display: flex;
  align-items: center;
  min-width: fit-content !important;
  margin: 10px 0 15px;
`
const StakePoolStyled = styled.div`
  display: flex;
  margin: 10px 0 15px;
`
const StakeCountdownStyled = styled.div`
  font-size: 16px;
  margin: 10px 0 15px;

  max-width: 94px !important;
  min-width: 94px !important;

  & > * {
    ${({ skeleton }) =>
            skeleton
                    ? css`
            width: 80px;
            height: 16px;
            background: #3d4a6a;
            border-radius: 4px;

            ${skeletonGradient}
          `
                    : null}
  }
`
const StakeRewardStyled = styled.div`
  display: flex;
  margin: 10px 0 15px;
  
`
const StakeButtonStyled = styled.button`
  border: none;
  border-radius: 8px;
  padding: 8px 12px;
  background-color: ${({ skeleton }) => (skeleton ? '#3d4a6a' : '#4829bb')};
  color: white;
  min-width: 126px;

  ${({ disabled }) =>
          disabled &&
          css`
      opacity: 0.4;
      cursor: default;
    `}

  ${({ skeleton }) =>
          skeleton
                  ? css`
          ${skeletonGradient}
          width: 80px;
        `
                  : null}
width: 80%;
`
const MoreButtonStyled = styled.button`
width: 20%;
  background-color: #040b1e;
  border: none;
  border-radius: 8px;
  padding: 6px 3px 4px;
`
const Wrapper = styled.div`
  width: 100%;
  background-color: #202635;
  border-radius: 10px;
  padding: 15px;
`
const Title = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 15px;
`
const TitleCell = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 58px;
  align-items: start;
  height: 100%;
`
const ButtonsWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 10px;
`

export default function StakerMyStakesMobile({ position, modalHandler, getRewardsHandler, gettingReward, setGettingReward}: StakerMyStakesMobileProps) {
  return (
    <Wrapper>
      ID:
      <StakeIdStyled>
        <FarmingPositionInfo el={position} />
      </StakeIdStyled>
      Pool:
      <StakePoolStyled>
        <>
          <TokenIcon name={position.pool.token0.symbol}>{position.pool.token0.symbol.slice(0, 2)}</TokenIcon>
          <TokenIcon name={position.pool.token1.symbol}>{position.pool.token1.symbol.slice(0, 2)}</TokenIcon>
          <TokensNames>
            <div>{position.pool.token0.symbol}</div>
            <div>{position.pool.token1.symbol}</div>
          </TokensNames>
        </>
      </StakePoolStyled>
      Status:
      <StakeCountdownStyled>
        {position.ended || position.endTime * 1000 < Date.now() ? 'Finished' : getCountdownTime(position.endTime)}
      </StakeCountdownStyled>
      Earned:
      <StakeRewardStyled>
        <TokenIcon name={position.rewardToken.symbol}>{position.rewardToken.symbol.slice(0, 2)}</TokenIcon>
        <TokensNames>
          <div>{position.earned}</div>
          <div>{position.rewardToken.symbol}</div>
        </TokensNames>
      </StakeRewardStyled>
      Bonus:
      <StakeRewardStyled>
        <TokenIcon name={position.bonusRewardToken}>{position.bonusRewardToken.symbol.slice(0, 2)}</TokenIcon>
        <TokensNames>
          <div>{position.bonusEarned}</div>
          <div>{position.bonusRewardToken.symbol}</div>
        </TokensNames>
      </StakeRewardStyled>
      <ButtonsWrapper>
        <StakeButtonStyled
          disabled={gettingReward.id && gettingReward.state !== 'done'}
          onClick={() => {
            setGettingReward({ id: position.tokenId, state: 'pending' })
            getRewardsHandler(position.tokenId, { ...position })
          }}
        >
          {false ? (
            <span>
                        <Loader size={'18px'} stroke={'white'} style={{ margin: 'auto' }} />
                      </span>
          ) : (
            <span>{`Collect reward`}</span>
          )}
        </StakeButtonStyled>
        <MoreButtonStyled style={{ marginLeft: '8px' }} onClick={() => modalHandler(position.L2tokenId)}>
          <Send color={'white'} size={18} />
        </MoreButtonStyled>
      </ButtonsWrapper>
    </Wrapper>
  )
}