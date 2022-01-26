import { useEffect } from 'react'
import styled from 'styled-components/macro'

export default function EternalFarmsPage({
    data,
    refreshing,
    fetchHandler
}: {
    data: any,
    refreshing: boolean,
    fetchHandler: () => any
}) {

    useEffect(() => {
        fetchHandler()
    }, [])
    
    return <div></div>
}