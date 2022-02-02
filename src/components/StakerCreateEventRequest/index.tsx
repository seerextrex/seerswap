import { Clipboard, ExternalLink } from 'react-feather'
import { Wrapper, RequestButton } from './styled'

export default function StakerCreateEventRequest() {
  return (
    <Wrapper>
      <Clipboard color={'white'} size={'35px'} />
      <div style={{ maxWidth: '500px' }}>
        <div style={{ margin: '2rem 0', textAlign: 'center' }}>Please sign the form to request your Event</div>
        <div>
          <RequestButton
            target="_blank"
            rel="noopener noreferrer"
            href="https://docs.google.com/forms/d/e/1FAIpQLSeGeySD0-i92t4mTZS8L2Ui0Qi_byyG2qpMok_NGESyGuQM2g/viewform"
          >
            <span>Request Event</span>
            <span>
              <ExternalLink style={{ marginLeft: '10px' }} stroke={'currentColor'} size={18} />
            </span>
          </RequestButton>
        </div>
      </div>
    </Wrapper>
  )
}
