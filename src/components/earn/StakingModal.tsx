import { useCallback, useContext, useState } from 'react'
import Modal from '../Modal'
import styled, { ThemeContext } from 'styled-components/macro'
import { X } from 'react-feather'
import { Trans } from '@lingui/macro'

const ModalContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 1rem;
  width: 100%;
  background-color: ${({ theme }) => theme.bg2};
  border-radius: 20px;
`

const StyledCloseIcon = styled(X)`
  height: 20px;
  width: 20px;
  :hover {
    cursor: pointer;
  }

  > * {
    stroke: ${({ theme }) => theme.text1};
  }
`

export default function StakingModal({
    modal,
    closeModalCallback,
}: {
    modal: boolean
    closeModalCallback: () => void
}) {
    const [approved, setApproved] = useState(false)

    const [sent, setSent] = useState(false)

    const [staked, setStaked] = useState(false)

    const approve = useCallback(() => {
        setApproved(true)
    }, [approved])

    const send = useCallback(() => {
        setSent(true)
    }, [sent])

    const stake = useCallback(() => {
        setStaked(true)
    }, [staked])

    const theme = useContext(ThemeContext)

    return (
        <Modal isOpen={modal} onDismiss={() => console.log('here')} maxHeight={80}>
            <ModalContentWrapper>
                {!approved ? (
                    <>
                        <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between' }}>
                            <Trans>Approve NFT</Trans>
                            <StyledCloseIcon onClick={closeModalCallback} />
                        </div>
                        <div
                            style={{
                                padding: '8px',
                                borderRadius: '6px',
                                backgroundColor: '#0f1940',
                                color: '#5376ff',
                                marginBottom: '1rem',
                            }}
                        >
                            <Trans>To stake your NFT you should approve Algebra to use it</Trans>
                        </div>
                        <button
                            style={{
                                padding: '1rem',
                                width: '100%',
                                border: 'none',
                                borderRadius: '8px',
                                color: 'white',
                                backgroundColor: theme.winterMainButton,
                                fontSize: '18px',
                            }}
                            onClick={approve}
                        >
                            Approve
                        </button>
                    </>
                ) : !sent ? (
                    <>
                        <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between' }}>
                            <Trans>Send NFT</Trans>
                            <StyledCloseIcon onClick={closeModalCallback} />
                        </div>
                        <button
                            style={{
                                padding: '1rem',
                                width: '100%',
                                border: 'none',
                                borderRadius: '8px',
                                color: 'white',
                                backgroundColor: theme.winterMainButton,
                                fontSize: '18px',
                            }}
                            onClick={send}
                        >
                            Send
                        </button>
                    </>
                ) : !staked ? (
                    <>
                        <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between' }}>
                            <Trans>Deposit NFT</Trans>
                            <StyledCloseIcon onClick={closeModalCallback} />
                        </div>
                        <button
                            style={{
                                padding: '1rem',
                                width: '100%',
                                border: 'none',
                                borderRadius: '8px',
                                color: 'white',
                                backgroundColor: theme.winterMainButton,
                                fontSize: '18px',
                            }}
                            onClick={stake}
                        >
                            Deposit
                        </button>
                    </>
                ) : (
                    <>
                        <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between' }}>
                            <Trans>Done!</Trans>
                            <StyledCloseIcon onClick={closeModalCallback} />
                        </div>
                    </>
                )}
            </ModalContentWrapper>
        </Modal>
    )
}
