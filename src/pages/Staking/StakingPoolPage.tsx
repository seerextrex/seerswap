import { select, Trans } from '@lingui/macro'
import { ButtonPrimary } from 'components/Button'
import { AutoColumn } from 'components/Column'
import PositionList from 'components/PositionList'
import { RowBetween, RowFixed } from 'components/Row'
import { SwitchLocaleLink } from 'components/SwitchLocaleLink'
import { pointer } from 'd3'
import { useCallback, useContext, useEffect, useState } from 'react'
import { Inbox } from 'react-feather'
import { Link, useParams } from 'react-router-dom'
import styled, { ThemeContext } from 'styled-components/macro'
import { borderRadius, flex, flexDirection } from 'styled-system'
import { TYPE } from 'theme'
import { LoadingRows } from './styleds'
import StakingModal from '../../components/StakingModal'
import { useIncentiveSubgraph } from '../../hooks/useIncentiveSubgraph'

const PageWrapper = styled(AutoColumn)`
  max-width: 870px;
  width: 100%;

  ${({ theme }) => theme.mediaWidth.upToMedium`
    max-width: 800px;
  `};

  ${({ theme }) => theme.mediaWidth.upToSmall`
    max-width: 500px;
  `};
`
const TitleRow = styled(RowBetween)`
  color: ${({ theme }) => theme.text2};
  ${({ theme }) => theme.mediaWidth.upToSmall`
    flex-wrap: wrap;
    gap: 12px;
    width: 100%;
  `};
`
const ButtonRow = styled(RowFixed)`
  & > *:not(:last-child) {
    margin-left: 8px;
  }

  ${({ theme }) => theme.mediaWidth.upToSmall`
    width: 100%;
    flex-direction: row;
    justify-content: space-between;
    flex-direction: row-reverse;
  `};
`
const NoLiquidity = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: auto;
  max-width: 300px;
  min-height: 25vh;
`
const ResponsiveButtonPrimary = styled(ButtonPrimary)`
  border-radius: 12px;
  padding: 6px 8px;
  width: fit-content;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    flex: 1 1 auto;
    width: 100%;
  `};
`

const MainContentWrapper = styled.div`
  border-radius: 20px;
  display: flex;
  flex-wrap: wrap;
`

const NavigationBar = styled.div`
  display: flex;
`

const NavigationBarItem = styled.div`
  flex: 1;
  margin-top: 1rem;
`

const TokenCard = styled.div`
  display: flex;
  flex-direction: column;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  margin-right: 0.5rem;
  width: calc(50% - 0.5rem);
  background-color: ${({ theme }) => theme.bg0};
  &:nth-child(2n) {
    margin-right: 0;
    margin-left: 0.5rem;
  }
`
const TokenCardColumn = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
`
const TokenLogo = styled.div`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background:-moz-linear-gradient(128deg, rgba(255, 0, 99, 1) 0%, rgba(255, 187, 0, 1) 17%, rgba(249, 255, 0, 1) 33%, rgba(76, 175, 80, 1) 48%, rgba(0, 188, 212, 1) 64%, rgba(76, 83, 175, 1) 84%, rgba(238, 130, 238, 1) 100%); 
  background:-webkit-linear-gradient(128deg, rgba(255, 0, 99, 1) 0%, rgba(255, 187, 0, 1) 17%, rgba(249, 255, 0, 1) 33%, rgba(76, 175, 80, 1) 48%, rgba(0, 188, 212, 1) 64%, rgba(76, 83, 175, 1) 84%, rgba(238, 130, 238, 1) 100%);
  background:-o-linear-gradient(128deg, rgba(255, 0, 99, 1) 0%, rgba(255, 187, 0, 1) 17%, rgba(249, 255, 0, 1) 33%, rgba(76, 175, 80, 1) 48%, rgba(0, 188, 212, 1) 64%, rgba(76, 83, 175, 1) 84%, rgba(238, 130, 238, 1) 100%);
  filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#EE82EE', endColorstr='#FF0063', GradientType=0 );
  background:-ms-linear-gradient(128deg, rgba(255, 0, 99, 1) 0%, rgba(255, 187, 0, 1) 17%, rgba(249, 255, 0, 1) 33%, rgba(76, 175, 80, 1) 48%, rgba(0, 188, 212, 1) 64%, rgba(76, 83, 175, 1) 84%, rgba(238, 130, 238, 1) 100%);
  background:linear-gradient(128deg, rgba(255, 0, 99, 1) 0%, rgba(255, 187, 0, 1) 17%, rgba(249, 255, 0, 1) 33%, rgba(76, 175, 80, 1) 48%, rgba(0, 188, 212, 1) 64%, rgba(76, 83, 175, 1) 84%, rgba(238, 130, 238, 1) 100%);
  border: 2px solid #a431ce;
  margin-right: 1rem;
}
`

const ShowInactiveToggle = styled.div`
  display: flex;
  align-items: center;
  justify-items: end;
  grid-column-gap: 4px;
  padding: 0 8px;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    margin-bottom: 12px;
  `};
`

const ResponsiveRow = styled(RowFixed)`
  justify-content: space-between;
  width: 100%;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    flex-direction: column-reverse;
  `};
