import { Trans } from '@lingui/macro'
import { AutoColumn } from 'components/Column'
import { SwitchLocaleLink } from 'components/SwitchLocaleLink'
import { useCallback, useContext, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ThemeContext } from 'styled-components/macro'
import { TYPE } from 'theme'
import StakingModal from '../../components/StakingModal'
import {
    ButtonRow,
    MainContentWrapper,
    PageWrapper,
    ResponsiveButtonPrimary,
    TitleRow,
    TokenCard,
    TokenLogo
} from './styled'

export default function StakingPoolPage() {
    const { currencyIdA, currencyIdB } = useParams() as { currencyIdA: string; currencyIdB: string }

    const incentives = [
        {
            timeStart: '10.08.21',
            timeEnd: '21.08.21'
        },
        {
            timeStart: '13.08.21',
            timeEnd: '25.08.21'
        },
        {
            timeStart: '16.08.21',
            timeEnd: '30.08.21'
        },
        {
            timeStart: '10.08.21',
            timeEnd: '21.08.21'
        },
        {
            timeStart: '13.08.21',
            timeEnd: '25.08.21'
        },
        {
            timeStart: '16.08.21',
            timeEnd: '30.08.21'
        },
        {
            timeStart: '10.08.21',
            timeEnd: '21.08.21'
        },
        {
            timeStart: '13.08.21',
            timeEnd: '25.08.21'
        },
        {
            timeStart: '16.08.21',
            timeEnd: '30.08.21'
        }
    ]

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
                <AutoColumn gap='lg' justify='center'>
                    <AutoColumn gap='lg' style={{ width: '100%' }}>
                        <TitleRow style={{ marginTop: '1rem' }} padding={'0'}>
                            <TYPE.body fontSize={'20px'}>
                                <Link
                                    style={{
                                        textDecoration: 'none',
                                        width: 'fit-content',
                                        marginBottom: '0.5rem',
                                        marginRight: '1rem'
                                    }}
                                    to='/farming'
                                >
                                    <Trans>← Back to Farming</Trans>
                                </Link>
                                <Trans>{`You have ${4} ${currencyIdA} / ${currencyIdB} positions`}</Trans>
                            </TYPE.body>
                            <ButtonRow>
                                <div style={{ marginRight: '1rem' }}>{`Rewards: 0`}</div>
                                <ResponsiveButtonPrimary
                                    id='claim-rewards'
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
                                                backgroundColor: i === selectedIncentive ? '#426de1' : '#262f48'
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
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between'
                                    }}>
                                        <span>{`# ${i + 1}`}</span>
                                        <Link style={{
                                            color: '#2172e5',
                                            fontSize: '14px',
                                            textDecoration: 'none'
                                        }} to={'/'}>
                      <span>
                        <Trans>View position</Trans>
                      </span>
                                        </Link>
                                    </div>
                                    <div style={{
                                        textTransform: 'uppercase',
                                        color: 'white',
                                        fontSize: '13px',
                                        marginTop: '1rem'
                                    }}>
                                        <Trans>Your Reward</Trans>
                                    </div>
                                    <div style={{
                                        marginTop: '1rem',
                                        marginBottom: '1rem',
                                        display: 'flex',
                                        alignItems: 'center'
                                    }}>
                                        <TokenLogo />
                                        <span style={{ fontSize: '30px' }}>20 LGB</span>
                                    </div>
                                    <div style={{
                                        width: '100%',
                                        borderTop: '1px solid #24214a',
                                        paddingTop: '1rem',
                                        display: 'flex'
                                    }}>
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
                                                backgroundColor: '#0f2e40'
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
                                                backgroundColor: theme.winterMainButton
                                            }}
                                        >
                                            Collect
                                        </button>
                                    </div>
                                </TokenCard>
                            ))}
                        </MainContentWrapper>
                    </AutoColumn>
                </AutoColumn>
            </PageWrapper>
            {isModal ? <StakingModal modal={isModal} closeModalCallback={closeModal} /> : null}
            <SwitchLocaleLink />
        </>
    )
}
