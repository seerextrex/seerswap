import { Trans } from '@lingui/macro'
import { Link as HistoryLink, useLocation } from 'react-router-dom'
import { Percent } from '@uniswap/sdk-core'
import Row, { RowBetween } from '../Row'
import SettingsTab from '../Settings'
import { useAppDispatch } from 'state/hooks'
import { resetMintState } from 'state/mint/actions'
import { resetMintState as resetMintV3State } from 'state/mint/v3/actions'
import { TYPE } from 'theme'
import { ReactNode } from 'react'
import { Box } from 'rebass'
import { ActiveText, StyledArrowLeft, StyledHistoryLink, StyledNavLink, Tabs } from './styled'

export function SwapPoolTabs({ active }: { active: 'swap' | 'pool' }) {
    return (
        <Tabs style={{ marginBottom: '20px', display: 'none', padding: '1rem 1rem 0 1rem' }}>
            <StyledNavLink id={`swap-nav-link`} to={'/swap'} isActive={() => active === 'swap'}>
                <Trans>Swap</Trans>
            </StyledNavLink>
            <StyledNavLink id={`pool-nav-link`} to={'/pool'} isActive={() => active === 'pool'}>
                <Trans>Pool</Trans>
            </StyledNavLink>
        </Tabs>
    )
}

export function FindPoolTabs({ origin }: { origin: string }) {
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

export function AddRemoveTabs({
    adding,
    creating,
    defaultSlippage,
    positionID,
    children
}: {
    adding: boolean
    creating: boolean
    defaultSlippage: Percent
    positionID?: string | undefined
    showBackLink?: boolean
    children?: ReactNode | undefined
}) {
    // reset states on back
    const dispatch = useAppDispatch()
    const location = useLocation()

    // detect if back should redirect to v3 or v2 pool page
    const poolLink = location.pathname.includes('add/v2')
        ? '/pool/v2'
        : '/pool' + (!!positionID ? `/${positionID.toString()}` : '')

    return (
        <Tabs>
            <RowBetween style={{ padding: '1rem 40px 0 40px' }}>
                <StyledHistoryLink
                    to={poolLink}
                    onClick={() => {
                        if (adding) {
                            // not 100% sure both of these are needed
                            dispatch(resetMintState())
                            dispatch(resetMintV3State())
                        }
                    }}
                    flex={children ? '1' : undefined}
                >
                    <StyledArrowLeft stroke={'white'} />
                </StyledHistoryLink>
                <TYPE.mediumHeader
                    fontWeight={500}
                    fontSize={20}
                    style={{
                        flex: '1',
                        padding: '1rem 0',
                        margin: 'auto',
                        textAlign: children ? 'start' : 'center'
                    }}
                >
                    {creating ? (
                        <Trans>Create a pair</Trans>
                    ) : adding ? (
                        <Trans>Increase Liquidity</Trans>
                    ) : (
                        <Trans>Remove Liquidity</Trans>
                    )}
                </TYPE.mediumHeader>
                <Box style={{ marginRight: '.5rem' }}>{children}</Box>
                <SettingsTab placeholderSlippage={defaultSlippage} />
            </RowBetween>
        </Tabs>
    )
}

export function CreateProposalTabs() {
    return (
        <Tabs>
            <Row style={{ padding: '1rem 1rem 0 1rem' }}>
                <HistoryLink to='/vote'>
                    <StyledArrowLeft />
                </HistoryLink>
                <ActiveText style={{ marginLeft: 'auto', marginRight: 'auto' }}>Create
                    Proposal</ActiveText>
            </Row>
        </Tabs>
    )
}
