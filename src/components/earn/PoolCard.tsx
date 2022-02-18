import { Trans } from '@lingui/macro'
import { CurrencyAmount, Token } from '@uniswap/sdk-core'
import JSBI from 'jsbi'
import { BIG_INT_SECONDS_IN_WEEK } from '../../constants/misc'
import { useColor } from '../../hooks/useColor'
import { useTotalSupply } from '../../hooks/useTotalSupply'
import useUSDCPrice from '../../hooks/useUSDCPrice'
import { useV2Pair } from '../../hooks/useV2Pairs'
import { StakingInfo } from '../../state/stake/hooks'
import { StyledInternalLink, TYPE } from '../../theme'
import { currencyId } from '../../utils/currencyId'
import { unwrappedToken } from '../../utils/unwrappedToken'
import { ButtonPrimary } from '../Button'
import DoubleCurrencyLogo from '../DoubleLogo'
import { RowBetween } from '../Row'
import { BottomSection, Break, CardBGImage, CardNoise, StatContainer, TopSection, Wrapper } from './styled'

export default function PoolCard({ stakingInfo }: { stakingInfo: StakingInfo }) {
    const token0 = stakingInfo.tokens[0]
    const token1 = stakingInfo.tokens[1]

    const currency0 = unwrappedToken(token0)
    const currency1 = unwrappedToken(token1)
    const isStaking = Boolean(stakingInfo.stakedAmount.greaterThan('0'))

    // get the color of the token
    const token = currency0.isNative ? token1 : token0
    const WETH = currency0.isNative ? token0 : token1
    const backgroundColor = useColor(token)

    const totalSupplyOfStakingToken = useTotalSupply(stakingInfo.stakedAmount.currency)
    const [, stakingTokenPair] = useV2Pair(...stakingInfo.tokens)

    // let returnOverMonth: Percent = new Percent('0')
    let valueOfTotalStakedAmountInWETH: CurrencyAmount<Token> | undefined
    if (totalSupplyOfStakingToken && stakingTokenPair) {
        // take the total amount of LP tokens staked, multiply by ETH value of all LP tokens, divide by all LP tokens
        valueOfTotalStakedAmountInWETH = CurrencyAmount.fromRawAmount(
            WETH,
            JSBI.divide(
                JSBI.multiply(
                    JSBI.multiply(stakingInfo.totalStakedAmount.quotient, stakingTokenPair.reserveOf(WETH).quotient),
                    JSBI.BigInt(2) // this is b/c the value of LP shares are ~double the value of the WETH they entitle owner to
                ),
                totalSupplyOfStakingToken.quotient
            )
        )
    }

    // get the USD value of staked WETH
    const USDPrice = useUSDCPrice(WETH)
    const valueOfTotalStakedAmountInUSDC =
        valueOfTotalStakedAmountInWETH && USDPrice?.quote(valueOfTotalStakedAmountInWETH)

    return (
        <Wrapper showBackground={isStaking} bgColor={backgroundColor}>
            <CardBGImage desaturate />
            <CardNoise />

            <TopSection>
                <DoubleCurrencyLogo currency0={currency0} currency1={currency1} size={24} />
                <TYPE.white fontWeight={600} fontSize={24} style={{ marginLeft: '8px' }}>
                    {currency0.symbol}-{currency1.symbol}
                </TYPE.white>

                <StyledInternalLink
                    to={`/uni/${currencyId(currency0, 137)}/${currencyId(currency1, 137)}`}
                    style={{ width: '100%' }}>
                    <ButtonPrimary padding='8px' $borderRadius='8px'>
                        {isStaking ? <Trans>Manage</Trans> : <Trans>Deposit</Trans>}
                    </ButtonPrimary>
                </StyledInternalLink>
            </TopSection>

            <StatContainer>
                <RowBetween>
                    <TYPE.white>
                        <Trans>Total deposited</Trans>
                    </TYPE.white>
                    <TYPE.white>
                        {valueOfTotalStakedAmountInUSDC ? (
                            <Trans>${valueOfTotalStakedAmountInUSDC.toFixed(0, { groupSeparator: ',' })}</Trans>
                        ) : (
                            <Trans>{valueOfTotalStakedAmountInWETH?.toSignificant(4, { groupSeparator: ',' }) ?? '-'} MATIC</Trans>
                        )}
                    </TYPE.white>
                </RowBetween>
                <RowBetween>
                    <TYPE.white>
                        <Trans>Pool rate</Trans>
                    </TYPE.white>
                    <TYPE.white>
                        {stakingInfo ? (
                            stakingInfo.active ? (
                                <Trans>
                                    {stakingInfo.totalRewardRate?.multiply(BIG_INT_SECONDS_IN_WEEK)?.toFixed(0, { groupSeparator: ',' })}{' '}
                                    UNI / week
                                </Trans>
                            ) : (
                                <Trans>0 UNI / week</Trans>
                            )
                        ) : (
                            '-'
                        )}
                    </TYPE.white>
                </RowBetween>
            </StatContainer>

            {isStaking && (
                <>
                    <Break />
                    <BottomSection showBackground={true}>
                        <TYPE.black color={'white'} fontWeight={500}>
              <span>
                <Trans>Your rate</Trans>
              </span>
                        </TYPE.black>

                        <TYPE.black style={{ textAlign: 'right' }} color={'white'} fontWeight={500}>
              <span role='img' aria-label='wizard-icon' style={{ marginRight: '0.5rem' }}>
                ⚡
              </span>
                            {stakingInfo ? (
                                stakingInfo.active ? (
                                    <Trans>
                                        {stakingInfo.rewardRate
                                            ?.multiply(BIG_INT_SECONDS_IN_WEEK)
                                            ?.toSignificant(4, { groupSeparator: ',' })}{' '}
                                        UNI / week
                                    </Trans>
                                ) : (
                                    <Trans>0 UNI / week</Trans>
                                )
                            ) : (
                                '-'
                            )}
                        </TYPE.black>
                    </BottomSection>
                </>
            )}
        </Wrapper>
    )
}
