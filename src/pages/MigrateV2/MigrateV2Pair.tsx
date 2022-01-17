import { Contract } from '@ethersproject/contracts'
import { TransactionResponse } from '@ethersproject/providers'
import { Trans } from '@lingui/macro'
import { CurrencyAmount, Fraction, Percent, Price, Token } from '@uniswap/sdk-core'
import { FeeAmount, Pool, Position, priceToClosestTick, TickMath } from '../../lib/src'
import Badge, { BadgeVariant } from 'components/Badge'
import { ButtonConfirmed } from 'components/Button'
import { BlueCard, DarkGreyCard, LightCard, YellowCard } from 'components/Card'
import DoubleCurrencyLogo from 'components/DoubleLogo'
import FeeSelector from 'components/FeeSelector'
import RangeSelector from 'components/RangeSelector'
import RateToggle from 'components/RateToggle'
import SettingsTab from 'components/Settings'
import { Dots } from 'components/swap/styleds'
import { ApprovalState, useApproveCallback } from 'hooks/useApproveCallback'
import useCurrentBlockTimestamp from 'hooks/useCurrentBlockTimestamp'
import { PoolState, usePool } from 'hooks/usePools'
import useTheme from 'hooks/useTheme'
import useTransactionDeadline from 'hooks/useTransactionDeadline'
import JSBI from 'jsbi'
import { ReactNode, useCallback, useEffect, useMemo, useState } from 'react'
import { AlertCircle, AlertTriangle, ArrowDown } from 'react-feather'
import { Redirect, RouteComponentProps } from 'react-router'
import { Text } from 'rebass'
import { useAppDispatch } from 'state/hooks'
import { Bound, resetMintState } from 'state/mint/v3/actions'
import { useRangeHopCallbacks, useV3DerivedMintInfo, useV3MintActionHandlers } from 'state/mint/v3/hooks'
import { useIsTransactionPending, useTransactionAdder } from 'state/transactions/hooks'
import { useUserSlippageToleranceWithDefault } from 'state/user/hooks'
import { formatCurrencyAmount } from 'utils/formatCurrencyAmount'
import { unwrappedToken } from 'utils/unwrappedToken'

import { AutoColumn } from '../../components/Column'
import CurrencyLogo from '../../components/CurrencyLogo'
import FormattedCurrencyAmount from '../../components/FormattedCurrencyAmount'
import { AutoRow, RowBetween, RowFixed } from '../../components/Row'
import { V2_FACTORY_ADDRESSES } from '../../constants/addresses'
import { WMATIC_EXTENDED } from '../../constants/tokens'
import { useToken } from '../../hooks/Tokens'
import { usePairContract, useV2MigratorContract } from '../../hooks/useContract'
import { useV2LiquidityTokenPermit } from '../../hooks/useERC20Permit'
import { useTotalSupply } from '../../hooks/useTotalSupply'
import { useActiveWeb3React } from '../../hooks/web3'
import { NEVER_RELOAD, useSingleCallResult } from '../../state/multicall/hooks'
import { TransactionType } from '../../state/transactions/actions'
import { useTokenBalance } from '../../state/wallet/hooks'
import { BackArrow, ExternalLink, TYPE } from '../../theme'
import { isAddress } from '../../utils'
import { calculateGasMargin } from '../../utils/calculateGasMargin'
import { currencyId } from '../../utils/currencyId'
import { ExplorerDataType, getExplorerLink } from '../../utils/getExplorerLink'
import { BodyWrapper } from '../AppBody'
import { BigNumber } from '@ethersproject/bignumber'
import { Link } from 'react-router-dom'
import { useIsNetworkFailed } from '../../hooks/useIsNetworkFailed'
import usePrevious from '../../hooks/usePrevious'

import ReactGA from 'react-ga'

const ZERO = JSBI.BigInt(0)

const DEFAULT_MIGRATE_SLIPPAGE_TOLERANCE = new Percent(75, 10_000)

function EmptyState({ message }: { message: ReactNode }) {
  return (
    <AutoColumn style={{ minHeight: 200, justifyContent: 'center', alignItems: 'center' }}>
      <TYPE.body>{message}</TYPE.body>
    </AutoColumn>
  )
}

