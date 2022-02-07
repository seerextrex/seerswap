import { AutoColumn } from 'components/Column'
import { SwitchLocaleLink } from 'components/SwitchLocaleLink'
import { useEffect, useMemo, useState } from 'react'
import { Link, Route, Switch, Redirect, useRouteMatch } from 'react-router-dom'
import styled, { keyframes } from 'styled-components/macro'
import { useIncentiveSubgraph } from '../../hooks/useIncentiveSubgraph'
import { AlignJustify, Award, ExternalLink } from 'react-feather'
import { Checkbox } from './Checkbox'
import { NONFUNGIBLE_POSITION_MANAGER_ADDRESSES } from '../../constants/addresses'
import { useActiveWeb3React } from '../../hooks/web3'
import { useAllTransactions } from '../../state/transactions/hooks'
import Loader from '../../components/Loader'
import { StakingMenu } from '../../components/StakingMenu'
import { StakerMyRewards } from '../../components/StakerMyRewards'
import { StakerMyStakes } from '../../components/StakerMyStakes'
import { FutureEventsPage } from '../FutureEventsPage'
import { CurrentEventsPage } from '../CurrentEventsPage'
import { PageTitle } from '../../components/PageTitle'
import { RedirectDuplicateTokenStakingIds } from './redirects'
import { getCountdownTime } from '../../utils/time'
import { useWalletModalToggle } from '../../state/application/hooks'
import { deviceSizes } from '../styled'

import { Helmet } from 'react-helmet'
import StakerCreateEventRequest from '../../components/StakerCreateEventRequest'

import WoodenSlob from '../../assets/svg/wooden-slob.svg'
import WoodenRope from '../../assets/svg/wooden-rope.svg'
import EternalFarmsPage from '../EternalFarmsPage'

const PageWrapper = styled(AutoColumn)`
  max-width: 1000px;
  width: 100%;

  ${({ theme }) => theme.mediaWidth.upToMedium`
    max-width: 800px;
  `};

  ${({ theme }) => theme.mediaWidth.upToSmall`
    max-width: 600px;
  `};
`
const InnerWrapper = styled(AutoColumn)`
  ${({ theme }) => theme.mediaWidth.upToSmall`{
    min-width: 100%;
  }`}
`
const MainContentWrapper = styled.div`
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  ${({ theme }) => theme.mediaWidth.upToSmall`{
    min-width: 100%;
  }`}
`
const MenuWrapper = styled.div`
  width: 100%;
  margin-bottom: 2rem;
  margin-top: 2rem;
  padding: 0 1rem;
  font-weight: 600;
  z-index: 999;

  background-color: #b38280;
  border: 4px solid #713937;
  border-radius: 16px;
  background-image: url(${WoodenSlob});
  background-repeat: repeat;
  background-size: 27px 40px;
  position: relative;

  &::before,
  &::after {
    content: '';
    // background-image: url(${WoodenRope});
    width: 5px;
    height: 51px;
    position: absolute;
    top: -55px;
  }

  &::before {
    left: 40%;
  }

  &::after {
    right: 40%;
  }

  ${({ theme }) => theme.mediaWidth.upToSmall`{
    overflow: auto;
    width: 100%;
  }`}

  ${({ theme }) => theme.mediaWidth.upToLarge`

  &::before,
&::after {
  display: none;
}
`}
`

const BodyWrapper = styled.div`
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.winterBackground};
  padding: 2rem;
  border-radius: 20px;
  margin-bottom: 5rem;

  ${({ theme }) => theme.mediaWidth.upToSmall`
  `}
`

const MockScreen = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 300px;

  & > p {
    text-align: center;
  }
`

const ConnectWalletButton = styled.button`
  border: 1px solid ${({ theme }) => theme.winterMainButton};
  background-color: ${({ theme }) => theme.winterMainButton};
  color: white;
  padding: 8px 12px;
  font-size: 16px;
  border-radius: 10px;
