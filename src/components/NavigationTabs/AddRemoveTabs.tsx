import { Percent } from '@uniswap/sdk-core'
import { ReactNode } from 'react'
import { useAppDispatch } from '../../state/hooks'
import { useLocation } from 'react-router-dom'
import { StyledArrowLeft, StyledHistoryLink, Tabs } from './styled'
import { RowBetween } from '../Row'
import { resetMintState } from '../../state/mint/actions'
import { resetMintState as resetMintV3State } from '../../state/mint/v3/actions'
import { TYPE } from '../../theme'
import { Trans } from '@lingui/macro'
import { Box } from 'rebass'
import SettingsTab from '../Settings'

interface AddRemoveTabsProps {
    adding: boolean
    creating: boolean
    defaultSlippage: Percent
    positionID?: string | undefined
    showBackLink?: boolean
    children?: ReactNode | undefined
}

export function AddRemoveTabs({ adding, creating, defaultSlippage, positionID, children }: AddRemoveTabsProps) {
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
