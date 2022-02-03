import { InfoMenu } from '../../components/InfoMenu'
import { Helmet } from 'react-helmet'
import { Redirect, Route, Switch, useRouteMatch } from 'react-router'
import { useInfoSubgraph } from '../../hooks/subgraph/useInfoSubgraph'
import { InfoPools } from '../../components/InfoPools'
import { InfoTokens } from '../../components/InfoTokens'
import { PageTitle } from '../../components/PageTitle'
import PoolInfoPage from '../PoolInfoPage'
import { InfoTotalStats } from '../../components/InfoTotalStats'
import { PageWrapper, BodyWrapper, MainContentWrapper, InnerWrapper, MenuWrapper } from './styled'

function InfoPage() {
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
                <InfoMenu/>
              </MenuWrapper>
              <InfoTotalStats
                data={fetchTotalStats.totalStats}
                refreshHandler={() => {
                  fetchTotalStats.fetchTotalStatsFn()
                  fetchInfoPools.fetchInfoPoolsFn()}}
                isLoading={Boolean(fetchTotalStats.totalStatsLoading)}
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
                        refreshHandler={() => (blocksFetched ? fetchInfoPools?.fetchInfoPoolsFn() : undefined)}
                        isLoading={Boolean(fetchInfoPools?.poolsLoading)}
                      />
                      <InfoPools
                        data={fetchInfoPools?.poolsResult}
                        refreshing={Boolean(fetchInfoPools?.poolsLoading)}
                        fetchHandler={() => fetchInfoPools?.fetchInfoPoolsFn()}
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
                        refreshHandler={() => (blocksFetched ? fetchInfoTokens?.fetchInfoTokensFn() : undefined)}
                        isLoading={Boolean(fetchInfoTokens?.tokensLoading)}
                      />
                      <InfoTokens
                        data={fetchInfoTokens?.tokensResult}
                        refreshing={Boolean(fetchInfoTokens?.tokensLoading)}
                        fetchHandler={() => fetchInfoTokens?.fetchInfoTokensFn()}
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

export default InfoPage