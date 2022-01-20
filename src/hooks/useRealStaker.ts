import REAL_STAKER_ABI from 'abis/real-staker.json'
import { BigNumber, Contract, providers } from 'ethers'
import {formatEther, formatUnits, parseEther, parseUnits} from 'ethers/lib/utils'
import { useCallback, useState } from "react"
import { REAL_STAKER_ADDRESS } from "../constants/addresses"
import { useActiveWeb3React } from "./web3"
import { useTransactionAdder } from '../state/transactions/hooks'
import {stakerClient} from "../apollo/client"
import {FROZEN_STAKED} from "../utils/graphql-queries"

export function useRealStakerHandlers() {

  const addTransaction = useTransactionAdder()
  const { chainId, account } = useActiveWeb3React()
  const _w: any = window
  const provider = _w.ethereum ? new providers.Web3Provider(_w.ethereum) : undefined

  const [stakerHash, setStaked] = useState(null)
  const [frozenStaked, setFrozen] = useState<string | any[]>([])

  const stakerHandler = useCallback(async (stakedCount) => {

    if (!account || !provider) return

    setStaked(null)

    try {
      const realStaker = new Contract(
        REAL_STAKER_ADDRESS[chainId],
        REAL_STAKER_ABI,
        provider.getSigner()
      )
      const bigNumStakerCount = parseUnits(stakedCount.toString(), 18)
      const result = await realStaker.enter(bigNumStakerCount._hex)

      addTransaction(result, {
        summary: `Stake ${stakedCount} ALGB`
      })
      setStaked({hash: result.hash})

    } catch (e) {
      setStaked('failed')
      console.error(e)
      return
    }

  }, [account, chainId])

  const stakerClaimHandler = useCallback(async (claimCount, stakesResult) => {
    try {
      const realStaker = new Contract(
        REAL_STAKER_ADDRESS[chainId],
        REAL_STAKER_ABI,
        provider.getSigner()
      )

      const claimSum = (claimCount.mul(BigNumber.from(stakesResult.factories[0].xALGBtotalSupply))).div(BigNumber.from(stakesResult.factories[0].ALGBbalance))

      const result = await realStaker.leave(claimSum._hex)

      addTransaction(result, {
        summary: `Claim ${formatEther(claimCount)} ALGB`
      })
      setStaked({hash: result.hash})

    } catch (e) {
      console.log(e)
      return
    }
  }, [account])

  const stakerUnstakeHandler = useCallback(async (unstakeCount, stakesResult, maxALGBAccount, allXALGBFreeze) => {
    try {

      const realStaker = new Contract(
        REAL_STAKER_ADDRESS[chainId],
        REAL_STAKER_ABI,
        provider.getSigner()
      )

      const bigNumUnstakeAmount = (parseUnits(unstakeCount.toString(), 18).mul(BigNumber.from(stakesResult.stakes[0].xALGBAmount).sub(allXALGBFreeze))).div(maxALGBAccount)

      const result = await realStaker.leave(bigNumUnstakeAmount._hex)

      addTransaction(result, {
        summary: `Unstake ${unstakeCount} ALGB`
      })
      setStaked({hash: result.hash})

    } catch (e) {
      console.log(e)
      return
    }
  }, [account])

  const frozenStakedHandler = useCallback(async (account) => {
    try {

      const {data: {stakeTxes}, error: error} = await stakerClient.query({
        query: FROZEN_STAKED(account.toLowerCase()),
        fetchPolicy: 'network-only'
      })

     setFrozen(stakeTxes)

    } catch (e) {
      console.log(e)
      setFrozen(`Error: ${e.message}`)
      return
    }
  }, [account])

  return {
    stakerHandler,
    stakerHash,
    stakerClaimHandler,
    stakerUnstakeHandler,
    frozenStakedHandler,
    frozenStaked
  }
}