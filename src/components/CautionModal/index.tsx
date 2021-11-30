import { darken } from 'polished'
import { useCallback, useEffect, useState } from 'react'
import styled from 'styled-components/macro'
import Modal from '../Modal'

const CautionModalInner = styled.div`
  padding: 2rem;
  line-height: 26px;
`

const CautionList = styled.ul`
  list-style: decimal;
  // padding-left: 1rem;
`

const CautionListItem = styled.li`
  margin-bottom: 1rem;
`

const AgreeButton = styled.button`
  background-color: #36f;
  color: white;
  padding: 12px 16px;
  width: 100%;
  margin-top: 1rem;
  border-radius: 10px;
  text-transform: uppercase;
  font-size: 16px;
  font-weight: 600;
  border: none;

  &:hover {
    background-color: ${darken(0.1, '#36f')};
  }
`

const agreementItems = [
  'Algebra is not audited yet. We are being audited at the moment',
  'This version of service is provided for conducting public tests',
  'It’s not safe to deposit a great deal of crypto at the moment. We recommend to start with no more than $20,000',
  'Algebra is not liable for any potential loses',
]

export default function CautionModal() {
  const [cautionModal, toggleCautionModal] = useState(() => {
    const accepted = localStorage.getItem('cautionAccepted')
    return !accepted
  })

  const handleAgreement = useCallback(() => {
    localStorage.setItem('cautionAccepted', 'true')
    toggleCautionModal(false)
  }, [])

  return (
    <Modal isOpen={cautionModal}>
      <CautionModalInner>
        <div style={{ textAlign: 'center', marginBottom: '2rem', fontWeight: 600 }}>User agreement</div>
        <p>By confirming this, you acknowledge that you understand the following statements and accept these terms:</p>
        <CautionList>
          {agreementItems.map((el, i) => (
            <CautionListItem key={i}>{el}</CautionListItem>
          ))}
        </CautionList>
        <AgreeButton onClick={handleAgreement}>I agree</AgreeButton>
      </CautionModalInner>
    </Modal>
  )
}
