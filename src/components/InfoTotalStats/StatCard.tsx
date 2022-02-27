import { StatsCard, StatsCardTitle, StatsCardValue } from './styled'
import Loader from '../Loader'
import { formatDollarAmount } from '../../utils/numbers'
import Card from '../../shared/components/Card/Card'

interface StatCardProps {
    isLoading: boolean;
    title: string;
    data: number
    style: string
}

export function StatCard({ isLoading, title, data, style }: StatCardProps) {

    return (
        <Card classes={`w-100 pa-1 br-12 ${style}`} isDark={false}>
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
        </Card>
    )
}
