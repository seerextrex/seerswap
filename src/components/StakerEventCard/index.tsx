import { Plus } from 'react-feather'
import { useActiveWeb3React } from '../../hooks/web3'
import { useWalletModalToggle } from '../../state/application/hooks'
import { convertDateTime, getCountdownTime } from '../../utils/time'
import { getProgress } from '../../utils/getProgress'
import Loader from '../Loader'
import CurrencyLogo from '../CurrencyLogo'
import { LoadingShim } from './styled'
import { useMemo } from 'react'
import { convertLocalDate } from '../../utils/convertDate'
import { Token } from '@uniswap/sdk-core'
import { SupportedChainId } from '../../constants/chains'
import { WrappedCurrency } from '../../models/types'
import { formatAmountTokens } from 'utils/numbers'

import './index.scss'

interface StakerEventCardProps {
    active?: boolean
    now?: number
    refreshing?: boolean
    stakeHandler?: () => void
    event?: {
        pool?: any;
        createdAtTimestamp?: string;
        rewardToken?: any;
        bonusRewardToken?: any;
        reward?: number;
        bonusReward?: number;
        startTime?: number;
        endTime?: number;
        apr?: number;
        locked?: boolean;
    };
    eternal?: boolean;
    secret?: boolean;
}

export function StakerEventCard({
    active, refreshing, stakeHandler, now, event: {
        pool,
        createdAtTimestamp,
        rewardToken,
        bonusRewardToken,
        reward,
        bonusReward,
        startTime,
        endTime,
        apr,
        locked
    } = {},
    eternal,
    secret
}: StakerEventCardProps) {
    const { account } = useActiveWeb3React();
    const toggleWalletModal = useWalletModalToggle();

    const _startTime = useMemo(() => {
        if (!startTime) return [];

        const date = new Date(+startTime * 1000);

        return [convertLocalDate(date), convertDateTime(date)];
    }, [startTime]);

    const _endTime = useMemo(() => {
        if (!endTime) return [];

        const date = new Date(+endTime * 1000);

        return [convertLocalDate(date), convertDateTime(date)];
    }, [endTime]);

    if (secret) {

        return (
            <div className={'staker-event-card p-1 br-12'} data-refreshing={refreshing}>
            {refreshing && (
                <LoadingShim>
                    <Loader size={"18px"} stroke={"white"} style={{ margin: "auto" }} />
                </LoadingShim>
            )}
            <div className={'f mb-1'}>
                <div className={'f mr-1'}>
                    <CurrencyLogo
                        currency={new Token(SupportedChainId.POLYGON, "0x7ceb23fd6bc0add59e62ac25578270cff1b9f619", 18, "WETH") as WrappedCurrency}
                        size={'35px'}
                    />
                    <CurrencyLogo
                        currency={new Token(SupportedChainId.POLYGON, "0x2791bca1f2de4661ed88a30c99a7a9449aa84174", 18, "USDC") as WrappedCurrency}
                        size={'35px'}
                    />
                </div>
                <div>
                    <h3 className={'fs-075 b'}>POOL</h3>
                    <div>{'WETH / USDC'}</div>
                </div>
            </div>
            <div className={'staker-event-card__reward-wrapper mb-1 f f-ac p-05 br-8'}>
                <CurrencyLogo
                    currency={new Token(SupportedChainId.POLYGON, "0x0169ec1f8f639b32eec6d923e24c2a2ff45b9dd6", 18, "ALGB") as WrappedCurrency}
                    size={'35px'}
                />
                <div className={'ml-1 f c'}>
                    <span className={'c-ph fs-075 b'}>REWARD</span>
                    <span>{'ALGB'}</span>
                </div>
                    <div className={'m-a mr-0 fs-125'} title={'1000000'}>
                            <span>{formatAmountTokens(1000000)}</span>
                    </div>
            </div>
            <div className={'staker-event-card__plus'}>
                <div>
                    <Plus style={{ display: 'block' }} size={18} />
                </div>
            </div>
            {bonusReward && bonusReward > 0 && (
                <div className={'staker-event-card__reward-wrapper mb-1 f f-ac p-05 br-8'}>
                    <CurrencyLogo
                        currency={new Token(SupportedChainId.POLYGON, "0x0169ec1f8f639b32eec6d923e24c2a2ff45b9dd6", 18, "ALGB") as WrappedCurrency}
                        size={'35px'}
                    />
                    <div className={'ml-1 f c'}>
                        <span className={'c-ph fs-075 b'}>BONUS</span>
                        <span>{'ALGB'}</span>
                    </div>
                        <div className={'m-a mr-0 fs-125'} title={'400000'}>
                            <span>{formatAmountTokens(400000)}</span>
                        </div>
                </div>
            )}
            {!eternal && (
                <div className={'flex-s-between mb-05'}>
                    <div className={'f c'}>
                        <span className={'fs-075 b'}>START</span>
                        <span>
                            {convertLocalDate(new Date(1647543600 * 1000))}
                        </span>
                        <span>
                            {convertDateTime(new Date(1647543600 * 1000))}
                        </span>
                    </div>
                    <div className={'f c'}>
                        <span className={'fs-075 b'}>END</span>
                        <span>
                            {convertLocalDate(new Date(1648148400 * 1000))}
                        </span>
                        <span>
                          {convertDateTime(new Date(1648148400 * 1000))}
                        </span>
                    </div>
                </div>
            )}
                <div className={'fs-075 ta-c'}>
                    <span>{`will be available in ${getCountdownTime(1647356400, Date.now())}`}</span>
                </div>
                <div className={'staker-event-card__progress w-100 br-8 p-025'}>
                        <div className={'br-8'} style={{ width: `${Number(getProgress(1647356400, Math.round(Date.now() / 1000), now).toPrecision(1))}%` }} />
                </div>
              <span style={{ marginTop: "1rem", fontSize: "14px", lineHeight: "21px", padding: "6px 8px", borderRadius: "6px", textAlign: "center", backgroundColor: "#333aa0" }}>
                    ⚡ Upcoming farm
                </span>
        </div>
        )

    }

    return (
        <div className={'staker-event-card p-1 br-12'} data-refreshing={refreshing}>
            {refreshing && (
                <LoadingShim>
                    <Loader size={"18px"} stroke={"white"} style={{ margin: "auto" }} />
                </LoadingShim>
            )}
            <div className={'f mb-1'}>
                <div className={'f mr-1'}>
                    <CurrencyLogo
                        currency={new Token(SupportedChainId.POLYGON, pool.token0.id, 18, pool.token0.symbol) as WrappedCurrency}
                        size={'35px'}
                    />
                    <CurrencyLogo
                        currency={new Token(SupportedChainId.POLYGON, pool.token1.id, 18, pool.token1.symbol) as WrappedCurrency}
                        size={'35px'}
                    />
                </div>
                <div>
                    <h3 className={'fs-075 b'}>POOL</h3>
                    <div>{`${pool.token0.symbol}/${pool.token1.symbol}`}</div>
                </div>
            </div>
            <div className={'staker-event-card__reward-wrapper mb-1 f f-ac p-05 br-8'}>
                <CurrencyLogo
                    currency={new Token(SupportedChainId.POLYGON, rewardToken.id, 18, rewardToken.symbol) as WrappedCurrency}
                    size={'35px'}
                />
                <div className={'ml-1 f c'}>
                    <span className={'c-ph fs-075 b'}>REWARD</span>
                    <span>{rewardToken.symbol}</span>
                </div>
                {reward && (
                    <div className={'m-a mr-0 fs-125'} title={reward.toString()}>
                        {eternal ? <span /> :
                            <span>{('' + reward).length <= 10 ? reward : ('' + reward).slice(0, 8) + '..'}</span>
                        }
                    </div>
                )}
            </div>
            <div className={'staker-event-card__plus'}>
                <div>
                    <Plus style={{ display: 'block' }} size={18} />
                </div>
            </div>
            {bonusReward && bonusReward > 0 && (
                <div className={'staker-event-card__reward-wrapper mb-1 f f-ac p-05 br-8'}>
                    <CurrencyLogo
                        currency={new Token(SupportedChainId.POLYGON, bonusRewardToken.id, 18, bonusRewardToken.symbol) as WrappedCurrency}
                        size={'35px'}
                    />
                    <div className={'ml-1 f c'}>
                        <span className={'c-ph fs-075 b'}>BONUS</span>
                        <span>{bonusRewardToken.symbol}</span>
                    </div>
                    {bonusReward && (
                        <div className={'m-a mr-0 fs-125'} title={bonusReward.toString()}>
                            {eternal ?
                                <span /> :
                                <span>{('' + bonusReward).length <= 10 ? bonusReward : ('' + bonusReward).slice(0, 8) + '..'}</span>
                            }
                        </div>
                    )}
                </div>
            )}
            {!eternal && (
                <div className={'flex-s-between mb-05'}>
                    <div className={'f c'}>
                        <span className={'fs-075 b'}>START</span>
                        <span>
                            {startTime && _startTime[0]}
                        </span>
                        <span>
                            {startTime && _startTime[1]}
                        </span>
                    </div>
                    <div className={'f c'}>
                        <span className={'fs-075 b'}>END</span>
                        <span>
                            {endTime && _endTime[0]}
                        </span>
                        <span>
                          {endTime && _endTime[1]}
                        </span>
                    </div>
                </div>
            )}
            {!eternal && (
                <div className={'fs-075 ta-c'}>
                    {active ? (
                        <span>{`ends in ${getCountdownTime(endTime ?? 0, now ?? Date.now())}`}</span>
                    ) : (
                        <span>{`starts in ${getCountdownTime(startTime ?? 0, now ?? Date.now())}`}</span>
                    )}
                </div>
            )}
            {!eternal && (
                <div className={'staker-event-card__progress w-100 br-8 p-025'}>
                    {active ?
                        <div className={'br-8'} style={{ width: `${getProgress(startTime, endTime, now)}%` }} /> :
                        <div className={'br-8'} style={{ width: `${getProgress(Number(createdAtTimestamp), startTime, now)}%` }} />
                    }
                </div>
            )}
            {eternal && (
                <div className={'staker-event-card__reward-wrapper mb-1 flex-s-between p-05 br-8'}>
                    <span className={'fs-085'}>Overall APR</span>
                    <span>{apr?.toFixed(2)}%</span>
                </div>
            )}
            {account && !active ?
                <button
                    className={`btn primary w-100 b pv-05 ${!eternal ? 'mt-05' : ''}`}
                    onClick={stakeHandler}
                > { locked ? 'Filled' : 'Farm'}
                </button> : active ? <span style={{ marginTop: "1rem", fontSize: "14px", lineHeight: "21px", padding: "6px 8px", borderRadius: "6px", textAlign: "center", backgroundColor: "#17517c" }}>
            Started!
        </span> :
                <button
                    className={`btn primary w-100 b pv-05 ${!eternal ? 'mt-05' : ''}`}
                    onClick={toggleWalletModal}
                > Connect Wallet
                </button>
            }
        </div>
    )
}
