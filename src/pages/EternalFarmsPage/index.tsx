import { Contract } from 'ethers'
import { useEffect, useState } from 'react'
import { Frown } from 'react-feather'
import styled from 'styled-components/macro'
import CurrencyLogo from '../../components/CurrencyLogo'
import DoubleCurrencyLogo from '../../components/DoubleLogo'
import Loader from '../../components/Loader'
import Modal from '../../components/Modal'
import { StakeModal } from '../../components/StakeModal'
import { StakerEventCard } from '../../components/StakerEventCard'
import { FARMING_CENTER } from '../../constants/addresses'
import { FarmingType, useStakerHandlers } from '../../hooks/useStakerHandlers'

const PageWrapper = styled.div`
  width: 100%;
`

const EternalFarmsList = styled.ul`
  padding: 0;
  margin: 0;
  list-style-type: none;
`

const EternalFarmsItem = styled.li`
  padding: 1rem;
  border-radius: 1rem;
  margin-bottom: 1rem;
  background-color: rgba(60, 97, 126, 0.5);
`

const EternalFarmsHeader = styled.div`
  display: flex;
  margin-bottom: 1rem;

  & > span {
    text-transform: uppercase;
    font-size: 14px;
    font-weight: 600;
    width: calc(100% / 4);
  }
`
const EternalFarmsBody = styled.div`
  display: flex;

  & > span {
    width: calc(100% / 4);
  }
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

const PoolWrapper = styled.span`
  display: flex;
`

const PoolWrapperLogos = styled.div`
  display: flex;
  margin-right: 10px;
`
const FarmButton = styled.button`
  border: none;
  padding: 8px 10px;
  background-color: #36f;
  color: white;
  font-weight: 600;
  font-family: 'Montserrat';
  border-radius: 6px;
`

const LoadingMock = styled.div`
  width: 100%;
  min-height: 600px;
  display: flex;
  align-items: center;
  justify-content: center;
`

export default function EternalFarmsPage({
  data,
  refreshing,
  fetchHandler,
}: {
  data: any
  refreshing: boolean
  fetchHandler: () => any
}) {
  const [modalForPool, setModalForPool] = useState(null)
  const [tokenId, setTokenId] = useState('')

  useEffect(() => {
    fetchHandler()
  }, [])

  return (
    <>
      <Modal isOpen={modalForPool} onHide={() => setModalForPool(null)} onDismiss={() => console.log()}>
        {modalForPool && (
          <>
            <StakeModal
              event={modalForPool}
              closeHandler={() => setModalForPool(null)}
              farmingType={FarmingType.ETERNAL}
            ></StakeModal>
          </>
        )}
      </Modal>
      <PageWrapper>
        {refreshing ? (
          <EmptyMock>
            <Loader stroke='white' size='20px' />
          </EmptyMock>
        ) : !data || data.length === 0 ? (
          <EmptyMock>
            <div>No eternal farms</div>
            <Frown size={35} stroke={'white'} />
          </EmptyMock>
        ) : !refreshing && data.length != 0 ? (
          <EternalFarmsList>
            {data.map((event, i) => (
              <StakerEventCard
                key={i}
                stakeHandler={() => setModalForPool(event)}
                refreshing={refreshing}
                now={0}
                eternal
                event={event}
              ></StakerEventCard>
            ))}
          </EternalFarmsList>
        ) : null}
      </PageWrapper>
    </>
  )
}
