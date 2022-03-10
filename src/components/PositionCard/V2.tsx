import JSBI from 'jsbi'
import { useState } from 'react'
import { CurrencyAmount, Percent, Token } from '@uniswap/sdk-core'
import { ChevronDown, ChevronUp } from 'react-feather'
import { Link, NavLink } from 'react-router-dom'
import { Text } from 'rebass'
import { useTotalSupply } from '../../hooks/useTotalSupply'
import { Trans } from '@lingui/macro'

import { useActiveWeb3React } from '../../hooks/web3'
import { useTokenBalance } from '../../state/wallet/hooks'
import { unwrappedToken } from '../../utils/unwrappedToken'
import { ButtonEmpty, ButtonPrimary } from '../Button'

import { useColor } from '../../hooks/useColor'

import { AutoColumn } from '../Column'
import CurrencyLogo from '../CurrencyLogo'
import DoubleCurrencyLogo from '../DoubleLogo'
import { AutoRow, RowBetween, RowFixed } from '../Row'
import { Dots } from '../swap/styled'
import { BIG_INT_ZERO } from '../../constants/misc'
import { AutoColumnInfo, FixedHeightRow, RowFixedMigrate, StyledV2PositionCard } from './styled'

import Badge, { BadgeVariant } from '../Badge'
import { Pair } from '../../utils/computePairAddress'
import { WrappedCurrency } from '../../models/types'
import Card from '../../shared/components/Card/Card'

interface PositionCardProps {
    pair: Pair | null
    showUnwrapped?: boolean
    border?: string
    stakedBalance?: CurrencyAmount<Token> // optional balance to indicate that liquidity is deposited in mining pool
    sushi?: boolean
}

