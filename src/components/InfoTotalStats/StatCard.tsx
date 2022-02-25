import { StatsCard, StatsCardTitle, StatsCardValue } from './styled'
import Loader from '../Loader'
import { formatDollarAmount } from '../../utils/numbers'

interface StatCardProps {
    isLoading: boolean;
    title: string;
    data: number
}

export function StatCard({ isLoading, title, data }: StatCardProps) {

    return (
        <StatsCard>
            <StatsCardTitle>{title}</StatsCardTitle>
            <StatsCardValue>
                {isLoading || !data ?
                    <span>
                        <Loader size={'36px'} stroke='white' />
                    </span>
                    :
                    formatDollarAmount(data)
                }
            </StatsCardValue>
        </StatsCard>
    )
}
