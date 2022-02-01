import NON_FUN_POS_MAN from 'abis/non-fun-pos-man'
import FINITE_FARMING_ABI from 'abis/finite-farming'
import FARMING_CENTER_ABI from 'abis/farming-center.json'
import { Contract, providers } from "ethers"
import { Interface } from "ethers/lib/utils"
import { useCallback, useState } from "react"
import { FARMING_CENTER, NONFUNGIBLE_POSITION_MANAGER_ADDRESSES, FINITE_FARMING } from "../constants/addresses"
import { useTransactionAdder } from "../state/transactions/hooks"
import { useActiveWeb3React } from "./web3"
import { calculateGasMargin } from "../utils/calculateGasMargin"

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

    const addTransaction = useTransactionAdder()

    const [approvedHash, setApproved] = useState(null)
    const [transferedHash, setTransfered] = useState(null)
    const [stakedHash, setStaked] = useState(null)
    const [getRewardsHash, setGetRewards] = useState(null)
    const [eternalCollectRewardHash, setEternalCollectReward] = useState(null)
    const [withdrawnHash, setWithdrawn] = useState(null)
    const [claimRewardHash, setClaimReward] = useState(null)
    const [sendNFTL2Hash, setSendNFTL2] = useState(null)

    const claimRewardsHandler = useCallback(async (tokenAddress, amount) => {

        if (!account || !provider) return

        const farmingCenterContract = new Contract(
            FARMING_CENTER[chainId],
            FARMING_CENTER_ABI,
            provider.getSigner()
        )

        setClaimReward({ hash: null, id: null })

        try {

            const result = await farmingCenterContract.claimReward(
                tokenAddress,
                account,
                amount
            )

            addTransaction(result, {
                summary: 'Claiming reward for ...'
            })

            setClaimReward({ hash: result.hash, id: tokenAddress, error: null })

        } catch (err) {
            setClaimReward({ error: err })
            if (err.code !== 4001) {
                throw new Error('Claiming rewards ' + err.message)
            }
        }

    }, [account, chainId])

    const eternalCollectRewardHandler = useCallback(async (token, { pool, eternalRewardToken, eternalBonusRewardToken, eternalStartTime, eternalEndTime }) => {
        if (!account || !provider) return

        const farmingCenterContract = new Contract(
            FARMING_CENTER[chainId],
            FARMING_CENTER_ABI,
            provider.getSigner()
        )

        setEternalCollectReward({ hash: null, id: null })

        try {

            const result = await farmingCenterContract.collectRewards(
                [eternalRewardToken.id, eternalBonusRewardToken.id, pool.id, +eternalStartTime, +eternalEndTime],
                +token
            )

            addTransaction(result, {
                summary: 'Claiming reward for ...'
            })

            setEternalCollectReward({ hash: result.hash, id: token })

        } catch (err) {
            setEternalCollectReward('failed')
            if (err.code !== 4001) {
                throw new Error('Claiming rewards ' + err.message)
            }
        }

    }, [account, chainId])

    const getRewardsHandler = useCallback(async (token, { incentiveRewardToken, incentiveBonusRewardToken, pool, incentiveStartTime, incentiveEndTime, eternalRewardToken, eternalBonusRewardToken, eternalStartTime, eternalEndTime }, eventType) => {

        if (!account || !provider) return

        setGetRewards({ hash: null, id: null, farmingType: null })

        try {

            const farmingCenterContract = new Contract(
                FARMING_CENTER[chainId],
                FARMING_CENTER_ABI,
                provider.getSigner()
            )

            let result

            if (eventType === FarmingType.ETERNAL) {

                result = await farmingCenterContract.exitEternalFarming(
                    [eternalRewardToken.id, eternalBonusRewardToken.id, pool.id, +eternalStartTime, +eternalEndTime],
                    +token
                )

            } else {

                result = await farmingCenterContract.exitFarming(
                    [incentiveRewardToken.id, incentiveBonusRewardToken.id, pool.id, +incentiveStartTime, +incentiveEndTime],
                    +token
                )
            }

            addTransaction(result, {
                summary: `Rewards were claimed!`
            })

            setGetRewards({ hash: result.hash, id: token + eventType, farmingType: eventType })

        } catch (err) {
            setGetRewards('failed')
            if (err.code !== 4001) {
                throw new Error('Getting rewards ' + err.message)
            }
        }

    }, [account, chainId])

    const withdrawHandler = useCallback(async (token, { transfered, rewardToken, pool, startTime, endTime, }) => {

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
                0x0
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

                    console.log('[INFINITE]', [rewardToken, bonusRewardToken, pool, startTime, endTime],
                        +selectedNFT.id)

                    result = await farmingCenterContract.enterEternalFarming(
                        [rewardToken, bonusRewardToken, pool, startTime, endTime],
                        +selectedNFT.id
                    )
                } else {

                    console.log('[FINITE]', [rewardToken, bonusRewardToken, pool, startTime, endTime],
                        +selectedNFT.id)
                    result = await farmingCenterContract.enterFarming(
                        [rewardToken, bonusRewardToken, pool, startTime, endTime],
                        +selectedNFT.id
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
                throw new Error('Staking ' + current + " " + err.message)
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
                    selectedNFT.id
                )

                addTransaction(result, {
                    summary: `NFT #${selectedNFT.id} was transferred!`
                })

                setTransfered({ hash: result.hash, id: selectedNFT.id })

            }

        } catch (err) {
            setTransfered('failed')
            if (err.code !== 4001) {
                throw new Error('Staking ' + current + " " + err.message)
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

                // const nftMulticall = nonFunPosManInterface.encodeFunctionData('multicall', [
                //     [approveData, transferData]
                // ])

                const result = await nonFunPosManContract.multicall([
                    approveData, transferData
                ])

                addTransaction(result, {
                    summary: `NFT #${selectedNFT.id} was approved!`
                })

                setApproved({ hash: result.hash, id: selectedNFT.id })

            }

        } catch (err) {
            setApproved('failed')
            if (err.code !== 4001) {
                throw new Error('Approving NFT ' + current + " " + err.message)
            }
        }

    }, [account, chainId])

    const sendNFTL2Handler = useCallback(async (recipient: string, l2TokenId: string) => {

        if (!account || !provider) return

        setSendNFTL2(null)

        try {

            console.log('L2 TOKEN ID', l2TokenId)

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
            ])

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
        getRewardsHandler,
        getRewardsHash,
        withdrawHandler,
        withdrawnHash,
        claimRewardsHandler,
        claimRewardHash,
        sendNFTL2Handler,
        sendNFTL2Hash,
        eternalCollectRewardHandler,
        eternalCollectRewardHash,
    }
}