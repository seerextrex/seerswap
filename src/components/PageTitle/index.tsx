import { RefreshCw } from 'react-feather'
import { Title, TitleName, ReloadButton } from './styled'

export function PageTitle({
                            title,
                            isLoading,
                            refreshHandler
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
