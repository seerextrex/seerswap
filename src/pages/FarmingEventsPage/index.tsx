import { Trans } from '@lingui/react'
import { useEffect, useState } from 'react'
import { ArrowLeft, ArrowRight, Frown } from 'react-feather'
import { Link } from 'react-router-dom'
import styled from 'styled-components/macro'
import { StakerEventCard } from '../../components/StakerEventCard'
import { useIncentiveSubgraph } from '../../hooks/useIncentiveSubgraph'
import { useChunkedRows } from '../../utils/chunkForRows'
import { deviceSizes } from '../styled'
import { StakeModal } from '../../components/StakeModal'
import { FarmingType } from '../../hooks/useStakerHandlers'
import Modal from '../../components/Modal'

const PageWrapper = styled.div`
  width: 100%;
`
const EventsCards = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`

const EventsCardsRow = styled.div`
  display: flex;
  width: 100%;
  margin-bottom: 1rem;

  & > * {
    &:not(:last-of-type) {
      margin-right: 1rem;
    }
  }

  ${({ theme }) => theme.mediaWidth.upToSmall`{
    flex-direction: column;
    margin-bottom: unset;
    display: none;
    &:first-of-type {
      display: flex;
    }
  }`}
`

const EmptyMock = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 400px;

  & > * {
    margin-bottom: 1rem;
  }
`

function isActive(endTime: number, now: number) {
  return endTime * 1000 > now
}

export function FarmingEventsPage({
  data,
  now,
  refreshing,
  fetchHandler,
}: {
  data: any
  now: number
  refreshing: boolean
  fetchHandler: () => any
}) {
  useEffect(() => {
    fetchHandler()
  }, [])

  const [modalForPool, setModalForPool] = useState(null)
  const chunked = useChunkedRows(data, 3)
  return (
    <PageWrapper>
      <Modal isOpen={Boolean(modalForPool)} onHide={() => setModalForPool(null)} onDismiss={() => console.log()}>
        {modalForPool && (
          <>
            <StakeModal
              event={modalForPool}
              closeHandler={() => setModalForPool(null)}
              farmingType={FarmingType.FINITE}
            />
          </>
        )}
      </Modal>
      <EventsCards>
        {!data ? (
          <EventsCards>
            <EventsCardsRow>
              {[0, 1, 2].map((el, i) => (
                <StakerEventCard active skeleton key={i}/>
              ))}
            </EventsCardsRow>
            <EventsCardsRow>
              {[0, 1].map((el, i) => (
                <StakerEventCard active skeleton key={i}/>
              ))}
            </EventsCardsRow>
          </EventsCards>
        ) : data && data.length !== 0 ? (
          chunked?.map((el, i) => (
            <EventsCardsRow key={i}>
              {el.map(
                (event, j) =>
                    <StakerEventCard refreshing={refreshing} active={event.active} key={j} now={now} event={event} stakeHandler={() => {
                      setModalForPool(event)
                    }}/>
              )}
            </EventsCardsRow>
          ))
        ) : data && data.length === 0 ? (
          <EmptyMock>
            <div>No farming events</div>
            <Frown size={35} stroke={'white'} />
          </EmptyMock>
        ) : null}
      </EventsCards>
    </PageWrapper>
  )
}
