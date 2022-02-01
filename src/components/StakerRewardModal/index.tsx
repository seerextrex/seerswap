import { ModalWrapper, ModalHeader, RewardTokenIcon, RewardTokenInfo, ClaimRewardButton } from './styled'

export function StakerRewardModal({
                                    rew
                                  }: {
  rew: {
    amount: string
    symbol: string
  }
}) {
  return (
    <ModalWrapper>
      <ModalHeader>
        <RewardTokenIcon name={rew.symbol}>{rew.symbol.slice(0, 2)}</RewardTokenIcon>
        <RewardTokenInfo>
          <div title={rew.amount}>{rew.amount}</div>
          <div title={rew.symbol}>{rew.symbol}</div>
        </RewardTokenInfo>
        <ClaimRewardButton>Claim</ClaimRewardButton>
      </ModalHeader>
    </ModalWrapper>
  )
}
