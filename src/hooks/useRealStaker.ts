import REAL_STAKER_ABI from 'abis/real-staker.json'
import { BigNumber, Contract, providers } from 'ethers'
import { formatEther, parseUnits } from 'ethers/lib/utils'
import { useCallback, useState } from 'react'
import { REAL_STAKER_ADDRESS } from '../constants/addresses'
import { useActiveWeb3React } from './web3'
import { useTransactionAdder } from '../state/transactions/hooks'
import { stakerClient } from '../apollo/client'
import { FROZEN_STAKED } from '../utils/graphql-queries'
import { TransactionResponse } from '@ethersproject/providers'
import { FactorySubgraph, Frozen, StakeHash, StakeSubgraph, SubgraphResponse, SubgraphResponseStaking } from '../models/interfaces'

export function useRealStakerHandlers() {
    const addTransaction = useTransactionAdder()
    const { chainId, account } = useActiveWeb3React()
    const _w: any = window
    const provider = _w.ethereum ? new providers.Web3Provider(_w.ethereum) : undefined

    const [stakerHash, setStaked] = useState<null | StakeHash>(null)
    const [frozenStaked, setFrozen] = useState<string | Frozen[]>([])
    const [stakeLoading, setStakeLoading] = useState<boolean>(false)
    const [claimLoading, setClaimLoading] = useState<boolean>(false)
    const [unstakeLoading, setUnstakeLoading] = useState<boolean>(false)

    const stakerHandler = useCallback(async (stakedCount: string) => {
        if (!account || !provider || !chainId) return

        try {
            const realStaker = new Contract(
                REAL_STAKER_ADDRESS[chainId],
                REAL_STAKER_ABI,
                provider.getSigner()
            )
            setStakeLoading(true)

            const bigNumStakerCount = parseUnits(stakedCount, 18)
            const result: TransactionResponse = await realStaker.enter(bigNumStakerCount._hex)

            addTransaction(result, {
                summary: `Staked ${stakedCount} ALGB`
            })
            setStaked({ hash: result.hash })

        } catch (e) {
            console.log(e)
        } finally {
            setStakeLoading(false)
        }
    }, [account, chainId])

    const stakerClaimHandler = useCallback(async (claimCount: BigNumber, stakesResult: SubgraphResponseStaking<FactorySubgraph[], StakeSubgraph[]> | null | string) => {
        if (!account || !provider || !chainId || !stakesResult || typeof stakesResult === 'string') return
        try {
            const realStaker = new Contract(
                REAL_STAKER_ADDRESS[chainId],
                REAL_STAKER_ABI,
                provider.getSigner()
            )

            setClaimLoading(true)

            const claimSum: BigNumber = claimCount.mul(BigNumber.from(stakesResult.factories[0].xALGBtotalSupply)).div(BigNumber.from(stakesResult.factories[0].ALGBbalance))

            const result: TransactionResponse = await realStaker.leave(claimSum._hex)

            addTransaction(result, {
                summary: `Claimed ${formatEther(claimCount)} ALGB`
            })
            setStaked({ hash: result.hash })

        } catch (e) {
            console.log(e)
        } finally {
            setClaimLoading(false)
        }
    }, [account, chainId])

    const stakerUnstakeHandler = useCallback(async (unstakeCount: string, stakesResult: SubgraphResponseStaking<FactorySubgraph[], StakeSubgraph[]>, maxALGBAccount: BigNumber, allXALGBFreeze: BigNumber) => {
        if (!account || !provider || !chainId) return

        try {

            const realStaker = new Contract(
                REAL_STAKER_ADDRESS[chainId],
                REAL_STAKER_ABI,
                provider.getSigner()
            )

            setUnstakeLoading(true)

            const bigNumUnstakeAmount = (parseUnits(unstakeCount.toString(), 18).mul(BigNumber.from(stakesResult.stakes[0].xALGBAmount).sub(allXALGBFreeze))).div(maxALGBAccount)

            const result: TransactionResponse = await realStaker.leave(bigNumUnstakeAmount._hex)

            addTransaction(result, {
                summary: `Unstaked ${unstakeCount} ALGB`
            })
            setStaked({ hash: result.hash })

        } catch (e) {
            console.log(e)
        } finally {
            setUnstakeLoading(false)
        }
    }, [account, chainId])

    const frozenStakedHandler = useCallback(async (account: string) => {
        try {

            const { data: { stakeTxes }, error: error } = await stakerClient.query<SubgraphResponse<Frozen[]>>({
                query: FROZEN_STAKED(),
                fetchPolicy: 'network-only',
                variables: {account: account.toLowerCase(), timestamp: Math.round(Date.now() / 1000)}
            })

            setFrozen(stakeTxes)

        } catch (e: any) {
            setFrozen(`Error: ${e.message}`)
            return
        }
    }, [account])

    return {
        stakerHandler,
        stakeLoading,
        stakerHash,
        stakerClaimHandler,
        claimLoading,
        stakerUnstakeHandler,
        unstakeLoading,
        frozenStakedHandler,
        frozenStaked
    }
}
