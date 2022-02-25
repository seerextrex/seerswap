import JSBI from 'jsbi'
import { CurrencyAmount, Percent, Token } from '@uniswap/sdk-core'
import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'react-feather'
import { Link } from 'react-router-dom'
import { Text } from 'rebass'
import { useTotalSupply } from '../../hooks/useTotalSupply'
import { Trans } from '@lingui/macro'
import { useActiveWeb3React } from '../../hooks/web3'
import { useTokenBalance } from '../../state/wallet/hooks'
import { TYPE } from '../../theme'
import { currencyId } from '../../utils/currencyId'
import { unwrappedToken } from '../../utils/unwrappedToken'
import { ButtonEmpty, ButtonPrimary } from '../Button'
import { useColor } from '../../hooks/useColor'
import { GreyCard, LightCard } from '../Card'
import { AutoColumn } from '../Column'
import CurrencyLogo from '../CurrencyLogo'
import DoubleCurrencyLogo from '../DoubleLogo'
import { AutoRow, RowBetween, RowFixed } from '../Row'
import { Dots } from '../swap/styled'
import { BIG_INT_ZERO } from '../../constants/misc'
import Badge, { BadgeVariant } from '../Badge'
import { Pair } from '../../utils/computePairAddress'
import { ButtonPrimaryStyled, FixedHeightRow, FixedHeightRowCurrency, MigrateShortcut, RowFixedLogo, RowFixedPrice, StyledPositionCard } from './styled'
import { isMobile } from 'react-device-detect'
import { WrappedCurrency } from '../../models/types'
import { SupportedChainId } from '../../constants/chains'

interface PositionCardProps {
    pair: Pair
    showUnwrapped?: boolean
    border?: string
    stakedBalance?: CurrencyAmount<Token> // optional balance to indicate that liquidity is deposited in mining pool
    sushi?: boolean
}

export function MinimalPositionCard({
    pair,
    showUnwrapped = false,
    sushi
}: PositionCardProps) {
    const { account } = useActiveWeb3React()

    const currency0 = showUnwrapped ? pair.token0 : unwrappedToken(pair.token0)
    const currency1 = showUnwrapped ? pair.token1 : unwrappedToken(pair.token1)

    const [showMore, setShowMore] = useState(false)

    const userPoolBalance = useTokenBalance(account ?? undefined, pair.liquidityToken)
    const totalPoolTokens = useTotalSupply(pair.liquidityToken)

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
        <>
            {userPoolBalance && JSBI.greaterThan(userPoolBalance.quotient, JSBI.BigInt(0)) ? (
                <GreyCard>
                    <AutoColumn gap='12px'>
                        <FixedHeightRow>
                            <RowFixed style={{ width: '100%' }}>
                                <Text fontWeight={500} fontSize={16}>
                                    <Trans>Your position</Trans>
                                </Text>
                                <ButtonPrimaryStyled>
                                    <MigrateShortcut
                                        to={`/migrate/${Pair.getAddress(pair.token0, pair.token1, sushi)}`}>
                                        Migrate
                                    </MigrateShortcut>
                                </ButtonPrimaryStyled>
                            </RowFixed>
                        </FixedHeightRow>
                        <FixedHeightRowCurrency onClick={() => setShowMore(!showMore)}>
                            <RowFixedLogo>
                                <DoubleCurrencyLogo currency0={currency0} currency1={currency1}
                                                    margin={false}
                                                    size={24} />
                                <Text style={{ marginLeft: '5px', marginRight: '5px' }}
                                      fontWeight={500} fontSize={20}>
                                    {currency1.symbol}/{currency0.symbol}
                                </Text>
                                {!isMobile &&
                                    <Badge
                                        style={{
                                            backgroundColor: 'white',
                                            color: sushi ? '#ed1185' : '#48b9cd',
                                            minWidth: '100px'
                                        }}
                                    >
                                        {sushi ? 'SushiSwap' : 'QuickSwap'}
                                    </Badge>}
                            </RowFixedLogo>
                            <RowFixedPrice>
                                <Text fontWeight={500} fontSize={20}
                                      title={userPoolBalance.toExact()}
                                      style={{ cursor: 'default' }}>
                                    {userPoolBalance ? parseFloat(userPoolBalance.toExact()).toFixed(6) : '-'}
                                </Text>
                                {isMobile &&
                                    <Badge
                                        style={{
                                            backgroundColor: 'white',
                                            color: sushi ? '#ed1185' : '#48b9cd',
                                            minWidth: '100px'
                                        }}
                                    >
                                        {sushi ? 'SushiSwap' : 'QuickSwap'}
                                    </Badge>}
                            </RowFixedPrice>
                        </FixedHeightRowCurrency>
                        <AutoColumn gap='4px'>
                            <FixedHeightRow>
                                <Text fontSize={16} fontWeight={500}>
                                    <Trans>Your pool share:</Trans>
                                </Text>
                                <Text fontSize={16} fontWeight={500}>
                                    {poolTokenPercentage ? poolTokenPercentage.toFixed(6) + '%' : '-'}
                                </Text>
                            </FixedHeightRow>
                            <FixedHeightRow>
                                <Text fontSize={16} fontWeight={500}>
                                    {currency0.symbol}:
                                </Text>
                                {token0Deposited ? (
                                    <RowFixed>
                                        <Text fontSize={16} fontWeight={500} marginLeft={'6px'}>
                                            {token0Deposited?.toSignificant(6)}
                                        </Text>
                                    </RowFixed>
                                ) : (
                                    '-'
                                )}
                            </FixedHeightRow>
                            <FixedHeightRow>
                                <Text fontSize={16} fontWeight={500}>
                                    {currency1.symbol}:
                                </Text>
                                {token1Deposited ? (
                                    <RowFixed>
                                        <Text fontSize={16} fontWeight={500} marginLeft={'6px'}>
                                            {token1Deposited?.toSignificant(6)}
                                        </Text>
                                    </RowFixed>
                                ) : (
                                    '-'
                                )}
                            </FixedHeightRow>
                        </AutoColumn>
                    </AutoColumn>
                </GreyCard>
            ) : (
                <LightCard>
                    <TYPE.subHeader style={{ textAlign: 'center' }}>
            <span role='img' aria-label='wizard-icon'>
              ⭐️
            </span>{' '}
                        <Trans>
                            By adding liquidity you&apos;ll earn 0.3% of all trades on this pair
                            proportional to your
                            share of the
                            pool. Fees are added to the pool, accrue in real time and can be claimed
                            by withdrawing your
                            liquidity.
                        </Trans>{' '}
                    </TYPE.subHeader>
                </LightCard>
            )}
        </>
    )
}