function LiquidityInfo({
  token0Amount,
  token1Amount,
}: {
  token0Amount: CurrencyAmount<Token>
  token1Amount: CurrencyAmount<Token>
}) {
  const currency0 = unwrappedToken(token0Amount.currency)
  const currency1 = unwrappedToken(token1Amount.currency)

  return (
    <AutoColumn gap="8px">
      <RowBetween>
        <RowFixed>
          <CurrencyLogo size="24px" style={{ marginRight: '8px' }} currency={currency0} />
          <Text fontSize={16} fontWeight={500}>
            {currency0.symbol}
          </Text>
        </RowFixed>
        <Text fontSize={16} fontWeight={500}>
          <FormattedCurrencyAmount currencyAmount={token0Amount} />
        </Text>
      </RowBetween>
      <RowBetween>
        <RowFixed>
          <CurrencyLogo size="24px" style={{ marginRight: '8px' }} currency={currency1} />
          <Text fontSize={16} fontWeight={500}>
            {currency1.symbol}
          </Text>
        </RowFixed>

        <Text fontSize={16} fontWeight={500}>
          <FormattedCurrencyAmount currencyAmount={token1Amount} />
        </Text>
      </RowBetween>
    </AutoColumn>
  )
}

// hard-code this for now
const percentageToMigrate = 100

