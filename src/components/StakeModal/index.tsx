import { useCallback, useEffect, useMemo, useState } from 'react'
import { Check, CheckCircle, Frown, X } from 'react-feather'
import { useIncentiveSubgraph } from '../../hooks/useIncentiveSubgraph'
import { useStakerHandlers } from '../../hooks/useStakerHandlers'
import { useAllTransactions } from '../../state/transactions/hooks'
import { useChunkedRows } from '../../utils/chunkForRows'
import Loader from '../Loader'
import {
  CloseModalButton,
  ModalBody,
  ModalHeader,
  ModalWrapper,
  StakeButton,
  StakeButtonLoader,
  NFTPosition,
  NFTPositionDescription,
  NFTPositionIcon,
  NFTPositionIndex,
  NFTPositionLink,
  NFTPositionsRow,
  NFTPositionSelectCircle,
  EmptyMock
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

  const { fetchPositionsForPool: { positionsForPool, fetchPositionsForPoolFn } } = useIncentiveSubgraph() || {}

  const { approveHandler, approvedHash, transferHandler, transferedHash, stakeHandler, stakedHash } = useStakerHandlers() || {}

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

  const filterNFTs = useCallback(
    (fn) => {
      if (!selectedNFT) return

      const _filtered = [selectedNFT].filter(fn)

      return _filtered.length > 0 ? _filtered[0] : null
    },
    [selectedNFT]
  )

  const NFTsForApprove = useMemo(
    () => filterNFTs((v) => v.approved === null && !v.transfered),
    [selectedNFT, submitState]
  )

  const NFTsForTransfer = useMemo(() => filterNFTs((v) => v.approved && !v.transfered), [selectedNFT, submitState])

  const NFTsForStake = useMemo(() => filterNFTs((v) => v.transfered && !v.staked), [selectedNFT, submitState])

  useEffect(() => {
    if (!approvedHash || (approvedHash && submitState !== 0)) return

    if (approvedHash === 'failed') {
      setSubmitLoader(false)
    } else if (approvedHash && confirmed.includes(approvedHash.hash)) {
      const _newChunked = []

      for (const row of chunkedPositions) {
        const _newRow = []

        for (const position of row) {
          if (position.tokenId === approvedHash.id) {
            position.approved = true
            setSelectedNFT((old) => ({
              ...old,
              approved: true
            }))
          }

          _newRow.push(position)
        }

        _newChunked.push(_newRow)
      }
      setChunkedPositions(_newChunked)
      setSubmitState(1)
      setSubmitLoader(false)
    }
  }, [approvedHash, confirmed])

  useEffect(() => {
    if (!transferedHash || (transferedHash && submitState !== 1)) return

    if (transferedHash === 'failed') {
      setSubmitLoader(false)
    } else if (transferedHash && confirmed.includes(transferedHash.hash)) {
      const _newChunked = []

      for (const row of chunkedPositions) {
        const _newRow = []

        for (const position of row) {
          if (position.tokenId === transferedHash.id) {
            position.transfered = true
            setSelectedNFT((old) => ({
              ...old,
              transfered: true
            }))
          }

          _newRow.push(position)
        }

        _newChunked.push(_newRow)
      }
      setChunkedPositions(_newChunked)
      setSubmitState(2)
      setSubmitLoader(false)
    }
  }, [transferedHash, confirmed])

  useEffect(() => {
    if (!stakedHash || (stakedHash && submitState !== 2)) return

    if (stakedHash === 'failed') {
      setSubmitLoader(false)
    } else if (stakedHash && confirmed.includes(stakedHash.hash)) {
      const _newChunked = []

      for (const row of chunkedPositions) {
        const _newRow = []

        for (const position of row) {
          if (position.tokenId === stakedHash.id) {
            position.staked = true
            position.transfered = true
            position.approved = true
            setSelectedNFT((old) => ({
              ...old,
              staked: true,
              transfered: true,
              approved: true
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

  const transferNFTs = useCallback(() => {
    setSubmitLoader(true)
    setSubmitState(1)
    transferHandler(selectedNFT)
  }, [selectedNFT, submitState])

  const stakeNFTs = useCallback(() => {
    setSubmitLoader(true)
    setSubmitState(2)
    stakeHandler(selectedNFT, {
      pool,
      rewardAddress,
      bonusRewardAddress,
      startTime,
      endTime,
      refundee
    })
  }, [selectedNFT, submitState])

  const linkToProviding = `/add/${token0}/${token1}`

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
            <p>{`NFT #${selectedNFT.tokenId} deposited succesfully!`}</p>
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
                <p
                  style={{ textAlign: 'center' }}
                >{`To take part in this farming event, you need to provide liquidity for ${token0} / ${token1}`}</p>
                {/* <ProvideLiquidityLink to={linkToProviding}>
                  <span>{`Provide liquidity for ${token0} / ${token1}`}</span>
                  <ArrowRight style={{ marginLeft: '5px' }} size={16} />
                </ProvideLiquidityLink> */}
              </EmptyMock>
            ) : chunkedPositions && chunkedPositions.length !== 0 ? (
              chunkedPositions.map((row, i) => (
                <NFTPositionsRow key={i}>
                  {row.map((el, j) => (
                    <NFTPosition
                      key={j}
                      selected={selectedNFT && selectedNFT.tokenId === el.tokenId}
                      onClick={(e) => {
                        if (e.target.tagName !== 'A' && !submitLoader) {
                          setSelectedNFT((old) =>
                            old && old.tokenId === el.tokenId
                              ? null
                              : {
                                staked: el.staked,
                                tokenId: el.tokenId,
                                approved: el.approved,
                                transfered: el.transfered
                              }
                          )
                        }
                      }}
                    >
                      <NFTPositionIcon name={el.tokenId}></NFTPositionIcon>
                      <NFTPositionDescription>
                        <NFTPositionIndex>{`#${el.tokenId}`}</NFTPositionIndex>
                        <NFTPositionLink
                          href={`https://app.algebra.finance/#/pool/${el.tokenId}`}
                          rel='noopener noreferrer'
                          target='_blank'
                        >
                          View position
                        </NFTPositionLink>
                      </NFTPositionDescription>
                      <NFTPositionSelectCircle selected={selectedNFT && selectedNFT.tokenId === el.tokenId}>
                        <Check
                          style={{
                            transitionDuration: '.2s',
                            opacity: selectedNFT && selectedNFT.tokenId === el.tokenId ? '1' : '0'
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
          {submitLoader && selectedNFT ? (
            <StakeButton>
              <StakeButtonLoader>
                <Loader stroke={'white'} />
                <span style={{ marginLeft: '5px' }}>
                  {submitState === 0
                    ? `Approving NFT #${selectedNFT.tokenId}`
                    : submitState === 1
                      ? `Transferring NFT #${selectedNFT.tokenId}`
                      : submitState === 2
                        ? `Depositing NFT #${selectedNFT.tokenId}`
                        : null}
                </span>
              </StakeButtonLoader>
            </StakeButton>
          ) : NFTsForApprove ? (
            <StakeButton disabled={submitLoader} onClick={approveNFTs} id={'farming-approve-nft'}
                         className={'farming-approve-nft'}>
              {`Approve NFT #${NFTsForApprove.tokenId}`}
            </StakeButton>
          ) : NFTsForTransfer ? (
            <StakeButton onClick={transferNFTs} id={'farming-transfer-nft'} className={'farming-transfer-nft'}>
              {`Transfer NFT #${NFTsForTransfer.tokenId}`}
            </StakeButton>
          ) : NFTsForStake ? (
            <StakeButton onClick={stakeNFTs} id={'farming-deposit-nft'} className={'farming-deposit-nft'}>
              {`Deposit NFT #${NFTsForStake.tokenId}`}
            </StakeButton>
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
