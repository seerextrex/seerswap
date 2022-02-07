import { RefreshCw } from 'react-feather'
import styled, { keyframes } from 'styled-components/macro'

const spinAnimation = keyframes`
  100% {
    transform: rotate(360deg);
  }
`
const Title = styled.div`
  display: flex;
  align-items: center;
  font-size: 21px;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #2a7ed2;
`
const TitleName = styled.span`
  margin-right: 1rem;
  font-weight: 600;
`

const ReloadButton = styled.button`
  background-color: transparent;
  border: none;
  animation: ${(props) => (props.refreshing ? spinAnimation : '')} infinite 3s;
  cursor: pointer;
  &:disabled {
    opacity: 0.5;
    cursor: default;
  }
`

export function PageTitle({
  title,
  isLoading,
  refreshHandler,
}: {
  title?: string
  isLoading?: boolean
  refreshHandler?: () => void
}) {
  return (
    <Title>
      <TitleName>{title}</TitleName>
      {refreshHandler && isLoading !== undefined && (
        <span style={{ marginLeft: 'auto' }}>
          <ReloadButton disabled={isLoading} onClick={() => refreshHandler()} refreshing={isLoading}>
            <RefreshCw style={{ display: 'block' }} size={18} stroke={'white'} />
          </ReloadButton>
        </span>
      )}
    </Title>
  )
}
