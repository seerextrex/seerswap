import { useEffect } from 'react'
import InfoPoolsTable from '../InfoPoolsTable'
import Loader from '../Loader'
import { MockLoading, PageWrapper } from './styled'

export function InfoPools({
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
      <InfoPoolsTable poolDatas={data}/>
    </PageWrapper>
  )
}
