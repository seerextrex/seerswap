import styled, {css, keyframes} from 'styled-components/macro'
import Loader from '../Loader'
import {Send} from 'react-feather'
import {TokenIcon, TokensNames} from './index'
import FarmingPositionInfo from '../FarmingPositionInfo'

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
    background-image: linear-gradient(90deg,
    rgba(91, 105, 141, 0) 0,
    rgba(91, 105, 141, 0.2) 25%,
    rgba(91, 105, 141, 0.5) 60%,
    rgba(91, 105, 141, 0));
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
    ${({skeleton}) =>
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
  height: 32px;
  padding: 8px 12px;
  background-color: ${({skeleton}) => (skeleton ? '#3d4a6a' : '#4829bb')};
  color: white;
  min-width: 126px;

  ${({disabled}) =>
          disabled &&
          css`
            opacity: 0.4;
            cursor: default;
          `}

  ${({skeleton}) =>
          skeleton
                  ? css`
                    ${skeletonGradient}
                    width: 80px;
                  `
                  : null}
  width: 80%;
`
const MoreButtonStyled = styled.button`
  ${({skeleton}) =>
          skeleton
                  ? css`
                    ${skeletonGradient}
                  `
                  : null}
  width: 20%;
  height: 32px;
  background-color: #3d4a6a;
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
const ButtonsWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 10px;
`

export default function StakerMyStakesMobileSkeleton() {

    return (
        <Wrapper>
            ID:
            <StakeIdStyled>
                <TokenIcon skeleton/>
            </StakeIdStyled>
            Pool:
            <StakePoolStyled>
                <>
                    <TokenIcon skeleton/>
                    <TokenIcon skeleton/>
                    <TokensNames>
                        <div></div>
                        <div></div>
                    </TokensNames>
                </>
            </StakePoolStyled>
            Status:
            <StakeCountdownStyled>
                <div style={{color: 'transparent', margin: '10px 15px'}}>dasdad</div>
            </StakeCountdownStyled>
            Earned:
            <StakeRewardStyled>
                <TokenIcon skeleton/>
                <TokensNames>
                    <div></div>
                    <div></div>
                </TokensNames>
            </StakeRewardStyled>
            Bonus:
            <StakeRewardStyled>
                <TokenIcon skeleton/>
                <TokensNames>
                    <div></div>
                    <div></div>
                </TokensNames>
            </StakeRewardStyled>
            <ButtonsWrapper>
                <StakeButtonStyled skeleton>
                </StakeButtonStyled>
                <MoreButtonStyled skeleton style={{marginLeft: '8px'}}>
                </MoreButtonStyled>
            </ButtonsWrapper>
        </Wrapper>
    )
}