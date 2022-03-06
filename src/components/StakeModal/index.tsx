import { useCallback, useEffect, useMemo, useState } from 'react'
import { ArrowRight, Check, CheckCircle, Frown, X } from 'react-feather'
import { useIncentiveSubgraph } from '../../hooks/useIncentiveSubgraph'
import { useStakerHandlers } from '../../hooks/useStakerHandlers'
import { useAllTransactions } from '../../state/transactions/hooks'
import { useChunkedRows } from '../../utils/chunkForRows'
import Loader from '../Loader'
import { FarmingType } from '../../models/enums'
import { NFTPosition, NFTPositionDescription, NFTPositionIcon, NFTPositionIndex, NFTPositionLink, NFTPositionSelectCircle, NFTPositionsRow } from './styled'
import { useSortedRecentTransactions } from '../../hooks/useSortedRecentTransactions'
import { NTFInterface } from '../../models/interfaces'
import { NavLink } from 'react-router-dom'
import './index.scss'

interface StakeModalProps {
    event: {
        pool: any
        startTime: string
        endTime: string
        id: string
        rewardToken: any
        bonusRewardToken: any
    }
    closeHandler: () => void
    farmingType: FarmingType
}

export function StakeModal({ event: { pool, startTime, endTime, rewardToken, bonusRewardToken }, closeHandler, farmingType }: StakeModalProps) {

    const [selectedNFT, setSelectedNFT] = useState<null | NTFInterface>(null)
    const { fetchPositionsForPool: { positionsForPool, positionsForPoolLoading, fetchPositionsForPoolFn } } = useIncentiveSubgraph() || {}

    const { approveHandler, approvedHash, stakeHandler, stakedHash } = useStakerHandlers() || {}

    useEffect(() => {
        fetchPositionsForPoolFn(pool)
    }, [])

    const positionsForStake = useMemo(() => {
        if (!positionsForPool) return []

        return positionsForPool.filter((position) => {
            if (position.pool !== pool.id) return

            if (farmingType === FarmingType.ETERNAL && position.eternalFarming) return

            if (farmingType === FarmingType.FINITE && position.incentive) return

            return true
        })
    }, [positionsForPool])
    const [chunkedPositions, setChunkedPositions] = useState<any[][] | null | undefined>(null)

    const _chunked = useChunkedRows(positionsForStake, 3)

    const [submitState, setSubmitState] = useState(0)
    const [submitLoader, setSubmitLoader] = useState(false)

    useEffect(() => setChunkedPositions(_chunked), [_chunked])

    const allTransactions = useAllTransactions()

    const sortedRecentTransactions = useSortedRecentTransactions()

    const confirmed = useMemo(() => sortedRecentTransactions.filter((tx) => tx.receipt).map((tx) => tx.hash), [sortedRecentTransactions, allTransactions])

    const filterNFTs = useCallback((fn) => {
        if (!selectedNFT) return

        const _filtered = [selectedNFT].filter(fn)

        return _filtered.length > 0 ? _filtered[0] : null
    }, [selectedNFT])

    const NFTsForApprove = useMemo(() => filterNFTs((v: NTFInterface) => !v.onFarmingCenter), [selectedNFT, submitState])

    const NFTsForStake = useMemo(() => filterNFTs((v: NTFInterface) => v.onFarmingCenter), [selectedNFT, submitState])

    useEffect(() => {
        if (!approvedHash || (approvedHash && submitState !== 0)) return

        if (typeof approvedHash === 'string') {
            setSubmitLoader(false)
        } else if (approvedHash.hash && confirmed.includes(approvedHash.hash)) {
            const _newChunked = []

            if (chunkedPositions) {
                for (const row of chunkedPositions) {
                    const _newRow = []

                    for (const position of row) {
                        if (position.id === approvedHash.id) {
                            position.onFarmingCenter = true
                            setSelectedNFT((old) => ({
                                ...old,
                                onFarmingCenter: true
                            }))
                        }
                        _newRow.push(position)
                    }
                    _newChunked.push(_newRow)
                }
            }

            setChunkedPositions(_newChunked)
            setSubmitState(1)
            setSubmitLoader(false)
        }
    }, [approvedHash, confirmed])

    useEffect(() => {
        if (!stakedHash || (stakedHash && submitState !== 2)) return

        if (typeof stakedHash === 'string') {
            setSubmitLoader(false)
        } else if (stakedHash.hash && confirmed.includes(stakedHash.hash)) {
            const _newChunked = []

            if (chunkedPositions) {
                for (const row of chunkedPositions) {
                    const _newRow = []

                    for (const position of row) {
                        if (position.id === stakedHash.id) {
                            position.onFarmingCenter = true
                            setSelectedNFT((old) => ({
                                ...old,
                                onFarmingCenter: true
                            }))
                        }
                        _newRow.push(position)
                    }
                    _newChunked.push(_newRow)
                }
            }
            setChunkedPositions(_newChunked)
            setSubmitState(3)
            setSubmitLoader(false)
        }
    }, [stakedHash, confirmed])

    const approveNFTs = useCallback(() => {
        setSubmitLoader(true)
        setSubmitState(0)
        approveHandler(selectedNFT)
    }, [selectedNFT, submitState])

    const stakeNFTs = useCallback((eventType: FarmingType) => {
        setSubmitLoader(true)
        setSubmitState(2)
        stakeHandler(
            selectedNFT,
            {
                pool: pool.id,
                rewardToken: rewardToken.id,
                bonusRewardToken: bonusRewardToken.id,
                startTime,
                endTime
            },
            eventType
        )
    }, [selectedNFT, submitState])

    const linkToProviding = `/add/${pool.token0.id}/${pool.token1.id}`

    return (
        <>
            {submitState === 3 ? (
                <div className={'w-100 p-1 c-p'}>
                    <div className={'f f-je mb-1 w-100'}>
                        <button className={'bg-t br-0'} onClick={closeHandler}>
                            <X size={18} stroke={'var(--primary)'} />
                        </button>
                    </div>
                    <div className={'h-400 f c f-ac f-jc'}>
                        <CheckCircle size={55} stroke={'var(--primary)'} />
                        <p className={'mt-05'}>{`NFT #${selectedNFT?.id} deposited succesfully!`}</p>
                    </div>
                </div>
            ) : positionsForPoolLoading ? (
                <div className={'w-100 p-1 c-p h-400 f c f-ac f-jc'}>
                    <Loader stroke={'var(--primary)'} size={'25px'} />
                </div>
            ) : (
                <div className={'w-100 c-p p-1'}>
                    <div className={'mb-1 flex-s-between'}>
                        <div>Select NFT for farming</div>
                        <button className={'bg-t br-0'} onClick={closeHandler}>
                            <X size={18} stroke={'var(--primary)'} />
                        </button>
                    </div>
                    <div className={'h-400'}>
                        {chunkedPositions && chunkedPositions.length === 0 ? (
                            <div className={'h-400 f c f-ac f-jc'}>
                                <Frown size={30} stroke={'var(--primary)'} />
                                <p className={'mt-05 mb-05'}>No NFT-s for this pool</p>
                                <p>To take part in this farming event, you need to</p>
                                <NavLink className={'flex-s-between c-w ph-1 pv-05 bg-l-pl br-8 mt-05'} to={linkToProviding}>
                                    <span>{`Provide liquidity for ${pool.token0.symbol} / ${pool.token1.symbol}`}</span>
                                    <ArrowRight className={'ml-05'} size={16} />
                                </NavLink>
                            </div>
                        ) : chunkedPositions && chunkedPositions.length !== 0 ? (
                            chunkedPositions.map((row, i) => (
                                <div key={i}>
                                    {row.map((el, j) => (
                                        <div
                                            className={'stake-modal__nft-position p-05 br-8 mr-05'}
                                            key={j}
                                            data-selected={!!selectedNFT && selectedNFT.id === el.id}
                                            onClick={(e: any) => {
                                                if (e.target.tagName !== 'A' && !submitLoader) {
                                                    setSelectedNFT((old) =>
                                                        old && old.id === el.id
                                                            ? null
                                                            : {
                                                                onFarmingCenter: el.onFarmingCenter,
                                                                id: el.id
                                                            }
                                                    )
                                                }
                                            }}
                                        >
                                            <NFTPositionIcon name={el.id} />
                                            <div className={'stake-modal__nft-position__description ml-05'}>
                                                <div>#{el.id}</div>
                                                <a
                                                    className={'fs-085 c-w'}
                                                    href={`https://app.algebra.finance/#/pool/${+el.id}`}
                                                    rel='noopener noreferrer'
                                                    target='_blank'
                                                >
                                                    View position
                                                </a>
                                            </div>
                                            <div className={'stake-modal__nft-position__circle f f-ac f-jc'}
                                                 data-selected={!!selectedNFT && selectedNFT.id === el.id}>
                                                <Check
                                                    data-selected={!!selectedNFT && selectedNFT.id === el.id}
                                                    size={'1rem'}
                                                    stroke={'white'}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ))
                        ) : (
                            <NFTPositionsRow>
                                {[0, 1, 2].map((el, i) => (
                                    <NFTPosition key={i} skeleton>
                                        <NFTPositionIcon skeleton />
                                        <NFTPositionDescription skeleton>
                                            <NFTPositionIndex skeleton />
                                            <NFTPositionLink skeleton />
                                        </NFTPositionDescription>
                                        <NFTPositionSelectCircle />
                                    </NFTPosition>
                                ))}
                            </NFTPositionsRow>
                        )}
                    </div>
                    {selectedNFT ? (
                        <div className={'f'}>
                            <button
                                disabled={submitLoader || !NFTsForApprove}
                                onClick={approveNFTs}
                                id={'farming-approve-nft'}
                                className={'btn primary w-100 mr-1 p-1 farming-approve-nft'}
                            >
                                {submitLoader && submitState === 0 ? (
                                    <span className={'f f-ac f-jc'}>
                                        <Loader stroke={'white'} />
                                        <span className={'ml-05'}>Approving</span>
                                    </span>
                                ) : NFTsForStake && !NFTsForApprove ? 'Approved' : 'Approve'}
                            </button>
                            <button
                                disabled={submitLoader || !NFTsForStake}
                                onClick={() => stakeNFTs(farmingType)}
                                id={'farming-deposit-nft'}
                                className={'btn primary w-100 p-1 farming-deposit-nft'}
                            >
                                {submitLoader && submitState === 2 ? (
                                    <span className={'f f-ac f-jc'}>
                                        <Loader stroke={'white'} />
                                        <span className={'ml-05'}>Depositing</span>
                                    </span>
                                ) : 'Deposit'
                                }
                            </button>
                        </div>
                    ) : chunkedPositions && chunkedPositions.length !== 0 ? (
                        <button
                            disabled
                            id={'farming-select-nft'}
                            className={'btn primary w-100 p-1 farming-select-nft'}>
                            Select NFT
                        </button>
                    ) : null}
                </div>
            )}
        </>
    )
}
