import { BigNumber, Wallet, Contract, ContractTransaction } from 'ethers'
import { TestERC20 } from '../../typechain'
import { FeeAmount } from '../shared'

export module HelperTypes {
  export type CommandFunction<Input, Output> = (input: Input) => Promise<Output>

  export module CreateIncentive {
    export type Args = {
      rewardToken: TestERC20
      bonusRewardToken: TestERC20
      poolAddress: string
      startTime: number
      endTime?: number
      totalReward: BigNumber
      bonusReward: BigNumber
      enterStartTime?: BigNumber
      
      algbAmountForTier1?: BigNumber
      algbAmountForTier2?: BigNumber
      algbAmountForTier3?: BigNumber
      tier1Multiplier?: BigNumber
      tier2Multiplier?: BigNumber
      tier3Multiplier?: BigNumber
      multiplierToken?: string 

      eternal? : boolean
      rewardRate?: BigNumber,
      bonusRewardRate?: BigNumber
      minimalPositionWidth?: number
    }
    export type Result = {
      poolAddress: string
      rewardToken: TestERC20
      bonusRewardToken: TestERC20
      bonusReward: BigNumber
      totalReward: BigNumber
      startTime: number
      endTime: number
      virtualPool: Contract
    }


    export type Command = CommandFunction<Args, Result>
  }

  export module MintDepositFarm {
    export type Args = {
      lp: Wallet
      tokensToFarm: [TestERC20, TestERC20]
      amountsToFarm: [BigNumber, BigNumber]
      ticks: [number, number]
      createIncentiveResult: CreateIncentive.Result
      eternal?: boolean
      tokensLocked?: BigNumber
    }

    export type Result = {
      lp: Wallet
      tokenId: string
      farmdAt: number
    }

    export type Command = CommandFunction<Args, Result>
  }

  export module Mint {
    type Args = {
      lp: Wallet
      tokens: [TestERC20, TestERC20]
      amounts?: [BigNumber, BigNumber]
      fee?: FeeAmount
      tickLower?: number
      tickUpper?: number
    }

    export type Result = {
      lp: Wallet
      tokenId: string
    }

    export type Command = CommandFunction<Args, Result>
  }

  export module Deposit {
    type Args = {
      lp: Wallet
      tokenId: string
    }
    type Result = void
    export type Command = CommandFunction<Args, Result>
  }

  export module exitFarmingCollectBurn {
    type Args = {
      lp: Wallet
      tokenId: string
      createIncentiveResult: CreateIncentive.Result
    }
    export type Result = {
      balance: BigNumber
      exitFarmingdAt: number
    }

    export type Command = CommandFunction<Args, Result>
  }

  export module EndIncentive {
    type Args = {
      createIncentiveResult: CreateIncentive.Result
    }

    type Result = {
      amountReturnedToCreator: BigNumber
    }

    export type Command = CommandFunction<Args, Result>
  }

  export module MakeTickGo {
    type Args = {
      direction: 'up' | 'down'
      desiredValue?: number
      trader?: Wallet
    }

    type Result = { currentTick: number }

    export type Command = CommandFunction<Args, Result>
  }

  export module MakeSwapGasCheck {
    type Args = {
      direction: 'up' | 'down'
      desiredValue?: number
      trader?: Wallet
    }

    type Result = ContractTransaction

    export type Command = CommandFunction<Args, Result>
  }

  export module GetIncentiveId {
    type Args = CreateIncentive.Result

    // Returns the incentiveId as bytes32
    type Result = string

    export type Command = CommandFunction<Args, Result>
  }
}
