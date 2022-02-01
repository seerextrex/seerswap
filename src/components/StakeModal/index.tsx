import { useCallback, useEffect, useMemo, useState } from 'react'
import { ArrowRight, Check, CheckCircle, Frown, X } from 'react-feather'
import { Link } from 'react-router-dom'
import styled, { css, keyframes } from 'styled-components/macro'
import { useIncentiveSubgraph } from '../../hooks/useIncentiveSubgraph'
import { FarmingType, useStakerHandlers } from '../../hooks/useStakerHandlers'
import { useAllTransactions } from '../../state/transactions/hooks'
import { useChunkedRows } from '../../utils/chunkForRows'
import Loader from '../Loader'
import gradient from 'random-gradient'
import { darken } from 'polished'

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
    background-image: linear-gradient(
      90deg,
      rgba(91, 105, 141, 0) 0,
      rgba(91, 105, 141, 0.2) 25%,
      rgba(91, 105, 141, 0.5) 60%,
      rgba(91, 105, 141, 0)
    );
    animation-name: ${skeletonAnimation};
    animation-duration: 1.5s;
    animation-iteration-count: infinite;
    content: '';
  }
`

const ModalWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 1rem;
  color: #080064;
`
const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 1rem;
`
const CloseModalButton = styled.button`
  background: transparent;
  border: none;
`

const ModalBody = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 400px;
  max-height: 400px;
  overflow: auto;
`
const NFTPositionsRow = styled.div`
  width: 100%;
  margin-bottom: 8px;
`

const NFTPosition = styled.div`
  display: inline-flex;
  cursor: pointer;
  position: relative;
  width: calc(33% - 8px);
  border-radius: 1rem;
  border: 1px solid ${({ selected }) => (selected ? '#3970FF' : 'rgba(60, 97, 126, 0.5)')};
  padding: 8px;
  margin-right: 9px;
  transition-duration: 0.2s;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    width: calc(50% - 5px);
    margin-bottom: 5px;
    &:nth-of-type(2n) {
      margin-right: 0;
    }
  `}
`

const NFTPositionSelectCircle = styled.div`
    position: absolute;
    width: 20px;
    height 20px;
    top: 8px;
    right: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    transition-duration: .2s;
    border: 1px solid  ${({ selected }) => (selected ? '#3970FF' : 'rgba(60, 97, 126, 0.5)')};
    background-color:  ${({ selected }) => (selected ? '#3970FF' : 'transparent')}
    `

const NFTPositionIcon = styled.div`
  width: 45px;
  height: 45px;
  border-radius: 50%;
  background: ${({ name }) => (name ? gradient('token' + name) : '')};
  ${({ skeleton }) =>
    skeleton &&
    css`
      background: rgba(60, 97, 126, 0.5);
      ${skeletonGradient}
    `};
`
const NFTPositionDescription = styled.div`
  margin-left: 10px;
  line-height: 22px;

  ${({ skeleton }) =>
    skeleton &&
    css`
      & > * {
        background: rgba(60, 97, 126, 0.5);
        border-radius: 6px;
        ${skeletonGradient}
      }

      & > ${NFTPositionIndex} {
        height: 18px;
        width: 40px;
        margin-bottom: 3px;
        margin-top: 2px;
      }

      & > ${NFTPositionLink} {
        height: 13px;
        width: 60px;
        display: inline-block;
      }
    `}
`
const NFTPositionIndex = styled.div``

const NFTPositionLink = styled.a`
  font-size: 13px;
`

const StakeButton = styled.button`
  background: ${({ theme }) => theme.winterMainButton};
  border: none;
  padding: 1rem;
  color: white;
  border-radius: 8px;
  width: 100%;
  &:first-of-type {
    margin-right: 1rem;
  }
  &:hover {
    background: ${({ theme }) => darken(0.05, theme.winterMainButton)};
  }
  &:disabled {
    background: ${({ theme }) => theme.winterDisabledButton};
    cursor: default;
  }
`

const StakeButtonLoader = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
`

const EmptyMock = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 350px;
  align-items: center;
  justify-content: center;
`

const LiquidityLockWarning = styled.div`
  margin-bottom: 1rem;
  padding: 8px 12px;
  background: #e4e46b;
  color: #333303;
  border-radius: 8px;
  line-height: 25px;
`

const ProvideLiquidityLink = styled(Link)`
  display: flex;
  justify-content: center;
  text-decoration: none;
  background: linear-gradient(90deg, rgba(72, 41, 187, 1) 0%, rgb(49, 149, 255) 100%);
  padding: 8px 10px;
  border-radius: 6px;
  color: white;
  font-weight: 500;

  ${({ theme }) => theme.mediaWidth.upToSmall`
      font-size: 15px;
  `}
`

export function StakeModal({
  event: { pool, startTime, endTime, id, rewardToken, bonusRewardToken },
  closeHandler,
  farmingType,
}: {
  event: {
    pool: string
    startTime: string
    endTime: string
    id: string
    rewardToken: any
    bonusRewardToken: any
  }
  closeHandler: () => void
  farmingType: FarmingType
}) {
  const [selectedNFT, setSelectedNFT] = useState(null)

  const {
    fetchPositionsForPool: { positionsForPool, positionsForPoolLoading, fetchPositionsForPoolFn },
  } = useIncentiveSubgraph() || {}

  const { approveHandler, approvedHash, stakeHandler, stakedHash } = useStakerHandlers() || {}

  useEffect(() => {
    fetchPositionsForPoolFn(pool)
  }, [])

  const positionsForStake = useMemo(() => {
    if (!positionsForPool) return

    return positionsForPool.filter((position) => {
      if (position.pool !== pool.id) return

      if (farmingType === FarmingType.ETERNAL && position.eternalFarming) return

      if (farmingType === FarmingType.FINITE && position.incentive) return

      return true
    })
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

  const NFTsForStake = useMemo(() => filterNFTs((v) => v.onFarmingCenter && !isOnFarming), [selectedNFT, submitState])

  useEffect(() => {
    if (!approvedHash || (approvedHash && submitState !== 0)) return

    if (approvedHash === 'failed') {
      setSubmitLoader(false)
    } else if (approvedHash && confirmed.includes(approvedHash.hash)) {
      const _newChunked = []

      for (const row of chunkedPositions) {
        const _newRow = []

        for (const position of row) {
          if (position.id === approvedHash.id) {
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
      setSubmitState(1)
      setSubmitLoader(false)
    }
  }, [approvedHash, confirmed])

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
          pool,
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
                <p
                  style={{ textAlign: 'center' }}
                >{`To take part in this farming event, you need to provide liquidity for ${pool.token0.id} / ${pool.token1.id}`}</p>
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
