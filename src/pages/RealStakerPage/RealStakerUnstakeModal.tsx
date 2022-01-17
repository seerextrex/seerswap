import RealStakerRangeButtons from './RealStakerRangeButtons'
import React from 'react'
import styled from 'styled-components/macro'
import Modal from '../../components/Modal'
import { SilderWrapper, StakeButton, StakerSlider } from './index'
import RealStakerUnstakeInputRange from './RealStakerUnstakeInputRange'
import { formatEther } from 'ethers/lib/utils'

const UnStakeModalWrapper = styled(Modal)`
`
const ContentModal = styled.div`
  width: 100%;
  padding: 5px 30px 20px;
`

interface UnstakeModalProps {
  openModal: boolean
  setOpenModal: any
  unstaked: string
  setUnstaked: any
  baseCurrency: any
  unstakePercent: number
  setUnstakePercent: any
  onPercentSelect: number,
  unstakeHandler: any,
  stakedResult: any
  fiatValue: any
    allXALGBFreeze: any
}

export default function RealStakerUnstakeModal(
  {
    openModal,
    setOpenModal,
    unstaked,
    setUnstaked,
    baseCurrency,
    unstakePercent,
    setUnstakePercent,
    onPercentSelect,
    unstakeHandler,
    stakedResult,
    fiatValue,
    allXALGBFreeze
  } : UnstakeModalProps
) {
    // console.log(fiatValue, baseCurrency)
  return (
    <UnStakeModalWrapper
      isOpen={openModal}
      onDismiss={() => {
        setOpenModal(false)
          setUnstaked('')
          setUnstakePercent(0)
      }}
      maxHeight={300}
    >
      <ContentModal>
        <RealStakerUnstakeInputRange
          amountValue={unstaked}
          setAmountValue={setUnstaked}
          baseCurrency={formatEther(baseCurrency)}
          fiatValue={fiatValue}
          />
        <SilderWrapper>
          <StakerSlider
            value={unstakePercent}
            onChange={setUnstakePercent}
            size={22} />
        </SilderWrapper>
        <RealStakerRangeButtons
          onPercentSelect={onPercentSelect}
          showCalculate={false}
        />
        <StakeButton onClick={() => {
          unstakeHandler(unstaked, stakedResult, baseCurrency, allXALGBFreeze)
          setUnstaked('')
            setUnstakePercent(0)
          setOpenModal(false)
        }}
        disabled={+unstaked > +formatEther(baseCurrency) || unstaked === ''}>
            {+unstaked > +formatEther(baseCurrency) ? 'Insufficient ALGB balance' : 'Unstake'}
        </StakeButton>
      </ContentModal>
    </UnStakeModalWrapper>
  )
}