`

export default function StakingPage() {
  const { account } = useActiveWeb3React()

  const {
    fetchRewards,
    fetchCurrentEvents,
    fetchFutureEvents,
    fetchTransferredPositions,
    fetchEternalFarms,
    fetchPositionsOnEternalFarmings,
  } = useIncentiveSubgraph() || {}

  const [now, setNow] = useState(Date.now())

  useEffect(() => {
    const timeNow = setInterval(() => setNow(Date.now()), 1000)
    return () => {
      clearInterval(timeNow)
    }
  }, [])

  const { path } = useRouteMatch()

  const toggleWalletModal = useWalletModalToggle()

  return (
    <>
      <Helmet>
        <title>Algebra — Farming</title>
      </Helmet>
      <PageWrapper>
        <InnerWrapper gap="lg" justify="center">
          <InnerWrapper gap="lg" style={{ width: '100%', gridRowGap: '0' }}>
            <MainContentWrapper>
              <MenuWrapper>
                <StakingMenu></StakingMenu>
              </MenuWrapper>
              <BodyWrapper>
                <Switch>
                  <Route exact path={`${path}`}>
                    <Redirect to={`${path}/${account ? 'farms' : 'infinite-farms'}`} />
                  </Route>
                  <Route exact path={`${path}/rewards`}>
                    <Helmet>
                      <title>Algebra — Farming • My rewards</title>
                    </Helmet>
                    <PageTitle
                      title={'My rewards'}
                      refreshHandler={() => (account ? fetchRewards?.fetchRewardsFn(true) : undefined)}
                      isLoading={fetchRewards?.rewardsLoading}
                    ></PageTitle>
                    {account ? (
                      <StakerMyRewards
                        data={fetchRewards?.rewardsResult}
                        refreshing={fetchRewards?.rewardsLoading}
                        fetchHandler={() => fetchRewards?.fetchRewardsFn(true)}
                      ></StakerMyRewards>
                    ) : (
                      <MockScreen>
                        <Award size={40} stroke={'white'}></Award>
                        <p>Connect your account to view rewards</p>
                        <ConnectWalletButton onClick={toggleWalletModal}>Connect Wallet</ConnectWalletButton>
                      </MockScreen>
                    )}
                  </Route>
                  <Route exact path={`${path}/farms`}>
                    <Helmet>
                      <title>Algebra — Farming • My farms</title>
                    </Helmet>
                    <PageTitle
                      title={'My farms'}
                      refreshHandler={() =>
                        account ? fetchTransferredPositions?.fetchTransferredPositionsFn(true) : undefined
                      }
                      isLoading={fetchTransferredPositions?.transferredPositionsLoading}
                    ></PageTitle>
                    {account ? (
                      <StakerMyStakes
                        data={fetchTransferredPositions?.transferredPositions}
                        refreshing={fetchTransferredPositions?.transferredPositionsLoading}
                        fetchHandler={() => {
                          fetchTransferredPositions?.fetchTransferredPositionsFn(true)
                          // fetchPositionsOnEternalFarmings?.fetchPositionsOnEternalFarmingFn(true)
                        }}
                        now={now}
                      ></StakerMyStakes>
                    ) : (
                      <MockScreen>
                        <AlignJustify size={40} stroke={'white'}></AlignJustify>
                        <p>Connect your account to view farms</p>
                        <ConnectWalletButton onClick={toggleWalletModal}>Connect Wallet</ConnectWalletButton>
                      </MockScreen>
                    )}
                  </Route>
                  <Route exact path={`${path}/future-events`}>
                    <Helmet>
                      <title>Algebra — Farming • Future events</title>
                    </Helmet>
                    <PageTitle
                      title={'Future events'}
                      refreshHandler={() => fetchFutureEvents?.fetchFutureEventsFn(true)}
                      isLoading={fetchFutureEvents?.futureEventsLoading}
                    ></PageTitle>
                    <FutureEventsPage
                      data={fetchFutureEvents?.futureEvents}
                      refreshing={fetchFutureEvents?.futureEventsLoading}
                      fetchHandler={() => fetchFutureEvents?.fetchFutureEventsFn(true)}
                      now={now}
                    ></FutureEventsPage>
                  </Route>
                  <Route exact path={`${path}/current-events`}>
                    <Helmet>
                      <title>Algebra — Farming • Current events</title>
                    </Helmet>
                    <PageTitle
                      title={'Current events'}
                      refreshHandler={() => fetchCurrentEvents?.fetchCurrentEventsFn(true)}
                      isLoading={fetchCurrentEvents?.currentEventsLoading}
                    ></PageTitle>
                    <CurrentEventsPage
                      data={fetchCurrentEvents?.currentEvents}
                      refreshing={fetchCurrentEvents?.currentEventsLoading}
                      fetchHandler={() => fetchCurrentEvents?.fetchCurrentEventsFn(true)}
                      now={now}
                    ></CurrentEventsPage>
                  </Route>
                  <Route exact path={`${path}/infinite-farms`}>
                    <Helmet>
                      <title>Algebra — Farming • Infinite farms</title>
                    </Helmet>
                    <PageTitle
                      title={'Infinite farms'}
                      refreshHandler={() => fetchCurrentEvents?.fetchCurrentEventsFn(true)}
                      isLoading={fetchCurrentEvents?.currentEventsLoading}
                    ></PageTitle>
                    <EternalFarmsPage
                      data={fetchEternalFarms?.eternalFarms}
                      refreshing={fetchEternalFarms?.eternalFarmsLoading}
                      fetchHandler={() => fetchEternalFarms.fetchEternalFarmsFn(true)}
                    ></EternalFarmsPage>
                  </Route>
                </Switch>
              </BodyWrapper>
            </MainContentWrapper>
          </InnerWrapper>
        </InnerWrapper>
      </PageWrapper>
      <SwitchLocaleLink />
    </>
  )
}
