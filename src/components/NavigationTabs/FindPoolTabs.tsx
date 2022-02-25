import { ActiveText, StyledArrowLeft, Tabs } from './styled'
import { RowBetween } from '../Row'
import { Link as HistoryLink } from 'react-router-dom'
import { Trans } from '@lingui/macro'

interface FindPoolTabsProps {
    origin: string
}

export function FindPoolTabs({ origin }: FindPoolTabsProps) {
    return (
        <Tabs>
            <RowBetween style={{ padding: '1rem 1rem 0 1rem' }}>
                <HistoryLink to={origin}>
                    <StyledArrowLeft />
                </HistoryLink>
                <ActiveText>
                    <Trans>Migrate from SushiSwap or QuickSwap</Trans>
                </ActiveText>
                <div />
            </RowBetween>
        </Tabs>
    )
}
