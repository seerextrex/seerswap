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
import { useAppSelector } from "state/hooks"
import { GAS_PRICE_MULTIPLIER } from "./useGasPrice"

export function useRealStakerHandlers() {
    const addTransaction = useTransactionAdder()
    const { chainId, account, library } = useActiveWeb3React()
    const provider = library && new providers.Web3Provider(library.provider)

    const [stakeHash, setStakedHash] = useState<string | StakeHash>({ hash: null })
    const [claimgHash, setClaimHash] = useState<string | StakeHash>({ hash: null })
    const [unstakeHash, setUnstakeHash] = useState<string | StakeHash>({ hash: null })

    const gasPrice = useAppSelector((state) => {
        if (!state.application.gasPrice.fetched) return 36
        return state.application.gasPrice.override ? 36 : state.application.gasPrice.fetched
    })

    const [frozenStaked, setFrozen] = useState<string | Frozen[]>([])
    const [stakeLoading, setStakeLoading] = useState<boolean>(false)
    const [claimLoading, setClaimLoading] = useState<boolean>(false)
    const [unstakeLoading, setUnstakeLoading] = useState<boolean>(false)

    const stakerHandler = useCallback(async (stakedCount: string) => {
        if (!account || !provider || !chainId) return
        setStakedHash({ hash: null })
        try {
            const realStaker = new Contract(
                REAL_STAKER_ADDRESS[chainId],
                REAL_STAKER_ABI,
                provider.getSigner()
            )
            setStakeLoading(true)

            const bigNumStakerCount = parseUnits(stakedCount, 18)
            const result: TransactionResponse = await realStaker.enter(bigNumStakerCount._hex, {
                gasPrice: gasPrice * GAS_PRICE_MULTIPLIER
            })

            addTransaction(result, {
                summary: `Staked ${stakedCount} ALGB`
            })
            setStakedHash({ hash: result.hash })

        } catch (e) {
            setStakedHash('failed')
            setStakeLoading(false)
            console.log(e)
        }
    }, [account, chainId])

    const stakerClaimHandler = useCallback(async (claimCount: BigNumber, stakesResult: SubgraphResponseStaking<FactorySubgraph[], StakeSubgraph[]> | null | string) => {
        if (!account || !provider || !chainId || !stakesResult || typeof stakesResult === 'string') return
        setClaimHash({ hash: null})
        try {
            const realStaker = new Contract(
                REAL_STAKER_ADDRESS[chainId],
                REAL_STAKER_ABI,
                provider.getSigner()
            )

            setClaimLoading(true)

            const claimSum: BigNumber = claimCount.mul(BigNumber.from(stakesResult.factories[0].xALGBtotalSupply)).div(BigNumber.from(stakesResult.factories[0].ALGBbalance))

            const result: TransactionResponse = await realStaker.leave(claimSum._hex, {
                gasPrice: gasPrice * GAS_PRICE_MULTIPLIER
            })

            addTransaction(result, {
                summary: `Claimed ${formatEther(claimCount)} ALGB`
            })
            setClaimHash({ hash: result.hash })

        } catch (e) {
            console.log(e)
            setClaimHash('failed')
            setClaimLoading(false)
        }
    }, [account, chainId])

    const stakerUnstakeHandler = useCallback(async (unstakeCount: string, stakesResult: SubgraphResponseStaking<FactorySubgraph[], StakeSubgraph[]>, maxALGBAccount: BigNumber, allXALGBFreeze: BigNumber) => {
        if (!account || !provider || !chainId) return
        setUnstakeHash({ hash: null })
        try {

            const realStaker = new Contract(
                REAL_STAKER_ADDRESS[chainId],
                REAL_STAKER_ABI,
                provider.getSigner()
            )

            setUnstakeLoading(true)

            const bigNumUnstakeAmount = (parseUnits(unstakeCount.toString(), 18).mul(BigNumber.from(stakesResult.stakes[0].xALGBAmount).sub(allXALGBFreeze))).div(maxALGBAccount)

            const result: TransactionResponse = await realStaker.leave(bigNumUnstakeAmount._hex, {
                gasPrice: gasPrice * GAS_PRICE_MULTIPLIER
            })

            addTransaction(result, {
                summary: `Unstaked ${unstakeCount} ALGB`
            })
            setUnstakeHash({ hash: result.hash })

        } catch (e) {
            console.log(e)
            setUnstakeHash('failed')
            setUnstakeLoading(false)
        }
    }, [account, chainId])

    const frozenStakedHandler = useCallback(async (account: string) => {
        try {

            const { data: { stakeTxes }, error: error } = await stakerClient.query<SubgraphResponse<Frozen[]>>({
                query: FROZEN_STAKED(),
                fetchPolicy: 'network-only',
                variables: { account: account.toLowerCase(), timestamp: Math.round(Date.now() / 1000) }
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
        stakeHash,
        setStakedHash,
        claimgHash,
        setClaimHash,
        unstakeHash,
        setUnstakeHash,
        stakerClaimHandler,
        claimLoading,
        stakerUnstakeHandler,
        unstakeLoading,
        frozenStakedHandler,
        frozenStaked

    }
}
