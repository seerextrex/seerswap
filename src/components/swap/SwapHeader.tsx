import { Trans } from '@lingui/macro'
import SettingsTab from '../Settings'
import { Percent } from '@uniswap/sdk-core'

export default function SwapHeader({
    allowedSlippage,
    dynamicFee = null
}: {
    allowedSlippage: Percent
    dynamicFee: number | null
}) {
    return (
        <div className={'flex-s-between w-100 mb-1'}>
            <div className={'flex-s-between w-100'}>
                <span className={'mr-05 b fs-125'}>
                    <Trans>Swap</Trans>
                </span>
                {dynamicFee &&
                    <span className={'bg-p pv-025 ph-05 br-8'}>
                        <Trans>{`Fee is ${dynamicFee / 10000}%`}</Trans>
                    </span>
                }
            </div>
            <SettingsTab placeholderSlippage={allowedSlippage} />
        </div>
    )
}
