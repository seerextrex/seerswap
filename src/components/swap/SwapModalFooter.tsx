import { Trans } from '@lingui/macro'
import { Currency, TradeType } from '@uniswap/sdk-core'
import { Trade as V2Trade } from '@uniswap/v2-sdk'
import { Trade as V3Trade } from 'lib/src'
import { ReactNode } from 'react'
import { Text } from 'rebass'
import { AutoRow } from '../Row'
import { SwapCallbackError } from './styled'

export default function SwapModalFooter({
    onConfirm,
    swapErrorMessage,
    disabledConfirm
}: {
    trade: V2Trade<Currency, Currency, TradeType> | V3Trade<Currency, Currency, TradeType>
    onConfirm: () => void
    swapErrorMessage: ReactNode | undefined
    disabledConfirm: boolean
}) {

    return (
        <AutoRow>
            <button
                onClick={onConfirm}
                disabled={disabledConfirm}
                id='confirm-swap-or-send'
                className={'btn primary w-100 p-05 mt-05'}
            >
                <Text fontSize={20} fontWeight={500}>
                    <Trans>Confirm Swap</Trans>
                </Text>
            </button>
            {swapErrorMessage ? <SwapCallbackError error={swapErrorMessage} /> : null}
        </AutoRow>
    )
}