export default function FullPositionCard({ pair, border, stakedBalance }: PositionCardProps) {
    const { account, chainId } = useActiveWeb3React()

    const currency0 = unwrappedToken(pair.token0)
    const currency1 = unwrappedToken(pair.token1)

    const [showMore, setShowMore] = useState(false)

    const userDefaultPoolBalance = useTokenBalance(account ?? undefined, pair.liquidityToken)
    const totalPoolTokens = useTotalSupply(pair.liquidityToken)

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

    const backgroundColor = useColor(pair?.token0)

    return (
        <StyledPositionCard border={border} bgColor={backgroundColor}>
            <AutoColumn gap='12px'>
                <FixedHeightRow>
                    <AutoRow gap='8px' style={{ marginLeft: '8px' }}>
                        <DoubleCurrencyLogo currency0={currency0} currency1={currency1} size={20} />
                        <Text fontWeight={500} fontSize={20}>
                            {!currency0 || !currency1 ? (
                                <Dots>
                                    <Trans>Loading</Trans>
                                </Dots>
                            ) : (
                                `${currency0.symbol}/${currency1.symbol}`
                            )}
                        </Text>
                        <Badge variant={BadgeVariant.WARNING}>QuickSwap</Badge>
                    </AutoRow>
                    <RowFixed gap='8px' style={{ marginRight: '4px' }}>
                        <ButtonEmpty padding='6px 8px' $borderRadius='12px' width='100%'
                                     onClick={() => setShowMore(!showMore)}>
                            {showMore ? (
                                <>
                                    <Trans>Manage</Trans>
                                    <ChevronUp size='20' style={{
                                        marginLeft: '8px',
                                        height: '20px',
                                        minWidth: '20px'
                                    }} />
                                </>
                            ) : (
                                <>
                                    <Trans>Manage</Trans>
                                    <ChevronDown size='20'
                                                 style={{
                                                     marginLeft: '8px',
                                                     height: '20px',
                                                     minWidth: '20px'
                                                 }} />
                                </>
                            )}
                        </ButtonEmpty>
                    </RowFixed>
                </FixedHeightRow>

                {showMore && (
                    <AutoColumn gap='8px'>
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
                                {poolTokenPercentage ? (
                                    <Trans>
                                        {poolTokenPercentage.toFixed(2) === '0.00' ? '<0.01' : poolTokenPercentage.toFixed(2)} %
                                    </Trans>
                                ) : (
                                    '-'
                                )}
                            </Text>
                        </FixedHeightRow>
                        {userDefaultPoolBalance && JSBI.greaterThan(userDefaultPoolBalance.quotient, BIG_INT_ZERO) && (
                            <RowBetween marginTop='10px'>
                                <ButtonPrimary
                                    padding='8px'
                                    $borderRadius='8px'
                                    as={Link}
                                    to={`/migrate/${pair.liquidityToken.address}`}
                                    width='32%'
                                >
                                    <Trans>Migrate</Trans>
                                </ButtonPrimary>
                                <ButtonPrimary
                                    padding='8px'
                                    $borderRadius='8px'
                                    as={Link}
                                    to={`/add/${currencyId(currency0, chainId || SupportedChainId.POLYGON)}/${currencyId(currency1, chainId || SupportedChainId.POLYGON)}`}
                                    width='32%'
                                >
                                    <Trans>Add</Trans>
                                </ButtonPrimary>
                            </RowBetween>
                        )}
                        {stakedBalance && JSBI.greaterThan(stakedBalance.quotient, BIG_INT_ZERO) && (
                            <ButtonPrimary
                                padding='8px'
                                $borderRadius='8px'
                                as={Link}
                                to={`/uni/${currencyId(currency0, chainId || SupportedChainId.POLYGON)}/${currencyId(currency1, chainId || SupportedChainId.POLYGON)}`}
                                width='100%'
                            >
                                <Trans>Manage Liquidity in Rewards Pool</Trans>
                            </ButtonPrimary>
                        )}
                    </AutoColumn>
                )}
            </AutoColumn>
        </StyledPositionCard>
    )
}