function V2PairMigration({
  pair,
  pairBalance,
  totalSupply,
  reserve0,
  reserve1,
  token0,
  token1,
}: {
  pair: Contract
  pairBalance: CurrencyAmount<Token>
  totalSupply: CurrencyAmount<Token>
  reserve0: CurrencyAmount<Token>
  reserve1: CurrencyAmount<Token>
  token0: Token
  token1: Token
}) {
  const { chainId, account } = useActiveWeb3React()
  const theme = useTheme()
  const v2FactoryAddress = chainId ? V2_FACTORY_ADDRESSES[chainId] : undefined

  const networkFailed = useIsNetworkFailed()

  const pairFactory = useSingleCallResult(pair, 'factory')
  const isNotUniswap = !pairFactory.result
    ? null
    : pairFactory.result?.[0] && pairFactory.result[0].toLowerCase() !== v2FactoryAddress.toLowerCase()
  const prevIsNotUniswap = usePrevious(isNotUniswap)
  const _isNotUniswap = useMemo(() => {
    if (isNotUniswap === null && prevIsNotUniswap) {
      return prevIsNotUniswap
    }
    return isNotUniswap
  }, [])

  const deadline = useTransactionDeadline() // custom from users settings
  const blockTimestamp = useCurrentBlockTimestamp()
  const allowedSlippage = useUserSlippageToleranceWithDefault(DEFAULT_MIGRATE_SLIPPAGE_TOLERANCE) // custom from users

  const currency0 = unwrappedToken(token0)
  const currency1 = unwrappedToken(token1)

  // this is just getLiquidityValue with the fee off, but for the passed pair
  const token0Value = useMemo(
    () =>
      CurrencyAmount.fromRawAmount(
        token0,
        JSBI.divide(JSBI.multiply(pairBalance.quotient, reserve0.quotient), totalSupply.quotient)
      ),
    [token0, pairBalance, reserve0, totalSupply]
  )
  const token1Value = useMemo(
    () =>
      CurrencyAmount.fromRawAmount(
        token1,
        JSBI.divide(JSBI.multiply(pairBalance.quotient, reserve1.quotient), totalSupply.quotient)
      ),
    [token1, pairBalance, reserve1, totalSupply]
  )

  // set up v3 pool
  const [feeAmount, setFeeAmount] = useState(FeeAmount.MEDIUM)
  const [poolState, pool] = usePool(token0, token1, feeAmount)
  const noLiquidity = poolState === PoolState.NOT_EXISTS

  // get spot prices + price difference
  const v2SpotPrice = useMemo(
    () => new Price(token0, token1, reserve0.quotient, reserve1.quotient),
    [token0, token1, reserve0, reserve1]
  )
  const v3SpotPrice = poolState === PoolState.EXISTS ? pool?.token0Price : undefined

  let priceDifferenceFraction: Fraction | string | undefined =
    v2SpotPrice && v3SpotPrice
      ? v2SpotPrice.divide(v3SpotPrice).greaterThan(10000)
        ? '> 1000'
        : v3SpotPrice.divide(v2SpotPrice).subtract(1).multiply(100)
      : undefined

  if (typeof priceDifferenceFraction !== 'string' && priceDifferenceFraction?.lessThan(ZERO)) {
    priceDifferenceFraction = priceDifferenceFraction.multiply(-1)
  }

  const largePriceDifference = useMemo(() => {
    if (typeof priceDifferenceFraction === 'string') {
      return true
    }
    return priceDifferenceFraction && !priceDifferenceFraction?.lessThan(JSBI.BigInt(2))
  }, [priceDifferenceFraction])

  // the following is a small hack to get access to price range data/input handlers
  const [baseToken, setBaseToken] = useState(token0)
  const { ticks, pricesAtTicks, invertPrice, invalidRange, outOfRange, ticksAtLimit } = useV3DerivedMintInfo(
    token0,
    token1,
    feeAmount,
    baseToken
  )

  // get value and prices at ticks
  const { [Bound.LOWER]: tickLower, [Bound.UPPER]: tickUpper } = ticks
  const { [Bound.LOWER]: priceLower, [Bound.UPPER]: priceUpper } = pricesAtTicks

  const { getDecrementLower, getIncrementLower, getDecrementUpper, getIncrementUpper } = useRangeHopCallbacks(
    baseToken,
    baseToken.equals(token0) ? token1 : token0,
    feeAmount,
    tickLower,
    tickUpper
  )

  const { onLeftRangeInput, onRightRangeInput } = useV3MintActionHandlers(noLiquidity)

  // the v3 tick is either the pool's tickCurrent, or the tick closest to the v2 spot price
  const tick = pool?.tickCurrent ?? priceToClosestTick(v2SpotPrice)
  // the price is either the current v3 price, or the price at the tick
  const sqrtPrice = pool?.sqrtRatioX96 ?? TickMath.getSqrtRatioAtTick(tick)
  const position =
    typeof tickLower === 'number' && typeof tickUpper === 'number' && !invalidRange
      ? Position.fromAmounts({
          pool: pool ?? new Pool(token0, token1, feeAmount, sqrtPrice, 0, tick, []),
          tickLower,
          tickUpper,
          amount0: token0Value.quotient,
          amount1: token1Value.quotient,
          useFullPrecision: true, // we want full precision for the theoretical position
        })
      : undefined

  const { amount0: v3Amount0Min, amount1: v3Amount1Min } = useMemo(
    () => (position ? position.mintAmountsWithSlippage(allowedSlippage) : { amount0: undefined, amount1: undefined }),
    [position, allowedSlippage]
  )

  const refund0 = useMemo(
    () =>
      position && CurrencyAmount.fromRawAmount(token0, JSBI.subtract(token0Value.quotient, position.amount0.quotient)),
    [token0Value, position, token0]
  )
  const refund1 = useMemo(
    () =>
      position && CurrencyAmount.fromRawAmount(token1, JSBI.subtract(token1Value.quotient, position.amount1.quotient)),
    [token1Value, position, token1]
  )

  const [confirmingMigration, setConfirmingMigration] = useState<boolean>(false)
  const [pendingMigrationHash, setPendingMigrationHash] = useState<string | null>(null)

  const migrator = useV2MigratorContract()

  // approvals
  const [approval, approveManually] = useApproveCallback(pairBalance, migrator?.address)
  const { signatureData, gatherPermitSignature } = useV2LiquidityTokenPermit(pairBalance, migrator?.address)

  const approve = useCallback(async () => {
    if (true) {
      // sushi has to be manually approved
      await approveManually()
    } else if (gatherPermitSignature) {
      try {
        await gatherPermitSignature()
      } catch (error) {
        // try to approve if gatherPermitSignature failed for any reason other than the user rejecting it
        if (error?.code !== 4001) {
          await approveManually()
        }
      }
    } else {
      await approveManually()
    }
  }, [gatherPermitSignature, approveManually])

  const addTransaction = useTransactionAdder()
  const isMigrationPending = useIsTransactionPending(pendingMigrationHash ?? undefined)

  const migrate = useCallback(() => {
    if (
      !migrator ||
      !account ||
      !deadline ||
      !blockTimestamp ||
      typeof tickLower !== 'number' ||
      typeof tickUpper !== 'number' ||
      !v3Amount0Min ||
      !v3Amount1Min ||
      !chainId
    )
      return

    const deadlineToUse = signatureData?.deadline ?? deadline

    const data: string[] = []

    // permit if necessary
    if (signatureData) {
      data.push(
        migrator.interface.encodeFunctionData('selfPermit', [
          pair.address,
          `0x${pairBalance.quotient.toString(16)}`,
          deadlineToUse,
          signatureData.v,
          signatureData.r,
          signatureData.s,
        ])
      )
    }

    // create/initialize pool if necessary
    if (noLiquidity) {
      data.push(
        migrator.interface.encodeFunctionData('createAndInitializePoolIfNecessary', [
          token0.address,
          token1.address,
          `0x${sqrtPrice.toString(16)}`,
        ])
      )
    }

    // TODO could save gas by not doing this in multicall
    data.push(
      migrator.interface.encodeFunctionData('migrate', [
        {
          pair: pair.address,
          liquidityToMigrate: `0x${pairBalance.quotient.toString(16)}`,
          percentageToMigrate,
          token0: token0.address,
          token1: token1.address,
          tickLower,
          tickUpper,
          amount0Min: `0x${v3Amount0Min.toString(16)}`,
          amount1Min: `0x${v3Amount1Min.toString(16)}`,
          recipient: account,
          deadline: deadlineToUse,
          refundAsNative: false, // hard-code this for now
        },
      ])
    )

    setConfirmingMigration(true)

    migrator.estimateGas
      .multicall(data)
      .then((gasEstimate) => {
        return migrator.multicall(data, { gasLimit: 10000000 }).then((response: TransactionResponse) => {
          ReactGA.event({
            category: 'Migrate',
            action: `${isNotUniswap ? 'SushiSwap' : 'QuickSwap'}->Algebra`,
            label: `${currency0.symbol}/${currency1.symbol}`,
          })

          addTransaction(response, {
            type: TransactionType.MIGRATE_LIQUIDITY_V3,
            baseCurrencyId: currencyId(currency0),
            quoteCurrencyId: currencyId(currency1),
            isFork: _isNotUniswap,
          })
          setPendingMigrationHash(response.hash)
        })
      })
      .catch(() => {
        setConfirmingMigration(false)
      })
  }, [
    chainId,
    _isNotUniswap,
    migrator,
    noLiquidity,
    blockTimestamp,
    token0,
    token1,
    feeAmount,
    pairBalance,
    tickLower,
    tickUpper,
    sqrtPrice,
    v3Amount0Min,
    v3Amount1Min,
    account,
    deadline,
    signatureData,
    addTransaction,
    pair,
    currency0,
    currency1,
  ])

  const isSuccessfullyMigrated = !!pendingMigrationHash && JSBI.equal(pairBalance.quotient, ZERO)

  return (
    <AutoColumn gap="20px">
      <LightCard>
        <AutoColumn gap="lg">
          <RowBetween>
            <RowFixed style={{ marginLeft: '8px' }}>
              <DoubleCurrencyLogo currency0={currency0} currency1={currency1} margin={false} size={24} />
              <TYPE.mediumHeader style={{ marginLeft: '8px' }}>
                {currency1.symbol}/{currency0.symbol} LP Tokens
              </TYPE.mediumHeader>
            </RowFixed>
            <Badge
              variant={BadgeVariant.WARNING}
              style={{
                backgroundColor: 'white',
                color: _isNotUniswap ? '#48b9cd' : '#f241a5',
              }}
            >
              {_isNotUniswap ? 'SushiSwap' : 'QuickSwap'}
            </Badge>
          </RowBetween>
          <LiquidityInfo token0Amount={token0Value} token1Amount={token1Value} />
        </AutoColumn>
      </LightCard>

      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <ArrowDown size={24} />
      </div>

      <LightCard>
        <AutoColumn gap="lg">
          <RowBetween>
            <RowFixed style={{ marginLeft: '8px' }}>
              <DoubleCurrencyLogo currency0={currency0} currency1={currency1} margin={false} size={24} />
              <TYPE.mediumHeader style={{ marginLeft: '8px' }}>
                {currency1.symbol}/{currency0.symbol} LP NFT
              </TYPE.mediumHeader>
            </RowFixed>
            <Badge variant={BadgeVariant.PRIMARY}>Algebra</Badge>
          </RowBetween>

          {noLiquidity && (
            <BlueCard
              style={{ display: 'flex', backgroundColor: '#0e3459', flexDirection: 'column', alignItems: 'center' }}
            >
              <AlertCircle color={theme.text1} style={{ marginBottom: '12px', opacity: 0.8 }} />
              <TYPE.body fontSize={14} style={{ marginBottom: 8, fontWeight: 500, opacity: 0.8 }} textAlign="center">
                You are the first liquidity provider for this Algebra pool. Your liquidity will migrate at the current{' '}
                {_isNotUniswap ? 'SushiSwap' : 'QuickSwap'} price.
              </TYPE.body>

              <TYPE.body fontWeight={500} textAlign="center" fontSize={14} style={{ marginTop: '8px', opacity: 0.8 }}>
                Your transaction cost will be much higher as it includes the gas to create the pool.
              </TYPE.body>

              {v2SpotPrice && (
                <AutoColumn gap="8px" style={{ marginTop: '12px' }}>
                  <RowBetween>
                    <TYPE.body fontWeight={500} fontSize={14}>
                      {_isNotUniswap ? 'SushiSwap' : 'QuickSwap'} {invertPrice ? currency1.symbol : currency0.symbol}{' '}
                      Price:{' '}
                      {invertPrice
                        ? `${v2SpotPrice?.invert()?.toSignificant(6)} ${currency0.symbol}`
                        : `${v2SpotPrice?.toSignificant(6)} ${currency1.symbol}`}
                    </TYPE.body>
                  </RowBetween>
                </AutoColumn>
              )}
            </BlueCard>
          )}

          {largePriceDifference ? (
            <YellowCard>
              <AutoColumn gap="8px">
                <RowBetween>
                  <TYPE.body fontSize={14}>
                    {_isNotUniswap ? 'SushiSwap' : 'QuickSwap'} {invertPrice ? currency1.symbol : currency0.symbol}{' '}
                    Price:
                  </TYPE.body>
                  <TYPE.black fontSize={14}>
                    {invertPrice
                      ? `${v2SpotPrice?.invert()?.toSignificant(6)} ${currency0.symbol}`
                      : `${v2SpotPrice?.toSignificant(6)} ${currency1.symbol}`}
                  </TYPE.black>
                </RowBetween>

                <RowBetween>
                  <TYPE.body fontSize={14}>
                    {`Algebra ${invertPrice ? currency1.symbol : currency0.symbol} Price:`}
                  </TYPE.body>
                  <TYPE.black fontSize={14}>
                    {invertPrice
                      ? `${v3SpotPrice?.invert()?.toSignificant(6)} ${currency0.symbol}`
                      : `${
                          Number(v3SpotPrice?.toSignificant(6)) < 0.0001 ? '< 0.0001' : v3SpotPrice?.toSignificant(6)
                        } ${currency1.symbol}`}
                  </TYPE.black>
                </RowBetween>

                <RowBetween>
                  <TYPE.body fontSize={14} color="inherit">
                    Price Difference:
                  </TYPE.body>
                  <TYPE.black fontSize={14} color="inherit">
                    {`${
                      typeof priceDifferenceFraction !== 'string'
                        ? priceDifferenceFraction?.toSignificant(4)
                        : priceDifferenceFraction
                    }%`}
                  </TYPE.black>
                </RowBetween>
              </AutoColumn>
              <TYPE.body fontSize={14} style={{ marginTop: 8, fontWeight: 400 }}>
                You should only deposit liquidity into Algebra at a price you believe is correct. <br />
                If the price seems incorrect, you can either make a swap to move the price or wait for someone else to
                do so.
              </TYPE.body>
            </YellowCard>
          ) : !noLiquidity && v3SpotPrice ? (
            <RowBetween>
              <TYPE.body fontSize={14}>Algebra {invertPrice ? currency1.symbol : currency0.symbol} Price:</TYPE.body>
              <TYPE.black fontSize={14}>
                {invertPrice
                  ? `${v3SpotPrice?.invert()?.toSignificant(6)} ${currency0.symbol}`
                  : `${v3SpotPrice?.toSignificant(6)} ${currency1.symbol}`}
              </TYPE.black>
            </RowBetween>
          ) : null}

          <RowBetween>
            <TYPE.label>Set Price Range</TYPE.label>
            <RateToggle
              currencyA={invertPrice ? currency1 : currency0}
              currencyB={invertPrice ? currency0 : currency1}
              handleRateToggle={() => {
                onLeftRangeInput('')
                onRightRangeInput('')
                setBaseToken((base) => (base.equals(token0) ? token1 : token0))
              }}
            />
          </RowBetween>

          <RangeSelector
            priceLower={priceLower}
            priceUpper={priceUpper}
            getDecrementLower={getDecrementLower}
            getIncrementLower={getIncrementLower}
            getDecrementUpper={getDecrementUpper}
            getIncrementUpper={getIncrementUpper}
            onLeftRangeInput={onLeftRangeInput}
            onRightRangeInput={onRightRangeInput}
            currencyA={invertPrice ? currency1 : currency0}
            currencyB={invertPrice ? currency0 : currency1}
            feeAmount={feeAmount}
            ticksAtLimit={ticksAtLimit}
          />

          {outOfRange ? (
            <YellowCard padding="8px 12px" $borderRadius="12px">
              <RowBetween>
                <AlertTriangle stroke={theme.yellow3} size="16px" />
                <TYPE.yellow ml="12px" fontSize="12px">
                  Your position will not earn fees or be used in trades until the market price moves into your range.
                </TYPE.yellow>
              </RowBetween>
            </YellowCard>
          ) : null}

          {invalidRange ? (
            <YellowCard padding="8px 12px" $borderRadius="12px">
              <RowBetween>
                <AlertTriangle stroke={theme.yellow3} size="16px" />
                <TYPE.yellow ml="12px" fontSize="12px">
                  Invalid range selected. The min price must be lower than the max price.
                </TYPE.yellow>
              </RowBetween>
            </YellowCard>
          ) : null}

          {position ? (
            <DarkGreyCard>
              <AutoColumn gap="md">
                <LiquidityInfo token0Amount={position.amount0} token1Amount={position.amount1} />
                {chainId && refund0 && refund1 ? (
                  <TYPE.black fontSize={12}>
                    At least {formatCurrencyAmount(refund0, 4)}{' '}
                    {token0.equals(WMATIC_EXTENDED[chainId]) ? 'MATIC' : token0.symbol} and{' '}
                    {formatCurrencyAmount(refund1, 4)}{' '}
                    {token1.equals(WMATIC_EXTENDED[chainId]) ? 'MATIC' : token1.symbol} will be refunded to your wallet
                    due to selected price range.
                  </TYPE.black>
                ) : null}
              </AutoColumn>
            </DarkGreyCard>
          ) : null}

          <AutoColumn gap="12px">
            {!isSuccessfullyMigrated && !isMigrationPending ? (
              <AutoColumn gap="12px" style={{ flex: '1' }}>
                <ButtonConfirmed
                  confirmed={approval === ApprovalState.APPROVED || signatureData !== null}
                  disabled={
                    approval !== ApprovalState.NOT_APPROVED ||
                    signatureData !== null ||
                    !v3Amount0Min ||
                    !v3Amount1Min ||
                    invalidRange ||
                    confirmingMigration
                  }
                  onClick={approve}
                >
                  {approval === ApprovalState.PENDING ? (
                    <Dots>Approving</Dots>
                  ) : approval === ApprovalState.APPROVED || signatureData !== null ? (
                    <span>Allowed</span>
                  ) : (
                    <span>Allow LP token migration</span>
                  )}
                </ButtonConfirmed>
              </AutoColumn>
            ) : null}
            <AutoColumn gap="12px" style={{ flex: '1' }}>
              <ButtonConfirmed
                disabled={
                  !v3Amount0Min ||
                  !v3Amount1Min ||
                  invalidRange ||
                  (approval !== ApprovalState.APPROVED && signatureData === null) ||
                  confirmingMigration ||
                  isMigrationPending
                }
                as={isSuccessfullyMigrated ? Link : null}
                to={`/pool`}
                onClick={isSuccessfullyMigrated ? null : migrate}
              >
                {isSuccessfullyMigrated ? (
                  'Success! View pools'
                ) : isMigrationPending ? (
                  <Dots>Migrating</Dots>
                ) : networkFailed ? (
                  <span>Connecting to network...</span>
                ) : (
                  <span>Migrate</span>
                )}
              </ButtonConfirmed>
            </AutoColumn>
          </AutoColumn>
        </AutoColumn>
      </LightCard>
    </AutoColumn>
  )
}

