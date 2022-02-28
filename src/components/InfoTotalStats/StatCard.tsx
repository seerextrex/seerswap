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
            <div className={'c-lg mb-1'}>{title}</div>
            <div className={'fs-2 b'}>
                {isLoading || !data ?
                    <span>
                        <Loader size={'2rem'} stroke='white' />
                    </span>
                    :
                    formatDollarAmount(data)
                }
            </div>
        </Card>
    )
}
