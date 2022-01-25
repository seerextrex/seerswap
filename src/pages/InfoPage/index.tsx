import { InfoMenu } from '../../components/InfoMenu'
import { Helmet } from 'react-helmet'
import { AutoColumn } from '../../components/Column'

import styled from 'styled-components/macro'
import { Redirect, Route, Switch, useRouteMatch } from 'react-router'
import { useActiveWeb3React } from '../../hooks/web3'
import { useInfoSubgraph } from '../../hooks/subgraph/useInfoSubgraph'
import { InfoPools } from '../../components/InfoPools'
import { InfoTokens } from '../../components/InfoTokens'
import { PageTitle } from '../../components/PageTitle'
import FeeChartRangeInput from '../../components/FeeChartRangeInput'
import PoolInfoPage from '../PoolInfoPage'

import WoodenSlob from '../../assets/svg/wooden-slob.svg'
import WoodenRope from '../../assets/svg/wooden-rope.svg'
import { useIsNetworkFailed } from '../../hooks/useIsNetworkFailed'
import { InfoTotalStats } from '../../components/InfoTotalStats'
import {useEffect} from "react"

const PageWrapper = styled(AutoColumn)`
  max-width: 995px;
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
  min-width: 100%;
`
const MenuWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  margin-bottom: 2rem;
  margin-top: 2rem;
  font-weight: 600;

  ${({ theme }) => theme.mediaWidth.upToSmall`{
    overflow: auto;
    width: 100%;
    margin-top: 1rem;
    margin-bottom: 1rem;
  }`}
`

const BodyWrapper = styled.div`
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.winterBackground};
  padding: 2rem 40px;
  border-radius: 20px;
  margin-bottom: 5rem;

  @media screen and (max-width: 1081px) {
    padding: 2rem 40px 4rem;
  }

  ${({ theme }) => theme.mediaWidth.upToSmall`
    padding: 1rem 12px;
  `}
`

const MockScreen = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 300px;
`

const ConnectWalletButton = styled.button`
  border: 1px solid ${({ theme }) => theme.winterMainButton};
  background-color: ${({ theme }) => theme.winterMainButton};
  color: white;
  padding: 8px 12px;
  font-size: 16px;
  border-radius: 10px;
`

export function InfoPage() {
  const { account } = useActiveWeb3React()

  const { path } = useRouteMatch()

  const { fetchInfoPools, fetchInfoTokens, fetchTotalStats, blocksFetched } = useInfoSubgraph() || {}

  return (
    <>
      <Helmet>
        <title>Algebra — Info</title>
      </Helmet>
      <PageWrapper>
        <InnerWrapper gap="lg" justify="center">
          <InnerWrapper gap="lg" style={{ width: '100%', gridRowGap: '0' }}>
            <MainContentWrapper>
              <MenuWrapper>
                <InfoMenu></InfoMenu>
              </MenuWrapper>
              <InfoTotalStats
                data={fetchTotalStats.totalStats}
                refreshHandler={() => {
                  fetchTotalStats.fetchTotalStatsFn()
                  fetchInfoPools.fetchInfoPoolsFn()}}
                isLoading={fetchTotalStats.totalStatsLoading}
                blocksFetched={blocksFetched}
                poolsStat={fetchInfoPools?.poolsResult}
              />
              <BodyWrapper>
                <Switch>
                  <Route exact path={`${path}`}>
                    <Redirect to={`${path}/pools`} />
                  </Route>
                  <Route exact path={`${path}/pools`}>
                    <Helmet>
                      <title>Algebra — Info • Pools</title>
                    </Helmet>
                    <PageTitle
                      title={'Pools'}
                      refreshHandler={() => (blocksFetched ? fetchInfoPools?.fetchInfoPoolsFn(true) : undefined)}
                      isLoading={fetchInfoPools?.poolsLoading}
                    />
                    <InfoPools
                      data={fetchInfoPools?.poolsResult}
                      refreshing={fetchInfoPools?.poolsLoading}
                      fetchHandler={() => fetchInfoPools?.fetchInfoPoolsFn(true)}
                      blocksFetched={blocksFetched}
                    />
                  </Route>
                  <Route exact path={`${path}/pools/:id`} component={PoolInfoPage} />
                  <Route exact path={`${path}/tokens`}>
                    <Helmet>
                      <title>Algebra — Info • Tokens</title>
                    </Helmet>
                    <PageTitle
                      title={'Tokens'}
                      refreshHandler={() => (blocksFetched ? fetchInfoTokens?.fetchInfoTokensFn(true) : undefined)}
                      isLoading={fetchInfoTokens?.tokensLoading}
                    />
                    <InfoTokens
                      data={fetchInfoTokens?.tokensResult}
                      refreshing={fetchInfoTokens?.tokensLoading}
                      fetchHandler={() => fetchInfoTokens?.fetchInfoTokensFn(true)}
                      blocksFetched={blocksFetched}
                    />
                  </Route>
                </Switch>
              </BodyWrapper>
            </MainContentWrapper>
          </InnerWrapper>
        </InnerWrapper>
      </PageWrapper>
    </>
  )
}
