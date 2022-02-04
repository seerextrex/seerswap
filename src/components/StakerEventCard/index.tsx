import { Plus } from 'react-feather'
import { useActiveWeb3React } from '../../hooks/web3'
import { useWalletModalToggle } from '../../state/application/hooks'
import { getCountdownTime } from '../../utils/time'
import Loader from '../Loader'
import CurrencyLogo from '../CurrencyLogo'
import {
    Card,
    CardHeader,
    EventEndTime,
    EventProgress,
    EventProgressInner,
    LoadingShim,
    PoolsSymbols,
    RewardAmount,
    RewardSymbol,
    RewardWrapper,
    StakeButton,
    StakeDate,
    StakeInfo,
    Subtitle,
    TokenIcon,
    TokensIcons
} from './styled'

function getProgress(startTime: number, endTime: number, now: number): number {
    const length = endTime - startTime
    const elapsed = endTime - now / 1000

    return 100 - (elapsed * 100) / length
}

export function StakerEventCard({
    active,
    skeleton,
    refreshing,
    stakeHandler,
    now,
    event: {
        token0,
        token1,
        rewardToken,
        bonusRewardToken,
        token0Address,
        token1Address,
        rewardAddress,
        bonusRewardAddress,
        bonusReward,
        createdAtTimestamp,
        reward,
        startTime,
        endTime
    } = {}
}: {
    active?: boolean
    skeleton?: any
    now?: number
    refreshing?: boolean
    stakeHandler?: () => void
    event?: {
        token0?: string
        token1?: string
        createdAtTimestamp?: string
        rewardToken?: string
        rewardAddress?: string
        token0Address?: string
        token1Address?: string
        bonusRewardAddress?: string
        reward?: number
        startTime?: number
        endTime?: number
        bonusReward?: number
        participants?: number
    }
}) {
    const { account } = useActiveWeb3React()

    const toggleWalletModal = useWalletModalToggle()

    return skeleton ? (
        <Card skeleton>
            <CardHeader>
                <TokensIcons>
                    <TokenIcon skeleton />
                    <TokenIcon skeleton />
                </TokensIcons>
                <div>
                    <Subtitle skeleton />
                    <PoolsSymbols skeleton />
                </div>
            </CardHeader>
            <RewardWrapper skeleton style={{ marginBottom: '6px' }}>
                <TokenIcon skeleton />
                <div style={{ marginLeft: '1rem' }}>
                    <Subtitle skeleton />
                    <RewardSymbol skeleton />
                </div>
                <RewardAmount skeleton />
            </RewardWrapper>
            <div style={{ position: 'relative' }}>
                <div
                    style={{
                        position: 'absolute',
                        left: 'calc(50% - 11px)',
                        top: '-15px',
                        backgroundColor: '#5aa7df',
                        borderRadius: '50%',
                        padding: '3px'
                    }}
                >
                    <Plus style={{ display: 'block' }} size={18} />
                </div>
            </div>
            <RewardWrapper skeleton>
                <TokenIcon skeleton />
                <div style={{ marginLeft: '1rem' }}>
                    <Subtitle skeleton />
                    <RewardSymbol skeleton />
                </div>
                <RewardAmount skeleton />
            </RewardWrapper>
            <StakeInfo active>
                <div>
                    <Subtitle skeleton />
                    <StakeDate skeleton />
                    <StakeDate skeleton />
                </div>
                <div>
                    <Subtitle skeleton />
                    <StakeDate skeleton />
                    <StakeDate skeleton />
                </div>
            </StakeInfo>
            {active ? (
                <>
                    <EventEndTime skeleton>
                        <span />
                    </EventEndTime>
                    <EventProgress skeleton />
                </>
            ) : (
                <StakeButton skeleton />
            )}
        </Card>
    ) : (
        <Card refreshing={refreshing}>
            {refreshing && (
                <LoadingShim>
                    <Loader size={'18px'} stroke={'white'} style={{ margin: 'auto' }} />
                </LoadingShim>
            )}
            <CardHeader>
                <TokensIcons>
                    <CurrencyLogo currency={{ address: token0Address, symbol: token0 }}
                                  size={'35px'} />
                    <CurrencyLogo currency={{ address: token1Address, symbol: token1 }}
                                  size={'35px'} />
                </TokensIcons>
                <div>
                    <Subtitle>POOL</Subtitle>
                    <PoolsSymbols>{`${token0}/${token1}`}</PoolsSymbols>
                </div>
            </CardHeader>
            <RewardWrapper style={{ marginBottom: '6px' }}>
                <CurrencyLogo currency={{ address: rewardAddress, symbol: rewardToken }}
                              size={'35px'} />
                <div style={{ marginLeft: '1rem' }}>
                    <Subtitle style={{ color: 'rgb(138, 190, 243)' }}>Reward</Subtitle>
                    <RewardSymbol>{rewardToken}</RewardSymbol>
                </div>
                {reward && (
                    <RewardAmount title={reward}>
                        {('' + reward).length <= 8 ? reward : ('' + reward).slice(0, 6) + '..'}
                    </RewardAmount>
                )}
            </RewardWrapper>
            <div style={{ position: 'relative' }}>
                <div
                    style={{
                        position: 'absolute',
                        left: 'calc(50% - 11px)',
                        top: '-15px',
                        backgroundColor: 'rgb(19, 56, 93)',
                        borderRadius: '50%',
                        padding: '3px'
                    }}
                >
                    <Plus style={{ display: 'block' }} size={18} />
                </div>
            </div>
            {bonusReward > 0 &&
                <RewardWrapper>
                    <CurrencyLogo
                        currency={{ address: bonusRewardAddress, symbol: bonusRewardAddress }}
                        size={'35px'} />
                    <div style={{ marginLeft: '1rem' }}>
                        <Subtitle style={{ color: 'rgb(138, 190, 243)' }}>Bonus</Subtitle>
                        <RewardSymbol>{bonusRewardToken}</RewardSymbol>
                    </div>
                    {bonusReward && (
                        <RewardAmount title={bonusReward}>
                            {('' + bonusReward).length <= 8 ? bonusReward : ('' + bonusReward).slice(0, 6) + '..'}
                        </RewardAmount>
                    )}
                </RewardWrapper>}
            <StakeInfo active>
                <div>
                    <>
                        <Subtitle>Start</Subtitle>
                        <div>
                            <span>{startTime && new Date(startTime * 1000).toLocaleString().split(',')[0]}</span>
                        </div>
                        <div>
                            <span>{startTime && `${new Date(startTime * 1000).toLocaleString().split(',')[1].slice(0, -3)}`}</span>
                        </div>
                    </>
                </div>

                <div>
                    <Subtitle>End</Subtitle>
                    <div>
                        <span>{endTime && new Date(endTime * 1000).toLocaleString().split(',')[0]}</span>
                    </div>
                    <div>
                        {endTime &&
                            <span>{`${new Date(endTime * 1000).toLocaleString().split(',')[1].slice(0, -3)}`}</span>}
                    </div>
                </div>
            </StakeInfo>
            <EventEndTime>
                {active ? (
                    <span>{`ends in ${getCountdownTime(endTime, now)}`}</span>
                ) : (
                    <span>{`starts in ${getCountdownTime(startTime, now)}`}</span>
                )}
            </EventEndTime>
            <EventProgress>
                {active ? (
                    <EventProgressInner progress={getProgress(startTime, endTime, now)} />
                ) : (
                    <EventProgressInner
                        progress={getProgress(createdAtTimestamp, startTime, now)} />
                )}
            </EventProgress>
            {account && !active ? (
                <StakeButton onClick={stakeHandler} skeleton={skeleton}>
                    Farm
                </StakeButton>
            ) : (
                !active && (
                    <StakeButton onClick={toggleWalletModal} skeleton={skeleton}>
                        Connect Wallet
                    </StakeButton>
                )
            )}
        </Card>
    )
}
