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
import { getProgress } from '../../utils/getProgress'


interface StakerEventCardProps {
    active?: boolean;
    skeleton?: any;
    now?: number;
    refreshing?: boolean;
    stakeHandler?: () => void;
    event?: {
        pool?: any;
        createdAtTimestamp?: string;
        rewardToken?: any;
        bonusRewardToken?: any;
        reward?: number;
        bonusReward?: number;
        startTime?: number;
        endTime?: number;
    };
    eternal?: boolean;
}


export function StakerEventCard({
    active,
    skeleton,
    refreshing,
    stakeHandler,
    now,
    event: {
        pool,
        createdAtTimestamp,
        rewardToken,
        bonusRewardToken,
        reward,
        bonusReward,
        startTime,
        endTime
    } = {},
    eternal
}: StakerEventCardProps) {
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
                    <CurrencyLogo
                        currency={{ address: pool.token0.id, symbol: pool.token0.symbol }}
                        size={'35px'}
                    />
                    <CurrencyLogo
                        currency={{ address: pool.token1.id, symbol: pool.token1.symbol }}
                        size={'35px'}
                    />
                </TokensIcons>
                <div>
                    <Subtitle>POOL</Subtitle>
                    <PoolsSymbols>{`${pool.token0.symbol}/${pool.token1.symbol}`}</PoolsSymbols>
                </div>
            </CardHeader>
            <RewardWrapper style={{ marginBottom: '6px' }}>
                <CurrencyLogo
                    currency={{ address: rewardToken.id, symbol: rewardToken.symbol }}
                    size={'35px'}
                />
                <div style={{ marginLeft: '1rem' }}>
                    <Subtitle style={{ color: 'rgb(138, 190, 243)' }}>
                        {eternal ? 'Reward APR' : 'Reward'}
                    </Subtitle>
                    <RewardSymbol>{rewardToken.symbol}</RewardSymbol>
                </div>
                {reward && (
                    <RewardAmount title={reward.toString()}>
                        {eternal ? (
                            <span>200%</span>
                        ) : (
                            <span>{`${
                                ('' + reward).length <= 8
                                    ? reward
                                    : ('' + reward).slice(0, 6) + '..'
                            }`}</span>
                        )}
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
                    <Plus style={{ display: 'block' }} size={18}/>
                </div>
            </div>
            {bonusReward > 0 && (
                <RewardWrapper>
                    <CurrencyLogo
                        currency={{ address: bonusRewardToken.id, symbol: bonusRewardToken.symbol }}
                        size={'35px'}
                    />
                    <div style={{ marginLeft: '1rem' }}>
                        <Subtitle style={{ color: 'rgb(138, 190, 243)' }}>
                            {eternal ? 'Bonus APR' : 'Bonus'}
                        </Subtitle>
                        <RewardSymbol>{bonusRewardToken.symbol}</RewardSymbol>
                    </div>
                    {bonusReward && (
                        <RewardAmount title={bonusReward.toString()}>
                            {eternal ? (
                                <span>200%</span>
                            ) : (
                                <span>{`${
                                    ('' + bonusReward).length <= 8
                                        ? bonusReward
                                        : ('' + bonusReward).slice(0, 6) + '..'
                                }`}</span>
                            )}
                        </RewardAmount>
                    )}
                </RewardWrapper>
            )}
            {!eternal && (
                <StakeInfo active>
                    <div>
                        <>
                            <Subtitle>Start</Subtitle>
                            <div>
                                <span>
                                    {startTime &&
                                        new Date(startTime * 1000).toLocaleString().split(',')[0]}
                                </span>
                            </div>
                            <div>
                                <span>
                                    {startTime &&
                                        `${new Date(startTime * 1000)
                                            .toLocaleString()
                                            .split(',')[1]
                                            .slice(0, -3)}`}
                                </span>
                            </div>
                        </>
                    </div>

                    <div>
                        <Subtitle>End</Subtitle>
                        <div>
                            <span>
                                {endTime && new Date(endTime * 1000).toLocaleString().split(',')[0]}
                            </span>
                        </div>
                        <div>
                            {endTime && (
                                <span>{`${new Date(endTime * 1000)
                                    .toLocaleString()
                                    .split(',')[1]
                                    .slice(0, -3)}`}</span>
                            )}
                        </div>
                    </div>
                </StakeInfo>
            )}
            {!eternal && (
                <EventEndTime>
                    {active ? (
                        <span>{`ends in ${getCountdownTime(endTime, now)}`}</span>
                    ) : (
                        <span>{`starts in ${getCountdownTime(startTime, now)}`}</span>
                    )}
                </EventEndTime>
            )}
            {!eternal && (
                <EventProgress>
                    {active ?
                        <EventProgressInner progress={getProgress(startTime, endTime, now)} /> :
                        <EventProgressInner progress={getProgress(Number(createdAtTimestamp), startTime, now)} />
                    }
                </EventProgress>
            )}
            {account && !active ?
                <StakeButton
                    style={{ marginTop: eternal ? '0' : '10px' }}
                    onClick={stakeHandler}
                    skeleton={skeleton}
                > Farm </StakeButton>
                : !active &&
                <StakeButton
                    onClick={toggleWalletModal}
                    skeleton={skeleton}
                > Connect Wallet </StakeButton>
            }
        </Card>
    )
}
