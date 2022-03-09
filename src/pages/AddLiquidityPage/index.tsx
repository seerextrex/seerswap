import { BigNumber } from '@ethersproject/bignumber'
import { RouteComponentProps } from 'react-router'
import { useV3NFTPositionManagerContract } from '../../hooks/useContract'
import { useActiveWeb3React } from '../../hooks/web3'
import { useWalletModalToggle } from '../../state/application/hooks'
import { useAllTransactions, useTransactionAdder } from '../../state/transactions/hooks'
import { useV3PositionFromTokenId } from '../../hooks/useV3Positions'
import { useDerivedPositionInfo } from '../../hooks/useDerivedPositionInfo'
import { useUserSlippageToleranceWithDefault } from '../../state/user/hooks'
import { CurrencyDropdown, StyledInput } from '../AddLiquidity/styled'
import { useCurrency } from '../../hooks/Tokens'
import { useRangeHopCallbacks, useV3DerivedMintInfo, useV3MintActionHandlers, useV3MintState } from '../../state/mint/v3/hooks'
import { useCallback, useEffect, useMemo, useState } from 'react'
import useTransactionDeadline from '../../hooks/useTransactionDeadline'
import { useUSDCValue } from '../../hooks/useUSDCPrice'
import { maxAmountSpend } from '../../utils/maxAmountSpend'
import { ApprovalState, useApproveCallback } from '../../hooks/useApproveCallback'
import { NONFUNGIBLE_POSITION_MANAGER_ADDRESSES } from '../../constants/addresses'
import { ZERO_PERCENT } from '../../constants/misc'
import { Currency, CurrencyAmount, Percent } from '@uniswap/sdk-core'
import { Bound, Field } from '../../state/mint/v3/actions'
import { currencyId } from '../../utils/currencyId'
import { WMATIC_EXTENDED } from '../../constants/tokens'
import CurrencyInputPanel from '../../components/CurrencyInputPanel'
import RangeSelector from '../../components/RangeSelector'
import LiquidityChartRangeInput from '../../components/LiquidityChartRangeInput'
import { NonfungiblePositionManager as NonFunPosMan } from './nft-manager'
import { calculateGasMargin } from '../../utils/calculateGasMargin'
import { TransactionResponse } from '@ethersproject/abstract-provider'
import { t } from '@lingui/macro'
import { SupportedChainId } from '../../constants/chains'
import { ArrowLeft, Download, Info } from 'react-feather'
// @ts-ignore
import PDFAlgebra from '../../assets/pdf/Algebra_Tech_Paper.pdf'
import SettingsTab from '../../components/Settings'
import usePrevious from '../../hooks/usePrevious'
import ReactGA from 'react-ga'
import { useAppSelector } from '../../state/hooks'
import { Contract, providers } from 'ethers'
import {
    AddLiquidityButton,
    ApproveButton,
    ApproveButtonContainer,
    ButtonsWrapper,
    Error,
    FullRangeButton,
    MaxButton,
    PairNotSelectedMock,
    PriceRangeChart,
    PriceRangeInputs,
    PriceRangeWrapper,
    Title,
    TokenItem,
    TokenItemBottomInputWrapper,
    TokenPair,
    Warning
} from './styled'

//TODO test merge without failed polygon
import NON_FUN_POS_MAN from '../../abis/non-fun-pos-man.json'
import { EthereumWindow, WrappedCurrency } from '../../models/types'
import { GAS_PRICE_MULTIPLIER } from '../../hooks/useGasPrice'
import { useIsNetworkFailedImmediate } from 'hooks/useIsNetworkFailed'
import Loader from 'components/Loader'
import Card from '../../shared/components/Card/Card'
import { NavLink } from 'react-router-dom'

const DEFAULT_ADD_IN_RANGE_SLIPPAGE_TOLERANCE = new Percent(50, 10_000)

