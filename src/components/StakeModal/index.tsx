import { useCallback, useEffect, useMemo, useState } from 'react'
import { ArrowRight, Check, CheckCircle, Frown, X } from 'react-feather'
import { useIncentiveSubgraph } from '../../hooks/useIncentiveSubgraph'
import { useStakerHandlers } from '../../hooks/useStakerHandlers'
import { useAllTransactions } from '../../state/transactions/hooks'
import { useChunkedRows } from '../../utils/chunkForRows'
import Loader from '../Loader'
import { FarmingType } from '../../models/enums'
import {
    CloseModalButton,
    EmptyMock,
    ModalBody,
    ModalHeader,
    ModalWrapper,
    NFTPosition,
    NFTPositionDescription,
    NFTPositionIcon,
    NFTPositionIndex,
    NFTPositionLink,
    NFTPositionSelectCircle,
    NFTPositionsRow,
    ProvideLiquidityLink,
    StakeButton,
    StakeButtonLoader
} from './styled'
import { useSortedRecentTransactions } from '../../hooks/useSortedRecentTransactions'

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

export function StakeModal({ event: { pool, startTime, endTime, id, rewardToken, bonusRewardToken }, closeHandler, farmingType }: StakeModalProps) {

    const [selectedNFT, setSelectedNFT] = useState(null)
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

    const NFTsForApprove = useMemo(() => filterNFTs((v) => !v.onFarmingCenter), [selectedNFT, submitState])

    const NFTsForStake = useMemo(() => filterNFTs((v) => v.onFarmingCenter), [selectedNFT, submitState])

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
                <ModalWrapper>
                    <ModalHeader>
                        <div />
                        <CloseModalButton onClick={closeHandler}>
                            <X size={18} stroke={'#080064'} />
                        </CloseModalButton>
                    </ModalHeader>
                    <ModalBody style={{ alignItems: 'center', justifyContent: 'center' }}>
                        <CheckCircle size={55} stroke={'#24ae2c'} />
                        <p>{`NFT #${selectedNFT.id} deposited succesfully!`}</p>
                    </ModalBody>
                </ModalWrapper>
            ) : (
                <ModalWrapper>
                    <ModalHeader>
                        <div>Select NFT for farming</div>
                        <CloseModalButton onClick={closeHandler}>
                            <X size={18} stroke={'#080064'} />
                        </CloseModalButton>
                    </ModalHeader>
                    <ModalBody>
                        {chunkedPositions && chunkedPositions.length === 0 ? (
                            <EmptyMock>
                                <Frown size={30} stroke={'#080064'} />
                                <p>No NFT-s for this pool</p>
                                <p style={{ textAlign: 'center' }}>{`To take part in this farming event, you need to`}</p>
                                <ProvideLiquidityLink to={linkToProviding}>
                                    <span>{`Provide liquidity for ${pool.token0.symbol} / ${pool.token1.symbol}`}</span>
                                    <ArrowRight style={{ marginLeft: '5px' }} size={16} />
                                </ProvideLiquidityLink>
                            </EmptyMock>
                        ) : chunkedPositions && chunkedPositions.length !== 0 ? (
                            chunkedPositions.map((row, i) => (
                                <NFTPositionsRow key={i}>
                                    {row.map((el, j) => (
                                        <NFTPosition
                                            key={j}
                                            selected={selectedNFT && selectedNFT.id === el.id}
                                            onClick={(e) => {
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
                                            <NFTPositionDescription>
                                                <NFTPositionIndex>{`#${+el.id}`}</NFTPositionIndex>
                                                <NFTPositionLink
                                                    href={`https://app.algebra.finance/#/pool/${+el.id}`}
                                                    rel='noopener noreferrer'
                                                    target='_blank'
                                                >
                                                    View position
                                                </NFTPositionLink>
                                            </NFTPositionDescription>
                                            <NFTPositionSelectCircle
                                                selected={selectedNFT && selectedNFT.id === el.id}>
                                                <Check
                                                    style={{
                                                        transitionDuration: '.2s',
                                                        opacity: selectedNFT && selectedNFT.id === el.id ? '1' : '0'
                                                    }}
                                                    size={16}
                                                    stroke={'white'}
                                                />
                                            </NFTPositionSelectCircle>
                                        </NFTPosition>
                                    ))}
                                </NFTPositionsRow>
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
                    </ModalBody>
                    {selectedNFT ? (
                        <div style={{ display: 'flex' }}>
                            <StakeButton
                                disabled={submitLoader || !NFTsForApprove}
                                onClick={approveNFTs}
                                id={'farming-approve-nft'}
                                className={'farming-approve-nft'}
                            >
                                {submitLoader && submitState === 0 ? (
                                    <StakeButtonLoader>
                                        <Loader stroke={'white'} />
                                        <span style={{ marginLeft: '5px' }}>Approving</span>
                                    </StakeButtonLoader>
                                ) : NFTsForStake && !NFTsForApprove ? (
                                    'Approved'
                                ) : (
                                    `Approve`
                                )}
                            </StakeButton>
                            <StakeButton
                                disabled={submitLoader || !NFTsForStake}
                                onClick={() => stakeNFTs(farmingType)}
                                id={'farming-deposit-nft'}
                                className={'farming-deposit-nft'}
                            >
                                {submitLoader && submitState === 2 ? (
                                    <StakeButtonLoader>
                                        <Loader stroke={'white'} />
                                        <span style={{ marginLeft: '5px' }}>Depositing</span>
                                    </StakeButtonLoader>
                                ) : (
                                    `Deposit`
                                )}
                            </StakeButton>
                        </div>
                    ) : chunkedPositions && chunkedPositions.length !== 0 ? (
                        <StakeButton disabled id={'farming-select-nft'}
                                     className={'farming-select-nft'}>
                            {`Select NFT`}
                        </StakeButton>
                    ) : null}
                </ModalWrapper>
            )}
        </>
    )
}
