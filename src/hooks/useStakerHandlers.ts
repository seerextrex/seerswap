import NON_FUN_POS_MAN from 'abis/non-fun-pos-man.json'
import FARMING_CENTER_ABI from 'abis/farming-center.json'
import { Contract, providers } from 'ethers'
import { Interface } from 'ethers/lib/utils'
import { useCallback, useState } from 'react'
import { FARMING_CENTER, NONFUNGIBLE_POSITION_MANAGER_ADDRESSES } from '../constants/addresses'
import { useTransactionAdder } from '../state/transactions/hooks'
import { useActiveWeb3React } from './web3'
import JSBI from 'jsbi'
import { toHex } from '../lib/src/utils'
import { useAppSelector } from '../state/hooks'
import { GAS_PRICE_MULTIPLIER } from './useGasPrice'
import { TransactionResponse } from '@ethersproject/providers'

export enum FarmingType {
  ETERNAL = 0,
  FINITE = 1
}

export function useStakerHandlers() {

  const { chainId, account, library } = useActiveWeb3React()

  const _w: any = window
  const provider = _w.ethereum ? new providers.Web3Provider(_w.ethereum) : undefined

  const nonFunPosManInterface = new Interface(NON_FUN_POS_MAN)
  const farmingCenterInterface = new Interface(FARMING_CENTER_ABI)

  const gasPrice = useAppSelector((state) => state.application.gasPrice.override ? 70 : state.application.gasPrice.fetched)

  const addTransaction = useTransactionAdder()

  const [approvedHash, setApproved] = useState(null)
  const [transferedHash, setTransfered] = useState(null)
  const [stakedHash, setStaked] = useState(null)
  const [getRewardsHash, setGetRewards] = useState(null)
  const [eternalCollectRewardHash, setEternalCollectReward] = useState(null)
  const [withdrawnHash, setWithdrawn] = useState(null)
  const [claimRewardHash, setClaimReward] = useState(null)
  const [sendNFTL2Hash, setSendNFTL2] = useState(null)


  //exit from basic farming and claim than
  const claimRewardsHandler = useCallback(async (token,
    {
      incentiveRewardToken,
      incentiveBonusRewardToken,
      pool,
      incentiveStartTime,
      incentiveEndTime,
      eternalRewardToken,
      eternalBonusRewardToken,
      eternalStartTime,
      eternalEndTime,
      eternalBonusEarned,
      eternalEarned
    },
    farmingType) => {

    if (!account || !provider) return

    const MaxUint128 = toHex(JSBI.subtract(JSBI.exponentiate(JSBI.BigInt(2), JSBI.BigInt(128)), JSBI.BigInt(1)))

    const farmingCenterContract = new Contract(
      FARMING_CENTER[chainId],
      FARMING_CENTER_ABI,
      provider.getSigner()
    )

    setClaimReward({ hash: null, id: null })
    try {
      const farmingCenterInterface = new Interface(FARMING_CENTER_ABI)

      let exit, claimReward1, claimReward2, result

      if (farmingType === FarmingType.ETERNAL) {

        exit = farmingCenterInterface.encodeFunctionData('exitEternalFarming',
          [[eternalRewardToken.id, eternalBonusRewardToken.id, pool.id, +eternalStartTime, +eternalEndTime], +token])

        //check earned or bonus for zero
        claimReward1 = farmingCenterInterface.encodeFunctionData('claimReward',
            [eternalRewardToken.id, account, 0, MaxUint128])

        claimReward2 = farmingCenterInterface.encodeFunctionData('claimReward',
            [eternalBonusRewardToken.id, account, 0, MaxUint128])

        //check difference between tokens
        if (eternalRewardToken.id.toLowerCase() !== eternalBonusRewardToken.id.toLowerCase()) {
          result = await farmingCenterContract.multicall([exit, claimReward1, claimReward2], { gasPrice: gasPrice * GAS_PRICE_MULTIPLIER })
        } else {
          result = await farmingCenterContract.multicall([exit, claimReward1], { gasPrice: gasPrice * GAS_PRICE_MULTIPLIER })
        }
      } else {
        exit = farmingCenterInterface.encodeFunctionData('exitFarming',
          [[incentiveRewardToken.id, incentiveBonusRewardToken.id, pool.id, +incentiveStartTime, +incentiveEndTime], +token])

        claimReward1 = farmingCenterInterface.encodeFunctionData('claimReward',
          [incentiveRewardToken.id, account, MaxUint128, 0])

        claimReward2 = farmingCenterInterface.encodeFunctionData('claimReward',
          [incentiveBonusRewardToken.id, account, MaxUint128, 0])

        if (incentiveRewardToken.id.toLowerCase() !== incentiveBonusRewardToken.id.toLowerCase()) {
          result = await farmingCenterContract.multicall([exit, claimReward1, claimReward2], { gasPrice: gasPrice * GAS_PRICE_MULTIPLIER })
        } else {
          result = await farmingCenterContract.multicall([exit, claimReward1], { gasPrice: gasPrice * GAS_PRICE_MULTIPLIER })
        }
      }

      addTransaction(result, {
        summary: `Claiming reward`
      })

      setClaimReward({ hash: result.hash, id: incentive, error: null })

    } catch (err) {
      setClaimReward({ error: err })
      if (err instanceof Error) {
        throw new Error('Claiming rewards ' + err.message)
      }
    }

  }, [account, chainId])

  //collect rewards and claim than
  const eternalCollectRewardHandler = useCallback(async (token, { pool, eternalRewardToken, eternalBonusRewardToken, eternalStartTime, eternalEndTime }) => {
    if (!account || !provider) return

    const farmingCenterContract = new Contract(
      FARMING_CENTER[chainId],
      FARMING_CENTER_ABI,
      provider.getSigner()
    )

    const farmingCenterInterface = new Interface(FARMING_CENTER_ABI)

    setEternalCollectReward({ hash: null, id: null })

    try {
      const MaxUint128 = toHex(JSBI.subtract(JSBI.exponentiate(JSBI.BigInt(2), JSBI.BigInt(128)), JSBI.BigInt(1)))

      const collectRewards = farmingCenterInterface.encodeFunctionData('collectRewards', [[eternalRewardToken.id, eternalBonusRewardToken.id, pool.id, +eternalStartTime, +eternalEndTime], +token])
      const claimReward1 = farmingCenterInterface.encodeFunctionData('claimReward', [eternalRewardToken.id, account, 0, MaxUint128])
      const claimReward2 = farmingCenterInterface.encodeFunctionData('claimReward', [eternalBonusRewardToken.id, account, 0, MaxUint128])

      let result: TransactionResponse

      if (eternalRewardToken.id.toLowerCase() !== eternalBonusRewardToken.id.toLowerCase()) {
        result = await farmingCenterContract.multicall([collectRewards, claimReward1, claimReward2], { gasPrice: gasPrice * GAS_PRICE_MULTIPLIER })
      } else {
        result = await farmingCenterContract.multicall([collectRewards, claimReward1], { gasPrice: gasPrice * GAS_PRICE_MULTIPLIER })
      }

      addTransaction(result, {
        summary: 'Claiming reward'
      })

      setEternalCollectReward({ hash: result.hash, id: token })

    } catch (err) {
      setEternalCollectReward('failed')
      if (err.code !== 4001) {
        throw new Error('Claiming rewards ' + err.message)
      }
    }

  }, [account, chainId])

  //exit from basic farming before the start
  const exitHandler = useCallback(async (token, { incentiveRewardToken, incentiveBonusRewardToken, pool, incentiveStartTime, incentiveEndTime }) => {

    if (!account || !provider) return

    setGetRewards({ hash: null, id: null, farmingType: null })

    try {

      const farmingCenterContract = new Contract(
        FARMING_CENTER[chainId],
        FARMING_CENTER_ABI,
        provider.getSigner()
      )

      const result = await farmingCenterContract.exitFarming(
        [incentiveRewardToken.id, incentiveBonusRewardToken.id, pool.id, +incentiveStartTime, +incentiveEndTime],
        +token,
        {
          gasPrice: gasPrice * GAS_PRICE_MULTIPLIER
        }
      )

      addTransaction(result, {
        summary: `Rewards were claimed!`
      })

      setGetRewards({ hash: result.hash, id: token, farmingType: eventType })

    } catch (err) {
      setGetRewards('failed')
      if (err.code !== 4001) {
        throw new Error('Getting rewards ' + err.message)
      }
    }

  }, [account, chainId])

  const withdrawHandler = useCallback(async (token, { transfered, rewardToken, pool, startTime, endTime }) => {

    if (!account || !provider) return


    setWithdrawn({ hash: null, id: null })

    try {

      const farmingCenterContract = new Contract(
        FARMING_CENTER[chainId],
        FARMING_CENTER_ABI,
        provider.getSigner()
      )

      const result = await farmingCenterContract.withdrawToken(
        token,
        account,
        0x0,
        {
          gasPrice: gasPrice * GAS_PRICE_MULTIPLIER,
          gasLimit: 300000
        }
      )

      addTransaction(result, {
        summary: `NFT #${token} was withdrawn!`
      })

      setWithdrawn({ hash: result.hash, id: token })
    } catch (err) {
      setWithdrawn('failed')
      if (err.code !== 4001) {
        throw new Error('Withdrawing ' + err)
      }
    }

  }, [account, chainId])

  const stakeHandler = useCallback(async (selectedNFT, { rewardToken, bonusRewardToken, pool, startTime, endTime }, eventType) => {

    if (!account || !provider) return

    setStaked(null)

    let current

    try {

      const farmingCenterContract = new Contract(
        FARMING_CENTER[chainId],
        FARMING_CENTER_ABI,
        provider.getSigner()
      )

      if (selectedNFT.onFarmingCenter) {
        current = selectedNFT.id

        let result

        if (eventType === FarmingType.ETERNAL) {

          result = await farmingCenterContract.enterEternalFarming(
            [rewardToken, bonusRewardToken, pool, startTime, endTime],
            +selectedNFT.id,
            {
              gasPrice: gasPrice * GAS_PRICE_MULTIPLIER
            }
          )
        } else {

          result = await farmingCenterContract.enterFarming(
            [rewardToken, bonusRewardToken, pool, startTime, endTime],
            +selectedNFT.id,
            {
              gasPrice: gasPrice * GAS_PRICE_MULTIPLIER
            }
          )
        }

        addTransaction(result, {
          summary: `NFT #${selectedNFT.id} was deposited!`
        })

        setStaked({ hash: result.hash, id: selectedNFT.id })
      }
    } catch (err) {
      setStaked('failed')
      if (err.code !== 4001) {
        throw new Error('Staking ' + current + ' ' + err.message)
      }
    }

  }, [account, chainId])

  const transferHandler = useCallback(async (selectedNFT) => {

    if (!account || !provider) return

    setTransfered(null)

    let current

    try {

      const nonFunPosManContract = new Contract(
        NONFUNGIBLE_POSITION_MANAGER_ADDRESSES[chainId],
        NON_FUN_POS_MAN,
        provider.getSigner()
      )

      if (selectedNFT.approved) {
        current = selectedNFT.id

        const result = await nonFunPosManContract['safeTransferFrom(address,address,uint256)'](
          account,
          FARMING_CENTER[chainId],
          selectedNFT.id,
          {
            gasPrice: gasPrice * GAS_PRICE_MULTIPLIER
          }
        )

        addTransaction(result, {
          summary: `NFT #${selectedNFT.id} was transferred!`
        })

        setTransfered({ hash: result.hash, id: selectedNFT.id })

      }

    } catch (err) {
      setTransfered('failed')
      if (err.code !== 4001) {
        throw new Error('Staking ' + current + ' ' + err.message)
      }
    }

  }, [account, chainId])

  const approveHandler = useCallback(async (selectedNFT) => {

    if (!account || !provider) return

    setApproved(null)

    let current

    try {


      const nonFunPosManInterface = new Interface(NON_FUN_POS_MAN)

      const nonFunPosManContract = new Contract(
        NONFUNGIBLE_POSITION_MANAGER_ADDRESSES[chainId],
        NON_FUN_POS_MAN,
        provider.getSigner()
      )

      if (!selectedNFT.onFarmingCenter) {
        current = selectedNFT.id

        const approveData = nonFunPosManInterface.encodeFunctionData('approve', [
          FARMING_CENTER[chainId],
          selectedNFT.id
        ])

        const transferData = nonFunPosManInterface.encodeFunctionData('safeTransferFrom(address,address,uint256)', [
          account,
          FARMING_CENTER[chainId],
          selectedNFT.id
        ])

        const result = await nonFunPosManContract.multicall([approveData, transferData], { gasPrice: gasPrice * GAS_PRICE_MULTIPLIER })

        addTransaction(result, {
          summary: `NFT #${selectedNFT.id} was approved!`
        })

        setApproved({ hash: result.hash, id: selectedNFT.id })

      }

    } catch (err) {
      setApproved('failed')
      if (err.code !== 4001) {
        throw new Error('Approving NFT ' + current + ' ' + err.message)
      }
    }

  }, [account, chainId])

  const sendNFTL2Handler = useCallback(async (recipient: string, l2TokenId: string) => {

    if (!account || !provider) return

    setSendNFTL2(null)

    try {

      const farmingCenterContract = new Contract(
        FARMING_CENTER[chainId],
        FARMING_CENTER_ABI,
        provider.getSigner()
      )

      const approveData = farmingCenterInterface.encodeFunctionData('approve', [
        recipient,
        l2TokenId
      ])

      const sendData = farmingCenterInterface.encodeFunctionData('safeTransferFrom(address,address,uint256)', [
        account,
        recipient,
        l2TokenId
      ])

      const result = await farmingCenterContract.multicall([
          approveData,
          sendData
        ],
        {
          gasPrice: gasPrice * GAS_PRICE_MULTIPLIER
        })

      addTransaction(result, {
        summary: `NFT #${l2TokenId} was sent!`
      })

      setSendNFTL2({ hash: result.hash, id: l2TokenId })

    } catch (err) {
      setSendNFTL2('failed')
      if (err.code !== 4001) {
        throw new Error('Send NFT L2 ' + err.message)
      }
    }

  }, [account, chainId])

  return {
    approveHandler,
    approvedHash,
    transferHandler,
    transferedHash,
    stakeHandler,
    stakedHash,
    exitHandler,
    getRewardsHash,
    withdrawHandler,
    withdrawnHash,
    claimRewardsHandler,
    claimRewardHash,
    sendNFTL2Handler,
    sendNFTL2Hash,
    eternalCollectRewardHandler,
    eternalCollectRewardHash
  }
}