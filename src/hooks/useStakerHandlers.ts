import NON_FUN_POS_MAN from 'abis/non-fun-pos-man.json'
import FARMING_CENTER_ABI from 'abis/farming-center.json'
import { Contract, providers } from 'ethers'
import { Interface } from 'ethers/lib/utils'
import { useCallback, useState } from 'react'
import { FARMING_CENTER, NONFUNGIBLE_POSITION_MANAGER_ADDRESSES } from '../constants/addresses'
import { useTransactionAdder } from '../state/transactions/hooks'
import { useActiveWeb3React } from './web3'
import JSBI from 'jsbi'
import { toHex } from '../lib/src'
import { useAppSelector } from '../state/hooks'
import { GAS_PRICE_MULTIPLIER } from './useGasPrice'
import { TransactionResponse } from '@ethersproject/providers'
import {
    DefaultFarming,
    DefaultFarmingWithError,
    DefaultNFT,
    EternalCollectRewardHandlerInterface,
    GetRewardsHandlerInterface,
    GetRewardsHashInterface,
    StakeDefault
} from '../models/interfaces'
import { FarmingType } from '../models/enums'

export function useStakerHandlers() {

    const { chainId, account } = useActiveWeb3React()
    const _w: any = window
    const provider = _w.ethereum ? new providers.Web3Provider(_w.ethereum) : undefined
    const farmingCenterInterface = new Interface(FARMING_CENTER_ABI)
    const gasPrice = useAppSelector((state) => state.application.gasPrice.override ? 70 : state.application.gasPrice.fetched)
    const addTransaction = useTransactionAdder()

    const [approvedHash, setApproved] = useState<DefaultFarming | string>({ hash: null, id: null })
    const [stakedHash, setStaked] = useState<DefaultFarming | string>({ hash: null, id: null })
    const [getRewardsHash, setGetRewards] = useState<GetRewardsHashInterface | 'failed'>({
        hash: null,
        id: null,
        farmingType: null
    })
    const [eternalCollectRewardHash, setEternalCollectReward] = useState<DefaultFarmingWithError | 'failed'>({
        hash: null,
        id: null,
        error: null
    })
    const [withdrawnHash, setWithdrawn] = useState<DefaultFarming | 'failed'>({
        hash: null,
        id: null
    })
    const [claimRewardHash, setClaimReward] = useState<DefaultFarmingWithError>({
        hash: null,
        id: null,
        error: null
    })
    const [sendNFTL2Hash, setSendNFTL2] = useState<DefaultFarming | 'failed'>({
        hash: null,
        id: null
    })

    const claimRewardsHandler = useCallback(async (tokenAddress: string) => {

        if (!account || !provider || !chainId) return

        const MaxUint128 = toHex(JSBI.subtract(JSBI.exponentiate(JSBI.BigInt(2), JSBI.BigInt(128)), JSBI.BigInt(1)))
        const farmingCenterContract = new Contract(FARMING_CENTER[chainId], FARMING_CENTER_ABI, provider.getSigner())

        setClaimReward({ hash: null, id: null })

        try {

            const result: TransactionResponse = await farmingCenterContract.claimReward(
                tokenAddress,
                account,
                MaxUint128,
                MaxUint128,
                { gasPrice: gasPrice * GAS_PRICE_MULTIPLIER }
            )

            addTransaction(result, {
                summary: `Claiming reward`
            })

            setClaimReward({ hash: result.hash, id: tokenAddress, error: null })

        } catch (err) {
            setClaimReward({ id: null, hash: null, error: err })

            if (err instanceof Error) {
                throw new Error('Claiming rewards ' + err.message)
            }
        }

    }, [account, chainId])

    const eternalCollectRewardHandler = useCallback(async (token: string, {
        pool,
        eternalRewardToken,
        eternalBonusRewardToken,
        eternalStartTime,
        eternalEndTime
    }: EternalCollectRewardHandlerInterface) => {
        if (!account || !provider || !chainId) return

        const farmingCenterContract = new Contract(
            FARMING_CENTER[chainId],
            FARMING_CENTER_ABI,
            provider.getSigner()
        )

        setEternalCollectReward({ hash: null, id: null })

        try {

            const result: TransactionResponse = await farmingCenterContract.collectRewards(
                [eternalRewardToken.id, eternalBonusRewardToken.id, pool.id, +eternalStartTime, +eternalEndTime],
                +token,
                {
                    gasPrice: gasPrice * GAS_PRICE_MULTIPLIER
                }
            )

            addTransaction(result, {
                summary: 'Claiming reward'
            })

            setEternalCollectReward({ hash: result.hash, id: token })

        } catch (err) {
            setEternalCollectReward('failed')
            if (err instanceof Error) {
                throw new Error('Claiming rewards ' + err.message)
            }
        }

    }, [account, chainId])

    const getRewardsHandler = useCallback(async (token: string, {
        incentiveRewardToken,
        incentiveBonusRewardToken,
        pool,
        incentiveStartTime,
        incentiveEndTime,
        eternalRewardToken,
        eternalBonusRewardToken,
        eternalStartTime,
        eternalEndTime
    }: GetRewardsHandlerInterface, eventType: number) => {

        if (!account || !provider || !chainId) return

        setGetRewards({ hash: null, id: null, farmingType: null })

        try {

            const farmingCenterContract = new Contract(
                FARMING_CENTER[chainId],
                FARMING_CENTER_ABI,
                provider.getSigner()
            )

            let result: TransactionResponse

            if (eventType === FarmingType.ETERNAL) {

                result = await farmingCenterContract.exitEternalFarming(
                    [eternalRewardToken.id, eternalBonusRewardToken.id, pool.id, +eternalStartTime, +eternalEndTime],
                    +token,
                    { gasPrice: gasPrice * GAS_PRICE_MULTIPLIER }
                )

            } else {

                result = await farmingCenterContract.exitFarming(
                    [incentiveRewardToken.id, incentiveBonusRewardToken.id, pool.id, +incentiveStartTime, +incentiveEndTime],
                    +token,
                    { gasPrice: gasPrice * GAS_PRICE_MULTIPLIER }
                )
            }

            if (eventType === FarmingType.ETERNAL) {
                addTransaction(result, {
                    summary: `NFT #${+token} was undeposited!`
                })
            } else {
                addTransaction(result, {
                    summary: `Rewards were claimed!`
                })
            }

            setGetRewards({ hash: result.hash, id: token, farmingType: eventType })

        } catch (err) {
            setGetRewards('failed')
            if (err instanceof Error) {
                throw new Error('Getting rewards ' + err.message)
            }
        }

    }, [account, chainId])

    const withdrawHandler = useCallback(async (token: string) => {

        if (!account || !provider || !chainId) return


        setWithdrawn({ hash: null, id: null })

        try {

            const farmingCenterContract = new Contract(
                FARMING_CENTER[chainId],
                FARMING_CENTER_ABI,
                provider.getSigner()
            )

            const result: TransactionResponse = await farmingCenterContract.withdrawToken(
                token,
                account,
                0x0,
                { gasPrice: gasPrice * GAS_PRICE_MULTIPLIER, gasLimit: 300000 }
            )

            addTransaction(result, {
                summary: `NFT #${token} was withdrawn!`
            })

            setWithdrawn({ hash: result.hash, id: token })
        } catch (err) {
            setWithdrawn('failed')
            if (err instanceof Error) {
                throw new Error('Withdrawing ' + err)
            }
        }

    }, [account, chainId])

    const stakeHandler = useCallback(async (selectedNFT: DefaultNFT, {
        rewardToken,
        bonusRewardToken,
        pool,
        startTime,
        endTime
    }: StakeDefault, eventType: number) => {

        if (!account || !provider || !chainId) return

        setStaked({ hash: null, id: null })

        let current = ''

        try {

            const farmingCenterContract = new Contract(
                FARMING_CENTER[chainId],
                FARMING_CENTER_ABI,
                provider.getSigner()
            )

            if (selectedNFT.onFarmingCenter) {
                current = selectedNFT.id

                let result: TransactionResponse

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
            if (err instanceof Error) {
                throw new Error('Staking ' + current + ' ' + err.message)
            }
        }

    }, [account, chainId])

    const approveHandler = useCallback(async (selectedNFT: DefaultNFT) => {

        if (!account || !provider || !chainId) return

        setApproved({ hash: null, id: null })

        let current = ''

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

                const result: TransactionResponse = await nonFunPosManContract.multicall([
                        approveData, transferData
                    ],
                    {
                        gasPrice: gasPrice * GAS_PRICE_MULTIPLIER
                    })

                addTransaction(result, {
                    summary: `NFT #${selectedNFT.id} was approved!`
                })

                setApproved({ hash: result.hash, id: selectedNFT.id })

            }

        } catch (err) {
            setApproved('failed')
            if (err instanceof Error) {
                throw new Error('Approving NFT ' + current + ' ' + err.message)
            }
        }

    }, [account, chainId])

    const sendNFTL2Handler = useCallback(async (recipient: string, l2TokenId: string) => {

        if (!account || !provider || !chainId) return

        setSendNFTL2({ hash: null, id: null })

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

            const result: TransactionResponse = await farmingCenterContract.multicall(
                [
                    approveData,
                    sendData
                ],
                { gasPrice: gasPrice * GAS_PRICE_MULTIPLIER })

            addTransaction(result, {
                summary: `NFT #${l2TokenId} was sent!`
            })

            setSendNFTL2({ hash: result.hash, id: l2TokenId })

        } catch (err) {
            setSendNFTL2('failed')
            if (err instanceof Error) {
                throw new Error('Send NFT L2 ' + err.message)
            }
        }

    }, [account, chainId])

    return {
        approveHandler,
        approvedHash,
        stakeHandler,
        stakedHash,
        getRewardsHandler,
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
