import { FarmingType } from "../../hooks/useStakerHandlers"
import styled from 'styled-components/macro'

const PageWrapper = styled.div`
    min-width: 995px;
`

const EventsListHeader = styled.div`
    display: flex;
    border-bottom: 1px solid #eaeaea;
    padding: 1rem;

    & > span {
        width: calc(100% / 8);
    }
`

const EventsList = styled.ul`
    margin: 0;
    padding: 0;
`

const EventsListItem = styled.li`
    display: flex;
    padding: 1rem;
    border-bottom: 1px solid #eaeaea;

    & > span {
        width: calc(100% / 8);
    }
`

export default function EventsHistory() {

    const eventsHistory = [
        {
            start: 0,
            end: 1,
            pool: {
                token0: 'ALGB',
                token1: 'RBC'
            },
            rewardToken: 'ALGB',
            reward: 10,
            bonusRewardToken: 'RBC',
            bonusReward: 20,
            participants: 12,
            type: FarmingType.FINITE,
            bestAPR: '130%',
            tvl: '180k'
        }
    ]


    return <PageWrapper>
        <EventsListHeader>
            <span>Pool</span>
            <span>Reward</span>
            <span>Bonus</span>
            <span>Participants</span>
            <span>Event type</span>
            <span>TVL</span>
            <span>Best APR</span>
            <span>Dates</span>
        </EventsListHeader>
        <EventsList>
            {
                eventsHistory.map((el, i) => <EventsListItem key={i}>
                    <span>{el.pool.token0}</span>
                    <span>{el.rewardToken}</span>
                    <span>{el.bonusRewardToken}</span>
                    <span>{el.participants}</span>
                    <span>{el.type}</span>
                    <span>{el.tvl}</span>
                    <span>{el.bestAPR}</span>
                    <span>{`${el.start} - ${el.end}`}</span>
                </EventsListItem>)
            }
        </EventsList>
    </PageWrapper> 
}