export default function AddLiquidityPage({ match: { params: { currencyIdA, currencyIdB, tokenId } }, history }: RouteComponentProps<{
    currencyIdA?: string;
    currencyIdB?: string;
    feeAmount?: string;
    tokenId?: string;
}>) {
    const { account, chainId, library } = useActiveWeb3React()
    const toggleWalletModal = useWalletModalToggle() // toggle wallet when disconnected
    const addTransaction = useTransactionAdder()
    const positionManager = useV3NFTPositionManagerContract()
    const _window = window as unknown as EthereumWindow
    const provider = _window.ethereum ? new providers.Web3Provider(_window.ethereum) : undefined

    const gasPrice = useAppSelector((state) => {
        if (!state.application.gasPrice.fetched) return 70
        return state.application.gasPrice.override ? 70 : state.application.gasPrice.fetched
    })
    const allTransactions = useAllTransactions()

    const sortedRecentTransactions = useMemo(() => {
        const txs = Object.values(allTransactions)
        return txs
            .filter((tx) => new Date().getTime() - tx.addedTime < 86_400_000)
            .sort((a, b) => b.addedTime - a.addedTime)
    }, [allTransactions])

    const confirmed = useMemo(() => sortedRecentTransactions
            .filter((tx) => tx.receipt)
            .map((tx) => tx.hash),
        [sortedRecentTransactions, allTransactions])

    // @ts-ignore
    useEffect(async () => {
        if (confirmed.some((hash) => hash === txHash)) {
            const nonFunPosManContract = new Contract(
                NONFUNGIBLE_POSITION_MANAGER_ADDRESSES[chainId || 137],
                NON_FUN_POS_MAN,
                provider?.getSigner()
            )

            try {
                const nftNum = await nonFunPosManContract.totalSupply()
                history.push(`/pool/${nftNum}`)
            } catch (err) {
                history.push(`/pool`)
            }
        }
    }, [confirmed])

    // check for existing position if tokenId in url
    const { position: existingPositionDetails, loading: positionLoading } = useV3PositionFromTokenId(tokenId ? BigNumber.from(tokenId) : undefined)
    const hasExistingPosition = !!existingPositionDetails && !positionLoading

    const baseCurrency = useCurrency(currencyIdA)
    const currencyB = useCurrency(currencyIdB)

    // prevent an error if they input ETH/WETH
    //TODO
    const quoteCurrency = baseCurrency && currencyB && baseCurrency.wrapped.equals(currencyB.wrapped) ? undefined : currencyB

    const { position: existingPosition } = useDerivedPositionInfo(existingPositionDetails)

    const prevExistingPosition = usePrevious(existingPosition)

    const _existingPosition = useMemo(() => {
        if (!existingPosition && prevExistingPosition) {
            return {
                ...prevExistingPosition
            }
        }
        return {
            ...existingPosition
        }
    }, [existingPosition, baseCurrency, quoteCurrency])

    const feeAmount = 100

    useEffect(() => {
        onFieldAInput('')
        onFieldBInput('')
        onLeftRangeInput('')
        onRightRangeInput('')
    }, [currencyIdA, currencyIdB])

    // mint state
    const { independentField, typedValue, startPriceTypedValue } = useV3MintState()

    // modal and loading
    const [showConfirm, setShowConfirm] = useState<boolean>(false)
    const [attemptingTxn, setAttemptingTxn] = useState<boolean>(false) // clicked confirm

    const derivedMintInfo = useV3DerivedMintInfo(
        baseCurrency ?? undefined,
        quoteCurrency ?? undefined,
        feeAmount,
        baseCurrency ?? undefined,
        // @ts-ignore
        _existingPosition
    )
    const prevDerivedMintInfo = usePrevious({ ...derivedMintInfo })

    const isNetworkFailed = useIsNetworkFailedImmediate()

    const {
        pool,
        ticks,
        dependentField,
        price,
        pricesAtTicks,
        parsedAmounts,
        currencyBalances,
        position,
        noLiquidity,
        currencies,
        errorMessage,
        invalidRange,
        outOfRange,
        depositADisabled,
        depositBDisabled,
        invertPrice,
        ticksAtLimit,
        dynamicFee
    } = useMemo(() => {
        if ((!derivedMintInfo.pool || !derivedMintInfo.price || derivedMintInfo.noLiquidity) && prevDerivedMintInfo) {
            return {
                ...prevDerivedMintInfo
            }
        }
        return {
            ...derivedMintInfo
        }
    }, [derivedMintInfo, baseCurrency, quoteCurrency])

    const { onFieldAInput, onFieldBInput, onLeftRangeInput, onRightRangeInput, onStartPriceInput } =
        useV3MintActionHandlers(noLiquidity)

    const isValid = !errorMessage && !invalidRange

    // txn values
    const deadline = useTransactionDeadline() // custom from users settings

    const [txHash, setTxHash] = useState<string>('')
    const [showTech, setShowTech] = useState(false)

    // get formatted amounts
    const formattedAmounts = {
        [independentField]: typedValue,
        [dependentField]: parsedAmounts[dependentField]?.toSignificant(6) ?? ''
    }

    const usdcValues = {
        [Field.CURRENCY_A]: useUSDCValue(parsedAmounts[Field.CURRENCY_A]),
        [Field.CURRENCY_B]: useUSDCValue(parsedAmounts[Field.CURRENCY_B])
    }

    // get the max amounts user can add
    const maxAmounts: { [field in Field]?: CurrencyAmount<Currency> } = [Field.CURRENCY_A, Field.CURRENCY_B]
        .reduce((accumulator, field) => {
            return {
                ...accumulator,
                [field]: maxAmountSpend(currencyBalances[field])
            }
        }, {})

    const atMaxAmounts: { [field in Field]?: CurrencyAmount<Currency> } = [Field.CURRENCY_A, Field.CURRENCY_B]
        .reduce((accumulator, field) => {
            return {
                ...accumulator,
                [field]: maxAmounts[field]?.equalTo(parsedAmounts[field] ?? '0')
            }
        }, {})

    // check whether the user has approved the router on the tokens
    const [approvalA, approveACallback] = useApproveCallback(
        parsedAmounts[Field.CURRENCY_A],
        chainId ? NONFUNGIBLE_POSITION_MANAGER_ADDRESSES[chainId] : undefined
    )
    const [approvalB, approveBCallback] = useApproveCallback(
        parsedAmounts[Field.CURRENCY_B],
        chainId ? NONFUNGIBLE_POSITION_MANAGER_ADDRESSES[chainId] : undefined
    )

    const allowedSlippage = useUserSlippageToleranceWithDefault(
        outOfRange ? ZERO_PERCENT : DEFAULT_ADD_IN_RANGE_SLIPPAGE_TOLERANCE
    )

    async function onAdd() {
        if (!chainId || !library || !account) return

        if (!positionManager || !baseCurrency || !quoteCurrency) {
            return
        }

        if (position && account && deadline) {
            const useNative = baseCurrency.isNative
                ? baseCurrency
                : quoteCurrency.isNative
                    ? quoteCurrency
                    : undefined

            const { calldata, value } =
                hasExistingPosition && tokenId
                    ? NonFunPosMan.addCallParameters(position, {
                        tokenId,
                        slippageTolerance: allowedSlippage,
                        deadline: deadline.toString(),
                        useNative
                    })
                    : NonFunPosMan.addCallParameters(position, {
                        slippageTolerance: allowedSlippage,
                        recipient: account,
                        deadline: deadline.toString(),
                        useNative,
                        createPool: noLiquidity
                    })

            const txn: { to: string; data: string; value: string } = {
                to: NONFUNGIBLE_POSITION_MANAGER_ADDRESSES[chainId],
                data: calldata,
                value
            }

            library
                .getSigner()
                .estimateGas(txn)
                .then((estimate) => {
                    const newTxn = {
                        ...txn,
                        gasLimit: calculateGasMargin(chainId, estimate),
                        gasPrice: gasPrice * GAS_PRICE_MULTIPLIER
                    }

                    return library
                        .getSigner()
                        .sendTransaction(newTxn)
                        .then((response: TransactionResponse) => {
                            addTransaction(response, {
                                summary: noLiquidity
                                    ? t`Create pool and add ${baseCurrency?.symbol}/${quoteCurrency?.symbol} liquidity`
                                    : t`Add ${baseCurrency?.symbol}/${quoteCurrency?.symbol} liquidity`
                            })
                            setTxHash(response.hash)
                        })
                })
                .catch((error) => {
                    console.error('Failed to send transaction', error)
                    // we only care if the error is something _other_ than the user rejected the tx
                    if (error?.code !== 4001) {
                        console.error(error)
                    }
                })
        } else {
            return
        }
    }

    const handleCurrencySelect = useCallback(
        (currencyNew: Currency, currencyIdOther?: string): (string | undefined)[] => {
            const currencyIdNew = currencyId(currencyNew, chainId || 137)

            let chainSymbol

            if (chainId === 137) {
                chainSymbol = 'MATIC'
            }

            if (currencyIdNew === currencyIdOther) {
                // not ideal, but for now clobber the other if the currency ids are equal
                return [currencyIdNew, undefined]
            } else {
                // prevent weth + eth
                const isETHOrWETHNew =
                    currencyIdNew === chainSymbol ||
                    (chainId !== undefined && currencyIdNew === WMATIC_EXTENDED[chainId]?.address)
                const isETHOrWETHOther =
                    currencyIdOther !== undefined &&
                    (currencyIdOther === chainSymbol ||
                        (chainId !== undefined &&
                            currencyIdOther === WMATIC_EXTENDED[chainId]?.address))

                if (isETHOrWETHNew && isETHOrWETHOther) {
                    return [currencyIdNew, undefined]
                } else {
                    return [currencyIdNew, currencyIdOther]
                }
            }
        },
        [chainId]
    )

    const handleCurrencyASelect = useCallback((currencyANew: Currency) => {
        const [idA, idB] = handleCurrencySelect(currencyANew, currencyIdB)
        if (idB === undefined) {
            history.push(`/add/${idA}`)
        } else {
            history.push(`/add/${idA}/${idB}`)
        }
    }, [handleCurrencySelect, currencyIdB, history])

    const handleCurrencyBSelect = useCallback((currencyBNew: Currency) => {
        const [idB, idA] = handleCurrencySelect(currencyBNew, currencyIdA)
        if (idA === undefined) {
            history.push(`/add/${idB}`)
        } else {
            history.push(`/add/${idA}/${idB}`)
        }
    }, [handleCurrencySelect, currencyIdA, history])

    const mustCreateSeparately = noLiquidity && chainId !== SupportedChainId.POLYGON

    // get value and prices at ticks
    const { [Bound.LOWER]: tickLower, [Bound.UPPER]: tickUpper } = ticks
    const { [Bound.LOWER]: priceLower, [Bound.UPPER]: priceUpper } = pricesAtTicks

    const { getDecrementLower, getIncrementLower, getDecrementUpper, getIncrementUpper, getSetFullRange } = useRangeHopCallbacks(
        baseCurrency ?? undefined,
        quoteCurrency ?? undefined,
        dynamicFee,
        tickLower,
        tickUpper,
        pool
    )

    // we need an existence check on parsed amounts for single-asset deposits
    const showApprovalA = approvalA !== ApprovalState.APPROVED && !!parsedAmounts[Field.CURRENCY_A]
    const showApprovalB = approvalB !== ApprovalState.APPROVED && !!parsedAmounts[Field.CURRENCY_B]

    return (
        <>
            <NavLink className={'f f-ac c-p mb-1'} to={'/pool'}>
                <ArrowLeft size={16} />
                <span className={'ml-05'}>Back to pools</span>
            </NavLink>
            <Card isDark classes={'p-2 br-24'}>
                <div className={'flex-s-between mb-1 fs-15'}>
                    <span className={'b'}>Add Liquidity</span>
                    <SettingsTab placeholderSlippage={allowedSlippage} />
                </div>
                <div className={'flex-s-between'}>
                    <Card isDark={false} classes={'p-1 br-12 w-100 mr-1'}>
                        <CurrencyDropdown
                            centered={true}
                            value={formattedAmounts[Field.CURRENCY_A]}
                            onUserInput={onFieldAInput}
                            hideInput={true}
                            onMax={() => {
                                onFieldAInput(maxAmounts[Field.CURRENCY_A]?.toExact() ?? '')
                            }}
                            onCurrencySelect={handleCurrencyASelect}
                            showMaxButton={!atMaxAmounts[Field.CURRENCY_A]}
                            currency={currencies[Field.CURRENCY_A] as WrappedCurrency}
                            id='add-liquidity-input-tokena'
                            showCommonBases
                            showBalance={false}
                            pool={'page'}
                            disabled={false}
                            swap={false}
                            shallow={false}
                        />
                        <div className={'f f-ac fs-085 pos-r'}>
                            <span className={'b mr-05'}>{`${noLiquidity ? 'Initial' : 'Current'} Fee:`}</span>
                            <span className={'f f-ac'}>
                                <span className={'mr-05 c-p'}>{noLiquidity ? '0.05' : dynamicFee / 10000}%</span>
                                <span className={''} onMouseEnter={() => setShowTech(true)} onMouseLeave={() => setShowTech(false)}>
                                    <Info size={'0.85rem'} stroke={'var(--light-gray)'} />
                                    {showTech ?
                                        <Card isDark classes={'pos-a z-10 p-1 br-8 f c bg-dg t-m6'}>
                                            <span className={'b'}>📄 Tech paper</span>
                                            <div className={'fs-085 mt-05'}>Check out how dynamic fee is calculated</div>
                                            <a className={'btn primary w-100 f f-jc pv-025 mt-05 br-8'} download='Algebra-Tech-Paper.pdf' href={PDFAlgebra}>
                                                <Download size={16} color={'white'} />
                                                <span className={'ml-05'}>Download .PDF</span>
                                            </a>
                                        </Card>
                                        : null
                                    }
                                </span>
                            </span>
                        </div>
                    </Card>
                    <Card isDark={false} classes={'p-1 br-12 w-100 ml-1'}>
                        <CurrencyDropdown
                            centered={true}
                            value={formattedAmounts[Field.CURRENCY_B]}
                            hideInput={true}
                            onUserInput={onFieldBInput}
                            onCurrencySelect={handleCurrencyBSelect}
                            onMax={() => {
                                onFieldBInput(maxAmounts[Field.CURRENCY_B]?.toExact() ?? '')
                            }}
                            showMaxButton={!atMaxAmounts[Field.CURRENCY_B]}
                            currency={currencies[Field.CURRENCY_B] as WrappedCurrency}
                            id='add-liquidity-input-tokenb'
                            showCommonBases
                            showBalance={false}
                            page={'page'}
                            swap={false}
                            shallow={false}
                            disabled={false} />
                        {price && baseCurrency && quoteCurrency && !noLiquidity ? (
                            <div className={'f f-ac fs-085'}>
                                <span className={'b mr-05'}>Current Price:</span>
                                <div className={'f f-ac'}>
                                    <span className={'mr-025 c-p'}>
                                        {invertPrice ? price.invert().toSignificant(6) : price.toSignificant(6)}
                                    </span>
                                    <span>{quoteCurrency?.symbol} per {baseCurrency.symbol}</span>
                                </div>
                            </div>
                        ) : (
                            <div className={'f f-ac fs-085'}>
                                <span className={'b mr-05'}>Starting Price</span>
                                <div className={'f'}>
                                    <span className={'mr-05'}>
                                        <StyledInput
                                            style={{
                                                textAlign:
                                                    window.innerWidth < 501
                                                        ? 'left'
                                                        : 'right',
                                                backgroundColor: 'transparent'
                                            }}
                                            className='start-price-input'
                                            value={startPriceTypedValue}
                                            onUserInput={onStartPriceInput}
                                        />
                                    </span>
                                    <span>{quoteCurrency?.symbol} per {baseCurrency?.symbol}</span>
                                </div>
                            </div>
                        )}
                    </Card>
                </div>
                {baseCurrency && quoteCurrency && account ? (
                    <>
                        {account && (
                            <>
                                <div style={!startPriceTypedValue && !price ? { opacity: 0.2, pointerEvents: 'none', userSelect: 'none' } : {}}>
                                    <Title>
                                        {outOfRange && (
                                            <Warning>
                                                <span>Warning: Price is out of range</span>
                                            </Warning>
                                        )}
                                        {invalidRange && (
                                            <Error>
                                                Error: The Min price must be lower than the Max
                                                price
                                            </Error>
                                        )}
                                        Price Range
                                    </Title>
                                    <PriceRangeWrapper>
                                        {price &&
                                            baseCurrency &&
                                            quoteCurrency &&
                                            !noLiquidity && (
                                                <PriceRangeChart>
                                                    <LiquidityChartRangeInput
                                                        currencyA={baseCurrency ?? undefined}
                                                        currencyB={quoteCurrency ?? undefined}
                                                        feeAmount={dynamicFee}
                                                        ticksAtLimit={ticksAtLimit}
                                                        price={
                                                            price
                                                                ? parseFloat(
                                                                    (invertPrice
                                                                            ? price.invert()
                                                                            : price
                                                                    ).toSignificant(8)
                                                                )
                                                                : undefined
                                                        }
                                                        priceLower={priceLower}
                                                        priceUpper={priceUpper}
                                                        onLeftRangeInput={onLeftRangeInput}
                                                        onRightRangeInput={onRightRangeInput}
                                                        interactive={!hasExistingPosition}
                                                    />
                                                </PriceRangeChart>
                                            )}
                                        <PriceRangeInputs initial={!!noLiquidity}>
                                            <RangeSelector
                                                priceLower={priceLower}
                                                priceUpper={priceUpper}
                                                getDecrementLower={getDecrementLower}
                                                getIncrementLower={getIncrementLower}
                                                getDecrementUpper={getDecrementUpper}
                                                getIncrementUpper={getIncrementUpper}
                                                onLeftRangeInput={onLeftRangeInput}
                                                onRightRangeInput={onRightRangeInput}
                                                currencyA={baseCurrency}
                                                currencyB={quoteCurrency}
                                                feeAmount={dynamicFee}
                                                ticksAtLimit={ticksAtLimit}
                                                initial={!!noLiquidity}
                                                disabled={!startPriceTypedValue && !price}
                                            />
                                            {!noLiquidity && (
                                                <FullRangeButton
                                                    onClick={() => {
                                                        getSetFullRange()

                                                        ReactGA.event({
                                                            category: 'Liquidity',
                                                            action: 'Full Range Clicked'
                                                        })
                                                    }}
                                                >
                                                    Full Range
                                                </FullRangeButton>
                                            )}
                                        </PriceRangeInputs>
                                    </PriceRangeWrapper>
                                </div>

                                <div
                                    style={
                                        (!startPriceTypedValue && !price) ||
                                        !priceLower ||
                                        !priceUpper ||
                                        invalidRange
                                            ? {
                                                opacity: 0.2,
                                                userSelect: 'none',
                                                pointerEvents: 'none'
                                            }
                                            : {}
                                    }
                                >
                                    <Title>Deposit Amounts</Title>
                                    <TokenPair
                                        style={{
                                            height: `${window.innerWidth < 500 ? '' : '145px'}`,
                                            marginBottom: '1rem'
                                        }}
                                    >
                                        <TokenItem highPrice={false}>
                                            {!atMaxAmounts[Field.CURRENCY_A] &&
                                                !depositADisabled && (
                                                    <MaxButton
                                                        disabled={
                                                            (!startPriceTypedValue && !price) ||
                                                            !priceLower ||
                                                            !priceUpper ||
                                                            invalidRange
                                                        }
                                                        onClick={() =>
                                                            onFieldAInput(
                                                                maxAmounts[
                                                                    Field.CURRENCY_A
                                                                    ]?.toFixed() ?? ''
                                                            )
                                                        }
                                                    >
                                                        Max
                                                    </MaxButton>
                                                )}
                                            <CurrencyDropdown
                                                value={formattedAmounts[Field.CURRENCY_A]}
                                                onUserInput={onFieldAInput}
                                                hideInput={true}
                                                onMax={() => {
                                                    onFieldAInput(
                                                        maxAmounts[
                                                            Field.CURRENCY_A
                                                            ]?.toFixed() ?? ''
                                                    )
                                                }}
                                                onCurrencySelect={handleCurrencyASelect}
                                                showMaxButton={!atMaxAmounts[Field.CURRENCY_A]}
                                                currency={currencies[Field.CURRENCY_A] as WrappedCurrency}
                                                id='add-liquidity-input-tokena'
                                                showCommonBases
                                                showBalance={true}
                                                disabled={
                                                    (!startPriceTypedValue && !price) ||
                                                    !priceLower ||
                                                    !priceUpper
                                                }
                                                shallow={true}
                                                page={'pool'}
                                                swap={false} />
                                            <TokenItemBottomInputWrapper>
                                                <div style={{ width: '100%' }}>
                                                    <CurrencyInputPanel
                                                        value={formattedAmounts[Field.CURRENCY_A]}
                                                        onUserInput={onFieldAInput}
                                                        onMax={() => {
                                                            onFieldAInput(
                                                                maxAmounts[
                                                                    Field.CURRENCY_A
                                                                    ]?.toExact() ?? ''
                                                            )
                                                        }}
                                                        showMaxButton={!atMaxAmounts[Field.CURRENCY_A]}
                                                        currency={currencies[Field.CURRENCY_A] as WrappedCurrency}
                                                        id='add-liquidity-input-tokena'
                                                        fiatValue={usdcValues[Field.CURRENCY_A]}
                                                        showCommonBases
                                                        locked={depositADisabled}
                                                        hideCurrency={true}
                                                        hideInput={depositADisabled}
                                                        disabled={
                                                            (!startPriceTypedValue && !price) ||
                                                            !priceLower ||
                                                            !priceUpper ||
                                                            invalidRange
                                                        }
                                                        shallow={true}
                                                        page={'pool'}
                                                        swap={false} />
                                                </div>
                                                {showApprovalA && !depositADisabled && (
                                                    <ApproveButtonContainer
                                                        style={{
                                                            display: 'flex',
                                                            width: '100%'
                                                        }}
                                                    >
                                                        <ApproveButton
                                                            onClick={approveACallback}
                                                            disabled={
                                                                approvalA ===
                                                                ApprovalState.PENDING
                                                            }
                                                        >
                                                            {approvalA === ApprovalState.PENDING
                                                                ? `Approving ${
                                                                    currencies[
                                                                        Field.CURRENCY_A
                                                                        ]?.symbol
                                                                }`
                                                                : `Approve ${
                                                                    currencies[
                                                                        Field.CURRENCY_A
                                                                        ]?.symbol
                                                                }`}
                                                        </ApproveButton>
                                                    </ApproveButtonContainer>
                                                )}
                                            </TokenItemBottomInputWrapper>
                                        </TokenItem>
                                        <TokenItem highPrice={false}>
                                            {!atMaxAmounts[Field.CURRENCY_B] &&
                                                !depositBDisabled && (
                                                    <MaxButton
                                                        disabled={
                                                            (!startPriceTypedValue && !price) ||
                                                            !priceLower ||
                                                            !priceUpper ||
                                                            invalidRange
                                                        }
                                                        onClick={() =>
                                                            onFieldBInput(
                                                                maxAmounts[
                                                                    Field.CURRENCY_B
                                                                    ]?.toExact() ?? ''
                                                            )
                                                        }
                                                    >
                                                        Max
                                                    </MaxButton>
                                                )}
                                            <CurrencyDropdown
                                                swap={false}
                                                value={formattedAmounts[Field.CURRENCY_B]}
                                                hideInput={true}
                                                onUserInput={onFieldBInput}
                                                onCurrencySelect={handleCurrencyBSelect}
                                                currency={currencies[Field.CURRENCY_B] as WrappedCurrency}
                                                id='add-liquidity-input-tokenb'
                                                showCommonBases
                                                showBalance={true}
                                                disabled={
                                                    (!startPriceTypedValue && !price) ||
                                                    !priceLower ||
                                                    !priceUpper ||
                                                    invalidRange
                                                }
                                                shallow={true}
                                                page={'pool'}
                                                showMaxButton={false} />
                                            <TokenItemBottomInputWrapper>
                                                <div style={{ width: '100%' }}>
                                                    <CurrencyInputPanel
                                                        value={formattedAmounts[Field.CURRENCY_B]}
                                                        onUserInput={onFieldBInput}
                                                        onMax={() => {
                                                            onFieldBInput(
                                                                maxAmounts[
                                                                    Field.CURRENCY_B
                                                                    ]?.toExact() ?? ''
                                                            )
                                                        }}
                                                        showMaxButton={!atMaxAmounts[Field.CURRENCY_B]}
                                                        fiatValue={usdcValues[Field.CURRENCY_B]}
                                                        currency={currencies[Field.CURRENCY_B] as WrappedCurrency}
                                                        id='add-liquidity-input-tokenb'
                                                        showCommonBases
                                                        locked={depositBDisabled}
                                                        hideCurrency={true}
                                                        hideInput={depositBDisabled}
                                                        showBalance={true}
                                                        disabled={
                                                            (!startPriceTypedValue && !price) ||
                                                            !priceLower ||
                                                            !priceUpper ||
                                                            invalidRange
                                                        }
                                                        shallow={true}
                                                        page={'pool'}
                                                        swap={false}
                                                    />
                                                </div>
                                                {showApprovalB && !depositBDisabled && (
                                                    <ApproveButtonContainer
                                                        style={{
                                                            display: 'flex',
                                                            width: '100%'
                                                        }}
                                                    >
                                                        <ApproveButton
                                                            onClick={approveBCallback}
                                                            disabled={
                                                                approvalB ===
                                                                ApprovalState.PENDING
                                                            }
                                                        >
                                                            {approvalB === ApprovalState.PENDING
                                                                ? `Approving ${
                                                                    currencies[
                                                                        Field.CURRENCY_B
                                                                        ]?.symbol
                                                                }`
                                                                : `Approve ${
                                                                    currencies[
                                                                        Field.CURRENCY_B
                                                                        ]?.symbol
                                                                }`}
                                                        </ApproveButton>
                                                    </ApproveButtonContainer>
                                                )}
                                            </TokenItemBottomInputWrapper>
                                        </TokenItem>
                                    </TokenPair>
                                </div>
                            </>
                        )}
                        <ButtonsWrapper>
                            {errorMessage &&
                                (startPriceTypedValue || price) &&
                                priceLower &&
                                priceUpper &&
                                !invalidRange && (
                                    <Error
                                        style={{
                                            position: 'relative',
                                            padding: '14px 16px',
                                            marginRight: '1rem',
                                            top: 0
                                        }}
                                    >
                                        {errorMessage}
                                    </Error>
                                )}
                            <AddLiquidityButton
                                onClick={() => {
                                    onAdd()
                                }}
                                disabled={
                                    (!isValid &&
                                        !!parsedAmounts[Field.CURRENCY_A] &&
                                        !!parsedAmounts[Field.CURRENCY_B]) ||
                                    mustCreateSeparately ||
                                    !isValid ||
                                    (approvalA !== ApprovalState.APPROVED &&
                                        !depositADisabled) ||
                                    (approvalB !== ApprovalState.APPROVED && !depositBDisabled)
                                }
                            >
                                Add Liquidity
                            </AddLiquidityButton>
                        </ButtonsWrapper>
                    </>
                ) : account ? (
                    <PairNotSelectedMock>Please select a token pair</PairNotSelectedMock>
                ) : (
                    <PairNotSelectedMock>
                        <AddLiquidityButton
                            onClick={toggleWalletModal}
                            style={{ margin: 'auto' }}
                        >
                            Connect Wallet
                        </AddLiquidityButton>
                    </PairNotSelectedMock>
                )}
            </Card>
        </>
    )
}
