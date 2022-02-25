import { Trans } from '@lingui/macro'
import { ButtonsWrapper, StakerSmallMaxButton } from './styled'

interface RealStakerRangeButtonsProps {
    onPercentSelect: any
    balance: any
}

export default function RealStakerRangeButtons({ onPercentSelect, balance }: RealStakerRangeButtonsProps) {
    return (
        <ButtonsWrapper>
            <div>
                <StakerSmallMaxButton onClick={() => onPercentSelect(25)} style={{ marginLeft: 0 }} disabled={+balance === 0}>
                    <Trans>25%</Trans>
                </StakerSmallMaxButton>
                <StakerSmallMaxButton onClick={() => onPercentSelect(50)} disabled={+balance === 0}>
                    <Trans>50%</Trans>
                </StakerSmallMaxButton>
                <StakerSmallMaxButton onClick={() => onPercentSelect(75)} disabled={+balance === 0}>
                    <Trans>75%</Trans>
                </StakerSmallMaxButton>
                <StakerSmallMaxButton onClick={() => onPercentSelect(100)} disabled={+balance === 0}>
                    <Trans>MAX</Trans>
                </StakerSmallMaxButton>
            </div>
        </ButtonsWrapper>
    )
}
