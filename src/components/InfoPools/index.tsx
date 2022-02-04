import { useEffect } from 'react'
import InfoPoolsTable from '../InfoPoolsTable'
import Loader from '../Loader'
import { MockLoading, PageWrapper } from './styled'

interface InfoPoolsProps {
    data: any
    refreshing: boolean
    fetchHandler: () => any
    blocksFetched: boolean
}

export function InfoPools({ data, fetchHandler, blocksFetched }: InfoPoolsProps) {

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
            <InfoPoolsTable poolDatas={data} />
        </PageWrapper>
    )
}
