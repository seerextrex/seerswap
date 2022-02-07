import { useCallback, useMemo, useState } from 'react'
import { NonfungiblePositionManager, Position } from 'lib/src'
import { PoolState, usePool } from 'hooks/usePools'
import { useToken } from 'hooks/Tokens'
import { useDerivedPositionInfo } from 'hooks/useDerivedPositionInfo'
import { useV3PositionFromTokenId } from 'hooks/useV3Positions'
import { Link, RouteComponentProps, useLocation } from 'react-router-dom'
import { unwrappedToken } from 'utils/unwrappedToken'
import { calculateGasMargin } from '../../utils/calculateGasMargin'
import { AutoColumn } from 'components/Column'
import { RowBetween, RowFixed } from 'components/Row'
import DoubleCurrencyLogo from 'components/DoubleLogo'
import { HideExtraSmall, TYPE } from 'theme'
import Badge from 'components/Badge'
import { ButtonConfirmed, ButtonPrimary } from 'components/Button'
import { DarkCard, LightCard } from 'components/Card'
import CurrencyLogo from 'components/CurrencyLogo'
import { Trans } from '@lingui/macro'
import { currencyId } from 'utils/currencyId'
import { formatCurrencyAmount } from 'utils/formatCurrencyAmount'
import { useV3PositionFees } from 'hooks/useV3PositionFees'
import { BigNumber } from '@ethersproject/bignumber'
import { Currency, CurrencyAmount, Fraction, Percent, Token } from '@uniswap/sdk-core'
import { useActiveWeb3React } from 'hooks/web3'
import { useV3NFTPositionManagerContract } from 'hooks/useContract'
import { useIsTransactionPending, useTransactionAdder } from 'state/transactions/hooks'
import TransactionConfirmationModal, {
    ConfirmationModalContent
} from 'components/TransactionConfirmationModal'
import { TransactionResponse } from '@ethersproject/providers'
import { Dots } from 'components/swap/styled'
import { getPriceOrderingFromPositionForUI } from '../../components/PositionListItem'
import useTheme from '../../hooks/useTheme'
import RateToggle from '../../components/RateToggle'
import { useSingleCallResult } from 'state/multicall/hooks'
import RangeBadge from '../../components/Badge/RangeBadge'
import { SwitchLocaleLink } from '../../components/SwitchLocaleLink'
import useUSDCPrice from 'hooks/useUSDCPrice'
import Loader from 'components/Loader'
import Toggle from 'components/Toggle'
import { Bound } from 'state/mint/v3/actions'
import useIsTickAtLimit from 'hooks/useIsTickAtLimit'
import { formatTickPrice } from 'utils/formatTickPrice'
import usePrevious from '../../hooks/usePrevious'
import ReactGA from 'react-ga'
import { MouseoverTooltip } from '../../components/Tooltip'
import { useAppSelector } from '../../state/hooks'
import { FARMING_CENTER, NONFUNGIBLE_POSITION_MANAGER_ADDRESSES } from '../../constants/addresses'
import {
    BadgeText,
    DoubleArrow,
    ExtentsText,
    FeeBadge,
    HoverText,
    Label,
    LoadingMock,
    PositionPageWrapper,
    PriceRow,
    ResponsiveButtonPrimary,
    ResponsiveRow,
    RowFixedStyled,
    RowFixedStyledButtons
} from './styleds'
import { useInverter } from '../../hooks/useInverter'
import { getRatio } from '../../utils/getRatio'
import { LinkedCurrency } from './LinkedCurrency'
import { CurrentPriceCard } from './CurrentPriceCard'

function useQuery() {
    const { search } = useLocation()

    return useMemo(() => new URLSearchParams(search), [search])
}

