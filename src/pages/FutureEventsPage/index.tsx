import { Trans } from '@lingui/react'
import { useEffect, useState } from 'react'
import { ArrowLeft, ArrowRight, Frown } from 'react-feather'
import { Link } from 'react-router-dom'
import styled from 'styled-components/macro'
import { StakerEventCard } from '../../components/StakerEventCard'
import { useIncentiveSubgraph } from '../../hooks/useIncentiveSubgraph'
import { useChunkedRows } from '../../utils/chunkForRows'
import Modal from '../../components/Modal'
import { StakeModal } from '../../components/StakeModal'

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

function isFuture(startTime: number, now: number) {
  return startTime * 1000 > now
}

export function FutureEventsPage({
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

  const chunked = useChunkedRows(data, 3)

  const [modalForPool, setModalForPool] = useState(null)

  return (
    <>
      <Modal isOpen={modalForPool}>
        {modalForPool && <StakeModal event={modalForPool} closeHandler={() => setModalForPool(null)}></StakeModal>}
      </Modal>
      <PageWrapper>
        <EventsCards>
          {!data && refreshing ? (
            <EventsCards>
              <EventsCardsRow>
                {[0, 1, 2].map((el, i) => (
                  <StakerEventCard skeleton key={i}></StakerEventCard>
                ))}
              </EventsCardsRow>
              <EventsCardsRow>
                {[0, 1].map((el, i) => (
                  <StakerEventCard skeleton key={i}></StakerEventCard>
                ))}
              </EventsCardsRow>
            </EventsCards>
          ) : data && data.length !== 0 && !data.every((el) => el.startTime < Math.round(Date.now() / 1000)) ? (
            chunked.map((el, i) => (
              <EventsCardsRow key={i}>
                {el.map(
                  (event, j) =>
                    isFuture(event.startTime, now) && (
                      <StakerEventCard
                        key={j}
                        stakeHandler={() => setModalForPool(event)}
                        refreshing={refreshing}
                        now={now}
                        event={event}
                      ></StakerEventCard>
                    )
                )}
              </EventsCardsRow>
            ))
          ) : data && (data.length === 0 || data.every((el) => el.startTime < Math.round(Date.now() / 1000))) ? (
            <EmptyMock>
              <div>No future events</div>
              <Frown size={35} stroke={'white'} />
            </EmptyMock>
          ) : null}
        </EventsCards>
      </PageWrapper>
    </>
  )
}