`

export default function StakingPoolPage() {
  const { currencyIdA, currencyIdB } = useParams() as { currencyIdA: string; currencyIdB: string }

  const incentives = [
    {
      timeStart: '10.08.21',
      timeEnd: '21.08.21',
    },
    {
      timeStart: '13.08.21',
      timeEnd: '25.08.21',
    },
    {
      timeStart: '16.08.21',
      timeEnd: '30.08.21',
    },
    {
      timeStart: '10.08.21',
      timeEnd: '21.08.21',
    },
    {
      timeStart: '13.08.21',
      timeEnd: '25.08.21',
    },
    {
      timeStart: '16.08.21',
      timeEnd: '30.08.21',
    },
    {
      timeStart: '10.08.21',
      timeEnd: '21.08.21',
    },
    {
      timeStart: '13.08.21',
      timeEnd: '25.08.21',
    },
    {
      timeStart: '16.08.21',
      timeEnd: '30.08.21',
    },
  ]

  // const _incentives = useIncentiveSubgraph()

  const [selectedIncentive, setSelectedIncentive] = useState(0)

  const selectIncentive = useCallback(
    (index) => {
      setSelectedIncentive(index)
    },
    [selectedIncentive]
  )

  const [isModal, setModal] = useState(false)

  const closeModal = useCallback(() => {
    setModal(false)
  }, [isModal])

  const theme = useContext(ThemeContext)

  return (
    <>
      <PageWrapper>
        <AutoColumn gap="lg" justify="center">
          <AutoColumn gap="lg" style={{ width: '100%' }}>
            <TitleRow style={{ marginTop: '1rem' }} padding={'0'}>
              <TYPE.body fontSize={'20px'}>
                <Link
                  style={{ textDecoration: 'none', width: 'fit-content', marginBottom: '0.5rem', marginRight: '1rem' }}
                  to="/farming"
                >
                  <Trans>← Back to Farming</Trans>
                </Link>
                <Trans>{`You have ${4} ${currencyIdA} / ${currencyIdB} positions`}</Trans>
              </TYPE.body>
              <ButtonRow>
                <div style={{ marginRight: '1rem' }}>{`Rewards: 0`}</div>
                <ResponsiveButtonPrimary
                  id="claim-rewards"
                  style={{ background: '#0f2e40', color: '#4cc1d5' }}
                  as={Link}
                  to={'/'}
                >
                  <Trans>Claim</Trans>
                </ResponsiveButtonPrimary>
              </ButtonRow>
            </TitleRow>

            <div>
              <div>
                <Trans>Incentives</Trans>
              </div>
              <div>
                <ul style={{ listStyleType: 'none', padding: 0, marginBottom: 0 }}>
                  {incentives.map((el, i) => (
                    <li
                      onClick={() => selectIncentive(i)}
                      style={{
                        display: 'inline-block',
                        cursor: 'pointer',
                        padding: '4px 6px',
                        marginRight: '10px',
                        marginBottom: '10px',
                        borderRadius: '6px',
                        backgroundColor: i === selectedIncentive ? '#426de1' : '#262f48',
                      }}
                      key={i}
                    >{`${el.timeStart} — ${el.timeEnd}`}</li>
                  ))}
                </ul>
              </div>
            </div>

            <MainContentWrapper>
              {[1, 2, 3, 4].map((el, i) => (
                <TokenCard key={i}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>{`# ${i + 1}`}</span>
                    <Link style={{ color: '#2172e5', fontSize: '14px', textDecoration: 'none' }} to={'/'}>
                      <span>
                        <Trans>View position</Trans>
                      </span>
                    </Link>
                  </div>
                  <div style={{ textTransform: 'uppercase', color: 'white', fontSize: '13px', marginTop: '1rem' }}>
                    <Trans>Your Reward</Trans>
                  </div>
                  <div style={{ marginTop: '1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center' }}>
                    <TokenLogo></TokenLogo>
                    <span style={{ fontSize: '30px' }}>20 LGB</span>
                  </div>
                  <div style={{ width: '100%', borderTop: '1px solid #24214a', paddingTop: '1rem', display: 'flex' }}>
                    <button
                      onClick={() => setModal(true)}
                      style={{
                        cursor: 'pointer',
                        width: '100%',
                        border: 'none',
                        marginRight: '10px',
                        padding: '8px 16px',
                        borderRadius: '8px',
                        color: '#4cc1d5',
                        backgroundColor: '#0f2e40',
                      }}
                    >
                      Deposit
                    </button>
                    <button
                      style={{
                        cursor: 'pointer',
                        width: '100%',
                        border: 'none',
                        padding: '8px 16px',
                        borderRadius: '8px',
                        color: 'white',
                        backgroundColor: theme.winterMainButton,
                      }}
                    >
                      Collect
                    </button>
                  </div>
                  {/* <TokenCardColumn>{20}</TokenCardColumn>
                  <TokenCardColumn></TokenCardColumn>
                  <TokenCardColumn style={{ justifyContent: 'flex-end' }}>
                   
                  </TokenCardColumn> */}
                </TokenCard>
              ))}
            </MainContentWrapper>
          </AutoColumn>
        </AutoColumn>
      </PageWrapper>
      {isModal ? <StakingModal modal={isModal} closeModalCallback={closeModal}></StakingModal> : null}
      <SwitchLocaleLink />
    </>
  )
}
