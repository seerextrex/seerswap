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
  ${({ theme }) => theme.mediaWidth.upToSmall`{
    min-width: 100%;
  }`}
`
const MenuWrapper = styled.div`
  width: 100%;
  margin-bottom: 2rem;

  ${({ theme }) => theme.mediaWidth.upToSmall`{
    min-width: calc(100% + 3rem);
    overflow: auto;
    margin: 0 -2rem 1rem -2rem;
    padding: 0 1rem;
  }`}
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

  const { fetchInfoPools, fetchInfoTokens, blocksFetched } = useInfoSubgraph() || {}

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
                  ></PageTitle>
                  <InfoPools
                    data={fetchInfoPools?.poolsResult}
                    refreshing={fetchInfoPools?.poolsLoading}
                    fetchHandler={() => fetchInfoPools?.fetchInfoPoolsFn(true)}
                    blocksFetched={blocksFetched}
                  ></InfoPools>
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
                  ></PageTitle>
                  <InfoTokens
                    data={fetchInfoTokens?.tokensResult}
                    refreshing={fetchInfoTokens?.tokensLoading}
                    fetchHandler={() => fetchInfoTokens?.fetchInfoTokensFn(true)}
                    blocksFetched={blocksFetched}
                  ></InfoTokens>
                </Route>
              </Switch>
            </MainContentWrapper>
          </InnerWrapper>
        </InnerWrapper>
      </PageWrapper>
    </>
  )
}
