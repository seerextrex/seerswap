import styled from 'styled-components/macro'

export const PageWrapper = styled.div`
    min-width: 100%;
    ${({ theme }) => theme.mediaWidth.upToMedium`
  max-width: 720px!important;
  overflow-x: scroll;
  border-radius: 8px;
`};
`

export const EventsListHeader = styled.div`
    border-bottom: 1px solid #eaeaea;
    padding: 1rem;
    width: 100%;
    display: grid;
    grid-template-columns: 1.5fr 1.2fr 1.2fr 1fr .8fr .5fr 1fr 1.2fr;
    text-align: center;
`

export const EventsList = styled.div`
    margin: 0;
    padding: 0;
    width: 100%;
`

export const EventsListItem = styled.span`
    padding: 1rem;
    border-bottom: 1px solid #eaeaea;
    width: 100%;
    display: grid;
    grid-template-columns: 1.5fr 1.2fr 1.2fr 1fr .8fr .5fr 1fr 1.2fr;
    text-align: center;

    span {
        vertical-align: middle;
    }
`
export const PoolWrapper = styled.span`
    display: flex;
    align-items: center;
    justify-content: center;
`

export const TextWrapper = styled.div`
    margin-left: .5rem;
`
