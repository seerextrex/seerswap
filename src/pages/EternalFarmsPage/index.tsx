import { useEffect, useState } from 'react'
import styled from 'styled-components/macro'
import CurrencyLogo from '../../components/CurrencyLogo'
import DoubleCurrencyLogo from '../../components/DoubleLogo'
import Modal from '../../components/Modal'
import { StakeModal } from '../../components/StakeModal'

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

  useEffect(() => {
    fetchHandler()
  }, [])

  return (
    <>
      <Modal isOpen={modalForPool} onHide={() => setModalForPool(null)} onDismiss={() => console.log()}>
        {modalForPool && <StakeModal event={modalForPool} closeHandler={() => setModalForPool(null)}></StakeModal>}
      </Modal>
      <PageWrapper>
        {refreshing ? (
          <div>Loading</div>
        ) : !data || data.length === 0 ? (
          <div>No farms</div>
        ) : !refreshing && data.length != 0 ? (
          <EternalFarmsList>
            {data.map((farm, i) => (
              <EternalFarmsItem key={i}>
                <EternalFarmsHeader>
                  <span>Pool</span>
                  <span>Reward APR</span>
                  <span>Bonus Reward APR</span>
                  <span></span>
                </EternalFarmsHeader>
                <EternalFarmsBody>
                  <PoolWrapper>
                    <PoolWrapperLogos>
                      <CurrencyLogo
                        currency={{ address: farm.token0.id, symbol: farm.token0.symbol }}
                        size="35px"
                      ></CurrencyLogo>
                      <CurrencyLogo
                        currency={{ address: farm.token1.id, symbol: farm.token1.symbol }}
                        size={'35px'}
                      ></CurrencyLogo>
                    </PoolWrapperLogos>
                    <div>
                      <div>{farm.token0.symbol}</div>
                      <div>{farm.token1.symbol}</div>
                    </div>
                  </PoolWrapper>
                  <span>XXXX</span>
                  <span>XXXX</span>
                  <span>
                    <FarmButton onClick={() => setModalForPool(farm)}>Farm</FarmButton>
                  </span>
                </EternalFarmsBody>
              </EternalFarmsItem>
            ))}
          </EternalFarmsList>
        ) : null}
      </PageWrapper>
    </>
  )
}
