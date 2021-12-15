import { Trans } from '@lingui/macro'
import { ButtonPrimary } from 'components/Button'
import { AutoColumn } from 'components/Column'
import { SwapPoolTabs } from 'components/NavigationTabs'
import PositionList from 'components/PositionList'
import { RowBetween, RowFixed } from 'components/Row'
import { SwitchLocaleLink } from 'components/SwitchLocaleLink'
import { useV3Positions } from 'hooks/useV3Positions'
import { useActiveWeb3React } from 'hooks/web3'
import { useContext, useMemo } from 'react'
import { Inbox } from 'react-feather'
import { Link } from 'react-router-dom'
import { useWalletModalToggle } from 'state/application/hooks'
import { useUserHideClosedPositions } from 'state/user/hooks'
import styled, { ThemeContext } from 'styled-components/macro'
import { TYPE } from 'theme'
import { PositionDetails } from 'types/position'
import { LoadingRows } from './styleds'
import { Helmet } from 'react-helmet'
import { usePreviousNonEmptyArray } from '../../hooks/usePrevious'
import { darken } from 'polished'
import Loader from '../../components/Loader'

const PageWrapper = styled(AutoColumn)`
  max-width: 870px;
  margin: auto;
  width: 100%;

  ${({ theme }) => theme.mediaWidth.upToMedium`
    max-width: 800px;
  `};

  ${({ theme }) => theme.mediaWidth.upToSmall`
    max-width: 500px;
  `};
`
const TitleRow = styled(RowBetween)`
  color: ${({ theme }) => theme.text2};
  ${({ theme }) => theme.mediaWidth.upToSmall`
    flex-wrap: wrap;
    gap: 12px;
    width: 100%;
  `};
`
const ButtonRow = styled(RowFixed)`
  & > *:not(:last-child) {
    margin-left: 8px;
  }

  ${({ theme }) => theme.mediaWidth.upToSmall`
    width: 100%;
    flex-direction: row;
    justify-content: space-between;
    flex-direction: row-reverse;
  `};
`
const NoLiquidity = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: auto;
  max-width: 300px;
  min-height: 25vh;
`
const ResponsiveButtonPrimary = styled(ButtonPrimary)`
  border-radius: 12px;
  padding: 6px 8px;
  width: fit-content;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    flex: 1 1 auto;
    width: 100%;
  `};
`

const MigrateButtonPrimary = styled(ResponsiveButtonPrimary)`
  margin-right: 1rem;
  &:hover {
    // background-color: ${({ theme }) => darken('0.2', theme.winterMainButton)};
  }
`

const MainContentWrapper = styled.main`
  padding: 30px 40px;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  color: white;
  padding-top: 0;
`

const ShowInactiveToggle = styled.div`
  display: flex;
  align-items: center;
  justify-items: end;
  grid-column-gap: 4px;
  padding: 0 8px;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    margin-bottom: 12px;
  `};
`

const ResponsiveRow = styled(RowFixed)`
  justify-content: space-between;
  width: 100%;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    flex-direction: column-reverse;
  `};
`

export default function Pool() {
  const { account, chainId } = useActiveWeb3React()
  const toggleWalletModal = useWalletModalToggle()

  const theme = useContext(ThemeContext)
  const [userHideClosedPositions, setUserHideClosedPositions] = useUserHideClosedPositions()

  const { positions, loading: positionsLoading } = useV3Positions(account)

  const [openPositions, closedPositions] = positions?.reduce<[PositionDetails[], PositionDetails[]]>(
    (acc, p) => {
      acc[p.liquidity?.isZero() ? 1 : 0].push(p)
      return acc
    },
    [[], []]
  ) ?? [[], []]

  const filteredPositions = [...openPositions, ...(userHideClosedPositions ? [] : closedPositions)]
  const prevFilteredPositions = usePreviousNonEmptyArray(filteredPositions)
  const _filteredPositions = useMemo(() => {
    if (filteredPositions.length === 0 && prevFilteredPositions) {
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
        <AutoColumn gap="lg" justify="center" style={{ backgroundColor: theme.winterBackground, borderRadius: '50px' }}>
          <AutoColumn gap="lg" style={{ width: '100%' }}>
            <TitleRow style={{ marginTop: '1rem', padding: '1rem 40px' }} padding={'0'}>
              <TYPE.body fontSize={'20px'}>
                <Trans>Pools Overview</Trans>
              </TYPE.body>
              <ButtonRow>
                <MigrateButtonPrimary
                  id="join-pool-button"
                  as={Link}
                  style={{ color: theme.winterMainButton, color: 'white' }}
                  to={`/migrate`}
                >
                  <Trans>Migrate Pool</Trans>
                </MigrateButtonPrimary>
                <ResponsiveButtonPrimary
                  id="join-pool-button"
                  style={{ background: theme.winterMainButton, color: 'white' }}
                  as={Link}
                  to={`/add/${chainSymbol}`}
                >
                  + <Trans>New Position</Trans>
                </ResponsiveButtonPrimary>
              </ButtonRow>
            </TitleRow>
            <MainContentWrapper>
              {positionsLoading ? (
                // <LoadingRows>
                //   <div />
                //   <div />
                //   <div />
                //   <div />
                //   <div />
                //   <div />
                //   <div />
                //   <div />
                //   <div />
                //   <div />
                //   <div />
                //   <div />
                // </LoadingRows>
                <Loader style={{ margin: 'auto' }} stroke="white" size={'30px'} />
              ) : _filteredPositions && _filteredPositions.length > 0 ? (
                <PositionList positions={_filteredPositions} />
              ) : (
                <NoLiquidity>
                  <TYPE.body color={'white'} textAlign="center">
                    {/* <Inbox size={48} strokeWidth={1} style={{ marginBottom: '.5rem' }} /> */}
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
                        color: 'white',
                      }}
                      onClick={toggleWalletModal}
                    >
                      <Trans>Connect a wallet</Trans>
                    </ButtonPrimary>
                  )}
                </NoLiquidity>
              )}
            </MainContentWrapper>

            <ResponsiveRow>
              {closedPositions.length > 0 ? (
                <ShowInactiveToggle>
                  <label>
                    <TYPE.body onClick={() => setUserHideClosedPositions(!userHideClosedPositions)}>
                      <Trans>Show closed positions</Trans>
                    </TYPE.body>
                  </label>
                  <input
                    type="checkbox"
                    onClick={() => setUserHideClosedPositions(!userHideClosedPositions)}
                    checked={!userHideClosedPositions}
                  />
                </ShowInactiveToggle>
              ) : null}
            </ResponsiveRow>
          </AutoColumn>
        </AutoColumn>
      </PageWrapper>
      <SwitchLocaleLink />
    </>
  )
}
