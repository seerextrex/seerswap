import { IsActive } from './IsActive'
import CurrencyLogo from '../CurrencyLogo'
import Loader from '../Loader'
import { ChevronsUp, Send } from 'react-feather'
import { getProgress } from '../../utils/getProgress'
import { useStakerHandlers } from '../../hooks/useStakerHandlers'
import { getCountdownTime } from '../../utils/time'
import { CheckOut } from './CheckOut'
import { FarmingType } from '../../models/enums'
import {
    EventEndTime,
    EventProgress,
    EventProgressInner,
    MoreButton,
    NFTPositionDescription,
    NFTPositionIcon,
    NFTPositionIndex,
    NFTPositionLink,
    PositionCard,
    PositionCardBody,
    PositionCardEvent,
    PositionCardEventTitle,
    PositionCardHeader,
    PositionCardMock,
    PositionCardStats,
    PositionCardStatsItem,
    PositionCardStatsItemTitle,
    PositionCardStatsItemValue,
    PositionCardStatsItemWrapper,
    PositionNotDepositedText,
    StakeActions,
    StakeBottomWrapper,
    StakeButton,
    StakeCountdownProgress,
    StakeCountdownWrapper,
    StakePool,
    TokensNames
} from './styled'
import { formatReward } from '../../utils/formatReward'
import { useLocation } from 'react-router'
import { Token } from '@uniswap/sdk-core'

interface TableProps {
    positions: any[]
    unstaking: any
    setUnstaking: any
    setSendModal: any
    gettingReward: any
    setGettingReward: any
    now: any
    eternalCollectReward: any
    setEternalCollectReward: any
}

