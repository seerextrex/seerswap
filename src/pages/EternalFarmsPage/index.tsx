import { useEffect, useState } from 'react'
import { Frown } from 'react-feather'
import Loader from '../../components/Loader'
import Modal from '../../components/Modal'
import { StakeModal } from '../../components/StakeModal'
import { StakerEventCard } from '../../components/StakerEventCard'
import { FarmingType } from '../../models/enums'
import './index.scss'

export default function EternalFarmsPage({ data, refreshing, fetchHandler }: {
    data: any
    refreshing: boolean
    fetchHandler: () => any
}) {
    const [modalForPool, setModalForPool] = useState(null)

    useEffect(() => {
        fetchHandler()
    }, [])

    return (
        <>
            <Modal isOpen={!!modalForPool} onHide={() => setModalForPool(null)} onDismiss={() => console.log()}>
                {modalForPool && (
                    <StakeModal
                        event={modalForPool}
                        closeHandler={() => setModalForPool(null)}
                        farmingType={FarmingType.ETERNAL}
                    />
                )}
            </Modal>
            {refreshing ? (
                <div className={'eternal-page__loader'}>
                    <Loader stroke='white' size='20px' />
                </div>
            ) : !data || data.length === 0 ? (
                <div className={'eternal-page__loader'}>
                    <div>No infinite farms</div>
                    <Frown size={35} stroke={'white'} />
                </div>
            ) : !refreshing && data.length !== 0 ? (
                <div className={'eternal-page__row mb-1 w-100'}>
                    {data.map((event: any, j: number) => (
                        <StakerEventCard
                            key={j}
                            stakeHandler={() => setModalForPool(event)}
                            refreshing={refreshing}
                            now={0}
                            eternal
                            event={event}
                        />
                    ))}
                </div>
            ) : null}
        </>
    )
}
