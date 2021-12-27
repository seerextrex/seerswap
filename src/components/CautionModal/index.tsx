import { darken } from 'polished'
import { useCallback, useEffect, useState } from 'react'
import styled from 'styled-components/macro'
import Modal from '../Modal'

const CautionModalInner = styled.div`
  padding: 2rem;
  line-height: 26px;
  color: #080064;
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
  'Using Algebra involves various risks, including, but not limited to, losses while digital assets are being supplied to Algebra and losses due to the fluctuation of prices of tokens in a trading pair or liquidity pool.',
  'You use Algebra at your own risk and without warranties of any kind. Algebra is not liable for potential losses.',
  'Before using Algebra, you should review the relevant documentation to make sure you understand how Algebra works.',
  'You are responsible for completing your own due diligence to understand the risks of trading crypto.',
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
        <div style={{ textAlign: 'center', marginBottom: '2rem', fontWeight: 600 }}>
          Welcome to Algebra, the first concentrated liquidity DEX on Polygon!
        </div>
        <p style={{ textAlign: 'center' }}>
          Check out our{' '}
          <a
            target="_blank"
            rel="noreferrer noopener"
            href="https://algebra.finance/static/Algebra_Tech_Paper-51ff302b23209d0432e2453dbd9649a8.pdf"
          >
            Tech Paper
          </a>{' '}
          and read what{' '}
          <a target="_blank" rel="noreferrer noopener" href={'https://arxiv.org/pdf/2110.01368.pdf'}>
            concentrated liquidity is
          </a>
          .
        </p>
        <p>Please confirm that you agree with the following paragraphs:</p>
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
