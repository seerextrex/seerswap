import RealStakerRangeButtons from './RealStakerRangeButtons'
import React, { Dispatch } from 'react'
import {ContentModal, SilderWrapper, StakeButton, StakerSlider} from './styled'
import Modal from '../../components/Modal'
import RealStakerUnstakeInputRange from './RealStakerUnstakeInputRange'
import { formatEther } from 'ethers/lib/utils'
import { CurrencyAmount, Token } from '@uniswap/sdk-core'
import { BigNumber } from '@ethersproject/bignumber'
import { FactorySubgraph, StakeSubgraph, SubgraphResponseStaking } from '../../models/interfaces'

interface UnstakeModalProps {
  openModal: boolean
  setOpenModal: any
  unstaked: string
  setUnstaked: any
  baseCurrency: BigNumber
  unstakePercent: number
  setUnstakePercent: any
  onPercentSelect: Dispatch<number>,
  unstakeHandler: any,
  stakedResult: string | null | SubgraphResponseStaking<FactorySubgraph[], StakeSubgraph[]>
  fiatValue: CurrencyAmount<Token> | null
  allXALGBFreeze: BigNumber | undefined
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

    const enerHandler = (e: any) => {
        if (e.charCode === 13 && +unstaked !== 0) {
            unstakeHandler(unstaked, stakedResult, baseCurrency, allXALGBFreeze)
            setUnstaked('')
            setUnstakePercent(0)
            setOpenModal(false)
        }
    }
  return (
    <Modal
      isOpen={openModal}
      onDismiss={() => {
        setOpenModal(false)
          setUnstaked('')
          setUnstakePercent(0)
      }}
      maxHeight={300}
    >
      <ContentModal onKeyPress={(e) => {enerHandler(e)}}>
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
          balance={''}
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
    </Modal>
  )
}