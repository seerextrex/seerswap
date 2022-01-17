import React, { useCallback, useEffect, useRef, useState } from 'react'
import { FeeAmount } from 'lib/src'
import { Currency } from '@uniswap/sdk-core'
import { Trans } from '@lingui/macro'
import { AutoColumn } from 'components/Column'
import { DynamicSection } from 'pages/AddLiquidity/styled'
import { TYPE } from 'theme'
import { RowBetween } from 'components/Row'
import { ButtonGray, ButtonRadioChecked } from 'components/Button'
import styled, { keyframes } from 'styled-components/macro'
import Badge from 'components/Badge'
import Card from 'components/Card'
import usePrevious from 'hooks/usePrevious'
import { useFeeTierDistribution } from 'hooks/useFeeTierDistribution'
import { Box } from 'rebass'
import { useDynamicFeeValue } from '../../hooks/usePoolDynamicFee'

const pulse = (color: string) => keyframes`
  0% {
    box-shadow: 0 0 0 0 ${color};
  }

  70% {
    box-shadow: 0 0 0 2px ${color};
  }

  100% {
    box-shadow: 0 0 0 0 ${color};
  }
`

const ResponsiveText = styled(TYPE.label)`
  line-height: 16px;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    font-size: 12px;
    line-height: 12px;
  `};
`

const FocusedOutlineCard = styled(Card)<{ pulsing: boolean }>`
  display: flex;
  background-color: ${({ theme }) => theme.bg0};
  border: 1px solid ${({ theme }) => theme.bg2};
  animation: ${({ pulsing, theme }) => pulsing && pulse(theme.winterMainButton)} 0.6s linear;
`

const FeeAmountLabel = {
  [FeeAmount.LOW]: {
    label: '0.05',
    description: <Trans>Best for stable pairs.</Trans>,
  },
  [FeeAmount.MEDIUM]: {
    label: '0.3',
    description: <Trans>Best for most pairs.</Trans>,
  },
  [FeeAmount.HIGH]: {
    label: '1',
    description: <Trans>Best for exotic pairs.</Trans>,
  },
}

const FeeTierPercentageBadge = ({ percentage }: { percentage: number | undefined }) => {
  return (
    <Badge>
      <TYPE.label fontSize={12}>
        {percentage !== undefined ? <Trans>{percentage?.toFixed(0)}% select</Trans> : <Trans>Not created</Trans>}
      </TYPE.label>
    </Badge>
  )
}

export default function FeeSelector({
  disabled = false,
  feeAmount,
  dynamicFee,
  handleFeePoolSelect,
  noLiquidity,
  currencyA,
  currencyB,
}: {
  disabled?: boolean
  feeAmount?: FeeAmount
  noLiquidity?: boolean
  dynamicFee?: number
  handleFeePoolSelect: (feeAmount: FeeAmount) => void
  currencyA?: Currency | undefined
  currencyB?: Currency | undefined
}) {
  const { isLoading, isError, largestUsageFeeTier, distributions } = useFeeTierDistribution(currencyA, currencyB)

  const [showOptions, setShowOptions] = useState(true)
  const [pulsing, setPulsing] = useState(false)

  const previousFeeAmount = usePrevious(dynamicFee)

  const recommended = useRef(false)

  // const dynamicFeeChange = useDynamicFeeValue()

  const handleFeePoolSelectWithEvent = useCallback(
    (fee) => {
      handleFeePoolSelect(fee)
    },
    [handleFeePoolSelect]
  )

  // useEffect(() => {
  //   if (!dynamicFee) {
  //     return
  //   } else {
  //     handleFeePoolSelectWithEvent(FeeAmount.LOW)
  //   }
  // }, [dynamicFee])

  useEffect(() => {
    if (dynamicFee || isLoading || isError) {
      return
    }

    if (!largestUsageFeeTier) {
      // cannot recommend, open options
      setShowOptions(true)
    } else {
      setShowOptions(false)

      recommended.current = true

      handleFeePoolSelect(largestUsageFeeTier)
    }
  }, [dynamicFee, isLoading, isError, largestUsageFeeTier, handleFeePoolSelect])

  useEffect(() => {
    setShowOptions(isError)
  }, [isError])

  useEffect(() => {
    if (dynamicFee && previousFeeAmount !== dynamicFee) {
      setPulsing(true)
    }
  }, [previousFeeAmount, dynamicFee])

  return (
    <AutoColumn gap="16px">
      <DynamicSection gap="md" disabled={disabled}>
        <FocusedOutlineCard pulsing={pulsing} onAnimationEnd={() => setPulsing(false)}>
          <RowBetween>
            <AutoColumn id="add-liquidity-selected-fee">
              {
                <>
                  <TYPE.label className="selected-fee-label">
                    {/* <Trans>{FeeAmountLabel[feeAmount].label}% fee tier</Trans> */}
                    <Trans>
                      {noLiquidity ? 'Fee is 0.05%' : dynamicFee ? `Fee is ${dynamicFee / 10000}%` : 'Loading...'}
                    </Trans>
                  </TYPE.label>
                  {/* <Box style={{ width: 'fit-content', marginTop: '8px' }} className="selected-fee-percentage">
                    {distributions && feeAmount && <FeeTierPercentageBadge percentage={distributions[feeAmount]} />}
                  </Box> */}
                </>
              }
            </AutoColumn>
          </RowBetween>
        </FocusedOutlineCard>
      </DynamicSection>
    </AutoColumn>
  )
}
