import { useEffect } from 'react'
import InfoTokensTable from '../InfoTokensTable'
import Loader from '../Loader'
import {PageWrapper, MockLoading} from '../InfoPools/styled'

export function InfoTokens({
  data,
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
      <InfoTokensTable tokenDatas={data}/>
    </PageWrapper>
  )
}