export default function PositionPage({
    match: {
        params: { tokenId: tokenIdFromUrl }
    }
}: RouteComponentProps<{ tokenId?: string }>) {
    const { chainId, account, library } = useActiveWeb3React()

    const query = useQuery()

    const isOnFarming = useMemo(() => query.get('onFarming'), [tokenIdFromUrl, query])

    const theme = useTheme()

    const parsedTokenId = tokenIdFromUrl ? BigNumber.from(tokenIdFromUrl) : undefined
    const { loading, position: positionDetails } = useV3PositionFromTokenId(parsedTokenId)
    const { position: existingPosition } = useDerivedPositionInfo(positionDetails)

    const gasPrice = useAppSelector((state) => state.application.gasPrice.override ? 70 : state.application.gasPrice.fetched)

    const { tokenId } = positionDetails || {}

    const prevPositionDetails = usePrevious({ ...positionDetails })
    const {
        token0: _token0Address,
        token1: _token1Address,
        liquidity: _liquidity,
        tickLower: _tickLower,
        tickUpper: _tickUpper
    } = useMemo(() => {
        if (!positionDetails && prevPositionDetails && prevPositionDetails.liquidity) {
            return { ...prevPositionDetails }
        }
        return { ...positionDetails }
    }, [positionDetails])

    const removed = _liquidity?.eq(0)

    const token0 = useToken(_token0Address)
    const token1 = useToken(_token1Address)

    const currency0 = token0 ? unwrappedToken(token0) : undefined
    const currency1 = token1 ? unwrappedToken(token1) : undefined

    // flag for receiving WETH
    const [receiveWETH, setReceiveWETH] = useState(false)

    // construct Position from details returned
    const [poolState, pool] = usePool(token0 ?? undefined, token1 ?? undefined)
    const [prevPoolState, prevPool] = usePrevious([poolState, pool]) || []
    const [_poolState, _pool] = useMemo(() => {
        if (!pool && prevPool && prevPoolState) {
            return [prevPoolState, prevPool]
        }
        return [poolState, pool]
    }, [pool, poolState])

    const position = useMemo(() => {
        if (_pool && _liquidity && typeof _tickLower === 'number' && typeof _tickUpper === 'number') {
            return new Position({
                pool: _pool,
                liquidity: _liquidity.toString(),
                tickLower: _tickLower,
                tickUpper: _tickUpper
            })
        }
        return undefined
    }, [_liquidity, _pool, _tickLower, _tickUpper])

    const tickAtLimit = useIsTickAtLimit(_tickLower, _tickUpper)

    const pricesFromPosition = getPriceOrderingFromPositionForUI(position)
    const [manuallyInverted, setManuallyInverted] = useState(false)

    // handle manual inversion
    const { priceLower, priceUpper, base } = useInverter({
        priceLower: pricesFromPosition.priceLower,
        priceUpper: pricesFromPosition.priceUpper,
        quote: pricesFromPosition.quote,
        base: pricesFromPosition.base,
        invert: manuallyInverted
    })

    const inverted = token1 ? base?.equals(token1) : undefined
    const currencyQuote = inverted ? currency0 : currency1
    const currencyBase = inverted ? currency1 : currency0

    const ratio = useMemo(() => {
        return priceLower && _pool && priceUpper
            ? getRatio(
                inverted ? priceUpper.invert() : priceLower,
                _pool.token0Price,
                inverted ? priceLower.invert() : priceUpper
            )
            : undefined
    }, [inverted, _pool, priceLower, priceUpper])

    // fees
    const [feeValue0, feeValue1] = useV3PositionFees(_pool ?? undefined, positionDetails?.tokenId, receiveWETH)

    const [collecting, setCollecting] = useState<boolean>(false)
    const [collectMigrationHash, setCollectMigrationHash] = useState<string | null>(null)
    const isCollectPending = useIsTransactionPending(collectMigrationHash ?? undefined)
    const [showConfirm, setShowConfirm] = useState(false)

    // usdc prices always in terms of tokens
    const price0 = useUSDCPrice(token0 ?? undefined)
    const price1 = useUSDCPrice(token1 ?? undefined)

    const fiatValueOfFees: CurrencyAmount<Currency> | null = useMemo(() => {
        if (!price0 || !price1 || !feeValue0 || !feeValue1) return null

        // we wrap because it doesn't matter, the quote returns a USDC amount
        const feeValue0Wrapped = feeValue0?.wrapped
        const feeValue1Wrapped = feeValue1?.wrapped

        if (!feeValue0Wrapped || !feeValue1Wrapped) return null

        const amount0 = price0.quote(feeValue0Wrapped)
        const amount1 = price1.quote(feeValue1Wrapped)
        return amount0.add(amount1)
    }, [price0, price1, feeValue0, feeValue1])

    const prevFiatValueOfFees = usePrevious(fiatValueOfFees)
    const _fiatValueOfFees = useMemo(() => {
        if (!fiatValueOfFees && prevFiatValueOfFees) {
            return prevFiatValueOfFees
        }
        return fiatValueOfFees
    }, [fiatValueOfFees])

    const fiatValueOfLiquidity: CurrencyAmount<Token> | null = useMemo(() => {
        if (!price0 || !price1 || !position) return null
        const amount0 = price0.quote(position.amount0)
        const amount1 = price1.quote(position.amount1)
        return amount0.add(amount1)
    }, [price0, price1, position])

    const prevFiatValueOfLiquidity = usePrevious(fiatValueOfLiquidity)
    const _fiatValueOfLiquidity = useMemo(() => {
        if (!fiatValueOfLiquidity && prevFiatValueOfLiquidity) {
            return prevFiatValueOfLiquidity
        }
        return fiatValueOfLiquidity
    }, [fiatValueOfLiquidity])

    const addTransaction = useTransactionAdder()
    const positionManager = useV3NFTPositionManagerContract()
    const collect = useCallback(() => {
        if (!chainId || !feeValue0 || !feeValue1 || !positionManager || !account || !tokenId || !library) return

        setCollecting(true)

        const collectAddress = isOnFarming ? FARMING_CENTER[chainId] : NONFUNGIBLE_POSITION_MANAGER_ADDRESSES[chainId]

        const { calldata, value } = NonfungiblePositionManager.collectCallParameters({
            tokenId: tokenId.toString(),
            expectedCurrencyOwed0: feeValue0,
            expectedCurrencyOwed1: feeValue1,
            recipient: account
        })

        const txn = {
            to: collectAddress,
            data: calldata,
            value: value
        }

        library
            .getSigner()
            .estimateGas(txn)
            .then((estimate) => {
                const newTxn = {
                    ...txn,
                    gasLimit: calculateGasMargin(chainId, estimate),
                    gasPrice: gasPrice * 1000000000
                }

                return library
                    .getSigner()
                    .sendTransaction(newTxn)
                    .then((response: TransactionResponse) => {
                        setCollectMigrationHash(response.hash)
                        setCollecting(false)

                        ReactGA.event({
                            category: 'Liquidity',
                            action: 'CollectV3',
                            label: [feeValue0.currency.symbol, feeValue1.currency.symbol].join('/')
                        })

                        addTransaction(response, {
                            summary: `Collect ${feeValue0.currency.symbol}/${feeValue1.currency.symbol} fees`
                        })
                    })
            })
            .catch((error) => {
                setCollecting(false)
                console.error(error)
            })
    }, [chainId, feeValue0, feeValue1, positionManager, account, tokenId, addTransaction, library])

    const owner = useSingleCallResult(!!tokenId ? positionManager : null, 'ownerOf', [tokenId]).result?.[0]
    const ownsNFT = owner === account || positionDetails?.operator === account

    const feeValueUpper = inverted ? feeValue0 : feeValue1
    const feeValueLower = inverted ? feeValue1 : feeValue0

    // check if price is within range
    const below = _pool && typeof _tickLower === 'number' ? _pool.tickCurrent < _tickLower : undefined
    const above = _pool && typeof _tickUpper === 'number' ? _pool.tickCurrent >= _tickUpper : undefined
    const inRange: boolean = typeof below === 'boolean' && typeof above === 'boolean' ? !below && !above : false

    function modalHeader() {
        return (
            <AutoColumn gap={'md'} style={{ marginTop: '20px' }}>
                <LightCard padding='12px 16px'>
                    <AutoColumn gap='md'>
                        <RowBetween>
                            <RowFixed>
                                <CurrencyLogo currency={feeValueUpper?.currency} size={'24px'}
                                              style={{ marginRight: '0.5rem' }} />
                                <TYPE.main>{feeValueUpper ? formatCurrencyAmount(feeValueUpper, 4) : '-'}</TYPE.main>
                            </RowFixed>
                            <TYPE.main>{feeValueUpper?.currency?.symbol}</TYPE.main>
                        </RowBetween>
                        <RowBetween>
                            <RowFixed>
                                <CurrencyLogo currency={feeValueLower?.currency} size={'24px'}
                                              style={{ marginRight: '0.5rem' }} />
                                <TYPE.main>{feeValueLower ? formatCurrencyAmount(feeValueLower, 4) : '-'}</TYPE.main>
                            </RowFixed>
                            <TYPE.main>{feeValueLower?.currency?.symbol}</TYPE.main>
                        </RowBetween>
                    </AutoColumn>
                </LightCard>
                <TYPE.italic color={theme.winterDisabledButton}>
                    <Trans>Collecting fees will withdraw currently available fees for you.</Trans>
                </TYPE.italic>
                <ButtonPrimary style={{ color: 'white' }} onClick={collect}>
                    <Trans>Collect</Trans>
                </ButtonPrimary>
            </AutoColumn>
        )
    }

    const showCollectAsWeth = Boolean(
        (ownsNFT || isOnFarming) &&
        (feeValue0?.greaterThan(0) || feeValue1?.greaterThan(0)) &&
        currency0 &&
        currency1 &&
        (currency0.isNative || currency1.isNative) &&
        !collectMigrationHash
    )

    return loading || _poolState === PoolState.LOADING ? (
        <LoadingMock>
            <Loader stroke={'white'} size={'30px'} />
        </LoadingMock>
    ) : (
        <>
            <PositionPageWrapper>
                <TransactionConfirmationModal
                    isOpen={showConfirm}
                    onDismiss={() => setShowConfirm(false)}
                    attemptingTxn={collecting}
                    hash={collectMigrationHash ?? ''}
                    content={() => (
                        <ConfirmationModalContent
                            title={<Trans>Claim fees</Trans>}
                            onDismiss={() => setShowConfirm(false)}
                            topContent={modalHeader}
                        />
                    )}
                    pendingText={<Trans>Collecting fees</Trans>}
                />
                <AutoColumn gap='md'>
                    <AutoColumn gap='sm'>
                        <Link style={{
                            textDecoration: 'none',
                            width: 'fit-content',
                            marginBottom: '0.5rem'
                        }} to='/pool'>
                            <HoverText>
                                <Trans>← Back to Pools Overview</Trans>
                            </HoverText>
                        </Link>
                        <ResponsiveRow>
                            <RowFixedStyled>
                                <DoubleCurrencyLogo currency0={currencyBase}
                                                    currency1={currencyQuote} size={24}
                                                    margin={true} />
                                <TYPE.label fontSize={'25px'} mr='10px'>
                                    &nbsp;{currencyQuote?.symbol}&nbsp;/&nbsp;{currencyBase?.symbol}
                                </TYPE.label>
                                <MouseoverTooltip text={<Trans>Current pool fee.</Trans>}>
                                    <FeeBadge style={{ marginRight: '8px' }}>
                                        <BadgeText>
                                            <Trans>{new Percent(existingPosition?.pool?.fee || 100, 1_000_000).toSignificant()}%</Trans>
                                        </BadgeText>
                                    </FeeBadge>
                                </MouseoverTooltip>
                                <RangeBadge removed={removed} inRange={inRange} />
                            </RowFixedStyled>
                            {ownsNFT && (
                                <RowFixedStyledButtons>
                                    {currency0 && currency1 && tokenId ? (
                                        <ResponsiveButtonPrimary
                                            as={Link}
                                            to={`/increase/${currencyId(currency0, chainId || 137)}/${currencyId(currency1, chainId || 137)}/${tokenId}`}
                                            width='fit-content'
                                            padding='6px 8px'
                                            $borderRadius='12px'
                                            style={{ color: 'white' }}
                                        >
                                            <Trans>Increase Liquidity</Trans>
                                        </ResponsiveButtonPrimary>
                                    ) : null}
                                    {tokenId && !removed ? (
                                        <ResponsiveButtonPrimary
                                            as={Link}
                                            to={`/remove/${tokenId}`}
                                            width='fit-content'
                                            padding='6px 8px'
                                            style={{ color: 'white' }}
                                            $borderRadius='12px'
                                        >
                                            <Trans>Remove Liquidity</Trans>
                                        </ResponsiveButtonPrimary>
                                    ) : null}
                                </RowFixedStyledButtons>
                            )}
                        </ResponsiveRow>
                        <RowBetween />
                    </AutoColumn>
                    <ResponsiveRow align='flex-start'>
                        <AutoColumn gap='sm' style={{ width: '100%', height: '100%' }}>
                            <DarkCard>
                                <AutoColumn gap='md' style={{ width: '100%' }}>
                                    <AutoColumn gap='md'>
                                        <Label>
                                            <Trans>Liquidity</Trans>
                                        </Label>
                                        {_fiatValueOfLiquidity?.greaterThan(new Fraction(1, 100)) ? (
                                            <TYPE.largeHeader fontSize='30px' fontWeight={500}>
                                                <Trans>${_fiatValueOfLiquidity.toFixed(2, { groupSeparator: ',' })}</Trans>
                                            </TYPE.largeHeader>
                                        ) : (
                                            <TYPE.largeHeader color={theme.text1} fontSize='36px'
                                                              fontWeight={500}>
                                                <Trans>$-</Trans>
                                            </TYPE.largeHeader>
                                        )}
                                    </AutoColumn>
                                    <LightCard padding='12px 16px'>
                                        <AutoColumn gap='md'>
                                            <RowBetween>
                                                <LinkedCurrency chainId={chainId}
                                                                currency={currencyQuote} />
                                                <RowFixed>
                                                    <TYPE.main>
                                                        {inverted
                                                            ? formatCurrencyAmount(position?.amount0, 4)
                                                            : formatCurrencyAmount(position?.amount1, 4)}
                                                    </TYPE.main>
                                                    {typeof ratio === 'number' && !removed ? (
                                                        <Badge style={{ marginLeft: '10px' }}>
                                                            <TYPE.main fontSize={11}>
                                                                <Trans>{inverted ? ratio : 100 - ratio}%</Trans>
                                                            </TYPE.main>
                                                        </Badge>
                                                    ) : null}
                                                </RowFixed>
                                            </RowBetween>
                                            <RowBetween>
                                                <LinkedCurrency chainId={chainId}
                                                                currency={currencyBase} />
                                                <RowFixed>
                                                    <TYPE.main>
                                                        {inverted
                                                            ? formatCurrencyAmount(position?.amount1, 4)
                                                            : formatCurrencyAmount(position?.amount0, 4)}
                                                    </TYPE.main>
                                                    {typeof ratio === 'number' && !removed ? (
                                                        <Badge style={{ marginLeft: '10px' }}>
                                                            <TYPE.main color={theme.text2}
                                                                       fontSize={11}>
                                                                <Trans>{inverted ? 100 - ratio : ratio}%</Trans>
                                                            </TYPE.main>
                                                        </Badge>
                                                    ) : null}
                                                </RowFixed>
                                            </RowBetween>
                                        </AutoColumn>
                                    </LightCard>
                                </AutoColumn>
                            </DarkCard>
                            <DarkCard>
                                <AutoColumn gap='md' style={{ width: '100%' }}>
                                    <AutoColumn gap='md'>
                                        <RowBetween style={{ alignItems: 'flex-start' }}>
                                            <AutoColumn gap='md'>
                                                <Label>
                                                    <Trans>Unclaimed fees</Trans>
                                                </Label>
                                                {_fiatValueOfFees?.greaterThan(new Fraction(1, 100)) ? (
                                                    <TYPE.largeHeader color={'#33FF89'}
                                                                      fontSize='36px'
                                                                      fontWeight={500}>
                                                        <Trans>${_fiatValueOfFees.toFixed(2, { groupSeparator: ',' })}</Trans>
                                                    </TYPE.largeHeader>
                                                ) : (
                                                    <TYPE.largeHeader color={theme.text1}
                                                                      fontSize='36px'
                                                                      fontWeight={500}>
                                                        <Trans>$-</Trans>
                                                    </TYPE.largeHeader>
                                                )}
                                            </AutoColumn>
                                            {(ownsNFT || isOnFarming) &&
                                            (feeValue0?.greaterThan(0) || feeValue1?.greaterThan(0) || !!collectMigrationHash) ? (
                                                <ButtonConfirmed
                                                    disabled={collecting || !!collectMigrationHash}
                                                    confirmed={!!collectMigrationHash && !isCollectPending}
                                                    width='fit-content'
                                                    style={{ borderRadius: '12px', color: 'white' }}
                                                    padding='4px 8px'
                                                    onClick={() => setShowConfirm(true)}
                                                >
                                                    {!!collectMigrationHash && !isCollectPending ? (
                                                        <TYPE.main style={{ color: 'white' }}
                                                                   color={theme.text1}>
                                                            <Trans> Collected</Trans>
                                                        </TYPE.main>
                                                    ) : isCollectPending || collecting ? (
                                                        <TYPE.main style={{ color: 'white' }}
                                                                   color={theme.text1}>
                                                            {' '}
                                                            <Dots>
                                                                <Trans>Collecting</Trans>
                                                            </Dots>
                                                        </TYPE.main>
                                                    ) : (
                                                        <>
                                                            <TYPE.main style={{ color: 'white' }}
                                                                       color={theme.white}>
                                                                <Trans>Collect fees</Trans>
                                                            </TYPE.main>
                                                        </>
                                                    )}
                                                </ButtonConfirmed>
                                            ) : null}
                                        </RowBetween>
                                    </AutoColumn>
                                    <LightCard padding='12px 16px'>
                                        <AutoColumn gap='md'>
                                            <RowBetween>
                                                <RowFixed>
                                                    <CurrencyLogo
                                                        currency={feeValueUpper?.currency}
                                                        size={'24px'}
                                                        style={{ marginRight: '0.5rem' }}
                                                    />
                                                    <TYPE.main>{feeValueUpper?.currency?.symbol}</TYPE.main>
                                                </RowFixed>
                                                <RowFixed>
                                                    <TYPE.main>{feeValueUpper ? formatCurrencyAmount(feeValueUpper, 4) : '-'}</TYPE.main>
                                                </RowFixed>
                                            </RowBetween>
                                            <RowBetween>
                                                <RowFixed>
                                                    <CurrencyLogo
                                                        currency={feeValueLower?.currency}
                                                        size={'24px'}
                                                        style={{ marginRight: '0.5rem' }}
                                                    />
                                                    <TYPE.main>{feeValueLower?.currency?.symbol}</TYPE.main>
                                                </RowFixed>
                                                <RowFixed>
                                                    <TYPE.main>{feeValueLower ? formatCurrencyAmount(feeValueLower, 4) : '-'}</TYPE.main>
                                                </RowFixed>
                                            </RowBetween>
                                        </AutoColumn>
                                    </LightCard>
                                    {showCollectAsWeth && (
                                        <AutoColumn gap='md'>
                                            <RowBetween>
                                                <TYPE.main>
                                                    <Trans>Collect as WMATIC</Trans>
                                                </TYPE.main>
                                                <Toggle
                                                    id='receive-as-weth'
                                                    isActive={receiveWETH}
                                                    toggle={() => setReceiveWETH((receiveWETH) => !receiveWETH)}
                                                />
                                            </RowBetween>
                                        </AutoColumn>
                                    )}
                                </AutoColumn>
                            </DarkCard>
                        </AutoColumn>
                    </ResponsiveRow>
                    <DarkCard>
                        <AutoColumn gap='md'>
                            <RowBetween>
                                <RowFixed>
                                    <Label display='flex' style={{ marginRight: '12px' }}>
                                        <Trans>Price range</Trans>
                                    </Label>
                                    <HideExtraSmall>
                                        <>
                                            <RangeBadge removed={removed} inRange={inRange} />
                                            <span style={{ width: '8px' }} />
                                        </>
                                    </HideExtraSmall>
                                </RowFixed>
                                <RowFixed>
                                    {currencyBase && currencyQuote && (
                                        <RateToggle
                                            currencyA={currencyBase}
                                            currencyB={currencyQuote}
                                            handleRateToggle={() => setManuallyInverted(!manuallyInverted)}
                                        />
                                    )}
                                </RowFixed>
                            </RowBetween>

                            <PriceRow>
                                <LightCard padding='12px' width='100%'>
                                    <AutoColumn gap='8px' justify='center'>
                                        <ExtentsText>
                                            <Trans>Min price</Trans>
                                        </ExtentsText>
                                        <TYPE.mediumHeader textAlign='center'>
                                            {formatTickPrice(priceLower, tickAtLimit, Bound.LOWER)}
                                        </TYPE.mediumHeader>
                                        <ExtentsText>
                                            {' '}
                                            <Trans>
                                                {currencyQuote?.symbol} per {currencyBase?.symbol}
                                            </Trans>
                                        </ExtentsText>

                                        {inRange && (
                                            <TYPE.small color={theme.text3}>
                                                <Trans>Your position will be
                                                    100% {currencyBase?.symbol} at this
                                                    price.</Trans>
                                            </TYPE.small>
                                        )}
                                    </AutoColumn>
                                </LightCard>

                                <DoubleArrow>⟷</DoubleArrow>
                                <LightCard padding='12px' width='100%'>
                                    <AutoColumn gap='8px' justify='center'>
                                        <ExtentsText>
                                            <Trans>Max price</Trans>
                                        </ExtentsText>
                                        <TYPE.mediumHeader textAlign='center'>
                                            {formatTickPrice(priceUpper, tickAtLimit, Bound.UPPER)}
                                        </TYPE.mediumHeader>
                                        <ExtentsText>
                                            {' '}
                                            <Trans>
                                                {currencyQuote?.symbol} per {currencyBase?.symbol}
                                            </Trans>
                                        </ExtentsText>

                                        {inRange && (
                                            <TYPE.small color={theme.text3}>
                                                <Trans>Your position will be
                                                    100% {currencyQuote?.symbol} at this
                                                    price.</Trans>
                                            </TYPE.small>
                                        )}
                                    </AutoColumn>
                                </LightCard>
                            </PriceRow>
                            <CurrentPriceCard
                                inverted={inverted}
                                pool={_pool}
                                currencyQuote={currencyQuote}
                                currencyBase={currencyBase}
                            />
                        </AutoColumn>
                    </DarkCard>
                </AutoColumn>
            </PositionPageWrapper>
            <SwitchLocaleLink />
        </>
    )
}
