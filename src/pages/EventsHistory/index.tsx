import { PageWrapper } from './styled'
import FarmsHistoryTable from '../../components/FarmsHistoryTable'

export default function EventsHistory() {
    const eventsHistory = [
        {
            start: 'Nov 19',
            end: 'Nov 26',
            pool: {
                token0: { address: '0x0169ec1f8f639b32eec6d923e24c2a2ff45b9dd6', symbol: 'ALGB' },
                token1: { address: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174', symbol: 'USDC' }
            },
            rewardToken: { address: '0x0169ec1f8f639b32eec6d923e24c2a2ff45b9dd6', symbol: 'ALGB' },
            reward: 80_000,
            bonusRewardToken: { address: '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270', symbol: 'WMATIC' },
            bonusReward: 5000,
            participants: 92,
            type: 'Finite',
            apr: '3404%',
            tvl: '$175k'
        },
        {
            start: 'Dec 7',
            end: 'Dec 14',
            pool: {
                token0: { address: '0x0169ec1f8f639b32eec6d923e24c2a2ff45b9dd6', symbol: 'ALGB' },
                token1: { address: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174', symbol: 'USDC' }
            },
            rewardToken: { address: '0x0169ec1f8f639b32eec6d923e24c2a2ff45b9dd6', symbol: 'ALGB' },
            reward: 80_000,
            bonusRewardToken: { address: '0x0169ec1f8f639b32eec6d923e24c2a2ff45b9dd6', symbol: 'ALGB' },
            bonusReward: 5000,
            participants: 64,
            type: 'Finite',
            apr: '472%',
            tvl: '$192k'
        },
        {
            start: 'Dec 22',
            end: 'Jan 5',
            pool: {
                token0: { address: '0x0169ec1f8f639b32eec6d923e24c2a2ff45b9dd6', symbol: 'ALGB' },
                token1: { address: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174', symbol: 'USDC' }
            },
            rewardToken: { address: '0x0169ec1f8f639b32eec6d923e24c2a2ff45b9dd6', symbol: 'ALGB' },
            reward: 500_000,
            bonusRewardToken: { address: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174', symbol: 'USDC' },
            bonusReward: 25_000,
            participants: 113,
            type: 'Finite',
            apr: '312%',
            tvl: '$234k'
        },
        {
            start: 'Jan 3',
            end: 'Jan 17',
            pool: {
                token0: { address: '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270', symbol: 'WMATIC' },
                token1: { address: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174', symbol: 'USDC' }
            },
            rewardToken: { address: '0x0169ec1f8f639b32eec6d923e24c2a2ff45b9dd6', symbol: 'ALGB' },
            reward: 100_000,
            bonusRewardToken: { address: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174', symbol: 'USDC' },
            bonusReward: 10_000,
            participants: 23,
            type: 'Finite',
            apr: '200%',
            tvl: '$93k'
        },
        {
            start: 'Jan 6',
            end: 'Jan 20',
            pool: {
                token0: { address: '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270', symbol: 'WMATIC' },
                token1: { address: '0xc3cffdaf8f3fdf07da6d5e3a89b8723d5e385ff8', symbol: 'RBC' }
            },
            rewardToken: { address: '0x0169ec1f8f639b32eec6d923e24c2a2ff45b9dd6', symbol: 'ALGB' },
            reward: 70_000,
            bonusRewardToken: { address: '0xc3cffdaf8f3fdf07da6d5e3a89b8723d5e385ff8', symbol: 'RBC' },
            bonusReward: 14_000,
            participants: 64,
            type: 'Finite',
            apr: '840%',
            tvl: '$400k'
        }
    ]

    return (
        <PageWrapper>
            <FarmsHistoryTable eventDatas={eventsHistory} />
        </PageWrapper>
    )
}