export default function V2PositionCard({ pair, border, stakedBalance, sushi }: PositionCardProps) {
    const { account } = useActiveWeb3React()

    const currency0 = unwrappedToken(pair?.token0 as WrappedCurrency)
    const currency1 = unwrappedToken(pair?.token1 as WrappedCurrency)

    const [showMore, setShowMore] = useState(false)

    const userDefaultPoolBalance = useTokenBalance(account ?? undefined, pair?.liquidityToken)

    const totalPoolTokens = useTotalSupply(pair?.liquidityToken)

    // if staked balance balance provided, add to standard liquidity amount
    const userPoolBalance = stakedBalance ? userDefaultPoolBalance?.add(stakedBalance) : userDefaultPoolBalance

    const poolTokenPercentage =
        !!userPoolBalance &&
        !!totalPoolTokens &&
        JSBI.greaterThanOrEqual(totalPoolTokens.quotient, userPoolBalance.quotient)
            ? new Percent(userPoolBalance.quotient, totalPoolTokens.quotient)
            : undefined

    const [token0Deposited, token1Deposited] =
        !!pair &&
        !!totalPoolTokens &&
        !!userPoolBalance &&
        // this condition is a short-circuit in the case where useTokenBalance updates sooner than useTotalSupply
        JSBI.greaterThanOrEqual(totalPoolTokens.quotient, userPoolBalance.quotient)
            ? [
                pair.getLiquidityValue(pair.token0, totalPoolTokens, userPoolBalance, false),
                pair.getLiquidityValue(pair.token1, totalPoolTokens, userPoolBalance, false)
            ]
            : [undefined, undefined]

    return (
        <Card isDark={false} classes={'p-1 br-12'}>
            <AutoColumn gap='12px'>
                <FixedHeightRow>
                    <AutoRow gap='8px'>
                        <div className={'ml-2'}>
                            <DoubleCurrencyLogo currency0={currency0} currency1={currency1} size={24} />
                        </div>
                        <Text fontWeight={500} fontSize={20}>
                            {!currency0 || !currency1 ? (
                                <Dots>
                                    <Trans>Loading</Trans>
                                </Dots>
                            ) : (
                                `${currency1.symbol}/${currency0.symbol}`
                            )}
                        </Text>
                        <Badge
                            variant={BadgeVariant.WARNING}
                            style={{
                                backgroundColor: 'white',
                                color: sushi ? '#48b9cd' : '#f241a5',
                                minWidth: '100px'
                            }}
                            ref={(element) => {
                                if (element) {
                                    element.style.setProperty('margin-left', `${window.innerWidth < 600 ? '0' : 'auto'}`, 'important')
                                    element.style.setProperty('margin-right', '6rem', 'important')
                                }
                            }}
                        >
                            {sushi ? 'SushiSwap' : 'QuickSwap'}
                        </Badge>
                    </AutoRow>
                    <RowFixedMigrate gap='8px' style={{ minWidth: '110px' }}>
                        <ButtonEmpty
                            padding='6px 8px'
                            $borderRadius='12px'
                            width='fit-content'
                            onClick={() => setShowMore(!showMore)}
                        >
                            {showMore ? (
                                <>
                                    <Trans>Expand</Trans>
                                    <ChevronUp size='20' style={{ marginLeft: '10px' }} />
                                </>
                            ) : (
                                <>
                                    <Trans>Expand</Trans>
                                    <ChevronDown size='20' style={{ marginLeft: '10px' }} />
                                </>
                            )}
                        </ButtonEmpty>
                    </RowFixedMigrate>
                </FixedHeightRow>

                {showMore && (
                    <AutoColumnInfo gap='8px'>
                        <FixedHeightRow>
                            <Text fontSize={16} fontWeight={500}>
                                <Trans>Your total pool tokens:</Trans>
                            </Text>
                            <Text fontSize={16} fontWeight={500}>
                                {userPoolBalance ? userPoolBalance.toSignificant(4) : '-'}
                            </Text>
                        </FixedHeightRow>
                        {stakedBalance && (
                            <FixedHeightRow>
                                <Text fontSize={16} fontWeight={500}>
                                    <Trans>Pool tokens in rewards pool:</Trans>
                                </Text>
                                <Text fontSize={16} fontWeight={500}>
                                    {stakedBalance.toSignificant(4)}
                                </Text>
                            </FixedHeightRow>
                        )}
                        <FixedHeightRow>
                            <RowFixed>
                                <Text fontSize={16} fontWeight={500}>
                                    <Trans>Pooled {currency0.symbol}:</Trans>
                                </Text>
                            </RowFixed>
                            {token0Deposited ? (
                                <RowFixed>
                                    <Text fontSize={16} fontWeight={500} marginLeft={'6px'}>
                                        {token0Deposited?.toSignificant(6)}
                                    </Text>
                                    <CurrencyLogo size='24px' style={{ marginLeft: '8px' }} currency={currency0 as WrappedCurrency} />
                                </RowFixed>
                            ) : (
                                '-'
                            )}
                        </FixedHeightRow>

                        <FixedHeightRow>
                            <RowFixed>
                                <Text fontSize={16} fontWeight={500}>
                                    <Trans>Pooled {currency1.symbol}:</Trans>
                                </Text>
                            </RowFixed>
                            {token1Deposited ? (
                                <RowFixed>
                                    <Text fontSize={16} fontWeight={500} marginLeft={'6px'}>
                                        {token1Deposited?.toSignificant(6)}
                                    </Text>
                                    <CurrencyLogo size='24px' style={{ marginLeft: '8px' }} currency={currency1 as WrappedCurrency} />
                                </RowFixed>
                            ) : (
                                '-'
                            )}
                        </FixedHeightRow>

                        <FixedHeightRow>
                            <Text fontSize={16} fontWeight={500}>
                                <Trans>Your pool share:</Trans>
                            </Text>
                            <Text fontSize={16} fontWeight={500}>
                                {poolTokenPercentage
                                    ? (poolTokenPercentage.toFixed(2) === '0.00' ? '<0.01' : poolTokenPercentage.toFixed(2)) + '%'
                                    : '-'}
                            </Text>
                        </FixedHeightRow>

                        {userDefaultPoolBalance && JSBI.greaterThan(userDefaultPoolBalance.quotient, BIG_INT_ZERO) && (
                            <RowBetween marginTop='10px'>
                                <NavLink className={'btn primary br-8 w-100 p-05 f f-ac f-jc b'} to={`/migrate/${pair?.liquidityToken.address}`}>
                                    <Trans>Migrate</Trans>
                                </NavLink>
                            </RowBetween>
                        )}
                    </AutoColumnInfo>
                )}
            </AutoColumn>
        </Card>
    )
}