export default function MigrateV2Pair({
  match: {
    params: { address },
  },
}: RouteComponentProps<{ address: string }>) {
  // reset mint state on component mount, and as a cleanup (on unmount)
  const dispatch = useAppDispatch()
  useEffect(() => {
    dispatch(resetMintState())
    return () => {
      dispatch(resetMintState())
    }
  }, [dispatch])

  const { chainId, account } = useActiveWeb3React()

  const networkFailed = useIsNetworkFailed()

  // get pair contract
  const validatedAddress = isAddress(address)
  const pair = usePairContract(validatedAddress ? validatedAddress : undefined)
  const prevPair = usePrevious(pair)
  const _pair = useMemo(() => {
    if (!pair && prevPair) {
      return prevPair
    }
    return pair
  }, [pair])

  // get token addresses from pair contract
  const token0AddressCallState = useSingleCallResult(pair, 'token0', undefined, NEVER_RELOAD)
  const token0Address = token0AddressCallState?.result?.[0]
  const token1Address = useSingleCallResult(pair, 'token1', undefined, NEVER_RELOAD)?.result?.[0]

  // get tokens
  const token0 = useToken(token0Address)
  const prevToken0 = usePrevious(token0)
  const _token0 = useMemo(() => {
    if (!token0 && prevToken0) {
      return prevToken0
    }
    return token0
  }, [token0])

  const token1 = useToken(token1Address)
  const prevToken1 = usePrevious(token1)
  const _token1 = useMemo(() => {
    if (!token1 && prevToken1) {
      return prevToken1
    }
    return token1
  }, [token1])

  // get liquidity token balance
  const liquidityToken: Token | undefined = useMemo(
    () => (chainId && validatedAddress ? new Token(chainId, validatedAddress, 18) : undefined),
    [chainId, validatedAddress]
  )

  // get data required for V2 pair migration
  const pairBalance = useTokenBalance(account ?? undefined, liquidityToken)
  const prevPairBalance = usePrevious(pairBalance)
  const _pairBalance = useMemo(() => {
    if (!pairBalance && prevPairBalance) {
      return prevPairBalance
    }

    return pairBalance
  }, [pairBalance])

  const totalSupply = useTotalSupply(liquidityToken)
  const prevTotalSupply = usePrevious(totalSupply)
  const _totalSupply = useMemo(() => {
    if (!totalSupply && prevTotalSupply) {
      return prevTotalSupply
    }
    return totalSupply
  }, [totalSupply])

  const [reserve0Raw, reserve1Raw] = useSingleCallResult(pair, 'getReserves')?.result ?? []
  const reserve0 = useMemo(
    () => (token0 && reserve0Raw ? CurrencyAmount.fromRawAmount(token0, reserve0Raw) : undefined),
    [token0, reserve0Raw]
  )
  const prevReserve0 = usePrevious(reserve0)
  const _reserve0 = useMemo(() => {
    if (!reserve0 && prevReserve0) {
      return prevReserve0
    }

    return reserve0
  }, [reserve0])

  const reserve1 = useMemo(
    () => (token1 && reserve1Raw ? CurrencyAmount.fromRawAmount(token1, reserve1Raw) : undefined),
    [token1, reserve1Raw]
  )
  const prevReserve1 = usePrevious(reserve1)
  const _reserve1 = useMemo(() => {
    if (!reserve1 && prevReserve1) {
      return prevReserve1
    }

    return reserve1
  }, [reserve1])

  // redirect for invalid url params
  if (
    !validatedAddress ||
    !pair ||
    (pair &&
      token0AddressCallState?.valid &&
      !token0AddressCallState?.loading &&
      !token0AddressCallState?.error &&
      !token0Address)
  ) {
    console.error('Invalid pair address')
    return <Redirect to="/migrate" />
  }

  return (
    <BodyWrapper style={{ padding: 24 }}>
      <AutoColumn gap="16px">
        <AutoRow style={{ alignItems: 'center', justifyContent: 'center' }} gap="8px">
          <TYPE.mediumHeader>Migrate Liquidity</TYPE.mediumHeader>
          <SettingsTab placeholderSlippage={DEFAULT_MIGRATE_SLIPPAGE_TOLERANCE} />
        </AutoRow>

        {!account ? (
          <TYPE.largeHeader>You must connect an account.</TYPE.largeHeader>
        ) : _pairBalance && _totalSupply && _reserve0 && _reserve1 && _token0 && _token1 ? (
          <V2PairMigration
            pair={_pair}
            pairBalance={_pairBalance}
            totalSupply={_totalSupply}
            reserve0={_reserve0}
            reserve1={_reserve1}
            token0={_token0}
            token1={_token1}
          />
        ) : (
          <EmptyState message={'Loading'} />
        )}
      </AutoColumn>
    </BodyWrapper>
  )
}
