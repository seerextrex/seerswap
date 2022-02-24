import { Trans } from '@lingui/macro'
import { ButtonPrimary } from 'components/Button'
import { AutoColumn } from 'components/Column'
import { SwapPoolTabs } from 'components/NavigationTabs'
import PositionList from 'components/PositionList'
import { SwitchLocaleLink } from 'components/SwitchLocaleLink'
import { useV3Positions } from 'hooks/useV3Positions'
import { useActiveWeb3React } from 'hooks/web3'
import { useContext, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useWalletModalToggle } from 'state/application/hooks'
import { useUserHideClosedPositions } from 'state/user/hooks'
import { ThemeContext } from 'styled-components/macro'
import { TYPE } from 'theme'
import { Helmet } from 'react-helmet'
import { usePreviousNonEmptyArray } from '../../hooks/usePrevious'
import Loader from '../../components/Loader'
import { ButtonRow, FilterPanelWrapper, MainContentWrapper, MigrateButtonPrimary, NoLiquidity, PageWrapper, ResponsiveButtonPrimary, TitleRow } from './styleds'
import FilterPanelItem from './FilterPanelItem'
import { PositionPool } from '../../models/interfaces'

export default function Pool() {
    const { account, chainId } = useActiveWeb3React()
    const toggleWalletModal = useWalletModalToggle()

    const theme = useContext(ThemeContext)
    const [userHideClosedPositions, setUserHideClosedPositions] = useUserHideClosedPositions()
    const [hideFarmingPositions, setHideFarmingPositions] = useState(false)

    const { positions, loading: positionsLoading } = useV3Positions(account)

    const [openPositions, closedPositions] = positions?.reduce<[PositionPool[], PositionPool[]]>(
        (acc, p) => {
            acc[p.liquidity?.isZero() ? 1 : 0].push(p)
            return acc
        },
        [[], []]
    ) ?? [[], []]

    const filters = [
        {
            title: 'Closed',
            method: setUserHideClosedPositions,
            checkValue: userHideClosedPositions
        },
        {
            title: 'Farming',
            method: setHideFarmingPositions,
            checkValue: hideFarmingPositions
        }
    ]

    const farmingPositions = useMemo(() => positions?.filter(el => el.onFarming), [positions])
    const inRangeWithOutFarmingPositions = useMemo(() => openPositions.filter(el => !el.onFarming), [openPositions])

    const filteredPositions = [
        ...inRangeWithOutFarmingPositions,
        ...(userHideClosedPositions ? [] : closedPositions),
        ...(hideFarmingPositions || !farmingPositions ? [] : farmingPositions)
    ]

    const prevFilteredPositions = usePreviousNonEmptyArray(filteredPositions)

    const _filteredPositions = useMemo(() => {
        if (filteredPositions.length === 0 && prevFilteredPositions && !hideFarmingPositions && !userHideClosedPositions) {
            return prevFilteredPositions
        }
        return filteredPositions
    }, [filteredPositions])

    const showConnectAWallet = Boolean(!account)

    let chainSymbol

    if (chainId === 137) {
        chainSymbol = 'MATIC'
    }

    return (
        <>
            <Helmet>
                <title>Algebra — Pool</title>
            </Helmet>
            <PageWrapper>
                <SwapPoolTabs active={'pool'} />
                <AutoColumn
                    gap='lg'
                    justify='center'
                    style={{
                        backgroundColor: theme.winterBackground,
                        borderRadius: '20px'
                    }}
                >
                    <AutoColumn gap='lg' style={{ width: '100%', gridRowGap: '0' }}>
                        <TitleRow padding={'0'}>
                            <TYPE.body fontSize={'20px'}>
                                <Trans>Pools Overview</Trans>
                            </TYPE.body>
                            <ButtonRow>
                                <MigrateButtonPrimary
                                    id='join-pool-button'
                                    as={Link}
                                    style={{ color: 'white' }}
                                    to={`/migrate`}
                                >
                                    <Trans>Migrate Pool</Trans>
                                </MigrateButtonPrimary>
                                <ResponsiveButtonPrimary
                                    id='join-pool-button'
                                    style={{ color: 'white' }}
                                    as={Link}
                                    to={`/add/${chainSymbol}`}
                                >
                                    + <Trans>New Position</Trans>
                                </ResponsiveButtonPrimary>
                            </ButtonRow>
                        </TitleRow>
                        <FilterPanelWrapper>
                            {filters.map((item, key) =>
                                <FilterPanelItem
                                    item={item}
                                    key={key}
                                />)}
                        </FilterPanelWrapper>
                        <MainContentWrapper>
                            {positionsLoading ? (
                                <Loader style={{ margin: 'auto' }} stroke='white' size={'30px'} />
                            ) : _filteredPositions && _filteredPositions.length > 0 ? (
                                <PositionList positions={_filteredPositions} />
                            ) : (
                                <NoLiquidity>
                                    <TYPE.body color={'white'} textAlign='center'>
                                        <div>
                                            <Trans>You do not have any liquidity positions.</Trans>
                                        </div>
                                    </TYPE.body>
                                    {showConnectAWallet && (
                                        <ButtonPrimary
                                            style={{
                                                marginTop: '2em',
                                                padding: '8px 16px',
                                                background: theme.winterMainButton,
                                                color: 'white'
                                            }}
                                            onClick={toggleWalletModal}
                                        >
                                            <Trans>Connect Wallet</Trans>
                                        </ButtonPrimary>
                                    )}
                                </NoLiquidity>
                            )}
                        </MainContentWrapper>
                    </AutoColumn>
                </AutoColumn>
            </PageWrapper>
            <SwitchLocaleLink />
        </>
    )
}
