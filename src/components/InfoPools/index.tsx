import { useEffect } from 'react'
import InfoPoolsTable from '../InfoPoolsTable'

import styled from 'styled-components/macro'
import Loader from '../Loader'

const PageWrapper = styled.div`
  max-width: ${({ wide }) => (wide ? '880px' : '480px')};
  width: 100%;
  background-color: ${({ theme }) => theme.winterBackground};

  padding: ${({ wide }) => (wide ? '30px 40px' : '0')};
  ${({ theme }) => theme.mediaWidth.upToMedium`
    max-width: 720px!important;
    overflow-x: scroll;
    border-radius: 8px;
  `};
`

const MockLoading = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 500px;
`

export function InfoPools({
  data,
  refreshing,
  fetchHandler,
  blocksFetched,
}: {
  data: any
  refreshing: boolean
  fetchHandler: () => any
  blocksFetched: boolean
}) {
  useEffect(() => {
    if (blocksFetched) {
      fetchHandler()
    }
  }, [blocksFetched])

  if (!data)
    return (
      <MockLoading>
        <Loader stroke={'white'} size={'25px'} />
      </MockLoading>
    )

  return (
    <PageWrapper style={{ maxWidth: '100%' }}>
      <InfoPoolsTable poolDatas={data}></InfoPoolsTable>
    </PageWrapper>
  )
}
