import { Trans } from '@lingui/macro'
import { ButtonsWrapper } from './styled'

interface RealStakerRangeButtonsProps {
    onPercentSelect: any
    balance: any
}

export default function RealStakerRangeButtons({ onPercentSelect, balance }: RealStakerRangeButtonsProps) {
    return (
        <ButtonsWrapper>
            <div>
                <button className={'btn primary button-percent pv-05 ph-1 br-8 mh-025'} onClick={() => onPercentSelect(25)} style={{ marginLeft: 0 }} disabled={+balance === 0}>
                    <Trans>25%</Trans>
                </button>
                <button className={'btn primary button-percent pv-05 ph-1 br-8 mh-025'} onClick={() => onPercentSelect(50)} disabled={+balance === 0}>
                    <Trans>50%</Trans>
                </button>
                <button className={'btn primary button-percent pv-05 ph-1 br-8 mh-025'} onClick={() => onPercentSelect(75)} disabled={+balance === 0}>
                    <Trans>75%</Trans>
                </button>
                <button className={'btn primary button-percent pv-05 ph-1 br-8 mh-025'} onClick={() => onPercentSelect(100)} disabled={+balance === 0}>
                    <Trans>MAX</Trans>
                </button>
            </div>
        </ButtonsWrapper>
    )
}