export function Table({
    positions,
    unstaking,
    setUnstaking,
    setSendModal,
    gettingReward,
    setGettingReward,
    now,
    eternalCollectReward,
    setEternalCollectReward
}: TableProps) {
    const { hash } = useLocation()

    const {
        eternalCollectRewardHandler,
        withdrawHandler,
        exitHandler,
        claimRewardsHandler
    } = useStakerHandlers() || {}

    return (
        <>
            {
                positions.map((el, i) => (
                    <PositionCard key={i} navigatedTo={hash == `#${el.id}`}>
                        <PositionCardHeader>
                            <div style={{ display: 'flex' }}>
                                <NFTPositionIcon name={el.id}>
                                    <span>{el.id}</span>
                                </NFTPositionIcon>
                                <NFTPositionDescription>
                                    <NFTPositionIndex>
                                        <IsActive el={el} />
                                    </NFTPositionIndex>
                                    <NFTPositionLink
                                        href={`https://app.algebra.finance/#/pool/${+el.id}?onFarming=true`}
                                        rel='noopener noreferrer'
                                        target='_blank'
                                    >
                                        View position
                                    </NFTPositionLink>
                                </NFTPositionDescription>
                            </div>
                            <StakePool>
                                <>
                                    <CurrencyLogo currency={{
                                        address: el.token0,
                                        symbol: el.pool.token0.symbol
                                    }} size={'35px'} />
                                    <CurrencyLogo
                                        currency={{
                                            address: el.token1,
                                            symbol: el.pool.token1.symbol
                                        }}
                                        size={'35px'}
                                        style={{ marginLeft: '-1rem' }}
                                    />
                                    <TokensNames>
                                        <PositionCardStatsItemTitle
                                            style={{ lineHeight: '20px' }}>Pool</PositionCardStatsItemTitle>
                                        <div>{`${el.pool.token0.symbol} / ${el.pool.token1.symbol}`}</div>
                                    </TokensNames>
                                </>
                            </StakePool>
                            {!el.incentive && !el.eternalFarming && (
                                <MoreButton
                                    disabled={unstaking.id === el.id && unstaking.state !== 'done'}
                                    onClick={() => {
                                        setUnstaking({ id: el.id, state: 'pending' })
                                        withdrawHandler(el.id, { ...el })
                                    }}
                                >
                                    {unstaking && unstaking.id === el.id && unstaking.state !== 'done' ? (
                                        <>
                                            <Loader size={'15px'} stroke={'#36f'}
                                                    style={{ margin: 'auto' }} />
                                            <span style={{ marginLeft: '5px' }}>Withdrawing</span>
                                        </>
                                    ) : (
                                        <>
                                            <ChevronsUp color={'#36f'} size={18} />
                                            <span style={{ marginLeft: '5px' }}>{`Withdraw`}</span>
                                        </>
                                    )}
                                </MoreButton>
                            )}
                            <MoreButton single={el.incentive || el.eternalFarming}
                                        onClick={() => setSendModal(el.L2tokenId)}>
                                <Send color={'#36f'} size={15} />
                                <span style={{ marginLeft: '6px' }}>Send</span>
                            </MoreButton>
                        </PositionCardHeader>
                        <PositionCardBody>
                            <PositionCardEvent>
                                <PositionCardEventTitle>Event</PositionCardEventTitle>
                                {el.incentive ? (
                                    <>
                                        <PositionCardStats>
                                            <PositionCardStatsItemWrapper>
                                                <CurrencyLogo
                                                    size={'35px'}
                                                    currency={{
                                                        address: el.incentiveRewardToken?.id,
                                                        symbol: el.incentiveRewardToken?.symbol
                                                    }}
                                                />
                                                <PositionCardStatsItem>
                                                    <PositionCardStatsItemTitle>Reward</PositionCardStatsItemTitle>
                                                    <PositionCardStatsItemValue
                                                        title={el.incentiveEarned}>{`${formatReward(el.incentiveEarned)} ${
                                                        el.incentiveRewardToken.symbol
                                                    }`}</PositionCardStatsItemValue>
                                                </PositionCardStatsItem>
                                            </PositionCardStatsItemWrapper>
                                            <PositionCardStatsItemWrapper>
                                                <CurrencyLogo
                                                    size={'35px'}
                                                    currency={{
                                                        address: el.incentiveBonusRewardToken?.id,
                                                        symbol: el.incentiveBonusRewardToken?.symbol
                                                    }}
                                                />
                                                <PositionCardStatsItem>
                                                    <PositionCardStatsItemTitle>Bonus
                                                        reward</PositionCardStatsItemTitle>
                                                    <PositionCardStatsItemValue
                                                        title={el.incentiveBonusEarned}>{`${formatReward(
                                                        el.incentiveBonusEarned
                                                    )} ${el.incentiveBonusRewardToken.symbol}`}</PositionCardStatsItemValue>
                                                </PositionCardStatsItem>
                                            </PositionCardStatsItemWrapper>
                                        </PositionCardStats>
                                        <StakeBottomWrapper>
                                            {!el.ended && el.incentiveEndTime * 1000 > Date.now() && (
                                                <StakeCountdownWrapper>
                                                    <StakeCountdownProgress
                                                        started={el.started || el.incentiveStartTime * 1000 < Date.now()}>
                                                        {!el.started && el.incentiveStartTime * 1000 > Date.now() && (
                                                            <EventEndTime>{`Starts in ${getCountdownTime(el.incentiveStartTime, now)}`}</EventEndTime>
                                                        )}
                                                        {(el.started || el.incentiveStartTime * 1000 < Date.now()) && (
                                                            <EventEndTime>{`Ends in ${getCountdownTime(el.incentiveEndTime, now)}`}</EventEndTime>
                                                        )}
                                                        <EventProgress>
                                                            {!el.started && el.incentiveStartTime * 1000 > Date.now() ? (
                                                                <EventProgressInner
                                                                    progress={getProgress(el.createdAtTimestamp, el.incentiveStartTime, now)}
                                                                />
                                                            ) : (
                                                                <EventProgressInner
                                                                    progress={getProgress(el.incentiveStartTime, el.incentiveEndTime, now)}
                                                                />
                                                            )}
                                                        </EventProgress>
                                                    </StakeCountdownProgress>
                                                    {!el.started && el.incentiveStartTime * 1000 > Date.now() && (
                                                        <StakeButton
                                                            disabled={
                                                                gettingReward.id === el.id &&
                                                                gettingReward.farmingType === FarmingType.FINITE &&
                                                                gettingReward.state !== 'done'
                                                            }
                                                            onClick={() => {
                                                                setGettingReward({
                                                                    id: el.id,
                                                                    state: 'pending',
                                                                    farmingType: FarmingType.FINITE
                                                                })
                                                                exitHandler(el.id, { ...el })
                                                            }}
                                                        >
                                                            {gettingReward &&
                                                            gettingReward.farmingType === FarmingType.FINITE &&
                                                            gettingReward.id === el.id &&
                                                            gettingReward.state !== 'done' ? (
                                                                <span>
                              <Loader size={'13px'} stroke={'white'} style={{ margin: 'auto' }} />
                            </span>
                                                            ) : (
                                                                <span>{`Undeposit`}</span>
                                                            )}
                                                        </StakeButton>
                                                    )}
                                                </StakeCountdownWrapper>
                                            )}
                                            {(el.ended || el.incentiveEndTime * 1000 < Date.now()) && (
                                                <StakeButton
                                                    disabled={
                                                        (gettingReward.id === el.id &&
                                                            gettingReward.farmingType === FarmingType.FINITE &&
                                                            gettingReward.state !== 'done') ||
                                                        el.incentiveReward == 0
                                                    }
                                                    onClick={() => {
                                                        setGettingReward({
                                                            id: el.id,
                                                            state: 'pending',
                                                            farmingType: FarmingType.FINITE
                                                        })
                                                        claimRewardsHandler(el.id, { ...el }, FarmingType.FINITE)
                                                    }}
                                                >
                                                    {gettingReward &&
                                                    gettingReward.farmingType === FarmingType.FINITE &&
                                                    gettingReward.id === el.id &&
                                                    gettingReward.state !== 'done' ? (
                                                        <span>
                          <Loader size={'13px'} stroke={'white'} style={{ margin: 'auto' }} />
                        </span>
                                                    ) : (
                                                        <span>{`Collect rewards & Undeposit`}</span>
                                                    )}
                                                </StakeButton>
                                            )}
                                        </StakeBottomWrapper>
                                    </>
                                ) : (
                                    <PositionCardMock>
                                        <PositionNotDepositedText>Position is not
                                            deposited</PositionNotDepositedText>
                                        <CheckOut link={'future-events'} />
                                    </PositionCardMock>
                                )}
                            </PositionCardEvent>
                            <PositionCardEvent>
                                <PositionCardEventTitle>
                                    <span>Infinite farming</span>
                                    {el.enteredInEternalFarming &&
                                        <span style={{
                                            fontSize: '14px',
                                            fontWeight: 400,
                                            lineHeight: '21px'
                                        }}>
                <span>Entered at: </span>
                <span>{new Date(el.enteredInEternalFarming * 1000).toLocaleString().split(',')[0]}</span>
                <span>{`${new Date(el.enteredInEternalFarming * 1000)
                    .toLocaleString()
                    .split(',')[1]
                    .slice(0, -3)}`}</span>
              </span>
                                    }
                                </PositionCardEventTitle>
                                {el.eternalFarming ? (
                                    <>
                                        <PositionCardStats>
                                            <PositionCardStatsItemWrapper>
                                                <CurrencyLogo
                                                    size={'35px'}
                                                    currency={{
                                                        address: el.eternalRewardToken.id,
                                                        symbol: el.eternalRewardToken.symbol
                                                    }}
                                                />
                                                <PositionCardStatsItem>
                                                    <PositionCardStatsItemTitle>Reward</PositionCardStatsItemTitle>
                                                    <PositionCardStatsItemValue
                                                        title={el.eternalEarned}>{`${formatReward(el.eternalEarned)} ${
                                                        el.eternalRewardToken.symbol
                                                    }`}</PositionCardStatsItemValue>
                                                </PositionCardStatsItem>
                                            </PositionCardStatsItemWrapper>
                                            <PositionCardStatsItemWrapper>
                                                <CurrencyLogo
                                                    size={'35px'}
                                                    currency={{
                                                        address: el.eternalBonusRewardToken.id, symbol: el.eternalBonusRewardToken.symbol
                                                    }}
                                                />
                                                <PositionCardStatsItem>
                                                    <PositionCardStatsItemTitle>Bonus
                                                        Reward</PositionCardStatsItemTitle>
                                                    <PositionCardStatsItemValue
                                                        title={el.eternalBonusEarned}>{`${formatReward(
                                                        el.eternalBonusEarned
                                                    )} ${el.eternalBonusRewardToken.symbol}`}
                                                    </PositionCardStatsItemValue>
                                                </PositionCardStatsItem>
                                            </PositionCardStatsItemWrapper>
                                        </PositionCardStats>
                                        <StakeActions>
                                            <StakeButton
                                                disabled={
                                                    (eternalCollectReward.id === el.id && eternalCollectReward.state !== 'done') ||
                                                    (el.eternalEarned == 0 && el.eternalBonusEarned == 0)
                                                }
                                                onClick={() => {
                                                    setEternalCollectReward({
                                                        id: el.id,
                                                        state: 'pending'
                                                    })
                                                    eternalCollectRewardHandler(el.id, { ...el })
                                                }}
                                            >
                                                {eternalCollectReward &&
                                                eternalCollectReward.id === el.id &&
                                                eternalCollectReward.state !== 'done' ? (
                                                    <span>
                        <Loader size={'13px'} stroke={'white'} style={{ margin: 'auto' }} />
                      </span>
                                                ) : (
                                                    <span>{`Collect rewards`}</span>
                                                )}
                                            </StakeButton>
                                            <StakeButton
                                                disabled={
                                                    gettingReward.id === el.id &&
                                                    gettingReward.farmingType === FarmingType.ETERNAL &&
                                                    gettingReward.state !== 'done'
                                                }
                                                onClick={() => {
                                                    setGettingReward({
                                                        id: el.id,
                                                        state: 'pending',
                                                        farmingType: FarmingType.ETERNAL
                                                    })
                                                    claimRewardsHandler(el.id, { ...el }, FarmingType.ETERNAL)
                                                }}
                                            >
                                                {gettingReward &&
                                                gettingReward.id === el.id &&
                                                gettingReward.farmingType === FarmingType.ETERNAL &&
                                                gettingReward.state !== 'done' ? (
                                                    <span>
                        <Loader size={'13px'} stroke={'white'} style={{ margin: 'auto' }} />
                      </span>
                                                ) : (
                                                    <span>{`Undeposit`}</span>
                                                )}
                                            </StakeButton>
                                        </StakeActions>
                                    </>
                                ) : (
                                    <PositionCardMock>
                                        <PositionNotDepositedText>Position is not
                                            deposited</PositionNotDepositedText>
                                        <CheckOut link={'infinite-farms'} />
                                    </PositionCardMock>
                                )}
                            </PositionCardEvent>
                        </PositionCardBody>
                    </PositionCard>
                ))
            }
        </>
    )
}
