import { Position } from '@uniswap/v3-sdk'
import { useMemo, useState } from 'react'
import { useToken } from '../../hooks/Tokens'
import { usePool } from '../../hooks/usePools'
import useIsTickAtLimit from '../../hooks/useIsTickAtLimit'
import { unwrappedToken } from '../../utils/unwrappedToken'
import { getPriceOrderingFromPositionForUI } from '../PositionListItem'

import Modal from '../Modal'
import DoubleCurrencyLogo from '../DoubleLogo'

import { formatTickPrice } from 'utils/formatTickPrice'
import { Bound } from 'state/mint/v3/actions'
import { X } from 'react-feather'
import { Percent } from '@uniswap/sdk-core'
import { PositionIcon, PositionInfoModal, PositionInfoRow, PositionInfoRowTitle, PositionInfoRowValue } from './styled'

export default function FarmingPositionInfo({ el }: { el: any }) {
    const [positionModal, setPositionModal] = useState(false)

    const { token0: token0Address, token1: token1Address, liquidity, tickLower, tickUpper } = el

    const token0 = useToken(token0Address)
    const token1 = useToken(token1Address)

    const currency0 = token0 ? unwrappedToken(token0) : undefined
    const currency1 = token1 ? unwrappedToken(token1) : undefined

    //   // construct Position from details returned
    const [, pool] = usePool(currency0 ?? undefined, currency1 ?? undefined)

    const position = useMemo(() => {
        if (pool) {
            return new Position({ pool, liquidity: liquidity.toString(), tickLower, tickUpper })
        }
        return undefined
    }, [liquidity, pool, tickLower, tickUpper])

    const tickAtLimit = useIsTickAtLimit(tickLower, tickUpper)

    //   // prices
    const { priceLower, priceUpper, quote, base } = getPriceOrderingFromPositionForUI(position)

    const currencyQuote = quote && unwrappedToken(quote)
    const currencyBase = base && unwrappedToken(base)

    // check if price is within range
    const outOfRange: boolean = pool ? pool.tickCurrent < tickLower || pool.tickCurrent >= tickUpper : false

    return (
        <>
            <Modal isOpen={positionModal} onHide={() => {
                setPositionModal(false)
            }}>
                <PositionInfoModal>
                    <div style={{
                        marginBottom: '2rem',
                        textAlign: 'center',
                        justifyContent: 'center',
                        display: 'flex'
                    }}>
                        <span>Position Info</span>
                        <span onClick={() => setPositionModal(false)}
                              style={{ marginLeft: 'auto', cursor: 'pointer' }}>
              <X size={18} color={'#080064'} />
            </span>
                    </div>
                    <PositionInfoRow>
                        <PositionInfoRowTitle>Pool</PositionInfoRowTitle>
                        <PositionInfoRowValue>
                            <DoubleCurrencyLogo currency0={currencyBase} currency1={currencyQuote}
                                                size={18} margin />
                            <span style={{ marginLeft: '10px' }}>
                {currencyQuote?.symbol}/{currencyBase?.symbol}
              </span>
                        </PositionInfoRowValue>
                    </PositionInfoRow>
                    <PositionInfoRow>
                        <PositionInfoRowTitle>{position?.amount0.currency.symbol}</PositionInfoRowTitle>
                        <PositionInfoRowValue>
                            {position?.amount0.toSignificant(4)}
                        </PositionInfoRowValue>
                    </PositionInfoRow>
                    <PositionInfoRow>
                        <PositionInfoRowTitle>{position?.amount1.currency.symbol}</PositionInfoRowTitle>
                        <PositionInfoRowValue>
                            {position?.amount1.toSignificant(4)}
                        </PositionInfoRowValue>
                    </PositionInfoRow>
                    <PositionInfoRow>
                        <PositionInfoRowTitle>Fee</PositionInfoRowTitle>
                        <PositionInfoRowValue>
                            {pool ? new Percent(pool?.fee, 1_000_000).toSignificant() : '-'}%
                        </PositionInfoRowValue>
                    </PositionInfoRow>
                    <PositionInfoRow>
                        <PositionInfoRowTitle>Min price</PositionInfoRowTitle>
                        <PositionInfoRowValue>{formatTickPrice(priceLower, tickAtLimit, Bound.LOWER)}</PositionInfoRowValue>
                    </PositionInfoRow>
                    <PositionInfoRow>
                        <PositionInfoRowTitle>Max price</PositionInfoRowTitle>
                        <PositionInfoRowValue>{formatTickPrice(priceUpper, tickAtLimit, Bound.UPPER)}</PositionInfoRowValue>
                    </PositionInfoRow>
                    <PositionInfoRow>
                        <PositionInfoRowTitle>In range</PositionInfoRowTitle>
                        <PositionInfoRowValue>{outOfRange ? 'No' : 'Yes'}</PositionInfoRowValue>
                    </PositionInfoRow>
                </PositionInfoModal>
            </Modal>
            <PositionIcon onClick={() => setPositionModal(true)}>{el.tokenId}</PositionIcon>
        </>
    )
}
