import { Currency } from '@uniswap/sdk-core'
import useUSDCPrice from 'hooks/useUSDCPrice';
import { PriceFormats } from 'pages/NewAddLiquidity/components/PriceFomatToggler';
import StartingPrice from 'pages/NewAddLiquidity/components/StartingPrice';
import { StepTitle } from 'pages/NewAddLiquidity/components/StepTitle';
import { USDPrices } from 'pages/NewAddLiquidity/components/USDPrices';
import { Check } from 'react-feather';
import { IDerivedMintInfo, useV3MintActionHandlers } from 'state/mint/v3/hooks';


import './index.scss'

interface IInitialPrice {
    currencyA: Currency | undefined
    currencyB: Currency | undefined,
    mintInfo: IDerivedMintInfo,
    isCompleted: boolean
    priceFormat: PriceFormats
}


export function InitialPrice({currencyA, currencyB, mintInfo, isCompleted, priceFormat}: IInitialPrice) {

    const currencyAUSDC = useUSDCPrice(currencyA ?? undefined);
    const currencyBUSDC = useUSDCPrice(currencyB ?? undefined);

    const { onStartPriceInput } = useV3MintActionHandlers(mintInfo.noLiquidity);

    return <div className='initial-price-wrapper f c'>
            <StepTitle title={'Set initial price'} isCompleted={isCompleted} step={2} />
            <div className='f'>
                <StartingPrice currencyA={currencyA} currencyB={currencyB} startPriceHandler={onStartPriceInput} />
                <div className="ml-2">
                    {currencyA && currencyB && <USDPrices currencyA={currencyA} currencyB={currencyB} currencyAUSDC={currencyAUSDC} currencyBUSDC={currencyBUSDC} priceFormat={priceFormat} />}
                </div>
            </div>
    </div>;
}
