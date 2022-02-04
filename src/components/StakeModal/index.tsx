import { useCallback, useEffect, useMemo, useState } from 'react'
import { Check, CheckCircle, Frown, X } from 'react-feather'
import { useIncentiveSubgraph } from '../../hooks/useIncentiveSubgraph'
import { FarmingType, useStakerHandlers } from '../../hooks/useStakerHandlers'
import { useAllTransactions } from '../../state/transactions/hooks'
import { useChunkedRows } from '../../utils/chunkForRows'
import Loader from '../Loader'
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
    StakeButton,
    StakeButtonLoader
} from './styled'

export function StakeModal({
    event: {
        pool,
        startTime,
        endTime,
        rewardAddress,
        bonusRewardAddress,
        refundee,
        token0,
        token1
    },
    closeHandler
}: {
    event: {
        pool: string
        startTime: string
        endTime: string
        id: string
        rewardAddress: string
        bonusRewardAddress: string
        refundee: string
        token0: string
        token1: string
    }
    closeHandler: () => void
}) {
    const [selectedNFT, setSelectedNFT] = useState(null)

    const {
        fetchPositionsForPool: {
            positionsForPool,
            fetchPositionsForPoolFn
        }
    } = useIncentiveSubgraph() || {}

    return positionsForPool.filter((position) => {
      if (position.pool !== pool.id) return

      if (farmingType === FarmingType.ETERNAL && position.eternalFarming) return

      if (farmingType === FarmingType.FINITE && position.incentive) return

      return true
    })
  }, [positionsForPool])

    useEffect(() => {
        fetchPositionsForPoolFn(pool)
    }, [])

    const positionsForStake = useMemo(() => {
        if (!positionsForPool) return

        return positionsForPool.filter((position: any) => position.pool === pool && !position.staked)
    }, [positionsForPool])

    const [chunkedPositions, setChunkedPositions] = useState(null)

    const _chunked = useChunkedRows(positionsForStake, 3)

    const [submitState, setSubmitState] = useState(0)
    const [submitLoader, setSubmitLoader] = useState(false)

    useEffect(() => setChunkedPositions(_chunked), [_chunked])

    const allTransactions = useAllTransactions()

    const sortedRecentTransactions = useMemo(() => {
        const txs = Object.values(allTransactions)
        return txs
            .filter((tx) => new Date().getTime() - tx.addedTime < 86_400_000)
            .sort((a, b) => b.addedTime - a.addedTime)
    }, [allTransactions])

    const confirmed = useMemo(
        () => sortedRecentTransactions.filter((tx) => tx.receipt).map((tx) => tx.hash),
        [sortedRecentTransactions, allTransactions]
    )

  const isOnFarming = useMemo(
    () =>
      selectedNFT
        ? farmingType === FarmingType.ETERNAL
          ? selectedNFT.eternalFarming
          : selectedNFT.incentive
        : undefined,
    [selectedNFT]
  )

  const NFTsForApprove = useMemo(() => filterNFTs((v) => !v.onFarmingCenter), [selectedNFT, submitState])

  const NFTsForStake = useMemo(() => filterNFTs((v) => v.onFarmingCenter), [selectedNFT, submitState])

    const NFTsForApprove = useMemo(
        () => filterNFTs((v) => v.approved === null && !v.transfered),
        [selectedNFT, submitState]
    )

    const NFTsForTransfer = useMemo(() => filterNFTs((v) => v.approved && !v.transfered), [selectedNFT, submitState])

    const NFTsForStake = useMemo(() => filterNFTs((v) => v.transfered && !v.staked), [selectedNFT, submitState])

        for (const position of row) {
          if (position.id === approvedHash.id) {
            position.onFarmingCenter = true
            setSelectedNFT((old) => ({
              ...old,
              onFarmingCenter: true,
            }))
          }

        if (approvedHash === 'failed') {
            setSubmitLoader(false)
        } else if (approvedHash && confirmed.includes(approvedHash.hash)) {
            const _newChunked = []

  useEffect(() => {
    if (!stakedHash || (stakedHash && submitState !== 2)) return

    if (stakedHash === 'failed') {
      setSubmitLoader(false)
    } else if (stakedHash && confirmed.includes(stakedHash.hash)) {
      const _newChunked = []

      for (const row of chunkedPositions) {
        const _newRow = []

        for (const position of row) {
          if (position.id === stakedHash.id) {
            position.onFarmingCenter = true
            setSelectedNFT((old) => ({
              ...old,
              onFarmingCenter: true,
            }))
          }

          _newRow.push(position)
        }

        _newChunked.push(_newRow)
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

  const stakeNFTs = useCallback(
    (eventType: FarmingType) => {
      setSubmitLoader(true)
      setSubmitState(2)
      stakeHandler(
        selectedNFT,
        {
          pool: pool.id,
          rewardToken: rewardToken.id,
          bonusRewardToken: bonusRewardToken.id,
          startTime,
          endTime,
        },
        eventType
      )
    },
    [selectedNFT, submitState]
  )

  const linkToProviding = `/add/${pool.token0.id}/${pool.token1.id}`

  return (
    <>
      {submitState === 3 ? (
        <ModalWrapper>
          <ModalHeader>
            <div></div>
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
                                  id: el.id,
                                }
                          )
                        }
                      }}
                    >
                      <NFTPositionIcon name={el.id}></NFTPositionIcon>
                      <NFTPositionDescription>
                        <NFTPositionIndex>{`#${+el.id}`}</NFTPositionIndex>
                        <NFTPositionLink
                          href={`https://app.algebra.finance/#/pool/${+el.id}`}
                          rel="noopener noreferrer"
                          target="_blank"
                        >
                          View position
                        </NFTPositionLink>
                      </NFTPositionDescription>
                      <NFTPositionSelectCircle selected={selectedNFT && selectedNFT.id === el.id}>
                        <Check
                          style={{
                            transitionDuration: '.2s',
                            opacity: selectedNFT && selectedNFT.id === el.id ? '1' : '0',
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
                    <NFTPositionIcon skeleton></NFTPositionIcon>
                    <NFTPositionDescription skeleton>
                      <NFTPositionIndex skeleton></NFTPositionIndex>
                      <NFTPositionLink skeleton></NFTPositionLink>
                    </NFTPositionDescription>
                    <NFTPositionSelectCircle></NFTPositionSelectCircle>
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
            <StakeButton disabled id={'farming-select-nft'} className={'farming-select-nft'}>
              {`Select NFT`}
            </StakeButton>
          ) : null}
        </ModalWrapper>
      )}
    </>
  )
}
