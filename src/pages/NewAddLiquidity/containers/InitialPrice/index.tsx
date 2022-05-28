import { Currency } from '@uniswap/sdk-core'
import { Check } from 'react-feather';
import { IDerivedMintInfo } from 'state/mint/v3/hooks';


import './index.scss'

interface IInitialPrice {
    currencyA: Currency | undefined
    currencyB: Currency | undefined,
    mintInfo: IDerivedMintInfo,
    isCompleted: boolean
}


export function InitialPrice({currencyA, currencyB, mintInfo, isCompleted}: IInitialPrice) {
    return <div className='initial-price-wrapper f c'>
            <div className="f f-ac mb-2">
                <div className={`add-liquidity-page__step-circle ${isCompleted ? "done" : ""} f f-ac f-jc`}>{isCompleted ? <Check stroke={"white"} strokeWidth={3} size={15} /> : "2"}</div>
                <div className="add-liquidity-page__step-title ml-1">Set initial price</div>
            </div>
            <div className='f'>
                <div>
                    <div>
                        <span className='initial-price__autofetched'>✨ Price were auto-fetched</span>
                    </div>
                </div>
                <div>side</div>
            </div>
    </div>;
}
