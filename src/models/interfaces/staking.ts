import { FactorySubgraph, StakeSubgraph } from './responseSubgraph'

export interface StakingData extends FactorySubgraph, StakeSubgraph{
  factories: FactorySubgraph[]
  stakes: StakeSubgraph[]
}

export interface StakeHash {
  hash: string
}