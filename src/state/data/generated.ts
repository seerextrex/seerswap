import { api } from './slice';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  BigDecimal: any;
  BigInt: any;
  Bytes: any;
  /**
   * 8 bytes signed integer
   *
   */
  Int8: any;
  /**
   * A string representation of microseconds UNIX timestamp (16 digits)
   *
   */
  Timestamp: any;
};




export enum Aggregation_Interval {
  Day = 'day',
  Hour = 'hour'
}

export type AlgebraDayData = {
  __typename?: 'AlgebraDayData';
  date: Scalars['Int'];
  feesUSD: Scalars['BigDecimal'];
  id: Scalars['ID'];
  tvlUSD: Scalars['BigDecimal'];
  txCount: Scalars['BigInt'];
  volumeMatic: Scalars['BigDecimal'];
  volumeUSD: Scalars['BigDecimal'];
  volumeUSDUntracked: Scalars['BigDecimal'];
};

export type AlgebraDayData_Filter = {
  /** Filter for the block changed event. */
  _change_block?: Maybe<BlockChangedFilter>;
  and?: Maybe<Array<Maybe<AlgebraDayData_Filter>>>;
  date?: Maybe<Scalars['Int']>;
  date_gt?: Maybe<Scalars['Int']>;
  date_gte?: Maybe<Scalars['Int']>;
  date_in?: Maybe<Array<Scalars['Int']>>;
  date_lt?: Maybe<Scalars['Int']>;
  date_lte?: Maybe<Scalars['Int']>;
  date_not?: Maybe<Scalars['Int']>;
  date_not_in?: Maybe<Array<Scalars['Int']>>;
  feesUSD?: Maybe<Scalars['BigDecimal']>;
  feesUSD_gt?: Maybe<Scalars['BigDecimal']>;
  feesUSD_gte?: Maybe<Scalars['BigDecimal']>;
  feesUSD_in?: Maybe<Array<Scalars['BigDecimal']>>;
  feesUSD_lt?: Maybe<Scalars['BigDecimal']>;
  feesUSD_lte?: Maybe<Scalars['BigDecimal']>;
  feesUSD_not?: Maybe<Scalars['BigDecimal']>;
  feesUSD_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
  id?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_lt?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
  or?: Maybe<Array<Maybe<AlgebraDayData_Filter>>>;
  tvlUSD?: Maybe<Scalars['BigDecimal']>;
  tvlUSD_gt?: Maybe<Scalars['BigDecimal']>;
  tvlUSD_gte?: Maybe<Scalars['BigDecimal']>;
  tvlUSD_in?: Maybe<Array<Scalars['BigDecimal']>>;
  tvlUSD_lt?: Maybe<Scalars['BigDecimal']>;
  tvlUSD_lte?: Maybe<Scalars['BigDecimal']>;
  tvlUSD_not?: Maybe<Scalars['BigDecimal']>;
  tvlUSD_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
  txCount?: Maybe<Scalars['BigInt']>;
  txCount_gt?: Maybe<Scalars['BigInt']>;
  txCount_gte?: Maybe<Scalars['BigInt']>;
  txCount_in?: Maybe<Array<Scalars['BigInt']>>;
  txCount_lt?: Maybe<Scalars['BigInt']>;
  txCount_lte?: Maybe<Scalars['BigInt']>;
  txCount_not?: Maybe<Scalars['BigInt']>;
  txCount_not_in?: Maybe<Array<Scalars['BigInt']>>;
  volumeMatic?: Maybe<Scalars['BigDecimal']>;
  volumeMatic_gt?: Maybe<Scalars['BigDecimal']>;
  volumeMatic_gte?: Maybe<Scalars['BigDecimal']>;
  volumeMatic_in?: Maybe<Array<Scalars['BigDecimal']>>;
  volumeMatic_lt?: Maybe<Scalars['BigDecimal']>;
  volumeMatic_lte?: Maybe<Scalars['BigDecimal']>;
  volumeMatic_not?: Maybe<Scalars['BigDecimal']>;
  volumeMatic_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
  volumeUSD?: Maybe<Scalars['BigDecimal']>;
  volumeUSDUntracked?: Maybe<Scalars['BigDecimal']>;
  volumeUSDUntracked_gt?: Maybe<Scalars['BigDecimal']>;
  volumeUSDUntracked_gte?: Maybe<Scalars['BigDecimal']>;
  volumeUSDUntracked_in?: Maybe<Array<Scalars['BigDecimal']>>;
  volumeUSDUntracked_lt?: Maybe<Scalars['BigDecimal']>;
  volumeUSDUntracked_lte?: Maybe<Scalars['BigDecimal']>;
  volumeUSDUntracked_not?: Maybe<Scalars['BigDecimal']>;
  volumeUSDUntracked_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
  volumeUSD_gt?: Maybe<Scalars['BigDecimal']>;
  volumeUSD_gte?: Maybe<Scalars['BigDecimal']>;
  volumeUSD_in?: Maybe<Array<Scalars['BigDecimal']>>;
  volumeUSD_lt?: Maybe<Scalars['BigDecimal']>;
  volumeUSD_lte?: Maybe<Scalars['BigDecimal']>;
  volumeUSD_not?: Maybe<Scalars['BigDecimal']>;
  volumeUSD_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
};

export enum AlgebraDayData_OrderBy {
  Date = 'date',
  FeesUsd = 'feesUSD',
  Id = 'id',
  TvlUsd = 'tvlUSD',
  TxCount = 'txCount',
  VolumeMatic = 'volumeMatic',
  VolumeUsd = 'volumeUSD',
  VolumeUsdUntracked = 'volumeUSDUntracked'
}

export type Arbitrator = {
  __typename?: 'Arbitrator';
  /** The address of the arbitrator */
  id: Scalars['ID'];
};

export type ArbitratorMetadata = {
  __typename?: 'ArbitratorMetadata';
  /** The arbitrator address */
  id: Scalars['Bytes'];
  /** The current arbitrator meta evidence URI */
  registrationMetaEvidenceURI: Scalars['String'];
};

export type ArbitratorMetadata_Filter = {
  /** Filter for the block changed event. */
  _change_block?: Maybe<BlockChangedFilter>;
  and?: Maybe<Array<Maybe<ArbitratorMetadata_Filter>>>;
  id?: Maybe<Scalars['Bytes']>;
  id_contains?: Maybe<Scalars['Bytes']>;
  id_gt?: Maybe<Scalars['Bytes']>;
  id_gte?: Maybe<Scalars['Bytes']>;
  id_in?: Maybe<Array<Scalars['Bytes']>>;
  id_lt?: Maybe<Scalars['Bytes']>;
  id_lte?: Maybe<Scalars['Bytes']>;
  id_not?: Maybe<Scalars['Bytes']>;
  id_not_contains?: Maybe<Scalars['Bytes']>;
  id_not_in?: Maybe<Array<Scalars['Bytes']>>;
  or?: Maybe<Array<Maybe<ArbitratorMetadata_Filter>>>;
  registrationMetaEvidenceURI?: Maybe<Scalars['String']>;
  registrationMetaEvidenceURI_contains?: Maybe<Scalars['String']>;
  registrationMetaEvidenceURI_contains_nocase?: Maybe<Scalars['String']>;
  registrationMetaEvidenceURI_ends_with?: Maybe<Scalars['String']>;
  registrationMetaEvidenceURI_ends_with_nocase?: Maybe<Scalars['String']>;
  registrationMetaEvidenceURI_gt?: Maybe<Scalars['String']>;
  registrationMetaEvidenceURI_gte?: Maybe<Scalars['String']>;
  registrationMetaEvidenceURI_in?: Maybe<Array<Scalars['String']>>;
  registrationMetaEvidenceURI_lt?: Maybe<Scalars['String']>;
  registrationMetaEvidenceURI_lte?: Maybe<Scalars['String']>;
  registrationMetaEvidenceURI_not?: Maybe<Scalars['String']>;
  registrationMetaEvidenceURI_not_contains?: Maybe<Scalars['String']>;
  registrationMetaEvidenceURI_not_contains_nocase?: Maybe<Scalars['String']>;
  registrationMetaEvidenceURI_not_ends_with?: Maybe<Scalars['String']>;
  registrationMetaEvidenceURI_not_ends_with_nocase?: Maybe<Scalars['String']>;
  registrationMetaEvidenceURI_not_in?: Maybe<Array<Scalars['String']>>;
  registrationMetaEvidenceURI_not_starts_with?: Maybe<Scalars['String']>;
  registrationMetaEvidenceURI_not_starts_with_nocase?: Maybe<Scalars['String']>;
  registrationMetaEvidenceURI_starts_with?: Maybe<Scalars['String']>;
  registrationMetaEvidenceURI_starts_with_nocase?: Maybe<Scalars['String']>;
};

export enum ArbitratorMetadata_OrderBy {
  Id = 'id',
  RegistrationMetaEvidenceUri = 'registrationMetaEvidenceURI'
}

export type Arbitrator_Filter = {
  /** Filter for the block changed event. */
  _change_block?: Maybe<BlockChangedFilter>;
  and?: Maybe<Array<Maybe<Arbitrator_Filter>>>;
  id?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_lt?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
  or?: Maybe<Array<Maybe<Arbitrator_Filter>>>;
};

export enum Arbitrator_OrderBy {
  Id = 'id'
}



export type Block = {
  __typename?: 'Block';
  author?: Maybe<Scalars['String']>;
  difficulty?: Maybe<Scalars['BigInt']>;
  gasLimit?: Maybe<Scalars['BigInt']>;
  gasUsed?: Maybe<Scalars['BigInt']>;
  id: Scalars['ID'];
  number: Scalars['BigInt'];
  parentHash?: Maybe<Scalars['String']>;
  receiptsRoot?: Maybe<Scalars['String']>;
  size?: Maybe<Scalars['BigInt']>;
  stateRoot?: Maybe<Scalars['String']>;
  timestamp: Scalars['BigInt'];
  totalDifficulty?: Maybe<Scalars['BigInt']>;
  transactionsRoot?: Maybe<Scalars['String']>;
  unclesHash?: Maybe<Scalars['String']>;
};

export type BlockChangedFilter = {
  number_gte: Scalars['Int'];
};

export type Block_Filter = {
  /** Filter for the block changed event. */
  _change_block?: Maybe<BlockChangedFilter>;
  and?: Maybe<Array<Maybe<Block_Filter>>>;
  author?: Maybe<Scalars['String']>;
  author_contains?: Maybe<Scalars['String']>;
  author_contains_nocase?: Maybe<Scalars['String']>;
  author_ends_with?: Maybe<Scalars['String']>;
  author_ends_with_nocase?: Maybe<Scalars['String']>;
  author_gt?: Maybe<Scalars['String']>;
  author_gte?: Maybe<Scalars['String']>;
  author_in?: Maybe<Array<Scalars['String']>>;
  author_lt?: Maybe<Scalars['String']>;
  author_lte?: Maybe<Scalars['String']>;
  author_not?: Maybe<Scalars['String']>;
  author_not_contains?: Maybe<Scalars['String']>;
  author_not_contains_nocase?: Maybe<Scalars['String']>;
  author_not_ends_with?: Maybe<Scalars['String']>;
  author_not_ends_with_nocase?: Maybe<Scalars['String']>;
  author_not_in?: Maybe<Array<Scalars['String']>>;
  author_not_starts_with?: Maybe<Scalars['String']>;
  author_not_starts_with_nocase?: Maybe<Scalars['String']>;
  author_starts_with?: Maybe<Scalars['String']>;
  author_starts_with_nocase?: Maybe<Scalars['String']>;
  difficulty?: Maybe<Scalars['BigInt']>;
  difficulty_gt?: Maybe<Scalars['BigInt']>;
  difficulty_gte?: Maybe<Scalars['BigInt']>;
  difficulty_in?: Maybe<Array<Scalars['BigInt']>>;
  difficulty_lt?: Maybe<Scalars['BigInt']>;
  difficulty_lte?: Maybe<Scalars['BigInt']>;
  difficulty_not?: Maybe<Scalars['BigInt']>;
  difficulty_not_in?: Maybe<Array<Scalars['BigInt']>>;
  gasLimit?: Maybe<Scalars['BigInt']>;
  gasLimit_gt?: Maybe<Scalars['BigInt']>;
  gasLimit_gte?: Maybe<Scalars['BigInt']>;
  gasLimit_in?: Maybe<Array<Scalars['BigInt']>>;
  gasLimit_lt?: Maybe<Scalars['BigInt']>;
  gasLimit_lte?: Maybe<Scalars['BigInt']>;
  gasLimit_not?: Maybe<Scalars['BigInt']>;
  gasLimit_not_in?: Maybe<Array<Scalars['BigInt']>>;
  gasUsed?: Maybe<Scalars['BigInt']>;
  gasUsed_gt?: Maybe<Scalars['BigInt']>;
  gasUsed_gte?: Maybe<Scalars['BigInt']>;
  gasUsed_in?: Maybe<Array<Scalars['BigInt']>>;
  gasUsed_lt?: Maybe<Scalars['BigInt']>;
  gasUsed_lte?: Maybe<Scalars['BigInt']>;
  gasUsed_not?: Maybe<Scalars['BigInt']>;
  gasUsed_not_in?: Maybe<Array<Scalars['BigInt']>>;
  id?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_lt?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
  number?: Maybe<Scalars['BigInt']>;
  number_gt?: Maybe<Scalars['BigInt']>;
  number_gte?: Maybe<Scalars['BigInt']>;
  number_in?: Maybe<Array<Scalars['BigInt']>>;
  number_lt?: Maybe<Scalars['BigInt']>;
  number_lte?: Maybe<Scalars['BigInt']>;
  number_not?: Maybe<Scalars['BigInt']>;
  number_not_in?: Maybe<Array<Scalars['BigInt']>>;
  or?: Maybe<Array<Maybe<Block_Filter>>>;
  parentHash?: Maybe<Scalars['String']>;
  parentHash_contains?: Maybe<Scalars['String']>;
  parentHash_contains_nocase?: Maybe<Scalars['String']>;
  parentHash_ends_with?: Maybe<Scalars['String']>;
  parentHash_ends_with_nocase?: Maybe<Scalars['String']>;
  parentHash_gt?: Maybe<Scalars['String']>;
  parentHash_gte?: Maybe<Scalars['String']>;
  parentHash_in?: Maybe<Array<Scalars['String']>>;
  parentHash_lt?: Maybe<Scalars['String']>;
  parentHash_lte?: Maybe<Scalars['String']>;
  parentHash_not?: Maybe<Scalars['String']>;
  parentHash_not_contains?: Maybe<Scalars['String']>;
  parentHash_not_contains_nocase?: Maybe<Scalars['String']>;
  parentHash_not_ends_with?: Maybe<Scalars['String']>;
  parentHash_not_ends_with_nocase?: Maybe<Scalars['String']>;
  parentHash_not_in?: Maybe<Array<Scalars['String']>>;
  parentHash_not_starts_with?: Maybe<Scalars['String']>;
  parentHash_not_starts_with_nocase?: Maybe<Scalars['String']>;
  parentHash_starts_with?: Maybe<Scalars['String']>;
  parentHash_starts_with_nocase?: Maybe<Scalars['String']>;
  receiptsRoot?: Maybe<Scalars['String']>;
  receiptsRoot_contains?: Maybe<Scalars['String']>;
  receiptsRoot_contains_nocase?: Maybe<Scalars['String']>;
  receiptsRoot_ends_with?: Maybe<Scalars['String']>;
  receiptsRoot_ends_with_nocase?: Maybe<Scalars['String']>;
  receiptsRoot_gt?: Maybe<Scalars['String']>;
  receiptsRoot_gte?: Maybe<Scalars['String']>;
  receiptsRoot_in?: Maybe<Array<Scalars['String']>>;
  receiptsRoot_lt?: Maybe<Scalars['String']>;
  receiptsRoot_lte?: Maybe<Scalars['String']>;
  receiptsRoot_not?: Maybe<Scalars['String']>;
  receiptsRoot_not_contains?: Maybe<Scalars['String']>;
  receiptsRoot_not_contains_nocase?: Maybe<Scalars['String']>;
  receiptsRoot_not_ends_with?: Maybe<Scalars['String']>;
  receiptsRoot_not_ends_with_nocase?: Maybe<Scalars['String']>;
  receiptsRoot_not_in?: Maybe<Array<Scalars['String']>>;
  receiptsRoot_not_starts_with?: Maybe<Scalars['String']>;
  receiptsRoot_not_starts_with_nocase?: Maybe<Scalars['String']>;
  receiptsRoot_starts_with?: Maybe<Scalars['String']>;
  receiptsRoot_starts_with_nocase?: Maybe<Scalars['String']>;
  size?: Maybe<Scalars['BigInt']>;
  size_gt?: Maybe<Scalars['BigInt']>;
  size_gte?: Maybe<Scalars['BigInt']>;
  size_in?: Maybe<Array<Scalars['BigInt']>>;
  size_lt?: Maybe<Scalars['BigInt']>;
  size_lte?: Maybe<Scalars['BigInt']>;
  size_not?: Maybe<Scalars['BigInt']>;
  size_not_in?: Maybe<Array<Scalars['BigInt']>>;
  stateRoot?: Maybe<Scalars['String']>;
  stateRoot_contains?: Maybe<Scalars['String']>;
  stateRoot_contains_nocase?: Maybe<Scalars['String']>;
  stateRoot_ends_with?: Maybe<Scalars['String']>;
  stateRoot_ends_with_nocase?: Maybe<Scalars['String']>;
  stateRoot_gt?: Maybe<Scalars['String']>;
  stateRoot_gte?: Maybe<Scalars['String']>;
  stateRoot_in?: Maybe<Array<Scalars['String']>>;
  stateRoot_lt?: Maybe<Scalars['String']>;
  stateRoot_lte?: Maybe<Scalars['String']>;
  stateRoot_not?: Maybe<Scalars['String']>;
  stateRoot_not_contains?: Maybe<Scalars['String']>;
  stateRoot_not_contains_nocase?: Maybe<Scalars['String']>;
  stateRoot_not_ends_with?: Maybe<Scalars['String']>;
  stateRoot_not_ends_with_nocase?: Maybe<Scalars['String']>;
  stateRoot_not_in?: Maybe<Array<Scalars['String']>>;
  stateRoot_not_starts_with?: Maybe<Scalars['String']>;
  stateRoot_not_starts_with_nocase?: Maybe<Scalars['String']>;
  stateRoot_starts_with?: Maybe<Scalars['String']>;
  stateRoot_starts_with_nocase?: Maybe<Scalars['String']>;
  timestamp?: Maybe<Scalars['BigInt']>;
  timestamp_gt?: Maybe<Scalars['BigInt']>;
  timestamp_gte?: Maybe<Scalars['BigInt']>;
  timestamp_in?: Maybe<Array<Scalars['BigInt']>>;
  timestamp_lt?: Maybe<Scalars['BigInt']>;
  timestamp_lte?: Maybe<Scalars['BigInt']>;
  timestamp_not?: Maybe<Scalars['BigInt']>;
  timestamp_not_in?: Maybe<Array<Scalars['BigInt']>>;
  totalDifficulty?: Maybe<Scalars['BigInt']>;
  totalDifficulty_gt?: Maybe<Scalars['BigInt']>;
  totalDifficulty_gte?: Maybe<Scalars['BigInt']>;
  totalDifficulty_in?: Maybe<Array<Scalars['BigInt']>>;
  totalDifficulty_lt?: Maybe<Scalars['BigInt']>;
  totalDifficulty_lte?: Maybe<Scalars['BigInt']>;
  totalDifficulty_not?: Maybe<Scalars['BigInt']>;
  totalDifficulty_not_in?: Maybe<Array<Scalars['BigInt']>>;
  transactionsRoot?: Maybe<Scalars['String']>;
  transactionsRoot_contains?: Maybe<Scalars['String']>;
  transactionsRoot_contains_nocase?: Maybe<Scalars['String']>;
  transactionsRoot_ends_with?: Maybe<Scalars['String']>;
  transactionsRoot_ends_with_nocase?: Maybe<Scalars['String']>;
  transactionsRoot_gt?: Maybe<Scalars['String']>;
  transactionsRoot_gte?: Maybe<Scalars['String']>;
  transactionsRoot_in?: Maybe<Array<Scalars['String']>>;
  transactionsRoot_lt?: Maybe<Scalars['String']>;
  transactionsRoot_lte?: Maybe<Scalars['String']>;
  transactionsRoot_not?: Maybe<Scalars['String']>;
  transactionsRoot_not_contains?: Maybe<Scalars['String']>;
  transactionsRoot_not_contains_nocase?: Maybe<Scalars['String']>;
  transactionsRoot_not_ends_with?: Maybe<Scalars['String']>;
  transactionsRoot_not_ends_with_nocase?: Maybe<Scalars['String']>;
  transactionsRoot_not_in?: Maybe<Array<Scalars['String']>>;
  transactionsRoot_not_starts_with?: Maybe<Scalars['String']>;
  transactionsRoot_not_starts_with_nocase?: Maybe<Scalars['String']>;
  transactionsRoot_starts_with?: Maybe<Scalars['String']>;
  transactionsRoot_starts_with_nocase?: Maybe<Scalars['String']>;
  unclesHash?: Maybe<Scalars['String']>;
  unclesHash_contains?: Maybe<Scalars['String']>;
  unclesHash_contains_nocase?: Maybe<Scalars['String']>;
  unclesHash_ends_with?: Maybe<Scalars['String']>;
  unclesHash_ends_with_nocase?: Maybe<Scalars['String']>;
  unclesHash_gt?: Maybe<Scalars['String']>;
  unclesHash_gte?: Maybe<Scalars['String']>;
  unclesHash_in?: Maybe<Array<Scalars['String']>>;
  unclesHash_lt?: Maybe<Scalars['String']>;
  unclesHash_lte?: Maybe<Scalars['String']>;
  unclesHash_not?: Maybe<Scalars['String']>;
  unclesHash_not_contains?: Maybe<Scalars['String']>;
  unclesHash_not_contains_nocase?: Maybe<Scalars['String']>;
  unclesHash_not_ends_with?: Maybe<Scalars['String']>;
  unclesHash_not_ends_with_nocase?: Maybe<Scalars['String']>;
  unclesHash_not_in?: Maybe<Array<Scalars['String']>>;
  unclesHash_not_starts_with?: Maybe<Scalars['String']>;
  unclesHash_not_starts_with_nocase?: Maybe<Scalars['String']>;
  unclesHash_starts_with?: Maybe<Scalars['String']>;
  unclesHash_starts_with_nocase?: Maybe<Scalars['String']>;
};

export type Block_Height = {
  hash?: Maybe<Scalars['Bytes']>;
  number?: Maybe<Scalars['Int']>;
  number_gte?: Maybe<Scalars['Int']>;
};

export enum Block_OrderBy {
  Author = 'author',
  Difficulty = 'difficulty',
  GasLimit = 'gasLimit',
  GasUsed = 'gasUsed',
  Id = 'id',
  Number = 'number',
  ParentHash = 'parentHash',
  ReceiptsRoot = 'receiptsRoot',
  Size = 'size',
  StateRoot = 'stateRoot',
  Timestamp = 'timestamp',
  TotalDifficulty = 'totalDifficulty',
  TransactionsRoot = 'transactionsRoot',
  UnclesHash = 'unclesHash'
}

export type Burn = {
  __typename?: 'Burn';
  amount: Scalars['BigInt'];
  amount0: Scalars['BigDecimal'];
  amount1: Scalars['BigDecimal'];
  amountUSD?: Maybe<Scalars['BigDecimal']>;
  id: Scalars['ID'];
  logIndex?: Maybe<Scalars['BigInt']>;
  origin: Scalars['Bytes'];
  owner?: Maybe<Scalars['Bytes']>;
  pool: Pool;
  tickLower: Scalars['BigInt'];
  tickUpper: Scalars['BigInt'];
  timestamp: Scalars['BigInt'];
  token0: Token;
  token1: Token;
  transaction: Transaction;
};

export type Burn_Filter = {
  /** Filter for the block changed event. */
  _change_block?: Maybe<BlockChangedFilter>;
  amount?: Maybe<Scalars['BigInt']>;
  amount0?: Maybe<Scalars['BigDecimal']>;
  amount0_gt?: Maybe<Scalars['BigDecimal']>;
  amount0_gte?: Maybe<Scalars['BigDecimal']>;
  amount0_in?: Maybe<Array<Scalars['BigDecimal']>>;
  amount0_lt?: Maybe<Scalars['BigDecimal']>;
  amount0_lte?: Maybe<Scalars['BigDecimal']>;
  amount0_not?: Maybe<Scalars['BigDecimal']>;
  amount0_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
  amount1?: Maybe<Scalars['BigDecimal']>;
  amount1_gt?: Maybe<Scalars['BigDecimal']>;
  amount1_gte?: Maybe<Scalars['BigDecimal']>;
  amount1_in?: Maybe<Array<Scalars['BigDecimal']>>;
  amount1_lt?: Maybe<Scalars['BigDecimal']>;
  amount1_lte?: Maybe<Scalars['BigDecimal']>;
  amount1_not?: Maybe<Scalars['BigDecimal']>;
  amount1_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
  amountUSD?: Maybe<Scalars['BigDecimal']>;
  amountUSD_gt?: Maybe<Scalars['BigDecimal']>;
  amountUSD_gte?: Maybe<Scalars['BigDecimal']>;
  amountUSD_in?: Maybe<Array<Scalars['BigDecimal']>>;
  amountUSD_lt?: Maybe<Scalars['BigDecimal']>;
  amountUSD_lte?: Maybe<Scalars['BigDecimal']>;
  amountUSD_not?: Maybe<Scalars['BigDecimal']>;
  amountUSD_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
  amount_gt?: Maybe<Scalars['BigInt']>;
  amount_gte?: Maybe<Scalars['BigInt']>;
  amount_in?: Maybe<Array<Scalars['BigInt']>>;
  amount_lt?: Maybe<Scalars['BigInt']>;
  amount_lte?: Maybe<Scalars['BigInt']>;
  amount_not?: Maybe<Scalars['BigInt']>;
  amount_not_in?: Maybe<Array<Scalars['BigInt']>>;
  and?: Maybe<Array<Maybe<Burn_Filter>>>;
  id?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_lt?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
  logIndex?: Maybe<Scalars['BigInt']>;
  logIndex_gt?: Maybe<Scalars['BigInt']>;
  logIndex_gte?: Maybe<Scalars['BigInt']>;
  logIndex_in?: Maybe<Array<Scalars['BigInt']>>;
  logIndex_lt?: Maybe<Scalars['BigInt']>;
  logIndex_lte?: Maybe<Scalars['BigInt']>;
  logIndex_not?: Maybe<Scalars['BigInt']>;
  logIndex_not_in?: Maybe<Array<Scalars['BigInt']>>;
  or?: Maybe<Array<Maybe<Burn_Filter>>>;
  origin?: Maybe<Scalars['Bytes']>;
  origin_contains?: Maybe<Scalars['Bytes']>;
  origin_gt?: Maybe<Scalars['Bytes']>;
  origin_gte?: Maybe<Scalars['Bytes']>;
  origin_in?: Maybe<Array<Scalars['Bytes']>>;
  origin_lt?: Maybe<Scalars['Bytes']>;
  origin_lte?: Maybe<Scalars['Bytes']>;
  origin_not?: Maybe<Scalars['Bytes']>;
  origin_not_contains?: Maybe<Scalars['Bytes']>;
  origin_not_in?: Maybe<Array<Scalars['Bytes']>>;
  owner?: Maybe<Scalars['Bytes']>;
  owner_contains?: Maybe<Scalars['Bytes']>;
  owner_gt?: Maybe<Scalars['Bytes']>;
  owner_gte?: Maybe<Scalars['Bytes']>;
  owner_in?: Maybe<Array<Scalars['Bytes']>>;
  owner_lt?: Maybe<Scalars['Bytes']>;
  owner_lte?: Maybe<Scalars['Bytes']>;
  owner_not?: Maybe<Scalars['Bytes']>;
  owner_not_contains?: Maybe<Scalars['Bytes']>;
  owner_not_in?: Maybe<Array<Scalars['Bytes']>>;
  pool?: Maybe<Scalars['String']>;
  pool_?: Maybe<Pool_Filter>;
  pool_contains?: Maybe<Scalars['String']>;
  pool_contains_nocase?: Maybe<Scalars['String']>;
  pool_ends_with?: Maybe<Scalars['String']>;
  pool_ends_with_nocase?: Maybe<Scalars['String']>;
  pool_gt?: Maybe<Scalars['String']>;
  pool_gte?: Maybe<Scalars['String']>;
  pool_in?: Maybe<Array<Scalars['String']>>;
  pool_lt?: Maybe<Scalars['String']>;
  pool_lte?: Maybe<Scalars['String']>;
  pool_not?: Maybe<Scalars['String']>;
  pool_not_contains?: Maybe<Scalars['String']>;
  pool_not_contains_nocase?: Maybe<Scalars['String']>;
  pool_not_ends_with?: Maybe<Scalars['String']>;
  pool_not_ends_with_nocase?: Maybe<Scalars['String']>;
  pool_not_in?: Maybe<Array<Scalars['String']>>;
  pool_not_starts_with?: Maybe<Scalars['String']>;
  pool_not_starts_with_nocase?: Maybe<Scalars['String']>;
  pool_starts_with?: Maybe<Scalars['String']>;
  pool_starts_with_nocase?: Maybe<Scalars['String']>;
  tickLower?: Maybe<Scalars['BigInt']>;
  tickLower_gt?: Maybe<Scalars['BigInt']>;
  tickLower_gte?: Maybe<Scalars['BigInt']>;
  tickLower_in?: Maybe<Array<Scalars['BigInt']>>;
  tickLower_lt?: Maybe<Scalars['BigInt']>;
  tickLower_lte?: Maybe<Scalars['BigInt']>;
  tickLower_not?: Maybe<Scalars['BigInt']>;
  tickLower_not_in?: Maybe<Array<Scalars['BigInt']>>;
  tickUpper?: Maybe<Scalars['BigInt']>;
  tickUpper_gt?: Maybe<Scalars['BigInt']>;
  tickUpper_gte?: Maybe<Scalars['BigInt']>;
  tickUpper_in?: Maybe<Array<Scalars['BigInt']>>;
  tickUpper_lt?: Maybe<Scalars['BigInt']>;
  tickUpper_lte?: Maybe<Scalars['BigInt']>;
  tickUpper_not?: Maybe<Scalars['BigInt']>;
  tickUpper_not_in?: Maybe<Array<Scalars['BigInt']>>;
  timestamp?: Maybe<Scalars['BigInt']>;
  timestamp_gt?: Maybe<Scalars['BigInt']>;
  timestamp_gte?: Maybe<Scalars['BigInt']>;
  timestamp_in?: Maybe<Array<Scalars['BigInt']>>;
  timestamp_lt?: Maybe<Scalars['BigInt']>;
  timestamp_lte?: Maybe<Scalars['BigInt']>;
  timestamp_not?: Maybe<Scalars['BigInt']>;
  timestamp_not_in?: Maybe<Array<Scalars['BigInt']>>;
  token0?: Maybe<Scalars['String']>;
  token0_?: Maybe<Token_Filter>;
  token0_contains?: Maybe<Scalars['String']>;
  token0_contains_nocase?: Maybe<Scalars['String']>;
  token0_ends_with?: Maybe<Scalars['String']>;
  token0_ends_with_nocase?: Maybe<Scalars['String']>;
  token0_gt?: Maybe<Scalars['String']>;
  token0_gte?: Maybe<Scalars['String']>;
  token0_in?: Maybe<Array<Scalars['String']>>;
  token0_lt?: Maybe<Scalars['String']>;
  token0_lte?: Maybe<Scalars['String']>;
  token0_not?: Maybe<Scalars['String']>;
  token0_not_contains?: Maybe<Scalars['String']>;
  token0_not_contains_nocase?: Maybe<Scalars['String']>;
  token0_not_ends_with?: Maybe<Scalars['String']>;
  token0_not_ends_with_nocase?: Maybe<Scalars['String']>;
  token0_not_in?: Maybe<Array<Scalars['String']>>;
  token0_not_starts_with?: Maybe<Scalars['String']>;
  token0_not_starts_with_nocase?: Maybe<Scalars['String']>;
  token0_starts_with?: Maybe<Scalars['String']>;
  token0_starts_with_nocase?: Maybe<Scalars['String']>;
  token1?: Maybe<Scalars['String']>;
  token1_?: Maybe<Token_Filter>;
  token1_contains?: Maybe<Scalars['String']>;
  token1_contains_nocase?: Maybe<Scalars['String']>;
  token1_ends_with?: Maybe<Scalars['String']>;
  token1_ends_with_nocase?: Maybe<Scalars['String']>;
  token1_gt?: Maybe<Scalars['String']>;
  token1_gte?: Maybe<Scalars['String']>;
  token1_in?: Maybe<Array<Scalars['String']>>;
  token1_lt?: Maybe<Scalars['String']>;
  token1_lte?: Maybe<Scalars['String']>;
  token1_not?: Maybe<Scalars['String']>;
  token1_not_contains?: Maybe<Scalars['String']>;
  token1_not_contains_nocase?: Maybe<Scalars['String']>;
  token1_not_ends_with?: Maybe<Scalars['String']>;
  token1_not_ends_with_nocase?: Maybe<Scalars['String']>;
  token1_not_in?: Maybe<Array<Scalars['String']>>;
  token1_not_starts_with?: Maybe<Scalars['String']>;
  token1_not_starts_with_nocase?: Maybe<Scalars['String']>;
  token1_starts_with?: Maybe<Scalars['String']>;
  token1_starts_with_nocase?: Maybe<Scalars['String']>;
  transaction?: Maybe<Scalars['String']>;
  transaction_?: Maybe<Transaction_Filter>;
  transaction_contains?: Maybe<Scalars['String']>;
  transaction_contains_nocase?: Maybe<Scalars['String']>;
  transaction_ends_with?: Maybe<Scalars['String']>;
  transaction_ends_with_nocase?: Maybe<Scalars['String']>;
  transaction_gt?: Maybe<Scalars['String']>;
  transaction_gte?: Maybe<Scalars['String']>;
  transaction_in?: Maybe<Array<Scalars['String']>>;
  transaction_lt?: Maybe<Scalars['String']>;
  transaction_lte?: Maybe<Scalars['String']>;
  transaction_not?: Maybe<Scalars['String']>;
  transaction_not_contains?: Maybe<Scalars['String']>;
  transaction_not_contains_nocase?: Maybe<Scalars['String']>;
  transaction_not_ends_with?: Maybe<Scalars['String']>;
  transaction_not_ends_with_nocase?: Maybe<Scalars['String']>;
  transaction_not_in?: Maybe<Array<Scalars['String']>>;
  transaction_not_starts_with?: Maybe<Scalars['String']>;
  transaction_not_starts_with_nocase?: Maybe<Scalars['String']>;
  transaction_starts_with?: Maybe<Scalars['String']>;
  transaction_starts_with_nocase?: Maybe<Scalars['String']>;
};

export enum Burn_OrderBy {
  Amount = 'amount',
  Amount0 = 'amount0',
  Amount1 = 'amount1',
  AmountUsd = 'amountUSD',
  Id = 'id',
  LogIndex = 'logIndex',
  Origin = 'origin',
  Owner = 'owner',
  Pool = 'pool',
  PoolCollectedFeesToken0 = 'pool__collectedFeesToken0',
  PoolCollectedFeesToken1 = 'pool__collectedFeesToken1',
  PoolCollectedFeesUsd = 'pool__collectedFeesUSD',
  PoolCommunityFee0 = 'pool__communityFee0',
  PoolCommunityFee1 = 'pool__communityFee1',
  PoolCreatedAtBlockNumber = 'pool__createdAtBlockNumber',
  PoolCreatedAtTimestamp = 'pool__createdAtTimestamp',
  PoolFee = 'pool__fee',
  PoolFeeGrowthGlobal0X128 = 'pool__feeGrowthGlobal0X128',
  PoolFeeGrowthGlobal1X128 = 'pool__feeGrowthGlobal1X128',
  PoolFeesToken0 = 'pool__feesToken0',
  PoolFeesToken1 = 'pool__feesToken1',
  PoolFeesUsd = 'pool__feesUSD',
  PoolId = 'pool__id',
  PoolLiquidity = 'pool__liquidity',
  PoolLiquidityProviderCount = 'pool__liquidityProviderCount',
  PoolObservationIndex = 'pool__observationIndex',
  PoolSqrtPrice = 'pool__sqrtPrice',
  PoolTick = 'pool__tick',
  PoolTickSpacing = 'pool__tickSpacing',
  PoolToken0Price = 'pool__token0Price',
  PoolToken1Price = 'pool__token1Price',
  PoolTotalValueLockedMatic = 'pool__totalValueLockedMatic',
  PoolTotalValueLockedToken0 = 'pool__totalValueLockedToken0',
  PoolTotalValueLockedToken1 = 'pool__totalValueLockedToken1',
  PoolTotalValueLockedUsd = 'pool__totalValueLockedUSD',
  PoolTotalValueLockedUsdUntracked = 'pool__totalValueLockedUSDUntracked',
  PoolTxCount = 'pool__txCount',
  PoolUntrackedFeesUsd = 'pool__untrackedFeesUSD',
  PoolUntrackedVolumeUsd = 'pool__untrackedVolumeUSD',
  PoolVolumeToken0 = 'pool__volumeToken0',
  PoolVolumeToken1 = 'pool__volumeToken1',
  PoolVolumeUsd = 'pool__volumeUSD',
  TickLower = 'tickLower',
  TickUpper = 'tickUpper',
  Timestamp = 'timestamp',
  Token0 = 'token0',
  Token0Decimals = 'token0__decimals',
  Token0DerivedMatic = 'token0__derivedMatic',
  Token0FeesUsd = 'token0__feesUSD',
  Token0Id = 'token0__id',
  Token0IsSeer = 'token0__isSeer',
  Token0Name = 'token0__name',
  Token0PoolCount = 'token0__poolCount',
  Token0Symbol = 'token0__symbol',
  Token0TotalSupply = 'token0__totalSupply',
  Token0TotalValueLocked = 'token0__totalValueLocked',
  Token0TotalValueLockedUsd = 'token0__totalValueLockedUSD',
  Token0TotalValueLockedUsdUntracked = 'token0__totalValueLockedUSDUntracked',
  Token0TxCount = 'token0__txCount',
  Token0UntrackedVolumeUsd = 'token0__untrackedVolumeUSD',
  Token0Volume = 'token0__volume',
  Token0VolumeUsd = 'token0__volumeUSD',
  Token1 = 'token1',
  Token1Decimals = 'token1__decimals',
  Token1DerivedMatic = 'token1__derivedMatic',
  Token1FeesUsd = 'token1__feesUSD',
  Token1Id = 'token1__id',
  Token1IsSeer = 'token1__isSeer',
  Token1Name = 'token1__name',
  Token1PoolCount = 'token1__poolCount',
  Token1Symbol = 'token1__symbol',
  Token1TotalSupply = 'token1__totalSupply',
  Token1TotalValueLocked = 'token1__totalValueLocked',
  Token1TotalValueLockedUsd = 'token1__totalValueLockedUSD',
  Token1TotalValueLockedUsdUntracked = 'token1__totalValueLockedUSDUntracked',
  Token1TxCount = 'token1__txCount',
  Token1UntrackedVolumeUsd = 'token1__untrackedVolumeUSD',
  Token1Volume = 'token1__volume',
  Token1VolumeUsd = 'token1__volumeUSD',
  Transaction = 'transaction',
  TransactionBlockNumber = 'transaction__blockNumber',
  TransactionGasLimit = 'transaction__gasLimit',
  TransactionGasPrice = 'transaction__gasPrice',
  TransactionId = 'transaction__id',
  TransactionTimestamp = 'transaction__timestamp'
}


export type Collect = {
  __typename?: 'Collect';
  amount0: Scalars['BigDecimal'];
  amount1: Scalars['BigDecimal'];
  amountUSD?: Maybe<Scalars['BigDecimal']>;
  id: Scalars['ID'];
  logIndex?: Maybe<Scalars['BigInt']>;
  owner?: Maybe<Scalars['Bytes']>;
  pool: Pool;
  tickLower: Scalars['BigInt'];
  tickUpper: Scalars['BigInt'];
  timestamp: Scalars['BigInt'];
  transaction: Transaction;
};

export type Collect_Filter = {
  /** Filter for the block changed event. */
  _change_block?: Maybe<BlockChangedFilter>;
  amount0?: Maybe<Scalars['BigDecimal']>;
  amount0_gt?: Maybe<Scalars['BigDecimal']>;
  amount0_gte?: Maybe<Scalars['BigDecimal']>;
  amount0_in?: Maybe<Array<Scalars['BigDecimal']>>;
  amount0_lt?: Maybe<Scalars['BigDecimal']>;
  amount0_lte?: Maybe<Scalars['BigDecimal']>;
  amount0_not?: Maybe<Scalars['BigDecimal']>;
  amount0_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
  amount1?: Maybe<Scalars['BigDecimal']>;
  amount1_gt?: Maybe<Scalars['BigDecimal']>;
  amount1_gte?: Maybe<Scalars['BigDecimal']>;
  amount1_in?: Maybe<Array<Scalars['BigDecimal']>>;
  amount1_lt?: Maybe<Scalars['BigDecimal']>;
  amount1_lte?: Maybe<Scalars['BigDecimal']>;
  amount1_not?: Maybe<Scalars['BigDecimal']>;
  amount1_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
  amountUSD?: Maybe<Scalars['BigDecimal']>;
  amountUSD_gt?: Maybe<Scalars['BigDecimal']>;
  amountUSD_gte?: Maybe<Scalars['BigDecimal']>;
  amountUSD_in?: Maybe<Array<Scalars['BigDecimal']>>;
  amountUSD_lt?: Maybe<Scalars['BigDecimal']>;
  amountUSD_lte?: Maybe<Scalars['BigDecimal']>;
  amountUSD_not?: Maybe<Scalars['BigDecimal']>;
  amountUSD_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
  and?: Maybe<Array<Maybe<Collect_Filter>>>;
  id?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_lt?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
  logIndex?: Maybe<Scalars['BigInt']>;
  logIndex_gt?: Maybe<Scalars['BigInt']>;
  logIndex_gte?: Maybe<Scalars['BigInt']>;
  logIndex_in?: Maybe<Array<Scalars['BigInt']>>;
  logIndex_lt?: Maybe<Scalars['BigInt']>;
  logIndex_lte?: Maybe<Scalars['BigInt']>;
  logIndex_not?: Maybe<Scalars['BigInt']>;
  logIndex_not_in?: Maybe<Array<Scalars['BigInt']>>;
  or?: Maybe<Array<Maybe<Collect_Filter>>>;
  owner?: Maybe<Scalars['Bytes']>;
  owner_contains?: Maybe<Scalars['Bytes']>;
  owner_gt?: Maybe<Scalars['Bytes']>;
  owner_gte?: Maybe<Scalars['Bytes']>;
  owner_in?: Maybe<Array<Scalars['Bytes']>>;
  owner_lt?: Maybe<Scalars['Bytes']>;
  owner_lte?: Maybe<Scalars['Bytes']>;
  owner_not?: Maybe<Scalars['Bytes']>;
  owner_not_contains?: Maybe<Scalars['Bytes']>;
  owner_not_in?: Maybe<Array<Scalars['Bytes']>>;
  pool?: Maybe<Scalars['String']>;
  pool_?: Maybe<Pool_Filter>;
  pool_contains?: Maybe<Scalars['String']>;
  pool_contains_nocase?: Maybe<Scalars['String']>;
  pool_ends_with?: Maybe<Scalars['String']>;
  pool_ends_with_nocase?: Maybe<Scalars['String']>;
  pool_gt?: Maybe<Scalars['String']>;
  pool_gte?: Maybe<Scalars['String']>;
  pool_in?: Maybe<Array<Scalars['String']>>;
  pool_lt?: Maybe<Scalars['String']>;
  pool_lte?: Maybe<Scalars['String']>;
  pool_not?: Maybe<Scalars['String']>;
  pool_not_contains?: Maybe<Scalars['String']>;
  pool_not_contains_nocase?: Maybe<Scalars['String']>;
  pool_not_ends_with?: Maybe<Scalars['String']>;
  pool_not_ends_with_nocase?: Maybe<Scalars['String']>;
  pool_not_in?: Maybe<Array<Scalars['String']>>;
  pool_not_starts_with?: Maybe<Scalars['String']>;
  pool_not_starts_with_nocase?: Maybe<Scalars['String']>;
  pool_starts_with?: Maybe<Scalars['String']>;
  pool_starts_with_nocase?: Maybe<Scalars['String']>;
  tickLower?: Maybe<Scalars['BigInt']>;
  tickLower_gt?: Maybe<Scalars['BigInt']>;
  tickLower_gte?: Maybe<Scalars['BigInt']>;
  tickLower_in?: Maybe<Array<Scalars['BigInt']>>;
  tickLower_lt?: Maybe<Scalars['BigInt']>;
  tickLower_lte?: Maybe<Scalars['BigInt']>;
  tickLower_not?: Maybe<Scalars['BigInt']>;
  tickLower_not_in?: Maybe<Array<Scalars['BigInt']>>;
  tickUpper?: Maybe<Scalars['BigInt']>;
  tickUpper_gt?: Maybe<Scalars['BigInt']>;
  tickUpper_gte?: Maybe<Scalars['BigInt']>;
  tickUpper_in?: Maybe<Array<Scalars['BigInt']>>;
  tickUpper_lt?: Maybe<Scalars['BigInt']>;
  tickUpper_lte?: Maybe<Scalars['BigInt']>;
  tickUpper_not?: Maybe<Scalars['BigInt']>;
  tickUpper_not_in?: Maybe<Array<Scalars['BigInt']>>;
  timestamp?: Maybe<Scalars['BigInt']>;
  timestamp_gt?: Maybe<Scalars['BigInt']>;
  timestamp_gte?: Maybe<Scalars['BigInt']>;
  timestamp_in?: Maybe<Array<Scalars['BigInt']>>;
  timestamp_lt?: Maybe<Scalars['BigInt']>;
  timestamp_lte?: Maybe<Scalars['BigInt']>;
  timestamp_not?: Maybe<Scalars['BigInt']>;
  timestamp_not_in?: Maybe<Array<Scalars['BigInt']>>;
  transaction?: Maybe<Scalars['String']>;
  transaction_?: Maybe<Transaction_Filter>;
  transaction_contains?: Maybe<Scalars['String']>;
  transaction_contains_nocase?: Maybe<Scalars['String']>;
  transaction_ends_with?: Maybe<Scalars['String']>;
  transaction_ends_with_nocase?: Maybe<Scalars['String']>;
  transaction_gt?: Maybe<Scalars['String']>;
  transaction_gte?: Maybe<Scalars['String']>;
  transaction_in?: Maybe<Array<Scalars['String']>>;
  transaction_lt?: Maybe<Scalars['String']>;
  transaction_lte?: Maybe<Scalars['String']>;
  transaction_not?: Maybe<Scalars['String']>;
  transaction_not_contains?: Maybe<Scalars['String']>;
  transaction_not_contains_nocase?: Maybe<Scalars['String']>;
  transaction_not_ends_with?: Maybe<Scalars['String']>;
  transaction_not_ends_with_nocase?: Maybe<Scalars['String']>;
  transaction_not_in?: Maybe<Array<Scalars['String']>>;
  transaction_not_starts_with?: Maybe<Scalars['String']>;
  transaction_not_starts_with_nocase?: Maybe<Scalars['String']>;
  transaction_starts_with?: Maybe<Scalars['String']>;
  transaction_starts_with_nocase?: Maybe<Scalars['String']>;
};

export enum Collect_OrderBy {
  Amount0 = 'amount0',
  Amount1 = 'amount1',
  AmountUsd = 'amountUSD',
  Id = 'id',
  LogIndex = 'logIndex',
  Owner = 'owner',
  Pool = 'pool',
  PoolCollectedFeesToken0 = 'pool__collectedFeesToken0',
  PoolCollectedFeesToken1 = 'pool__collectedFeesToken1',
  PoolCollectedFeesUsd = 'pool__collectedFeesUSD',
  PoolCommunityFee0 = 'pool__communityFee0',
  PoolCommunityFee1 = 'pool__communityFee1',
  PoolCreatedAtBlockNumber = 'pool__createdAtBlockNumber',
  PoolCreatedAtTimestamp = 'pool__createdAtTimestamp',
  PoolFee = 'pool__fee',
  PoolFeeGrowthGlobal0X128 = 'pool__feeGrowthGlobal0X128',
  PoolFeeGrowthGlobal1X128 = 'pool__feeGrowthGlobal1X128',
  PoolFeesToken0 = 'pool__feesToken0',
  PoolFeesToken1 = 'pool__feesToken1',
  PoolFeesUsd = 'pool__feesUSD',
  PoolId = 'pool__id',
  PoolLiquidity = 'pool__liquidity',
  PoolLiquidityProviderCount = 'pool__liquidityProviderCount',
  PoolObservationIndex = 'pool__observationIndex',
  PoolSqrtPrice = 'pool__sqrtPrice',
  PoolTick = 'pool__tick',
  PoolTickSpacing = 'pool__tickSpacing',
  PoolToken0Price = 'pool__token0Price',
  PoolToken1Price = 'pool__token1Price',
  PoolTotalValueLockedMatic = 'pool__totalValueLockedMatic',
  PoolTotalValueLockedToken0 = 'pool__totalValueLockedToken0',
  PoolTotalValueLockedToken1 = 'pool__totalValueLockedToken1',
  PoolTotalValueLockedUsd = 'pool__totalValueLockedUSD',
  PoolTotalValueLockedUsdUntracked = 'pool__totalValueLockedUSDUntracked',
  PoolTxCount = 'pool__txCount',
  PoolUntrackedFeesUsd = 'pool__untrackedFeesUSD',
  PoolUntrackedVolumeUsd = 'pool__untrackedVolumeUSD',
  PoolVolumeToken0 = 'pool__volumeToken0',
  PoolVolumeToken1 = 'pool__volumeToken1',
  PoolVolumeUsd = 'pool__volumeUSD',
  TickLower = 'tickLower',
  TickUpper = 'tickUpper',
  Timestamp = 'timestamp',
  Transaction = 'transaction',
  TransactionBlockNumber = 'transaction__blockNumber',
  TransactionGasLimit = 'transaction__gasLimit',
  TransactionGasPrice = 'transaction__gasPrice',
  TransactionId = 'transaction__id',
  TransactionTimestamp = 'transaction__timestamp'
}

export type Condition = {
  __typename?: 'Condition';
  /**  Conditional token conditionId  */
  id: Scalars['ID'];
  markets: Array<Market>;
};


export type ConditionMarketsArgs = {
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Market_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  skip?: Maybe<Scalars['Int']>;
  where?: Maybe<Market_Filter>;
};

export type Condition_Filter = {
  /** Filter for the block changed event. */
  _change_block?: Maybe<BlockChangedFilter>;
  and?: Maybe<Array<Maybe<Condition_Filter>>>;
  id?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_lt?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
  markets_?: Maybe<Market_Filter>;
  or?: Maybe<Array<Maybe<Condition_Filter>>>;
};

export enum Condition_OrderBy {
  Id = 'id',
  Markets = 'markets'
}

export type ConditionalEvent = {
  __typename?: 'ConditionalEvent';
  accountId: Scalars['Bytes'];
  amount: Scalars['BigInt'];
  blockNumber: Scalars['BigInt'];
  collateral: Scalars['Bytes'];
  id: Scalars['Bytes'];
  market: Market;
  transactionHash: Scalars['Bytes'];
  type: Scalars['String'];
};

export type ConditionalEvent_Filter = {
  /** Filter for the block changed event. */
  _change_block?: Maybe<BlockChangedFilter>;
  accountId?: Maybe<Scalars['Bytes']>;
  accountId_contains?: Maybe<Scalars['Bytes']>;
  accountId_gt?: Maybe<Scalars['Bytes']>;
  accountId_gte?: Maybe<Scalars['Bytes']>;
  accountId_in?: Maybe<Array<Scalars['Bytes']>>;
  accountId_lt?: Maybe<Scalars['Bytes']>;
  accountId_lte?: Maybe<Scalars['Bytes']>;
  accountId_not?: Maybe<Scalars['Bytes']>;
  accountId_not_contains?: Maybe<Scalars['Bytes']>;
  accountId_not_in?: Maybe<Array<Scalars['Bytes']>>;
  amount?: Maybe<Scalars['BigInt']>;
  amount_gt?: Maybe<Scalars['BigInt']>;
  amount_gte?: Maybe<Scalars['BigInt']>;
  amount_in?: Maybe<Array<Scalars['BigInt']>>;
  amount_lt?: Maybe<Scalars['BigInt']>;
  amount_lte?: Maybe<Scalars['BigInt']>;
  amount_not?: Maybe<Scalars['BigInt']>;
  amount_not_in?: Maybe<Array<Scalars['BigInt']>>;
  and?: Maybe<Array<Maybe<ConditionalEvent_Filter>>>;
  blockNumber?: Maybe<Scalars['BigInt']>;
  blockNumber_gt?: Maybe<Scalars['BigInt']>;
  blockNumber_gte?: Maybe<Scalars['BigInt']>;
  blockNumber_in?: Maybe<Array<Scalars['BigInt']>>;
  blockNumber_lt?: Maybe<Scalars['BigInt']>;
  blockNumber_lte?: Maybe<Scalars['BigInt']>;
  blockNumber_not?: Maybe<Scalars['BigInt']>;
  blockNumber_not_in?: Maybe<Array<Scalars['BigInt']>>;
  collateral?: Maybe<Scalars['Bytes']>;
  collateral_contains?: Maybe<Scalars['Bytes']>;
  collateral_gt?: Maybe<Scalars['Bytes']>;
  collateral_gte?: Maybe<Scalars['Bytes']>;
  collateral_in?: Maybe<Array<Scalars['Bytes']>>;
  collateral_lt?: Maybe<Scalars['Bytes']>;
  collateral_lte?: Maybe<Scalars['Bytes']>;
  collateral_not?: Maybe<Scalars['Bytes']>;
  collateral_not_contains?: Maybe<Scalars['Bytes']>;
  collateral_not_in?: Maybe<Array<Scalars['Bytes']>>;
  id?: Maybe<Scalars['Bytes']>;
  id_contains?: Maybe<Scalars['Bytes']>;
  id_gt?: Maybe<Scalars['Bytes']>;
  id_gte?: Maybe<Scalars['Bytes']>;
  id_in?: Maybe<Array<Scalars['Bytes']>>;
  id_lt?: Maybe<Scalars['Bytes']>;
  id_lte?: Maybe<Scalars['Bytes']>;
  id_not?: Maybe<Scalars['Bytes']>;
  id_not_contains?: Maybe<Scalars['Bytes']>;
  id_not_in?: Maybe<Array<Scalars['Bytes']>>;
  market?: Maybe<Scalars['String']>;
  market_?: Maybe<Market_Filter>;
  market_contains?: Maybe<Scalars['String']>;
  market_contains_nocase?: Maybe<Scalars['String']>;
  market_ends_with?: Maybe<Scalars['String']>;
  market_ends_with_nocase?: Maybe<Scalars['String']>;
  market_gt?: Maybe<Scalars['String']>;
  market_gte?: Maybe<Scalars['String']>;
  market_in?: Maybe<Array<Scalars['String']>>;
  market_lt?: Maybe<Scalars['String']>;
  market_lte?: Maybe<Scalars['String']>;
  market_not?: Maybe<Scalars['String']>;
  market_not_contains?: Maybe<Scalars['String']>;
  market_not_contains_nocase?: Maybe<Scalars['String']>;
  market_not_ends_with?: Maybe<Scalars['String']>;
  market_not_ends_with_nocase?: Maybe<Scalars['String']>;
  market_not_in?: Maybe<Array<Scalars['String']>>;
  market_not_starts_with?: Maybe<Scalars['String']>;
  market_not_starts_with_nocase?: Maybe<Scalars['String']>;
  market_starts_with?: Maybe<Scalars['String']>;
  market_starts_with_nocase?: Maybe<Scalars['String']>;
  or?: Maybe<Array<Maybe<ConditionalEvent_Filter>>>;
  transactionHash?: Maybe<Scalars['Bytes']>;
  transactionHash_contains?: Maybe<Scalars['Bytes']>;
  transactionHash_gt?: Maybe<Scalars['Bytes']>;
  transactionHash_gte?: Maybe<Scalars['Bytes']>;
  transactionHash_in?: Maybe<Array<Scalars['Bytes']>>;
  transactionHash_lt?: Maybe<Scalars['Bytes']>;
  transactionHash_lte?: Maybe<Scalars['Bytes']>;
  transactionHash_not?: Maybe<Scalars['Bytes']>;
  transactionHash_not_contains?: Maybe<Scalars['Bytes']>;
  transactionHash_not_in?: Maybe<Array<Scalars['Bytes']>>;
  type?: Maybe<Scalars['String']>;
  type_contains?: Maybe<Scalars['String']>;
  type_contains_nocase?: Maybe<Scalars['String']>;
  type_ends_with?: Maybe<Scalars['String']>;
  type_ends_with_nocase?: Maybe<Scalars['String']>;
  type_gt?: Maybe<Scalars['String']>;
  type_gte?: Maybe<Scalars['String']>;
  type_in?: Maybe<Array<Scalars['String']>>;
  type_lt?: Maybe<Scalars['String']>;
  type_lte?: Maybe<Scalars['String']>;
  type_not?: Maybe<Scalars['String']>;
  type_not_contains?: Maybe<Scalars['String']>;
  type_not_contains_nocase?: Maybe<Scalars['String']>;
  type_not_ends_with?: Maybe<Scalars['String']>;
  type_not_ends_with_nocase?: Maybe<Scalars['String']>;
  type_not_in?: Maybe<Array<Scalars['String']>>;
  type_not_starts_with?: Maybe<Scalars['String']>;
  type_not_starts_with_nocase?: Maybe<Scalars['String']>;
  type_starts_with?: Maybe<Scalars['String']>;
  type_starts_with_nocase?: Maybe<Scalars['String']>;
};

export enum ConditionalEvent_OrderBy {
  AccountId = 'accountId',
  Amount = 'amount',
  BlockNumber = 'blockNumber',
  Collateral = 'collateral',
  Id = 'id',
  Market = 'market',
  MarketBlockNumber = 'market__blockNumber',
  MarketBlockTimestamp = 'market__blockTimestamp',
  MarketConditionId = 'market__conditionId',
  MarketCreator = 'market__creator',
  MarketFactory = 'market__factory',
  MarketFinalizeTs = 'market__finalizeTs',
  MarketHasAnswers = 'market__hasAnswers',
  MarketId = 'market__id',
  MarketIndex = 'market__index',
  MarketLowerBound = 'market__lowerBound',
  MarketMarketName = 'market__marketName',
  MarketOpeningTs = 'market__openingTs',
  MarketOutcomesSupply = 'market__outcomesSupply',
  MarketParentCollectionId = 'market__parentCollectionId',
  MarketParentOutcome = 'market__parentOutcome',
  MarketPayoutReported = 'market__payoutReported',
  MarketQuestionId = 'market__questionId',
  MarketQuestionsInArbitration = 'market__questionsInArbitration',
  MarketTemplateId = 'market__templateId',
  MarketTotalValueLockedUsd = 'market__totalValueLockedUSD',
  MarketTotalValueLockedUsdUntracked = 'market__totalValueLockedUSDUntracked',
  MarketTransactionHash = 'market__transactionHash',
  MarketType = 'market__type',
  MarketUntrackedVolumeUsd = 'market__untrackedVolumeUSD',
  MarketUpperBound = 'market__upperBound',
  MarketVolume = 'market__volume',
  MarketVolumeUsd = 'market__volumeUSD',
  TransactionHash = 'transactionHash',
  Type = 'type'
}

export type CurateMetadata = {
  __typename?: 'CurateMetadata';
  /** The current removal meta evidence URI */
  clearingMetaEvidenceURI: Scalars['String'];
  /** The registry address */
  id: Scalars['Bytes'];
  /** The number of MetaEvidence event logs emitted. */
  metaEvidenceCount: Scalars['BigInt'];
  /** The current registration meta evidence URI */
  registrationMetaEvidenceURI: Scalars['String'];
};

export type CurateMetadata_Filter = {
  /** Filter for the block changed event. */
  _change_block?: Maybe<BlockChangedFilter>;
  and?: Maybe<Array<Maybe<CurateMetadata_Filter>>>;
  clearingMetaEvidenceURI?: Maybe<Scalars['String']>;
  clearingMetaEvidenceURI_contains?: Maybe<Scalars['String']>;
  clearingMetaEvidenceURI_contains_nocase?: Maybe<Scalars['String']>;
  clearingMetaEvidenceURI_ends_with?: Maybe<Scalars['String']>;
  clearingMetaEvidenceURI_ends_with_nocase?: Maybe<Scalars['String']>;
  clearingMetaEvidenceURI_gt?: Maybe<Scalars['String']>;
  clearingMetaEvidenceURI_gte?: Maybe<Scalars['String']>;
  clearingMetaEvidenceURI_in?: Maybe<Array<Scalars['String']>>;
  clearingMetaEvidenceURI_lt?: Maybe<Scalars['String']>;
  clearingMetaEvidenceURI_lte?: Maybe<Scalars['String']>;
  clearingMetaEvidenceURI_not?: Maybe<Scalars['String']>;
  clearingMetaEvidenceURI_not_contains?: Maybe<Scalars['String']>;
  clearingMetaEvidenceURI_not_contains_nocase?: Maybe<Scalars['String']>;
  clearingMetaEvidenceURI_not_ends_with?: Maybe<Scalars['String']>;
  clearingMetaEvidenceURI_not_ends_with_nocase?: Maybe<Scalars['String']>;
  clearingMetaEvidenceURI_not_in?: Maybe<Array<Scalars['String']>>;
  clearingMetaEvidenceURI_not_starts_with?: Maybe<Scalars['String']>;
  clearingMetaEvidenceURI_not_starts_with_nocase?: Maybe<Scalars['String']>;
  clearingMetaEvidenceURI_starts_with?: Maybe<Scalars['String']>;
  clearingMetaEvidenceURI_starts_with_nocase?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['Bytes']>;
  id_contains?: Maybe<Scalars['Bytes']>;
  id_gt?: Maybe<Scalars['Bytes']>;
  id_gte?: Maybe<Scalars['Bytes']>;
  id_in?: Maybe<Array<Scalars['Bytes']>>;
  id_lt?: Maybe<Scalars['Bytes']>;
  id_lte?: Maybe<Scalars['Bytes']>;
  id_not?: Maybe<Scalars['Bytes']>;
  id_not_contains?: Maybe<Scalars['Bytes']>;
  id_not_in?: Maybe<Array<Scalars['Bytes']>>;
  metaEvidenceCount?: Maybe<Scalars['BigInt']>;
  metaEvidenceCount_gt?: Maybe<Scalars['BigInt']>;
  metaEvidenceCount_gte?: Maybe<Scalars['BigInt']>;
  metaEvidenceCount_in?: Maybe<Array<Scalars['BigInt']>>;
  metaEvidenceCount_lt?: Maybe<Scalars['BigInt']>;
  metaEvidenceCount_lte?: Maybe<Scalars['BigInt']>;
  metaEvidenceCount_not?: Maybe<Scalars['BigInt']>;
  metaEvidenceCount_not_in?: Maybe<Array<Scalars['BigInt']>>;
  or?: Maybe<Array<Maybe<CurateMetadata_Filter>>>;
  registrationMetaEvidenceURI?: Maybe<Scalars['String']>;
  registrationMetaEvidenceURI_contains?: Maybe<Scalars['String']>;
  registrationMetaEvidenceURI_contains_nocase?: Maybe<Scalars['String']>;
  registrationMetaEvidenceURI_ends_with?: Maybe<Scalars['String']>;
  registrationMetaEvidenceURI_ends_with_nocase?: Maybe<Scalars['String']>;
  registrationMetaEvidenceURI_gt?: Maybe<Scalars['String']>;
  registrationMetaEvidenceURI_gte?: Maybe<Scalars['String']>;
  registrationMetaEvidenceURI_in?: Maybe<Array<Scalars['String']>>;
  registrationMetaEvidenceURI_lt?: Maybe<Scalars['String']>;
  registrationMetaEvidenceURI_lte?: Maybe<Scalars['String']>;
  registrationMetaEvidenceURI_not?: Maybe<Scalars['String']>;
  registrationMetaEvidenceURI_not_contains?: Maybe<Scalars['String']>;
  registrationMetaEvidenceURI_not_contains_nocase?: Maybe<Scalars['String']>;
  registrationMetaEvidenceURI_not_ends_with?: Maybe<Scalars['String']>;
  registrationMetaEvidenceURI_not_ends_with_nocase?: Maybe<Scalars['String']>;
  registrationMetaEvidenceURI_not_in?: Maybe<Array<Scalars['String']>>;
  registrationMetaEvidenceURI_not_starts_with?: Maybe<Scalars['String']>;
  registrationMetaEvidenceURI_not_starts_with_nocase?: Maybe<Scalars['String']>;
  registrationMetaEvidenceURI_starts_with?: Maybe<Scalars['String']>;
  registrationMetaEvidenceURI_starts_with_nocase?: Maybe<Scalars['String']>;
};

export enum CurateMetadata_OrderBy {
  ClearingMetaEvidenceUri = 'clearingMetaEvidenceURI',
  Id = 'id',
  MetaEvidenceCount = 'metaEvidenceCount',
  RegistrationMetaEvidenceUri = 'registrationMetaEvidenceURI'
}

export type Deposit = {
  __typename?: 'Deposit';
  L2tokenId: Scalars['BigInt'];
  enteredInEternalFarming?: Maybe<Scalars['BigInt']>;
  eternalFarming?: Maybe<EternalFarming>;
  id: Scalars['ID'];
  limitFarming?: Maybe<LimitFarming>;
  liquidity: Scalars['BigInt'];
  market0?: Maybe<Market>;
  market1?: Maybe<Market>;
  mint: Mint;
  mintUSD: Scalars['BigDecimal'];
  onFarmingCenter: Scalars['Boolean'];
  owner: Scalars['Bytes'];
  pool: Pool;
  rangeLength: Scalars['BigInt'];
  tierEternal: Scalars['BigInt'];
  tierLimit: Scalars['BigInt'];
  tokensLockedEternal: Scalars['BigInt'];
  tokensLockedLimit: Scalars['BigInt'];
};

export type Deposit_Filter = {
  L2tokenId?: Maybe<Scalars['BigInt']>;
  L2tokenId_gt?: Maybe<Scalars['BigInt']>;
  L2tokenId_gte?: Maybe<Scalars['BigInt']>;
  L2tokenId_in?: Maybe<Array<Scalars['BigInt']>>;
  L2tokenId_lt?: Maybe<Scalars['BigInt']>;
  L2tokenId_lte?: Maybe<Scalars['BigInt']>;
  L2tokenId_not?: Maybe<Scalars['BigInt']>;
  L2tokenId_not_in?: Maybe<Array<Scalars['BigInt']>>;
  /** Filter for the block changed event. */
  _change_block?: Maybe<BlockChangedFilter>;
  and?: Maybe<Array<Maybe<Deposit_Filter>>>;
  enteredInEternalFarming?: Maybe<Scalars['BigInt']>;
  enteredInEternalFarming_gt?: Maybe<Scalars['BigInt']>;
  enteredInEternalFarming_gte?: Maybe<Scalars['BigInt']>;
  enteredInEternalFarming_in?: Maybe<Array<Scalars['BigInt']>>;
  enteredInEternalFarming_lt?: Maybe<Scalars['BigInt']>;
  enteredInEternalFarming_lte?: Maybe<Scalars['BigInt']>;
  enteredInEternalFarming_not?: Maybe<Scalars['BigInt']>;
  enteredInEternalFarming_not_in?: Maybe<Array<Scalars['BigInt']>>;
  eternalFarming?: Maybe<Scalars['String']>;
  eternalFarming_?: Maybe<EternalFarming_Filter>;
  eternalFarming_contains?: Maybe<Scalars['String']>;
  eternalFarming_contains_nocase?: Maybe<Scalars['String']>;
  eternalFarming_ends_with?: Maybe<Scalars['String']>;
  eternalFarming_ends_with_nocase?: Maybe<Scalars['String']>;
  eternalFarming_gt?: Maybe<Scalars['String']>;
  eternalFarming_gte?: Maybe<Scalars['String']>;
  eternalFarming_in?: Maybe<Array<Scalars['String']>>;
  eternalFarming_lt?: Maybe<Scalars['String']>;
  eternalFarming_lte?: Maybe<Scalars['String']>;
  eternalFarming_not?: Maybe<Scalars['String']>;
  eternalFarming_not_contains?: Maybe<Scalars['String']>;
  eternalFarming_not_contains_nocase?: Maybe<Scalars['String']>;
  eternalFarming_not_ends_with?: Maybe<Scalars['String']>;
  eternalFarming_not_ends_with_nocase?: Maybe<Scalars['String']>;
  eternalFarming_not_in?: Maybe<Array<Scalars['String']>>;
  eternalFarming_not_starts_with?: Maybe<Scalars['String']>;
  eternalFarming_not_starts_with_nocase?: Maybe<Scalars['String']>;
  eternalFarming_starts_with?: Maybe<Scalars['String']>;
  eternalFarming_starts_with_nocase?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_lt?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
  limitFarming?: Maybe<Scalars['String']>;
  limitFarming_?: Maybe<LimitFarming_Filter>;
  limitFarming_contains?: Maybe<Scalars['String']>;
  limitFarming_contains_nocase?: Maybe<Scalars['String']>;
  limitFarming_ends_with?: Maybe<Scalars['String']>;
  limitFarming_ends_with_nocase?: Maybe<Scalars['String']>;
  limitFarming_gt?: Maybe<Scalars['String']>;
  limitFarming_gte?: Maybe<Scalars['String']>;
  limitFarming_in?: Maybe<Array<Scalars['String']>>;
  limitFarming_lt?: Maybe<Scalars['String']>;
  limitFarming_lte?: Maybe<Scalars['String']>;
  limitFarming_not?: Maybe<Scalars['String']>;
  limitFarming_not_contains?: Maybe<Scalars['String']>;
  limitFarming_not_contains_nocase?: Maybe<Scalars['String']>;
  limitFarming_not_ends_with?: Maybe<Scalars['String']>;
  limitFarming_not_ends_with_nocase?: Maybe<Scalars['String']>;
  limitFarming_not_in?: Maybe<Array<Scalars['String']>>;
  limitFarming_not_starts_with?: Maybe<Scalars['String']>;
  limitFarming_not_starts_with_nocase?: Maybe<Scalars['String']>;
  limitFarming_starts_with?: Maybe<Scalars['String']>;
  limitFarming_starts_with_nocase?: Maybe<Scalars['String']>;
  liquidity?: Maybe<Scalars['BigInt']>;
  liquidity_gt?: Maybe<Scalars['BigInt']>;
  liquidity_gte?: Maybe<Scalars['BigInt']>;
  liquidity_in?: Maybe<Array<Scalars['BigInt']>>;
  liquidity_lt?: Maybe<Scalars['BigInt']>;
  liquidity_lte?: Maybe<Scalars['BigInt']>;
  liquidity_not?: Maybe<Scalars['BigInt']>;
  liquidity_not_in?: Maybe<Array<Scalars['BigInt']>>;
  market0?: Maybe<Scalars['String']>;
  market0_?: Maybe<Market_Filter>;
  market0_contains?: Maybe<Scalars['String']>;
  market0_contains_nocase?: Maybe<Scalars['String']>;
  market0_ends_with?: Maybe<Scalars['String']>;
  market0_ends_with_nocase?: Maybe<Scalars['String']>;
  market0_gt?: Maybe<Scalars['String']>;
  market0_gte?: Maybe<Scalars['String']>;
  market0_in?: Maybe<Array<Scalars['String']>>;
  market0_lt?: Maybe<Scalars['String']>;
  market0_lte?: Maybe<Scalars['String']>;
  market0_not?: Maybe<Scalars['String']>;
  market0_not_contains?: Maybe<Scalars['String']>;
  market0_not_contains_nocase?: Maybe<Scalars['String']>;
  market0_not_ends_with?: Maybe<Scalars['String']>;
  market0_not_ends_with_nocase?: Maybe<Scalars['String']>;
  market0_not_in?: Maybe<Array<Scalars['String']>>;
  market0_not_starts_with?: Maybe<Scalars['String']>;
  market0_not_starts_with_nocase?: Maybe<Scalars['String']>;
  market0_starts_with?: Maybe<Scalars['String']>;
  market0_starts_with_nocase?: Maybe<Scalars['String']>;
  market1?: Maybe<Scalars['String']>;
  market1_?: Maybe<Market_Filter>;
  market1_contains?: Maybe<Scalars['String']>;
  market1_contains_nocase?: Maybe<Scalars['String']>;
  market1_ends_with?: Maybe<Scalars['String']>;
  market1_ends_with_nocase?: Maybe<Scalars['String']>;
  market1_gt?: Maybe<Scalars['String']>;
  market1_gte?: Maybe<Scalars['String']>;
  market1_in?: Maybe<Array<Scalars['String']>>;
  market1_lt?: Maybe<Scalars['String']>;
  market1_lte?: Maybe<Scalars['String']>;
  market1_not?: Maybe<Scalars['String']>;
  market1_not_contains?: Maybe<Scalars['String']>;
  market1_not_contains_nocase?: Maybe<Scalars['String']>;
  market1_not_ends_with?: Maybe<Scalars['String']>;
  market1_not_ends_with_nocase?: Maybe<Scalars['String']>;
  market1_not_in?: Maybe<Array<Scalars['String']>>;
  market1_not_starts_with?: Maybe<Scalars['String']>;
  market1_not_starts_with_nocase?: Maybe<Scalars['String']>;
  market1_starts_with?: Maybe<Scalars['String']>;
  market1_starts_with_nocase?: Maybe<Scalars['String']>;
  mint?: Maybe<Scalars['String']>;
  mintUSD?: Maybe<Scalars['BigDecimal']>;
  mintUSD_gt?: Maybe<Scalars['BigDecimal']>;
  mintUSD_gte?: Maybe<Scalars['BigDecimal']>;
  mintUSD_in?: Maybe<Array<Scalars['BigDecimal']>>;
  mintUSD_lt?: Maybe<Scalars['BigDecimal']>;
  mintUSD_lte?: Maybe<Scalars['BigDecimal']>;
  mintUSD_not?: Maybe<Scalars['BigDecimal']>;
  mintUSD_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
  mint_?: Maybe<Mint_Filter>;
  mint_contains?: Maybe<Scalars['String']>;
  mint_contains_nocase?: Maybe<Scalars['String']>;
  mint_ends_with?: Maybe<Scalars['String']>;
  mint_ends_with_nocase?: Maybe<Scalars['String']>;
  mint_gt?: Maybe<Scalars['String']>;
  mint_gte?: Maybe<Scalars['String']>;
  mint_in?: Maybe<Array<Scalars['String']>>;
  mint_lt?: Maybe<Scalars['String']>;
  mint_lte?: Maybe<Scalars['String']>;
  mint_not?: Maybe<Scalars['String']>;
  mint_not_contains?: Maybe<Scalars['String']>;
  mint_not_contains_nocase?: Maybe<Scalars['String']>;
  mint_not_ends_with?: Maybe<Scalars['String']>;
  mint_not_ends_with_nocase?: Maybe<Scalars['String']>;
  mint_not_in?: Maybe<Array<Scalars['String']>>;
  mint_not_starts_with?: Maybe<Scalars['String']>;
  mint_not_starts_with_nocase?: Maybe<Scalars['String']>;
  mint_starts_with?: Maybe<Scalars['String']>;
  mint_starts_with_nocase?: Maybe<Scalars['String']>;
  onFarmingCenter?: Maybe<Scalars['Boolean']>;
  onFarmingCenter_in?: Maybe<Array<Scalars['Boolean']>>;
  onFarmingCenter_not?: Maybe<Scalars['Boolean']>;
  onFarmingCenter_not_in?: Maybe<Array<Scalars['Boolean']>>;
  or?: Maybe<Array<Maybe<Deposit_Filter>>>;
  owner?: Maybe<Scalars['Bytes']>;
  owner_contains?: Maybe<Scalars['Bytes']>;
  owner_gt?: Maybe<Scalars['Bytes']>;
  owner_gte?: Maybe<Scalars['Bytes']>;
  owner_in?: Maybe<Array<Scalars['Bytes']>>;
  owner_lt?: Maybe<Scalars['Bytes']>;
  owner_lte?: Maybe<Scalars['Bytes']>;
  owner_not?: Maybe<Scalars['Bytes']>;
  owner_not_contains?: Maybe<Scalars['Bytes']>;
  owner_not_in?: Maybe<Array<Scalars['Bytes']>>;
  pool?: Maybe<Scalars['String']>;
  pool_?: Maybe<Pool_Filter>;
  pool_contains?: Maybe<Scalars['String']>;
  pool_contains_nocase?: Maybe<Scalars['String']>;
  pool_ends_with?: Maybe<Scalars['String']>;
  pool_ends_with_nocase?: Maybe<Scalars['String']>;
  pool_gt?: Maybe<Scalars['String']>;
  pool_gte?: Maybe<Scalars['String']>;
  pool_in?: Maybe<Array<Scalars['String']>>;
  pool_lt?: Maybe<Scalars['String']>;
  pool_lte?: Maybe<Scalars['String']>;
  pool_not?: Maybe<Scalars['String']>;
  pool_not_contains?: Maybe<Scalars['String']>;
  pool_not_contains_nocase?: Maybe<Scalars['String']>;
  pool_not_ends_with?: Maybe<Scalars['String']>;
  pool_not_ends_with_nocase?: Maybe<Scalars['String']>;
  pool_not_in?: Maybe<Array<Scalars['String']>>;
  pool_not_starts_with?: Maybe<Scalars['String']>;
  pool_not_starts_with_nocase?: Maybe<Scalars['String']>;
  pool_starts_with?: Maybe<Scalars['String']>;
  pool_starts_with_nocase?: Maybe<Scalars['String']>;
  rangeLength?: Maybe<Scalars['BigInt']>;
  rangeLength_gt?: Maybe<Scalars['BigInt']>;
  rangeLength_gte?: Maybe<Scalars['BigInt']>;
  rangeLength_in?: Maybe<Array<Scalars['BigInt']>>;
  rangeLength_lt?: Maybe<Scalars['BigInt']>;
  rangeLength_lte?: Maybe<Scalars['BigInt']>;
  rangeLength_not?: Maybe<Scalars['BigInt']>;
  rangeLength_not_in?: Maybe<Array<Scalars['BigInt']>>;
  tierEternal?: Maybe<Scalars['BigInt']>;
  tierEternal_gt?: Maybe<Scalars['BigInt']>;
  tierEternal_gte?: Maybe<Scalars['BigInt']>;
  tierEternal_in?: Maybe<Array<Scalars['BigInt']>>;
  tierEternal_lt?: Maybe<Scalars['BigInt']>;
  tierEternal_lte?: Maybe<Scalars['BigInt']>;
  tierEternal_not?: Maybe<Scalars['BigInt']>;
  tierEternal_not_in?: Maybe<Array<Scalars['BigInt']>>;
  tierLimit?: Maybe<Scalars['BigInt']>;
  tierLimit_gt?: Maybe<Scalars['BigInt']>;
  tierLimit_gte?: Maybe<Scalars['BigInt']>;
  tierLimit_in?: Maybe<Array<Scalars['BigInt']>>;
  tierLimit_lt?: Maybe<Scalars['BigInt']>;
  tierLimit_lte?: Maybe<Scalars['BigInt']>;
  tierLimit_not?: Maybe<Scalars['BigInt']>;
  tierLimit_not_in?: Maybe<Array<Scalars['BigInt']>>;
  tokensLockedEternal?: Maybe<Scalars['BigInt']>;
  tokensLockedEternal_gt?: Maybe<Scalars['BigInt']>;
  tokensLockedEternal_gte?: Maybe<Scalars['BigInt']>;
  tokensLockedEternal_in?: Maybe<Array<Scalars['BigInt']>>;
  tokensLockedEternal_lt?: Maybe<Scalars['BigInt']>;
  tokensLockedEternal_lte?: Maybe<Scalars['BigInt']>;
  tokensLockedEternal_not?: Maybe<Scalars['BigInt']>;
  tokensLockedEternal_not_in?: Maybe<Array<Scalars['BigInt']>>;
  tokensLockedLimit?: Maybe<Scalars['BigInt']>;
  tokensLockedLimit_gt?: Maybe<Scalars['BigInt']>;
  tokensLockedLimit_gte?: Maybe<Scalars['BigInt']>;
  tokensLockedLimit_in?: Maybe<Array<Scalars['BigInt']>>;
  tokensLockedLimit_lt?: Maybe<Scalars['BigInt']>;
  tokensLockedLimit_lte?: Maybe<Scalars['BigInt']>;
  tokensLockedLimit_not?: Maybe<Scalars['BigInt']>;
  tokensLockedLimit_not_in?: Maybe<Array<Scalars['BigInt']>>;
};

export enum Deposit_OrderBy {
  L2tokenId = 'L2tokenId',
  EnteredInEternalFarming = 'enteredInEternalFarming',
  EternalFarming = 'eternalFarming',
  EternalFarmingBonusReward = 'eternalFarming__bonusReward',
  EternalFarmingBonusRewardRate = 'eternalFarming__bonusRewardRate',
  EternalFarmingBonusRewardToken = 'eternalFarming__bonusRewardToken',
  EternalFarmingEndTime = 'eternalFarming__endTime',
  EternalFarmingEndTimeImplied = 'eternalFarming__endTimeImplied',
  EternalFarmingId = 'eternalFarming__id',
  EternalFarmingIsDetached = 'eternalFarming__isDetached',
  EternalFarmingMinRangeLength = 'eternalFarming__minRangeLength',
  EternalFarmingMultiplierToken = 'eternalFarming__multiplierToken',
  EternalFarmingReward = 'eternalFarming__reward',
  EternalFarmingRewardRate = 'eternalFarming__rewardRate',
  EternalFarmingRewardReserve = 'eternalFarming__rewardReserve',
  EternalFarmingRewardToken = 'eternalFarming__rewardToken',
  EternalFarmingStartTime = 'eternalFarming__startTime',
  EternalFarmingTier1Multiplier = 'eternalFarming__tier1Multiplier',
  EternalFarmingTier2Multiplier = 'eternalFarming__tier2Multiplier',
  EternalFarmingTier3Multiplier = 'eternalFarming__tier3Multiplier',
  EternalFarmingTimestampActiveLiquidity = 'eternalFarming__timestampActiveLiquidity',
  EternalFarmingTokenAmountForTier1 = 'eternalFarming__tokenAmountForTier1',
  EternalFarmingTokenAmountForTier2 = 'eternalFarming__tokenAmountForTier2',
  EternalFarmingTokenAmountForTier3 = 'eternalFarming__tokenAmountForTier3',
  EternalFarmingTotalActiveLiquidity = 'eternalFarming__totalActiveLiquidity',
  EternalFarmingTotalAmountUsdEstimated = 'eternalFarming__totalAmountUSDEstimated',
  EternalFarmingTotalLiquidity = 'eternalFarming__totalLiquidity',
  EternalFarmingVirtualPool = 'eternalFarming__virtualPool',
  Id = 'id',
  LimitFarming = 'limitFarming',
  LimitFarmingBonusReward = 'limitFarming__bonusReward',
  LimitFarmingBonusRewardToken = 'limitFarming__bonusRewardToken',
  LimitFarmingCreatedAtTimestamp = 'limitFarming__createdAtTimestamp',
  LimitFarmingEndTime = 'limitFarming__endTime',
  LimitFarmingEnterStartTime = 'limitFarming__enterStartTime',
  LimitFarmingId = 'limitFarming__id',
  LimitFarmingIsDetached = 'limitFarming__isDetached',
  LimitFarmingMinRangeLength = 'limitFarming__minRangeLength',
  LimitFarmingMultiplierToken = 'limitFarming__multiplierToken',
  LimitFarmingPool = 'limitFarming__pool',
  LimitFarmingReward = 'limitFarming__reward',
  LimitFarmingRewardToken = 'limitFarming__rewardToken',
  LimitFarmingStartTime = 'limitFarming__startTime',
  LimitFarmingTier1Multiplier = 'limitFarming__tier1Multiplier',
  LimitFarmingTier2Multiplier = 'limitFarming__tier2Multiplier',
  LimitFarmingTier3Multiplier = 'limitFarming__tier3Multiplier',
  LimitFarmingTokenAmountForTier1 = 'limitFarming__tokenAmountForTier1',
  LimitFarmingTokenAmountForTier2 = 'limitFarming__tokenAmountForTier2',
  LimitFarmingTokenAmountForTier3 = 'limitFarming__tokenAmountForTier3',
  Liquidity = 'liquidity',
  Market0 = 'market0',
  Market0BlockNumber = 'market0__blockNumber',
  Market0BlockTimestamp = 'market0__blockTimestamp',
  Market0ConditionId = 'market0__conditionId',
  Market0Creator = 'market0__creator',
  Market0Factory = 'market0__factory',
  Market0FinalizeTs = 'market0__finalizeTs',
  Market0HasAnswers = 'market0__hasAnswers',
  Market0Id = 'market0__id',
  Market0Index = 'market0__index',
  Market0LowerBound = 'market0__lowerBound',
  Market0MarketName = 'market0__marketName',
  Market0OpeningTs = 'market0__openingTs',
  Market0OutcomesSupply = 'market0__outcomesSupply',
  Market0ParentCollectionId = 'market0__parentCollectionId',
  Market0ParentOutcome = 'market0__parentOutcome',
  Market0PayoutReported = 'market0__payoutReported',
  Market0QuestionId = 'market0__questionId',
  Market0QuestionsInArbitration = 'market0__questionsInArbitration',
  Market0TemplateId = 'market0__templateId',
  Market0TotalValueLockedUsd = 'market0__totalValueLockedUSD',
  Market0TotalValueLockedUsdUntracked = 'market0__totalValueLockedUSDUntracked',
  Market0TransactionHash = 'market0__transactionHash',
  Market0Type = 'market0__type',
  Market0UntrackedVolumeUsd = 'market0__untrackedVolumeUSD',
  Market0UpperBound = 'market0__upperBound',
  Market0Volume = 'market0__volume',
  Market0VolumeUsd = 'market0__volumeUSD',
  Market1 = 'market1',
  Market1BlockNumber = 'market1__blockNumber',
  Market1BlockTimestamp = 'market1__blockTimestamp',
  Market1ConditionId = 'market1__conditionId',
  Market1Creator = 'market1__creator',
  Market1Factory = 'market1__factory',
  Market1FinalizeTs = 'market1__finalizeTs',
  Market1HasAnswers = 'market1__hasAnswers',
  Market1Id = 'market1__id',
  Market1Index = 'market1__index',
  Market1LowerBound = 'market1__lowerBound',
  Market1MarketName = 'market1__marketName',
  Market1OpeningTs = 'market1__openingTs',
  Market1OutcomesSupply = 'market1__outcomesSupply',
  Market1ParentCollectionId = 'market1__parentCollectionId',
  Market1ParentOutcome = 'market1__parentOutcome',
  Market1PayoutReported = 'market1__payoutReported',
  Market1QuestionId = 'market1__questionId',
  Market1QuestionsInArbitration = 'market1__questionsInArbitration',
  Market1TemplateId = 'market1__templateId',
  Market1TotalValueLockedUsd = 'market1__totalValueLockedUSD',
  Market1TotalValueLockedUsdUntracked = 'market1__totalValueLockedUSDUntracked',
  Market1TransactionHash = 'market1__transactionHash',
  Market1Type = 'market1__type',
  Market1UntrackedVolumeUsd = 'market1__untrackedVolumeUSD',
  Market1UpperBound = 'market1__upperBound',
  Market1Volume = 'market1__volume',
  Market1VolumeUsd = 'market1__volumeUSD',
  Mint = 'mint',
  MintUsd = 'mintUSD',
  MintAmount = 'mint__amount',
  MintAmount0 = 'mint__amount0',
  MintAmount1 = 'mint__amount1',
  MintAmountUsd = 'mint__amountUSD',
  MintId = 'mint__id',
  MintLogIndex = 'mint__logIndex',
  MintOrigin = 'mint__origin',
  MintOwner = 'mint__owner',
  MintSender = 'mint__sender',
  MintTickLower = 'mint__tickLower',
  MintTickUpper = 'mint__tickUpper',
  MintTimestamp = 'mint__timestamp',
  OnFarmingCenter = 'onFarmingCenter',
  Owner = 'owner',
  Pool = 'pool',
  PoolCollectedFeesToken0 = 'pool__collectedFeesToken0',
  PoolCollectedFeesToken1 = 'pool__collectedFeesToken1',
  PoolCollectedFeesUsd = 'pool__collectedFeesUSD',
  PoolCommunityFee0 = 'pool__communityFee0',
  PoolCommunityFee1 = 'pool__communityFee1',
  PoolCreatedAtBlockNumber = 'pool__createdAtBlockNumber',
  PoolCreatedAtTimestamp = 'pool__createdAtTimestamp',
  PoolFee = 'pool__fee',
  PoolFeeGrowthGlobal0X128 = 'pool__feeGrowthGlobal0X128',
  PoolFeeGrowthGlobal1X128 = 'pool__feeGrowthGlobal1X128',
  PoolFeesToken0 = 'pool__feesToken0',
  PoolFeesToken1 = 'pool__feesToken1',
  PoolFeesUsd = 'pool__feesUSD',
  PoolId = 'pool__id',
  PoolLiquidity = 'pool__liquidity',
  PoolLiquidityProviderCount = 'pool__liquidityProviderCount',
  PoolObservationIndex = 'pool__observationIndex',
  PoolSqrtPrice = 'pool__sqrtPrice',
  PoolTick = 'pool__tick',
  PoolTickSpacing = 'pool__tickSpacing',
  PoolToken0Price = 'pool__token0Price',
  PoolToken1Price = 'pool__token1Price',
  PoolTotalValueLockedMatic = 'pool__totalValueLockedMatic',
  PoolTotalValueLockedToken0 = 'pool__totalValueLockedToken0',
  PoolTotalValueLockedToken1 = 'pool__totalValueLockedToken1',
  PoolTotalValueLockedUsd = 'pool__totalValueLockedUSD',
  PoolTotalValueLockedUsdUntracked = 'pool__totalValueLockedUSDUntracked',
  PoolTxCount = 'pool__txCount',
  PoolUntrackedFeesUsd = 'pool__untrackedFeesUSD',
  PoolUntrackedVolumeUsd = 'pool__untrackedVolumeUSD',
  PoolVolumeToken0 = 'pool__volumeToken0',
  PoolVolumeToken1 = 'pool__volumeToken1',
  PoolVolumeUsd = 'pool__volumeUSD',
  RangeLength = 'rangeLength',
  TierEternal = 'tierEternal',
  TierLimit = 'tierLimit',
  TokensLockedEternal = 'tokensLockedEternal',
  TokensLockedLimit = 'tokensLockedLimit'
}

export type EternalFarming = {
  __typename?: 'EternalFarming';
  bonusReward: Scalars['BigInt'];
  bonusRewardRate: Scalars['BigInt'];
  bonusRewardToken: Scalars['Bytes'];
  deposits: Array<Deposit>;
  endTime: Scalars['BigInt'];
  endTimeImplied: Scalars['BigInt'];
  id: Scalars['ID'];
  isDetached?: Maybe<Scalars['Boolean']>;
  minRangeLength: Scalars['BigInt'];
  multiplierToken: Scalars['Bytes'];
  pool: Pool;
  reward: Scalars['BigInt'];
  rewardRate: Scalars['BigInt'];
  rewardReserve: Scalars['BigInt'];
  rewardToken: Scalars['Bytes'];
  startTime: Scalars['BigInt'];
  tier1Multiplier: Scalars['BigInt'];
  tier2Multiplier: Scalars['BigInt'];
  tier3Multiplier: Scalars['BigInt'];
  timestampActiveLiquidity: Scalars['BigInt'];
  tokenAmountForTier1: Scalars['BigInt'];
  tokenAmountForTier2: Scalars['BigInt'];
  tokenAmountForTier3: Scalars['BigInt'];
  totalActiveLiquidity: Scalars['BigInt'];
  totalAmountUSDEstimated: Scalars['BigDecimal'];
  totalLiquidity: Scalars['BigInt'];
  virtualPool: Scalars['Bytes'];
};


export type EternalFarmingDepositsArgs = {
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Deposit_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  skip?: Maybe<Scalars['Int']>;
  where?: Maybe<Deposit_Filter>;
};

export type EternalFarming_Filter = {
  /** Filter for the block changed event. */
  _change_block?: Maybe<BlockChangedFilter>;
  and?: Maybe<Array<Maybe<EternalFarming_Filter>>>;
  bonusReward?: Maybe<Scalars['BigInt']>;
  bonusRewardRate?: Maybe<Scalars['BigInt']>;
  bonusRewardRate_gt?: Maybe<Scalars['BigInt']>;
  bonusRewardRate_gte?: Maybe<Scalars['BigInt']>;
  bonusRewardRate_in?: Maybe<Array<Scalars['BigInt']>>;
  bonusRewardRate_lt?: Maybe<Scalars['BigInt']>;
  bonusRewardRate_lte?: Maybe<Scalars['BigInt']>;
  bonusRewardRate_not?: Maybe<Scalars['BigInt']>;
  bonusRewardRate_not_in?: Maybe<Array<Scalars['BigInt']>>;
  bonusRewardToken?: Maybe<Scalars['Bytes']>;
  bonusRewardToken_contains?: Maybe<Scalars['Bytes']>;
  bonusRewardToken_gt?: Maybe<Scalars['Bytes']>;
  bonusRewardToken_gte?: Maybe<Scalars['Bytes']>;
  bonusRewardToken_in?: Maybe<Array<Scalars['Bytes']>>;
  bonusRewardToken_lt?: Maybe<Scalars['Bytes']>;
  bonusRewardToken_lte?: Maybe<Scalars['Bytes']>;
  bonusRewardToken_not?: Maybe<Scalars['Bytes']>;
  bonusRewardToken_not_contains?: Maybe<Scalars['Bytes']>;
  bonusRewardToken_not_in?: Maybe<Array<Scalars['Bytes']>>;
  bonusReward_gt?: Maybe<Scalars['BigInt']>;
  bonusReward_gte?: Maybe<Scalars['BigInt']>;
  bonusReward_in?: Maybe<Array<Scalars['BigInt']>>;
  bonusReward_lt?: Maybe<Scalars['BigInt']>;
  bonusReward_lte?: Maybe<Scalars['BigInt']>;
  bonusReward_not?: Maybe<Scalars['BigInt']>;
  bonusReward_not_in?: Maybe<Array<Scalars['BigInt']>>;
  deposits_?: Maybe<Deposit_Filter>;
  endTime?: Maybe<Scalars['BigInt']>;
  endTimeImplied?: Maybe<Scalars['BigInt']>;
  endTimeImplied_gt?: Maybe<Scalars['BigInt']>;
  endTimeImplied_gte?: Maybe<Scalars['BigInt']>;
  endTimeImplied_in?: Maybe<Array<Scalars['BigInt']>>;
  endTimeImplied_lt?: Maybe<Scalars['BigInt']>;
  endTimeImplied_lte?: Maybe<Scalars['BigInt']>;
  endTimeImplied_not?: Maybe<Scalars['BigInt']>;
  endTimeImplied_not_in?: Maybe<Array<Scalars['BigInt']>>;
  endTime_gt?: Maybe<Scalars['BigInt']>;
  endTime_gte?: Maybe<Scalars['BigInt']>;
  endTime_in?: Maybe<Array<Scalars['BigInt']>>;
  endTime_lt?: Maybe<Scalars['BigInt']>;
  endTime_lte?: Maybe<Scalars['BigInt']>;
  endTime_not?: Maybe<Scalars['BigInt']>;
  endTime_not_in?: Maybe<Array<Scalars['BigInt']>>;
  id?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_lt?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
  isDetached?: Maybe<Scalars['Boolean']>;
  isDetached_in?: Maybe<Array<Scalars['Boolean']>>;
  isDetached_not?: Maybe<Scalars['Boolean']>;
  isDetached_not_in?: Maybe<Array<Scalars['Boolean']>>;
  minRangeLength?: Maybe<Scalars['BigInt']>;
  minRangeLength_gt?: Maybe<Scalars['BigInt']>;
  minRangeLength_gte?: Maybe<Scalars['BigInt']>;
  minRangeLength_in?: Maybe<Array<Scalars['BigInt']>>;
  minRangeLength_lt?: Maybe<Scalars['BigInt']>;
  minRangeLength_lte?: Maybe<Scalars['BigInt']>;
  minRangeLength_not?: Maybe<Scalars['BigInt']>;
  minRangeLength_not_in?: Maybe<Array<Scalars['BigInt']>>;
  multiplierToken?: Maybe<Scalars['Bytes']>;
  multiplierToken_contains?: Maybe<Scalars['Bytes']>;
  multiplierToken_gt?: Maybe<Scalars['Bytes']>;
  multiplierToken_gte?: Maybe<Scalars['Bytes']>;
  multiplierToken_in?: Maybe<Array<Scalars['Bytes']>>;
  multiplierToken_lt?: Maybe<Scalars['Bytes']>;
  multiplierToken_lte?: Maybe<Scalars['Bytes']>;
  multiplierToken_not?: Maybe<Scalars['Bytes']>;
  multiplierToken_not_contains?: Maybe<Scalars['Bytes']>;
  multiplierToken_not_in?: Maybe<Array<Scalars['Bytes']>>;
  or?: Maybe<Array<Maybe<EternalFarming_Filter>>>;
  pool?: Maybe<Scalars['String']>;
  pool_?: Maybe<Pool_Filter>;
  pool_contains?: Maybe<Scalars['String']>;
  pool_contains_nocase?: Maybe<Scalars['String']>;
  pool_ends_with?: Maybe<Scalars['String']>;
  pool_ends_with_nocase?: Maybe<Scalars['String']>;
  pool_gt?: Maybe<Scalars['String']>;
  pool_gte?: Maybe<Scalars['String']>;
  pool_in?: Maybe<Array<Scalars['String']>>;
  pool_lt?: Maybe<Scalars['String']>;
  pool_lte?: Maybe<Scalars['String']>;
  pool_not?: Maybe<Scalars['String']>;
  pool_not_contains?: Maybe<Scalars['String']>;
  pool_not_contains_nocase?: Maybe<Scalars['String']>;
  pool_not_ends_with?: Maybe<Scalars['String']>;
  pool_not_ends_with_nocase?: Maybe<Scalars['String']>;
  pool_not_in?: Maybe<Array<Scalars['String']>>;
  pool_not_starts_with?: Maybe<Scalars['String']>;
  pool_not_starts_with_nocase?: Maybe<Scalars['String']>;
  pool_starts_with?: Maybe<Scalars['String']>;
  pool_starts_with_nocase?: Maybe<Scalars['String']>;
  reward?: Maybe<Scalars['BigInt']>;
  rewardRate?: Maybe<Scalars['BigInt']>;
  rewardRate_gt?: Maybe<Scalars['BigInt']>;
  rewardRate_gte?: Maybe<Scalars['BigInt']>;
  rewardRate_in?: Maybe<Array<Scalars['BigInt']>>;
  rewardRate_lt?: Maybe<Scalars['BigInt']>;
  rewardRate_lte?: Maybe<Scalars['BigInt']>;
  rewardRate_not?: Maybe<Scalars['BigInt']>;
  rewardRate_not_in?: Maybe<Array<Scalars['BigInt']>>;
  rewardReserve?: Maybe<Scalars['BigInt']>;
  rewardReserve_gt?: Maybe<Scalars['BigInt']>;
  rewardReserve_gte?: Maybe<Scalars['BigInt']>;
  rewardReserve_in?: Maybe<Array<Scalars['BigInt']>>;
  rewardReserve_lt?: Maybe<Scalars['BigInt']>;
  rewardReserve_lte?: Maybe<Scalars['BigInt']>;
  rewardReserve_not?: Maybe<Scalars['BigInt']>;
  rewardReserve_not_in?: Maybe<Array<Scalars['BigInt']>>;
  rewardToken?: Maybe<Scalars['Bytes']>;
  rewardToken_contains?: Maybe<Scalars['Bytes']>;
  rewardToken_gt?: Maybe<Scalars['Bytes']>;
  rewardToken_gte?: Maybe<Scalars['Bytes']>;
  rewardToken_in?: Maybe<Array<Scalars['Bytes']>>;
  rewardToken_lt?: Maybe<Scalars['Bytes']>;
  rewardToken_lte?: Maybe<Scalars['Bytes']>;
  rewardToken_not?: Maybe<Scalars['Bytes']>;
  rewardToken_not_contains?: Maybe<Scalars['Bytes']>;
  rewardToken_not_in?: Maybe<Array<Scalars['Bytes']>>;
  reward_gt?: Maybe<Scalars['BigInt']>;
  reward_gte?: Maybe<Scalars['BigInt']>;
  reward_in?: Maybe<Array<Scalars['BigInt']>>;
  reward_lt?: Maybe<Scalars['BigInt']>;
  reward_lte?: Maybe<Scalars['BigInt']>;
  reward_not?: Maybe<Scalars['BigInt']>;
  reward_not_in?: Maybe<Array<Scalars['BigInt']>>;
  startTime?: Maybe<Scalars['BigInt']>;
  startTime_gt?: Maybe<Scalars['BigInt']>;
  startTime_gte?: Maybe<Scalars['BigInt']>;
  startTime_in?: Maybe<Array<Scalars['BigInt']>>;
  startTime_lt?: Maybe<Scalars['BigInt']>;
  startTime_lte?: Maybe<Scalars['BigInt']>;
  startTime_not?: Maybe<Scalars['BigInt']>;
  startTime_not_in?: Maybe<Array<Scalars['BigInt']>>;
  tier1Multiplier?: Maybe<Scalars['BigInt']>;
  tier1Multiplier_gt?: Maybe<Scalars['BigInt']>;
  tier1Multiplier_gte?: Maybe<Scalars['BigInt']>;
  tier1Multiplier_in?: Maybe<Array<Scalars['BigInt']>>;
  tier1Multiplier_lt?: Maybe<Scalars['BigInt']>;
  tier1Multiplier_lte?: Maybe<Scalars['BigInt']>;
  tier1Multiplier_not?: Maybe<Scalars['BigInt']>;
  tier1Multiplier_not_in?: Maybe<Array<Scalars['BigInt']>>;
  tier2Multiplier?: Maybe<Scalars['BigInt']>;
  tier2Multiplier_gt?: Maybe<Scalars['BigInt']>;
  tier2Multiplier_gte?: Maybe<Scalars['BigInt']>;
  tier2Multiplier_in?: Maybe<Array<Scalars['BigInt']>>;
  tier2Multiplier_lt?: Maybe<Scalars['BigInt']>;
  tier2Multiplier_lte?: Maybe<Scalars['BigInt']>;
  tier2Multiplier_not?: Maybe<Scalars['BigInt']>;
  tier2Multiplier_not_in?: Maybe<Array<Scalars['BigInt']>>;
  tier3Multiplier?: Maybe<Scalars['BigInt']>;
  tier3Multiplier_gt?: Maybe<Scalars['BigInt']>;
  tier3Multiplier_gte?: Maybe<Scalars['BigInt']>;
  tier3Multiplier_in?: Maybe<Array<Scalars['BigInt']>>;
  tier3Multiplier_lt?: Maybe<Scalars['BigInt']>;
  tier3Multiplier_lte?: Maybe<Scalars['BigInt']>;
  tier3Multiplier_not?: Maybe<Scalars['BigInt']>;
  tier3Multiplier_not_in?: Maybe<Array<Scalars['BigInt']>>;
  timestampActiveLiquidity?: Maybe<Scalars['BigInt']>;
  timestampActiveLiquidity_gt?: Maybe<Scalars['BigInt']>;
  timestampActiveLiquidity_gte?: Maybe<Scalars['BigInt']>;
  timestampActiveLiquidity_in?: Maybe<Array<Scalars['BigInt']>>;
  timestampActiveLiquidity_lt?: Maybe<Scalars['BigInt']>;
  timestampActiveLiquidity_lte?: Maybe<Scalars['BigInt']>;
  timestampActiveLiquidity_not?: Maybe<Scalars['BigInt']>;
  timestampActiveLiquidity_not_in?: Maybe<Array<Scalars['BigInt']>>;
  tokenAmountForTier1?: Maybe<Scalars['BigInt']>;
  tokenAmountForTier1_gt?: Maybe<Scalars['BigInt']>;
  tokenAmountForTier1_gte?: Maybe<Scalars['BigInt']>;
  tokenAmountForTier1_in?: Maybe<Array<Scalars['BigInt']>>;
  tokenAmountForTier1_lt?: Maybe<Scalars['BigInt']>;
  tokenAmountForTier1_lte?: Maybe<Scalars['BigInt']>;
  tokenAmountForTier1_not?: Maybe<Scalars['BigInt']>;
  tokenAmountForTier1_not_in?: Maybe<Array<Scalars['BigInt']>>;
  tokenAmountForTier2?: Maybe<Scalars['BigInt']>;
  tokenAmountForTier2_gt?: Maybe<Scalars['BigInt']>;
  tokenAmountForTier2_gte?: Maybe<Scalars['BigInt']>;
  tokenAmountForTier2_in?: Maybe<Array<Scalars['BigInt']>>;
  tokenAmountForTier2_lt?: Maybe<Scalars['BigInt']>;
  tokenAmountForTier2_lte?: Maybe<Scalars['BigInt']>;
  tokenAmountForTier2_not?: Maybe<Scalars['BigInt']>;
  tokenAmountForTier2_not_in?: Maybe<Array<Scalars['BigInt']>>;
  tokenAmountForTier3?: Maybe<Scalars['BigInt']>;
  tokenAmountForTier3_gt?: Maybe<Scalars['BigInt']>;
  tokenAmountForTier3_gte?: Maybe<Scalars['BigInt']>;
  tokenAmountForTier3_in?: Maybe<Array<Scalars['BigInt']>>;
  tokenAmountForTier3_lt?: Maybe<Scalars['BigInt']>;
  tokenAmountForTier3_lte?: Maybe<Scalars['BigInt']>;
  tokenAmountForTier3_not?: Maybe<Scalars['BigInt']>;
  tokenAmountForTier3_not_in?: Maybe<Array<Scalars['BigInt']>>;
  totalActiveLiquidity?: Maybe<Scalars['BigInt']>;
  totalActiveLiquidity_gt?: Maybe<Scalars['BigInt']>;
  totalActiveLiquidity_gte?: Maybe<Scalars['BigInt']>;
  totalActiveLiquidity_in?: Maybe<Array<Scalars['BigInt']>>;
  totalActiveLiquidity_lt?: Maybe<Scalars['BigInt']>;
  totalActiveLiquidity_lte?: Maybe<Scalars['BigInt']>;
  totalActiveLiquidity_not?: Maybe<Scalars['BigInt']>;
  totalActiveLiquidity_not_in?: Maybe<Array<Scalars['BigInt']>>;
  totalAmountUSDEstimated?: Maybe<Scalars['BigDecimal']>;
  totalAmountUSDEstimated_gt?: Maybe<Scalars['BigDecimal']>;
  totalAmountUSDEstimated_gte?: Maybe<Scalars['BigDecimal']>;
  totalAmountUSDEstimated_in?: Maybe<Array<Scalars['BigDecimal']>>;
  totalAmountUSDEstimated_lt?: Maybe<Scalars['BigDecimal']>;
  totalAmountUSDEstimated_lte?: Maybe<Scalars['BigDecimal']>;
  totalAmountUSDEstimated_not?: Maybe<Scalars['BigDecimal']>;
  totalAmountUSDEstimated_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
  totalLiquidity?: Maybe<Scalars['BigInt']>;
  totalLiquidity_gt?: Maybe<Scalars['BigInt']>;
  totalLiquidity_gte?: Maybe<Scalars['BigInt']>;
  totalLiquidity_in?: Maybe<Array<Scalars['BigInt']>>;
  totalLiquidity_lt?: Maybe<Scalars['BigInt']>;
  totalLiquidity_lte?: Maybe<Scalars['BigInt']>;
  totalLiquidity_not?: Maybe<Scalars['BigInt']>;
  totalLiquidity_not_in?: Maybe<Array<Scalars['BigInt']>>;
  virtualPool?: Maybe<Scalars['Bytes']>;
  virtualPool_contains?: Maybe<Scalars['Bytes']>;
  virtualPool_gt?: Maybe<Scalars['Bytes']>;
  virtualPool_gte?: Maybe<Scalars['Bytes']>;
  virtualPool_in?: Maybe<Array<Scalars['Bytes']>>;
  virtualPool_lt?: Maybe<Scalars['Bytes']>;
  virtualPool_lte?: Maybe<Scalars['Bytes']>;
  virtualPool_not?: Maybe<Scalars['Bytes']>;
  virtualPool_not_contains?: Maybe<Scalars['Bytes']>;
  virtualPool_not_in?: Maybe<Array<Scalars['Bytes']>>;
};

export enum EternalFarming_OrderBy {
  BonusReward = 'bonusReward',
  BonusRewardRate = 'bonusRewardRate',
  BonusRewardToken = 'bonusRewardToken',
  Deposits = 'deposits',
  EndTime = 'endTime',
  EndTimeImplied = 'endTimeImplied',
  Id = 'id',
  IsDetached = 'isDetached',
  MinRangeLength = 'minRangeLength',
  MultiplierToken = 'multiplierToken',
  Pool = 'pool',
  PoolCollectedFeesToken0 = 'pool__collectedFeesToken0',
  PoolCollectedFeesToken1 = 'pool__collectedFeesToken1',
  PoolCollectedFeesUsd = 'pool__collectedFeesUSD',
  PoolCommunityFee0 = 'pool__communityFee0',
  PoolCommunityFee1 = 'pool__communityFee1',
  PoolCreatedAtBlockNumber = 'pool__createdAtBlockNumber',
  PoolCreatedAtTimestamp = 'pool__createdAtTimestamp',
  PoolFee = 'pool__fee',
  PoolFeeGrowthGlobal0X128 = 'pool__feeGrowthGlobal0X128',
  PoolFeeGrowthGlobal1X128 = 'pool__feeGrowthGlobal1X128',
  PoolFeesToken0 = 'pool__feesToken0',
  PoolFeesToken1 = 'pool__feesToken1',
  PoolFeesUsd = 'pool__feesUSD',
  PoolId = 'pool__id',
  PoolLiquidity = 'pool__liquidity',
  PoolLiquidityProviderCount = 'pool__liquidityProviderCount',
  PoolObservationIndex = 'pool__observationIndex',
  PoolSqrtPrice = 'pool__sqrtPrice',
  PoolTick = 'pool__tick',
  PoolTickSpacing = 'pool__tickSpacing',
  PoolToken0Price = 'pool__token0Price',
  PoolToken1Price = 'pool__token1Price',
  PoolTotalValueLockedMatic = 'pool__totalValueLockedMatic',
  PoolTotalValueLockedToken0 = 'pool__totalValueLockedToken0',
  PoolTotalValueLockedToken1 = 'pool__totalValueLockedToken1',
  PoolTotalValueLockedUsd = 'pool__totalValueLockedUSD',
  PoolTotalValueLockedUsdUntracked = 'pool__totalValueLockedUSDUntracked',
  PoolTxCount = 'pool__txCount',
  PoolUntrackedFeesUsd = 'pool__untrackedFeesUSD',
  PoolUntrackedVolumeUsd = 'pool__untrackedVolumeUSD',
  PoolVolumeToken0 = 'pool__volumeToken0',
  PoolVolumeToken1 = 'pool__volumeToken1',
  PoolVolumeUsd = 'pool__volumeUSD',
  Reward = 'reward',
  RewardRate = 'rewardRate',
  RewardReserve = 'rewardReserve',
  RewardToken = 'rewardToken',
  StartTime = 'startTime',
  Tier1Multiplier = 'tier1Multiplier',
  Tier2Multiplier = 'tier2Multiplier',
  Tier3Multiplier = 'tier3Multiplier',
  TimestampActiveLiquidity = 'timestampActiveLiquidity',
  TokenAmountForTier1 = 'tokenAmountForTier1',
  TokenAmountForTier2 = 'tokenAmountForTier2',
  TokenAmountForTier3 = 'tokenAmountForTier3',
  TotalActiveLiquidity = 'totalActiveLiquidity',
  TotalAmountUsdEstimated = 'totalAmountUSDEstimated',
  TotalLiquidity = 'totalLiquidity',
  VirtualPool = 'virtualPool'
}

export type Evidence = {
  __typename?: 'Evidence';
  /** The URI of the evidence file. */
  URI: Scalars['String'];
  /** The arbitrator's address. */
  arbitrator: Scalars['Bytes'];
  /** The evidence group */
  evidenceGroup: EvidenceGroup;
  /** evidenceGroupId@tcrAddress-number */
  id: Scalars['ID'];
  metadata?: Maybe<EvidenceMetadata>;
  /** This is the <number>th evidence submitted (starting at 0) for <request>. */
  number: Scalars['BigInt'];
  /** The address of the party that sent this piece of evidence. */
  party: Scalars['Bytes'];
  /** When was this evidence posted */
  timestamp: Scalars['BigInt'];
  /** Tx hash of the evidence submission */
  txHash: Scalars['Bytes'];
};

export type EvidenceGroup = {
  __typename?: 'EvidenceGroup';
  /** Evidences posted to this evidenceGroupId */
  evidences: Array<Evidence>;
  /** evidenceGroupId@tcrAddress */
  id: Scalars['ID'];
  /** Number of evidences posted in this group */
  numberOfEvidence: Scalars['BigInt'];
};


export type EvidenceGroupEvidencesArgs = {
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Evidence_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  skip?: Maybe<Scalars['Int']>;
  where?: Maybe<Evidence_Filter>;
};

export type EvidenceGroup_Filter = {
  /** Filter for the block changed event. */
  _change_block?: Maybe<BlockChangedFilter>;
  and?: Maybe<Array<Maybe<EvidenceGroup_Filter>>>;
  evidences_?: Maybe<Evidence_Filter>;
  id?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_lt?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
  numberOfEvidence?: Maybe<Scalars['BigInt']>;
  numberOfEvidence_gt?: Maybe<Scalars['BigInt']>;
  numberOfEvidence_gte?: Maybe<Scalars['BigInt']>;
  numberOfEvidence_in?: Maybe<Array<Scalars['BigInt']>>;
  numberOfEvidence_lt?: Maybe<Scalars['BigInt']>;
  numberOfEvidence_lte?: Maybe<Scalars['BigInt']>;
  numberOfEvidence_not?: Maybe<Scalars['BigInt']>;
  numberOfEvidence_not_in?: Maybe<Array<Scalars['BigInt']>>;
  or?: Maybe<Array<Maybe<EvidenceGroup_Filter>>>;
};

export enum EvidenceGroup_OrderBy {
  Evidences = 'evidences',
  Id = 'id',
  NumberOfEvidence = 'numberOfEvidence'
}

export type EvidenceMetadata = {
  __typename?: 'EvidenceMetadata';
  /** Description of the evidence */
  description?: Maybe<Scalars['String']>;
  /** File extension of the attached file */
  fileTypeExtension?: Maybe<Scalars['String']>;
  /** URI of the attached file */
  fileURI?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  /** Name of the evidence */
  name?: Maybe<Scalars['String']>;
  /** Title of the evidence */
  title?: Maybe<Scalars['String']>;
};

export type EvidenceMetadata_Filter = {
  /** Filter for the block changed event. */
  _change_block?: Maybe<BlockChangedFilter>;
  and?: Maybe<Array<Maybe<EvidenceMetadata_Filter>>>;
  description?: Maybe<Scalars['String']>;
  description_contains?: Maybe<Scalars['String']>;
  description_contains_nocase?: Maybe<Scalars['String']>;
  description_ends_with?: Maybe<Scalars['String']>;
  description_ends_with_nocase?: Maybe<Scalars['String']>;
  description_gt?: Maybe<Scalars['String']>;
  description_gte?: Maybe<Scalars['String']>;
  description_in?: Maybe<Array<Scalars['String']>>;
  description_lt?: Maybe<Scalars['String']>;
  description_lte?: Maybe<Scalars['String']>;
  description_not?: Maybe<Scalars['String']>;
  description_not_contains?: Maybe<Scalars['String']>;
  description_not_contains_nocase?: Maybe<Scalars['String']>;
  description_not_ends_with?: Maybe<Scalars['String']>;
  description_not_ends_with_nocase?: Maybe<Scalars['String']>;
  description_not_in?: Maybe<Array<Scalars['String']>>;
  description_not_starts_with?: Maybe<Scalars['String']>;
  description_not_starts_with_nocase?: Maybe<Scalars['String']>;
  description_starts_with?: Maybe<Scalars['String']>;
  description_starts_with_nocase?: Maybe<Scalars['String']>;
  fileTypeExtension?: Maybe<Scalars['String']>;
  fileTypeExtension_contains?: Maybe<Scalars['String']>;
  fileTypeExtension_contains_nocase?: Maybe<Scalars['String']>;
  fileTypeExtension_ends_with?: Maybe<Scalars['String']>;
  fileTypeExtension_ends_with_nocase?: Maybe<Scalars['String']>;
  fileTypeExtension_gt?: Maybe<Scalars['String']>;
  fileTypeExtension_gte?: Maybe<Scalars['String']>;
  fileTypeExtension_in?: Maybe<Array<Scalars['String']>>;
  fileTypeExtension_lt?: Maybe<Scalars['String']>;
  fileTypeExtension_lte?: Maybe<Scalars['String']>;
  fileTypeExtension_not?: Maybe<Scalars['String']>;
  fileTypeExtension_not_contains?: Maybe<Scalars['String']>;
  fileTypeExtension_not_contains_nocase?: Maybe<Scalars['String']>;
  fileTypeExtension_not_ends_with?: Maybe<Scalars['String']>;
  fileTypeExtension_not_ends_with_nocase?: Maybe<Scalars['String']>;
  fileTypeExtension_not_in?: Maybe<Array<Scalars['String']>>;
  fileTypeExtension_not_starts_with?: Maybe<Scalars['String']>;
  fileTypeExtension_not_starts_with_nocase?: Maybe<Scalars['String']>;
  fileTypeExtension_starts_with?: Maybe<Scalars['String']>;
  fileTypeExtension_starts_with_nocase?: Maybe<Scalars['String']>;
  fileURI?: Maybe<Scalars['String']>;
  fileURI_contains?: Maybe<Scalars['String']>;
  fileURI_contains_nocase?: Maybe<Scalars['String']>;
  fileURI_ends_with?: Maybe<Scalars['String']>;
  fileURI_ends_with_nocase?: Maybe<Scalars['String']>;
  fileURI_gt?: Maybe<Scalars['String']>;
  fileURI_gte?: Maybe<Scalars['String']>;
  fileURI_in?: Maybe<Array<Scalars['String']>>;
  fileURI_lt?: Maybe<Scalars['String']>;
  fileURI_lte?: Maybe<Scalars['String']>;
  fileURI_not?: Maybe<Scalars['String']>;
  fileURI_not_contains?: Maybe<Scalars['String']>;
  fileURI_not_contains_nocase?: Maybe<Scalars['String']>;
  fileURI_not_ends_with?: Maybe<Scalars['String']>;
  fileURI_not_ends_with_nocase?: Maybe<Scalars['String']>;
  fileURI_not_in?: Maybe<Array<Scalars['String']>>;
  fileURI_not_starts_with?: Maybe<Scalars['String']>;
  fileURI_not_starts_with_nocase?: Maybe<Scalars['String']>;
  fileURI_starts_with?: Maybe<Scalars['String']>;
  fileURI_starts_with_nocase?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_lt?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
  name?: Maybe<Scalars['String']>;
  name_contains?: Maybe<Scalars['String']>;
  name_contains_nocase?: Maybe<Scalars['String']>;
  name_ends_with?: Maybe<Scalars['String']>;
  name_ends_with_nocase?: Maybe<Scalars['String']>;
  name_gt?: Maybe<Scalars['String']>;
  name_gte?: Maybe<Scalars['String']>;
  name_in?: Maybe<Array<Scalars['String']>>;
  name_lt?: Maybe<Scalars['String']>;
  name_lte?: Maybe<Scalars['String']>;
  name_not?: Maybe<Scalars['String']>;
  name_not_contains?: Maybe<Scalars['String']>;
  name_not_contains_nocase?: Maybe<Scalars['String']>;
  name_not_ends_with?: Maybe<Scalars['String']>;
  name_not_ends_with_nocase?: Maybe<Scalars['String']>;
  name_not_in?: Maybe<Array<Scalars['String']>>;
  name_not_starts_with?: Maybe<Scalars['String']>;
  name_not_starts_with_nocase?: Maybe<Scalars['String']>;
  name_starts_with?: Maybe<Scalars['String']>;
  name_starts_with_nocase?: Maybe<Scalars['String']>;
  or?: Maybe<Array<Maybe<EvidenceMetadata_Filter>>>;
  title?: Maybe<Scalars['String']>;
  title_contains?: Maybe<Scalars['String']>;
  title_contains_nocase?: Maybe<Scalars['String']>;
  title_ends_with?: Maybe<Scalars['String']>;
  title_ends_with_nocase?: Maybe<Scalars['String']>;
  title_gt?: Maybe<Scalars['String']>;
  title_gte?: Maybe<Scalars['String']>;
  title_in?: Maybe<Array<Scalars['String']>>;
  title_lt?: Maybe<Scalars['String']>;
  title_lte?: Maybe<Scalars['String']>;
  title_not?: Maybe<Scalars['String']>;
  title_not_contains?: Maybe<Scalars['String']>;
  title_not_contains_nocase?: Maybe<Scalars['String']>;
  title_not_ends_with?: Maybe<Scalars['String']>;
  title_not_ends_with_nocase?: Maybe<Scalars['String']>;
  title_not_in?: Maybe<Array<Scalars['String']>>;
  title_not_starts_with?: Maybe<Scalars['String']>;
  title_not_starts_with_nocase?: Maybe<Scalars['String']>;
  title_starts_with?: Maybe<Scalars['String']>;
  title_starts_with_nocase?: Maybe<Scalars['String']>;
};

export enum EvidenceMetadata_OrderBy {
  Description = 'description',
  FileTypeExtension = 'fileTypeExtension',
  FileUri = 'fileURI',
  Id = 'id',
  Name = 'name',
  Title = 'title'
}

export type Evidence_Filter = {
  URI?: Maybe<Scalars['String']>;
  URI_contains?: Maybe<Scalars['String']>;
  URI_contains_nocase?: Maybe<Scalars['String']>;
  URI_ends_with?: Maybe<Scalars['String']>;
  URI_ends_with_nocase?: Maybe<Scalars['String']>;
  URI_gt?: Maybe<Scalars['String']>;
  URI_gte?: Maybe<Scalars['String']>;
  URI_in?: Maybe<Array<Scalars['String']>>;
  URI_lt?: Maybe<Scalars['String']>;
  URI_lte?: Maybe<Scalars['String']>;
  URI_not?: Maybe<Scalars['String']>;
  URI_not_contains?: Maybe<Scalars['String']>;
  URI_not_contains_nocase?: Maybe<Scalars['String']>;
  URI_not_ends_with?: Maybe<Scalars['String']>;
  URI_not_ends_with_nocase?: Maybe<Scalars['String']>;
  URI_not_in?: Maybe<Array<Scalars['String']>>;
  URI_not_starts_with?: Maybe<Scalars['String']>;
  URI_not_starts_with_nocase?: Maybe<Scalars['String']>;
  URI_starts_with?: Maybe<Scalars['String']>;
  URI_starts_with_nocase?: Maybe<Scalars['String']>;
  /** Filter for the block changed event. */
  _change_block?: Maybe<BlockChangedFilter>;
  and?: Maybe<Array<Maybe<Evidence_Filter>>>;
  arbitrator?: Maybe<Scalars['Bytes']>;
  arbitrator_contains?: Maybe<Scalars['Bytes']>;
  arbitrator_gt?: Maybe<Scalars['Bytes']>;
  arbitrator_gte?: Maybe<Scalars['Bytes']>;
  arbitrator_in?: Maybe<Array<Scalars['Bytes']>>;
  arbitrator_lt?: Maybe<Scalars['Bytes']>;
  arbitrator_lte?: Maybe<Scalars['Bytes']>;
  arbitrator_not?: Maybe<Scalars['Bytes']>;
  arbitrator_not_contains?: Maybe<Scalars['Bytes']>;
  arbitrator_not_in?: Maybe<Array<Scalars['Bytes']>>;
  evidenceGroup?: Maybe<Scalars['String']>;
  evidenceGroup_?: Maybe<EvidenceGroup_Filter>;
  evidenceGroup_contains?: Maybe<Scalars['String']>;
  evidenceGroup_contains_nocase?: Maybe<Scalars['String']>;
  evidenceGroup_ends_with?: Maybe<Scalars['String']>;
  evidenceGroup_ends_with_nocase?: Maybe<Scalars['String']>;
  evidenceGroup_gt?: Maybe<Scalars['String']>;
  evidenceGroup_gte?: Maybe<Scalars['String']>;
  evidenceGroup_in?: Maybe<Array<Scalars['String']>>;
  evidenceGroup_lt?: Maybe<Scalars['String']>;
  evidenceGroup_lte?: Maybe<Scalars['String']>;
  evidenceGroup_not?: Maybe<Scalars['String']>;
  evidenceGroup_not_contains?: Maybe<Scalars['String']>;
  evidenceGroup_not_contains_nocase?: Maybe<Scalars['String']>;
  evidenceGroup_not_ends_with?: Maybe<Scalars['String']>;
  evidenceGroup_not_ends_with_nocase?: Maybe<Scalars['String']>;
  evidenceGroup_not_in?: Maybe<Array<Scalars['String']>>;
  evidenceGroup_not_starts_with?: Maybe<Scalars['String']>;
  evidenceGroup_not_starts_with_nocase?: Maybe<Scalars['String']>;
  evidenceGroup_starts_with?: Maybe<Scalars['String']>;
  evidenceGroup_starts_with_nocase?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_lt?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
  metadata?: Maybe<Scalars['String']>;
  metadata_?: Maybe<EvidenceMetadata_Filter>;
  metadata_contains?: Maybe<Scalars['String']>;
  metadata_contains_nocase?: Maybe<Scalars['String']>;
  metadata_ends_with?: Maybe<Scalars['String']>;
  metadata_ends_with_nocase?: Maybe<Scalars['String']>;
  metadata_gt?: Maybe<Scalars['String']>;
  metadata_gte?: Maybe<Scalars['String']>;
  metadata_in?: Maybe<Array<Scalars['String']>>;
  metadata_lt?: Maybe<Scalars['String']>;
  metadata_lte?: Maybe<Scalars['String']>;
  metadata_not?: Maybe<Scalars['String']>;
  metadata_not_contains?: Maybe<Scalars['String']>;
  metadata_not_contains_nocase?: Maybe<Scalars['String']>;
  metadata_not_ends_with?: Maybe<Scalars['String']>;
  metadata_not_ends_with_nocase?: Maybe<Scalars['String']>;
  metadata_not_in?: Maybe<Array<Scalars['String']>>;
  metadata_not_starts_with?: Maybe<Scalars['String']>;
  metadata_not_starts_with_nocase?: Maybe<Scalars['String']>;
  metadata_starts_with?: Maybe<Scalars['String']>;
  metadata_starts_with_nocase?: Maybe<Scalars['String']>;
  number?: Maybe<Scalars['BigInt']>;
  number_gt?: Maybe<Scalars['BigInt']>;
  number_gte?: Maybe<Scalars['BigInt']>;
  number_in?: Maybe<Array<Scalars['BigInt']>>;
  number_lt?: Maybe<Scalars['BigInt']>;
  number_lte?: Maybe<Scalars['BigInt']>;
  number_not?: Maybe<Scalars['BigInt']>;
  number_not_in?: Maybe<Array<Scalars['BigInt']>>;
  or?: Maybe<Array<Maybe<Evidence_Filter>>>;
  party?: Maybe<Scalars['Bytes']>;
  party_contains?: Maybe<Scalars['Bytes']>;
  party_gt?: Maybe<Scalars['Bytes']>;
  party_gte?: Maybe<Scalars['Bytes']>;
  party_in?: Maybe<Array<Scalars['Bytes']>>;
  party_lt?: Maybe<Scalars['Bytes']>;
  party_lte?: Maybe<Scalars['Bytes']>;
  party_not?: Maybe<Scalars['Bytes']>;
  party_not_contains?: Maybe<Scalars['Bytes']>;
  party_not_in?: Maybe<Array<Scalars['Bytes']>>;
  timestamp?: Maybe<Scalars['BigInt']>;
  timestamp_gt?: Maybe<Scalars['BigInt']>;
  timestamp_gte?: Maybe<Scalars['BigInt']>;
  timestamp_in?: Maybe<Array<Scalars['BigInt']>>;
  timestamp_lt?: Maybe<Scalars['BigInt']>;
  timestamp_lte?: Maybe<Scalars['BigInt']>;
  timestamp_not?: Maybe<Scalars['BigInt']>;
  timestamp_not_in?: Maybe<Array<Scalars['BigInt']>>;
  txHash?: Maybe<Scalars['Bytes']>;
  txHash_contains?: Maybe<Scalars['Bytes']>;
  txHash_gt?: Maybe<Scalars['Bytes']>;
  txHash_gte?: Maybe<Scalars['Bytes']>;
  txHash_in?: Maybe<Array<Scalars['Bytes']>>;
  txHash_lt?: Maybe<Scalars['Bytes']>;
  txHash_lte?: Maybe<Scalars['Bytes']>;
  txHash_not?: Maybe<Scalars['Bytes']>;
  txHash_not_contains?: Maybe<Scalars['Bytes']>;
  txHash_not_in?: Maybe<Array<Scalars['Bytes']>>;
};

export enum Evidence_OrderBy {
  Uri = 'URI',
  Arbitrator = 'arbitrator',
  EvidenceGroup = 'evidenceGroup',
  EvidenceGroupId = 'evidenceGroup__id',
  EvidenceGroupNumberOfEvidence = 'evidenceGroup__numberOfEvidence',
  Id = 'id',
  Metadata = 'metadata',
  MetadataDescription = 'metadata__description',
  MetadataFileTypeExtension = 'metadata__fileTypeExtension',
  MetadataFileUri = 'metadata__fileURI',
  MetadataId = 'metadata__id',
  MetadataName = 'metadata__name',
  MetadataTitle = 'metadata__title',
  Number = 'number',
  Party = 'party',
  Timestamp = 'timestamp',
  TxHash = 'txHash'
}

export type Factory = {
  __typename?: 'Factory';
  defaultCommunityFee: Scalars['BigInt'];
  id: Scalars['ID'];
  owner: Scalars['ID'];
  poolCount: Scalars['BigInt'];
  totalFeesMatic: Scalars['BigDecimal'];
  totalFeesUSD: Scalars['BigDecimal'];
  totalValueLockedMatic: Scalars['BigDecimal'];
  totalValueLockedMaticUntracked: Scalars['BigDecimal'];
  totalValueLockedUSD: Scalars['BigDecimal'];
  totalValueLockedUSDUntracked: Scalars['BigDecimal'];
  totalVolumeMatic: Scalars['BigDecimal'];
  totalVolumeUSD: Scalars['BigDecimal'];
  txCount: Scalars['BigInt'];
  untrackedVolumeUSD: Scalars['BigDecimal'];
};

export type Factory_Filter = {
  /** Filter for the block changed event. */
  _change_block?: Maybe<BlockChangedFilter>;
  and?: Maybe<Array<Maybe<Factory_Filter>>>;
  defaultCommunityFee?: Maybe<Scalars['BigInt']>;
  defaultCommunityFee_gt?: Maybe<Scalars['BigInt']>;
  defaultCommunityFee_gte?: Maybe<Scalars['BigInt']>;
  defaultCommunityFee_in?: Maybe<Array<Scalars['BigInt']>>;
  defaultCommunityFee_lt?: Maybe<Scalars['BigInt']>;
  defaultCommunityFee_lte?: Maybe<Scalars['BigInt']>;
  defaultCommunityFee_not?: Maybe<Scalars['BigInt']>;
  defaultCommunityFee_not_in?: Maybe<Array<Scalars['BigInt']>>;
  id?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_lt?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
  or?: Maybe<Array<Maybe<Factory_Filter>>>;
  owner?: Maybe<Scalars['ID']>;
  owner_gt?: Maybe<Scalars['ID']>;
  owner_gte?: Maybe<Scalars['ID']>;
  owner_in?: Maybe<Array<Scalars['ID']>>;
  owner_lt?: Maybe<Scalars['ID']>;
  owner_lte?: Maybe<Scalars['ID']>;
  owner_not?: Maybe<Scalars['ID']>;
  owner_not_in?: Maybe<Array<Scalars['ID']>>;
  poolCount?: Maybe<Scalars['BigInt']>;
  poolCount_gt?: Maybe<Scalars['BigInt']>;
  poolCount_gte?: Maybe<Scalars['BigInt']>;
  poolCount_in?: Maybe<Array<Scalars['BigInt']>>;
  poolCount_lt?: Maybe<Scalars['BigInt']>;
  poolCount_lte?: Maybe<Scalars['BigInt']>;
  poolCount_not?: Maybe<Scalars['BigInt']>;
  poolCount_not_in?: Maybe<Array<Scalars['BigInt']>>;
  totalFeesMatic?: Maybe<Scalars['BigDecimal']>;
  totalFeesMatic_gt?: Maybe<Scalars['BigDecimal']>;
  totalFeesMatic_gte?: Maybe<Scalars['BigDecimal']>;
  totalFeesMatic_in?: Maybe<Array<Scalars['BigDecimal']>>;
  totalFeesMatic_lt?: Maybe<Scalars['BigDecimal']>;
  totalFeesMatic_lte?: Maybe<Scalars['BigDecimal']>;
  totalFeesMatic_not?: Maybe<Scalars['BigDecimal']>;
  totalFeesMatic_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
  totalFeesUSD?: Maybe<Scalars['BigDecimal']>;
  totalFeesUSD_gt?: Maybe<Scalars['BigDecimal']>;
  totalFeesUSD_gte?: Maybe<Scalars['BigDecimal']>;
  totalFeesUSD_in?: Maybe<Array<Scalars['BigDecimal']>>;
  totalFeesUSD_lt?: Maybe<Scalars['BigDecimal']>;
  totalFeesUSD_lte?: Maybe<Scalars['BigDecimal']>;
  totalFeesUSD_not?: Maybe<Scalars['BigDecimal']>;
  totalFeesUSD_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
  totalValueLockedMatic?: Maybe<Scalars['BigDecimal']>;
  totalValueLockedMaticUntracked?: Maybe<Scalars['BigDecimal']>;
  totalValueLockedMaticUntracked_gt?: Maybe<Scalars['BigDecimal']>;
  totalValueLockedMaticUntracked_gte?: Maybe<Scalars['BigDecimal']>;
  totalValueLockedMaticUntracked_in?: Maybe<Array<Scalars['BigDecimal']>>;
  totalValueLockedMaticUntracked_lt?: Maybe<Scalars['BigDecimal']>;
  totalValueLockedMaticUntracked_lte?: Maybe<Scalars['BigDecimal']>;
  totalValueLockedMaticUntracked_not?: Maybe<Scalars['BigDecimal']>;
  totalValueLockedMaticUntracked_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
  totalValueLockedMatic_gt?: Maybe<Scalars['BigDecimal']>;
  totalValueLockedMatic_gte?: Maybe<Scalars['BigDecimal']>;
  totalValueLockedMatic_in?: Maybe<Array<Scalars['BigDecimal']>>;
  totalValueLockedMatic_lt?: Maybe<Scalars['BigDecimal']>;
  totalValueLockedMatic_lte?: Maybe<Scalars['BigDecimal']>;
  totalValueLockedMatic_not?: Maybe<Scalars['BigDecimal']>;
  totalValueLockedMatic_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
  totalValueLockedUSD?: Maybe<Scalars['BigDecimal']>;
  totalValueLockedUSDUntracked?: Maybe<Scalars['BigDecimal']>;
  totalValueLockedUSDUntracked_gt?: Maybe<Scalars['BigDecimal']>;
  totalValueLockedUSDUntracked_gte?: Maybe<Scalars['BigDecimal']>;
  totalValueLockedUSDUntracked_in?: Maybe<Array<Scalars['BigDecimal']>>;
  totalValueLockedUSDUntracked_lt?: Maybe<Scalars['BigDecimal']>;
  totalValueLockedUSDUntracked_lte?: Maybe<Scalars['BigDecimal']>;
  totalValueLockedUSDUntracked_not?: Maybe<Scalars['BigDecimal']>;
  totalValueLockedUSDUntracked_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
  totalValueLockedUSD_gt?: Maybe<Scalars['BigDecimal']>;
  totalValueLockedUSD_gte?: Maybe<Scalars['BigDecimal']>;
  totalValueLockedUSD_in?: Maybe<Array<Scalars['BigDecimal']>>;
  totalValueLockedUSD_lt?: Maybe<Scalars['BigDecimal']>;
  totalValueLockedUSD_lte?: Maybe<Scalars['BigDecimal']>;
  totalValueLockedUSD_not?: Maybe<Scalars['BigDecimal']>;
  totalValueLockedUSD_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
  totalVolumeMatic?: Maybe<Scalars['BigDecimal']>;
  totalVolumeMatic_gt?: Maybe<Scalars['BigDecimal']>;
  totalVolumeMatic_gte?: Maybe<Scalars['BigDecimal']>;
  totalVolumeMatic_in?: Maybe<Array<Scalars['BigDecimal']>>;
  totalVolumeMatic_lt?: Maybe<Scalars['BigDecimal']>;
  totalVolumeMatic_lte?: Maybe<Scalars['BigDecimal']>;
  totalVolumeMatic_not?: Maybe<Scalars['BigDecimal']>;
  totalVolumeMatic_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
  totalVolumeUSD?: Maybe<Scalars['BigDecimal']>;
  totalVolumeUSD_gt?: Maybe<Scalars['BigDecimal']>;
  totalVolumeUSD_gte?: Maybe<Scalars['BigDecimal']>;
  totalVolumeUSD_in?: Maybe<Array<Scalars['BigDecimal']>>;
  totalVolumeUSD_lt?: Maybe<Scalars['BigDecimal']>;
  totalVolumeUSD_lte?: Maybe<Scalars['BigDecimal']>;
  totalVolumeUSD_not?: Maybe<Scalars['BigDecimal']>;
  totalVolumeUSD_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
  txCount?: Maybe<Scalars['BigInt']>;
  txCount_gt?: Maybe<Scalars['BigInt']>;
  txCount_gte?: Maybe<Scalars['BigInt']>;
  txCount_in?: Maybe<Array<Scalars['BigInt']>>;
  txCount_lt?: Maybe<Scalars['BigInt']>;
  txCount_lte?: Maybe<Scalars['BigInt']>;
  txCount_not?: Maybe<Scalars['BigInt']>;
  txCount_not_in?: Maybe<Array<Scalars['BigInt']>>;
  untrackedVolumeUSD?: Maybe<Scalars['BigDecimal']>;
  untrackedVolumeUSD_gt?: Maybe<Scalars['BigDecimal']>;
  untrackedVolumeUSD_gte?: Maybe<Scalars['BigDecimal']>;
  untrackedVolumeUSD_in?: Maybe<Array<Scalars['BigDecimal']>>;
  untrackedVolumeUSD_lt?: Maybe<Scalars['BigDecimal']>;
  untrackedVolumeUSD_lte?: Maybe<Scalars['BigDecimal']>;
  untrackedVolumeUSD_not?: Maybe<Scalars['BigDecimal']>;
  untrackedVolumeUSD_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
};

export enum Factory_OrderBy {
  DefaultCommunityFee = 'defaultCommunityFee',
  Id = 'id',
  Owner = 'owner',
  PoolCount = 'poolCount',
  TotalFeesMatic = 'totalFeesMatic',
  TotalFeesUsd = 'totalFeesUSD',
  TotalValueLockedMatic = 'totalValueLockedMatic',
  TotalValueLockedMaticUntracked = 'totalValueLockedMaticUntracked',
  TotalValueLockedUsd = 'totalValueLockedUSD',
  TotalValueLockedUsdUntracked = 'totalValueLockedUSDUntracked',
  TotalVolumeMatic = 'totalVolumeMatic',
  TotalVolumeUsd = 'totalVolumeUSD',
  TxCount = 'txCount',
  UntrackedVolumeUsd = 'untrackedVolumeUSD'
}

export type FeeHourData = {
  __typename?: 'FeeHourData';
  changesCount: Scalars['BigInt'];
  endFee: Scalars['BigInt'];
  fee: Scalars['BigInt'];
  id: Scalars['ID'];
  maxFee: Scalars['BigInt'];
  minFee: Scalars['BigInt'];
  pool: Scalars['String'];
  startFee: Scalars['BigInt'];
  timestamp: Scalars['BigInt'];
};

export type FeeHourData_Filter = {
  /** Filter for the block changed event. */
  _change_block?: Maybe<BlockChangedFilter>;
  and?: Maybe<Array<Maybe<FeeHourData_Filter>>>;
  changesCount?: Maybe<Scalars['BigInt']>;
  changesCount_gt?: Maybe<Scalars['BigInt']>;
  changesCount_gte?: Maybe<Scalars['BigInt']>;
  changesCount_in?: Maybe<Array<Scalars['BigInt']>>;
  changesCount_lt?: Maybe<Scalars['BigInt']>;
  changesCount_lte?: Maybe<Scalars['BigInt']>;
  changesCount_not?: Maybe<Scalars['BigInt']>;
  changesCount_not_in?: Maybe<Array<Scalars['BigInt']>>;
  endFee?: Maybe<Scalars['BigInt']>;
  endFee_gt?: Maybe<Scalars['BigInt']>;
  endFee_gte?: Maybe<Scalars['BigInt']>;
  endFee_in?: Maybe<Array<Scalars['BigInt']>>;
  endFee_lt?: Maybe<Scalars['BigInt']>;
  endFee_lte?: Maybe<Scalars['BigInt']>;
  endFee_not?: Maybe<Scalars['BigInt']>;
  endFee_not_in?: Maybe<Array<Scalars['BigInt']>>;
  fee?: Maybe<Scalars['BigInt']>;
  fee_gt?: Maybe<Scalars['BigInt']>;
  fee_gte?: Maybe<Scalars['BigInt']>;
  fee_in?: Maybe<Array<Scalars['BigInt']>>;
  fee_lt?: Maybe<Scalars['BigInt']>;
  fee_lte?: Maybe<Scalars['BigInt']>;
  fee_not?: Maybe<Scalars['BigInt']>;
  fee_not_in?: Maybe<Array<Scalars['BigInt']>>;
  id?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_lt?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
  maxFee?: Maybe<Scalars['BigInt']>;
  maxFee_gt?: Maybe<Scalars['BigInt']>;
  maxFee_gte?: Maybe<Scalars['BigInt']>;
  maxFee_in?: Maybe<Array<Scalars['BigInt']>>;
  maxFee_lt?: Maybe<Scalars['BigInt']>;
  maxFee_lte?: Maybe<Scalars['BigInt']>;
  maxFee_not?: Maybe<Scalars['BigInt']>;
  maxFee_not_in?: Maybe<Array<Scalars['BigInt']>>;
  minFee?: Maybe<Scalars['BigInt']>;
  minFee_gt?: Maybe<Scalars['BigInt']>;
  minFee_gte?: Maybe<Scalars['BigInt']>;
  minFee_in?: Maybe<Array<Scalars['BigInt']>>;
  minFee_lt?: Maybe<Scalars['BigInt']>;
  minFee_lte?: Maybe<Scalars['BigInt']>;
  minFee_not?: Maybe<Scalars['BigInt']>;
  minFee_not_in?: Maybe<Array<Scalars['BigInt']>>;
  or?: Maybe<Array<Maybe<FeeHourData_Filter>>>;
  pool?: Maybe<Scalars['String']>;
  pool_contains?: Maybe<Scalars['String']>;
  pool_contains_nocase?: Maybe<Scalars['String']>;
  pool_ends_with?: Maybe<Scalars['String']>;
  pool_ends_with_nocase?: Maybe<Scalars['String']>;
  pool_gt?: Maybe<Scalars['String']>;
  pool_gte?: Maybe<Scalars['String']>;
  pool_in?: Maybe<Array<Scalars['String']>>;
  pool_lt?: Maybe<Scalars['String']>;
  pool_lte?: Maybe<Scalars['String']>;
  pool_not?: Maybe<Scalars['String']>;
  pool_not_contains?: Maybe<Scalars['String']>;
  pool_not_contains_nocase?: Maybe<Scalars['String']>;
  pool_not_ends_with?: Maybe<Scalars['String']>;
  pool_not_ends_with_nocase?: Maybe<Scalars['String']>;
  pool_not_in?: Maybe<Array<Scalars['String']>>;
  pool_not_starts_with?: Maybe<Scalars['String']>;
  pool_not_starts_with_nocase?: Maybe<Scalars['String']>;
  pool_starts_with?: Maybe<Scalars['String']>;
  pool_starts_with_nocase?: Maybe<Scalars['String']>;
  startFee?: Maybe<Scalars['BigInt']>;
  startFee_gt?: Maybe<Scalars['BigInt']>;
  startFee_gte?: Maybe<Scalars['BigInt']>;
  startFee_in?: Maybe<Array<Scalars['BigInt']>>;
  startFee_lt?: Maybe<Scalars['BigInt']>;
  startFee_lte?: Maybe<Scalars['BigInt']>;
  startFee_not?: Maybe<Scalars['BigInt']>;
  startFee_not_in?: Maybe<Array<Scalars['BigInt']>>;
  timestamp?: Maybe<Scalars['BigInt']>;
  timestamp_gt?: Maybe<Scalars['BigInt']>;
  timestamp_gte?: Maybe<Scalars['BigInt']>;
  timestamp_in?: Maybe<Array<Scalars['BigInt']>>;
  timestamp_lt?: Maybe<Scalars['BigInt']>;
  timestamp_lte?: Maybe<Scalars['BigInt']>;
  timestamp_not?: Maybe<Scalars['BigInt']>;
  timestamp_not_in?: Maybe<Array<Scalars['BigInt']>>;
};

export enum FeeHourData_OrderBy {
  ChangesCount = 'changesCount',
  EndFee = 'endFee',
  Fee = 'fee',
  Id = 'id',
  MaxFee = 'maxFee',
  MinFee = 'minFee',
  Pool = 'pool',
  StartFee = 'startFee',
  Timestamp = 'timestamp'
}

export type Flash = {
  __typename?: 'Flash';
  amount0: Scalars['BigDecimal'];
  amount0Paid: Scalars['BigDecimal'];
  amount1: Scalars['BigDecimal'];
  amount1Paid: Scalars['BigDecimal'];
  amountUSD: Scalars['BigDecimal'];
  id: Scalars['ID'];
  logIndex?: Maybe<Scalars['BigInt']>;
  pool: Pool;
  recipient: Scalars['Bytes'];
  sender: Scalars['Bytes'];
  timestamp: Scalars['BigInt'];
  transaction: Transaction;
};

export type Flash_Filter = {
  /** Filter for the block changed event. */
  _change_block?: Maybe<BlockChangedFilter>;
  amount0?: Maybe<Scalars['BigDecimal']>;
  amount0Paid?: Maybe<Scalars['BigDecimal']>;
  amount0Paid_gt?: Maybe<Scalars['BigDecimal']>;
  amount0Paid_gte?: Maybe<Scalars['BigDecimal']>;
  amount0Paid_in?: Maybe<Array<Scalars['BigDecimal']>>;
  amount0Paid_lt?: Maybe<Scalars['BigDecimal']>;
  amount0Paid_lte?: Maybe<Scalars['BigDecimal']>;
  amount0Paid_not?: Maybe<Scalars['BigDecimal']>;
  amount0Paid_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
  amount0_gt?: Maybe<Scalars['BigDecimal']>;
  amount0_gte?: Maybe<Scalars['BigDecimal']>;
  amount0_in?: Maybe<Array<Scalars['BigDecimal']>>;
  amount0_lt?: Maybe<Scalars['BigDecimal']>;
  amount0_lte?: Maybe<Scalars['BigDecimal']>;
  amount0_not?: Maybe<Scalars['BigDecimal']>;
  amount0_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
  amount1?: Maybe<Scalars['BigDecimal']>;
  amount1Paid?: Maybe<Scalars['BigDecimal']>;
  amount1Paid_gt?: Maybe<Scalars['BigDecimal']>;
  amount1Paid_gte?: Maybe<Scalars['BigDecimal']>;
  amount1Paid_in?: Maybe<Array<Scalars['BigDecimal']>>;
  amount1Paid_lt?: Maybe<Scalars['BigDecimal']>;
  amount1Paid_lte?: Maybe<Scalars['BigDecimal']>;
  amount1Paid_not?: Maybe<Scalars['BigDecimal']>;
  amount1Paid_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
  amount1_gt?: Maybe<Scalars['BigDecimal']>;
  amount1_gte?: Maybe<Scalars['BigDecimal']>;
  amount1_in?: Maybe<Array<Scalars['BigDecimal']>>;
  amount1_lt?: Maybe<Scalars['BigDecimal']>;
  amount1_lte?: Maybe<Scalars['BigDecimal']>;
  amount1_not?: Maybe<Scalars['BigDecimal']>;
  amount1_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
  amountUSD?: Maybe<Scalars['BigDecimal']>;
  amountUSD_gt?: Maybe<Scalars['BigDecimal']>;
  amountUSD_gte?: Maybe<Scalars['BigDecimal']>;
  amountUSD_in?: Maybe<Array<Scalars['BigDecimal']>>;
  amountUSD_lt?: Maybe<Scalars['BigDecimal']>;
  amountUSD_lte?: Maybe<Scalars['BigDecimal']>;
  amountUSD_not?: Maybe<Scalars['BigDecimal']>;
  amountUSD_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
  and?: Maybe<Array<Maybe<Flash_Filter>>>;
  id?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_lt?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
  logIndex?: Maybe<Scalars['BigInt']>;
  logIndex_gt?: Maybe<Scalars['BigInt']>;
  logIndex_gte?: Maybe<Scalars['BigInt']>;
  logIndex_in?: Maybe<Array<Scalars['BigInt']>>;
  logIndex_lt?: Maybe<Scalars['BigInt']>;
  logIndex_lte?: Maybe<Scalars['BigInt']>;
  logIndex_not?: Maybe<Scalars['BigInt']>;
  logIndex_not_in?: Maybe<Array<Scalars['BigInt']>>;
  or?: Maybe<Array<Maybe<Flash_Filter>>>;
  pool?: Maybe<Scalars['String']>;
  pool_?: Maybe<Pool_Filter>;
  pool_contains?: Maybe<Scalars['String']>;
  pool_contains_nocase?: Maybe<Scalars['String']>;
  pool_ends_with?: Maybe<Scalars['String']>;
  pool_ends_with_nocase?: Maybe<Scalars['String']>;
  pool_gt?: Maybe<Scalars['String']>;
  pool_gte?: Maybe<Scalars['String']>;
  pool_in?: Maybe<Array<Scalars['String']>>;
  pool_lt?: Maybe<Scalars['String']>;
  pool_lte?: Maybe<Scalars['String']>;
  pool_not?: Maybe<Scalars['String']>;
  pool_not_contains?: Maybe<Scalars['String']>;
  pool_not_contains_nocase?: Maybe<Scalars['String']>;
  pool_not_ends_with?: Maybe<Scalars['String']>;
  pool_not_ends_with_nocase?: Maybe<Scalars['String']>;
  pool_not_in?: Maybe<Array<Scalars['String']>>;
  pool_not_starts_with?: Maybe<Scalars['String']>;
  pool_not_starts_with_nocase?: Maybe<Scalars['String']>;
  pool_starts_with?: Maybe<Scalars['String']>;
  pool_starts_with_nocase?: Maybe<Scalars['String']>;
  recipient?: Maybe<Scalars['Bytes']>;
  recipient_contains?: Maybe<Scalars['Bytes']>;
  recipient_gt?: Maybe<Scalars['Bytes']>;
  recipient_gte?: Maybe<Scalars['Bytes']>;
  recipient_in?: Maybe<Array<Scalars['Bytes']>>;
  recipient_lt?: Maybe<Scalars['Bytes']>;
  recipient_lte?: Maybe<Scalars['Bytes']>;
  recipient_not?: Maybe<Scalars['Bytes']>;
  recipient_not_contains?: Maybe<Scalars['Bytes']>;
  recipient_not_in?: Maybe<Array<Scalars['Bytes']>>;
  sender?: Maybe<Scalars['Bytes']>;
  sender_contains?: Maybe<Scalars['Bytes']>;
  sender_gt?: Maybe<Scalars['Bytes']>;
  sender_gte?: Maybe<Scalars['Bytes']>;
  sender_in?: Maybe<Array<Scalars['Bytes']>>;
  sender_lt?: Maybe<Scalars['Bytes']>;
  sender_lte?: Maybe<Scalars['Bytes']>;
  sender_not?: Maybe<Scalars['Bytes']>;
  sender_not_contains?: Maybe<Scalars['Bytes']>;
  sender_not_in?: Maybe<Array<Scalars['Bytes']>>;
  timestamp?: Maybe<Scalars['BigInt']>;
  timestamp_gt?: Maybe<Scalars['BigInt']>;
  timestamp_gte?: Maybe<Scalars['BigInt']>;
  timestamp_in?: Maybe<Array<Scalars['BigInt']>>;
  timestamp_lt?: Maybe<Scalars['BigInt']>;
  timestamp_lte?: Maybe<Scalars['BigInt']>;
  timestamp_not?: Maybe<Scalars['BigInt']>;
  timestamp_not_in?: Maybe<Array<Scalars['BigInt']>>;
  transaction?: Maybe<Scalars['String']>;
  transaction_?: Maybe<Transaction_Filter>;
  transaction_contains?: Maybe<Scalars['String']>;
  transaction_contains_nocase?: Maybe<Scalars['String']>;
  transaction_ends_with?: Maybe<Scalars['String']>;
  transaction_ends_with_nocase?: Maybe<Scalars['String']>;
  transaction_gt?: Maybe<Scalars['String']>;
  transaction_gte?: Maybe<Scalars['String']>;
  transaction_in?: Maybe<Array<Scalars['String']>>;
  transaction_lt?: Maybe<Scalars['String']>;
  transaction_lte?: Maybe<Scalars['String']>;
  transaction_not?: Maybe<Scalars['String']>;
  transaction_not_contains?: Maybe<Scalars['String']>;
  transaction_not_contains_nocase?: Maybe<Scalars['String']>;
  transaction_not_ends_with?: Maybe<Scalars['String']>;
  transaction_not_ends_with_nocase?: Maybe<Scalars['String']>;
  transaction_not_in?: Maybe<Array<Scalars['String']>>;
  transaction_not_starts_with?: Maybe<Scalars['String']>;
  transaction_not_starts_with_nocase?: Maybe<Scalars['String']>;
  transaction_starts_with?: Maybe<Scalars['String']>;
  transaction_starts_with_nocase?: Maybe<Scalars['String']>;
};

export enum Flash_OrderBy {
  Amount0 = 'amount0',
  Amount0Paid = 'amount0Paid',
  Amount1 = 'amount1',
  Amount1Paid = 'amount1Paid',
  AmountUsd = 'amountUSD',
  Id = 'id',
  LogIndex = 'logIndex',
  Pool = 'pool',
  PoolCollectedFeesToken0 = 'pool__collectedFeesToken0',
  PoolCollectedFeesToken1 = 'pool__collectedFeesToken1',
  PoolCollectedFeesUsd = 'pool__collectedFeesUSD',
  PoolCommunityFee0 = 'pool__communityFee0',
  PoolCommunityFee1 = 'pool__communityFee1',
  PoolCreatedAtBlockNumber = 'pool__createdAtBlockNumber',
  PoolCreatedAtTimestamp = 'pool__createdAtTimestamp',
  PoolFee = 'pool__fee',
  PoolFeeGrowthGlobal0X128 = 'pool__feeGrowthGlobal0X128',
  PoolFeeGrowthGlobal1X128 = 'pool__feeGrowthGlobal1X128',
  PoolFeesToken0 = 'pool__feesToken0',
  PoolFeesToken1 = 'pool__feesToken1',
  PoolFeesUsd = 'pool__feesUSD',
  PoolId = 'pool__id',
  PoolLiquidity = 'pool__liquidity',
  PoolLiquidityProviderCount = 'pool__liquidityProviderCount',
  PoolObservationIndex = 'pool__observationIndex',
  PoolSqrtPrice = 'pool__sqrtPrice',
  PoolTick = 'pool__tick',
  PoolTickSpacing = 'pool__tickSpacing',
  PoolToken0Price = 'pool__token0Price',
  PoolToken1Price = 'pool__token1Price',
  PoolTotalValueLockedMatic = 'pool__totalValueLockedMatic',
  PoolTotalValueLockedToken0 = 'pool__totalValueLockedToken0',
  PoolTotalValueLockedToken1 = 'pool__totalValueLockedToken1',
  PoolTotalValueLockedUsd = 'pool__totalValueLockedUSD',
  PoolTotalValueLockedUsdUntracked = 'pool__totalValueLockedUSDUntracked',
  PoolTxCount = 'pool__txCount',
  PoolUntrackedFeesUsd = 'pool__untrackedFeesUSD',
  PoolUntrackedVolumeUsd = 'pool__untrackedVolumeUSD',
  PoolVolumeToken0 = 'pool__volumeToken0',
  PoolVolumeToken1 = 'pool__volumeToken1',
  PoolVolumeUsd = 'pool__volumeUSD',
  Recipient = 'recipient',
  Sender = 'sender',
  Timestamp = 'timestamp',
  Transaction = 'transaction',
  TransactionBlockNumber = 'transaction__blockNumber',
  TransactionGasLimit = 'transaction__gasLimit',
  TransactionGasPrice = 'transaction__gasPrice',
  TransactionId = 'transaction__id',
  TransactionTimestamp = 'transaction__timestamp'
}

export type HasPaidAppealFee = {
  __typename?: 'HasPaidAppealFee';
  /** <itemID>-<requestID>-<roundID>-<side> */
  id: Scalars['ID'];
  item: Item;
  request: Request;
  round: Round;
  /** Side the fund is in favor of */
  side: Scalars['BigInt'];
  /** Timestamp of the event */
  timestamp: Scalars['BigInt'];
};

export type HasPaidAppealFee_Filter = {
  /** Filter for the block changed event. */
  _change_block?: Maybe<BlockChangedFilter>;
  and?: Maybe<Array<Maybe<HasPaidAppealFee_Filter>>>;
  id?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_lt?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
  item?: Maybe<Scalars['String']>;
  item_?: Maybe<Item_Filter>;
  item_contains?: Maybe<Scalars['String']>;
  item_contains_nocase?: Maybe<Scalars['String']>;
  item_ends_with?: Maybe<Scalars['String']>;
  item_ends_with_nocase?: Maybe<Scalars['String']>;
  item_gt?: Maybe<Scalars['String']>;
  item_gte?: Maybe<Scalars['String']>;
  item_in?: Maybe<Array<Scalars['String']>>;
  item_lt?: Maybe<Scalars['String']>;
  item_lte?: Maybe<Scalars['String']>;
  item_not?: Maybe<Scalars['String']>;
  item_not_contains?: Maybe<Scalars['String']>;
  item_not_contains_nocase?: Maybe<Scalars['String']>;
  item_not_ends_with?: Maybe<Scalars['String']>;
  item_not_ends_with_nocase?: Maybe<Scalars['String']>;
  item_not_in?: Maybe<Array<Scalars['String']>>;
  item_not_starts_with?: Maybe<Scalars['String']>;
  item_not_starts_with_nocase?: Maybe<Scalars['String']>;
  item_starts_with?: Maybe<Scalars['String']>;
  item_starts_with_nocase?: Maybe<Scalars['String']>;
  or?: Maybe<Array<Maybe<HasPaidAppealFee_Filter>>>;
  request?: Maybe<Scalars['String']>;
  request_?: Maybe<Request_Filter>;
  request_contains?: Maybe<Scalars['String']>;
  request_contains_nocase?: Maybe<Scalars['String']>;
  request_ends_with?: Maybe<Scalars['String']>;
  request_ends_with_nocase?: Maybe<Scalars['String']>;
  request_gt?: Maybe<Scalars['String']>;
  request_gte?: Maybe<Scalars['String']>;
  request_in?: Maybe<Array<Scalars['String']>>;
  request_lt?: Maybe<Scalars['String']>;
  request_lte?: Maybe<Scalars['String']>;
  request_not?: Maybe<Scalars['String']>;
  request_not_contains?: Maybe<Scalars['String']>;
  request_not_contains_nocase?: Maybe<Scalars['String']>;
  request_not_ends_with?: Maybe<Scalars['String']>;
  request_not_ends_with_nocase?: Maybe<Scalars['String']>;
  request_not_in?: Maybe<Array<Scalars['String']>>;
  request_not_starts_with?: Maybe<Scalars['String']>;
  request_not_starts_with_nocase?: Maybe<Scalars['String']>;
  request_starts_with?: Maybe<Scalars['String']>;
  request_starts_with_nocase?: Maybe<Scalars['String']>;
  round?: Maybe<Scalars['String']>;
  round_?: Maybe<Round_Filter>;
  round_contains?: Maybe<Scalars['String']>;
  round_contains_nocase?: Maybe<Scalars['String']>;
  round_ends_with?: Maybe<Scalars['String']>;
  round_ends_with_nocase?: Maybe<Scalars['String']>;
  round_gt?: Maybe<Scalars['String']>;
  round_gte?: Maybe<Scalars['String']>;
  round_in?: Maybe<Array<Scalars['String']>>;
  round_lt?: Maybe<Scalars['String']>;
  round_lte?: Maybe<Scalars['String']>;
  round_not?: Maybe<Scalars['String']>;
  round_not_contains?: Maybe<Scalars['String']>;
  round_not_contains_nocase?: Maybe<Scalars['String']>;
  round_not_ends_with?: Maybe<Scalars['String']>;
  round_not_ends_with_nocase?: Maybe<Scalars['String']>;
  round_not_in?: Maybe<Array<Scalars['String']>>;
  round_not_starts_with?: Maybe<Scalars['String']>;
  round_not_starts_with_nocase?: Maybe<Scalars['String']>;
  round_starts_with?: Maybe<Scalars['String']>;
  round_starts_with_nocase?: Maybe<Scalars['String']>;
  side?: Maybe<Scalars['BigInt']>;
  side_gt?: Maybe<Scalars['BigInt']>;
  side_gte?: Maybe<Scalars['BigInt']>;
  side_in?: Maybe<Array<Scalars['BigInt']>>;
  side_lt?: Maybe<Scalars['BigInt']>;
  side_lte?: Maybe<Scalars['BigInt']>;
  side_not?: Maybe<Scalars['BigInt']>;
  side_not_in?: Maybe<Array<Scalars['BigInt']>>;
  timestamp?: Maybe<Scalars['BigInt']>;
  timestamp_gt?: Maybe<Scalars['BigInt']>;
  timestamp_gte?: Maybe<Scalars['BigInt']>;
  timestamp_in?: Maybe<Array<Scalars['BigInt']>>;
  timestamp_lt?: Maybe<Scalars['BigInt']>;
  timestamp_lte?: Maybe<Scalars['BigInt']>;
  timestamp_not?: Maybe<Scalars['BigInt']>;
  timestamp_not_in?: Maybe<Array<Scalars['BigInt']>>;
};

export enum HasPaidAppealFee_OrderBy {
  Id = 'id',
  Item = 'item',
  ItemData = 'item__data',
  ItemDisputed = 'item__disputed',
  ItemId = 'item__id',
  ItemItemId = 'item__itemID',
  ItemLatestChallenger = 'item__latestChallenger',
  ItemLatestRequestResolutionTime = 'item__latestRequestResolutionTime',
  ItemLatestRequestSubmissionTime = 'item__latestRequestSubmissionTime',
  ItemLatestRequester = 'item__latestRequester',
  ItemNumberOfRequests = 'item__numberOfRequests',
  ItemRegistryAddress = 'item__registryAddress',
  ItemStatus = 'item__status',
  Request = 'request',
  RequestArbitrator = 'request__arbitrator',
  RequestArbitratorExtraData = 'request__arbitratorExtraData',
  RequestChallenger = 'request__challenger',
  RequestCreationTx = 'request__creationTx',
  RequestDeposit = 'request__deposit',
  RequestDisputeId = 'request__disputeID',
  RequestDisputeOutcome = 'request__disputeOutcome',
  RequestDisputed = 'request__disputed',
  RequestFinalRuling = 'request__finalRuling',
  RequestId = 'request__id',
  RequestNumberOfRounds = 'request__numberOfRounds',
  RequestRegistryAddress = 'request__registryAddress',
  RequestRequestType = 'request__requestType',
  RequestRequester = 'request__requester',
  RequestResolutionTime = 'request__resolutionTime',
  RequestResolutionTx = 'request__resolutionTx',
  RequestResolved = 'request__resolved',
  RequestSubmissionTime = 'request__submissionTime',
  Round = 'round',
  RoundAmountPaidChallenger = 'round__amountPaidChallenger',
  RoundAmountPaidRequester = 'round__amountPaidRequester',
  RoundAppealPeriodEnd = 'round__appealPeriodEnd',
  RoundAppealPeriodStart = 'round__appealPeriodStart',
  RoundAppealed = 'round__appealed',
  RoundAppealedAt = 'round__appealedAt',
  RoundCreationTime = 'round__creationTime',
  RoundFeeRewards = 'round__feeRewards',
  RoundHasPaidChallenger = 'round__hasPaidChallenger',
  RoundHasPaidRequester = 'round__hasPaidRequester',
  RoundId = 'round__id',
  RoundRuling = 'round__ruling',
  RoundRulingTime = 'round__rulingTime',
  RoundTxHashAppealDecision = 'round__txHashAppealDecision',
  RoundTxHashAppealPossible = 'round__txHashAppealPossible',
  Side = 'side',
  Timestamp = 'timestamp'
}

export type Image = {
  __typename?: 'Image';
  LItem: LItem;
  cidMarket: Scalars['String'];
  cidOutcomes: Array<Scalars['String']>;
  id: Scalars['ID'];
  market: Market;
};

export type Image_Filter = {
  LItem?: Maybe<Scalars['String']>;
  LItem_?: Maybe<LItem_Filter>;
  LItem_contains?: Maybe<Scalars['String']>;
  LItem_contains_nocase?: Maybe<Scalars['String']>;
  LItem_ends_with?: Maybe<Scalars['String']>;
  LItem_ends_with_nocase?: Maybe<Scalars['String']>;
  LItem_gt?: Maybe<Scalars['String']>;
  LItem_gte?: Maybe<Scalars['String']>;
  LItem_in?: Maybe<Array<Scalars['String']>>;
  LItem_lt?: Maybe<Scalars['String']>;
  LItem_lte?: Maybe<Scalars['String']>;
  LItem_not?: Maybe<Scalars['String']>;
  LItem_not_contains?: Maybe<Scalars['String']>;
  LItem_not_contains_nocase?: Maybe<Scalars['String']>;
  LItem_not_ends_with?: Maybe<Scalars['String']>;
  LItem_not_ends_with_nocase?: Maybe<Scalars['String']>;
  LItem_not_in?: Maybe<Array<Scalars['String']>>;
  LItem_not_starts_with?: Maybe<Scalars['String']>;
  LItem_not_starts_with_nocase?: Maybe<Scalars['String']>;
  LItem_starts_with?: Maybe<Scalars['String']>;
  LItem_starts_with_nocase?: Maybe<Scalars['String']>;
  /** Filter for the block changed event. */
  _change_block?: Maybe<BlockChangedFilter>;
  and?: Maybe<Array<Maybe<Image_Filter>>>;
  cidMarket?: Maybe<Scalars['String']>;
  cidMarket_contains?: Maybe<Scalars['String']>;
  cidMarket_contains_nocase?: Maybe<Scalars['String']>;
  cidMarket_ends_with?: Maybe<Scalars['String']>;
  cidMarket_ends_with_nocase?: Maybe<Scalars['String']>;
  cidMarket_gt?: Maybe<Scalars['String']>;
  cidMarket_gte?: Maybe<Scalars['String']>;
  cidMarket_in?: Maybe<Array<Scalars['String']>>;
  cidMarket_lt?: Maybe<Scalars['String']>;
  cidMarket_lte?: Maybe<Scalars['String']>;
  cidMarket_not?: Maybe<Scalars['String']>;
  cidMarket_not_contains?: Maybe<Scalars['String']>;
  cidMarket_not_contains_nocase?: Maybe<Scalars['String']>;
  cidMarket_not_ends_with?: Maybe<Scalars['String']>;
  cidMarket_not_ends_with_nocase?: Maybe<Scalars['String']>;
  cidMarket_not_in?: Maybe<Array<Scalars['String']>>;
  cidMarket_not_starts_with?: Maybe<Scalars['String']>;
  cidMarket_not_starts_with_nocase?: Maybe<Scalars['String']>;
  cidMarket_starts_with?: Maybe<Scalars['String']>;
  cidMarket_starts_with_nocase?: Maybe<Scalars['String']>;
  cidOutcomes?: Maybe<Array<Scalars['String']>>;
  cidOutcomes_contains?: Maybe<Array<Scalars['String']>>;
  cidOutcomes_contains_nocase?: Maybe<Array<Scalars['String']>>;
  cidOutcomes_not?: Maybe<Array<Scalars['String']>>;
  cidOutcomes_not_contains?: Maybe<Array<Scalars['String']>>;
  cidOutcomes_not_contains_nocase?: Maybe<Array<Scalars['String']>>;
  id?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_lt?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
  market?: Maybe<Scalars['String']>;
  market_?: Maybe<Market_Filter>;
  market_contains?: Maybe<Scalars['String']>;
  market_contains_nocase?: Maybe<Scalars['String']>;
  market_ends_with?: Maybe<Scalars['String']>;
  market_ends_with_nocase?: Maybe<Scalars['String']>;
  market_gt?: Maybe<Scalars['String']>;
  market_gte?: Maybe<Scalars['String']>;
  market_in?: Maybe<Array<Scalars['String']>>;
  market_lt?: Maybe<Scalars['String']>;
  market_lte?: Maybe<Scalars['String']>;
  market_not?: Maybe<Scalars['String']>;
  market_not_contains?: Maybe<Scalars['String']>;
  market_not_contains_nocase?: Maybe<Scalars['String']>;
  market_not_ends_with?: Maybe<Scalars['String']>;
  market_not_ends_with_nocase?: Maybe<Scalars['String']>;
  market_not_in?: Maybe<Array<Scalars['String']>>;
  market_not_starts_with?: Maybe<Scalars['String']>;
  market_not_starts_with_nocase?: Maybe<Scalars['String']>;
  market_starts_with?: Maybe<Scalars['String']>;
  market_starts_with_nocase?: Maybe<Scalars['String']>;
  or?: Maybe<Array<Maybe<Image_Filter>>>;
};

export enum Image_OrderBy {
  LItem = 'LItem',
  LItemData = 'LItem__data',
  LItemDisputed = 'LItem__disputed',
  LItemId = 'LItem__id',
  LItemItemId = 'LItem__itemID',
  LItemLatestChallenger = 'LItem__latestChallenger',
  LItemLatestRequestResolutionTime = 'LItem__latestRequestResolutionTime',
  LItemLatestRequestSubmissionTime = 'LItem__latestRequestSubmissionTime',
  LItemLatestRequester = 'LItem__latestRequester',
  LItemNumberOfRequests = 'LItem__numberOfRequests',
  LItemRegistryAddress = 'LItem__registryAddress',
  LItemStatus = 'LItem__status',
  CidMarket = 'cidMarket',
  CidOutcomes = 'cidOutcomes',
  Id = 'id',
  Market = 'market',
  MarketBlockNumber = 'market__blockNumber',
  MarketBlockTimestamp = 'market__blockTimestamp',
  MarketConditionId = 'market__conditionId',
  MarketCreator = 'market__creator',
  MarketFactory = 'market__factory',
  MarketFinalizeTs = 'market__finalizeTs',
  MarketHasAnswers = 'market__hasAnswers',
  MarketId = 'market__id',
  MarketIndex = 'market__index',
  MarketLowerBound = 'market__lowerBound',
  MarketMarketName = 'market__marketName',
  MarketOpeningTs = 'market__openingTs',
  MarketOutcomesSupply = 'market__outcomesSupply',
  MarketParentCollectionId = 'market__parentCollectionId',
  MarketParentOutcome = 'market__parentOutcome',
  MarketPayoutReported = 'market__payoutReported',
  MarketQuestionId = 'market__questionId',
  MarketQuestionsInArbitration = 'market__questionsInArbitration',
  MarketTemplateId = 'market__templateId',
  MarketTotalValueLockedUsd = 'market__totalValueLockedUSD',
  MarketTotalValueLockedUsdUntracked = 'market__totalValueLockedUSDUntracked',
  MarketTransactionHash = 'market__transactionHash',
  MarketType = 'market__type',
  MarketUntrackedVolumeUsd = 'market__untrackedVolumeUSD',
  MarketUpperBound = 'market__upperBound',
  MarketVolume = 'market__volume',
  MarketVolumeUsd = 'market__volumeUSD'
}


export type Item = {
  __typename?: 'Item';
  /** The data describing the item. */
  data: Scalars['Bytes'];
  /** Whether the item is currently disputed. */
  disputed: Scalars['Boolean'];
  /** The id of the item in the subgraph entity. Format: <itemID>@<listaddress_lowercase> */
  id: Scalars['ID'];
  /** The ID of the item in the registry. Also the keccak256 hash of the data. */
  itemID: Scalars['Bytes'];
  /** The account that challenged the latest request, if any. */
  latestChallenger: Scalars['Bytes'];
  /** The time the latest request was resolved. */
  latestRequestResolutionTime: Scalars['BigInt'];
  /** Time when the latest request was made. */
  latestRequestSubmissionTime: Scalars['BigInt'];
  /** The account that made the latest request to the item. */
  latestRequester: Scalars['Bytes'];
  /** The total number of requests for this item. */
  numberOfRequests: Scalars['BigInt'];
  /** The registry where this item was submitted. */
  registry: Registry;
  /** The address of the registry this item was submitted. Redundant with registry field to allow use in conditionals. */
  registryAddress: Scalars['Bytes'];
  /** List of status change requests made for the item in the form requests[requestID]. */
  requests: Array<Request>;
  /** The current status of the item. */
  status: Status;
};


export type ItemRequestsArgs = {
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Request_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  skip?: Maybe<Scalars['Int']>;
  where?: Maybe<Request_Filter>;
};

export type ItemProp = {
  __typename?: 'ItemProp';
  description: Scalars['String'];
  id: Scalars['ID'];
  isIdentifier: Scalars['Boolean'];
  item: LItemMetadata;
  label: Scalars['String'];
  type: Scalars['String'];
  value?: Maybe<Scalars['String']>;
};

export type ItemProp_Filter = {
  /** Filter for the block changed event. */
  _change_block?: Maybe<BlockChangedFilter>;
  and?: Maybe<Array<Maybe<ItemProp_Filter>>>;
  description?: Maybe<Scalars['String']>;
  description_contains?: Maybe<Scalars['String']>;
  description_contains_nocase?: Maybe<Scalars['String']>;
  description_ends_with?: Maybe<Scalars['String']>;
  description_ends_with_nocase?: Maybe<Scalars['String']>;
  description_gt?: Maybe<Scalars['String']>;
  description_gte?: Maybe<Scalars['String']>;
  description_in?: Maybe<Array<Scalars['String']>>;
  description_lt?: Maybe<Scalars['String']>;
  description_lte?: Maybe<Scalars['String']>;
  description_not?: Maybe<Scalars['String']>;
  description_not_contains?: Maybe<Scalars['String']>;
  description_not_contains_nocase?: Maybe<Scalars['String']>;
  description_not_ends_with?: Maybe<Scalars['String']>;
  description_not_ends_with_nocase?: Maybe<Scalars['String']>;
  description_not_in?: Maybe<Array<Scalars['String']>>;
  description_not_starts_with?: Maybe<Scalars['String']>;
  description_not_starts_with_nocase?: Maybe<Scalars['String']>;
  description_starts_with?: Maybe<Scalars['String']>;
  description_starts_with_nocase?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_lt?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
  isIdentifier?: Maybe<Scalars['Boolean']>;
  isIdentifier_in?: Maybe<Array<Scalars['Boolean']>>;
  isIdentifier_not?: Maybe<Scalars['Boolean']>;
  isIdentifier_not_in?: Maybe<Array<Scalars['Boolean']>>;
  item?: Maybe<Scalars['String']>;
  item_?: Maybe<LItemMetadata_Filter>;
  item_contains?: Maybe<Scalars['String']>;
  item_contains_nocase?: Maybe<Scalars['String']>;
  item_ends_with?: Maybe<Scalars['String']>;
  item_ends_with_nocase?: Maybe<Scalars['String']>;
  item_gt?: Maybe<Scalars['String']>;
  item_gte?: Maybe<Scalars['String']>;
  item_in?: Maybe<Array<Scalars['String']>>;
  item_lt?: Maybe<Scalars['String']>;
  item_lte?: Maybe<Scalars['String']>;
  item_not?: Maybe<Scalars['String']>;
  item_not_contains?: Maybe<Scalars['String']>;
  item_not_contains_nocase?: Maybe<Scalars['String']>;
  item_not_ends_with?: Maybe<Scalars['String']>;
  item_not_ends_with_nocase?: Maybe<Scalars['String']>;
  item_not_in?: Maybe<Array<Scalars['String']>>;
  item_not_starts_with?: Maybe<Scalars['String']>;
  item_not_starts_with_nocase?: Maybe<Scalars['String']>;
  item_starts_with?: Maybe<Scalars['String']>;
  item_starts_with_nocase?: Maybe<Scalars['String']>;
  label?: Maybe<Scalars['String']>;
  label_contains?: Maybe<Scalars['String']>;
  label_contains_nocase?: Maybe<Scalars['String']>;
  label_ends_with?: Maybe<Scalars['String']>;
  label_ends_with_nocase?: Maybe<Scalars['String']>;
  label_gt?: Maybe<Scalars['String']>;
  label_gte?: Maybe<Scalars['String']>;
  label_in?: Maybe<Array<Scalars['String']>>;
  label_lt?: Maybe<Scalars['String']>;
  label_lte?: Maybe<Scalars['String']>;
  label_not?: Maybe<Scalars['String']>;
  label_not_contains?: Maybe<Scalars['String']>;
  label_not_contains_nocase?: Maybe<Scalars['String']>;
  label_not_ends_with?: Maybe<Scalars['String']>;
  label_not_ends_with_nocase?: Maybe<Scalars['String']>;
  label_not_in?: Maybe<Array<Scalars['String']>>;
  label_not_starts_with?: Maybe<Scalars['String']>;
  label_not_starts_with_nocase?: Maybe<Scalars['String']>;
  label_starts_with?: Maybe<Scalars['String']>;
  label_starts_with_nocase?: Maybe<Scalars['String']>;
  or?: Maybe<Array<Maybe<ItemProp_Filter>>>;
  type?: Maybe<Scalars['String']>;
  type_contains?: Maybe<Scalars['String']>;
  type_contains_nocase?: Maybe<Scalars['String']>;
  type_ends_with?: Maybe<Scalars['String']>;
  type_ends_with_nocase?: Maybe<Scalars['String']>;
  type_gt?: Maybe<Scalars['String']>;
  type_gte?: Maybe<Scalars['String']>;
  type_in?: Maybe<Array<Scalars['String']>>;
  type_lt?: Maybe<Scalars['String']>;
  type_lte?: Maybe<Scalars['String']>;
  type_not?: Maybe<Scalars['String']>;
  type_not_contains?: Maybe<Scalars['String']>;
  type_not_contains_nocase?: Maybe<Scalars['String']>;
  type_not_ends_with?: Maybe<Scalars['String']>;
  type_not_ends_with_nocase?: Maybe<Scalars['String']>;
  type_not_in?: Maybe<Array<Scalars['String']>>;
  type_not_starts_with?: Maybe<Scalars['String']>;
  type_not_starts_with_nocase?: Maybe<Scalars['String']>;
  type_starts_with?: Maybe<Scalars['String']>;
  type_starts_with_nocase?: Maybe<Scalars['String']>;
  value?: Maybe<Scalars['String']>;
  value_contains?: Maybe<Scalars['String']>;
  value_contains_nocase?: Maybe<Scalars['String']>;
  value_ends_with?: Maybe<Scalars['String']>;
  value_ends_with_nocase?: Maybe<Scalars['String']>;
  value_gt?: Maybe<Scalars['String']>;
  value_gte?: Maybe<Scalars['String']>;
  value_in?: Maybe<Array<Scalars['String']>>;
  value_lt?: Maybe<Scalars['String']>;
  value_lte?: Maybe<Scalars['String']>;
  value_not?: Maybe<Scalars['String']>;
  value_not_contains?: Maybe<Scalars['String']>;
  value_not_contains_nocase?: Maybe<Scalars['String']>;
  value_not_ends_with?: Maybe<Scalars['String']>;
  value_not_ends_with_nocase?: Maybe<Scalars['String']>;
  value_not_in?: Maybe<Array<Scalars['String']>>;
  value_not_starts_with?: Maybe<Scalars['String']>;
  value_not_starts_with_nocase?: Maybe<Scalars['String']>;
  value_starts_with?: Maybe<Scalars['String']>;
  value_starts_with_nocase?: Maybe<Scalars['String']>;
};

export enum ItemProp_OrderBy {
  Description = 'description',
  Id = 'id',
  IsIdentifier = 'isIdentifier',
  Item = 'item',
  ItemId = 'item__id',
  ItemKey0 = 'item__key0',
  ItemKey1 = 'item__key1',
  ItemKey2 = 'item__key2',
  ItemKey3 = 'item__key3',
  ItemKey4 = 'item__key4',
  ItemKeywords = 'item__keywords',
  Label = 'label',
  Type = 'type',
  Value = 'value'
}

export type Item_Filter = {
  /** Filter for the block changed event. */
  _change_block?: Maybe<BlockChangedFilter>;
  and?: Maybe<Array<Maybe<Item_Filter>>>;
  data?: Maybe<Scalars['Bytes']>;
  data_contains?: Maybe<Scalars['Bytes']>;
  data_gt?: Maybe<Scalars['Bytes']>;
  data_gte?: Maybe<Scalars['Bytes']>;
  data_in?: Maybe<Array<Scalars['Bytes']>>;
  data_lt?: Maybe<Scalars['Bytes']>;
  data_lte?: Maybe<Scalars['Bytes']>;
  data_not?: Maybe<Scalars['Bytes']>;
  data_not_contains?: Maybe<Scalars['Bytes']>;
  data_not_in?: Maybe<Array<Scalars['Bytes']>>;
  disputed?: Maybe<Scalars['Boolean']>;
  disputed_in?: Maybe<Array<Scalars['Boolean']>>;
  disputed_not?: Maybe<Scalars['Boolean']>;
  disputed_not_in?: Maybe<Array<Scalars['Boolean']>>;
  id?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_lt?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
  itemID?: Maybe<Scalars['Bytes']>;
  itemID_contains?: Maybe<Scalars['Bytes']>;
  itemID_gt?: Maybe<Scalars['Bytes']>;
  itemID_gte?: Maybe<Scalars['Bytes']>;
  itemID_in?: Maybe<Array<Scalars['Bytes']>>;
  itemID_lt?: Maybe<Scalars['Bytes']>;
  itemID_lte?: Maybe<Scalars['Bytes']>;
  itemID_not?: Maybe<Scalars['Bytes']>;
  itemID_not_contains?: Maybe<Scalars['Bytes']>;
  itemID_not_in?: Maybe<Array<Scalars['Bytes']>>;
  latestChallenger?: Maybe<Scalars['Bytes']>;
  latestChallenger_contains?: Maybe<Scalars['Bytes']>;
  latestChallenger_gt?: Maybe<Scalars['Bytes']>;
  latestChallenger_gte?: Maybe<Scalars['Bytes']>;
  latestChallenger_in?: Maybe<Array<Scalars['Bytes']>>;
  latestChallenger_lt?: Maybe<Scalars['Bytes']>;
  latestChallenger_lte?: Maybe<Scalars['Bytes']>;
  latestChallenger_not?: Maybe<Scalars['Bytes']>;
  latestChallenger_not_contains?: Maybe<Scalars['Bytes']>;
  latestChallenger_not_in?: Maybe<Array<Scalars['Bytes']>>;
  latestRequestResolutionTime?: Maybe<Scalars['BigInt']>;
  latestRequestResolutionTime_gt?: Maybe<Scalars['BigInt']>;
  latestRequestResolutionTime_gte?: Maybe<Scalars['BigInt']>;
  latestRequestResolutionTime_in?: Maybe<Array<Scalars['BigInt']>>;
  latestRequestResolutionTime_lt?: Maybe<Scalars['BigInt']>;
  latestRequestResolutionTime_lte?: Maybe<Scalars['BigInt']>;
  latestRequestResolutionTime_not?: Maybe<Scalars['BigInt']>;
  latestRequestResolutionTime_not_in?: Maybe<Array<Scalars['BigInt']>>;
  latestRequestSubmissionTime?: Maybe<Scalars['BigInt']>;
  latestRequestSubmissionTime_gt?: Maybe<Scalars['BigInt']>;
  latestRequestSubmissionTime_gte?: Maybe<Scalars['BigInt']>;
  latestRequestSubmissionTime_in?: Maybe<Array<Scalars['BigInt']>>;
  latestRequestSubmissionTime_lt?: Maybe<Scalars['BigInt']>;
  latestRequestSubmissionTime_lte?: Maybe<Scalars['BigInt']>;
  latestRequestSubmissionTime_not?: Maybe<Scalars['BigInt']>;
  latestRequestSubmissionTime_not_in?: Maybe<Array<Scalars['BigInt']>>;
  latestRequester?: Maybe<Scalars['Bytes']>;
  latestRequester_contains?: Maybe<Scalars['Bytes']>;
  latestRequester_gt?: Maybe<Scalars['Bytes']>;
  latestRequester_gte?: Maybe<Scalars['Bytes']>;
  latestRequester_in?: Maybe<Array<Scalars['Bytes']>>;
  latestRequester_lt?: Maybe<Scalars['Bytes']>;
  latestRequester_lte?: Maybe<Scalars['Bytes']>;
  latestRequester_not?: Maybe<Scalars['Bytes']>;
  latestRequester_not_contains?: Maybe<Scalars['Bytes']>;
  latestRequester_not_in?: Maybe<Array<Scalars['Bytes']>>;
  numberOfRequests?: Maybe<Scalars['BigInt']>;
  numberOfRequests_gt?: Maybe<Scalars['BigInt']>;
  numberOfRequests_gte?: Maybe<Scalars['BigInt']>;
  numberOfRequests_in?: Maybe<Array<Scalars['BigInt']>>;
  numberOfRequests_lt?: Maybe<Scalars['BigInt']>;
  numberOfRequests_lte?: Maybe<Scalars['BigInt']>;
  numberOfRequests_not?: Maybe<Scalars['BigInt']>;
  numberOfRequests_not_in?: Maybe<Array<Scalars['BigInt']>>;
  or?: Maybe<Array<Maybe<Item_Filter>>>;
  registry?: Maybe<Scalars['String']>;
  registryAddress?: Maybe<Scalars['Bytes']>;
  registryAddress_contains?: Maybe<Scalars['Bytes']>;
  registryAddress_gt?: Maybe<Scalars['Bytes']>;
  registryAddress_gte?: Maybe<Scalars['Bytes']>;
  registryAddress_in?: Maybe<Array<Scalars['Bytes']>>;
  registryAddress_lt?: Maybe<Scalars['Bytes']>;
  registryAddress_lte?: Maybe<Scalars['Bytes']>;
  registryAddress_not?: Maybe<Scalars['Bytes']>;
  registryAddress_not_contains?: Maybe<Scalars['Bytes']>;
  registryAddress_not_in?: Maybe<Array<Scalars['Bytes']>>;
  registry_?: Maybe<Registry_Filter>;
  registry_contains?: Maybe<Scalars['String']>;
  registry_contains_nocase?: Maybe<Scalars['String']>;
  registry_ends_with?: Maybe<Scalars['String']>;
  registry_ends_with_nocase?: Maybe<Scalars['String']>;
  registry_gt?: Maybe<Scalars['String']>;
  registry_gte?: Maybe<Scalars['String']>;
  registry_in?: Maybe<Array<Scalars['String']>>;
  registry_lt?: Maybe<Scalars['String']>;
  registry_lte?: Maybe<Scalars['String']>;
  registry_not?: Maybe<Scalars['String']>;
  registry_not_contains?: Maybe<Scalars['String']>;
  registry_not_contains_nocase?: Maybe<Scalars['String']>;
  registry_not_ends_with?: Maybe<Scalars['String']>;
  registry_not_ends_with_nocase?: Maybe<Scalars['String']>;
  registry_not_in?: Maybe<Array<Scalars['String']>>;
  registry_not_starts_with?: Maybe<Scalars['String']>;
  registry_not_starts_with_nocase?: Maybe<Scalars['String']>;
  registry_starts_with?: Maybe<Scalars['String']>;
  registry_starts_with_nocase?: Maybe<Scalars['String']>;
  requests_?: Maybe<Request_Filter>;
  status?: Maybe<Status>;
  status_in?: Maybe<Array<Status>>;
  status_not?: Maybe<Status>;
  status_not_in?: Maybe<Array<Status>>;
};

export enum Item_OrderBy {
  Data = 'data',
  Disputed = 'disputed',
  Id = 'id',
  ItemId = 'itemID',
  LatestChallenger = 'latestChallenger',
  LatestRequestResolutionTime = 'latestRequestResolutionTime',
  LatestRequestSubmissionTime = 'latestRequestSubmissionTime',
  LatestRequester = 'latestRequester',
  NumberOfRequests = 'numberOfRequests',
  Registry = 'registry',
  RegistryAddress = 'registryAddress',
  RegistryConnectedTcr = 'registry__connectedTCR',
  RegistryId = 'registry__id',
  RegistryMetaEvidenceCount = 'registry__metaEvidenceCount',
  RegistryNumberOfItems = 'registry__numberOfItems',
  Requests = 'requests',
  Status = 'status'
}

export type LArbitrator = {
  __typename?: 'LArbitrator';
  /** The address of the arbitrator */
  id: Scalars['ID'];
};

export type LArbitrator_Filter = {
  /** Filter for the block changed event. */
  _change_block?: Maybe<BlockChangedFilter>;
  and?: Maybe<Array<Maybe<LArbitrator_Filter>>>;
  id?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_lt?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
  or?: Maybe<Array<Maybe<LArbitrator_Filter>>>;
};

export enum LArbitrator_OrderBy {
  Id = 'id'
}

export type LContribution = {
  __typename?: 'LContribution';
  /** The address that made the contribution. */
  contributor: Scalars['Bytes'];
  /** The contribution ID. */
  id: Scalars['ID'];
  /** The round the contribution was made to. */
  round: LRound;
  /** To which side the contribution was made. */
  side: Scalars['BigInt'];
  /** Whether there are any withdrawable contributions. */
  withdrawable: Scalars['Boolean'];
};

export type LContribution_Filter = {
  /** Filter for the block changed event. */
  _change_block?: Maybe<BlockChangedFilter>;
  and?: Maybe<Array<Maybe<LContribution_Filter>>>;
  contributor?: Maybe<Scalars['Bytes']>;
  contributor_contains?: Maybe<Scalars['Bytes']>;
  contributor_gt?: Maybe<Scalars['Bytes']>;
  contributor_gte?: Maybe<Scalars['Bytes']>;
  contributor_in?: Maybe<Array<Scalars['Bytes']>>;
  contributor_lt?: Maybe<Scalars['Bytes']>;
  contributor_lte?: Maybe<Scalars['Bytes']>;
  contributor_not?: Maybe<Scalars['Bytes']>;
  contributor_not_contains?: Maybe<Scalars['Bytes']>;
  contributor_not_in?: Maybe<Array<Scalars['Bytes']>>;
  id?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_lt?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
  or?: Maybe<Array<Maybe<LContribution_Filter>>>;
  round?: Maybe<Scalars['String']>;
  round_?: Maybe<LRound_Filter>;
  round_contains?: Maybe<Scalars['String']>;
  round_contains_nocase?: Maybe<Scalars['String']>;
  round_ends_with?: Maybe<Scalars['String']>;
  round_ends_with_nocase?: Maybe<Scalars['String']>;
  round_gt?: Maybe<Scalars['String']>;
  round_gte?: Maybe<Scalars['String']>;
  round_in?: Maybe<Array<Scalars['String']>>;
  round_lt?: Maybe<Scalars['String']>;
  round_lte?: Maybe<Scalars['String']>;
  round_not?: Maybe<Scalars['String']>;
  round_not_contains?: Maybe<Scalars['String']>;
  round_not_contains_nocase?: Maybe<Scalars['String']>;
  round_not_ends_with?: Maybe<Scalars['String']>;
  round_not_ends_with_nocase?: Maybe<Scalars['String']>;
  round_not_in?: Maybe<Array<Scalars['String']>>;
  round_not_starts_with?: Maybe<Scalars['String']>;
  round_not_starts_with_nocase?: Maybe<Scalars['String']>;
  round_starts_with?: Maybe<Scalars['String']>;
  round_starts_with_nocase?: Maybe<Scalars['String']>;
  side?: Maybe<Scalars['BigInt']>;
  side_gt?: Maybe<Scalars['BigInt']>;
  side_gte?: Maybe<Scalars['BigInt']>;
  side_in?: Maybe<Array<Scalars['BigInt']>>;
  side_lt?: Maybe<Scalars['BigInt']>;
  side_lte?: Maybe<Scalars['BigInt']>;
  side_not?: Maybe<Scalars['BigInt']>;
  side_not_in?: Maybe<Array<Scalars['BigInt']>>;
  withdrawable?: Maybe<Scalars['Boolean']>;
  withdrawable_in?: Maybe<Array<Scalars['Boolean']>>;
  withdrawable_not?: Maybe<Scalars['Boolean']>;
  withdrawable_not_in?: Maybe<Array<Scalars['Boolean']>>;
};

export enum LContribution_OrderBy {
  Contributor = 'contributor',
  Id = 'id',
  Round = 'round',
  RoundAmountPaidChallenger = 'round__amountPaidChallenger',
  RoundAmountPaidRequester = 'round__amountPaidRequester',
  RoundAppealPeriodEnd = 'round__appealPeriodEnd',
  RoundAppealPeriodStart = 'round__appealPeriodStart',
  RoundAppealed = 'round__appealed',
  RoundAppealedAt = 'round__appealedAt',
  RoundCreationTime = 'round__creationTime',
  RoundFeeRewards = 'round__feeRewards',
  RoundHasPaidChallenger = 'round__hasPaidChallenger',
  RoundHasPaidRequester = 'round__hasPaidRequester',
  RoundId = 'round__id',
  RoundLastFundedChallenger = 'round__lastFundedChallenger',
  RoundLastFundedRequester = 'round__lastFundedRequester',
  RoundNumberOfContributions = 'round__numberOfContributions',
  RoundRuling = 'round__ruling',
  RoundRulingTime = 'round__rulingTime',
  RoundTxHashAppealDecision = 'round__txHashAppealDecision',
  RoundTxHashAppealPossible = 'round__txHashAppealPossible',
  Side = 'side',
  Withdrawable = 'withdrawable'
}

export type LItem = {
  __typename?: 'LItem';
  /** The data describing the item. */
  data: Scalars['String'];
  /** Whether the item is currently disputed. */
  disputed: Scalars['Boolean'];
  /** The id of the item in the subgraph entity. Format: <itemID>@<listaddress_lowercase> */
  id: Scalars['ID'];
  /** The ID of the item in the registry. Also the keccak256 hash of the data. */
  itemID: Scalars['Bytes'];
  /** The account that challenged the latest request, if any. */
  latestChallenger: Scalars['Bytes'];
  /** The time the latest request was resolved. */
  latestRequestResolutionTime: Scalars['BigInt'];
  /** Time when the latest request was made. */
  latestRequestSubmissionTime: Scalars['BigInt'];
  /** The account that made the latest request to the item. */
  latestRequester: Scalars['Bytes'];
  metadata?: Maybe<LItemMetadata>;
  /** The total number of requests for this item. */
  numberOfRequests: Scalars['BigInt'];
  /** The registry where this item was submitted. */
  registry: LRegistry;
  /** The address of the registry this item was submitted. Redundant with registry field to allow use in conditionals. */
  registryAddress: Scalars['Bytes'];
  /** List of status change requests made for the item in the form requests[requestID]. */
  requests: Array<LRequest>;
  /** The current status of the item. */
  status: Status;
};


export type LItemRequestsArgs = {
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<LRequest_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  skip?: Maybe<Scalars['Int']>;
  where?: Maybe<LRequest_Filter>;
};

export type LItemMetadata = {
  __typename?: 'LItemMetadata';
  /** ipfs cid - Litem ID */
  id: Scalars['ID'];
  /** The item this metadata belongs to */
  item: LItem;
  /** First indexable value of the json file. */
  key0?: Maybe<Scalars['String']>;
  /** Second indexable value of the json file. */
  key1?: Maybe<Scalars['String']>;
  /** Third indexable value of the json file. */
  key2?: Maybe<Scalars['String']>;
  /** Fourth indexable value of the json file. */
  key3?: Maybe<Scalars['String']>;
  /** Fifth indexable value of the json file. */
  key4?: Maybe<Scalars['String']>;
  /** The item identifiers combined as a single string. */
  keywords?: Maybe<Scalars['String']>;
  metametadata?: Maybe<LItemMetametadata>;
  /** The parsed data describing the item. */
  props: Array<ItemProp>;
};


export type LItemMetadataPropsArgs = {
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<ItemProp_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  skip?: Maybe<Scalars['Int']>;
  where?: Maybe<ItemProp_Filter>;
};

export type LItemMetadata_Filter = {
  /** Filter for the block changed event. */
  _change_block?: Maybe<BlockChangedFilter>;
  and?: Maybe<Array<Maybe<LItemMetadata_Filter>>>;
  id?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_lt?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
  item_?: Maybe<LItem_Filter>;
  key0?: Maybe<Scalars['String']>;
  key0_contains?: Maybe<Scalars['String']>;
  key0_contains_nocase?: Maybe<Scalars['String']>;
  key0_ends_with?: Maybe<Scalars['String']>;
  key0_ends_with_nocase?: Maybe<Scalars['String']>;
  key0_gt?: Maybe<Scalars['String']>;
  key0_gte?: Maybe<Scalars['String']>;
  key0_in?: Maybe<Array<Scalars['String']>>;
  key0_lt?: Maybe<Scalars['String']>;
  key0_lte?: Maybe<Scalars['String']>;
  key0_not?: Maybe<Scalars['String']>;
  key0_not_contains?: Maybe<Scalars['String']>;
  key0_not_contains_nocase?: Maybe<Scalars['String']>;
  key0_not_ends_with?: Maybe<Scalars['String']>;
  key0_not_ends_with_nocase?: Maybe<Scalars['String']>;
  key0_not_in?: Maybe<Array<Scalars['String']>>;
  key0_not_starts_with?: Maybe<Scalars['String']>;
  key0_not_starts_with_nocase?: Maybe<Scalars['String']>;
  key0_starts_with?: Maybe<Scalars['String']>;
  key0_starts_with_nocase?: Maybe<Scalars['String']>;
  key1?: Maybe<Scalars['String']>;
  key1_contains?: Maybe<Scalars['String']>;
  key1_contains_nocase?: Maybe<Scalars['String']>;
  key1_ends_with?: Maybe<Scalars['String']>;
  key1_ends_with_nocase?: Maybe<Scalars['String']>;
  key1_gt?: Maybe<Scalars['String']>;
  key1_gte?: Maybe<Scalars['String']>;
  key1_in?: Maybe<Array<Scalars['String']>>;
  key1_lt?: Maybe<Scalars['String']>;
  key1_lte?: Maybe<Scalars['String']>;
  key1_not?: Maybe<Scalars['String']>;
  key1_not_contains?: Maybe<Scalars['String']>;
  key1_not_contains_nocase?: Maybe<Scalars['String']>;
  key1_not_ends_with?: Maybe<Scalars['String']>;
  key1_not_ends_with_nocase?: Maybe<Scalars['String']>;
  key1_not_in?: Maybe<Array<Scalars['String']>>;
  key1_not_starts_with?: Maybe<Scalars['String']>;
  key1_not_starts_with_nocase?: Maybe<Scalars['String']>;
  key1_starts_with?: Maybe<Scalars['String']>;
  key1_starts_with_nocase?: Maybe<Scalars['String']>;
  key2?: Maybe<Scalars['String']>;
  key2_contains?: Maybe<Scalars['String']>;
  key2_contains_nocase?: Maybe<Scalars['String']>;
  key2_ends_with?: Maybe<Scalars['String']>;
  key2_ends_with_nocase?: Maybe<Scalars['String']>;
  key2_gt?: Maybe<Scalars['String']>;
  key2_gte?: Maybe<Scalars['String']>;
  key2_in?: Maybe<Array<Scalars['String']>>;
  key2_lt?: Maybe<Scalars['String']>;
  key2_lte?: Maybe<Scalars['String']>;
  key2_not?: Maybe<Scalars['String']>;
  key2_not_contains?: Maybe<Scalars['String']>;
  key2_not_contains_nocase?: Maybe<Scalars['String']>;
  key2_not_ends_with?: Maybe<Scalars['String']>;
  key2_not_ends_with_nocase?: Maybe<Scalars['String']>;
  key2_not_in?: Maybe<Array<Scalars['String']>>;
  key2_not_starts_with?: Maybe<Scalars['String']>;
  key2_not_starts_with_nocase?: Maybe<Scalars['String']>;
  key2_starts_with?: Maybe<Scalars['String']>;
  key2_starts_with_nocase?: Maybe<Scalars['String']>;
  key3?: Maybe<Scalars['String']>;
  key3_contains?: Maybe<Scalars['String']>;
  key3_contains_nocase?: Maybe<Scalars['String']>;
  key3_ends_with?: Maybe<Scalars['String']>;
  key3_ends_with_nocase?: Maybe<Scalars['String']>;
  key3_gt?: Maybe<Scalars['String']>;
  key3_gte?: Maybe<Scalars['String']>;
  key3_in?: Maybe<Array<Scalars['String']>>;
  key3_lt?: Maybe<Scalars['String']>;
  key3_lte?: Maybe<Scalars['String']>;
  key3_not?: Maybe<Scalars['String']>;
  key3_not_contains?: Maybe<Scalars['String']>;
  key3_not_contains_nocase?: Maybe<Scalars['String']>;
  key3_not_ends_with?: Maybe<Scalars['String']>;
  key3_not_ends_with_nocase?: Maybe<Scalars['String']>;
  key3_not_in?: Maybe<Array<Scalars['String']>>;
  key3_not_starts_with?: Maybe<Scalars['String']>;
  key3_not_starts_with_nocase?: Maybe<Scalars['String']>;
  key3_starts_with?: Maybe<Scalars['String']>;
  key3_starts_with_nocase?: Maybe<Scalars['String']>;
  key4?: Maybe<Scalars['String']>;
  key4_contains?: Maybe<Scalars['String']>;
  key4_contains_nocase?: Maybe<Scalars['String']>;
  key4_ends_with?: Maybe<Scalars['String']>;
  key4_ends_with_nocase?: Maybe<Scalars['String']>;
  key4_gt?: Maybe<Scalars['String']>;
  key4_gte?: Maybe<Scalars['String']>;
  key4_in?: Maybe<Array<Scalars['String']>>;
  key4_lt?: Maybe<Scalars['String']>;
  key4_lte?: Maybe<Scalars['String']>;
  key4_not?: Maybe<Scalars['String']>;
  key4_not_contains?: Maybe<Scalars['String']>;
  key4_not_contains_nocase?: Maybe<Scalars['String']>;
  key4_not_ends_with?: Maybe<Scalars['String']>;
  key4_not_ends_with_nocase?: Maybe<Scalars['String']>;
  key4_not_in?: Maybe<Array<Scalars['String']>>;
  key4_not_starts_with?: Maybe<Scalars['String']>;
  key4_not_starts_with_nocase?: Maybe<Scalars['String']>;
  key4_starts_with?: Maybe<Scalars['String']>;
  key4_starts_with_nocase?: Maybe<Scalars['String']>;
  keywords?: Maybe<Scalars['String']>;
  keywords_contains?: Maybe<Scalars['String']>;
  keywords_contains_nocase?: Maybe<Scalars['String']>;
  keywords_ends_with?: Maybe<Scalars['String']>;
  keywords_ends_with_nocase?: Maybe<Scalars['String']>;
  keywords_gt?: Maybe<Scalars['String']>;
  keywords_gte?: Maybe<Scalars['String']>;
  keywords_in?: Maybe<Array<Scalars['String']>>;
  keywords_lt?: Maybe<Scalars['String']>;
  keywords_lte?: Maybe<Scalars['String']>;
  keywords_not?: Maybe<Scalars['String']>;
  keywords_not_contains?: Maybe<Scalars['String']>;
  keywords_not_contains_nocase?: Maybe<Scalars['String']>;
  keywords_not_ends_with?: Maybe<Scalars['String']>;
  keywords_not_ends_with_nocase?: Maybe<Scalars['String']>;
  keywords_not_in?: Maybe<Array<Scalars['String']>>;
  keywords_not_starts_with?: Maybe<Scalars['String']>;
  keywords_not_starts_with_nocase?: Maybe<Scalars['String']>;
  keywords_starts_with?: Maybe<Scalars['String']>;
  keywords_starts_with_nocase?: Maybe<Scalars['String']>;
  metametadata?: Maybe<Scalars['String']>;
  metametadata_?: Maybe<LItemMetametadata_Filter>;
  metametadata_contains?: Maybe<Scalars['String']>;
  metametadata_contains_nocase?: Maybe<Scalars['String']>;
  metametadata_ends_with?: Maybe<Scalars['String']>;
  metametadata_ends_with_nocase?: Maybe<Scalars['String']>;
  metametadata_gt?: Maybe<Scalars['String']>;
  metametadata_gte?: Maybe<Scalars['String']>;
  metametadata_in?: Maybe<Array<Scalars['String']>>;
  metametadata_lt?: Maybe<Scalars['String']>;
  metametadata_lte?: Maybe<Scalars['String']>;
  metametadata_not?: Maybe<Scalars['String']>;
  metametadata_not_contains?: Maybe<Scalars['String']>;
  metametadata_not_contains_nocase?: Maybe<Scalars['String']>;
  metametadata_not_ends_with?: Maybe<Scalars['String']>;
  metametadata_not_ends_with_nocase?: Maybe<Scalars['String']>;
  metametadata_not_in?: Maybe<Array<Scalars['String']>>;
  metametadata_not_starts_with?: Maybe<Scalars['String']>;
  metametadata_not_starts_with_nocase?: Maybe<Scalars['String']>;
  metametadata_starts_with?: Maybe<Scalars['String']>;
  metametadata_starts_with_nocase?: Maybe<Scalars['String']>;
  or?: Maybe<Array<Maybe<LItemMetadata_Filter>>>;
  props_?: Maybe<ItemProp_Filter>;
};

export enum LItemMetadata_OrderBy {
  Id = 'id',
  Item = 'item',
  ItemData = 'item__data',
  ItemDisputed = 'item__disputed',
  ItemId = 'item__id',
  ItemItemId = 'item__itemID',
  ItemLatestChallenger = 'item__latestChallenger',
  ItemLatestRequestResolutionTime = 'item__latestRequestResolutionTime',
  ItemLatestRequestSubmissionTime = 'item__latestRequestSubmissionTime',
  ItemLatestRequester = 'item__latestRequester',
  ItemNumberOfRequests = 'item__numberOfRequests',
  ItemRegistryAddress = 'item__registryAddress',
  ItemStatus = 'item__status',
  Key0 = 'key0',
  Key1 = 'key1',
  Key2 = 'key2',
  Key3 = 'key3',
  Key4 = 'key4',
  Keywords = 'keywords',
  Metametadata = 'metametadata',
  MetametadataId = 'metametadata__id',
  MetametadataKey0 = 'metametadata__key0',
  MetametadataKey1 = 'metametadata__key1',
  MetametadataKey2 = 'metametadata__key2',
  MetametadataKey3 = 'metametadata__key3',
  MetametadataKey4 = 'metametadata__key4',
  MetametadataKeywords = 'metametadata__keywords',
  Props = 'props'
}

export type LItemMetametadata = {
  __typename?: 'LItemMetametadata';
  /** ipfs cid - Metadata ID */
  id: Scalars['ID'];
  /** First indexable value of the json file. */
  key0?: Maybe<Scalars['String']>;
  /** Second indexable value of the json file. */
  key1?: Maybe<Scalars['String']>;
  /** Third indexable value of the json file. */
  key2?: Maybe<Scalars['String']>;
  /** Fourth indexable value of the json file. */
  key3?: Maybe<Scalars['String']>;
  /** Fifth indexable value of the json file. */
  key4?: Maybe<Scalars['String']>;
  /** The item identifiers combined as a single string. */
  keywords?: Maybe<Scalars['String']>;
  /** The item metadata this metametadata belongs to */
  metadata: LItemMetadata;
  /** The parsed data describing the item. */
  props: Array<MetaItemProp>;
};


export type LItemMetametadataPropsArgs = {
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<MetaItemProp_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  skip?: Maybe<Scalars['Int']>;
  where?: Maybe<MetaItemProp_Filter>;
};

export type LItemMetametadata_Filter = {
  /** Filter for the block changed event. */
  _change_block?: Maybe<BlockChangedFilter>;
  and?: Maybe<Array<Maybe<LItemMetametadata_Filter>>>;
  id?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_lt?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
  key0?: Maybe<Scalars['String']>;
  key0_contains?: Maybe<Scalars['String']>;
  key0_contains_nocase?: Maybe<Scalars['String']>;
  key0_ends_with?: Maybe<Scalars['String']>;
  key0_ends_with_nocase?: Maybe<Scalars['String']>;
  key0_gt?: Maybe<Scalars['String']>;
  key0_gte?: Maybe<Scalars['String']>;
  key0_in?: Maybe<Array<Scalars['String']>>;
  key0_lt?: Maybe<Scalars['String']>;
  key0_lte?: Maybe<Scalars['String']>;
  key0_not?: Maybe<Scalars['String']>;
  key0_not_contains?: Maybe<Scalars['String']>;
  key0_not_contains_nocase?: Maybe<Scalars['String']>;
  key0_not_ends_with?: Maybe<Scalars['String']>;
  key0_not_ends_with_nocase?: Maybe<Scalars['String']>;
  key0_not_in?: Maybe<Array<Scalars['String']>>;
  key0_not_starts_with?: Maybe<Scalars['String']>;
  key0_not_starts_with_nocase?: Maybe<Scalars['String']>;
  key0_starts_with?: Maybe<Scalars['String']>;
  key0_starts_with_nocase?: Maybe<Scalars['String']>;
  key1?: Maybe<Scalars['String']>;
  key1_contains?: Maybe<Scalars['String']>;
  key1_contains_nocase?: Maybe<Scalars['String']>;
  key1_ends_with?: Maybe<Scalars['String']>;
  key1_ends_with_nocase?: Maybe<Scalars['String']>;
  key1_gt?: Maybe<Scalars['String']>;
  key1_gte?: Maybe<Scalars['String']>;
  key1_in?: Maybe<Array<Scalars['String']>>;
  key1_lt?: Maybe<Scalars['String']>;
  key1_lte?: Maybe<Scalars['String']>;
  key1_not?: Maybe<Scalars['String']>;
  key1_not_contains?: Maybe<Scalars['String']>;
  key1_not_contains_nocase?: Maybe<Scalars['String']>;
  key1_not_ends_with?: Maybe<Scalars['String']>;
  key1_not_ends_with_nocase?: Maybe<Scalars['String']>;
  key1_not_in?: Maybe<Array<Scalars['String']>>;
  key1_not_starts_with?: Maybe<Scalars['String']>;
  key1_not_starts_with_nocase?: Maybe<Scalars['String']>;
  key1_starts_with?: Maybe<Scalars['String']>;
  key1_starts_with_nocase?: Maybe<Scalars['String']>;
  key2?: Maybe<Scalars['String']>;
  key2_contains?: Maybe<Scalars['String']>;
  key2_contains_nocase?: Maybe<Scalars['String']>;
  key2_ends_with?: Maybe<Scalars['String']>;
  key2_ends_with_nocase?: Maybe<Scalars['String']>;
  key2_gt?: Maybe<Scalars['String']>;
  key2_gte?: Maybe<Scalars['String']>;
  key2_in?: Maybe<Array<Scalars['String']>>;
  key2_lt?: Maybe<Scalars['String']>;
  key2_lte?: Maybe<Scalars['String']>;
  key2_not?: Maybe<Scalars['String']>;
  key2_not_contains?: Maybe<Scalars['String']>;
  key2_not_contains_nocase?: Maybe<Scalars['String']>;
  key2_not_ends_with?: Maybe<Scalars['String']>;
  key2_not_ends_with_nocase?: Maybe<Scalars['String']>;
  key2_not_in?: Maybe<Array<Scalars['String']>>;
  key2_not_starts_with?: Maybe<Scalars['String']>;
  key2_not_starts_with_nocase?: Maybe<Scalars['String']>;
  key2_starts_with?: Maybe<Scalars['String']>;
  key2_starts_with_nocase?: Maybe<Scalars['String']>;
  key3?: Maybe<Scalars['String']>;
  key3_contains?: Maybe<Scalars['String']>;
  key3_contains_nocase?: Maybe<Scalars['String']>;
  key3_ends_with?: Maybe<Scalars['String']>;
  key3_ends_with_nocase?: Maybe<Scalars['String']>;
  key3_gt?: Maybe<Scalars['String']>;
  key3_gte?: Maybe<Scalars['String']>;
  key3_in?: Maybe<Array<Scalars['String']>>;
  key3_lt?: Maybe<Scalars['String']>;
  key3_lte?: Maybe<Scalars['String']>;
  key3_not?: Maybe<Scalars['String']>;
  key3_not_contains?: Maybe<Scalars['String']>;
  key3_not_contains_nocase?: Maybe<Scalars['String']>;
  key3_not_ends_with?: Maybe<Scalars['String']>;
  key3_not_ends_with_nocase?: Maybe<Scalars['String']>;
  key3_not_in?: Maybe<Array<Scalars['String']>>;
  key3_not_starts_with?: Maybe<Scalars['String']>;
  key3_not_starts_with_nocase?: Maybe<Scalars['String']>;
  key3_starts_with?: Maybe<Scalars['String']>;
  key3_starts_with_nocase?: Maybe<Scalars['String']>;
  key4?: Maybe<Scalars['String']>;
  key4_contains?: Maybe<Scalars['String']>;
  key4_contains_nocase?: Maybe<Scalars['String']>;
  key4_ends_with?: Maybe<Scalars['String']>;
  key4_ends_with_nocase?: Maybe<Scalars['String']>;
  key4_gt?: Maybe<Scalars['String']>;
  key4_gte?: Maybe<Scalars['String']>;
  key4_in?: Maybe<Array<Scalars['String']>>;
  key4_lt?: Maybe<Scalars['String']>;
  key4_lte?: Maybe<Scalars['String']>;
  key4_not?: Maybe<Scalars['String']>;
  key4_not_contains?: Maybe<Scalars['String']>;
  key4_not_contains_nocase?: Maybe<Scalars['String']>;
  key4_not_ends_with?: Maybe<Scalars['String']>;
  key4_not_ends_with_nocase?: Maybe<Scalars['String']>;
  key4_not_in?: Maybe<Array<Scalars['String']>>;
  key4_not_starts_with?: Maybe<Scalars['String']>;
  key4_not_starts_with_nocase?: Maybe<Scalars['String']>;
  key4_starts_with?: Maybe<Scalars['String']>;
  key4_starts_with_nocase?: Maybe<Scalars['String']>;
  keywords?: Maybe<Scalars['String']>;
  keywords_contains?: Maybe<Scalars['String']>;
  keywords_contains_nocase?: Maybe<Scalars['String']>;
  keywords_ends_with?: Maybe<Scalars['String']>;
  keywords_ends_with_nocase?: Maybe<Scalars['String']>;
  keywords_gt?: Maybe<Scalars['String']>;
  keywords_gte?: Maybe<Scalars['String']>;
  keywords_in?: Maybe<Array<Scalars['String']>>;
  keywords_lt?: Maybe<Scalars['String']>;
  keywords_lte?: Maybe<Scalars['String']>;
  keywords_not?: Maybe<Scalars['String']>;
  keywords_not_contains?: Maybe<Scalars['String']>;
  keywords_not_contains_nocase?: Maybe<Scalars['String']>;
  keywords_not_ends_with?: Maybe<Scalars['String']>;
  keywords_not_ends_with_nocase?: Maybe<Scalars['String']>;
  keywords_not_in?: Maybe<Array<Scalars['String']>>;
  keywords_not_starts_with?: Maybe<Scalars['String']>;
  keywords_not_starts_with_nocase?: Maybe<Scalars['String']>;
  keywords_starts_with?: Maybe<Scalars['String']>;
  keywords_starts_with_nocase?: Maybe<Scalars['String']>;
  metadata_?: Maybe<LItemMetadata_Filter>;
  or?: Maybe<Array<Maybe<LItemMetametadata_Filter>>>;
  props_?: Maybe<MetaItemProp_Filter>;
};

export enum LItemMetametadata_OrderBy {
  Id = 'id',
  Key0 = 'key0',
  Key1 = 'key1',
  Key2 = 'key2',
  Key3 = 'key3',
  Key4 = 'key4',
  Keywords = 'keywords',
  Metadata = 'metadata',
  MetadataId = 'metadata__id',
  MetadataKey0 = 'metadata__key0',
  MetadataKey1 = 'metadata__key1',
  MetadataKey2 = 'metadata__key2',
  MetadataKey3 = 'metadata__key3',
  MetadataKey4 = 'metadata__key4',
  MetadataKeywords = 'metadata__keywords',
  Props = 'props'
}

export type LItem_Filter = {
  /** Filter for the block changed event. */
  _change_block?: Maybe<BlockChangedFilter>;
  and?: Maybe<Array<Maybe<LItem_Filter>>>;
  data?: Maybe<Scalars['String']>;
  data_contains?: Maybe<Scalars['String']>;
  data_contains_nocase?: Maybe<Scalars['String']>;
  data_ends_with?: Maybe<Scalars['String']>;
  data_ends_with_nocase?: Maybe<Scalars['String']>;
  data_gt?: Maybe<Scalars['String']>;
  data_gte?: Maybe<Scalars['String']>;
  data_in?: Maybe<Array<Scalars['String']>>;
  data_lt?: Maybe<Scalars['String']>;
  data_lte?: Maybe<Scalars['String']>;
  data_not?: Maybe<Scalars['String']>;
  data_not_contains?: Maybe<Scalars['String']>;
  data_not_contains_nocase?: Maybe<Scalars['String']>;
  data_not_ends_with?: Maybe<Scalars['String']>;
  data_not_ends_with_nocase?: Maybe<Scalars['String']>;
  data_not_in?: Maybe<Array<Scalars['String']>>;
  data_not_starts_with?: Maybe<Scalars['String']>;
  data_not_starts_with_nocase?: Maybe<Scalars['String']>;
  data_starts_with?: Maybe<Scalars['String']>;
  data_starts_with_nocase?: Maybe<Scalars['String']>;
  disputed?: Maybe<Scalars['Boolean']>;
  disputed_in?: Maybe<Array<Scalars['Boolean']>>;
  disputed_not?: Maybe<Scalars['Boolean']>;
  disputed_not_in?: Maybe<Array<Scalars['Boolean']>>;
  id?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_lt?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
  itemID?: Maybe<Scalars['Bytes']>;
  itemID_contains?: Maybe<Scalars['Bytes']>;
  itemID_gt?: Maybe<Scalars['Bytes']>;
  itemID_gte?: Maybe<Scalars['Bytes']>;
  itemID_in?: Maybe<Array<Scalars['Bytes']>>;
  itemID_lt?: Maybe<Scalars['Bytes']>;
  itemID_lte?: Maybe<Scalars['Bytes']>;
  itemID_not?: Maybe<Scalars['Bytes']>;
  itemID_not_contains?: Maybe<Scalars['Bytes']>;
  itemID_not_in?: Maybe<Array<Scalars['Bytes']>>;
  latestChallenger?: Maybe<Scalars['Bytes']>;
  latestChallenger_contains?: Maybe<Scalars['Bytes']>;
  latestChallenger_gt?: Maybe<Scalars['Bytes']>;
  latestChallenger_gte?: Maybe<Scalars['Bytes']>;
  latestChallenger_in?: Maybe<Array<Scalars['Bytes']>>;
  latestChallenger_lt?: Maybe<Scalars['Bytes']>;
  latestChallenger_lte?: Maybe<Scalars['Bytes']>;
  latestChallenger_not?: Maybe<Scalars['Bytes']>;
  latestChallenger_not_contains?: Maybe<Scalars['Bytes']>;
  latestChallenger_not_in?: Maybe<Array<Scalars['Bytes']>>;
  latestRequestResolutionTime?: Maybe<Scalars['BigInt']>;
  latestRequestResolutionTime_gt?: Maybe<Scalars['BigInt']>;
  latestRequestResolutionTime_gte?: Maybe<Scalars['BigInt']>;
  latestRequestResolutionTime_in?: Maybe<Array<Scalars['BigInt']>>;
  latestRequestResolutionTime_lt?: Maybe<Scalars['BigInt']>;
  latestRequestResolutionTime_lte?: Maybe<Scalars['BigInt']>;
  latestRequestResolutionTime_not?: Maybe<Scalars['BigInt']>;
  latestRequestResolutionTime_not_in?: Maybe<Array<Scalars['BigInt']>>;
  latestRequestSubmissionTime?: Maybe<Scalars['BigInt']>;
  latestRequestSubmissionTime_gt?: Maybe<Scalars['BigInt']>;
  latestRequestSubmissionTime_gte?: Maybe<Scalars['BigInt']>;
  latestRequestSubmissionTime_in?: Maybe<Array<Scalars['BigInt']>>;
  latestRequestSubmissionTime_lt?: Maybe<Scalars['BigInt']>;
  latestRequestSubmissionTime_lte?: Maybe<Scalars['BigInt']>;
  latestRequestSubmissionTime_not?: Maybe<Scalars['BigInt']>;
  latestRequestSubmissionTime_not_in?: Maybe<Array<Scalars['BigInt']>>;
  latestRequester?: Maybe<Scalars['Bytes']>;
  latestRequester_contains?: Maybe<Scalars['Bytes']>;
  latestRequester_gt?: Maybe<Scalars['Bytes']>;
  latestRequester_gte?: Maybe<Scalars['Bytes']>;
  latestRequester_in?: Maybe<Array<Scalars['Bytes']>>;
  latestRequester_lt?: Maybe<Scalars['Bytes']>;
  latestRequester_lte?: Maybe<Scalars['Bytes']>;
  latestRequester_not?: Maybe<Scalars['Bytes']>;
  latestRequester_not_contains?: Maybe<Scalars['Bytes']>;
  latestRequester_not_in?: Maybe<Array<Scalars['Bytes']>>;
  metadata?: Maybe<Scalars['String']>;
  metadata_?: Maybe<LItemMetadata_Filter>;
  metadata_contains?: Maybe<Scalars['String']>;
  metadata_contains_nocase?: Maybe<Scalars['String']>;
  metadata_ends_with?: Maybe<Scalars['String']>;
  metadata_ends_with_nocase?: Maybe<Scalars['String']>;
  metadata_gt?: Maybe<Scalars['String']>;
  metadata_gte?: Maybe<Scalars['String']>;
  metadata_in?: Maybe<Array<Scalars['String']>>;
  metadata_lt?: Maybe<Scalars['String']>;
  metadata_lte?: Maybe<Scalars['String']>;
  metadata_not?: Maybe<Scalars['String']>;
  metadata_not_contains?: Maybe<Scalars['String']>;
  metadata_not_contains_nocase?: Maybe<Scalars['String']>;
  metadata_not_ends_with?: Maybe<Scalars['String']>;
  metadata_not_ends_with_nocase?: Maybe<Scalars['String']>;
  metadata_not_in?: Maybe<Array<Scalars['String']>>;
  metadata_not_starts_with?: Maybe<Scalars['String']>;
  metadata_not_starts_with_nocase?: Maybe<Scalars['String']>;
  metadata_starts_with?: Maybe<Scalars['String']>;
  metadata_starts_with_nocase?: Maybe<Scalars['String']>;
  numberOfRequests?: Maybe<Scalars['BigInt']>;
  numberOfRequests_gt?: Maybe<Scalars['BigInt']>;
  numberOfRequests_gte?: Maybe<Scalars['BigInt']>;
  numberOfRequests_in?: Maybe<Array<Scalars['BigInt']>>;
  numberOfRequests_lt?: Maybe<Scalars['BigInt']>;
  numberOfRequests_lte?: Maybe<Scalars['BigInt']>;
  numberOfRequests_not?: Maybe<Scalars['BigInt']>;
  numberOfRequests_not_in?: Maybe<Array<Scalars['BigInt']>>;
  or?: Maybe<Array<Maybe<LItem_Filter>>>;
  registry?: Maybe<Scalars['String']>;
  registryAddress?: Maybe<Scalars['Bytes']>;
  registryAddress_contains?: Maybe<Scalars['Bytes']>;
  registryAddress_gt?: Maybe<Scalars['Bytes']>;
  registryAddress_gte?: Maybe<Scalars['Bytes']>;
  registryAddress_in?: Maybe<Array<Scalars['Bytes']>>;
  registryAddress_lt?: Maybe<Scalars['Bytes']>;
  registryAddress_lte?: Maybe<Scalars['Bytes']>;
  registryAddress_not?: Maybe<Scalars['Bytes']>;
  registryAddress_not_contains?: Maybe<Scalars['Bytes']>;
  registryAddress_not_in?: Maybe<Array<Scalars['Bytes']>>;
  registry_?: Maybe<LRegistry_Filter>;
  registry_contains?: Maybe<Scalars['String']>;
  registry_contains_nocase?: Maybe<Scalars['String']>;
  registry_ends_with?: Maybe<Scalars['String']>;
  registry_ends_with_nocase?: Maybe<Scalars['String']>;
  registry_gt?: Maybe<Scalars['String']>;
  registry_gte?: Maybe<Scalars['String']>;
  registry_in?: Maybe<Array<Scalars['String']>>;
  registry_lt?: Maybe<Scalars['String']>;
  registry_lte?: Maybe<Scalars['String']>;
  registry_not?: Maybe<Scalars['String']>;
  registry_not_contains?: Maybe<Scalars['String']>;
  registry_not_contains_nocase?: Maybe<Scalars['String']>;
  registry_not_ends_with?: Maybe<Scalars['String']>;
  registry_not_ends_with_nocase?: Maybe<Scalars['String']>;
  registry_not_in?: Maybe<Array<Scalars['String']>>;
  registry_not_starts_with?: Maybe<Scalars['String']>;
  registry_not_starts_with_nocase?: Maybe<Scalars['String']>;
  registry_starts_with?: Maybe<Scalars['String']>;
  registry_starts_with_nocase?: Maybe<Scalars['String']>;
  requests_?: Maybe<LRequest_Filter>;
  status?: Maybe<Status>;
  status_in?: Maybe<Array<Status>>;
  status_not?: Maybe<Status>;
  status_not_in?: Maybe<Array<Status>>;
};

export enum LItem_OrderBy {
  Data = 'data',
  Disputed = 'disputed',
  Id = 'id',
  ItemId = 'itemID',
  LatestChallenger = 'latestChallenger',
  LatestRequestResolutionTime = 'latestRequestResolutionTime',
  LatestRequestSubmissionTime = 'latestRequestSubmissionTime',
  LatestRequester = 'latestRequester',
  Metadata = 'metadata',
  MetadataId = 'metadata__id',
  MetadataKey0 = 'metadata__key0',
  MetadataKey1 = 'metadata__key1',
  MetadataKey2 = 'metadata__key2',
  MetadataKey3 = 'metadata__key3',
  MetadataKey4 = 'metadata__key4',
  MetadataKeywords = 'metadata__keywords',
  NumberOfRequests = 'numberOfRequests',
  Registry = 'registry',
  RegistryAddress = 'registryAddress',
  RegistryConnectedTcr = 'registry__connectedTCR',
  RegistryId = 'registry__id',
  RegistryMetaEvidenceCount = 'registry__metaEvidenceCount',
  RegistryNumberOfAbsent = 'registry__numberOfAbsent',
  RegistryNumberOfChallengedClearing = 'registry__numberOfChallengedClearing',
  RegistryNumberOfChallengedRegistrations = 'registry__numberOfChallengedRegistrations',
  RegistryNumberOfClearingRequested = 'registry__numberOfClearingRequested',
  RegistryNumberOfRegistered = 'registry__numberOfRegistered',
  RegistryNumberOfRegistrationRequested = 'registry__numberOfRegistrationRequested',
  Requests = 'requests',
  Status = 'status'
}

export type LRegistry = {
  __typename?: 'LRegistry';
  /** The current removal meta evidence */
  clearingMetaEvidence: MetaEvidence;
  /** Connected TCR. Can be the 0 address. In practice, will never be null. */
  connectedTCR?: Maybe<Scalars['Bytes']>;
  /** The registry address */
  id: Scalars['ID'];
  /** The items submitted to this list */
  items: Array<LItem>;
  /** The number of MetaEvidence event logs emitted. */
  metaEvidenceCount: Scalars['BigInt'];
  metadata?: Maybe<LRegistryMetadata>;
  /** The total number of items in absent state. */
  numberOfAbsent: Scalars['BigInt'];
  /** The total number of items in the challenged removal state. */
  numberOfChallengedClearing: Scalars['BigInt'];
  /** The total number of items in the challenged registration state. */
  numberOfChallengedRegistrations: Scalars['BigInt'];
  numberOfClearingRequested: Scalars['BigInt'];
  /** The total number of items in registered state. */
  numberOfRegistered: Scalars['BigInt'];
  /** The total number of items in the registration requested state. */
  numberOfRegistrationRequested: Scalars['BigInt'];
  /** The current registration meta evidence */
  registrationMetaEvidence: MetaEvidence;
  /** The requests submitted to this list */
  requests: Array<LRequest>;
};


export type LRegistryItemsArgs = {
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<LItem_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  skip?: Maybe<Scalars['Int']>;
  where?: Maybe<LItem_Filter>;
};


export type LRegistryRequestsArgs = {
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<LRequest_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  skip?: Maybe<Scalars['Int']>;
  where?: Maybe<LRequest_Filter>;
};

export type LRegistryMetadata = {
  __typename?: 'LRegistryMetadata';
  description?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  isConnectedTCR?: Maybe<Scalars['Boolean']>;
  isTCRofTcrs?: Maybe<Scalars['Boolean']>;
  itemName?: Maybe<Scalars['String']>;
  itemNamePlural?: Maybe<Scalars['String']>;
  parentTCRAddress?: Maybe<Scalars['String']>;
  registry?: Maybe<LRegistry>;
  relTcrDisabled?: Maybe<Scalars['Boolean']>;
  requireRemovalEvidence?: Maybe<Scalars['Boolean']>;
  title?: Maybe<Scalars['String']>;
};

export type LRegistryMetadata_Filter = {
  /** Filter for the block changed event. */
  _change_block?: Maybe<BlockChangedFilter>;
  and?: Maybe<Array<Maybe<LRegistryMetadata_Filter>>>;
  description?: Maybe<Scalars['String']>;
  description_contains?: Maybe<Scalars['String']>;
  description_contains_nocase?: Maybe<Scalars['String']>;
  description_ends_with?: Maybe<Scalars['String']>;
  description_ends_with_nocase?: Maybe<Scalars['String']>;
  description_gt?: Maybe<Scalars['String']>;
  description_gte?: Maybe<Scalars['String']>;
  description_in?: Maybe<Array<Scalars['String']>>;
  description_lt?: Maybe<Scalars['String']>;
  description_lte?: Maybe<Scalars['String']>;
  description_not?: Maybe<Scalars['String']>;
  description_not_contains?: Maybe<Scalars['String']>;
  description_not_contains_nocase?: Maybe<Scalars['String']>;
  description_not_ends_with?: Maybe<Scalars['String']>;
  description_not_ends_with_nocase?: Maybe<Scalars['String']>;
  description_not_in?: Maybe<Array<Scalars['String']>>;
  description_not_starts_with?: Maybe<Scalars['String']>;
  description_not_starts_with_nocase?: Maybe<Scalars['String']>;
  description_starts_with?: Maybe<Scalars['String']>;
  description_starts_with_nocase?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_lt?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
  isConnectedTCR?: Maybe<Scalars['Boolean']>;
  isConnectedTCR_in?: Maybe<Array<Scalars['Boolean']>>;
  isConnectedTCR_not?: Maybe<Scalars['Boolean']>;
  isConnectedTCR_not_in?: Maybe<Array<Scalars['Boolean']>>;
  isTCRofTcrs?: Maybe<Scalars['Boolean']>;
  isTCRofTcrs_in?: Maybe<Array<Scalars['Boolean']>>;
  isTCRofTcrs_not?: Maybe<Scalars['Boolean']>;
  isTCRofTcrs_not_in?: Maybe<Array<Scalars['Boolean']>>;
  itemName?: Maybe<Scalars['String']>;
  itemNamePlural?: Maybe<Scalars['String']>;
  itemNamePlural_contains?: Maybe<Scalars['String']>;
  itemNamePlural_contains_nocase?: Maybe<Scalars['String']>;
  itemNamePlural_ends_with?: Maybe<Scalars['String']>;
  itemNamePlural_ends_with_nocase?: Maybe<Scalars['String']>;
  itemNamePlural_gt?: Maybe<Scalars['String']>;
  itemNamePlural_gte?: Maybe<Scalars['String']>;
  itemNamePlural_in?: Maybe<Array<Scalars['String']>>;
  itemNamePlural_lt?: Maybe<Scalars['String']>;
  itemNamePlural_lte?: Maybe<Scalars['String']>;
  itemNamePlural_not?: Maybe<Scalars['String']>;
  itemNamePlural_not_contains?: Maybe<Scalars['String']>;
  itemNamePlural_not_contains_nocase?: Maybe<Scalars['String']>;
  itemNamePlural_not_ends_with?: Maybe<Scalars['String']>;
  itemNamePlural_not_ends_with_nocase?: Maybe<Scalars['String']>;
  itemNamePlural_not_in?: Maybe<Array<Scalars['String']>>;
  itemNamePlural_not_starts_with?: Maybe<Scalars['String']>;
  itemNamePlural_not_starts_with_nocase?: Maybe<Scalars['String']>;
  itemNamePlural_starts_with?: Maybe<Scalars['String']>;
  itemNamePlural_starts_with_nocase?: Maybe<Scalars['String']>;
  itemName_contains?: Maybe<Scalars['String']>;
  itemName_contains_nocase?: Maybe<Scalars['String']>;
  itemName_ends_with?: Maybe<Scalars['String']>;
  itemName_ends_with_nocase?: Maybe<Scalars['String']>;
  itemName_gt?: Maybe<Scalars['String']>;
  itemName_gte?: Maybe<Scalars['String']>;
  itemName_in?: Maybe<Array<Scalars['String']>>;
  itemName_lt?: Maybe<Scalars['String']>;
  itemName_lte?: Maybe<Scalars['String']>;
  itemName_not?: Maybe<Scalars['String']>;
  itemName_not_contains?: Maybe<Scalars['String']>;
  itemName_not_contains_nocase?: Maybe<Scalars['String']>;
  itemName_not_ends_with?: Maybe<Scalars['String']>;
  itemName_not_ends_with_nocase?: Maybe<Scalars['String']>;
  itemName_not_in?: Maybe<Array<Scalars['String']>>;
  itemName_not_starts_with?: Maybe<Scalars['String']>;
  itemName_not_starts_with_nocase?: Maybe<Scalars['String']>;
  itemName_starts_with?: Maybe<Scalars['String']>;
  itemName_starts_with_nocase?: Maybe<Scalars['String']>;
  or?: Maybe<Array<Maybe<LRegistryMetadata_Filter>>>;
  parentTCRAddress?: Maybe<Scalars['String']>;
  parentTCRAddress_contains?: Maybe<Scalars['String']>;
  parentTCRAddress_contains_nocase?: Maybe<Scalars['String']>;
  parentTCRAddress_ends_with?: Maybe<Scalars['String']>;
  parentTCRAddress_ends_with_nocase?: Maybe<Scalars['String']>;
  parentTCRAddress_gt?: Maybe<Scalars['String']>;
  parentTCRAddress_gte?: Maybe<Scalars['String']>;
  parentTCRAddress_in?: Maybe<Array<Scalars['String']>>;
  parentTCRAddress_lt?: Maybe<Scalars['String']>;
  parentTCRAddress_lte?: Maybe<Scalars['String']>;
  parentTCRAddress_not?: Maybe<Scalars['String']>;
  parentTCRAddress_not_contains?: Maybe<Scalars['String']>;
  parentTCRAddress_not_contains_nocase?: Maybe<Scalars['String']>;
  parentTCRAddress_not_ends_with?: Maybe<Scalars['String']>;
  parentTCRAddress_not_ends_with_nocase?: Maybe<Scalars['String']>;
  parentTCRAddress_not_in?: Maybe<Array<Scalars['String']>>;
  parentTCRAddress_not_starts_with?: Maybe<Scalars['String']>;
  parentTCRAddress_not_starts_with_nocase?: Maybe<Scalars['String']>;
  parentTCRAddress_starts_with?: Maybe<Scalars['String']>;
  parentTCRAddress_starts_with_nocase?: Maybe<Scalars['String']>;
  registry_?: Maybe<LRegistry_Filter>;
  relTcrDisabled?: Maybe<Scalars['Boolean']>;
  relTcrDisabled_in?: Maybe<Array<Scalars['Boolean']>>;
  relTcrDisabled_not?: Maybe<Scalars['Boolean']>;
  relTcrDisabled_not_in?: Maybe<Array<Scalars['Boolean']>>;
  requireRemovalEvidence?: Maybe<Scalars['Boolean']>;
  requireRemovalEvidence_in?: Maybe<Array<Scalars['Boolean']>>;
  requireRemovalEvidence_not?: Maybe<Scalars['Boolean']>;
  requireRemovalEvidence_not_in?: Maybe<Array<Scalars['Boolean']>>;
  title?: Maybe<Scalars['String']>;
  title_contains?: Maybe<Scalars['String']>;
  title_contains_nocase?: Maybe<Scalars['String']>;
  title_ends_with?: Maybe<Scalars['String']>;
  title_ends_with_nocase?: Maybe<Scalars['String']>;
  title_gt?: Maybe<Scalars['String']>;
  title_gte?: Maybe<Scalars['String']>;
  title_in?: Maybe<Array<Scalars['String']>>;
  title_lt?: Maybe<Scalars['String']>;
  title_lte?: Maybe<Scalars['String']>;
  title_not?: Maybe<Scalars['String']>;
  title_not_contains?: Maybe<Scalars['String']>;
  title_not_contains_nocase?: Maybe<Scalars['String']>;
  title_not_ends_with?: Maybe<Scalars['String']>;
  title_not_ends_with_nocase?: Maybe<Scalars['String']>;
  title_not_in?: Maybe<Array<Scalars['String']>>;
  title_not_starts_with?: Maybe<Scalars['String']>;
  title_not_starts_with_nocase?: Maybe<Scalars['String']>;
  title_starts_with?: Maybe<Scalars['String']>;
  title_starts_with_nocase?: Maybe<Scalars['String']>;
};

export enum LRegistryMetadata_OrderBy {
  Description = 'description',
  Id = 'id',
  IsConnectedTcr = 'isConnectedTCR',
  IsTcRofTcrs = 'isTCRofTcrs',
  ItemName = 'itemName',
  ItemNamePlural = 'itemNamePlural',
  ParentTcrAddress = 'parentTCRAddress',
  Registry = 'registry',
  RegistryConnectedTcr = 'registry__connectedTCR',
  RegistryId = 'registry__id',
  RegistryMetaEvidenceCount = 'registry__metaEvidenceCount',
  RegistryNumberOfAbsent = 'registry__numberOfAbsent',
  RegistryNumberOfChallengedClearing = 'registry__numberOfChallengedClearing',
  RegistryNumberOfChallengedRegistrations = 'registry__numberOfChallengedRegistrations',
  RegistryNumberOfClearingRequested = 'registry__numberOfClearingRequested',
  RegistryNumberOfRegistered = 'registry__numberOfRegistered',
  RegistryNumberOfRegistrationRequested = 'registry__numberOfRegistrationRequested',
  RelTcrDisabled = 'relTcrDisabled',
  RequireRemovalEvidence = 'requireRemovalEvidence',
  Title = 'title'
}

export type LRegistry_Filter = {
  /** Filter for the block changed event. */
  _change_block?: Maybe<BlockChangedFilter>;
  and?: Maybe<Array<Maybe<LRegistry_Filter>>>;
  clearingMetaEvidence?: Maybe<Scalars['String']>;
  clearingMetaEvidence_?: Maybe<MetaEvidence_Filter>;
  clearingMetaEvidence_contains?: Maybe<Scalars['String']>;
  clearingMetaEvidence_contains_nocase?: Maybe<Scalars['String']>;
  clearingMetaEvidence_ends_with?: Maybe<Scalars['String']>;
  clearingMetaEvidence_ends_with_nocase?: Maybe<Scalars['String']>;
  clearingMetaEvidence_gt?: Maybe<Scalars['String']>;
  clearingMetaEvidence_gte?: Maybe<Scalars['String']>;
  clearingMetaEvidence_in?: Maybe<Array<Scalars['String']>>;
  clearingMetaEvidence_lt?: Maybe<Scalars['String']>;
  clearingMetaEvidence_lte?: Maybe<Scalars['String']>;
  clearingMetaEvidence_not?: Maybe<Scalars['String']>;
  clearingMetaEvidence_not_contains?: Maybe<Scalars['String']>;
  clearingMetaEvidence_not_contains_nocase?: Maybe<Scalars['String']>;
  clearingMetaEvidence_not_ends_with?: Maybe<Scalars['String']>;
  clearingMetaEvidence_not_ends_with_nocase?: Maybe<Scalars['String']>;
  clearingMetaEvidence_not_in?: Maybe<Array<Scalars['String']>>;
  clearingMetaEvidence_not_starts_with?: Maybe<Scalars['String']>;
  clearingMetaEvidence_not_starts_with_nocase?: Maybe<Scalars['String']>;
  clearingMetaEvidence_starts_with?: Maybe<Scalars['String']>;
  clearingMetaEvidence_starts_with_nocase?: Maybe<Scalars['String']>;
  connectedTCR?: Maybe<Scalars['Bytes']>;
  connectedTCR_contains?: Maybe<Scalars['Bytes']>;
  connectedTCR_gt?: Maybe<Scalars['Bytes']>;
  connectedTCR_gte?: Maybe<Scalars['Bytes']>;
  connectedTCR_in?: Maybe<Array<Scalars['Bytes']>>;
  connectedTCR_lt?: Maybe<Scalars['Bytes']>;
  connectedTCR_lte?: Maybe<Scalars['Bytes']>;
  connectedTCR_not?: Maybe<Scalars['Bytes']>;
  connectedTCR_not_contains?: Maybe<Scalars['Bytes']>;
  connectedTCR_not_in?: Maybe<Array<Scalars['Bytes']>>;
  id?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_lt?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
  items_?: Maybe<LItem_Filter>;
  metaEvidenceCount?: Maybe<Scalars['BigInt']>;
  metaEvidenceCount_gt?: Maybe<Scalars['BigInt']>;
  metaEvidenceCount_gte?: Maybe<Scalars['BigInt']>;
  metaEvidenceCount_in?: Maybe<Array<Scalars['BigInt']>>;
  metaEvidenceCount_lt?: Maybe<Scalars['BigInt']>;
  metaEvidenceCount_lte?: Maybe<Scalars['BigInt']>;
  metaEvidenceCount_not?: Maybe<Scalars['BigInt']>;
  metaEvidenceCount_not_in?: Maybe<Array<Scalars['BigInt']>>;
  metadata?: Maybe<Scalars['String']>;
  metadata_?: Maybe<LRegistryMetadata_Filter>;
  metadata_contains?: Maybe<Scalars['String']>;
  metadata_contains_nocase?: Maybe<Scalars['String']>;
  metadata_ends_with?: Maybe<Scalars['String']>;
  metadata_ends_with_nocase?: Maybe<Scalars['String']>;
  metadata_gt?: Maybe<Scalars['String']>;
  metadata_gte?: Maybe<Scalars['String']>;
  metadata_in?: Maybe<Array<Scalars['String']>>;
  metadata_lt?: Maybe<Scalars['String']>;
  metadata_lte?: Maybe<Scalars['String']>;
  metadata_not?: Maybe<Scalars['String']>;
  metadata_not_contains?: Maybe<Scalars['String']>;
  metadata_not_contains_nocase?: Maybe<Scalars['String']>;
  metadata_not_ends_with?: Maybe<Scalars['String']>;
  metadata_not_ends_with_nocase?: Maybe<Scalars['String']>;
  metadata_not_in?: Maybe<Array<Scalars['String']>>;
  metadata_not_starts_with?: Maybe<Scalars['String']>;
  metadata_not_starts_with_nocase?: Maybe<Scalars['String']>;
  metadata_starts_with?: Maybe<Scalars['String']>;
  metadata_starts_with_nocase?: Maybe<Scalars['String']>;
  numberOfAbsent?: Maybe<Scalars['BigInt']>;
  numberOfAbsent_gt?: Maybe<Scalars['BigInt']>;
  numberOfAbsent_gte?: Maybe<Scalars['BigInt']>;
  numberOfAbsent_in?: Maybe<Array<Scalars['BigInt']>>;
  numberOfAbsent_lt?: Maybe<Scalars['BigInt']>;
  numberOfAbsent_lte?: Maybe<Scalars['BigInt']>;
  numberOfAbsent_not?: Maybe<Scalars['BigInt']>;
  numberOfAbsent_not_in?: Maybe<Array<Scalars['BigInt']>>;
  numberOfChallengedClearing?: Maybe<Scalars['BigInt']>;
  numberOfChallengedClearing_gt?: Maybe<Scalars['BigInt']>;
  numberOfChallengedClearing_gte?: Maybe<Scalars['BigInt']>;
  numberOfChallengedClearing_in?: Maybe<Array<Scalars['BigInt']>>;
  numberOfChallengedClearing_lt?: Maybe<Scalars['BigInt']>;
  numberOfChallengedClearing_lte?: Maybe<Scalars['BigInt']>;
  numberOfChallengedClearing_not?: Maybe<Scalars['BigInt']>;
  numberOfChallengedClearing_not_in?: Maybe<Array<Scalars['BigInt']>>;
  numberOfChallengedRegistrations?: Maybe<Scalars['BigInt']>;
  numberOfChallengedRegistrations_gt?: Maybe<Scalars['BigInt']>;
  numberOfChallengedRegistrations_gte?: Maybe<Scalars['BigInt']>;
  numberOfChallengedRegistrations_in?: Maybe<Array<Scalars['BigInt']>>;
  numberOfChallengedRegistrations_lt?: Maybe<Scalars['BigInt']>;
  numberOfChallengedRegistrations_lte?: Maybe<Scalars['BigInt']>;
  numberOfChallengedRegistrations_not?: Maybe<Scalars['BigInt']>;
  numberOfChallengedRegistrations_not_in?: Maybe<Array<Scalars['BigInt']>>;
  numberOfClearingRequested?: Maybe<Scalars['BigInt']>;
  numberOfClearingRequested_gt?: Maybe<Scalars['BigInt']>;
  numberOfClearingRequested_gte?: Maybe<Scalars['BigInt']>;
  numberOfClearingRequested_in?: Maybe<Array<Scalars['BigInt']>>;
  numberOfClearingRequested_lt?: Maybe<Scalars['BigInt']>;
  numberOfClearingRequested_lte?: Maybe<Scalars['BigInt']>;
  numberOfClearingRequested_not?: Maybe<Scalars['BigInt']>;
  numberOfClearingRequested_not_in?: Maybe<Array<Scalars['BigInt']>>;
  numberOfRegistered?: Maybe<Scalars['BigInt']>;
  numberOfRegistered_gt?: Maybe<Scalars['BigInt']>;
  numberOfRegistered_gte?: Maybe<Scalars['BigInt']>;
  numberOfRegistered_in?: Maybe<Array<Scalars['BigInt']>>;
  numberOfRegistered_lt?: Maybe<Scalars['BigInt']>;
  numberOfRegistered_lte?: Maybe<Scalars['BigInt']>;
  numberOfRegistered_not?: Maybe<Scalars['BigInt']>;
  numberOfRegistered_not_in?: Maybe<Array<Scalars['BigInt']>>;
  numberOfRegistrationRequested?: Maybe<Scalars['BigInt']>;
  numberOfRegistrationRequested_gt?: Maybe<Scalars['BigInt']>;
  numberOfRegistrationRequested_gte?: Maybe<Scalars['BigInt']>;
  numberOfRegistrationRequested_in?: Maybe<Array<Scalars['BigInt']>>;
  numberOfRegistrationRequested_lt?: Maybe<Scalars['BigInt']>;
  numberOfRegistrationRequested_lte?: Maybe<Scalars['BigInt']>;
  numberOfRegistrationRequested_not?: Maybe<Scalars['BigInt']>;
  numberOfRegistrationRequested_not_in?: Maybe<Array<Scalars['BigInt']>>;
  or?: Maybe<Array<Maybe<LRegistry_Filter>>>;
  registrationMetaEvidence?: Maybe<Scalars['String']>;
  registrationMetaEvidence_?: Maybe<MetaEvidence_Filter>;
  registrationMetaEvidence_contains?: Maybe<Scalars['String']>;
  registrationMetaEvidence_contains_nocase?: Maybe<Scalars['String']>;
  registrationMetaEvidence_ends_with?: Maybe<Scalars['String']>;
  registrationMetaEvidence_ends_with_nocase?: Maybe<Scalars['String']>;
  registrationMetaEvidence_gt?: Maybe<Scalars['String']>;
  registrationMetaEvidence_gte?: Maybe<Scalars['String']>;
  registrationMetaEvidence_in?: Maybe<Array<Scalars['String']>>;
  registrationMetaEvidence_lt?: Maybe<Scalars['String']>;
  registrationMetaEvidence_lte?: Maybe<Scalars['String']>;
  registrationMetaEvidence_not?: Maybe<Scalars['String']>;
  registrationMetaEvidence_not_contains?: Maybe<Scalars['String']>;
  registrationMetaEvidence_not_contains_nocase?: Maybe<Scalars['String']>;
  registrationMetaEvidence_not_ends_with?: Maybe<Scalars['String']>;
  registrationMetaEvidence_not_ends_with_nocase?: Maybe<Scalars['String']>;
  registrationMetaEvidence_not_in?: Maybe<Array<Scalars['String']>>;
  registrationMetaEvidence_not_starts_with?: Maybe<Scalars['String']>;
  registrationMetaEvidence_not_starts_with_nocase?: Maybe<Scalars['String']>;
  registrationMetaEvidence_starts_with?: Maybe<Scalars['String']>;
  registrationMetaEvidence_starts_with_nocase?: Maybe<Scalars['String']>;
  requests_?: Maybe<LRequest_Filter>;
};

export enum LRegistry_OrderBy {
  ClearingMetaEvidence = 'clearingMetaEvidence',
  ClearingMetaEvidenceUri = 'clearingMetaEvidence__URI',
  ClearingMetaEvidenceId = 'clearingMetaEvidence__id',
  ConnectedTcr = 'connectedTCR',
  Id = 'id',
  Items = 'items',
  MetaEvidenceCount = 'metaEvidenceCount',
  Metadata = 'metadata',
  MetadataDescription = 'metadata__description',
  MetadataId = 'metadata__id',
  MetadataIsConnectedTcr = 'metadata__isConnectedTCR',
  MetadataIsTcRofTcrs = 'metadata__isTCRofTcrs',
  MetadataItemName = 'metadata__itemName',
  MetadataItemNamePlural = 'metadata__itemNamePlural',
  MetadataParentTcrAddress = 'metadata__parentTCRAddress',
  MetadataRelTcrDisabled = 'metadata__relTcrDisabled',
  MetadataRequireRemovalEvidence = 'metadata__requireRemovalEvidence',
  MetadataTitle = 'metadata__title',
  NumberOfAbsent = 'numberOfAbsent',
  NumberOfChallengedClearing = 'numberOfChallengedClearing',
  NumberOfChallengedRegistrations = 'numberOfChallengedRegistrations',
  NumberOfClearingRequested = 'numberOfClearingRequested',
  NumberOfRegistered = 'numberOfRegistered',
  NumberOfRegistrationRequested = 'numberOfRegistrationRequested',
  RegistrationMetaEvidence = 'registrationMetaEvidence',
  RegistrationMetaEvidenceUri = 'registrationMetaEvidence__URI',
  RegistrationMetaEvidenceId = 'registrationMetaEvidence__id',
  Requests = 'requests'
}

export type LRequest = {
  __typename?: 'LRequest';
  /** The arbitrator trusted to solve disputes for this request. */
  arbitrator: Scalars['Bytes'];
  /** The extra data for the trusted arbitrator of this request. */
  arbitratorExtraData: Scalars['Bytes'];
  /** The address of the party that challenged the request */
  challenger: Scalars['Bytes'];
  /** The hash of the transaction that created this request. */
  creationTx: Scalars['Bytes'];
  /** The deposit that would be awarded to the challenger if challenge is successful */
  deposit: Scalars['BigInt'];
  /** ID of the dispute, if any. */
  disputeID: Scalars['BigInt'];
  /** The outcome of the dispute, if any. Note that unsuccessful appeal fundings can invert the arbitrator ruling (so this may differ from the ruling given by the arbitrator). */
  disputeOutcome: Ruling;
  /** True if a dispute was raised. */
  disputed: Scalars['Boolean'];
  /** The evidence group for this request. */
  evidenceGroup: EvidenceGroup;
  /** Only set if the request was settled by a dispute. Used by the twitter bot */
  finalRuling?: Maybe<Scalars['BigInt']>;
  /** The item ID (which is the keccak256 hash of its data). */
  id: Scalars['ID'];
  /** The item this request belongs to. */
  item: LItem;
  /** The URI to the meta evidence used for this request. */
  metaEvidence: MetaEvidence;
  /** The total number of rounds on this request. */
  numberOfRounds: Scalars['BigInt'];
  /** The registry where this request was submitted. */
  registry: LRegistry;
  /** The address of the registry this item was submitted. Redundant with registry field to allow use in conditionals. */
  registryAddress: Scalars['Bytes'];
  /** Whether it was requested to add or remove the item to/from the list. */
  requestType: Status;
  /** The address of the party that made a request */
  requester: Scalars['Bytes'];
  /** The time the request was resolved. */
  resolutionTime: Scalars['BigInt'];
  /** The hash of the transaction that solved this request. */
  resolutionTx?: Maybe<Scalars['Bytes']>;
  /** True if the request was executed and/or any raised disputes were resolved. */
  resolved: Scalars['Boolean'];
  /** Tracks each round of a dispute in the form rounds[roundID]. */
  rounds: Array<LRound>;
  /** Time when the request was made. Used to track when the challenge period ends. */
  submissionTime: Scalars['BigInt'];
};


export type LRequestRoundsArgs = {
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<LRound_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  skip?: Maybe<Scalars['Int']>;
  where?: Maybe<LRound_Filter>;
};

export type LRequest_Filter = {
  /** Filter for the block changed event. */
  _change_block?: Maybe<BlockChangedFilter>;
  and?: Maybe<Array<Maybe<LRequest_Filter>>>;
  arbitrator?: Maybe<Scalars['Bytes']>;
  arbitratorExtraData?: Maybe<Scalars['Bytes']>;
  arbitratorExtraData_contains?: Maybe<Scalars['Bytes']>;
  arbitratorExtraData_gt?: Maybe<Scalars['Bytes']>;
  arbitratorExtraData_gte?: Maybe<Scalars['Bytes']>;
  arbitratorExtraData_in?: Maybe<Array<Scalars['Bytes']>>;
  arbitratorExtraData_lt?: Maybe<Scalars['Bytes']>;
  arbitratorExtraData_lte?: Maybe<Scalars['Bytes']>;
  arbitratorExtraData_not?: Maybe<Scalars['Bytes']>;
  arbitratorExtraData_not_contains?: Maybe<Scalars['Bytes']>;
  arbitratorExtraData_not_in?: Maybe<Array<Scalars['Bytes']>>;
  arbitrator_contains?: Maybe<Scalars['Bytes']>;
  arbitrator_gt?: Maybe<Scalars['Bytes']>;
  arbitrator_gte?: Maybe<Scalars['Bytes']>;
  arbitrator_in?: Maybe<Array<Scalars['Bytes']>>;
  arbitrator_lt?: Maybe<Scalars['Bytes']>;
  arbitrator_lte?: Maybe<Scalars['Bytes']>;
  arbitrator_not?: Maybe<Scalars['Bytes']>;
  arbitrator_not_contains?: Maybe<Scalars['Bytes']>;
  arbitrator_not_in?: Maybe<Array<Scalars['Bytes']>>;
  challenger?: Maybe<Scalars['Bytes']>;
  challenger_contains?: Maybe<Scalars['Bytes']>;
  challenger_gt?: Maybe<Scalars['Bytes']>;
  challenger_gte?: Maybe<Scalars['Bytes']>;
  challenger_in?: Maybe<Array<Scalars['Bytes']>>;
  challenger_lt?: Maybe<Scalars['Bytes']>;
  challenger_lte?: Maybe<Scalars['Bytes']>;
  challenger_not?: Maybe<Scalars['Bytes']>;
  challenger_not_contains?: Maybe<Scalars['Bytes']>;
  challenger_not_in?: Maybe<Array<Scalars['Bytes']>>;
  creationTx?: Maybe<Scalars['Bytes']>;
  creationTx_contains?: Maybe<Scalars['Bytes']>;
  creationTx_gt?: Maybe<Scalars['Bytes']>;
  creationTx_gte?: Maybe<Scalars['Bytes']>;
  creationTx_in?: Maybe<Array<Scalars['Bytes']>>;
  creationTx_lt?: Maybe<Scalars['Bytes']>;
  creationTx_lte?: Maybe<Scalars['Bytes']>;
  creationTx_not?: Maybe<Scalars['Bytes']>;
  creationTx_not_contains?: Maybe<Scalars['Bytes']>;
  creationTx_not_in?: Maybe<Array<Scalars['Bytes']>>;
  deposit?: Maybe<Scalars['BigInt']>;
  deposit_gt?: Maybe<Scalars['BigInt']>;
  deposit_gte?: Maybe<Scalars['BigInt']>;
  deposit_in?: Maybe<Array<Scalars['BigInt']>>;
  deposit_lt?: Maybe<Scalars['BigInt']>;
  deposit_lte?: Maybe<Scalars['BigInt']>;
  deposit_not?: Maybe<Scalars['BigInt']>;
  deposit_not_in?: Maybe<Array<Scalars['BigInt']>>;
  disputeID?: Maybe<Scalars['BigInt']>;
  disputeID_gt?: Maybe<Scalars['BigInt']>;
  disputeID_gte?: Maybe<Scalars['BigInt']>;
  disputeID_in?: Maybe<Array<Scalars['BigInt']>>;
  disputeID_lt?: Maybe<Scalars['BigInt']>;
  disputeID_lte?: Maybe<Scalars['BigInt']>;
  disputeID_not?: Maybe<Scalars['BigInt']>;
  disputeID_not_in?: Maybe<Array<Scalars['BigInt']>>;
  disputeOutcome?: Maybe<Ruling>;
  disputeOutcome_in?: Maybe<Array<Ruling>>;
  disputeOutcome_not?: Maybe<Ruling>;
  disputeOutcome_not_in?: Maybe<Array<Ruling>>;
  disputed?: Maybe<Scalars['Boolean']>;
  disputed_in?: Maybe<Array<Scalars['Boolean']>>;
  disputed_not?: Maybe<Scalars['Boolean']>;
  disputed_not_in?: Maybe<Array<Scalars['Boolean']>>;
  evidenceGroup?: Maybe<Scalars['String']>;
  evidenceGroup_?: Maybe<EvidenceGroup_Filter>;
  evidenceGroup_contains?: Maybe<Scalars['String']>;
  evidenceGroup_contains_nocase?: Maybe<Scalars['String']>;
  evidenceGroup_ends_with?: Maybe<Scalars['String']>;
  evidenceGroup_ends_with_nocase?: Maybe<Scalars['String']>;
  evidenceGroup_gt?: Maybe<Scalars['String']>;
  evidenceGroup_gte?: Maybe<Scalars['String']>;
  evidenceGroup_in?: Maybe<Array<Scalars['String']>>;
  evidenceGroup_lt?: Maybe<Scalars['String']>;
  evidenceGroup_lte?: Maybe<Scalars['String']>;
  evidenceGroup_not?: Maybe<Scalars['String']>;
  evidenceGroup_not_contains?: Maybe<Scalars['String']>;
  evidenceGroup_not_contains_nocase?: Maybe<Scalars['String']>;
  evidenceGroup_not_ends_with?: Maybe<Scalars['String']>;
  evidenceGroup_not_ends_with_nocase?: Maybe<Scalars['String']>;
  evidenceGroup_not_in?: Maybe<Array<Scalars['String']>>;
  evidenceGroup_not_starts_with?: Maybe<Scalars['String']>;
  evidenceGroup_not_starts_with_nocase?: Maybe<Scalars['String']>;
  evidenceGroup_starts_with?: Maybe<Scalars['String']>;
  evidenceGroup_starts_with_nocase?: Maybe<Scalars['String']>;
  finalRuling?: Maybe<Scalars['BigInt']>;
  finalRuling_gt?: Maybe<Scalars['BigInt']>;
  finalRuling_gte?: Maybe<Scalars['BigInt']>;
  finalRuling_in?: Maybe<Array<Scalars['BigInt']>>;
  finalRuling_lt?: Maybe<Scalars['BigInt']>;
  finalRuling_lte?: Maybe<Scalars['BigInt']>;
  finalRuling_not?: Maybe<Scalars['BigInt']>;
  finalRuling_not_in?: Maybe<Array<Scalars['BigInt']>>;
  id?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_lt?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
  item?: Maybe<Scalars['String']>;
  item_?: Maybe<LItem_Filter>;
  item_contains?: Maybe<Scalars['String']>;
  item_contains_nocase?: Maybe<Scalars['String']>;
  item_ends_with?: Maybe<Scalars['String']>;
  item_ends_with_nocase?: Maybe<Scalars['String']>;
  item_gt?: Maybe<Scalars['String']>;
  item_gte?: Maybe<Scalars['String']>;
  item_in?: Maybe<Array<Scalars['String']>>;
  item_lt?: Maybe<Scalars['String']>;
  item_lte?: Maybe<Scalars['String']>;
  item_not?: Maybe<Scalars['String']>;
  item_not_contains?: Maybe<Scalars['String']>;
  item_not_contains_nocase?: Maybe<Scalars['String']>;
  item_not_ends_with?: Maybe<Scalars['String']>;
  item_not_ends_with_nocase?: Maybe<Scalars['String']>;
  item_not_in?: Maybe<Array<Scalars['String']>>;
  item_not_starts_with?: Maybe<Scalars['String']>;
  item_not_starts_with_nocase?: Maybe<Scalars['String']>;
  item_starts_with?: Maybe<Scalars['String']>;
  item_starts_with_nocase?: Maybe<Scalars['String']>;
  metaEvidence?: Maybe<Scalars['String']>;
  metaEvidence_?: Maybe<MetaEvidence_Filter>;
  metaEvidence_contains?: Maybe<Scalars['String']>;
  metaEvidence_contains_nocase?: Maybe<Scalars['String']>;
  metaEvidence_ends_with?: Maybe<Scalars['String']>;
  metaEvidence_ends_with_nocase?: Maybe<Scalars['String']>;
  metaEvidence_gt?: Maybe<Scalars['String']>;
  metaEvidence_gte?: Maybe<Scalars['String']>;
  metaEvidence_in?: Maybe<Array<Scalars['String']>>;
  metaEvidence_lt?: Maybe<Scalars['String']>;
  metaEvidence_lte?: Maybe<Scalars['String']>;
  metaEvidence_not?: Maybe<Scalars['String']>;
  metaEvidence_not_contains?: Maybe<Scalars['String']>;
  metaEvidence_not_contains_nocase?: Maybe<Scalars['String']>;
  metaEvidence_not_ends_with?: Maybe<Scalars['String']>;
  metaEvidence_not_ends_with_nocase?: Maybe<Scalars['String']>;
  metaEvidence_not_in?: Maybe<Array<Scalars['String']>>;
  metaEvidence_not_starts_with?: Maybe<Scalars['String']>;
  metaEvidence_not_starts_with_nocase?: Maybe<Scalars['String']>;
  metaEvidence_starts_with?: Maybe<Scalars['String']>;
  metaEvidence_starts_with_nocase?: Maybe<Scalars['String']>;
  numberOfRounds?: Maybe<Scalars['BigInt']>;
  numberOfRounds_gt?: Maybe<Scalars['BigInt']>;
  numberOfRounds_gte?: Maybe<Scalars['BigInt']>;
  numberOfRounds_in?: Maybe<Array<Scalars['BigInt']>>;
  numberOfRounds_lt?: Maybe<Scalars['BigInt']>;
  numberOfRounds_lte?: Maybe<Scalars['BigInt']>;
  numberOfRounds_not?: Maybe<Scalars['BigInt']>;
  numberOfRounds_not_in?: Maybe<Array<Scalars['BigInt']>>;
  or?: Maybe<Array<Maybe<LRequest_Filter>>>;
  registry?: Maybe<Scalars['String']>;
  registryAddress?: Maybe<Scalars['Bytes']>;
  registryAddress_contains?: Maybe<Scalars['Bytes']>;
  registryAddress_gt?: Maybe<Scalars['Bytes']>;
  registryAddress_gte?: Maybe<Scalars['Bytes']>;
  registryAddress_in?: Maybe<Array<Scalars['Bytes']>>;
  registryAddress_lt?: Maybe<Scalars['Bytes']>;
  registryAddress_lte?: Maybe<Scalars['Bytes']>;
  registryAddress_not?: Maybe<Scalars['Bytes']>;
  registryAddress_not_contains?: Maybe<Scalars['Bytes']>;
  registryAddress_not_in?: Maybe<Array<Scalars['Bytes']>>;
  registry_?: Maybe<LRegistry_Filter>;
  registry_contains?: Maybe<Scalars['String']>;
  registry_contains_nocase?: Maybe<Scalars['String']>;
  registry_ends_with?: Maybe<Scalars['String']>;
  registry_ends_with_nocase?: Maybe<Scalars['String']>;
  registry_gt?: Maybe<Scalars['String']>;
  registry_gte?: Maybe<Scalars['String']>;
  registry_in?: Maybe<Array<Scalars['String']>>;
  registry_lt?: Maybe<Scalars['String']>;
  registry_lte?: Maybe<Scalars['String']>;
  registry_not?: Maybe<Scalars['String']>;
  registry_not_contains?: Maybe<Scalars['String']>;
  registry_not_contains_nocase?: Maybe<Scalars['String']>;
  registry_not_ends_with?: Maybe<Scalars['String']>;
  registry_not_ends_with_nocase?: Maybe<Scalars['String']>;
  registry_not_in?: Maybe<Array<Scalars['String']>>;
  registry_not_starts_with?: Maybe<Scalars['String']>;
  registry_not_starts_with_nocase?: Maybe<Scalars['String']>;
  registry_starts_with?: Maybe<Scalars['String']>;
  registry_starts_with_nocase?: Maybe<Scalars['String']>;
  requestType?: Maybe<Status>;
  requestType_in?: Maybe<Array<Status>>;
  requestType_not?: Maybe<Status>;
  requestType_not_in?: Maybe<Array<Status>>;
  requester?: Maybe<Scalars['Bytes']>;
  requester_contains?: Maybe<Scalars['Bytes']>;
  requester_gt?: Maybe<Scalars['Bytes']>;
  requester_gte?: Maybe<Scalars['Bytes']>;
  requester_in?: Maybe<Array<Scalars['Bytes']>>;
  requester_lt?: Maybe<Scalars['Bytes']>;
  requester_lte?: Maybe<Scalars['Bytes']>;
  requester_not?: Maybe<Scalars['Bytes']>;
  requester_not_contains?: Maybe<Scalars['Bytes']>;
  requester_not_in?: Maybe<Array<Scalars['Bytes']>>;
  resolutionTime?: Maybe<Scalars['BigInt']>;
  resolutionTime_gt?: Maybe<Scalars['BigInt']>;
  resolutionTime_gte?: Maybe<Scalars['BigInt']>;
  resolutionTime_in?: Maybe<Array<Scalars['BigInt']>>;
  resolutionTime_lt?: Maybe<Scalars['BigInt']>;
  resolutionTime_lte?: Maybe<Scalars['BigInt']>;
  resolutionTime_not?: Maybe<Scalars['BigInt']>;
  resolutionTime_not_in?: Maybe<Array<Scalars['BigInt']>>;
  resolutionTx?: Maybe<Scalars['Bytes']>;
  resolutionTx_contains?: Maybe<Scalars['Bytes']>;
  resolutionTx_gt?: Maybe<Scalars['Bytes']>;
  resolutionTx_gte?: Maybe<Scalars['Bytes']>;
  resolutionTx_in?: Maybe<Array<Scalars['Bytes']>>;
  resolutionTx_lt?: Maybe<Scalars['Bytes']>;
  resolutionTx_lte?: Maybe<Scalars['Bytes']>;
  resolutionTx_not?: Maybe<Scalars['Bytes']>;
  resolutionTx_not_contains?: Maybe<Scalars['Bytes']>;
  resolutionTx_not_in?: Maybe<Array<Scalars['Bytes']>>;
  resolved?: Maybe<Scalars['Boolean']>;
  resolved_in?: Maybe<Array<Scalars['Boolean']>>;
  resolved_not?: Maybe<Scalars['Boolean']>;
  resolved_not_in?: Maybe<Array<Scalars['Boolean']>>;
  rounds_?: Maybe<LRound_Filter>;
  submissionTime?: Maybe<Scalars['BigInt']>;
  submissionTime_gt?: Maybe<Scalars['BigInt']>;
  submissionTime_gte?: Maybe<Scalars['BigInt']>;
  submissionTime_in?: Maybe<Array<Scalars['BigInt']>>;
  submissionTime_lt?: Maybe<Scalars['BigInt']>;
  submissionTime_lte?: Maybe<Scalars['BigInt']>;
  submissionTime_not?: Maybe<Scalars['BigInt']>;
  submissionTime_not_in?: Maybe<Array<Scalars['BigInt']>>;
};

export enum LRequest_OrderBy {
  Arbitrator = 'arbitrator',
  ArbitratorExtraData = 'arbitratorExtraData',
  Challenger = 'challenger',
  CreationTx = 'creationTx',
  Deposit = 'deposit',
  DisputeId = 'disputeID',
  DisputeOutcome = 'disputeOutcome',
  Disputed = 'disputed',
  EvidenceGroup = 'evidenceGroup',
  EvidenceGroupId = 'evidenceGroup__id',
  EvidenceGroupNumberOfEvidence = 'evidenceGroup__numberOfEvidence',
  FinalRuling = 'finalRuling',
  Id = 'id',
  Item = 'item',
  ItemData = 'item__data',
  ItemDisputed = 'item__disputed',
  ItemId = 'item__id',
  ItemItemId = 'item__itemID',
  ItemLatestChallenger = 'item__latestChallenger',
  ItemLatestRequestResolutionTime = 'item__latestRequestResolutionTime',
  ItemLatestRequestSubmissionTime = 'item__latestRequestSubmissionTime',
  ItemLatestRequester = 'item__latestRequester',
  ItemNumberOfRequests = 'item__numberOfRequests',
  ItemRegistryAddress = 'item__registryAddress',
  ItemStatus = 'item__status',
  MetaEvidence = 'metaEvidence',
  MetaEvidenceUri = 'metaEvidence__URI',
  MetaEvidenceId = 'metaEvidence__id',
  NumberOfRounds = 'numberOfRounds',
  Registry = 'registry',
  RegistryAddress = 'registryAddress',
  RegistryConnectedTcr = 'registry__connectedTCR',
  RegistryId = 'registry__id',
  RegistryMetaEvidenceCount = 'registry__metaEvidenceCount',
  RegistryNumberOfAbsent = 'registry__numberOfAbsent',
  RegistryNumberOfChallengedClearing = 'registry__numberOfChallengedClearing',
  RegistryNumberOfChallengedRegistrations = 'registry__numberOfChallengedRegistrations',
  RegistryNumberOfClearingRequested = 'registry__numberOfClearingRequested',
  RegistryNumberOfRegistered = 'registry__numberOfRegistered',
  RegistryNumberOfRegistrationRequested = 'registry__numberOfRegistrationRequested',
  RequestType = 'requestType',
  Requester = 'requester',
  ResolutionTime = 'resolutionTime',
  ResolutionTx = 'resolutionTx',
  Resolved = 'resolved',
  Rounds = 'rounds',
  SubmissionTime = 'submissionTime'
}

export type LRound = {
  __typename?: 'LRound';
  /** The total amount of appeal fees contributed to the challenger in this round. */
  amountPaidChallenger: Scalars['BigInt'];
  /** The total amount of appeal fees contributed to the requester in this round. */
  amountPaidRequester: Scalars['BigInt'];
  /** The time the appeal period ends, if in the appeal period. */
  appealPeriodEnd: Scalars['BigInt'];
  /** The time the appeal period starts, if in the appeal period. */
  appealPeriodStart: Scalars['BigInt'];
  /** Whether this round was appealed. */
  appealed: Scalars['Boolean'];
  /** When this round was appealed, if it was appealed */
  appealedAt?: Maybe<Scalars['BigInt']>;
  /** The contributions made to this round. */
  contributions: Array<LContribution>;
  /** The moment the round was created. */
  creationTime: Scalars['BigInt'];
  /** Sum of reimbursable fees and stake rewards available to the parties that made contributions to the side that ultimately wins a dispute. */
  feeRewards: Scalars['BigInt'];
  /** Whether the challenger is fully funded. */
  hasPaidChallenger: Scalars['Boolean'];
  /** Whether the requester is fully funded. */
  hasPaidRequester: Scalars['Boolean'];
  id: Scalars['ID'];
  /** When was the last contribution for challenger (hack for curate bot) */
  lastFundedChallenger: Scalars['BigInt'];
  /** When was the last contribution for requester (hack for curate bot) */
  lastFundedRequester: Scalars['BigInt'];
  /** The number of contributions made to this round */
  numberOfContributions: Scalars['BigInt'];
  /** The request to which this round belongs. */
  request: LRequest;
  /** The ruling given by the arbitrator. */
  ruling: Ruling;
  /** The time the round received the ruling. */
  rulingTime: Scalars['BigInt'];
  /** The tx hash of the moment the round was appealed */
  txHashAppealDecision?: Maybe<Scalars['Bytes']>;
  /** The tx hash of the moment appealing became possible */
  txHashAppealPossible?: Maybe<Scalars['Bytes']>;
};


export type LRoundContributionsArgs = {
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<LContribution_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  skip?: Maybe<Scalars['Int']>;
  where?: Maybe<LContribution_Filter>;
};

export type LRound_Filter = {
  /** Filter for the block changed event. */
  _change_block?: Maybe<BlockChangedFilter>;
  amountPaidChallenger?: Maybe<Scalars['BigInt']>;
  amountPaidChallenger_gt?: Maybe<Scalars['BigInt']>;
  amountPaidChallenger_gte?: Maybe<Scalars['BigInt']>;
  amountPaidChallenger_in?: Maybe<Array<Scalars['BigInt']>>;
  amountPaidChallenger_lt?: Maybe<Scalars['BigInt']>;
  amountPaidChallenger_lte?: Maybe<Scalars['BigInt']>;
  amountPaidChallenger_not?: Maybe<Scalars['BigInt']>;
  amountPaidChallenger_not_in?: Maybe<Array<Scalars['BigInt']>>;
  amountPaidRequester?: Maybe<Scalars['BigInt']>;
  amountPaidRequester_gt?: Maybe<Scalars['BigInt']>;
  amountPaidRequester_gte?: Maybe<Scalars['BigInt']>;
  amountPaidRequester_in?: Maybe<Array<Scalars['BigInt']>>;
  amountPaidRequester_lt?: Maybe<Scalars['BigInt']>;
  amountPaidRequester_lte?: Maybe<Scalars['BigInt']>;
  amountPaidRequester_not?: Maybe<Scalars['BigInt']>;
  amountPaidRequester_not_in?: Maybe<Array<Scalars['BigInt']>>;
  and?: Maybe<Array<Maybe<LRound_Filter>>>;
  appealPeriodEnd?: Maybe<Scalars['BigInt']>;
  appealPeriodEnd_gt?: Maybe<Scalars['BigInt']>;
  appealPeriodEnd_gte?: Maybe<Scalars['BigInt']>;
  appealPeriodEnd_in?: Maybe<Array<Scalars['BigInt']>>;
  appealPeriodEnd_lt?: Maybe<Scalars['BigInt']>;
  appealPeriodEnd_lte?: Maybe<Scalars['BigInt']>;
  appealPeriodEnd_not?: Maybe<Scalars['BigInt']>;
  appealPeriodEnd_not_in?: Maybe<Array<Scalars['BigInt']>>;
  appealPeriodStart?: Maybe<Scalars['BigInt']>;
  appealPeriodStart_gt?: Maybe<Scalars['BigInt']>;
  appealPeriodStart_gte?: Maybe<Scalars['BigInt']>;
  appealPeriodStart_in?: Maybe<Array<Scalars['BigInt']>>;
  appealPeriodStart_lt?: Maybe<Scalars['BigInt']>;
  appealPeriodStart_lte?: Maybe<Scalars['BigInt']>;
  appealPeriodStart_not?: Maybe<Scalars['BigInt']>;
  appealPeriodStart_not_in?: Maybe<Array<Scalars['BigInt']>>;
  appealed?: Maybe<Scalars['Boolean']>;
  appealedAt?: Maybe<Scalars['BigInt']>;
  appealedAt_gt?: Maybe<Scalars['BigInt']>;
  appealedAt_gte?: Maybe<Scalars['BigInt']>;
  appealedAt_in?: Maybe<Array<Scalars['BigInt']>>;
  appealedAt_lt?: Maybe<Scalars['BigInt']>;
  appealedAt_lte?: Maybe<Scalars['BigInt']>;
  appealedAt_not?: Maybe<Scalars['BigInt']>;
  appealedAt_not_in?: Maybe<Array<Scalars['BigInt']>>;
  appealed_in?: Maybe<Array<Scalars['Boolean']>>;
  appealed_not?: Maybe<Scalars['Boolean']>;
  appealed_not_in?: Maybe<Array<Scalars['Boolean']>>;
  contributions_?: Maybe<LContribution_Filter>;
  creationTime?: Maybe<Scalars['BigInt']>;
  creationTime_gt?: Maybe<Scalars['BigInt']>;
  creationTime_gte?: Maybe<Scalars['BigInt']>;
  creationTime_in?: Maybe<Array<Scalars['BigInt']>>;
  creationTime_lt?: Maybe<Scalars['BigInt']>;
  creationTime_lte?: Maybe<Scalars['BigInt']>;
  creationTime_not?: Maybe<Scalars['BigInt']>;
  creationTime_not_in?: Maybe<Array<Scalars['BigInt']>>;
  feeRewards?: Maybe<Scalars['BigInt']>;
  feeRewards_gt?: Maybe<Scalars['BigInt']>;
  feeRewards_gte?: Maybe<Scalars['BigInt']>;
  feeRewards_in?: Maybe<Array<Scalars['BigInt']>>;
  feeRewards_lt?: Maybe<Scalars['BigInt']>;
  feeRewards_lte?: Maybe<Scalars['BigInt']>;
  feeRewards_not?: Maybe<Scalars['BigInt']>;
  feeRewards_not_in?: Maybe<Array<Scalars['BigInt']>>;
  hasPaidChallenger?: Maybe<Scalars['Boolean']>;
  hasPaidChallenger_in?: Maybe<Array<Scalars['Boolean']>>;
  hasPaidChallenger_not?: Maybe<Scalars['Boolean']>;
  hasPaidChallenger_not_in?: Maybe<Array<Scalars['Boolean']>>;
  hasPaidRequester?: Maybe<Scalars['Boolean']>;
  hasPaidRequester_in?: Maybe<Array<Scalars['Boolean']>>;
  hasPaidRequester_not?: Maybe<Scalars['Boolean']>;
  hasPaidRequester_not_in?: Maybe<Array<Scalars['Boolean']>>;
  id?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_lt?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
  lastFundedChallenger?: Maybe<Scalars['BigInt']>;
  lastFundedChallenger_gt?: Maybe<Scalars['BigInt']>;
  lastFundedChallenger_gte?: Maybe<Scalars['BigInt']>;
  lastFundedChallenger_in?: Maybe<Array<Scalars['BigInt']>>;
  lastFundedChallenger_lt?: Maybe<Scalars['BigInt']>;
  lastFundedChallenger_lte?: Maybe<Scalars['BigInt']>;
  lastFundedChallenger_not?: Maybe<Scalars['BigInt']>;
  lastFundedChallenger_not_in?: Maybe<Array<Scalars['BigInt']>>;
  lastFundedRequester?: Maybe<Scalars['BigInt']>;
  lastFundedRequester_gt?: Maybe<Scalars['BigInt']>;
  lastFundedRequester_gte?: Maybe<Scalars['BigInt']>;
  lastFundedRequester_in?: Maybe<Array<Scalars['BigInt']>>;
  lastFundedRequester_lt?: Maybe<Scalars['BigInt']>;
  lastFundedRequester_lte?: Maybe<Scalars['BigInt']>;
  lastFundedRequester_not?: Maybe<Scalars['BigInt']>;
  lastFundedRequester_not_in?: Maybe<Array<Scalars['BigInt']>>;
  numberOfContributions?: Maybe<Scalars['BigInt']>;
  numberOfContributions_gt?: Maybe<Scalars['BigInt']>;
  numberOfContributions_gte?: Maybe<Scalars['BigInt']>;
  numberOfContributions_in?: Maybe<Array<Scalars['BigInt']>>;
  numberOfContributions_lt?: Maybe<Scalars['BigInt']>;
  numberOfContributions_lte?: Maybe<Scalars['BigInt']>;
  numberOfContributions_not?: Maybe<Scalars['BigInt']>;
  numberOfContributions_not_in?: Maybe<Array<Scalars['BigInt']>>;
  or?: Maybe<Array<Maybe<LRound_Filter>>>;
  request?: Maybe<Scalars['String']>;
  request_?: Maybe<LRequest_Filter>;
  request_contains?: Maybe<Scalars['String']>;
  request_contains_nocase?: Maybe<Scalars['String']>;
  request_ends_with?: Maybe<Scalars['String']>;
  request_ends_with_nocase?: Maybe<Scalars['String']>;
  request_gt?: Maybe<Scalars['String']>;
  request_gte?: Maybe<Scalars['String']>;
  request_in?: Maybe<Array<Scalars['String']>>;
  request_lt?: Maybe<Scalars['String']>;
  request_lte?: Maybe<Scalars['String']>;
  request_not?: Maybe<Scalars['String']>;
  request_not_contains?: Maybe<Scalars['String']>;
  request_not_contains_nocase?: Maybe<Scalars['String']>;
  request_not_ends_with?: Maybe<Scalars['String']>;
  request_not_ends_with_nocase?: Maybe<Scalars['String']>;
  request_not_in?: Maybe<Array<Scalars['String']>>;
  request_not_starts_with?: Maybe<Scalars['String']>;
  request_not_starts_with_nocase?: Maybe<Scalars['String']>;
  request_starts_with?: Maybe<Scalars['String']>;
  request_starts_with_nocase?: Maybe<Scalars['String']>;
  ruling?: Maybe<Ruling>;
  rulingTime?: Maybe<Scalars['BigInt']>;
  rulingTime_gt?: Maybe<Scalars['BigInt']>;
  rulingTime_gte?: Maybe<Scalars['BigInt']>;
  rulingTime_in?: Maybe<Array<Scalars['BigInt']>>;
  rulingTime_lt?: Maybe<Scalars['BigInt']>;
  rulingTime_lte?: Maybe<Scalars['BigInt']>;
  rulingTime_not?: Maybe<Scalars['BigInt']>;
  rulingTime_not_in?: Maybe<Array<Scalars['BigInt']>>;
  ruling_in?: Maybe<Array<Ruling>>;
  ruling_not?: Maybe<Ruling>;
  ruling_not_in?: Maybe<Array<Ruling>>;
  txHashAppealDecision?: Maybe<Scalars['Bytes']>;
  txHashAppealDecision_contains?: Maybe<Scalars['Bytes']>;
  txHashAppealDecision_gt?: Maybe<Scalars['Bytes']>;
  txHashAppealDecision_gte?: Maybe<Scalars['Bytes']>;
  txHashAppealDecision_in?: Maybe<Array<Scalars['Bytes']>>;
  txHashAppealDecision_lt?: Maybe<Scalars['Bytes']>;
  txHashAppealDecision_lte?: Maybe<Scalars['Bytes']>;
  txHashAppealDecision_not?: Maybe<Scalars['Bytes']>;
  txHashAppealDecision_not_contains?: Maybe<Scalars['Bytes']>;
  txHashAppealDecision_not_in?: Maybe<Array<Scalars['Bytes']>>;
  txHashAppealPossible?: Maybe<Scalars['Bytes']>;
  txHashAppealPossible_contains?: Maybe<Scalars['Bytes']>;
  txHashAppealPossible_gt?: Maybe<Scalars['Bytes']>;
  txHashAppealPossible_gte?: Maybe<Scalars['Bytes']>;
  txHashAppealPossible_in?: Maybe<Array<Scalars['Bytes']>>;
  txHashAppealPossible_lt?: Maybe<Scalars['Bytes']>;
  txHashAppealPossible_lte?: Maybe<Scalars['Bytes']>;
  txHashAppealPossible_not?: Maybe<Scalars['Bytes']>;
  txHashAppealPossible_not_contains?: Maybe<Scalars['Bytes']>;
  txHashAppealPossible_not_in?: Maybe<Array<Scalars['Bytes']>>;
};

export enum LRound_OrderBy {
  AmountPaidChallenger = 'amountPaidChallenger',
  AmountPaidRequester = 'amountPaidRequester',
  AppealPeriodEnd = 'appealPeriodEnd',
  AppealPeriodStart = 'appealPeriodStart',
  Appealed = 'appealed',
  AppealedAt = 'appealedAt',
  Contributions = 'contributions',
  CreationTime = 'creationTime',
  FeeRewards = 'feeRewards',
  HasPaidChallenger = 'hasPaidChallenger',
  HasPaidRequester = 'hasPaidRequester',
  Id = 'id',
  LastFundedChallenger = 'lastFundedChallenger',
  LastFundedRequester = 'lastFundedRequester',
  NumberOfContributions = 'numberOfContributions',
  Request = 'request',
  RequestArbitrator = 'request__arbitrator',
  RequestArbitratorExtraData = 'request__arbitratorExtraData',
  RequestChallenger = 'request__challenger',
  RequestCreationTx = 'request__creationTx',
  RequestDeposit = 'request__deposit',
  RequestDisputeId = 'request__disputeID',
  RequestDisputeOutcome = 'request__disputeOutcome',
  RequestDisputed = 'request__disputed',
  RequestFinalRuling = 'request__finalRuling',
  RequestId = 'request__id',
  RequestNumberOfRounds = 'request__numberOfRounds',
  RequestRegistryAddress = 'request__registryAddress',
  RequestRequestType = 'request__requestType',
  RequestRequester = 'request__requester',
  RequestResolutionTime = 'request__resolutionTime',
  RequestResolutionTx = 'request__resolutionTx',
  RequestResolved = 'request__resolved',
  RequestSubmissionTime = 'request__submissionTime',
  Ruling = 'ruling',
  RulingTime = 'rulingTime',
  TxHashAppealDecision = 'txHashAppealDecision',
  TxHashAppealPossible = 'txHashAppealPossible'
}

export type LimitFarming = {
  __typename?: 'LimitFarming';
  bonusReward: Scalars['BigInt'];
  bonusRewardToken: Scalars['Bytes'];
  createdAtTimestamp: Scalars['BigInt'];
  endTime: Scalars['BigInt'];
  enterStartTime: Scalars['BigInt'];
  id: Scalars['ID'];
  isDetached?: Maybe<Scalars['Boolean']>;
  minRangeLength: Scalars['BigInt'];
  multiplierToken: Scalars['Bytes'];
  pool: Scalars['Bytes'];
  reward: Scalars['BigInt'];
  rewardToken: Scalars['Bytes'];
  startTime: Scalars['BigInt'];
  tier1Multiplier: Scalars['BigInt'];
  tier2Multiplier: Scalars['BigInt'];
  tier3Multiplier: Scalars['BigInt'];
  tokenAmountForTier1: Scalars['BigInt'];
  tokenAmountForTier2: Scalars['BigInt'];
  tokenAmountForTier3: Scalars['BigInt'];
};

export type LimitFarming_Filter = {
  /** Filter for the block changed event. */
  _change_block?: Maybe<BlockChangedFilter>;
  and?: Maybe<Array<Maybe<LimitFarming_Filter>>>;
  bonusReward?: Maybe<Scalars['BigInt']>;
  bonusRewardToken?: Maybe<Scalars['Bytes']>;
  bonusRewardToken_contains?: Maybe<Scalars['Bytes']>;
  bonusRewardToken_gt?: Maybe<Scalars['Bytes']>;
  bonusRewardToken_gte?: Maybe<Scalars['Bytes']>;
  bonusRewardToken_in?: Maybe<Array<Scalars['Bytes']>>;
  bonusRewardToken_lt?: Maybe<Scalars['Bytes']>;
  bonusRewardToken_lte?: Maybe<Scalars['Bytes']>;
  bonusRewardToken_not?: Maybe<Scalars['Bytes']>;
  bonusRewardToken_not_contains?: Maybe<Scalars['Bytes']>;
  bonusRewardToken_not_in?: Maybe<Array<Scalars['Bytes']>>;
  bonusReward_gt?: Maybe<Scalars['BigInt']>;
  bonusReward_gte?: Maybe<Scalars['BigInt']>;
  bonusReward_in?: Maybe<Array<Scalars['BigInt']>>;
  bonusReward_lt?: Maybe<Scalars['BigInt']>;
  bonusReward_lte?: Maybe<Scalars['BigInt']>;
  bonusReward_not?: Maybe<Scalars['BigInt']>;
  bonusReward_not_in?: Maybe<Array<Scalars['BigInt']>>;
  createdAtTimestamp?: Maybe<Scalars['BigInt']>;
  createdAtTimestamp_gt?: Maybe<Scalars['BigInt']>;
  createdAtTimestamp_gte?: Maybe<Scalars['BigInt']>;
  createdAtTimestamp_in?: Maybe<Array<Scalars['BigInt']>>;
  createdAtTimestamp_lt?: Maybe<Scalars['BigInt']>;
  createdAtTimestamp_lte?: Maybe<Scalars['BigInt']>;
  createdAtTimestamp_not?: Maybe<Scalars['BigInt']>;
  createdAtTimestamp_not_in?: Maybe<Array<Scalars['BigInt']>>;
  endTime?: Maybe<Scalars['BigInt']>;
  endTime_gt?: Maybe<Scalars['BigInt']>;
  endTime_gte?: Maybe<Scalars['BigInt']>;
  endTime_in?: Maybe<Array<Scalars['BigInt']>>;
  endTime_lt?: Maybe<Scalars['BigInt']>;
  endTime_lte?: Maybe<Scalars['BigInt']>;
  endTime_not?: Maybe<Scalars['BigInt']>;
  endTime_not_in?: Maybe<Array<Scalars['BigInt']>>;
  enterStartTime?: Maybe<Scalars['BigInt']>;
  enterStartTime_gt?: Maybe<Scalars['BigInt']>;
  enterStartTime_gte?: Maybe<Scalars['BigInt']>;
  enterStartTime_in?: Maybe<Array<Scalars['BigInt']>>;
  enterStartTime_lt?: Maybe<Scalars['BigInt']>;
  enterStartTime_lte?: Maybe<Scalars['BigInt']>;
  enterStartTime_not?: Maybe<Scalars['BigInt']>;
  enterStartTime_not_in?: Maybe<Array<Scalars['BigInt']>>;
  id?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_lt?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
  isDetached?: Maybe<Scalars['Boolean']>;
  isDetached_in?: Maybe<Array<Scalars['Boolean']>>;
  isDetached_not?: Maybe<Scalars['Boolean']>;
  isDetached_not_in?: Maybe<Array<Scalars['Boolean']>>;
  minRangeLength?: Maybe<Scalars['BigInt']>;
  minRangeLength_gt?: Maybe<Scalars['BigInt']>;
  minRangeLength_gte?: Maybe<Scalars['BigInt']>;
  minRangeLength_in?: Maybe<Array<Scalars['BigInt']>>;
  minRangeLength_lt?: Maybe<Scalars['BigInt']>;
  minRangeLength_lte?: Maybe<Scalars['BigInt']>;
  minRangeLength_not?: Maybe<Scalars['BigInt']>;
  minRangeLength_not_in?: Maybe<Array<Scalars['BigInt']>>;
  multiplierToken?: Maybe<Scalars['Bytes']>;
  multiplierToken_contains?: Maybe<Scalars['Bytes']>;
  multiplierToken_gt?: Maybe<Scalars['Bytes']>;
  multiplierToken_gte?: Maybe<Scalars['Bytes']>;
  multiplierToken_in?: Maybe<Array<Scalars['Bytes']>>;
  multiplierToken_lt?: Maybe<Scalars['Bytes']>;
  multiplierToken_lte?: Maybe<Scalars['Bytes']>;
  multiplierToken_not?: Maybe<Scalars['Bytes']>;
  multiplierToken_not_contains?: Maybe<Scalars['Bytes']>;
  multiplierToken_not_in?: Maybe<Array<Scalars['Bytes']>>;
  or?: Maybe<Array<Maybe<LimitFarming_Filter>>>;
  pool?: Maybe<Scalars['Bytes']>;
  pool_contains?: Maybe<Scalars['Bytes']>;
  pool_gt?: Maybe<Scalars['Bytes']>;
  pool_gte?: Maybe<Scalars['Bytes']>;
  pool_in?: Maybe<Array<Scalars['Bytes']>>;
  pool_lt?: Maybe<Scalars['Bytes']>;
  pool_lte?: Maybe<Scalars['Bytes']>;
  pool_not?: Maybe<Scalars['Bytes']>;
  pool_not_contains?: Maybe<Scalars['Bytes']>;
  pool_not_in?: Maybe<Array<Scalars['Bytes']>>;
  reward?: Maybe<Scalars['BigInt']>;
  rewardToken?: Maybe<Scalars['Bytes']>;
  rewardToken_contains?: Maybe<Scalars['Bytes']>;
  rewardToken_gt?: Maybe<Scalars['Bytes']>;
  rewardToken_gte?: Maybe<Scalars['Bytes']>;
  rewardToken_in?: Maybe<Array<Scalars['Bytes']>>;
  rewardToken_lt?: Maybe<Scalars['Bytes']>;
  rewardToken_lte?: Maybe<Scalars['Bytes']>;
  rewardToken_not?: Maybe<Scalars['Bytes']>;
  rewardToken_not_contains?: Maybe<Scalars['Bytes']>;
  rewardToken_not_in?: Maybe<Array<Scalars['Bytes']>>;
  reward_gt?: Maybe<Scalars['BigInt']>;
  reward_gte?: Maybe<Scalars['BigInt']>;
  reward_in?: Maybe<Array<Scalars['BigInt']>>;
  reward_lt?: Maybe<Scalars['BigInt']>;
  reward_lte?: Maybe<Scalars['BigInt']>;
  reward_not?: Maybe<Scalars['BigInt']>;
  reward_not_in?: Maybe<Array<Scalars['BigInt']>>;
  startTime?: Maybe<Scalars['BigInt']>;
  startTime_gt?: Maybe<Scalars['BigInt']>;
  startTime_gte?: Maybe<Scalars['BigInt']>;
  startTime_in?: Maybe<Array<Scalars['BigInt']>>;
  startTime_lt?: Maybe<Scalars['BigInt']>;
  startTime_lte?: Maybe<Scalars['BigInt']>;
  startTime_not?: Maybe<Scalars['BigInt']>;
  startTime_not_in?: Maybe<Array<Scalars['BigInt']>>;
  tier1Multiplier?: Maybe<Scalars['BigInt']>;
  tier1Multiplier_gt?: Maybe<Scalars['BigInt']>;
  tier1Multiplier_gte?: Maybe<Scalars['BigInt']>;
  tier1Multiplier_in?: Maybe<Array<Scalars['BigInt']>>;
  tier1Multiplier_lt?: Maybe<Scalars['BigInt']>;
  tier1Multiplier_lte?: Maybe<Scalars['BigInt']>;
  tier1Multiplier_not?: Maybe<Scalars['BigInt']>;
  tier1Multiplier_not_in?: Maybe<Array<Scalars['BigInt']>>;
  tier2Multiplier?: Maybe<Scalars['BigInt']>;
  tier2Multiplier_gt?: Maybe<Scalars['BigInt']>;
  tier2Multiplier_gte?: Maybe<Scalars['BigInt']>;
  tier2Multiplier_in?: Maybe<Array<Scalars['BigInt']>>;
  tier2Multiplier_lt?: Maybe<Scalars['BigInt']>;
  tier2Multiplier_lte?: Maybe<Scalars['BigInt']>;
  tier2Multiplier_not?: Maybe<Scalars['BigInt']>;
  tier2Multiplier_not_in?: Maybe<Array<Scalars['BigInt']>>;
  tier3Multiplier?: Maybe<Scalars['BigInt']>;
  tier3Multiplier_gt?: Maybe<Scalars['BigInt']>;
  tier3Multiplier_gte?: Maybe<Scalars['BigInt']>;
  tier3Multiplier_in?: Maybe<Array<Scalars['BigInt']>>;
  tier3Multiplier_lt?: Maybe<Scalars['BigInt']>;
  tier3Multiplier_lte?: Maybe<Scalars['BigInt']>;
  tier3Multiplier_not?: Maybe<Scalars['BigInt']>;
  tier3Multiplier_not_in?: Maybe<Array<Scalars['BigInt']>>;
  tokenAmountForTier1?: Maybe<Scalars['BigInt']>;
  tokenAmountForTier1_gt?: Maybe<Scalars['BigInt']>;
  tokenAmountForTier1_gte?: Maybe<Scalars['BigInt']>;
  tokenAmountForTier1_in?: Maybe<Array<Scalars['BigInt']>>;
  tokenAmountForTier1_lt?: Maybe<Scalars['BigInt']>;
  tokenAmountForTier1_lte?: Maybe<Scalars['BigInt']>;
  tokenAmountForTier1_not?: Maybe<Scalars['BigInt']>;
  tokenAmountForTier1_not_in?: Maybe<Array<Scalars['BigInt']>>;
  tokenAmountForTier2?: Maybe<Scalars['BigInt']>;
  tokenAmountForTier2_gt?: Maybe<Scalars['BigInt']>;
  tokenAmountForTier2_gte?: Maybe<Scalars['BigInt']>;
  tokenAmountForTier2_in?: Maybe<Array<Scalars['BigInt']>>;
  tokenAmountForTier2_lt?: Maybe<Scalars['BigInt']>;
  tokenAmountForTier2_lte?: Maybe<Scalars['BigInt']>;
  tokenAmountForTier2_not?: Maybe<Scalars['BigInt']>;
  tokenAmountForTier2_not_in?: Maybe<Array<Scalars['BigInt']>>;
  tokenAmountForTier3?: Maybe<Scalars['BigInt']>;
  tokenAmountForTier3_gt?: Maybe<Scalars['BigInt']>;
  tokenAmountForTier3_gte?: Maybe<Scalars['BigInt']>;
  tokenAmountForTier3_in?: Maybe<Array<Scalars['BigInt']>>;
  tokenAmountForTier3_lt?: Maybe<Scalars['BigInt']>;
  tokenAmountForTier3_lte?: Maybe<Scalars['BigInt']>;
  tokenAmountForTier3_not?: Maybe<Scalars['BigInt']>;
  tokenAmountForTier3_not_in?: Maybe<Array<Scalars['BigInt']>>;
};

export enum LimitFarming_OrderBy {
  BonusReward = 'bonusReward',
  BonusRewardToken = 'bonusRewardToken',
  CreatedAtTimestamp = 'createdAtTimestamp',
  EndTime = 'endTime',
  EnterStartTime = 'enterStartTime',
  Id = 'id',
  IsDetached = 'isDetached',
  MinRangeLength = 'minRangeLength',
  MultiplierToken = 'multiplierToken',
  Pool = 'pool',
  Reward = 'reward',
  RewardToken = 'rewardToken',
  StartTime = 'startTime',
  Tier1Multiplier = 'tier1Multiplier',
  Tier2Multiplier = 'tier2Multiplier',
  Tier3Multiplier = 'tier3Multiplier',
  TokenAmountForTier1 = 'tokenAmountForTier1',
  TokenAmountForTier2 = 'tokenAmountForTier2',
  TokenAmountForTier3 = 'tokenAmountForTier3'
}

export type Market = {
  __typename?: 'Market';
  blockNumber: Scalars['BigInt'];
  blockTimestamp: Scalars['BigInt'];
  childMarkets: Array<Market>;
  /**  collateral token for Generic markets. It's either the MarketFactory's collateralToken or the parentMarket corresponding wrapped token  */
  collateralToken: Token;
  /**  collateral token 1 for Futarchy markets  */
  collateralToken1: Token;
  /**  collateral token 2 for Futarchy markets  */
  collateralToken2: Token;
  conditionId: Scalars['Bytes'];
  creator: Scalars['Bytes'];
  ctfCondition: Condition;
  deposits0: Array<Deposit>;
  deposits1: Array<Deposit>;
  encodedQuestions: Array<Scalars['String']>;
  factory: Scalars['Bytes'];
  /**  finalizeTs is equal to 33260976000 (random big number) if there is any unanswered question, otherwise it contains the finalizeTs value of the lattest question. This allows us to filter multi scalar markets using `finalizeTs > now` for markets with pending answers, and `finalizeTs < now` for markets with pending execution  */
  finalizeTs: Scalars['BigInt'];
  hasAnswers: Scalars['Boolean'];
  id: Scalars['ID'];
  image: Array<Image>;
  index: Scalars['BigInt'];
  lowerBound: Scalars['BigInt'];
  marketName: Scalars['String'];
  openingTs: Scalars['BigInt'];
  outcomes: Array<Scalars['String']>;
  outcomesSupply: Scalars['BigInt'];
  parentCollectionId: Scalars['Bytes'];
  parentMarket?: Maybe<Market>;
  parentOutcome: Scalars['BigInt'];
  payoutNumerators: Array<Scalars['BigInt']>;
  payoutReported: Scalars['Boolean'];
  questionId: Scalars['Bytes'];
  questions: Array<MarketQuestion>;
  questionsInArbitration: Scalars['BigInt'];
  templateId: Scalars['BigInt'];
  tokens: Array<Token>;
  totalValueLockedUSD: Scalars['BigDecimal'];
  totalValueLockedUSDUntracked: Scalars['BigDecimal'];
  transactionHash: Scalars['Bytes'];
  type: MarketType;
  untrackedVolumeUSD: Scalars['BigDecimal'];
  upperBound: Scalars['BigInt'];
  volume: Scalars['BigDecimal'];
  volumeUSD: Scalars['BigDecimal'];
  wrappedTokens: Array<Token>;
  wrappedTokensString: Array<Scalars['String']>;
};


export type MarketChildMarketsArgs = {
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Market_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  skip?: Maybe<Scalars['Int']>;
  where?: Maybe<Market_Filter>;
};


export type MarketDeposits0Args = {
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Deposit_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  skip?: Maybe<Scalars['Int']>;
  where?: Maybe<Deposit_Filter>;
};


export type MarketDeposits1Args = {
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Deposit_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  skip?: Maybe<Scalars['Int']>;
  where?: Maybe<Deposit_Filter>;
};


export type MarketImageArgs = {
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Image_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  skip?: Maybe<Scalars['Int']>;
  where?: Maybe<Image_Filter>;
};


export type MarketQuestionsArgs = {
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<MarketQuestion_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  skip?: Maybe<Scalars['Int']>;
  where?: Maybe<MarketQuestion_Filter>;
};


export type MarketTokensArgs = {
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Token_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  skip?: Maybe<Scalars['Int']>;
  where?: Maybe<Token_Filter>;
};


export type MarketWrappedTokensArgs = {
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Token_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  skip?: Maybe<Scalars['Int']>;
  where?: Maybe<Token_Filter>;
};

export type MarketDayData = {
  __typename?: 'MarketDayData';
  date: Scalars['Int'];
  id: Scalars['ID'];
  market: Market;
  totalValueLockedUSD: Scalars['BigDecimal'];
  totalValueLockedUSDUntracked: Scalars['BigDecimal'];
  untrackedVolumeUSD: Scalars['BigDecimal'];
  volume: Scalars['BigDecimal'];
  volumeUSD: Scalars['BigDecimal'];
};

export type MarketDayData_Filter = {
  /** Filter for the block changed event. */
  _change_block?: Maybe<BlockChangedFilter>;
  and?: Maybe<Array<Maybe<MarketDayData_Filter>>>;
  date?: Maybe<Scalars['Int']>;
  date_gt?: Maybe<Scalars['Int']>;
  date_gte?: Maybe<Scalars['Int']>;
  date_in?: Maybe<Array<Scalars['Int']>>;
  date_lt?: Maybe<Scalars['Int']>;
  date_lte?: Maybe<Scalars['Int']>;
  date_not?: Maybe<Scalars['Int']>;
  date_not_in?: Maybe<Array<Scalars['Int']>>;
  id?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_lt?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
  market?: Maybe<Scalars['String']>;
  market_?: Maybe<Market_Filter>;
  market_contains?: Maybe<Scalars['String']>;
  market_contains_nocase?: Maybe<Scalars['String']>;
  market_ends_with?: Maybe<Scalars['String']>;
  market_ends_with_nocase?: Maybe<Scalars['String']>;
  market_gt?: Maybe<Scalars['String']>;
  market_gte?: Maybe<Scalars['String']>;
  market_in?: Maybe<Array<Scalars['String']>>;
  market_lt?: Maybe<Scalars['String']>;
  market_lte?: Maybe<Scalars['String']>;
  market_not?: Maybe<Scalars['String']>;
  market_not_contains?: Maybe<Scalars['String']>;
  market_not_contains_nocase?: Maybe<Scalars['String']>;
  market_not_ends_with?: Maybe<Scalars['String']>;
  market_not_ends_with_nocase?: Maybe<Scalars['String']>;
  market_not_in?: Maybe<Array<Scalars['String']>>;
  market_not_starts_with?: Maybe<Scalars['String']>;
  market_not_starts_with_nocase?: Maybe<Scalars['String']>;
  market_starts_with?: Maybe<Scalars['String']>;
  market_starts_with_nocase?: Maybe<Scalars['String']>;
  or?: Maybe<Array<Maybe<MarketDayData_Filter>>>;
  totalValueLockedUSD?: Maybe<Scalars['BigDecimal']>;
  totalValueLockedUSDUntracked?: Maybe<Scalars['BigDecimal']>;
  totalValueLockedUSDUntracked_gt?: Maybe<Scalars['BigDecimal']>;
  totalValueLockedUSDUntracked_gte?: Maybe<Scalars['BigDecimal']>;
  totalValueLockedUSDUntracked_in?: Maybe<Array<Scalars['BigDecimal']>>;
  totalValueLockedUSDUntracked_lt?: Maybe<Scalars['BigDecimal']>;
  totalValueLockedUSDUntracked_lte?: Maybe<Scalars['BigDecimal']>;
  totalValueLockedUSDUntracked_not?: Maybe<Scalars['BigDecimal']>;
  totalValueLockedUSDUntracked_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
  totalValueLockedUSD_gt?: Maybe<Scalars['BigDecimal']>;
  totalValueLockedUSD_gte?: Maybe<Scalars['BigDecimal']>;
  totalValueLockedUSD_in?: Maybe<Array<Scalars['BigDecimal']>>;
  totalValueLockedUSD_lt?: Maybe<Scalars['BigDecimal']>;
  totalValueLockedUSD_lte?: Maybe<Scalars['BigDecimal']>;
  totalValueLockedUSD_not?: Maybe<Scalars['BigDecimal']>;
  totalValueLockedUSD_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
  untrackedVolumeUSD?: Maybe<Scalars['BigDecimal']>;
  untrackedVolumeUSD_gt?: Maybe<Scalars['BigDecimal']>;
  untrackedVolumeUSD_gte?: Maybe<Scalars['BigDecimal']>;
  untrackedVolumeUSD_in?: Maybe<Array<Scalars['BigDecimal']>>;
  untrackedVolumeUSD_lt?: Maybe<Scalars['BigDecimal']>;
  untrackedVolumeUSD_lte?: Maybe<Scalars['BigDecimal']>;
  untrackedVolumeUSD_not?: Maybe<Scalars['BigDecimal']>;
  untrackedVolumeUSD_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
  volume?: Maybe<Scalars['BigDecimal']>;
  volumeUSD?: Maybe<Scalars['BigDecimal']>;
  volumeUSD_gt?: Maybe<Scalars['BigDecimal']>;
  volumeUSD_gte?: Maybe<Scalars['BigDecimal']>;
  volumeUSD_in?: Maybe<Array<Scalars['BigDecimal']>>;
  volumeUSD_lt?: Maybe<Scalars['BigDecimal']>;
  volumeUSD_lte?: Maybe<Scalars['BigDecimal']>;
  volumeUSD_not?: Maybe<Scalars['BigDecimal']>;
  volumeUSD_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
  volume_gt?: Maybe<Scalars['BigDecimal']>;
  volume_gte?: Maybe<Scalars['BigDecimal']>;
  volume_in?: Maybe<Array<Scalars['BigDecimal']>>;
  volume_lt?: Maybe<Scalars['BigDecimal']>;
  volume_lte?: Maybe<Scalars['BigDecimal']>;
  volume_not?: Maybe<Scalars['BigDecimal']>;
  volume_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
};

export enum MarketDayData_OrderBy {
  Date = 'date',
  Id = 'id',
  Market = 'market',
  MarketBlockNumber = 'market__blockNumber',
  MarketBlockTimestamp = 'market__blockTimestamp',
  MarketConditionId = 'market__conditionId',
  MarketCreator = 'market__creator',
  MarketFactory = 'market__factory',
  MarketFinalizeTs = 'market__finalizeTs',
  MarketHasAnswers = 'market__hasAnswers',
  MarketId = 'market__id',
  MarketIndex = 'market__index',
  MarketLowerBound = 'market__lowerBound',
  MarketMarketName = 'market__marketName',
  MarketOpeningTs = 'market__openingTs',
  MarketOutcomesSupply = 'market__outcomesSupply',
  MarketParentCollectionId = 'market__parentCollectionId',
  MarketParentOutcome = 'market__parentOutcome',
  MarketPayoutReported = 'market__payoutReported',
  MarketQuestionId = 'market__questionId',
  MarketQuestionsInArbitration = 'market__questionsInArbitration',
  MarketTemplateId = 'market__templateId',
  MarketTotalValueLockedUsd = 'market__totalValueLockedUSD',
  MarketTotalValueLockedUsdUntracked = 'market__totalValueLockedUSDUntracked',
  MarketTransactionHash = 'market__transactionHash',
  MarketType = 'market__type',
  MarketUntrackedVolumeUsd = 'market__untrackedVolumeUSD',
  MarketUpperBound = 'market__upperBound',
  MarketVolume = 'market__volume',
  MarketVolumeUsd = 'market__volumeUSD',
  TotalValueLockedUsd = 'totalValueLockedUSD',
  TotalValueLockedUsdUntracked = 'totalValueLockedUSDUntracked',
  UntrackedVolumeUsd = 'untrackedVolumeUSD',
  Volume = 'volume',
  VolumeUsd = 'volumeUSD'
}

export type MarketHourData = {
  __typename?: 'MarketHourData';
  id: Scalars['ID'];
  market: Market;
  periodStartUnix: Scalars['Int'];
  totalValueLockedUSD: Scalars['BigDecimal'];
  totalValueLockedUSDUntracked: Scalars['BigDecimal'];
  untrackedVolumeUSD: Scalars['BigDecimal'];
  volume: Scalars['BigDecimal'];
  volumeUSD: Scalars['BigDecimal'];
};

export type MarketHourData_Filter = {
  /** Filter for the block changed event. */
  _change_block?: Maybe<BlockChangedFilter>;
  and?: Maybe<Array<Maybe<MarketHourData_Filter>>>;
  id?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_lt?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
  market?: Maybe<Scalars['String']>;
  market_?: Maybe<Market_Filter>;
  market_contains?: Maybe<Scalars['String']>;
  market_contains_nocase?: Maybe<Scalars['String']>;
  market_ends_with?: Maybe<Scalars['String']>;
  market_ends_with_nocase?: Maybe<Scalars['String']>;
  market_gt?: Maybe<Scalars['String']>;
  market_gte?: Maybe<Scalars['String']>;
  market_in?: Maybe<Array<Scalars['String']>>;
  market_lt?: Maybe<Scalars['String']>;
  market_lte?: Maybe<Scalars['String']>;
  market_not?: Maybe<Scalars['String']>;
  market_not_contains?: Maybe<Scalars['String']>;
  market_not_contains_nocase?: Maybe<Scalars['String']>;
  market_not_ends_with?: Maybe<Scalars['String']>;
  market_not_ends_with_nocase?: Maybe<Scalars['String']>;
  market_not_in?: Maybe<Array<Scalars['String']>>;
  market_not_starts_with?: Maybe<Scalars['String']>;
  market_not_starts_with_nocase?: Maybe<Scalars['String']>;
  market_starts_with?: Maybe<Scalars['String']>;
  market_starts_with_nocase?: Maybe<Scalars['String']>;
  or?: Maybe<Array<Maybe<MarketHourData_Filter>>>;
  periodStartUnix?: Maybe<Scalars['Int']>;
  periodStartUnix_gt?: Maybe<Scalars['Int']>;
  periodStartUnix_gte?: Maybe<Scalars['Int']>;
  periodStartUnix_in?: Maybe<Array<Scalars['Int']>>;
  periodStartUnix_lt?: Maybe<Scalars['Int']>;
  periodStartUnix_lte?: Maybe<Scalars['Int']>;
  periodStartUnix_not?: Maybe<Scalars['Int']>;
  periodStartUnix_not_in?: Maybe<Array<Scalars['Int']>>;
  totalValueLockedUSD?: Maybe<Scalars['BigDecimal']>;
  totalValueLockedUSDUntracked?: Maybe<Scalars['BigDecimal']>;
  totalValueLockedUSDUntracked_gt?: Maybe<Scalars['BigDecimal']>;
  totalValueLockedUSDUntracked_gte?: Maybe<Scalars['BigDecimal']>;
  totalValueLockedUSDUntracked_in?: Maybe<Array<Scalars['BigDecimal']>>;
  totalValueLockedUSDUntracked_lt?: Maybe<Scalars['BigDecimal']>;
  totalValueLockedUSDUntracked_lte?: Maybe<Scalars['BigDecimal']>;
  totalValueLockedUSDUntracked_not?: Maybe<Scalars['BigDecimal']>;
  totalValueLockedUSDUntracked_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
  totalValueLockedUSD_gt?: Maybe<Scalars['BigDecimal']>;
  totalValueLockedUSD_gte?: Maybe<Scalars['BigDecimal']>;
  totalValueLockedUSD_in?: Maybe<Array<Scalars['BigDecimal']>>;
  totalValueLockedUSD_lt?: Maybe<Scalars['BigDecimal']>;
  totalValueLockedUSD_lte?: Maybe<Scalars['BigDecimal']>;
  totalValueLockedUSD_not?: Maybe<Scalars['BigDecimal']>;
  totalValueLockedUSD_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
  untrackedVolumeUSD?: Maybe<Scalars['BigDecimal']>;
  untrackedVolumeUSD_gt?: Maybe<Scalars['BigDecimal']>;
  untrackedVolumeUSD_gte?: Maybe<Scalars['BigDecimal']>;
  untrackedVolumeUSD_in?: Maybe<Array<Scalars['BigDecimal']>>;
  untrackedVolumeUSD_lt?: Maybe<Scalars['BigDecimal']>;
  untrackedVolumeUSD_lte?: Maybe<Scalars['BigDecimal']>;
  untrackedVolumeUSD_not?: Maybe<Scalars['BigDecimal']>;
  untrackedVolumeUSD_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
  volume?: Maybe<Scalars['BigDecimal']>;
  volumeUSD?: Maybe<Scalars['BigDecimal']>;
  volumeUSD_gt?: Maybe<Scalars['BigDecimal']>;
  volumeUSD_gte?: Maybe<Scalars['BigDecimal']>;
  volumeUSD_in?: Maybe<Array<Scalars['BigDecimal']>>;
  volumeUSD_lt?: Maybe<Scalars['BigDecimal']>;
  volumeUSD_lte?: Maybe<Scalars['BigDecimal']>;
  volumeUSD_not?: Maybe<Scalars['BigDecimal']>;
  volumeUSD_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
  volume_gt?: Maybe<Scalars['BigDecimal']>;
  volume_gte?: Maybe<Scalars['BigDecimal']>;
  volume_in?: Maybe<Array<Scalars['BigDecimal']>>;
  volume_lt?: Maybe<Scalars['BigDecimal']>;
  volume_lte?: Maybe<Scalars['BigDecimal']>;
  volume_not?: Maybe<Scalars['BigDecimal']>;
  volume_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
};

export enum MarketHourData_OrderBy {
  Id = 'id',
  Market = 'market',
  MarketBlockNumber = 'market__blockNumber',
  MarketBlockTimestamp = 'market__blockTimestamp',
  MarketConditionId = 'market__conditionId',
  MarketCreator = 'market__creator',
  MarketFactory = 'market__factory',
  MarketFinalizeTs = 'market__finalizeTs',
  MarketHasAnswers = 'market__hasAnswers',
  MarketId = 'market__id',
  MarketIndex = 'market__index',
  MarketLowerBound = 'market__lowerBound',
  MarketMarketName = 'market__marketName',
  MarketOpeningTs = 'market__openingTs',
  MarketOutcomesSupply = 'market__outcomesSupply',
  MarketParentCollectionId = 'market__parentCollectionId',
  MarketParentOutcome = 'market__parentOutcome',
  MarketPayoutReported = 'market__payoutReported',
  MarketQuestionId = 'market__questionId',
  MarketQuestionsInArbitration = 'market__questionsInArbitration',
  MarketTemplateId = 'market__templateId',
  MarketTotalValueLockedUsd = 'market__totalValueLockedUSD',
  MarketTotalValueLockedUsdUntracked = 'market__totalValueLockedUSDUntracked',
  MarketTransactionHash = 'market__transactionHash',
  MarketType = 'market__type',
  MarketUntrackedVolumeUsd = 'market__untrackedVolumeUSD',
  MarketUpperBound = 'market__upperBound',
  MarketVolume = 'market__volume',
  MarketVolumeUsd = 'market__volumeUSD',
  PeriodStartUnix = 'periodStartUnix',
  TotalValueLockedUsd = 'totalValueLockedUSD',
  TotalValueLockedUsdUntracked = 'totalValueLockedUSDUntracked',
  UntrackedVolumeUsd = 'untrackedVolumeUSD',
  Volume = 'volume',
  VolumeUsd = 'volumeUSD'
}

export type MarketQuestion = {
  __typename?: 'MarketQuestion';
  /**  baseQuestion is the original question that was created when the market was created  */
  baseQuestion: Question;
  id: Scalars['ID'];
  /**  a market can have the same question multiple times, we use the index to identify each one of them  */
  index: Scalars['Int'];
  market: Market;
  /**  question is the latest question if the original question was reopened, otherwise it's the same as baseQuestion  */
  question: Question;
};

export type MarketQuestion_Filter = {
  /** Filter for the block changed event. */
  _change_block?: Maybe<BlockChangedFilter>;
  and?: Maybe<Array<Maybe<MarketQuestion_Filter>>>;
  baseQuestion?: Maybe<Scalars['String']>;
  baseQuestion_?: Maybe<Question_Filter>;
  baseQuestion_contains?: Maybe<Scalars['String']>;
  baseQuestion_contains_nocase?: Maybe<Scalars['String']>;
  baseQuestion_ends_with?: Maybe<Scalars['String']>;
  baseQuestion_ends_with_nocase?: Maybe<Scalars['String']>;
  baseQuestion_gt?: Maybe<Scalars['String']>;
  baseQuestion_gte?: Maybe<Scalars['String']>;
  baseQuestion_in?: Maybe<Array<Scalars['String']>>;
  baseQuestion_lt?: Maybe<Scalars['String']>;
  baseQuestion_lte?: Maybe<Scalars['String']>;
  baseQuestion_not?: Maybe<Scalars['String']>;
  baseQuestion_not_contains?: Maybe<Scalars['String']>;
  baseQuestion_not_contains_nocase?: Maybe<Scalars['String']>;
  baseQuestion_not_ends_with?: Maybe<Scalars['String']>;
  baseQuestion_not_ends_with_nocase?: Maybe<Scalars['String']>;
  baseQuestion_not_in?: Maybe<Array<Scalars['String']>>;
  baseQuestion_not_starts_with?: Maybe<Scalars['String']>;
  baseQuestion_not_starts_with_nocase?: Maybe<Scalars['String']>;
  baseQuestion_starts_with?: Maybe<Scalars['String']>;
  baseQuestion_starts_with_nocase?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_lt?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
  index?: Maybe<Scalars['Int']>;
  index_gt?: Maybe<Scalars['Int']>;
  index_gte?: Maybe<Scalars['Int']>;
  index_in?: Maybe<Array<Scalars['Int']>>;
  index_lt?: Maybe<Scalars['Int']>;
  index_lte?: Maybe<Scalars['Int']>;
  index_not?: Maybe<Scalars['Int']>;
  index_not_in?: Maybe<Array<Scalars['Int']>>;
  market?: Maybe<Scalars['String']>;
  market_?: Maybe<Market_Filter>;
  market_contains?: Maybe<Scalars['String']>;
  market_contains_nocase?: Maybe<Scalars['String']>;
  market_ends_with?: Maybe<Scalars['String']>;
  market_ends_with_nocase?: Maybe<Scalars['String']>;
  market_gt?: Maybe<Scalars['String']>;
  market_gte?: Maybe<Scalars['String']>;
  market_in?: Maybe<Array<Scalars['String']>>;
  market_lt?: Maybe<Scalars['String']>;
  market_lte?: Maybe<Scalars['String']>;
  market_not?: Maybe<Scalars['String']>;
  market_not_contains?: Maybe<Scalars['String']>;
  market_not_contains_nocase?: Maybe<Scalars['String']>;
  market_not_ends_with?: Maybe<Scalars['String']>;
  market_not_ends_with_nocase?: Maybe<Scalars['String']>;
  market_not_in?: Maybe<Array<Scalars['String']>>;
  market_not_starts_with?: Maybe<Scalars['String']>;
  market_not_starts_with_nocase?: Maybe<Scalars['String']>;
  market_starts_with?: Maybe<Scalars['String']>;
  market_starts_with_nocase?: Maybe<Scalars['String']>;
  or?: Maybe<Array<Maybe<MarketQuestion_Filter>>>;
  question?: Maybe<Scalars['String']>;
  question_?: Maybe<Question_Filter>;
  question_contains?: Maybe<Scalars['String']>;
  question_contains_nocase?: Maybe<Scalars['String']>;
  question_ends_with?: Maybe<Scalars['String']>;
  question_ends_with_nocase?: Maybe<Scalars['String']>;
  question_gt?: Maybe<Scalars['String']>;
  question_gte?: Maybe<Scalars['String']>;
  question_in?: Maybe<Array<Scalars['String']>>;
  question_lt?: Maybe<Scalars['String']>;
  question_lte?: Maybe<Scalars['String']>;
  question_not?: Maybe<Scalars['String']>;
  question_not_contains?: Maybe<Scalars['String']>;
  question_not_contains_nocase?: Maybe<Scalars['String']>;
  question_not_ends_with?: Maybe<Scalars['String']>;
  question_not_ends_with_nocase?: Maybe<Scalars['String']>;
  question_not_in?: Maybe<Array<Scalars['String']>>;
  question_not_starts_with?: Maybe<Scalars['String']>;
  question_not_starts_with_nocase?: Maybe<Scalars['String']>;
  question_starts_with?: Maybe<Scalars['String']>;
  question_starts_with_nocase?: Maybe<Scalars['String']>;
};

export enum MarketQuestion_OrderBy {
  BaseQuestion = 'baseQuestion',
  BaseQuestionArbitrationOccurred = 'baseQuestion__arbitration_occurred',
  BaseQuestionArbitrator = 'baseQuestion__arbitrator',
  BaseQuestionBestAnswer = 'baseQuestion__best_answer',
  BaseQuestionBond = 'baseQuestion__bond',
  BaseQuestionFinalizeTs = 'baseQuestion__finalize_ts',
  BaseQuestionId = 'baseQuestion__id',
  BaseQuestionIndex = 'baseQuestion__index',
  BaseQuestionIsPendingArbitration = 'baseQuestion__is_pending_arbitration',
  BaseQuestionMinBond = 'baseQuestion__min_bond',
  BaseQuestionOpeningTs = 'baseQuestion__opening_ts',
  BaseQuestionTimeout = 'baseQuestion__timeout',
  Id = 'id',
  Index = 'index',
  Market = 'market',
  MarketBlockNumber = 'market__blockNumber',
  MarketBlockTimestamp = 'market__blockTimestamp',
  MarketConditionId = 'market__conditionId',
  MarketCreator = 'market__creator',
  MarketFactory = 'market__factory',
  MarketFinalizeTs = 'market__finalizeTs',
  MarketHasAnswers = 'market__hasAnswers',
  MarketId = 'market__id',
  MarketIndex = 'market__index',
  MarketLowerBound = 'market__lowerBound',
  MarketMarketName = 'market__marketName',
  MarketOpeningTs = 'market__openingTs',
  MarketOutcomesSupply = 'market__outcomesSupply',
  MarketParentCollectionId = 'market__parentCollectionId',
  MarketParentOutcome = 'market__parentOutcome',
  MarketPayoutReported = 'market__payoutReported',
  MarketQuestionId = 'market__questionId',
  MarketQuestionsInArbitration = 'market__questionsInArbitration',
  MarketTemplateId = 'market__templateId',
  MarketTotalValueLockedUsd = 'market__totalValueLockedUSD',
  MarketTotalValueLockedUsdUntracked = 'market__totalValueLockedUSDUntracked',
  MarketTransactionHash = 'market__transactionHash',
  MarketType = 'market__type',
  MarketUntrackedVolumeUsd = 'market__untrackedVolumeUSD',
  MarketUpperBound = 'market__upperBound',
  MarketVolume = 'market__volume',
  MarketVolumeUsd = 'market__volumeUSD',
  Question = 'question',
  QuestionArbitrationOccurred = 'question__arbitration_occurred',
  QuestionArbitrator = 'question__arbitrator',
  QuestionBestAnswer = 'question__best_answer',
  QuestionBond = 'question__bond',
  QuestionFinalizeTs = 'question__finalize_ts',
  QuestionId = 'question__id',
  QuestionIndex = 'question__index',
  QuestionIsPendingArbitration = 'question__is_pending_arbitration',
  QuestionMinBond = 'question__min_bond',
  QuestionOpeningTs = 'question__opening_ts',
  QuestionTimeout = 'question__timeout'
}

export enum MarketType {
  Futarchy = 'Futarchy',
  Generic = 'Generic'
}

export type Market_Filter = {
  /** Filter for the block changed event. */
  _change_block?: Maybe<BlockChangedFilter>;
  and?: Maybe<Array<Maybe<Market_Filter>>>;
  blockNumber?: Maybe<Scalars['BigInt']>;
  blockNumber_gt?: Maybe<Scalars['BigInt']>;
  blockNumber_gte?: Maybe<Scalars['BigInt']>;
  blockNumber_in?: Maybe<Array<Scalars['BigInt']>>;
  blockNumber_lt?: Maybe<Scalars['BigInt']>;
  blockNumber_lte?: Maybe<Scalars['BigInt']>;
  blockNumber_not?: Maybe<Scalars['BigInt']>;
  blockNumber_not_in?: Maybe<Array<Scalars['BigInt']>>;
  blockTimestamp?: Maybe<Scalars['BigInt']>;
  blockTimestamp_gt?: Maybe<Scalars['BigInt']>;
  blockTimestamp_gte?: Maybe<Scalars['BigInt']>;
  blockTimestamp_in?: Maybe<Array<Scalars['BigInt']>>;
  blockTimestamp_lt?: Maybe<Scalars['BigInt']>;
  blockTimestamp_lte?: Maybe<Scalars['BigInt']>;
  blockTimestamp_not?: Maybe<Scalars['BigInt']>;
  blockTimestamp_not_in?: Maybe<Array<Scalars['BigInt']>>;
  childMarkets_?: Maybe<Market_Filter>;
  collateralToken?: Maybe<Scalars['String']>;
  collateralToken1?: Maybe<Scalars['String']>;
  collateralToken1_?: Maybe<Token_Filter>;
  collateralToken1_contains?: Maybe<Scalars['String']>;
  collateralToken1_contains_nocase?: Maybe<Scalars['String']>;
  collateralToken1_ends_with?: Maybe<Scalars['String']>;
  collateralToken1_ends_with_nocase?: Maybe<Scalars['String']>;
  collateralToken1_gt?: Maybe<Scalars['String']>;
  collateralToken1_gte?: Maybe<Scalars['String']>;
  collateralToken1_in?: Maybe<Array<Scalars['String']>>;
  collateralToken1_lt?: Maybe<Scalars['String']>;
  collateralToken1_lte?: Maybe<Scalars['String']>;
  collateralToken1_not?: Maybe<Scalars['String']>;
  collateralToken1_not_contains?: Maybe<Scalars['String']>;
  collateralToken1_not_contains_nocase?: Maybe<Scalars['String']>;
  collateralToken1_not_ends_with?: Maybe<Scalars['String']>;
  collateralToken1_not_ends_with_nocase?: Maybe<Scalars['String']>;
  collateralToken1_not_in?: Maybe<Array<Scalars['String']>>;
  collateralToken1_not_starts_with?: Maybe<Scalars['String']>;
  collateralToken1_not_starts_with_nocase?: Maybe<Scalars['String']>;
  collateralToken1_starts_with?: Maybe<Scalars['String']>;
  collateralToken1_starts_with_nocase?: Maybe<Scalars['String']>;
  collateralToken2?: Maybe<Scalars['String']>;
  collateralToken2_?: Maybe<Token_Filter>;
  collateralToken2_contains?: Maybe<Scalars['String']>;
  collateralToken2_contains_nocase?: Maybe<Scalars['String']>;
  collateralToken2_ends_with?: Maybe<Scalars['String']>;
  collateralToken2_ends_with_nocase?: Maybe<Scalars['String']>;
  collateralToken2_gt?: Maybe<Scalars['String']>;
  collateralToken2_gte?: Maybe<Scalars['String']>;
  collateralToken2_in?: Maybe<Array<Scalars['String']>>;
  collateralToken2_lt?: Maybe<Scalars['String']>;
  collateralToken2_lte?: Maybe<Scalars['String']>;
  collateralToken2_not?: Maybe<Scalars['String']>;
  collateralToken2_not_contains?: Maybe<Scalars['String']>;
  collateralToken2_not_contains_nocase?: Maybe<Scalars['String']>;
  collateralToken2_not_ends_with?: Maybe<Scalars['String']>;
  collateralToken2_not_ends_with_nocase?: Maybe<Scalars['String']>;
  collateralToken2_not_in?: Maybe<Array<Scalars['String']>>;
  collateralToken2_not_starts_with?: Maybe<Scalars['String']>;
  collateralToken2_not_starts_with_nocase?: Maybe<Scalars['String']>;
  collateralToken2_starts_with?: Maybe<Scalars['String']>;
  collateralToken2_starts_with_nocase?: Maybe<Scalars['String']>;
  collateralToken_?: Maybe<Token_Filter>;
  collateralToken_contains?: Maybe<Scalars['String']>;
  collateralToken_contains_nocase?: Maybe<Scalars['String']>;
  collateralToken_ends_with?: Maybe<Scalars['String']>;
  collateralToken_ends_with_nocase?: Maybe<Scalars['String']>;
  collateralToken_gt?: Maybe<Scalars['String']>;
  collateralToken_gte?: Maybe<Scalars['String']>;
  collateralToken_in?: Maybe<Array<Scalars['String']>>;
  collateralToken_lt?: Maybe<Scalars['String']>;
  collateralToken_lte?: Maybe<Scalars['String']>;
  collateralToken_not?: Maybe<Scalars['String']>;
  collateralToken_not_contains?: Maybe<Scalars['String']>;
  collateralToken_not_contains_nocase?: Maybe<Scalars['String']>;
  collateralToken_not_ends_with?: Maybe<Scalars['String']>;
  collateralToken_not_ends_with_nocase?: Maybe<Scalars['String']>;
  collateralToken_not_in?: Maybe<Array<Scalars['String']>>;
  collateralToken_not_starts_with?: Maybe<Scalars['String']>;
  collateralToken_not_starts_with_nocase?: Maybe<Scalars['String']>;
  collateralToken_starts_with?: Maybe<Scalars['String']>;
  collateralToken_starts_with_nocase?: Maybe<Scalars['String']>;
  conditionId?: Maybe<Scalars['Bytes']>;
  conditionId_contains?: Maybe<Scalars['Bytes']>;
  conditionId_gt?: Maybe<Scalars['Bytes']>;
  conditionId_gte?: Maybe<Scalars['Bytes']>;
  conditionId_in?: Maybe<Array<Scalars['Bytes']>>;
  conditionId_lt?: Maybe<Scalars['Bytes']>;
  conditionId_lte?: Maybe<Scalars['Bytes']>;
  conditionId_not?: Maybe<Scalars['Bytes']>;
  conditionId_not_contains?: Maybe<Scalars['Bytes']>;
  conditionId_not_in?: Maybe<Array<Scalars['Bytes']>>;
  creator?: Maybe<Scalars['Bytes']>;
  creator_contains?: Maybe<Scalars['Bytes']>;
  creator_gt?: Maybe<Scalars['Bytes']>;
  creator_gte?: Maybe<Scalars['Bytes']>;
  creator_in?: Maybe<Array<Scalars['Bytes']>>;
  creator_lt?: Maybe<Scalars['Bytes']>;
  creator_lte?: Maybe<Scalars['Bytes']>;
  creator_not?: Maybe<Scalars['Bytes']>;
  creator_not_contains?: Maybe<Scalars['Bytes']>;
  creator_not_in?: Maybe<Array<Scalars['Bytes']>>;
  ctfCondition?: Maybe<Scalars['String']>;
  ctfCondition_?: Maybe<Condition_Filter>;
  ctfCondition_contains?: Maybe<Scalars['String']>;
  ctfCondition_contains_nocase?: Maybe<Scalars['String']>;
  ctfCondition_ends_with?: Maybe<Scalars['String']>;
  ctfCondition_ends_with_nocase?: Maybe<Scalars['String']>;
  ctfCondition_gt?: Maybe<Scalars['String']>;
  ctfCondition_gte?: Maybe<Scalars['String']>;
  ctfCondition_in?: Maybe<Array<Scalars['String']>>;
  ctfCondition_lt?: Maybe<Scalars['String']>;
  ctfCondition_lte?: Maybe<Scalars['String']>;
  ctfCondition_not?: Maybe<Scalars['String']>;
  ctfCondition_not_contains?: Maybe<Scalars['String']>;
  ctfCondition_not_contains_nocase?: Maybe<Scalars['String']>;
  ctfCondition_not_ends_with?: Maybe<Scalars['String']>;
  ctfCondition_not_ends_with_nocase?: Maybe<Scalars['String']>;
  ctfCondition_not_in?: Maybe<Array<Scalars['String']>>;
  ctfCondition_not_starts_with?: Maybe<Scalars['String']>;
  ctfCondition_not_starts_with_nocase?: Maybe<Scalars['String']>;
  ctfCondition_starts_with?: Maybe<Scalars['String']>;
  ctfCondition_starts_with_nocase?: Maybe<Scalars['String']>;
  deposits0_?: Maybe<Deposit_Filter>;
  deposits1_?: Maybe<Deposit_Filter>;
  encodedQuestions?: Maybe<Array<Scalars['String']>>;
  encodedQuestions_contains?: Maybe<Array<Scalars['String']>>;
  encodedQuestions_contains_nocase?: Maybe<Array<Scalars['String']>>;
  encodedQuestions_not?: Maybe<Array<Scalars['String']>>;
  encodedQuestions_not_contains?: Maybe<Array<Scalars['String']>>;
  encodedQuestions_not_contains_nocase?: Maybe<Array<Scalars['String']>>;
  factory?: Maybe<Scalars['Bytes']>;
  factory_contains?: Maybe<Scalars['Bytes']>;
  factory_gt?: Maybe<Scalars['Bytes']>;
  factory_gte?: Maybe<Scalars['Bytes']>;
  factory_in?: Maybe<Array<Scalars['Bytes']>>;
  factory_lt?: Maybe<Scalars['Bytes']>;
  factory_lte?: Maybe<Scalars['Bytes']>;
  factory_not?: Maybe<Scalars['Bytes']>;
  factory_not_contains?: Maybe<Scalars['Bytes']>;
  factory_not_in?: Maybe<Array<Scalars['Bytes']>>;
  finalizeTs?: Maybe<Scalars['BigInt']>;
  finalizeTs_gt?: Maybe<Scalars['BigInt']>;
  finalizeTs_gte?: Maybe<Scalars['BigInt']>;
  finalizeTs_in?: Maybe<Array<Scalars['BigInt']>>;
  finalizeTs_lt?: Maybe<Scalars['BigInt']>;
  finalizeTs_lte?: Maybe<Scalars['BigInt']>;
  finalizeTs_not?: Maybe<Scalars['BigInt']>;
  finalizeTs_not_in?: Maybe<Array<Scalars['BigInt']>>;
  hasAnswers?: Maybe<Scalars['Boolean']>;
  hasAnswers_in?: Maybe<Array<Scalars['Boolean']>>;
  hasAnswers_not?: Maybe<Scalars['Boolean']>;
  hasAnswers_not_in?: Maybe<Array<Scalars['Boolean']>>;
  id?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_lt?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
  image_?: Maybe<Image_Filter>;
  index?: Maybe<Scalars['BigInt']>;
  index_gt?: Maybe<Scalars['BigInt']>;
  index_gte?: Maybe<Scalars['BigInt']>;
  index_in?: Maybe<Array<Scalars['BigInt']>>;
  index_lt?: Maybe<Scalars['BigInt']>;
  index_lte?: Maybe<Scalars['BigInt']>;
  index_not?: Maybe<Scalars['BigInt']>;
  index_not_in?: Maybe<Array<Scalars['BigInt']>>;
  lowerBound?: Maybe<Scalars['BigInt']>;
  lowerBound_gt?: Maybe<Scalars['BigInt']>;
  lowerBound_gte?: Maybe<Scalars['BigInt']>;
  lowerBound_in?: Maybe<Array<Scalars['BigInt']>>;
  lowerBound_lt?: Maybe<Scalars['BigInt']>;
  lowerBound_lte?: Maybe<Scalars['BigInt']>;
  lowerBound_not?: Maybe<Scalars['BigInt']>;
  lowerBound_not_in?: Maybe<Array<Scalars['BigInt']>>;
  marketName?: Maybe<Scalars['String']>;
  marketName_contains?: Maybe<Scalars['String']>;
  marketName_contains_nocase?: Maybe<Scalars['String']>;
  marketName_ends_with?: Maybe<Scalars['String']>;
  marketName_ends_with_nocase?: Maybe<Scalars['String']>;
  marketName_gt?: Maybe<Scalars['String']>;
  marketName_gte?: Maybe<Scalars['String']>;
  marketName_in?: Maybe<Array<Scalars['String']>>;
  marketName_lt?: Maybe<Scalars['String']>;
  marketName_lte?: Maybe<Scalars['String']>;
  marketName_not?: Maybe<Scalars['String']>;
  marketName_not_contains?: Maybe<Scalars['String']>;
  marketName_not_contains_nocase?: Maybe<Scalars['String']>;
  marketName_not_ends_with?: Maybe<Scalars['String']>;
  marketName_not_ends_with_nocase?: Maybe<Scalars['String']>;
  marketName_not_in?: Maybe<Array<Scalars['String']>>;
  marketName_not_starts_with?: Maybe<Scalars['String']>;
  marketName_not_starts_with_nocase?: Maybe<Scalars['String']>;
  marketName_starts_with?: Maybe<Scalars['String']>;
  marketName_starts_with_nocase?: Maybe<Scalars['String']>;
  openingTs?: Maybe<Scalars['BigInt']>;
  openingTs_gt?: Maybe<Scalars['BigInt']>;
  openingTs_gte?: Maybe<Scalars['BigInt']>;
  openingTs_in?: Maybe<Array<Scalars['BigInt']>>;
  openingTs_lt?: Maybe<Scalars['BigInt']>;
  openingTs_lte?: Maybe<Scalars['BigInt']>;
  openingTs_not?: Maybe<Scalars['BigInt']>;
  openingTs_not_in?: Maybe<Array<Scalars['BigInt']>>;
  or?: Maybe<Array<Maybe<Market_Filter>>>;
  outcomes?: Maybe<Array<Scalars['String']>>;
  outcomesSupply?: Maybe<Scalars['BigInt']>;
  outcomesSupply_gt?: Maybe<Scalars['BigInt']>;
  outcomesSupply_gte?: Maybe<Scalars['BigInt']>;
  outcomesSupply_in?: Maybe<Array<Scalars['BigInt']>>;
  outcomesSupply_lt?: Maybe<Scalars['BigInt']>;
  outcomesSupply_lte?: Maybe<Scalars['BigInt']>;
  outcomesSupply_not?: Maybe<Scalars['BigInt']>;
  outcomesSupply_not_in?: Maybe<Array<Scalars['BigInt']>>;
  outcomes_contains?: Maybe<Array<Scalars['String']>>;
  outcomes_contains_nocase?: Maybe<Array<Scalars['String']>>;
  outcomes_not?: Maybe<Array<Scalars['String']>>;
  outcomes_not_contains?: Maybe<Array<Scalars['String']>>;
  outcomes_not_contains_nocase?: Maybe<Array<Scalars['String']>>;
  parentCollectionId?: Maybe<Scalars['Bytes']>;
  parentCollectionId_contains?: Maybe<Scalars['Bytes']>;
  parentCollectionId_gt?: Maybe<Scalars['Bytes']>;
  parentCollectionId_gte?: Maybe<Scalars['Bytes']>;
  parentCollectionId_in?: Maybe<Array<Scalars['Bytes']>>;
  parentCollectionId_lt?: Maybe<Scalars['Bytes']>;
  parentCollectionId_lte?: Maybe<Scalars['Bytes']>;
  parentCollectionId_not?: Maybe<Scalars['Bytes']>;
  parentCollectionId_not_contains?: Maybe<Scalars['Bytes']>;
  parentCollectionId_not_in?: Maybe<Array<Scalars['Bytes']>>;
  parentMarket?: Maybe<Scalars['String']>;
  parentMarket_?: Maybe<Market_Filter>;
  parentMarket_contains?: Maybe<Scalars['String']>;
  parentMarket_contains_nocase?: Maybe<Scalars['String']>;
  parentMarket_ends_with?: Maybe<Scalars['String']>;
  parentMarket_ends_with_nocase?: Maybe<Scalars['String']>;
  parentMarket_gt?: Maybe<Scalars['String']>;
  parentMarket_gte?: Maybe<Scalars['String']>;
  parentMarket_in?: Maybe<Array<Scalars['String']>>;
  parentMarket_lt?: Maybe<Scalars['String']>;
  parentMarket_lte?: Maybe<Scalars['String']>;
  parentMarket_not?: Maybe<Scalars['String']>;
  parentMarket_not_contains?: Maybe<Scalars['String']>;
  parentMarket_not_contains_nocase?: Maybe<Scalars['String']>;
  parentMarket_not_ends_with?: Maybe<Scalars['String']>;
  parentMarket_not_ends_with_nocase?: Maybe<Scalars['String']>;
  parentMarket_not_in?: Maybe<Array<Scalars['String']>>;
  parentMarket_not_starts_with?: Maybe<Scalars['String']>;
  parentMarket_not_starts_with_nocase?: Maybe<Scalars['String']>;
  parentMarket_starts_with?: Maybe<Scalars['String']>;
  parentMarket_starts_with_nocase?: Maybe<Scalars['String']>;
  parentOutcome?: Maybe<Scalars['BigInt']>;
  parentOutcome_gt?: Maybe<Scalars['BigInt']>;
  parentOutcome_gte?: Maybe<Scalars['BigInt']>;
  parentOutcome_in?: Maybe<Array<Scalars['BigInt']>>;
  parentOutcome_lt?: Maybe<Scalars['BigInt']>;
  parentOutcome_lte?: Maybe<Scalars['BigInt']>;
  parentOutcome_not?: Maybe<Scalars['BigInt']>;
  parentOutcome_not_in?: Maybe<Array<Scalars['BigInt']>>;
  payoutNumerators?: Maybe<Array<Scalars['BigInt']>>;
  payoutNumerators_contains?: Maybe<Array<Scalars['BigInt']>>;
  payoutNumerators_contains_nocase?: Maybe<Array<Scalars['BigInt']>>;
  payoutNumerators_not?: Maybe<Array<Scalars['BigInt']>>;
  payoutNumerators_not_contains?: Maybe<Array<Scalars['BigInt']>>;
  payoutNumerators_not_contains_nocase?: Maybe<Array<Scalars['BigInt']>>;
  payoutReported?: Maybe<Scalars['Boolean']>;
  payoutReported_in?: Maybe<Array<Scalars['Boolean']>>;
  payoutReported_not?: Maybe<Scalars['Boolean']>;
  payoutReported_not_in?: Maybe<Array<Scalars['Boolean']>>;
  questionId?: Maybe<Scalars['Bytes']>;
  questionId_contains?: Maybe<Scalars['Bytes']>;
  questionId_gt?: Maybe<Scalars['Bytes']>;
  questionId_gte?: Maybe<Scalars['Bytes']>;
  questionId_in?: Maybe<Array<Scalars['Bytes']>>;
  questionId_lt?: Maybe<Scalars['Bytes']>;
  questionId_lte?: Maybe<Scalars['Bytes']>;
  questionId_not?: Maybe<Scalars['Bytes']>;
  questionId_not_contains?: Maybe<Scalars['Bytes']>;
  questionId_not_in?: Maybe<Array<Scalars['Bytes']>>;
  questionsInArbitration?: Maybe<Scalars['BigInt']>;
  questionsInArbitration_gt?: Maybe<Scalars['BigInt']>;
  questionsInArbitration_gte?: Maybe<Scalars['BigInt']>;
  questionsInArbitration_in?: Maybe<Array<Scalars['BigInt']>>;
  questionsInArbitration_lt?: Maybe<Scalars['BigInt']>;
  questionsInArbitration_lte?: Maybe<Scalars['BigInt']>;
  questionsInArbitration_not?: Maybe<Scalars['BigInt']>;
  questionsInArbitration_not_in?: Maybe<Array<Scalars['BigInt']>>;
  questions_?: Maybe<MarketQuestion_Filter>;
  templateId?: Maybe<Scalars['BigInt']>;
  templateId_gt?: Maybe<Scalars['BigInt']>;
  templateId_gte?: Maybe<Scalars['BigInt']>;
  templateId_in?: Maybe<Array<Scalars['BigInt']>>;
  templateId_lt?: Maybe<Scalars['BigInt']>;
  templateId_lte?: Maybe<Scalars['BigInt']>;
  templateId_not?: Maybe<Scalars['BigInt']>;
  templateId_not_in?: Maybe<Array<Scalars['BigInt']>>;
  tokens_?: Maybe<Token_Filter>;
  totalValueLockedUSD?: Maybe<Scalars['BigDecimal']>;
  totalValueLockedUSDUntracked?: Maybe<Scalars['BigDecimal']>;
  totalValueLockedUSDUntracked_gt?: Maybe<Scalars['BigDecimal']>;
  totalValueLockedUSDUntracked_gte?: Maybe<Scalars['BigDecimal']>;
  totalValueLockedUSDUntracked_in?: Maybe<Array<Scalars['BigDecimal']>>;
  totalValueLockedUSDUntracked_lt?: Maybe<Scalars['BigDecimal']>;
  totalValueLockedUSDUntracked_lte?: Maybe<Scalars['BigDecimal']>;
  totalValueLockedUSDUntracked_not?: Maybe<Scalars['BigDecimal']>;
  totalValueLockedUSDUntracked_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
  totalValueLockedUSD_gt?: Maybe<Scalars['BigDecimal']>;
  totalValueLockedUSD_gte?: Maybe<Scalars['BigDecimal']>;
  totalValueLockedUSD_in?: Maybe<Array<Scalars['BigDecimal']>>;
  totalValueLockedUSD_lt?: Maybe<Scalars['BigDecimal']>;
  totalValueLockedUSD_lte?: Maybe<Scalars['BigDecimal']>;
  totalValueLockedUSD_not?: Maybe<Scalars['BigDecimal']>;
  totalValueLockedUSD_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
  transactionHash?: Maybe<Scalars['Bytes']>;
  transactionHash_contains?: Maybe<Scalars['Bytes']>;
  transactionHash_gt?: Maybe<Scalars['Bytes']>;
  transactionHash_gte?: Maybe<Scalars['Bytes']>;
  transactionHash_in?: Maybe<Array<Scalars['Bytes']>>;
  transactionHash_lt?: Maybe<Scalars['Bytes']>;
  transactionHash_lte?: Maybe<Scalars['Bytes']>;
  transactionHash_not?: Maybe<Scalars['Bytes']>;
  transactionHash_not_contains?: Maybe<Scalars['Bytes']>;
  transactionHash_not_in?: Maybe<Array<Scalars['Bytes']>>;
  type?: Maybe<MarketType>;
  type_in?: Maybe<Array<MarketType>>;
  type_not?: Maybe<MarketType>;
  type_not_in?: Maybe<Array<MarketType>>;
  untrackedVolumeUSD?: Maybe<Scalars['BigDecimal']>;
  untrackedVolumeUSD_gt?: Maybe<Scalars['BigDecimal']>;
  untrackedVolumeUSD_gte?: Maybe<Scalars['BigDecimal']>;
  untrackedVolumeUSD_in?: Maybe<Array<Scalars['BigDecimal']>>;
  untrackedVolumeUSD_lt?: Maybe<Scalars['BigDecimal']>;
  untrackedVolumeUSD_lte?: Maybe<Scalars['BigDecimal']>;
  untrackedVolumeUSD_not?: Maybe<Scalars['BigDecimal']>;
  untrackedVolumeUSD_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
  upperBound?: Maybe<Scalars['BigInt']>;
  upperBound_gt?: Maybe<Scalars['BigInt']>;
  upperBound_gte?: Maybe<Scalars['BigInt']>;
  upperBound_in?: Maybe<Array<Scalars['BigInt']>>;
  upperBound_lt?: Maybe<Scalars['BigInt']>;
  upperBound_lte?: Maybe<Scalars['BigInt']>;
  upperBound_not?: Maybe<Scalars['BigInt']>;
  upperBound_not_in?: Maybe<Array<Scalars['BigInt']>>;
  volume?: Maybe<Scalars['BigDecimal']>;
  volumeUSD?: Maybe<Scalars['BigDecimal']>;
  volumeUSD_gt?: Maybe<Scalars['BigDecimal']>;
  volumeUSD_gte?: Maybe<Scalars['BigDecimal']>;
  volumeUSD_in?: Maybe<Array<Scalars['BigDecimal']>>;
  volumeUSD_lt?: Maybe<Scalars['BigDecimal']>;
  volumeUSD_lte?: Maybe<Scalars['BigDecimal']>;
  volumeUSD_not?: Maybe<Scalars['BigDecimal']>;
  volumeUSD_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
  volume_gt?: Maybe<Scalars['BigDecimal']>;
  volume_gte?: Maybe<Scalars['BigDecimal']>;
  volume_in?: Maybe<Array<Scalars['BigDecimal']>>;
  volume_lt?: Maybe<Scalars['BigDecimal']>;
  volume_lte?: Maybe<Scalars['BigDecimal']>;
  volume_not?: Maybe<Scalars['BigDecimal']>;
  volume_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
  wrappedTokens?: Maybe<Array<Scalars['String']>>;
  wrappedTokensString?: Maybe<Array<Scalars['String']>>;
  wrappedTokensString_contains?: Maybe<Array<Scalars['String']>>;
  wrappedTokensString_contains_nocase?: Maybe<Array<Scalars['String']>>;
  wrappedTokensString_not?: Maybe<Array<Scalars['String']>>;
  wrappedTokensString_not_contains?: Maybe<Array<Scalars['String']>>;
  wrappedTokensString_not_contains_nocase?: Maybe<Array<Scalars['String']>>;
  wrappedTokens_?: Maybe<Token_Filter>;
  wrappedTokens_contains?: Maybe<Array<Scalars['String']>>;
  wrappedTokens_contains_nocase?: Maybe<Array<Scalars['String']>>;
  wrappedTokens_not?: Maybe<Array<Scalars['String']>>;
  wrappedTokens_not_contains?: Maybe<Array<Scalars['String']>>;
  wrappedTokens_not_contains_nocase?: Maybe<Array<Scalars['String']>>;
};

export enum Market_OrderBy {
  BlockNumber = 'blockNumber',
  BlockTimestamp = 'blockTimestamp',
  ChildMarkets = 'childMarkets',
  CollateralToken = 'collateralToken',
  CollateralToken1 = 'collateralToken1',
  CollateralToken1Decimals = 'collateralToken1__decimals',
  CollateralToken1DerivedMatic = 'collateralToken1__derivedMatic',
  CollateralToken1FeesUsd = 'collateralToken1__feesUSD',
  CollateralToken1Id = 'collateralToken1__id',
  CollateralToken1IsSeer = 'collateralToken1__isSeer',
  CollateralToken1Name = 'collateralToken1__name',
  CollateralToken1PoolCount = 'collateralToken1__poolCount',
  CollateralToken1Symbol = 'collateralToken1__symbol',
  CollateralToken1TotalSupply = 'collateralToken1__totalSupply',
  CollateralToken1TotalValueLocked = 'collateralToken1__totalValueLocked',
  CollateralToken1TotalValueLockedUsd = 'collateralToken1__totalValueLockedUSD',
  CollateralToken1TotalValueLockedUsdUntracked = 'collateralToken1__totalValueLockedUSDUntracked',
  CollateralToken1TxCount = 'collateralToken1__txCount',
  CollateralToken1UntrackedVolumeUsd = 'collateralToken1__untrackedVolumeUSD',
  CollateralToken1Volume = 'collateralToken1__volume',
  CollateralToken1VolumeUsd = 'collateralToken1__volumeUSD',
  CollateralToken2 = 'collateralToken2',
  CollateralToken2Decimals = 'collateralToken2__decimals',
  CollateralToken2DerivedMatic = 'collateralToken2__derivedMatic',
  CollateralToken2FeesUsd = 'collateralToken2__feesUSD',
  CollateralToken2Id = 'collateralToken2__id',
  CollateralToken2IsSeer = 'collateralToken2__isSeer',
  CollateralToken2Name = 'collateralToken2__name',
  CollateralToken2PoolCount = 'collateralToken2__poolCount',
  CollateralToken2Symbol = 'collateralToken2__symbol',
  CollateralToken2TotalSupply = 'collateralToken2__totalSupply',
  CollateralToken2TotalValueLocked = 'collateralToken2__totalValueLocked',
  CollateralToken2TotalValueLockedUsd = 'collateralToken2__totalValueLockedUSD',
  CollateralToken2TotalValueLockedUsdUntracked = 'collateralToken2__totalValueLockedUSDUntracked',
  CollateralToken2TxCount = 'collateralToken2__txCount',
  CollateralToken2UntrackedVolumeUsd = 'collateralToken2__untrackedVolumeUSD',
  CollateralToken2Volume = 'collateralToken2__volume',
  CollateralToken2VolumeUsd = 'collateralToken2__volumeUSD',
  CollateralTokenDecimals = 'collateralToken__decimals',
  CollateralTokenDerivedMatic = 'collateralToken__derivedMatic',
  CollateralTokenFeesUsd = 'collateralToken__feesUSD',
  CollateralTokenId = 'collateralToken__id',
  CollateralTokenIsSeer = 'collateralToken__isSeer',
  CollateralTokenName = 'collateralToken__name',
  CollateralTokenPoolCount = 'collateralToken__poolCount',
  CollateralTokenSymbol = 'collateralToken__symbol',
  CollateralTokenTotalSupply = 'collateralToken__totalSupply',
  CollateralTokenTotalValueLocked = 'collateralToken__totalValueLocked',
  CollateralTokenTotalValueLockedUsd = 'collateralToken__totalValueLockedUSD',
  CollateralTokenTotalValueLockedUsdUntracked = 'collateralToken__totalValueLockedUSDUntracked',
  CollateralTokenTxCount = 'collateralToken__txCount',
  CollateralTokenUntrackedVolumeUsd = 'collateralToken__untrackedVolumeUSD',
  CollateralTokenVolume = 'collateralToken__volume',
  CollateralTokenVolumeUsd = 'collateralToken__volumeUSD',
  ConditionId = 'conditionId',
  Creator = 'creator',
  CtfCondition = 'ctfCondition',
  CtfConditionId = 'ctfCondition__id',
  Deposits0 = 'deposits0',
  Deposits1 = 'deposits1',
  EncodedQuestions = 'encodedQuestions',
  Factory = 'factory',
  FinalizeTs = 'finalizeTs',
  HasAnswers = 'hasAnswers',
  Id = 'id',
  Image = 'image',
  Index = 'index',
  LowerBound = 'lowerBound',
  MarketName = 'marketName',
  OpeningTs = 'openingTs',
  Outcomes = 'outcomes',
  OutcomesSupply = 'outcomesSupply',
  ParentCollectionId = 'parentCollectionId',
  ParentMarket = 'parentMarket',
  ParentMarketBlockNumber = 'parentMarket__blockNumber',
  ParentMarketBlockTimestamp = 'parentMarket__blockTimestamp',
  ParentMarketConditionId = 'parentMarket__conditionId',
  ParentMarketCreator = 'parentMarket__creator',
  ParentMarketFactory = 'parentMarket__factory',
  ParentMarketFinalizeTs = 'parentMarket__finalizeTs',
  ParentMarketHasAnswers = 'parentMarket__hasAnswers',
  ParentMarketId = 'parentMarket__id',
  ParentMarketIndex = 'parentMarket__index',
  ParentMarketLowerBound = 'parentMarket__lowerBound',
  ParentMarketMarketName = 'parentMarket__marketName',
  ParentMarketOpeningTs = 'parentMarket__openingTs',
  ParentMarketOutcomesSupply = 'parentMarket__outcomesSupply',
  ParentMarketParentCollectionId = 'parentMarket__parentCollectionId',
  ParentMarketParentOutcome = 'parentMarket__parentOutcome',
  ParentMarketPayoutReported = 'parentMarket__payoutReported',
  ParentMarketQuestionId = 'parentMarket__questionId',
  ParentMarketQuestionsInArbitration = 'parentMarket__questionsInArbitration',
  ParentMarketTemplateId = 'parentMarket__templateId',
  ParentMarketTotalValueLockedUsd = 'parentMarket__totalValueLockedUSD',
  ParentMarketTotalValueLockedUsdUntracked = 'parentMarket__totalValueLockedUSDUntracked',
  ParentMarketTransactionHash = 'parentMarket__transactionHash',
  ParentMarketType = 'parentMarket__type',
  ParentMarketUntrackedVolumeUsd = 'parentMarket__untrackedVolumeUSD',
  ParentMarketUpperBound = 'parentMarket__upperBound',
  ParentMarketVolume = 'parentMarket__volume',
  ParentMarketVolumeUsd = 'parentMarket__volumeUSD',
  ParentOutcome = 'parentOutcome',
  PayoutNumerators = 'payoutNumerators',
  PayoutReported = 'payoutReported',
  QuestionId = 'questionId',
  Questions = 'questions',
  QuestionsInArbitration = 'questionsInArbitration',
  TemplateId = 'templateId',
  Tokens = 'tokens',
  TotalValueLockedUsd = 'totalValueLockedUSD',
  TotalValueLockedUsdUntracked = 'totalValueLockedUSDUntracked',
  TransactionHash = 'transactionHash',
  Type = 'type',
  UntrackedVolumeUsd = 'untrackedVolumeUSD',
  UpperBound = 'upperBound',
  Volume = 'volume',
  VolumeUsd = 'volumeUSD',
  WrappedTokens = 'wrappedTokens',
  WrappedTokensString = 'wrappedTokensString'
}

export type MarketsCount = {
  __typename?: 'MarketsCount';
  count: Scalars['BigInt'];
  id: Scalars['ID'];
};

export type MarketsCount_Filter = {
  /** Filter for the block changed event. */
  _change_block?: Maybe<BlockChangedFilter>;
  and?: Maybe<Array<Maybe<MarketsCount_Filter>>>;
  count?: Maybe<Scalars['BigInt']>;
  count_gt?: Maybe<Scalars['BigInt']>;
  count_gte?: Maybe<Scalars['BigInt']>;
  count_in?: Maybe<Array<Scalars['BigInt']>>;
  count_lt?: Maybe<Scalars['BigInt']>;
  count_lte?: Maybe<Scalars['BigInt']>;
  count_not?: Maybe<Scalars['BigInt']>;
  count_not_in?: Maybe<Array<Scalars['BigInt']>>;
  id?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_lt?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
  or?: Maybe<Array<Maybe<MarketsCount_Filter>>>;
};

export enum MarketsCount_OrderBy {
  Count = 'count',
  Id = 'id'
}

export type MetaEvidence = {
  __typename?: 'MetaEvidence';
  /** The URI of the meta evidence file. */
  URI: Scalars['String'];
  /** The meta evidence ID. */
  id: Scalars['ID'];
};

export type MetaEvidence_Filter = {
  URI?: Maybe<Scalars['String']>;
  URI_contains?: Maybe<Scalars['String']>;
  URI_contains_nocase?: Maybe<Scalars['String']>;
  URI_ends_with?: Maybe<Scalars['String']>;
  URI_ends_with_nocase?: Maybe<Scalars['String']>;
  URI_gt?: Maybe<Scalars['String']>;
  URI_gte?: Maybe<Scalars['String']>;
  URI_in?: Maybe<Array<Scalars['String']>>;
  URI_lt?: Maybe<Scalars['String']>;
  URI_lte?: Maybe<Scalars['String']>;
  URI_not?: Maybe<Scalars['String']>;
  URI_not_contains?: Maybe<Scalars['String']>;
  URI_not_contains_nocase?: Maybe<Scalars['String']>;
  URI_not_ends_with?: Maybe<Scalars['String']>;
  URI_not_ends_with_nocase?: Maybe<Scalars['String']>;
  URI_not_in?: Maybe<Array<Scalars['String']>>;
  URI_not_starts_with?: Maybe<Scalars['String']>;
  URI_not_starts_with_nocase?: Maybe<Scalars['String']>;
  URI_starts_with?: Maybe<Scalars['String']>;
  URI_starts_with_nocase?: Maybe<Scalars['String']>;
  /** Filter for the block changed event. */
  _change_block?: Maybe<BlockChangedFilter>;
  and?: Maybe<Array<Maybe<MetaEvidence_Filter>>>;
  id?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_lt?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
  or?: Maybe<Array<Maybe<MetaEvidence_Filter>>>;
};

export enum MetaEvidence_OrderBy {
  Uri = 'URI',
  Id = 'id'
}

export type MetaItemProp = {
  __typename?: 'MetaItemProp';
  id: Scalars['ID'];
  market: Scalars['String'];
  metaitem: LItemMetametadata;
  outcomes: Array<Scalars['String']>;
};

export type MetaItemProp_Filter = {
  /** Filter for the block changed event. */
  _change_block?: Maybe<BlockChangedFilter>;
  and?: Maybe<Array<Maybe<MetaItemProp_Filter>>>;
  id?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_lt?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
  market?: Maybe<Scalars['String']>;
  market_contains?: Maybe<Scalars['String']>;
  market_contains_nocase?: Maybe<Scalars['String']>;
  market_ends_with?: Maybe<Scalars['String']>;
  market_ends_with_nocase?: Maybe<Scalars['String']>;
  market_gt?: Maybe<Scalars['String']>;
  market_gte?: Maybe<Scalars['String']>;
  market_in?: Maybe<Array<Scalars['String']>>;
  market_lt?: Maybe<Scalars['String']>;
  market_lte?: Maybe<Scalars['String']>;
  market_not?: Maybe<Scalars['String']>;
  market_not_contains?: Maybe<Scalars['String']>;
  market_not_contains_nocase?: Maybe<Scalars['String']>;
  market_not_ends_with?: Maybe<Scalars['String']>;
  market_not_ends_with_nocase?: Maybe<Scalars['String']>;
  market_not_in?: Maybe<Array<Scalars['String']>>;
  market_not_starts_with?: Maybe<Scalars['String']>;
  market_not_starts_with_nocase?: Maybe<Scalars['String']>;
  market_starts_with?: Maybe<Scalars['String']>;
  market_starts_with_nocase?: Maybe<Scalars['String']>;
  metaitem?: Maybe<Scalars['String']>;
  metaitem_?: Maybe<LItemMetametadata_Filter>;
  metaitem_contains?: Maybe<Scalars['String']>;
  metaitem_contains_nocase?: Maybe<Scalars['String']>;
  metaitem_ends_with?: Maybe<Scalars['String']>;
  metaitem_ends_with_nocase?: Maybe<Scalars['String']>;
  metaitem_gt?: Maybe<Scalars['String']>;
  metaitem_gte?: Maybe<Scalars['String']>;
  metaitem_in?: Maybe<Array<Scalars['String']>>;
  metaitem_lt?: Maybe<Scalars['String']>;
  metaitem_lte?: Maybe<Scalars['String']>;
  metaitem_not?: Maybe<Scalars['String']>;
  metaitem_not_contains?: Maybe<Scalars['String']>;
  metaitem_not_contains_nocase?: Maybe<Scalars['String']>;
  metaitem_not_ends_with?: Maybe<Scalars['String']>;
  metaitem_not_ends_with_nocase?: Maybe<Scalars['String']>;
  metaitem_not_in?: Maybe<Array<Scalars['String']>>;
  metaitem_not_starts_with?: Maybe<Scalars['String']>;
  metaitem_not_starts_with_nocase?: Maybe<Scalars['String']>;
  metaitem_starts_with?: Maybe<Scalars['String']>;
  metaitem_starts_with_nocase?: Maybe<Scalars['String']>;
  or?: Maybe<Array<Maybe<MetaItemProp_Filter>>>;
  outcomes?: Maybe<Array<Scalars['String']>>;
  outcomes_contains?: Maybe<Array<Scalars['String']>>;
  outcomes_contains_nocase?: Maybe<Array<Scalars['String']>>;
  outcomes_not?: Maybe<Array<Scalars['String']>>;
  outcomes_not_contains?: Maybe<Array<Scalars['String']>>;
  outcomes_not_contains_nocase?: Maybe<Array<Scalars['String']>>;
};

export enum MetaItemProp_OrderBy {
  Id = 'id',
  Market = 'market',
  Metaitem = 'metaitem',
  MetaitemId = 'metaitem__id',
  MetaitemKey0 = 'metaitem__key0',
  MetaitemKey1 = 'metaitem__key1',
  MetaitemKey2 = 'metaitem__key2',
  MetaitemKey3 = 'metaitem__key3',
  MetaitemKey4 = 'metaitem__key4',
  MetaitemKeywords = 'metaitem__keywords',
  Outcomes = 'outcomes'
}

export type Mint = {
  __typename?: 'Mint';
  amount: Scalars['BigInt'];
  amount0: Scalars['BigDecimal'];
  amount1: Scalars['BigDecimal'];
  amountUSD?: Maybe<Scalars['BigDecimal']>;
  id: Scalars['ID'];
  logIndex?: Maybe<Scalars['BigInt']>;
  origin: Scalars['Bytes'];
  owner: Scalars['Bytes'];
  pool: Pool;
  sender?: Maybe<Scalars['Bytes']>;
  tickLower: Scalars['BigInt'];
  tickUpper: Scalars['BigInt'];
  timestamp: Scalars['BigInt'];
  token0: Token;
  token1: Token;
  transaction: Transaction;
};

export type Mint_Filter = {
  /** Filter for the block changed event. */
  _change_block?: Maybe<BlockChangedFilter>;
  amount?: Maybe<Scalars['BigInt']>;
  amount0?: Maybe<Scalars['BigDecimal']>;
  amount0_gt?: Maybe<Scalars['BigDecimal']>;
  amount0_gte?: Maybe<Scalars['BigDecimal']>;
  amount0_in?: Maybe<Array<Scalars['BigDecimal']>>;
  amount0_lt?: Maybe<Scalars['BigDecimal']>;
  amount0_lte?: Maybe<Scalars['BigDecimal']>;
  amount0_not?: Maybe<Scalars['BigDecimal']>;
  amount0_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
  amount1?: Maybe<Scalars['BigDecimal']>;
  amount1_gt?: Maybe<Scalars['BigDecimal']>;
  amount1_gte?: Maybe<Scalars['BigDecimal']>;
  amount1_in?: Maybe<Array<Scalars['BigDecimal']>>;
  amount1_lt?: Maybe<Scalars['BigDecimal']>;
  amount1_lte?: Maybe<Scalars['BigDecimal']>;
  amount1_not?: Maybe<Scalars['BigDecimal']>;
  amount1_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
  amountUSD?: Maybe<Scalars['BigDecimal']>;
  amountUSD_gt?: Maybe<Scalars['BigDecimal']>;
  amountUSD_gte?: Maybe<Scalars['BigDecimal']>;
  amountUSD_in?: Maybe<Array<Scalars['BigDecimal']>>;
  amountUSD_lt?: Maybe<Scalars['BigDecimal']>;
  amountUSD_lte?: Maybe<Scalars['BigDecimal']>;
  amountUSD_not?: Maybe<Scalars['BigDecimal']>;
  amountUSD_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
  amount_gt?: Maybe<Scalars['BigInt']>;
  amount_gte?: Maybe<Scalars['BigInt']>;
  amount_in?: Maybe<Array<Scalars['BigInt']>>;
  amount_lt?: Maybe<Scalars['BigInt']>;
  amount_lte?: Maybe<Scalars['BigInt']>;
  amount_not?: Maybe<Scalars['BigInt']>;
  amount_not_in?: Maybe<Array<Scalars['BigInt']>>;
  and?: Maybe<Array<Maybe<Mint_Filter>>>;
  id?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_lt?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
  logIndex?: Maybe<Scalars['BigInt']>;
  logIndex_gt?: Maybe<Scalars['BigInt']>;
  logIndex_gte?: Maybe<Scalars['BigInt']>;
  logIndex_in?: Maybe<Array<Scalars['BigInt']>>;
  logIndex_lt?: Maybe<Scalars['BigInt']>;
  logIndex_lte?: Maybe<Scalars['BigInt']>;
  logIndex_not?: Maybe<Scalars['BigInt']>;
  logIndex_not_in?: Maybe<Array<Scalars['BigInt']>>;
  or?: Maybe<Array<Maybe<Mint_Filter>>>;
  origin?: Maybe<Scalars['Bytes']>;
  origin_contains?: Maybe<Scalars['Bytes']>;
  origin_gt?: Maybe<Scalars['Bytes']>;
  origin_gte?: Maybe<Scalars['Bytes']>;
  origin_in?: Maybe<Array<Scalars['Bytes']>>;
  origin_lt?: Maybe<Scalars['Bytes']>;
  origin_lte?: Maybe<Scalars['Bytes']>;
  origin_not?: Maybe<Scalars['Bytes']>;
  origin_not_contains?: Maybe<Scalars['Bytes']>;
  origin_not_in?: Maybe<Array<Scalars['Bytes']>>;
  owner?: Maybe<Scalars['Bytes']>;
  owner_contains?: Maybe<Scalars['Bytes']>;
  owner_gt?: Maybe<Scalars['Bytes']>;
  owner_gte?: Maybe<Scalars['Bytes']>;
  owner_in?: Maybe<Array<Scalars['Bytes']>>;
  owner_lt?: Maybe<Scalars['Bytes']>;
  owner_lte?: Maybe<Scalars['Bytes']>;
  owner_not?: Maybe<Scalars['Bytes']>;
  owner_not_contains?: Maybe<Scalars['Bytes']>;
  owner_not_in?: Maybe<Array<Scalars['Bytes']>>;
  pool?: Maybe<Scalars['String']>;
  pool_?: Maybe<Pool_Filter>;
  pool_contains?: Maybe<Scalars['String']>;
  pool_contains_nocase?: Maybe<Scalars['String']>;
  pool_ends_with?: Maybe<Scalars['String']>;
  pool_ends_with_nocase?: Maybe<Scalars['String']>;
  pool_gt?: Maybe<Scalars['String']>;
  pool_gte?: Maybe<Scalars['String']>;
  pool_in?: Maybe<Array<Scalars['String']>>;
  pool_lt?: Maybe<Scalars['String']>;
  pool_lte?: Maybe<Scalars['String']>;
  pool_not?: Maybe<Scalars['String']>;
  pool_not_contains?: Maybe<Scalars['String']>;
  pool_not_contains_nocase?: Maybe<Scalars['String']>;
  pool_not_ends_with?: Maybe<Scalars['String']>;
  pool_not_ends_with_nocase?: Maybe<Scalars['String']>;
  pool_not_in?: Maybe<Array<Scalars['String']>>;
  pool_not_starts_with?: Maybe<Scalars['String']>;
  pool_not_starts_with_nocase?: Maybe<Scalars['String']>;
  pool_starts_with?: Maybe<Scalars['String']>;
  pool_starts_with_nocase?: Maybe<Scalars['String']>;
  sender?: Maybe<Scalars['Bytes']>;
  sender_contains?: Maybe<Scalars['Bytes']>;
  sender_gt?: Maybe<Scalars['Bytes']>;
  sender_gte?: Maybe<Scalars['Bytes']>;
  sender_in?: Maybe<Array<Scalars['Bytes']>>;
  sender_lt?: Maybe<Scalars['Bytes']>;
  sender_lte?: Maybe<Scalars['Bytes']>;
  sender_not?: Maybe<Scalars['Bytes']>;
  sender_not_contains?: Maybe<Scalars['Bytes']>;
  sender_not_in?: Maybe<Array<Scalars['Bytes']>>;
  tickLower?: Maybe<Scalars['BigInt']>;
  tickLower_gt?: Maybe<Scalars['BigInt']>;
  tickLower_gte?: Maybe<Scalars['BigInt']>;
  tickLower_in?: Maybe<Array<Scalars['BigInt']>>;
  tickLower_lt?: Maybe<Scalars['BigInt']>;
  tickLower_lte?: Maybe<Scalars['BigInt']>;
  tickLower_not?: Maybe<Scalars['BigInt']>;
  tickLower_not_in?: Maybe<Array<Scalars['BigInt']>>;
  tickUpper?: Maybe<Scalars['BigInt']>;
  tickUpper_gt?: Maybe<Scalars['BigInt']>;
  tickUpper_gte?: Maybe<Scalars['BigInt']>;
  tickUpper_in?: Maybe<Array<Scalars['BigInt']>>;
  tickUpper_lt?: Maybe<Scalars['BigInt']>;
  tickUpper_lte?: Maybe<Scalars['BigInt']>;
  tickUpper_not?: Maybe<Scalars['BigInt']>;
  tickUpper_not_in?: Maybe<Array<Scalars['BigInt']>>;
  timestamp?: Maybe<Scalars['BigInt']>;
  timestamp_gt?: Maybe<Scalars['BigInt']>;
  timestamp_gte?: Maybe<Scalars['BigInt']>;
  timestamp_in?: Maybe<Array<Scalars['BigInt']>>;
  timestamp_lt?: Maybe<Scalars['BigInt']>;
  timestamp_lte?: Maybe<Scalars['BigInt']>;
  timestamp_not?: Maybe<Scalars['BigInt']>;
  timestamp_not_in?: Maybe<Array<Scalars['BigInt']>>;
  token0?: Maybe<Scalars['String']>;
  token0_?: Maybe<Token_Filter>;
  token0_contains?: Maybe<Scalars['String']>;
  token0_contains_nocase?: Maybe<Scalars['String']>;
  token0_ends_with?: Maybe<Scalars['String']>;
  token0_ends_with_nocase?: Maybe<Scalars['String']>;
  token0_gt?: Maybe<Scalars['String']>;
  token0_gte?: Maybe<Scalars['String']>;
  token0_in?: Maybe<Array<Scalars['String']>>;
  token0_lt?: Maybe<Scalars['String']>;
  token0_lte?: Maybe<Scalars['String']>;
  token0_not?: Maybe<Scalars['String']>;
  token0_not_contains?: Maybe<Scalars['String']>;
  token0_not_contains_nocase?: Maybe<Scalars['String']>;
  token0_not_ends_with?: Maybe<Scalars['String']>;
  token0_not_ends_with_nocase?: Maybe<Scalars['String']>;
  token0_not_in?: Maybe<Array<Scalars['String']>>;
  token0_not_starts_with?: Maybe<Scalars['String']>;
  token0_not_starts_with_nocase?: Maybe<Scalars['String']>;
  token0_starts_with?: Maybe<Scalars['String']>;
  token0_starts_with_nocase?: Maybe<Scalars['String']>;
  token1?: Maybe<Scalars['String']>;
  token1_?: Maybe<Token_Filter>;
  token1_contains?: Maybe<Scalars['String']>;
  token1_contains_nocase?: Maybe<Scalars['String']>;
  token1_ends_with?: Maybe<Scalars['String']>;
  token1_ends_with_nocase?: Maybe<Scalars['String']>;
  token1_gt?: Maybe<Scalars['String']>;
  token1_gte?: Maybe<Scalars['String']>;
  token1_in?: Maybe<Array<Scalars['String']>>;
  token1_lt?: Maybe<Scalars['String']>;
  token1_lte?: Maybe<Scalars['String']>;
  token1_not?: Maybe<Scalars['String']>;
  token1_not_contains?: Maybe<Scalars['String']>;
  token1_not_contains_nocase?: Maybe<Scalars['String']>;
  token1_not_ends_with?: Maybe<Scalars['String']>;
  token1_not_ends_with_nocase?: Maybe<Scalars['String']>;
  token1_not_in?: Maybe<Array<Scalars['String']>>;
  token1_not_starts_with?: Maybe<Scalars['String']>;
  token1_not_starts_with_nocase?: Maybe<Scalars['String']>;
  token1_starts_with?: Maybe<Scalars['String']>;
  token1_starts_with_nocase?: Maybe<Scalars['String']>;
  transaction?: Maybe<Scalars['String']>;
  transaction_?: Maybe<Transaction_Filter>;
  transaction_contains?: Maybe<Scalars['String']>;
  transaction_contains_nocase?: Maybe<Scalars['String']>;
  transaction_ends_with?: Maybe<Scalars['String']>;
  transaction_ends_with_nocase?: Maybe<Scalars['String']>;
  transaction_gt?: Maybe<Scalars['String']>;
  transaction_gte?: Maybe<Scalars['String']>;
  transaction_in?: Maybe<Array<Scalars['String']>>;
  transaction_lt?: Maybe<Scalars['String']>;
  transaction_lte?: Maybe<Scalars['String']>;
  transaction_not?: Maybe<Scalars['String']>;
  transaction_not_contains?: Maybe<Scalars['String']>;
  transaction_not_contains_nocase?: Maybe<Scalars['String']>;
  transaction_not_ends_with?: Maybe<Scalars['String']>;
  transaction_not_ends_with_nocase?: Maybe<Scalars['String']>;
  transaction_not_in?: Maybe<Array<Scalars['String']>>;
  transaction_not_starts_with?: Maybe<Scalars['String']>;
  transaction_not_starts_with_nocase?: Maybe<Scalars['String']>;
  transaction_starts_with?: Maybe<Scalars['String']>;
  transaction_starts_with_nocase?: Maybe<Scalars['String']>;
};

export enum Mint_OrderBy {
  Amount = 'amount',
  Amount0 = 'amount0',
  Amount1 = 'amount1',
  AmountUsd = 'amountUSD',
  Id = 'id',
  LogIndex = 'logIndex',
  Origin = 'origin',
  Owner = 'owner',
  Pool = 'pool',
  PoolCollectedFeesToken0 = 'pool__collectedFeesToken0',
  PoolCollectedFeesToken1 = 'pool__collectedFeesToken1',
  PoolCollectedFeesUsd = 'pool__collectedFeesUSD',
  PoolCommunityFee0 = 'pool__communityFee0',
  PoolCommunityFee1 = 'pool__communityFee1',
  PoolCreatedAtBlockNumber = 'pool__createdAtBlockNumber',
  PoolCreatedAtTimestamp = 'pool__createdAtTimestamp',
  PoolFee = 'pool__fee',
  PoolFeeGrowthGlobal0X128 = 'pool__feeGrowthGlobal0X128',
  PoolFeeGrowthGlobal1X128 = 'pool__feeGrowthGlobal1X128',
  PoolFeesToken0 = 'pool__feesToken0',
  PoolFeesToken1 = 'pool__feesToken1',
  PoolFeesUsd = 'pool__feesUSD',
  PoolId = 'pool__id',
  PoolLiquidity = 'pool__liquidity',
  PoolLiquidityProviderCount = 'pool__liquidityProviderCount',
  PoolObservationIndex = 'pool__observationIndex',
  PoolSqrtPrice = 'pool__sqrtPrice',
  PoolTick = 'pool__tick',
  PoolTickSpacing = 'pool__tickSpacing',
  PoolToken0Price = 'pool__token0Price',
  PoolToken1Price = 'pool__token1Price',
  PoolTotalValueLockedMatic = 'pool__totalValueLockedMatic',
  PoolTotalValueLockedToken0 = 'pool__totalValueLockedToken0',
  PoolTotalValueLockedToken1 = 'pool__totalValueLockedToken1',
  PoolTotalValueLockedUsd = 'pool__totalValueLockedUSD',
  PoolTotalValueLockedUsdUntracked = 'pool__totalValueLockedUSDUntracked',
  PoolTxCount = 'pool__txCount',
  PoolUntrackedFeesUsd = 'pool__untrackedFeesUSD',
  PoolUntrackedVolumeUsd = 'pool__untrackedVolumeUSD',
  PoolVolumeToken0 = 'pool__volumeToken0',
  PoolVolumeToken1 = 'pool__volumeToken1',
  PoolVolumeUsd = 'pool__volumeUSD',
  Sender = 'sender',
  TickLower = 'tickLower',
  TickUpper = 'tickUpper',
  Timestamp = 'timestamp',
  Token0 = 'token0',
  Token0Decimals = 'token0__decimals',
  Token0DerivedMatic = 'token0__derivedMatic',
  Token0FeesUsd = 'token0__feesUSD',
  Token0Id = 'token0__id',
  Token0IsSeer = 'token0__isSeer',
  Token0Name = 'token0__name',
  Token0PoolCount = 'token0__poolCount',
  Token0Symbol = 'token0__symbol',
  Token0TotalSupply = 'token0__totalSupply',
  Token0TotalValueLocked = 'token0__totalValueLocked',
  Token0TotalValueLockedUsd = 'token0__totalValueLockedUSD',
  Token0TotalValueLockedUsdUntracked = 'token0__totalValueLockedUSDUntracked',
  Token0TxCount = 'token0__txCount',
  Token0UntrackedVolumeUsd = 'token0__untrackedVolumeUSD',
  Token0Volume = 'token0__volume',
  Token0VolumeUsd = 'token0__volumeUSD',
  Token1 = 'token1',
  Token1Decimals = 'token1__decimals',
  Token1DerivedMatic = 'token1__derivedMatic',
  Token1FeesUsd = 'token1__feesUSD',
  Token1Id = 'token1__id',
  Token1IsSeer = 'token1__isSeer',
  Token1Name = 'token1__name',
  Token1PoolCount = 'token1__poolCount',
  Token1Symbol = 'token1__symbol',
  Token1TotalSupply = 'token1__totalSupply',
  Token1TotalValueLocked = 'token1__totalValueLocked',
  Token1TotalValueLockedUsd = 'token1__totalValueLockedUSD',
  Token1TotalValueLockedUsdUntracked = 'token1__totalValueLockedUSDUntracked',
  Token1TxCount = 'token1__txCount',
  Token1UntrackedVolumeUsd = 'token1__untrackedVolumeUSD',
  Token1Volume = 'token1__volume',
  Token1VolumeUsd = 'token1__volumeUSD',
  Transaction = 'transaction',
  TransactionBlockNumber = 'transaction__blockNumber',
  TransactionGasLimit = 'transaction__gasLimit',
  TransactionGasPrice = 'transaction__gasPrice',
  TransactionId = 'transaction__id',
  TransactionTimestamp = 'transaction__timestamp'
}

/** Defines the order direction, either ascending or descending */
export enum OrderDirection {
  Asc = 'asc',
  Desc = 'desc'
}

export type Pool = {
  __typename?: 'Pool';
  burns: Array<Burn>;
  collectedFeesToken0: Scalars['BigDecimal'];
  collectedFeesToken1: Scalars['BigDecimal'];
  collectedFeesUSD: Scalars['BigDecimal'];
  collects: Array<Collect>;
  communityFee0: Scalars['BigInt'];
  communityFee1: Scalars['BigInt'];
  createdAtBlockNumber: Scalars['BigInt'];
  createdAtTimestamp: Scalars['BigInt'];
  eternalFarm?: Maybe<EternalFarming>;
  fee: Scalars['BigInt'];
  feeGrowthGlobal0X128: Scalars['BigInt'];
  feeGrowthGlobal1X128: Scalars['BigInt'];
  feesToken0: Scalars['BigDecimal'];
  feesToken1: Scalars['BigDecimal'];
  feesUSD: Scalars['BigDecimal'];
  id: Scalars['ID'];
  liquidity: Scalars['BigInt'];
  liquidityProviderCount: Scalars['BigInt'];
  market0?: Maybe<Market>;
  market1?: Maybe<Market>;
  mints: Array<Mint>;
  observationIndex: Scalars['BigInt'];
  poolDayData: Array<PoolDayData>;
  poolHourData: Array<PoolHourData>;
  sqrtPrice: Scalars['BigInt'];
  swaps: Array<Swap>;
  tick: Scalars['BigInt'];
  tickSpacing: Scalars['BigInt'];
  ticks: Array<Tick>;
  token0: Token;
  token0Price: Scalars['BigDecimal'];
  token1: Token;
  token1Price: Scalars['BigDecimal'];
  totalValueLockedMatic: Scalars['BigDecimal'];
  totalValueLockedToken0: Scalars['BigDecimal'];
  totalValueLockedToken1: Scalars['BigDecimal'];
  totalValueLockedUSD: Scalars['BigDecimal'];
  totalValueLockedUSDUntracked: Scalars['BigDecimal'];
  txCount: Scalars['BigInt'];
  untrackedFeesUSD: Scalars['BigDecimal'];
  untrackedVolumeUSD: Scalars['BigDecimal'];
  volumeToken0: Scalars['BigDecimal'];
  volumeToken1: Scalars['BigDecimal'];
  volumeUSD: Scalars['BigDecimal'];
};


export type PoolBurnsArgs = {
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Burn_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  skip?: Maybe<Scalars['Int']>;
  where?: Maybe<Burn_Filter>;
};


export type PoolCollectsArgs = {
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Collect_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  skip?: Maybe<Scalars['Int']>;
  where?: Maybe<Collect_Filter>;
};


export type PoolMintsArgs = {
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Mint_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  skip?: Maybe<Scalars['Int']>;
  where?: Maybe<Mint_Filter>;
};


export type PoolPoolDayDataArgs = {
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<PoolDayData_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  skip?: Maybe<Scalars['Int']>;
  where?: Maybe<PoolDayData_Filter>;
};


export type PoolPoolHourDataArgs = {
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<PoolHourData_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  skip?: Maybe<Scalars['Int']>;
  where?: Maybe<PoolHourData_Filter>;
};


export type PoolSwapsArgs = {
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Swap_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  skip?: Maybe<Scalars['Int']>;
  where?: Maybe<Swap_Filter>;
};


export type PoolTicksArgs = {
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Tick_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  skip?: Maybe<Scalars['Int']>;
  where?: Maybe<Tick_Filter>;
};

export type PoolDayData = {
  __typename?: 'PoolDayData';
  close: Scalars['BigDecimal'];
  date: Scalars['Int'];
  feeGrowthGlobal0X128: Scalars['BigInt'];
  feeGrowthGlobal1X128: Scalars['BigInt'];
  feesToken0: Scalars['BigDecimal'];
  feesToken1: Scalars['BigDecimal'];
  feesUSD: Scalars['BigDecimal'];
  high: Scalars['BigDecimal'];
  id: Scalars['ID'];
  liquidity: Scalars['BigInt'];
  low: Scalars['BigDecimal'];
  open: Scalars['BigDecimal'];
  pool: Pool;
  sqrtPrice: Scalars['BigInt'];
  tick?: Maybe<Scalars['BigInt']>;
  token0Price: Scalars['BigDecimal'];
  token1Price: Scalars['BigDecimal'];
  tvlUSD: Scalars['BigDecimal'];
  txCount: Scalars['BigInt'];
  untrackedVolumeUSD: Scalars['BigDecimal'];
  volumeToken0: Scalars['BigDecimal'];
  volumeToken1: Scalars['BigDecimal'];
  volumeUSD: Scalars['BigDecimal'];
};

export type PoolDayData_Filter = {
  /** Filter for the block changed event. */
  _change_block?: Maybe<BlockChangedFilter>;
  and?: Maybe<Array<Maybe<PoolDayData_Filter>>>;
  close?: Maybe<Scalars['BigDecimal']>;
  close_gt?: Maybe<Scalars['BigDecimal']>;
  close_gte?: Maybe<Scalars['BigDecimal']>;
  close_in?: Maybe<Array<Scalars['BigDecimal']>>;
  close_lt?: Maybe<Scalars['BigDecimal']>;
  close_lte?: Maybe<Scalars['BigDecimal']>;
  close_not?: Maybe<Scalars['BigDecimal']>;
  close_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
  date?: Maybe<Scalars['Int']>;
  date_gt?: Maybe<Scalars['Int']>;
  date_gte?: Maybe<Scalars['Int']>;
  date_in?: Maybe<Array<Scalars['Int']>>;
  date_lt?: Maybe<Scalars['Int']>;
  date_lte?: Maybe<Scalars['Int']>;
  date_not?: Maybe<Scalars['Int']>;
  date_not_in?: Maybe<Array<Scalars['Int']>>;
  feeGrowthGlobal0X128?: Maybe<Scalars['BigInt']>;
  feeGrowthGlobal0X128_gt?: Maybe<Scalars['BigInt']>;
  feeGrowthGlobal0X128_gte?: Maybe<Scalars['BigInt']>;
  feeGrowthGlobal0X128_in?: Maybe<Array<Scalars['BigInt']>>;
  feeGrowthGlobal0X128_lt?: Maybe<Scalars['BigInt']>;
  feeGrowthGlobal0X128_lte?: Maybe<Scalars['BigInt']>;
  feeGrowthGlobal0X128_not?: Maybe<Scalars['BigInt']>;
  feeGrowthGlobal0X128_not_in?: Maybe<Array<Scalars['BigInt']>>;
  feeGrowthGlobal1X128?: Maybe<Scalars['BigInt']>;
  feeGrowthGlobal1X128_gt?: Maybe<Scalars['BigInt']>;
  feeGrowthGlobal1X128_gte?: Maybe<Scalars['BigInt']>;
  feeGrowthGlobal1X128_in?: Maybe<Array<Scalars['BigInt']>>;
  feeGrowthGlobal1X128_lt?: Maybe<Scalars['BigInt']>;
  feeGrowthGlobal1X128_lte?: Maybe<Scalars['BigInt']>;
  feeGrowthGlobal1X128_not?: Maybe<Scalars['BigInt']>;
  feeGrowthGlobal1X128_not_in?: Maybe<Array<Scalars['BigInt']>>;
  feesToken0?: Maybe<Scalars['BigDecimal']>;
  feesToken0_gt?: Maybe<Scalars['BigDecimal']>;
  feesToken0_gte?: Maybe<Scalars['BigDecimal']>;
  feesToken0_in?: Maybe<Array<Scalars['BigDecimal']>>;
  feesToken0_lt?: Maybe<Scalars['BigDecimal']>;
  feesToken0_lte?: Maybe<Scalars['BigDecimal']>;
  feesToken0_not?: Maybe<Scalars['BigDecimal']>;
  feesToken0_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
  feesToken1?: Maybe<Scalars['BigDecimal']>;
  feesToken1_gt?: Maybe<Scalars['BigDecimal']>;
  feesToken1_gte?: Maybe<Scalars['BigDecimal']>;
  feesToken1_in?: Maybe<Array<Scalars['BigDecimal']>>;
  feesToken1_lt?: Maybe<Scalars['BigDecimal']>;
  feesToken1_lte?: Maybe<Scalars['BigDecimal']>;
  feesToken1_not?: Maybe<Scalars['BigDecimal']>;
  feesToken1_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
  feesUSD?: Maybe<Scalars['BigDecimal']>;
  feesUSD_gt?: Maybe<Scalars['BigDecimal']>;
  feesUSD_gte?: Maybe<Scalars['BigDecimal']>;
  feesUSD_in?: Maybe<Array<Scalars['BigDecimal']>>;
  feesUSD_lt?: Maybe<Scalars['BigDecimal']>;
  feesUSD_lte?: Maybe<Scalars['BigDecimal']>;
  feesUSD_not?: Maybe<Scalars['BigDecimal']>;
  feesUSD_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
  high?: Maybe<Scalars['BigDecimal']>;
  high_gt?: Maybe<Scalars['BigDecimal']>;
  high_gte?: Maybe<Scalars['BigDecimal']>;
  high_in?: Maybe<Array<Scalars['BigDecimal']>>;
  high_lt?: Maybe<Scalars['BigDecimal']>;
  high_lte?: Maybe<Scalars['BigDecimal']>;
  high_not?: Maybe<Scalars['BigDecimal']>;
  high_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
  id?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_lt?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
  liquidity?: Maybe<Scalars['BigInt']>;
  liquidity_gt?: Maybe<Scalars['BigInt']>;
  liquidity_gte?: Maybe<Scalars['BigInt']>;
  liquidity_in?: Maybe<Array<Scalars['BigInt']>>;
  liquidity_lt?: Maybe<Scalars['BigInt']>;
  liquidity_lte?: Maybe<Scalars['BigInt']>;
  liquidity_not?: Maybe<Scalars['BigInt']>;
  liquidity_not_in?: Maybe<Array<Scalars['BigInt']>>;
  low?: Maybe<Scalars['BigDecimal']>;
  low_gt?: Maybe<Scalars['BigDecimal']>;
  low_gte?: Maybe<Scalars['BigDecimal']>;
  low_in?: Maybe<Array<Scalars['BigDecimal']>>;
  low_lt?: Maybe<Scalars['BigDecimal']>;
  low_lte?: Maybe<Scalars['BigDecimal']>;
  low_not?: Maybe<Scalars['BigDecimal']>;
  low_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
  open?: Maybe<Scalars['BigDecimal']>;
  open_gt?: Maybe<Scalars['BigDecimal']>;
  open_gte?: Maybe<Scalars['BigDecimal']>;
  open_in?: Maybe<Array<Scalars['BigDecimal']>>;
  open_lt?: Maybe<Scalars['BigDecimal']>;
  open_lte?: Maybe<Scalars['BigDecimal']>;
  open_not?: Maybe<Scalars['BigDecimal']>;
  open_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
  or?: Maybe<Array<Maybe<PoolDayData_Filter>>>;
  pool?: Maybe<Scalars['String']>;
  pool_?: Maybe<Pool_Filter>;
  pool_contains?: Maybe<Scalars['String']>;
  pool_contains_nocase?: Maybe<Scalars['String']>;
  pool_ends_with?: Maybe<Scalars['String']>;
  pool_ends_with_nocase?: Maybe<Scalars['String']>;
  pool_gt?: Maybe<Scalars['String']>;
  pool_gte?: Maybe<Scalars['String']>;
  pool_in?: Maybe<Array<Scalars['String']>>;
  pool_lt?: Maybe<Scalars['String']>;
  pool_lte?: Maybe<Scalars['String']>;
  pool_not?: Maybe<Scalars['String']>;
  pool_not_contains?: Maybe<Scalars['String']>;
  pool_not_contains_nocase?: Maybe<Scalars['String']>;
  pool_not_ends_with?: Maybe<Scalars['String']>;
  pool_not_ends_with_nocase?: Maybe<Scalars['String']>;
  pool_not_in?: Maybe<Array<Scalars['String']>>;
  pool_not_starts_with?: Maybe<Scalars['String']>;
  pool_not_starts_with_nocase?: Maybe<Scalars['String']>;
  pool_starts_with?: Maybe<Scalars['String']>;
  pool_starts_with_nocase?: Maybe<Scalars['String']>;
  sqrtPrice?: Maybe<Scalars['BigInt']>;
  sqrtPrice_gt?: Maybe<Scalars['BigInt']>;
  sqrtPrice_gte?: Maybe<Scalars['BigInt']>;
  sqrtPrice_in?: Maybe<Array<Scalars['BigInt']>>;
  sqrtPrice_lt?: Maybe<Scalars['BigInt']>;
  sqrtPrice_lte?: Maybe<Scalars['BigInt']>;
  sqrtPrice_not?: Maybe<Scalars['BigInt']>;
  sqrtPrice_not_in?: Maybe<Array<Scalars['BigInt']>>;
  tick?: Maybe<Scalars['BigInt']>;
  tick_gt?: Maybe<Scalars['BigInt']>;
  tick_gte?: Maybe<Scalars['BigInt']>;
  tick_in?: Maybe<Array<Scalars['BigInt']>>;
  tick_lt?: Maybe<Scalars['BigInt']>;
  tick_lte?: Maybe<Scalars['BigInt']>;
  tick_not?: Maybe<Scalars['BigInt']>;
  tick_not_in?: Maybe<Array<Scalars['BigInt']>>;
  token0Price?: Maybe<Scalars['BigDecimal']>;
  token0Price_gt?: Maybe<Scalars['BigDecimal']>;
  token0Price_gte?: Maybe<Scalars['BigDecimal']>;
  token0Price_in?: Maybe<Array<Scalars['BigDecimal']>>;
  token0Price_lt?: Maybe<Scalars['BigDecimal']>;
  token0Price_lte?: Maybe<Scalars['BigDecimal']>;
  token0Price_not?: Maybe<Scalars['BigDecimal']>;
  token0Price_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
  token1Price?: Maybe<Scalars['BigDecimal']>;
  token1Price_gt?: Maybe<Scalars['BigDecimal']>;
  token1Price_gte?: Maybe<Scalars['BigDecimal']>;
  token1Price_in?: Maybe<Array<Scalars['BigDecimal']>>;
  token1Price_lt?: Maybe<Scalars['BigDecimal']>;
  token1Price_lte?: Maybe<Scalars['BigDecimal']>;
  token1Price_not?: Maybe<Scalars['BigDecimal']>;
  token1Price_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
  tvlUSD?: Maybe<Scalars['BigDecimal']>;
  tvlUSD_gt?: Maybe<Scalars['BigDecimal']>;
  tvlUSD_gte?: Maybe<Scalars['BigDecimal']>;
  tvlUSD_in?: Maybe<Array<Scalars['BigDecimal']>>;
  tvlUSD_lt?: Maybe<Scalars['BigDecimal']>;
  tvlUSD_lte?: Maybe<Scalars['BigDecimal']>;
  tvlUSD_not?: Maybe<Scalars['BigDecimal']>;
  tvlUSD_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
  txCount?: Maybe<Scalars['BigInt']>;
  txCount_gt?: Maybe<Scalars['BigInt']>;
  txCount_gte?: Maybe<Scalars['BigInt']>;
  txCount_in?: Maybe<Array<Scalars['BigInt']>>;
  txCount_lt?: Maybe<Scalars['BigInt']>;
  txCount_lte?: Maybe<Scalars['BigInt']>;
  txCount_not?: Maybe<Scalars['BigInt']>;
  txCount_not_in?: Maybe<Array<Scalars['BigInt']>>;
  untrackedVolumeUSD?: Maybe<Scalars['BigDecimal']>;
  untrackedVolumeUSD_gt?: Maybe<Scalars['BigDecimal']>;
  untrackedVolumeUSD_gte?: Maybe<Scalars['BigDecimal']>;
  untrackedVolumeUSD_in?: Maybe<Array<Scalars['BigDecimal']>>;
  untrackedVolumeUSD_lt?: Maybe<Scalars['BigDecimal']>;
  untrackedVolumeUSD_lte?: Maybe<Scalars['BigDecimal']>;
  untrackedVolumeUSD_not?: Maybe<Scalars['BigDecimal']>;
  untrackedVolumeUSD_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
  volumeToken0?: Maybe<Scalars['BigDecimal']>;
  volumeToken0_gt?: Maybe<Scalars['BigDecimal']>;
  volumeToken0_gte?: Maybe<Scalars['BigDecimal']>;
  volumeToken0_in?: Maybe<Array<Scalars['BigDecimal']>>;
  volumeToken0_lt?: Maybe<Scalars['BigDecimal']>;
  volumeToken0_lte?: Maybe<Scalars['BigDecimal']>;
  volumeToken0_not?: Maybe<Scalars['BigDecimal']>;
  volumeToken0_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
  volumeToken1?: Maybe<Scalars['BigDecimal']>;
  volumeToken1_gt?: Maybe<Scalars['BigDecimal']>;
  volumeToken1_gte?: Maybe<Scalars['BigDecimal']>;
  volumeToken1_in?: Maybe<Array<Scalars['BigDecimal']>>;
  volumeToken1_lt?: Maybe<Scalars['BigDecimal']>;
  volumeToken1_lte?: Maybe<Scalars['BigDecimal']>;
  volumeToken1_not?: Maybe<Scalars['BigDecimal']>;
  volumeToken1_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
  volumeUSD?: Maybe<Scalars['BigDecimal']>;
  volumeUSD_gt?: Maybe<Scalars['BigDecimal']>;
  volumeUSD_gte?: Maybe<Scalars['BigDecimal']>;
  volumeUSD_in?: Maybe<Array<Scalars['BigDecimal']>>;
  volumeUSD_lt?: Maybe<Scalars['BigDecimal']>;
  volumeUSD_lte?: Maybe<Scalars['BigDecimal']>;
  volumeUSD_not?: Maybe<Scalars['BigDecimal']>;
  volumeUSD_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
};

export enum PoolDayData_OrderBy {
  Close = 'close',
  Date = 'date',
  FeeGrowthGlobal0X128 = 'feeGrowthGlobal0X128',
  FeeGrowthGlobal1X128 = 'feeGrowthGlobal1X128',
  FeesToken0 = 'feesToken0',
  FeesToken1 = 'feesToken1',
  FeesUsd = 'feesUSD',
  High = 'high',
  Id = 'id',
  Liquidity = 'liquidity',
  Low = 'low',
  Open = 'open',
  Pool = 'pool',
  PoolCollectedFeesToken0 = 'pool__collectedFeesToken0',
  PoolCollectedFeesToken1 = 'pool__collectedFeesToken1',
  PoolCollectedFeesUsd = 'pool__collectedFeesUSD',
  PoolCommunityFee0 = 'pool__communityFee0',
  PoolCommunityFee1 = 'pool__communityFee1',
  PoolCreatedAtBlockNumber = 'pool__createdAtBlockNumber',
  PoolCreatedAtTimestamp = 'pool__createdAtTimestamp',
  PoolFee = 'pool__fee',
  PoolFeeGrowthGlobal0X128 = 'pool__feeGrowthGlobal0X128',
  PoolFeeGrowthGlobal1X128 = 'pool__feeGrowthGlobal1X128',
  PoolFeesToken0 = 'pool__feesToken0',
  PoolFeesToken1 = 'pool__feesToken1',
  PoolFeesUsd = 'pool__feesUSD',
  PoolId = 'pool__id',
  PoolLiquidity = 'pool__liquidity',
  PoolLiquidityProviderCount = 'pool__liquidityProviderCount',
  PoolObservationIndex = 'pool__observationIndex',
  PoolSqrtPrice = 'pool__sqrtPrice',
  PoolTick = 'pool__tick',
  PoolTickSpacing = 'pool__tickSpacing',
  PoolToken0Price = 'pool__token0Price',
  PoolToken1Price = 'pool__token1Price',
  PoolTotalValueLockedMatic = 'pool__totalValueLockedMatic',
  PoolTotalValueLockedToken0 = 'pool__totalValueLockedToken0',
  PoolTotalValueLockedToken1 = 'pool__totalValueLockedToken1',
  PoolTotalValueLockedUsd = 'pool__totalValueLockedUSD',
  PoolTotalValueLockedUsdUntracked = 'pool__totalValueLockedUSDUntracked',
  PoolTxCount = 'pool__txCount',
  PoolUntrackedFeesUsd = 'pool__untrackedFeesUSD',
  PoolUntrackedVolumeUsd = 'pool__untrackedVolumeUSD',
  PoolVolumeToken0 = 'pool__volumeToken0',
  PoolVolumeToken1 = 'pool__volumeToken1',
  PoolVolumeUsd = 'pool__volumeUSD',
  SqrtPrice = 'sqrtPrice',
  Tick = 'tick',
  Token0Price = 'token0Price',
  Token1Price = 'token1Price',
  TvlUsd = 'tvlUSD',
  TxCount = 'txCount',
  UntrackedVolumeUsd = 'untrackedVolumeUSD',
  VolumeToken0 = 'volumeToken0',
  VolumeToken1 = 'volumeToken1',
  VolumeUsd = 'volumeUSD'
}

export type PoolFeeData = {
  __typename?: 'PoolFeeData';
  fee: Scalars['BigInt'];
  id: Scalars['ID'];
  pool?: Maybe<Scalars['String']>;
  timestamp: Scalars['BigInt'];
};

export type PoolFeeData_Filter = {
  /** Filter for the block changed event. */
  _change_block?: Maybe<BlockChangedFilter>;
  and?: Maybe<Array<Maybe<PoolFeeData_Filter>>>;
  fee?: Maybe<Scalars['BigInt']>;
  fee_gt?: Maybe<Scalars['BigInt']>;
  fee_gte?: Maybe<Scalars['BigInt']>;
  fee_in?: Maybe<Array<Scalars['BigInt']>>;
  fee_lt?: Maybe<Scalars['BigInt']>;
  fee_lte?: Maybe<Scalars['BigInt']>;
  fee_not?: Maybe<Scalars['BigInt']>;
  fee_not_in?: Maybe<Array<Scalars['BigInt']>>;
  id?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_lt?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
  or?: Maybe<Array<Maybe<PoolFeeData_Filter>>>;
  pool?: Maybe<Scalars['String']>;
  pool_contains?: Maybe<Scalars['String']>;
  pool_contains_nocase?: Maybe<Scalars['String']>;
  pool_ends_with?: Maybe<Scalars['String']>;
  pool_ends_with_nocase?: Maybe<Scalars['String']>;
  pool_gt?: Maybe<Scalars['String']>;
  pool_gte?: Maybe<Scalars['String']>;
  pool_in?: Maybe<Array<Scalars['String']>>;
  pool_lt?: Maybe<Scalars['String']>;
  pool_lte?: Maybe<Scalars['String']>;
  pool_not?: Maybe<Scalars['String']>;
  pool_not_contains?: Maybe<Scalars['String']>;
  pool_not_contains_nocase?: Maybe<Scalars['String']>;
  pool_not_ends_with?: Maybe<Scalars['String']>;
  pool_not_ends_with_nocase?: Maybe<Scalars['String']>;
  pool_not_in?: Maybe<Array<Scalars['String']>>;
  pool_not_starts_with?: Maybe<Scalars['String']>;
  pool_not_starts_with_nocase?: Maybe<Scalars['String']>;
  pool_starts_with?: Maybe<Scalars['String']>;
  pool_starts_with_nocase?: Maybe<Scalars['String']>;
  timestamp?: Maybe<Scalars['BigInt']>;
  timestamp_gt?: Maybe<Scalars['BigInt']>;
  timestamp_gte?: Maybe<Scalars['BigInt']>;
  timestamp_in?: Maybe<Array<Scalars['BigInt']>>;
  timestamp_lt?: Maybe<Scalars['BigInt']>;
  timestamp_lte?: Maybe<Scalars['BigInt']>;
  timestamp_not?: Maybe<Scalars['BigInt']>;
  timestamp_not_in?: Maybe<Array<Scalars['BigInt']>>;
};

export enum PoolFeeData_OrderBy {
  Fee = 'fee',
  Id = 'id',
  Pool = 'pool',
  Timestamp = 'timestamp'
}

export type PoolHourData = {
  __typename?: 'PoolHourData';
  close: Scalars['BigDecimal'];
  feeGrowthGlobal0X128: Scalars['BigInt'];
  feeGrowthGlobal1X128: Scalars['BigInt'];
  feesUSD: Scalars['BigDecimal'];
  high: Scalars['BigDecimal'];
  id: Scalars['ID'];
  liquidity: Scalars['BigInt'];
  low: Scalars['BigDecimal'];
  open: Scalars['BigDecimal'];
  periodStartUnix: Scalars['Int'];
  pool: Pool;
  sqrtPrice: Scalars['BigInt'];
  tick?: Maybe<Scalars['BigInt']>;
  token0Price: Scalars['BigDecimal'];
  token1Price: Scalars['BigDecimal'];
  tvlUSD: Scalars['BigDecimal'];
  txCount: Scalars['BigInt'];
  untrackedVolumeUSD: Scalars['BigDecimal'];
  volumeToken0: Scalars['BigDecimal'];
  volumeToken1: Scalars['BigDecimal'];
  volumeUSD: Scalars['BigDecimal'];
};

export type PoolHourData_Filter = {
  /** Filter for the block changed event. */
  _change_block?: Maybe<BlockChangedFilter>;
  and?: Maybe<Array<Maybe<PoolHourData_Filter>>>;
  close?: Maybe<Scalars['BigDecimal']>;
  close_gt?: Maybe<Scalars['BigDecimal']>;
  close_gte?: Maybe<Scalars['BigDecimal']>;
  close_in?: Maybe<Array<Scalars['BigDecimal']>>;
  close_lt?: Maybe<Scalars['BigDecimal']>;
  close_lte?: Maybe<Scalars['BigDecimal']>;
  close_not?: Maybe<Scalars['BigDecimal']>;
  close_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
  feeGrowthGlobal0X128?: Maybe<Scalars['BigInt']>;
  feeGrowthGlobal0X128_gt?: Maybe<Scalars['BigInt']>;
  feeGrowthGlobal0X128_gte?: Maybe<Scalars['BigInt']>;
  feeGrowthGlobal0X128_in?: Maybe<Array<Scalars['BigInt']>>;
  feeGrowthGlobal0X128_lt?: Maybe<Scalars['BigInt']>;
  feeGrowthGlobal0X128_lte?: Maybe<Scalars['BigInt']>;
  feeGrowthGlobal0X128_not?: Maybe<Scalars['BigInt']>;
  feeGrowthGlobal0X128_not_in?: Maybe<Array<Scalars['BigInt']>>;
  feeGrowthGlobal1X128?: Maybe<Scalars['BigInt']>;
  feeGrowthGlobal1X128_gt?: Maybe<Scalars['BigInt']>;
  feeGrowthGlobal1X128_gte?: Maybe<Scalars['BigInt']>;
  feeGrowthGlobal1X128_in?: Maybe<Array<Scalars['BigInt']>>;
  feeGrowthGlobal1X128_lt?: Maybe<Scalars['BigInt']>;
  feeGrowthGlobal1X128_lte?: Maybe<Scalars['BigInt']>;
  feeGrowthGlobal1X128_not?: Maybe<Scalars['BigInt']>;
  feeGrowthGlobal1X128_not_in?: Maybe<Array<Scalars['BigInt']>>;
  feesUSD?: Maybe<Scalars['BigDecimal']>;
  feesUSD_gt?: Maybe<Scalars['BigDecimal']>;
  feesUSD_gte?: Maybe<Scalars['BigDecimal']>;
  feesUSD_in?: Maybe<Array<Scalars['BigDecimal']>>;
  feesUSD_lt?: Maybe<Scalars['BigDecimal']>;
  feesUSD_lte?: Maybe<Scalars['BigDecimal']>;
  feesUSD_not?: Maybe<Scalars['BigDecimal']>;
  feesUSD_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
  high?: Maybe<Scalars['BigDecimal']>;
  high_gt?: Maybe<Scalars['BigDecimal']>;
  high_gte?: Maybe<Scalars['BigDecimal']>;
  high_in?: Maybe<Array<Scalars['BigDecimal']>>;
  high_lt?: Maybe<Scalars['BigDecimal']>;
  high_lte?: Maybe<Scalars['BigDecimal']>;
  high_not?: Maybe<Scalars['BigDecimal']>;
  high_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
  id?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_lt?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
  liquidity?: Maybe<Scalars['BigInt']>;
  liquidity_gt?: Maybe<Scalars['BigInt']>;
  liquidity_gte?: Maybe<Scalars['BigInt']>;
  liquidity_in?: Maybe<Array<Scalars['BigInt']>>;
  liquidity_lt?: Maybe<Scalars['BigInt']>;
  liquidity_lte?: Maybe<Scalars['BigInt']>;
  liquidity_not?: Maybe<Scalars['BigInt']>;
  liquidity_not_in?: Maybe<Array<Scalars['BigInt']>>;
  low?: Maybe<Scalars['BigDecimal']>;
  low_gt?: Maybe<Scalars['BigDecimal']>;
  low_gte?: Maybe<Scalars['BigDecimal']>;
  low_in?: Maybe<Array<Scalars['BigDecimal']>>;
  low_lt?: Maybe<Scalars['BigDecimal']>;
  low_lte?: Maybe<Scalars['BigDecimal']>;
  low_not?: Maybe<Scalars['BigDecimal']>;
  low_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
  open?: Maybe<Scalars['BigDecimal']>;
  open_gt?: Maybe<Scalars['BigDecimal']>;
  open_gte?: Maybe<Scalars['BigDecimal']>;
  open_in?: Maybe<Array<Scalars['BigDecimal']>>;
  open_lt?: Maybe<Scalars['BigDecimal']>;
  open_lte?: Maybe<Scalars['BigDecimal']>;
  open_not?: Maybe<Scalars['BigDecimal']>;
  open_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
  or?: Maybe<Array<Maybe<PoolHourData_Filter>>>;
  periodStartUnix?: Maybe<Scalars['Int']>;
  periodStartUnix_gt?: Maybe<Scalars['Int']>;
  periodStartUnix_gte?: Maybe<Scalars['Int']>;
  periodStartUnix_in?: Maybe<Array<Scalars['Int']>>;
  periodStartUnix_lt?: Maybe<Scalars['Int']>;
  periodStartUnix_lte?: Maybe<Scalars['Int']>;
  periodStartUnix_not?: Maybe<Scalars['Int']>;
  periodStartUnix_not_in?: Maybe<Array<Scalars['Int']>>;
  pool?: Maybe<Scalars['String']>;
  pool_?: Maybe<Pool_Filter>;
  pool_contains?: Maybe<Scalars['String']>;
  pool_contains_nocase?: Maybe<Scalars['String']>;
  pool_ends_with?: Maybe<Scalars['String']>;
  pool_ends_with_nocase?: Maybe<Scalars['String']>;
  pool_gt?: Maybe<Scalars['String']>;
  pool_gte?: Maybe<Scalars['String']>;
  pool_in?: Maybe<Array<Scalars['String']>>;
  pool_lt?: Maybe<Scalars['String']>;
  pool_lte?: Maybe<Scalars['String']>;
  pool_not?: Maybe<Scalars['String']>;
  pool_not_contains?: Maybe<Scalars['String']>;
  pool_not_contains_nocase?: Maybe<Scalars['String']>;
  pool_not_ends_with?: Maybe<Scalars['String']>;
  pool_not_ends_with_nocase?: Maybe<Scalars['String']>;
  pool_not_in?: Maybe<Array<Scalars['String']>>;
  pool_not_starts_with?: Maybe<Scalars['String']>;
  pool_not_starts_with_nocase?: Maybe<Scalars['String']>;
  pool_starts_with?: Maybe<Scalars['String']>;
  pool_starts_with_nocase?: Maybe<Scalars['String']>;
  sqrtPrice?: Maybe<Scalars['BigInt']>;
  sqrtPrice_gt?: Maybe<Scalars['BigInt']>;
  sqrtPrice_gte?: Maybe<Scalars['BigInt']>;
  sqrtPrice_in?: Maybe<Array<Scalars['BigInt']>>;
  sqrtPrice_lt?: Maybe<Scalars['BigInt']>;
  sqrtPrice_lte?: Maybe<Scalars['BigInt']>;
  sqrtPrice_not?: Maybe<Scalars['BigInt']>;
  sqrtPrice_not_in?: Maybe<Array<Scalars['BigInt']>>;
  tick?: Maybe<Scalars['BigInt']>;
  tick_gt?: Maybe<Scalars['BigInt']>;
  tick_gte?: Maybe<Scalars['BigInt']>;
  tick_in?: Maybe<Array<Scalars['BigInt']>>;
  tick_lt?: Maybe<Scalars['BigInt']>;
  tick_lte?: Maybe<Scalars['BigInt']>;
  tick_not?: Maybe<Scalars['BigInt']>;
  tick_not_in?: Maybe<Array<Scalars['BigInt']>>;
  token0Price?: Maybe<Scalars['BigDecimal']>;
  token0Price_gt?: Maybe<Scalars['BigDecimal']>;
  token0Price_gte?: Maybe<Scalars['BigDecimal']>;
  token0Price_in?: Maybe<Array<Scalars['BigDecimal']>>;
  token0Price_lt?: Maybe<Scalars['BigDecimal']>;
  token0Price_lte?: Maybe<Scalars['BigDecimal']>;
  token0Price_not?: Maybe<Scalars['BigDecimal']>;
  token0Price_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
  token1Price?: Maybe<Scalars['BigDecimal']>;
  token1Price_gt?: Maybe<Scalars['BigDecimal']>;
  token1Price_gte?: Maybe<Scalars['BigDecimal']>;
  token1Price_in?: Maybe<Array<Scalars['BigDecimal']>>;
  token1Price_lt?: Maybe<Scalars['BigDecimal']>;
  token1Price_lte?: Maybe<Scalars['BigDecimal']>;
  token1Price_not?: Maybe<Scalars['BigDecimal']>;
  token1Price_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
  tvlUSD?: Maybe<Scalars['BigDecimal']>;
  tvlUSD_gt?: Maybe<Scalars['BigDecimal']>;
  tvlUSD_gte?: Maybe<Scalars['BigDecimal']>;
  tvlUSD_in?: Maybe<Array<Scalars['BigDecimal']>>;
  tvlUSD_lt?: Maybe<Scalars['BigDecimal']>;
  tvlUSD_lte?: Maybe<Scalars['BigDecimal']>;
  tvlUSD_not?: Maybe<Scalars['BigDecimal']>;
  tvlUSD_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
  txCount?: Maybe<Scalars['BigInt']>;
  txCount_gt?: Maybe<Scalars['BigInt']>;
  txCount_gte?: Maybe<Scalars['BigInt']>;
  txCount_in?: Maybe<Array<Scalars['BigInt']>>;
  txCount_lt?: Maybe<Scalars['BigInt']>;
  txCount_lte?: Maybe<Scalars['BigInt']>;
  txCount_not?: Maybe<Scalars['BigInt']>;
  txCount_not_in?: Maybe<Array<Scalars['BigInt']>>;
  untrackedVolumeUSD?: Maybe<Scalars['BigDecimal']>;
  untrackedVolumeUSD_gt?: Maybe<Scalars['BigDecimal']>;
  untrackedVolumeUSD_gte?: Maybe<Scalars['BigDecimal']>;
  untrackedVolumeUSD_in?: Maybe<Array<Scalars['BigDecimal']>>;
  untrackedVolumeUSD_lt?: Maybe<Scalars['BigDecimal']>;
  untrackedVolumeUSD_lte?: Maybe<Scalars['BigDecimal']>;
  untrackedVolumeUSD_not?: Maybe<Scalars['BigDecimal']>;
  untrackedVolumeUSD_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
  volumeToken0?: Maybe<Scalars['BigDecimal']>;
  volumeToken0_gt?: Maybe<Scalars['BigDecimal']>;
  volumeToken0_gte?: Maybe<Scalars['BigDecimal']>;
  volumeToken0_in?: Maybe<Array<Scalars['BigDecimal']>>;
  volumeToken0_lt?: Maybe<Scalars['BigDecimal']>;
  volumeToken0_lte?: Maybe<Scalars['BigDecimal']>;
  volumeToken0_not?: Maybe<Scalars['BigDecimal']>;
  volumeToken0_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
  volumeToken1?: Maybe<Scalars['BigDecimal']>;
  volumeToken1_gt?: Maybe<Scalars['BigDecimal']>;
  volumeToken1_gte?: Maybe<Scalars['BigDecimal']>;
  volumeToken1_in?: Maybe<Array<Scalars['BigDecimal']>>;
  volumeToken1_lt?: Maybe<Scalars['BigDecimal']>;
  volumeToken1_lte?: Maybe<Scalars['BigDecimal']>;
  volumeToken1_not?: Maybe<Scalars['BigDecimal']>;
  volumeToken1_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
  volumeUSD?: Maybe<Scalars['BigDecimal']>;
  volumeUSD_gt?: Maybe<Scalars['BigDecimal']>;
  volumeUSD_gte?: Maybe<Scalars['BigDecimal']>;
  volumeUSD_in?: Maybe<Array<Scalars['BigDecimal']>>;
  volumeUSD_lt?: Maybe<Scalars['BigDecimal']>;
  volumeUSD_lte?: Maybe<Scalars['BigDecimal']>;
  volumeUSD_not?: Maybe<Scalars['BigDecimal']>;
  volumeUSD_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
};

export enum PoolHourData_OrderBy {
  Close = 'close',
  FeeGrowthGlobal0X128 = 'feeGrowthGlobal0X128',
  FeeGrowthGlobal1X128 = 'feeGrowthGlobal1X128',
  FeesUsd = 'feesUSD',
  High = 'high',
  Id = 'id',
  Liquidity = 'liquidity',
  Low = 'low',
  Open = 'open',
  PeriodStartUnix = 'periodStartUnix',
  Pool = 'pool',
  PoolCollectedFeesToken0 = 'pool__collectedFeesToken0',
  PoolCollectedFeesToken1 = 'pool__collectedFeesToken1',
  PoolCollectedFeesUsd = 'pool__collectedFeesUSD',
  PoolCommunityFee0 = 'pool__communityFee0',
  PoolCommunityFee1 = 'pool__communityFee1',
  PoolCreatedAtBlockNumber = 'pool__createdAtBlockNumber',
  PoolCreatedAtTimestamp = 'pool__createdAtTimestamp',
  PoolFee = 'pool__fee',
  PoolFeeGrowthGlobal0X128 = 'pool__feeGrowthGlobal0X128',
  PoolFeeGrowthGlobal1X128 = 'pool__feeGrowthGlobal1X128',
  PoolFeesToken0 = 'pool__feesToken0',
  PoolFeesToken1 = 'pool__feesToken1',
  PoolFeesUsd = 'pool__feesUSD',
  PoolId = 'pool__id',
  PoolLiquidity = 'pool__liquidity',
  PoolLiquidityProviderCount = 'pool__liquidityProviderCount',
  PoolObservationIndex = 'pool__observationIndex',
  PoolSqrtPrice = 'pool__sqrtPrice',
  PoolTick = 'pool__tick',
  PoolTickSpacing = 'pool__tickSpacing',
  PoolToken0Price = 'pool__token0Price',
  PoolToken1Price = 'pool__token1Price',
  PoolTotalValueLockedMatic = 'pool__totalValueLockedMatic',
  PoolTotalValueLockedToken0 = 'pool__totalValueLockedToken0',
  PoolTotalValueLockedToken1 = 'pool__totalValueLockedToken1',
  PoolTotalValueLockedUsd = 'pool__totalValueLockedUSD',
  PoolTotalValueLockedUsdUntracked = 'pool__totalValueLockedUSDUntracked',
  PoolTxCount = 'pool__txCount',
  PoolUntrackedFeesUsd = 'pool__untrackedFeesUSD',
  PoolUntrackedVolumeUsd = 'pool__untrackedVolumeUSD',
  PoolVolumeToken0 = 'pool__volumeToken0',
  PoolVolumeToken1 = 'pool__volumeToken1',
  PoolVolumeUsd = 'pool__volumeUSD',
  SqrtPrice = 'sqrtPrice',
  Tick = 'tick',
  Token0Price = 'token0Price',
  Token1Price = 'token1Price',
  TvlUsd = 'tvlUSD',
  TxCount = 'txCount',
  UntrackedVolumeUsd = 'untrackedVolumeUSD',
  VolumeToken0 = 'volumeToken0',
  VolumeToken1 = 'volumeToken1',
  VolumeUsd = 'volumeUSD'
}

export type PoolPosition = {
  __typename?: 'PoolPosition';
  id: Scalars['ID'];
  liquidity: Scalars['BigInt'];
  lowerTick: Tick;
  owner: Scalars['Bytes'];
  pool: Pool;
  upperTick: Tick;
};

export type PoolPosition_Filter = {
  /** Filter for the block changed event. */
  _change_block?: Maybe<BlockChangedFilter>;
  and?: Maybe<Array<Maybe<PoolPosition_Filter>>>;
  id?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_lt?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
  liquidity?: Maybe<Scalars['BigInt']>;
  liquidity_gt?: Maybe<Scalars['BigInt']>;
  liquidity_gte?: Maybe<Scalars['BigInt']>;
  liquidity_in?: Maybe<Array<Scalars['BigInt']>>;
  liquidity_lt?: Maybe<Scalars['BigInt']>;
  liquidity_lte?: Maybe<Scalars['BigInt']>;
  liquidity_not?: Maybe<Scalars['BigInt']>;
  liquidity_not_in?: Maybe<Array<Scalars['BigInt']>>;
  lowerTick?: Maybe<Scalars['String']>;
  lowerTick_?: Maybe<Tick_Filter>;
  lowerTick_contains?: Maybe<Scalars['String']>;
  lowerTick_contains_nocase?: Maybe<Scalars['String']>;
  lowerTick_ends_with?: Maybe<Scalars['String']>;
  lowerTick_ends_with_nocase?: Maybe<Scalars['String']>;
  lowerTick_gt?: Maybe<Scalars['String']>;
  lowerTick_gte?: Maybe<Scalars['String']>;
  lowerTick_in?: Maybe<Array<Scalars['String']>>;
  lowerTick_lt?: Maybe<Scalars['String']>;
  lowerTick_lte?: Maybe<Scalars['String']>;
  lowerTick_not?: Maybe<Scalars['String']>;
  lowerTick_not_contains?: Maybe<Scalars['String']>;
  lowerTick_not_contains_nocase?: Maybe<Scalars['String']>;
  lowerTick_not_ends_with?: Maybe<Scalars['String']>;
  lowerTick_not_ends_with_nocase?: Maybe<Scalars['String']>;
  lowerTick_not_in?: Maybe<Array<Scalars['String']>>;
  lowerTick_not_starts_with?: Maybe<Scalars['String']>;
  lowerTick_not_starts_with_nocase?: Maybe<Scalars['String']>;
  lowerTick_starts_with?: Maybe<Scalars['String']>;
  lowerTick_starts_with_nocase?: Maybe<Scalars['String']>;
  or?: Maybe<Array<Maybe<PoolPosition_Filter>>>;
  owner?: Maybe<Scalars['Bytes']>;
  owner_contains?: Maybe<Scalars['Bytes']>;
  owner_gt?: Maybe<Scalars['Bytes']>;
  owner_gte?: Maybe<Scalars['Bytes']>;
  owner_in?: Maybe<Array<Scalars['Bytes']>>;
  owner_lt?: Maybe<Scalars['Bytes']>;
  owner_lte?: Maybe<Scalars['Bytes']>;
  owner_not?: Maybe<Scalars['Bytes']>;
  owner_not_contains?: Maybe<Scalars['Bytes']>;
  owner_not_in?: Maybe<Array<Scalars['Bytes']>>;
  pool?: Maybe<Scalars['String']>;
  pool_?: Maybe<Pool_Filter>;
  pool_contains?: Maybe<Scalars['String']>;
  pool_contains_nocase?: Maybe<Scalars['String']>;
  pool_ends_with?: Maybe<Scalars['String']>;
  pool_ends_with_nocase?: Maybe<Scalars['String']>;
  pool_gt?: Maybe<Scalars['String']>;
  pool_gte?: Maybe<Scalars['String']>;
  pool_in?: Maybe<Array<Scalars['String']>>;
  pool_lt?: Maybe<Scalars['String']>;
  pool_lte?: Maybe<Scalars['String']>;
  pool_not?: Maybe<Scalars['String']>;
  pool_not_contains?: Maybe<Scalars['String']>;
  pool_not_contains_nocase?: Maybe<Scalars['String']>;
  pool_not_ends_with?: Maybe<Scalars['String']>;
  pool_not_ends_with_nocase?: Maybe<Scalars['String']>;
  pool_not_in?: Maybe<Array<Scalars['String']>>;
  pool_not_starts_with?: Maybe<Scalars['String']>;
  pool_not_starts_with_nocase?: Maybe<Scalars['String']>;
  pool_starts_with?: Maybe<Scalars['String']>;
  pool_starts_with_nocase?: Maybe<Scalars['String']>;
  upperTick?: Maybe<Scalars['String']>;
  upperTick_?: Maybe<Tick_Filter>;
  upperTick_contains?: Maybe<Scalars['String']>;
  upperTick_contains_nocase?: Maybe<Scalars['String']>;
  upperTick_ends_with?: Maybe<Scalars['String']>;
  upperTick_ends_with_nocase?: Maybe<Scalars['String']>;
  upperTick_gt?: Maybe<Scalars['String']>;
  upperTick_gte?: Maybe<Scalars['String']>;
  upperTick_in?: Maybe<Array<Scalars['String']>>;
  upperTick_lt?: Maybe<Scalars['String']>;
  upperTick_lte?: Maybe<Scalars['String']>;
  upperTick_not?: Maybe<Scalars['String']>;
  upperTick_not_contains?: Maybe<Scalars['String']>;
  upperTick_not_contains_nocase?: Maybe<Scalars['String']>;
  upperTick_not_ends_with?: Maybe<Scalars['String']>;
  upperTick_not_ends_with_nocase?: Maybe<Scalars['String']>;
  upperTick_not_in?: Maybe<Array<Scalars['String']>>;
  upperTick_not_starts_with?: Maybe<Scalars['String']>;
  upperTick_not_starts_with_nocase?: Maybe<Scalars['String']>;
  upperTick_starts_with?: Maybe<Scalars['String']>;
  upperTick_starts_with_nocase?: Maybe<Scalars['String']>;
};

export enum PoolPosition_OrderBy {
  Id = 'id',
  Liquidity = 'liquidity',
  LowerTick = 'lowerTick',
  LowerTickCollectedFeesToken0 = 'lowerTick__collectedFeesToken0',
  LowerTickCollectedFeesToken1 = 'lowerTick__collectedFeesToken1',
  LowerTickCollectedFeesUsd = 'lowerTick__collectedFeesUSD',
  LowerTickCreatedAtBlockNumber = 'lowerTick__createdAtBlockNumber',
  LowerTickCreatedAtTimestamp = 'lowerTick__createdAtTimestamp',
  LowerTickFeeGrowthOutside0X128 = 'lowerTick__feeGrowthOutside0X128',
  LowerTickFeeGrowthOutside1X128 = 'lowerTick__feeGrowthOutside1X128',
  LowerTickFeesUsd = 'lowerTick__feesUSD',
  LowerTickId = 'lowerTick__id',
  LowerTickLiquidityGross = 'lowerTick__liquidityGross',
  LowerTickLiquidityNet = 'lowerTick__liquidityNet',
  LowerTickLiquidityProviderCount = 'lowerTick__liquidityProviderCount',
  LowerTickPoolAddress = 'lowerTick__poolAddress',
  LowerTickPrice0 = 'lowerTick__price0',
  LowerTickPrice1 = 'lowerTick__price1',
  LowerTickTickIdx = 'lowerTick__tickIdx',
  LowerTickUntrackedVolumeUsd = 'lowerTick__untrackedVolumeUSD',
  LowerTickVolumeToken0 = 'lowerTick__volumeToken0',
  LowerTickVolumeToken1 = 'lowerTick__volumeToken1',
  LowerTickVolumeUsd = 'lowerTick__volumeUSD',
  Owner = 'owner',
  Pool = 'pool',
  PoolCollectedFeesToken0 = 'pool__collectedFeesToken0',
  PoolCollectedFeesToken1 = 'pool__collectedFeesToken1',
  PoolCollectedFeesUsd = 'pool__collectedFeesUSD',
  PoolCommunityFee0 = 'pool__communityFee0',
  PoolCommunityFee1 = 'pool__communityFee1',
  PoolCreatedAtBlockNumber = 'pool__createdAtBlockNumber',
  PoolCreatedAtTimestamp = 'pool__createdAtTimestamp',
  PoolFee = 'pool__fee',
  PoolFeeGrowthGlobal0X128 = 'pool__feeGrowthGlobal0X128',
  PoolFeeGrowthGlobal1X128 = 'pool__feeGrowthGlobal1X128',
  PoolFeesToken0 = 'pool__feesToken0',
  PoolFeesToken1 = 'pool__feesToken1',
  PoolFeesUsd = 'pool__feesUSD',
  PoolId = 'pool__id',
  PoolLiquidity = 'pool__liquidity',
  PoolLiquidityProviderCount = 'pool__liquidityProviderCount',
  PoolObservationIndex = 'pool__observationIndex',
  PoolSqrtPrice = 'pool__sqrtPrice',
  PoolTick = 'pool__tick',
  PoolTickSpacing = 'pool__tickSpacing',
  PoolToken0Price = 'pool__token0Price',
  PoolToken1Price = 'pool__token1Price',
  PoolTotalValueLockedMatic = 'pool__totalValueLockedMatic',
  PoolTotalValueLockedToken0 = 'pool__totalValueLockedToken0',
  PoolTotalValueLockedToken1 = 'pool__totalValueLockedToken1',
  PoolTotalValueLockedUsd = 'pool__totalValueLockedUSD',
  PoolTotalValueLockedUsdUntracked = 'pool__totalValueLockedUSDUntracked',
  PoolTxCount = 'pool__txCount',
  PoolUntrackedFeesUsd = 'pool__untrackedFeesUSD',
  PoolUntrackedVolumeUsd = 'pool__untrackedVolumeUSD',
  PoolVolumeToken0 = 'pool__volumeToken0',
  PoolVolumeToken1 = 'pool__volumeToken1',
  PoolVolumeUsd = 'pool__volumeUSD',
  UpperTick = 'upperTick',
  UpperTickCollectedFeesToken0 = 'upperTick__collectedFeesToken0',
  UpperTickCollectedFeesToken1 = 'upperTick__collectedFeesToken1',
  UpperTickCollectedFeesUsd = 'upperTick__collectedFeesUSD',
  UpperTickCreatedAtBlockNumber = 'upperTick__createdAtBlockNumber',
  UpperTickCreatedAtTimestamp = 'upperTick__createdAtTimestamp',
  UpperTickFeeGrowthOutside0X128 = 'upperTick__feeGrowthOutside0X128',
  UpperTickFeeGrowthOutside1X128 = 'upperTick__feeGrowthOutside1X128',
  UpperTickFeesUsd = 'upperTick__feesUSD',
  UpperTickId = 'upperTick__id',
  UpperTickLiquidityGross = 'upperTick__liquidityGross',
  UpperTickLiquidityNet = 'upperTick__liquidityNet',
  UpperTickLiquidityProviderCount = 'upperTick__liquidityProviderCount',
  UpperTickPoolAddress = 'upperTick__poolAddress',
  UpperTickPrice0 = 'upperTick__price0',
  UpperTickPrice1 = 'upperTick__price1',
  UpperTickTickIdx = 'upperTick__tickIdx',
  UpperTickUntrackedVolumeUsd = 'upperTick__untrackedVolumeUSD',
  UpperTickVolumeToken0 = 'upperTick__volumeToken0',
  UpperTickVolumeToken1 = 'upperTick__volumeToken1',
  UpperTickVolumeUsd = 'upperTick__volumeUSD'
}

export type Pool_Filter = {
  /** Filter for the block changed event. */
  _change_block?: Maybe<BlockChangedFilter>;
  and?: Maybe<Array<Maybe<Pool_Filter>>>;
  burns_?: Maybe<Burn_Filter>;
  collectedFeesToken0?: Maybe<Scalars['BigDecimal']>;
  collectedFeesToken0_gt?: Maybe<Scalars['BigDecimal']>;
  collectedFeesToken0_gte?: Maybe<Scalars['BigDecimal']>;
  collectedFeesToken0_in?: Maybe<Array<Scalars['BigDecimal']>>;
  collectedFeesToken0_lt?: Maybe<Scalars['BigDecimal']>;
  collectedFeesToken0_lte?: Maybe<Scalars['BigDecimal']>;
  collectedFeesToken0_not?: Maybe<Scalars['BigDecimal']>;
  collectedFeesToken0_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
  collectedFeesToken1?: Maybe<Scalars['BigDecimal']>;
  collectedFeesToken1_gt?: Maybe<Scalars['BigDecimal']>;
  collectedFeesToken1_gte?: Maybe<Scalars['BigDecimal']>;
  collectedFeesToken1_in?: Maybe<Array<Scalars['BigDecimal']>>;
  collectedFeesToken1_lt?: Maybe<Scalars['BigDecimal']>;
  collectedFeesToken1_lte?: Maybe<Scalars['BigDecimal']>;
  collectedFeesToken1_not?: Maybe<Scalars['BigDecimal']>;
  collectedFeesToken1_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
  collectedFeesUSD?: Maybe<Scalars['BigDecimal']>;
  collectedFeesUSD_gt?: Maybe<Scalars['BigDecimal']>;
  collectedFeesUSD_gte?: Maybe<Scalars['BigDecimal']>;
  collectedFeesUSD_in?: Maybe<Array<Scalars['BigDecimal']>>;
  collectedFeesUSD_lt?: Maybe<Scalars['BigDecimal']>;
  collectedFeesUSD_lte?: Maybe<Scalars['BigDecimal']>;
  collectedFeesUSD_not?: Maybe<Scalars['BigDecimal']>;
  collectedFeesUSD_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
  collects_?: Maybe<Collect_Filter>;
  communityFee0?: Maybe<Scalars['BigInt']>;
  communityFee0_gt?: Maybe<Scalars['BigInt']>;
  communityFee0_gte?: Maybe<Scalars['BigInt']>;
  communityFee0_in?: Maybe<Array<Scalars['BigInt']>>;
  communityFee0_lt?: Maybe<Scalars['BigInt']>;
  communityFee0_lte?: Maybe<Scalars['BigInt']>;
  communityFee0_not?: Maybe<Scalars['BigInt']>;
  communityFee0_not_in?: Maybe<Array<Scalars['BigInt']>>;
  communityFee1?: Maybe<Scalars['BigInt']>;
  communityFee1_gt?: Maybe<Scalars['BigInt']>;
  communityFee1_gte?: Maybe<Scalars['BigInt']>;
  communityFee1_in?: Maybe<Array<Scalars['BigInt']>>;
  communityFee1_lt?: Maybe<Scalars['BigInt']>;
  communityFee1_lte?: Maybe<Scalars['BigInt']>;
  communityFee1_not?: Maybe<Scalars['BigInt']>;
  communityFee1_not_in?: Maybe<Array<Scalars['BigInt']>>;
  createdAtBlockNumber?: Maybe<Scalars['BigInt']>;
  createdAtBlockNumber_gt?: Maybe<Scalars['BigInt']>;
  createdAtBlockNumber_gte?: Maybe<Scalars['BigInt']>;
  createdAtBlockNumber_in?: Maybe<Array<Scalars['BigInt']>>;
  createdAtBlockNumber_lt?: Maybe<Scalars['BigInt']>;
  createdAtBlockNumber_lte?: Maybe<Scalars['BigInt']>;
  createdAtBlockNumber_not?: Maybe<Scalars['BigInt']>;
  createdAtBlockNumber_not_in?: Maybe<Array<Scalars['BigInt']>>;
  createdAtTimestamp?: Maybe<Scalars['BigInt']>;
  createdAtTimestamp_gt?: Maybe<Scalars['BigInt']>;
  createdAtTimestamp_gte?: Maybe<Scalars['BigInt']>;
  createdAtTimestamp_in?: Maybe<Array<Scalars['BigInt']>>;
  createdAtTimestamp_lt?: Maybe<Scalars['BigInt']>;
  createdAtTimestamp_lte?: Maybe<Scalars['BigInt']>;
  createdAtTimestamp_not?: Maybe<Scalars['BigInt']>;
  createdAtTimestamp_not_in?: Maybe<Array<Scalars['BigInt']>>;
  eternalFarm_?: Maybe<EternalFarming_Filter>;
  fee?: Maybe<Scalars['BigInt']>;
  feeGrowthGlobal0X128?: Maybe<Scalars['BigInt']>;
  feeGrowthGlobal0X128_gt?: Maybe<Scalars['BigInt']>;
  feeGrowthGlobal0X128_gte?: Maybe<Scalars['BigInt']>;
  feeGrowthGlobal0X128_in?: Maybe<Array<Scalars['BigInt']>>;
  feeGrowthGlobal0X128_lt?: Maybe<Scalars['BigInt']>;
  feeGrowthGlobal0X128_lte?: Maybe<Scalars['BigInt']>;
  feeGrowthGlobal0X128_not?: Maybe<Scalars['BigInt']>;
  feeGrowthGlobal0X128_not_in?: Maybe<Array<Scalars['BigInt']>>;
  feeGrowthGlobal1X128?: Maybe<Scalars['BigInt']>;
  feeGrowthGlobal1X128_gt?: Maybe<Scalars['BigInt']>;
  feeGrowthGlobal1X128_gte?: Maybe<Scalars['BigInt']>;
  feeGrowthGlobal1X128_in?: Maybe<Array<Scalars['BigInt']>>;
  feeGrowthGlobal1X128_lt?: Maybe<Scalars['BigInt']>;
  feeGrowthGlobal1X128_lte?: Maybe<Scalars['BigInt']>;
  feeGrowthGlobal1X128_not?: Maybe<Scalars['BigInt']>;
  feeGrowthGlobal1X128_not_in?: Maybe<Array<Scalars['BigInt']>>;
  fee_gt?: Maybe<Scalars['BigInt']>;
  fee_gte?: Maybe<Scalars['BigInt']>;
  fee_in?: Maybe<Array<Scalars['BigInt']>>;
  fee_lt?: Maybe<Scalars['BigInt']>;
  fee_lte?: Maybe<Scalars['BigInt']>;
  fee_not?: Maybe<Scalars['BigInt']>;
  fee_not_in?: Maybe<Array<Scalars['BigInt']>>;
  feesToken0?: Maybe<Scalars['BigDecimal']>;
  feesToken0_gt?: Maybe<Scalars['BigDecimal']>;
  feesToken0_gte?: Maybe<Scalars['BigDecimal']>;
  feesToken0_in?: Maybe<Array<Scalars['BigDecimal']>>;
  feesToken0_lt?: Maybe<Scalars['BigDecimal']>;
  feesToken0_lte?: Maybe<Scalars['BigDecimal']>;
  feesToken0_not?: Maybe<Scalars['BigDecimal']>;
  feesToken0_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
  feesToken1?: Maybe<Scalars['BigDecimal']>;
  feesToken1_gt?: Maybe<Scalars['BigDecimal']>;
  feesToken1_gte?: Maybe<Scalars['BigDecimal']>;
  feesToken1_in?: Maybe<Array<Scalars['BigDecimal']>>;
  feesToken1_lt?: Maybe<Scalars['BigDecimal']>;
  feesToken1_lte?: Maybe<Scalars['BigDecimal']>;
  feesToken1_not?: Maybe<Scalars['BigDecimal']>;
  feesToken1_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
  feesUSD?: Maybe<Scalars['BigDecimal']>;
  feesUSD_gt?: Maybe<Scalars['BigDecimal']>;
  feesUSD_gte?: Maybe<Scalars['BigDecimal']>;
  feesUSD_in?: Maybe<Array<Scalars['BigDecimal']>>;
  feesUSD_lt?: Maybe<Scalars['BigDecimal']>;
  feesUSD_lte?: Maybe<Scalars['BigDecimal']>;
  feesUSD_not?: Maybe<Scalars['BigDecimal']>;
  feesUSD_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
  id?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_lt?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
  liquidity?: Maybe<Scalars['BigInt']>;
  liquidityProviderCount?: Maybe<Scalars['BigInt']>;
  liquidityProviderCount_gt?: Maybe<Scalars['BigInt']>;
  liquidityProviderCount_gte?: Maybe<Scalars['BigInt']>;
  liquidityProviderCount_in?: Maybe<Array<Scalars['BigInt']>>;
  liquidityProviderCount_lt?: Maybe<Scalars['BigInt']>;
  liquidityProviderCount_lte?: Maybe<Scalars['BigInt']>;
  liquidityProviderCount_not?: Maybe<Scalars['BigInt']>;
  liquidityProviderCount_not_in?: Maybe<Array<Scalars['BigInt']>>;
  liquidity_gt?: Maybe<Scalars['BigInt']>;
  liquidity_gte?: Maybe<Scalars['BigInt']>;
  liquidity_in?: Maybe<Array<Scalars['BigInt']>>;
  liquidity_lt?: Maybe<Scalars['BigInt']>;
  liquidity_lte?: Maybe<Scalars['BigInt']>;
  liquidity_not?: Maybe<Scalars['BigInt']>;
  liquidity_not_in?: Maybe<Array<Scalars['BigInt']>>;
  market0?: Maybe<Scalars['String']>;
  market0_?: Maybe<Market_Filter>;
  market0_contains?: Maybe<Scalars['String']>;
  market0_contains_nocase?: Maybe<Scalars['String']>;
  market0_ends_with?: Maybe<Scalars['String']>;
  market0_ends_with_nocase?: Maybe<Scalars['String']>;
  market0_gt?: Maybe<Scalars['String']>;
  market0_gte?: Maybe<Scalars['String']>;
  market0_in?: Maybe<Array<Scalars['String']>>;
  market0_lt?: Maybe<Scalars['String']>;
  market0_lte?: Maybe<Scalars['String']>;
  market0_not?: Maybe<Scalars['String']>;
  market0_not_contains?: Maybe<Scalars['String']>;
  market0_not_contains_nocase?: Maybe<Scalars['String']>;
  market0_not_ends_with?: Maybe<Scalars['String']>;
  market0_not_ends_with_nocase?: Maybe<Scalars['String']>;
  market0_not_in?: Maybe<Array<Scalars['String']>>;
  market0_not_starts_with?: Maybe<Scalars['String']>;
  market0_not_starts_with_nocase?: Maybe<Scalars['String']>;
  market0_starts_with?: Maybe<Scalars['String']>;
  market0_starts_with_nocase?: Maybe<Scalars['String']>;
  market1?: Maybe<Scalars['String']>;
  market1_?: Maybe<Market_Filter>;
  market1_contains?: Maybe<Scalars['String']>;
  market1_contains_nocase?: Maybe<Scalars['String']>;
  market1_ends_with?: Maybe<Scalars['String']>;
  market1_ends_with_nocase?: Maybe<Scalars['String']>;
  market1_gt?: Maybe<Scalars['String']>;
  market1_gte?: Maybe<Scalars['String']>;
  market1_in?: Maybe<Array<Scalars['String']>>;
  market1_lt?: Maybe<Scalars['String']>;
  market1_lte?: Maybe<Scalars['String']>;
  market1_not?: Maybe<Scalars['String']>;
  market1_not_contains?: Maybe<Scalars['String']>;
  market1_not_contains_nocase?: Maybe<Scalars['String']>;
  market1_not_ends_with?: Maybe<Scalars['String']>;
  market1_not_ends_with_nocase?: Maybe<Scalars['String']>;
  market1_not_in?: Maybe<Array<Scalars['String']>>;
  market1_not_starts_with?: Maybe<Scalars['String']>;
  market1_not_starts_with_nocase?: Maybe<Scalars['String']>;
  market1_starts_with?: Maybe<Scalars['String']>;
  market1_starts_with_nocase?: Maybe<Scalars['String']>;
  mints_?: Maybe<Mint_Filter>;
  observationIndex?: Maybe<Scalars['BigInt']>;
  observationIndex_gt?: Maybe<Scalars['BigInt']>;
  observationIndex_gte?: Maybe<Scalars['BigInt']>;
  observationIndex_in?: Maybe<Array<Scalars['BigInt']>>;
  observationIndex_lt?: Maybe<Scalars['BigInt']>;
  observationIndex_lte?: Maybe<Scalars['BigInt']>;
  observationIndex_not?: Maybe<Scalars['BigInt']>;
  observationIndex_not_in?: Maybe<Array<Scalars['BigInt']>>;
  or?: Maybe<Array<Maybe<Pool_Filter>>>;
  poolDayData_?: Maybe<PoolDayData_Filter>;
  poolHourData_?: Maybe<PoolHourData_Filter>;
  sqrtPrice?: Maybe<Scalars['BigInt']>;
  sqrtPrice_gt?: Maybe<Scalars['BigInt']>;
  sqrtPrice_gte?: Maybe<Scalars['BigInt']>;
  sqrtPrice_in?: Maybe<Array<Scalars['BigInt']>>;
  sqrtPrice_lt?: Maybe<Scalars['BigInt']>;
  sqrtPrice_lte?: Maybe<Scalars['BigInt']>;
  sqrtPrice_not?: Maybe<Scalars['BigInt']>;
  sqrtPrice_not_in?: Maybe<Array<Scalars['BigInt']>>;
  swaps_?: Maybe<Swap_Filter>;
  tick?: Maybe<Scalars['BigInt']>;
  tickSpacing?: Maybe<Scalars['BigInt']>;
  tickSpacing_gt?: Maybe<Scalars['BigInt']>;
  tickSpacing_gte?: Maybe<Scalars['BigInt']>;
  tickSpacing_in?: Maybe<Array<Scalars['BigInt']>>;
  tickSpacing_lt?: Maybe<Scalars['BigInt']>;
  tickSpacing_lte?: Maybe<Scalars['BigInt']>;
  tickSpacing_not?: Maybe<Scalars['BigInt']>;
  tickSpacing_not_in?: Maybe<Array<Scalars['BigInt']>>;
  tick_gt?: Maybe<Scalars['BigInt']>;
  tick_gte?: Maybe<Scalars['BigInt']>;
  tick_in?: Maybe<Array<Scalars['BigInt']>>;
  tick_lt?: Maybe<Scalars['BigInt']>;
  tick_lte?: Maybe<Scalars['BigInt']>;
  tick_not?: Maybe<Scalars['BigInt']>;
  tick_not_in?: Maybe<Array<Scalars['BigInt']>>;
  ticks_?: Maybe<Tick_Filter>;
  token0?: Maybe<Scalars['String']>;
  token0Price?: Maybe<Scalars['BigDecimal']>;
  token0Price_gt?: Maybe<Scalars['BigDecimal']>;
  token0Price_gte?: Maybe<Scalars['BigDecimal']>;
  token0Price_in?: Maybe<Array<Scalars['BigDecimal']>>;
  token0Price_lt?: Maybe<Scalars['BigDecimal']>;
  token0Price_lte?: Maybe<Scalars['BigDecimal']>;
  token0Price_not?: Maybe<Scalars['BigDecimal']>;
  token0Price_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
  token0_?: Maybe<Token_Filter>;
  token0_contains?: Maybe<Scalars['String']>;
  token0_contains_nocase?: Maybe<Scalars['String']>;
  token0_ends_with?: Maybe<Scalars['String']>;
  token0_ends_with_nocase?: Maybe<Scalars['String']>;
  token0_gt?: Maybe<Scalars['String']>;
  token0_gte?: Maybe<Scalars['String']>;
  token0_in?: Maybe<Array<Scalars['String']>>;
  token0_lt?: Maybe<Scalars['String']>;
  token0_lte?: Maybe<Scalars['String']>;
  token0_not?: Maybe<Scalars['String']>;
  token0_not_contains?: Maybe<Scalars['String']>;
  token0_not_contains_nocase?: Maybe<Scalars['String']>;
  token0_not_ends_with?: Maybe<Scalars['String']>;
  token0_not_ends_with_nocase?: Maybe<Scalars['String']>;
  token0_not_in?: Maybe<Array<Scalars['String']>>;
  token0_not_starts_with?: Maybe<Scalars['String']>;
  token0_not_starts_with_nocase?: Maybe<Scalars['String']>;
  token0_starts_with?: Maybe<Scalars['String']>;
  token0_starts_with_nocase?: Maybe<Scalars['String']>;
  token1?: Maybe<Scalars['String']>;
  token1Price?: Maybe<Scalars['BigDecimal']>;
  token1Price_gt?: Maybe<Scalars['BigDecimal']>;
  token1Price_gte?: Maybe<Scalars['BigDecimal']>;
  token1Price_in?: Maybe<Array<Scalars['BigDecimal']>>;
  token1Price_lt?: Maybe<Scalars['BigDecimal']>;
  token1Price_lte?: Maybe<Scalars['BigDecimal']>;
  token1Price_not?: Maybe<Scalars['BigDecimal']>;
  token1Price_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
  token1_?: Maybe<Token_Filter>;
  token1_contains?: Maybe<Scalars['String']>;
  token1_contains_nocase?: Maybe<Scalars['String']>;
  token1_ends_with?: Maybe<Scalars['String']>;
  token1_ends_with_nocase?: Maybe<Scalars['String']>;
  token1_gt?: Maybe<Scalars['String']>;
  token1_gte?: Maybe<Scalars['String']>;
  token1_in?: Maybe<Array<Scalars['String']>>;
  token1_lt?: Maybe<Scalars['String']>;
  token1_lte?: Maybe<Scalars['String']>;
  token1_not?: Maybe<Scalars['String']>;
  token1_not_contains?: Maybe<Scalars['String']>;
  token1_not_contains_nocase?: Maybe<Scalars['String']>;
  token1_not_ends_with?: Maybe<Scalars['String']>;
  token1_not_ends_with_nocase?: Maybe<Scalars['String']>;
  token1_not_in?: Maybe<Array<Scalars['String']>>;
  token1_not_starts_with?: Maybe<Scalars['String']>;
  token1_not_starts_with_nocase?: Maybe<Scalars['String']>;
  token1_starts_with?: Maybe<Scalars['String']>;
  token1_starts_with_nocase?: Maybe<Scalars['String']>;
  totalValueLockedMatic?: Maybe<Scalars['BigDecimal']>;
  totalValueLockedMatic_gt?: Maybe<Scalars['BigDecimal']>;
  totalValueLockedMatic_gte?: Maybe<Scalars['BigDecimal']>;
  totalValueLockedMatic_in?: Maybe<Array<Scalars['BigDecimal']>>;
  totalValueLockedMatic_lt?: Maybe<Scalars['BigDecimal']>;
  totalValueLockedMatic_lte?: Maybe<Scalars['BigDecimal']>;
  totalValueLockedMatic_not?: Maybe<Scalars['BigDecimal']>;
  totalValueLockedMatic_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
  totalValueLockedToken0?: Maybe<Scalars['BigDecimal']>;
  totalValueLockedToken0_gt?: Maybe<Scalars['BigDecimal']>;
  totalValueLockedToken0_gte?: Maybe<Scalars['BigDecimal']>;
  totalValueLockedToken0_in?: Maybe<Array<Scalars['BigDecimal']>>;
  totalValueLockedToken0_lt?: Maybe<Scalars['BigDecimal']>;
  totalValueLockedToken0_lte?: Maybe<Scalars['BigDecimal']>;
  totalValueLockedToken0_not?: Maybe<Scalars['BigDecimal']>;
  totalValueLockedToken0_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
  totalValueLockedToken1?: Maybe<Scalars['BigDecimal']>;
  totalValueLockedToken1_gt?: Maybe<Scalars['BigDecimal']>;
  totalValueLockedToken1_gte?: Maybe<Scalars['BigDecimal']>;
  totalValueLockedToken1_in?: Maybe<Array<Scalars['BigDecimal']>>;
  totalValueLockedToken1_lt?: Maybe<Scalars['BigDecimal']>;
  totalValueLockedToken1_lte?: Maybe<Scalars['BigDecimal']>;
  totalValueLockedToken1_not?: Maybe<Scalars['BigDecimal']>;
  totalValueLockedToken1_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
  totalValueLockedUSD?: Maybe<Scalars['BigDecimal']>;
  totalValueLockedUSDUntracked?: Maybe<Scalars['BigDecimal']>;
  totalValueLockedUSDUntracked_gt?: Maybe<Scalars['BigDecimal']>;
  totalValueLockedUSDUntracked_gte?: Maybe<Scalars['BigDecimal']>;
  totalValueLockedUSDUntracked_in?: Maybe<Array<Scalars['BigDecimal']>>;
  totalValueLockedUSDUntracked_lt?: Maybe<Scalars['BigDecimal']>;
  totalValueLockedUSDUntracked_lte?: Maybe<Scalars['BigDecimal']>;
  totalValueLockedUSDUntracked_not?: Maybe<Scalars['BigDecimal']>;
  totalValueLockedUSDUntracked_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
  totalValueLockedUSD_gt?: Maybe<Scalars['BigDecimal']>;
  totalValueLockedUSD_gte?: Maybe<Scalars['BigDecimal']>;
  totalValueLockedUSD_in?: Maybe<Array<Scalars['BigDecimal']>>;
  totalValueLockedUSD_lt?: Maybe<Scalars['BigDecimal']>;
  totalValueLockedUSD_lte?: Maybe<Scalars['BigDecimal']>;
  totalValueLockedUSD_not?: Maybe<Scalars['BigDecimal']>;
  totalValueLockedUSD_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
  txCount?: Maybe<Scalars['BigInt']>;
  txCount_gt?: Maybe<Scalars['BigInt']>;
  txCount_gte?: Maybe<Scalars['BigInt']>;
  txCount_in?: Maybe<Array<Scalars['BigInt']>>;
  txCount_lt?: Maybe<Scalars['BigInt']>;
  txCount_lte?: Maybe<Scalars['BigInt']>;
  txCount_not?: Maybe<Scalars['BigInt']>;
  txCount_not_in?: Maybe<Array<Scalars['BigInt']>>;
  untrackedFeesUSD?: Maybe<Scalars['BigDecimal']>;
  untrackedFeesUSD_gt?: Maybe<Scalars['BigDecimal']>;
  untrackedFeesUSD_gte?: Maybe<Scalars['BigDecimal']>;
  untrackedFeesUSD_in?: Maybe<Array<Scalars['BigDecimal']>>;
  untrackedFeesUSD_lt?: Maybe<Scalars['BigDecimal']>;
  untrackedFeesUSD_lte?: Maybe<Scalars['BigDecimal']>;
  untrackedFeesUSD_not?: Maybe<Scalars['BigDecimal']>;
  untrackedFeesUSD_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
  untrackedVolumeUSD?: Maybe<Scalars['BigDecimal']>;
  untrackedVolumeUSD_gt?: Maybe<Scalars['BigDecimal']>;
  untrackedVolumeUSD_gte?: Maybe<Scalars['BigDecimal']>;
  untrackedVolumeUSD_in?: Maybe<Array<Scalars['BigDecimal']>>;
  untrackedVolumeUSD_lt?: Maybe<Scalars['BigDecimal']>;
  untrackedVolumeUSD_lte?: Maybe<Scalars['BigDecimal']>;
  untrackedVolumeUSD_not?: Maybe<Scalars['BigDecimal']>;
  untrackedVolumeUSD_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
  volumeToken0?: Maybe<Scalars['BigDecimal']>;
  volumeToken0_gt?: Maybe<Scalars['BigDecimal']>;
  volumeToken0_gte?: Maybe<Scalars['BigDecimal']>;
  volumeToken0_in?: Maybe<Array<Scalars['BigDecimal']>>;
  volumeToken0_lt?: Maybe<Scalars['BigDecimal']>;
  volumeToken0_lte?: Maybe<Scalars['BigDecimal']>;
  volumeToken0_not?: Maybe<Scalars['BigDecimal']>;
  volumeToken0_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
  volumeToken1?: Maybe<Scalars['BigDecimal']>;
  volumeToken1_gt?: Maybe<Scalars['BigDecimal']>;
  volumeToken1_gte?: Maybe<Scalars['BigDecimal']>;
  volumeToken1_in?: Maybe<Array<Scalars['BigDecimal']>>;
  volumeToken1_lt?: Maybe<Scalars['BigDecimal']>;
  volumeToken1_lte?: Maybe<Scalars['BigDecimal']>;
  volumeToken1_not?: Maybe<Scalars['BigDecimal']>;
  volumeToken1_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
  volumeUSD?: Maybe<Scalars['BigDecimal']>;
  volumeUSD_gt?: Maybe<Scalars['BigDecimal']>;
  volumeUSD_gte?: Maybe<Scalars['BigDecimal']>;
  volumeUSD_in?: Maybe<Array<Scalars['BigDecimal']>>;
  volumeUSD_lt?: Maybe<Scalars['BigDecimal']>;
  volumeUSD_lte?: Maybe<Scalars['BigDecimal']>;
  volumeUSD_not?: Maybe<Scalars['BigDecimal']>;
  volumeUSD_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
};

export enum Pool_OrderBy {
  Burns = 'burns',
  CollectedFeesToken0 = 'collectedFeesToken0',
  CollectedFeesToken1 = 'collectedFeesToken1',
  CollectedFeesUsd = 'collectedFeesUSD',
  Collects = 'collects',
  CommunityFee0 = 'communityFee0',
  CommunityFee1 = 'communityFee1',
  CreatedAtBlockNumber = 'createdAtBlockNumber',
  CreatedAtTimestamp = 'createdAtTimestamp',
  EternalFarm = 'eternalFarm',
  EternalFarmBonusReward = 'eternalFarm__bonusReward',
  EternalFarmBonusRewardRate = 'eternalFarm__bonusRewardRate',
  EternalFarmBonusRewardToken = 'eternalFarm__bonusRewardToken',
  EternalFarmEndTime = 'eternalFarm__endTime',
  EternalFarmEndTimeImplied = 'eternalFarm__endTimeImplied',
  EternalFarmId = 'eternalFarm__id',
  EternalFarmIsDetached = 'eternalFarm__isDetached',
  EternalFarmMinRangeLength = 'eternalFarm__minRangeLength',
  EternalFarmMultiplierToken = 'eternalFarm__multiplierToken',
  EternalFarmReward = 'eternalFarm__reward',
  EternalFarmRewardRate = 'eternalFarm__rewardRate',
  EternalFarmRewardReserve = 'eternalFarm__rewardReserve',
  EternalFarmRewardToken = 'eternalFarm__rewardToken',
  EternalFarmStartTime = 'eternalFarm__startTime',
  EternalFarmTier1Multiplier = 'eternalFarm__tier1Multiplier',
  EternalFarmTier2Multiplier = 'eternalFarm__tier2Multiplier',
  EternalFarmTier3Multiplier = 'eternalFarm__tier3Multiplier',
  EternalFarmTimestampActiveLiquidity = 'eternalFarm__timestampActiveLiquidity',
  EternalFarmTokenAmountForTier1 = 'eternalFarm__tokenAmountForTier1',
  EternalFarmTokenAmountForTier2 = 'eternalFarm__tokenAmountForTier2',
  EternalFarmTokenAmountForTier3 = 'eternalFarm__tokenAmountForTier3',
  EternalFarmTotalActiveLiquidity = 'eternalFarm__totalActiveLiquidity',
  EternalFarmTotalAmountUsdEstimated = 'eternalFarm__totalAmountUSDEstimated',
  EternalFarmTotalLiquidity = 'eternalFarm__totalLiquidity',
  EternalFarmVirtualPool = 'eternalFarm__virtualPool',
  Fee = 'fee',
  FeeGrowthGlobal0X128 = 'feeGrowthGlobal0X128',
  FeeGrowthGlobal1X128 = 'feeGrowthGlobal1X128',
  FeesToken0 = 'feesToken0',
  FeesToken1 = 'feesToken1',
  FeesUsd = 'feesUSD',
  Id = 'id',
  Liquidity = 'liquidity',
  LiquidityProviderCount = 'liquidityProviderCount',
  Market0 = 'market0',
  Market0BlockNumber = 'market0__blockNumber',
  Market0BlockTimestamp = 'market0__blockTimestamp',
  Market0ConditionId = 'market0__conditionId',
  Market0Creator = 'market0__creator',
  Market0Factory = 'market0__factory',
  Market0FinalizeTs = 'market0__finalizeTs',
  Market0HasAnswers = 'market0__hasAnswers',
  Market0Id = 'market0__id',
  Market0Index = 'market0__index',
  Market0LowerBound = 'market0__lowerBound',
  Market0MarketName = 'market0__marketName',
  Market0OpeningTs = 'market0__openingTs',
  Market0OutcomesSupply = 'market0__outcomesSupply',
  Market0ParentCollectionId = 'market0__parentCollectionId',
  Market0ParentOutcome = 'market0__parentOutcome',
  Market0PayoutReported = 'market0__payoutReported',
  Market0QuestionId = 'market0__questionId',
  Market0QuestionsInArbitration = 'market0__questionsInArbitration',
  Market0TemplateId = 'market0__templateId',
  Market0TotalValueLockedUsd = 'market0__totalValueLockedUSD',
  Market0TotalValueLockedUsdUntracked = 'market0__totalValueLockedUSDUntracked',
  Market0TransactionHash = 'market0__transactionHash',
  Market0Type = 'market0__type',
  Market0UntrackedVolumeUsd = 'market0__untrackedVolumeUSD',
  Market0UpperBound = 'market0__upperBound',
  Market0Volume = 'market0__volume',
  Market0VolumeUsd = 'market0__volumeUSD',
  Market1 = 'market1',
  Market1BlockNumber = 'market1__blockNumber',
  Market1BlockTimestamp = 'market1__blockTimestamp',
  Market1ConditionId = 'market1__conditionId',
  Market1Creator = 'market1__creator',
  Market1Factory = 'market1__factory',
  Market1FinalizeTs = 'market1__finalizeTs',
  Market1HasAnswers = 'market1__hasAnswers',
  Market1Id = 'market1__id',
  Market1Index = 'market1__index',
  Market1LowerBound = 'market1__lowerBound',
  Market1MarketName = 'market1__marketName',
  Market1OpeningTs = 'market1__openingTs',
  Market1OutcomesSupply = 'market1__outcomesSupply',
  Market1ParentCollectionId = 'market1__parentCollectionId',
  Market1ParentOutcome = 'market1__parentOutcome',
  Market1PayoutReported = 'market1__payoutReported',
  Market1QuestionId = 'market1__questionId',
  Market1QuestionsInArbitration = 'market1__questionsInArbitration',
  Market1TemplateId = 'market1__templateId',
  Market1TotalValueLockedUsd = 'market1__totalValueLockedUSD',
  Market1TotalValueLockedUsdUntracked = 'market1__totalValueLockedUSDUntracked',
  Market1TransactionHash = 'market1__transactionHash',
  Market1Type = 'market1__type',
  Market1UntrackedVolumeUsd = 'market1__untrackedVolumeUSD',
  Market1UpperBound = 'market1__upperBound',
  Market1Volume = 'market1__volume',
  Market1VolumeUsd = 'market1__volumeUSD',
  Mints = 'mints',
  ObservationIndex = 'observationIndex',
  PoolDayData = 'poolDayData',
  PoolHourData = 'poolHourData',
  SqrtPrice = 'sqrtPrice',
  Swaps = 'swaps',
  Tick = 'tick',
  TickSpacing = 'tickSpacing',
  Ticks = 'ticks',
  Token0 = 'token0',
  Token0Price = 'token0Price',
  Token0Decimals = 'token0__decimals',
  Token0DerivedMatic = 'token0__derivedMatic',
  Token0FeesUsd = 'token0__feesUSD',
  Token0Id = 'token0__id',
  Token0IsSeer = 'token0__isSeer',
  Token0Name = 'token0__name',
  Token0PoolCount = 'token0__poolCount',
  Token0Symbol = 'token0__symbol',
  Token0TotalSupply = 'token0__totalSupply',
  Token0TotalValueLocked = 'token0__totalValueLocked',
  Token0TotalValueLockedUsd = 'token0__totalValueLockedUSD',
  Token0TotalValueLockedUsdUntracked = 'token0__totalValueLockedUSDUntracked',
  Token0TxCount = 'token0__txCount',
  Token0UntrackedVolumeUsd = 'token0__untrackedVolumeUSD',
  Token0Volume = 'token0__volume',
  Token0VolumeUsd = 'token0__volumeUSD',
  Token1 = 'token1',
  Token1Price = 'token1Price',
  Token1Decimals = 'token1__decimals',
  Token1DerivedMatic = 'token1__derivedMatic',
  Token1FeesUsd = 'token1__feesUSD',
  Token1Id = 'token1__id',
  Token1IsSeer = 'token1__isSeer',
  Token1Name = 'token1__name',
  Token1PoolCount = 'token1__poolCount',
  Token1Symbol = 'token1__symbol',
  Token1TotalSupply = 'token1__totalSupply',
  Token1TotalValueLocked = 'token1__totalValueLocked',
  Token1TotalValueLockedUsd = 'token1__totalValueLockedUSD',
  Token1TotalValueLockedUsdUntracked = 'token1__totalValueLockedUSDUntracked',
  Token1TxCount = 'token1__txCount',
  Token1UntrackedVolumeUsd = 'token1__untrackedVolumeUSD',
  Token1Volume = 'token1__volume',
  Token1VolumeUsd = 'token1__volumeUSD',
  TotalValueLockedMatic = 'totalValueLockedMatic',
  TotalValueLockedToken0 = 'totalValueLockedToken0',
  TotalValueLockedToken1 = 'totalValueLockedToken1',
  TotalValueLockedUsd = 'totalValueLockedUSD',
  TotalValueLockedUsdUntracked = 'totalValueLockedUSDUntracked',
  TxCount = 'txCount',
  UntrackedFeesUsd = 'untrackedFeesUSD',
  UntrackedVolumeUsd = 'untrackedVolumeUSD',
  VolumeToken0 = 'volumeToken0',
  VolumeToken1 = 'volumeToken1',
  VolumeUsd = 'volumeUSD'
}

export type Position = {
  __typename?: 'Position';
  collectedFeesToken0: Scalars['BigDecimal'];
  collectedFeesToken1: Scalars['BigDecimal'];
  collectedToken0: Scalars['BigDecimal'];
  collectedToken1: Scalars['BigDecimal'];
  depositedToken0: Scalars['BigDecimal'];
  depositedToken1: Scalars['BigDecimal'];
  feeGrowthInside0LastX128: Scalars['BigInt'];
  feeGrowthInside1LastX128: Scalars['BigInt'];
  id: Scalars['ID'];
  liquidity: Scalars['BigInt'];
  owner: Scalars['Bytes'];
  pool: Pool;
  tickLower: Tick;
  tickUpper: Tick;
  token0: Token;
  token0Tvl?: Maybe<Scalars['BigDecimal']>;
  token1: Token;
  token1Tvl?: Maybe<Scalars['BigDecimal']>;
  transaction: Transaction;
  withdrawnToken0: Scalars['BigDecimal'];
  withdrawnToken1: Scalars['BigDecimal'];
};

export type PositionSnapshot = {
  __typename?: 'PositionSnapshot';
  blockNumber: Scalars['BigInt'];
  collectedFeesToken0: Scalars['BigDecimal'];
  collectedFeesToken1: Scalars['BigDecimal'];
  depositedToken0: Scalars['BigDecimal'];
  depositedToken1: Scalars['BigDecimal'];
  feeGrowthInside0LastX128: Scalars['BigInt'];
  feeGrowthInside1LastX128: Scalars['BigInt'];
  id: Scalars['ID'];
  liquidity: Scalars['BigInt'];
  owner: Scalars['Bytes'];
  pool: Pool;
  position: Position;
  timestamp: Scalars['BigInt'];
  transaction: Transaction;
  withdrawnToken0: Scalars['BigDecimal'];
  withdrawnToken1: Scalars['BigDecimal'];
};

export type PositionSnapshot_Filter = {
  /** Filter for the block changed event. */
  _change_block?: Maybe<BlockChangedFilter>;
  and?: Maybe<Array<Maybe<PositionSnapshot_Filter>>>;
  blockNumber?: Maybe<Scalars['BigInt']>;
  blockNumber_gt?: Maybe<Scalars['BigInt']>;
  blockNumber_gte?: Maybe<Scalars['BigInt']>;
  blockNumber_in?: Maybe<Array<Scalars['BigInt']>>;
  blockNumber_lt?: Maybe<Scalars['BigInt']>;
  blockNumber_lte?: Maybe<Scalars['BigInt']>;
  blockNumber_not?: Maybe<Scalars['BigInt']>;
  blockNumber_not_in?: Maybe<Array<Scalars['BigInt']>>;
  collectedFeesToken0?: Maybe<Scalars['BigDecimal']>;
  collectedFeesToken0_gt?: Maybe<Scalars['BigDecimal']>;
  collectedFeesToken0_gte?: Maybe<Scalars['BigDecimal']>;
  collectedFeesToken0_in?: Maybe<Array<Scalars['BigDecimal']>>;
  collectedFeesToken0_lt?: Maybe<Scalars['BigDecimal']>;
  collectedFeesToken0_lte?: Maybe<Scalars['BigDecimal']>;
  collectedFeesToken0_not?: Maybe<Scalars['BigDecimal']>;
  collectedFeesToken0_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
  collectedFeesToken1?: Maybe<Scalars['BigDecimal']>;
  collectedFeesToken1_gt?: Maybe<Scalars['BigDecimal']>;
  collectedFeesToken1_gte?: Maybe<Scalars['BigDecimal']>;
  collectedFeesToken1_in?: Maybe<Array<Scalars['BigDecimal']>>;
  collectedFeesToken1_lt?: Maybe<Scalars['BigDecimal']>;
  collectedFeesToken1_lte?: Maybe<Scalars['BigDecimal']>;
  collectedFeesToken1_not?: Maybe<Scalars['BigDecimal']>;
  collectedFeesToken1_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
  depositedToken0?: Maybe<Scalars['BigDecimal']>;
  depositedToken0_gt?: Maybe<Scalars['BigDecimal']>;
  depositedToken0_gte?: Maybe<Scalars['BigDecimal']>;
  depositedToken0_in?: Maybe<Array<Scalars['BigDecimal']>>;
  depositedToken0_lt?: Maybe<Scalars['BigDecimal']>;
  depositedToken0_lte?: Maybe<Scalars['BigDecimal']>;
  depositedToken0_not?: Maybe<Scalars['BigDecimal']>;
  depositedToken0_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
  depositedToken1?: Maybe<Scalars['BigDecimal']>;
  depositedToken1_gt?: Maybe<Scalars['BigDecimal']>;
  depositedToken1_gte?: Maybe<Scalars['BigDecimal']>;
  depositedToken1_in?: Maybe<Array<Scalars['BigDecimal']>>;
  depositedToken1_lt?: Maybe<Scalars['BigDecimal']>;
  depositedToken1_lte?: Maybe<Scalars['BigDecimal']>;
  depositedToken1_not?: Maybe<Scalars['BigDecimal']>;
  depositedToken1_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
  feeGrowthInside0LastX128?: Maybe<Scalars['BigInt']>;
  feeGrowthInside0LastX128_gt?: Maybe<Scalars['BigInt']>;
  feeGrowthInside0LastX128_gte?: Maybe<Scalars['BigInt']>;
  feeGrowthInside0LastX128_in?: Maybe<Array<Scalars['BigInt']>>;
  feeGrowthInside0LastX128_lt?: Maybe<Scalars['BigInt']>;
  feeGrowthInside0LastX128_lte?: Maybe<Scalars['BigInt']>;
  feeGrowthInside0LastX128_not?: Maybe<Scalars['BigInt']>;
  feeGrowthInside0LastX128_not_in?: Maybe<Array<Scalars['BigInt']>>;
  feeGrowthInside1LastX128?: Maybe<Scalars['BigInt']>;
  feeGrowthInside1LastX128_gt?: Maybe<Scalars['BigInt']>;
  feeGrowthInside1LastX128_gte?: Maybe<Scalars['BigInt']>;
  feeGrowthInside1LastX128_in?: Maybe<Array<Scalars['BigInt']>>;
  feeGrowthInside1LastX128_lt?: Maybe<Scalars['BigInt']>;
  feeGrowthInside1LastX128_lte?: Maybe<Scalars['BigInt']>;
  feeGrowthInside1LastX128_not?: Maybe<Scalars['BigInt']>;
  feeGrowthInside1LastX128_not_in?: Maybe<Array<Scalars['BigInt']>>;
  id?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_lt?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
  liquidity?: Maybe<Scalars['BigInt']>;
  liquidity_gt?: Maybe<Scalars['BigInt']>;
  liquidity_gte?: Maybe<Scalars['BigInt']>;
  liquidity_in?: Maybe<Array<Scalars['BigInt']>>;
  liquidity_lt?: Maybe<Scalars['BigInt']>;
  liquidity_lte?: Maybe<Scalars['BigInt']>;
  liquidity_not?: Maybe<Scalars['BigInt']>;
  liquidity_not_in?: Maybe<Array<Scalars['BigInt']>>;
  or?: Maybe<Array<Maybe<PositionSnapshot_Filter>>>;
  owner?: Maybe<Scalars['Bytes']>;
  owner_contains?: Maybe<Scalars['Bytes']>;
  owner_gt?: Maybe<Scalars['Bytes']>;
  owner_gte?: Maybe<Scalars['Bytes']>;
  owner_in?: Maybe<Array<Scalars['Bytes']>>;
  owner_lt?: Maybe<Scalars['Bytes']>;
  owner_lte?: Maybe<Scalars['Bytes']>;
  owner_not?: Maybe<Scalars['Bytes']>;
  owner_not_contains?: Maybe<Scalars['Bytes']>;
  owner_not_in?: Maybe<Array<Scalars['Bytes']>>;
  pool?: Maybe<Scalars['String']>;
  pool_?: Maybe<Pool_Filter>;
  pool_contains?: Maybe<Scalars['String']>;
  pool_contains_nocase?: Maybe<Scalars['String']>;
  pool_ends_with?: Maybe<Scalars['String']>;
  pool_ends_with_nocase?: Maybe<Scalars['String']>;
  pool_gt?: Maybe<Scalars['String']>;
  pool_gte?: Maybe<Scalars['String']>;
  pool_in?: Maybe<Array<Scalars['String']>>;
  pool_lt?: Maybe<Scalars['String']>;
  pool_lte?: Maybe<Scalars['String']>;
  pool_not?: Maybe<Scalars['String']>;
  pool_not_contains?: Maybe<Scalars['String']>;
  pool_not_contains_nocase?: Maybe<Scalars['String']>;
  pool_not_ends_with?: Maybe<Scalars['String']>;
  pool_not_ends_with_nocase?: Maybe<Scalars['String']>;
  pool_not_in?: Maybe<Array<Scalars['String']>>;
  pool_not_starts_with?: Maybe<Scalars['String']>;
  pool_not_starts_with_nocase?: Maybe<Scalars['String']>;
  pool_starts_with?: Maybe<Scalars['String']>;
  pool_starts_with_nocase?: Maybe<Scalars['String']>;
  position?: Maybe<Scalars['String']>;
  position_?: Maybe<Position_Filter>;
  position_contains?: Maybe<Scalars['String']>;
  position_contains_nocase?: Maybe<Scalars['String']>;
  position_ends_with?: Maybe<Scalars['String']>;
  position_ends_with_nocase?: Maybe<Scalars['String']>;
  position_gt?: Maybe<Scalars['String']>;
  position_gte?: Maybe<Scalars['String']>;
  position_in?: Maybe<Array<Scalars['String']>>;
  position_lt?: Maybe<Scalars['String']>;
  position_lte?: Maybe<Scalars['String']>;
  position_not?: Maybe<Scalars['String']>;
  position_not_contains?: Maybe<Scalars['String']>;
  position_not_contains_nocase?: Maybe<Scalars['String']>;
  position_not_ends_with?: Maybe<Scalars['String']>;
  position_not_ends_with_nocase?: Maybe<Scalars['String']>;
  position_not_in?: Maybe<Array<Scalars['String']>>;
  position_not_starts_with?: Maybe<Scalars['String']>;
  position_not_starts_with_nocase?: Maybe<Scalars['String']>;
  position_starts_with?: Maybe<Scalars['String']>;
  position_starts_with_nocase?: Maybe<Scalars['String']>;
  timestamp?: Maybe<Scalars['BigInt']>;
  timestamp_gt?: Maybe<Scalars['BigInt']>;
  timestamp_gte?: Maybe<Scalars['BigInt']>;
  timestamp_in?: Maybe<Array<Scalars['BigInt']>>;
  timestamp_lt?: Maybe<Scalars['BigInt']>;
  timestamp_lte?: Maybe<Scalars['BigInt']>;
  timestamp_not?: Maybe<Scalars['BigInt']>;
  timestamp_not_in?: Maybe<Array<Scalars['BigInt']>>;
  transaction?: Maybe<Scalars['String']>;
  transaction_?: Maybe<Transaction_Filter>;
  transaction_contains?: Maybe<Scalars['String']>;
  transaction_contains_nocase?: Maybe<Scalars['String']>;
  transaction_ends_with?: Maybe<Scalars['String']>;
  transaction_ends_with_nocase?: Maybe<Scalars['String']>;
  transaction_gt?: Maybe<Scalars['String']>;
  transaction_gte?: Maybe<Scalars['String']>;
  transaction_in?: Maybe<Array<Scalars['String']>>;
  transaction_lt?: Maybe<Scalars['String']>;
  transaction_lte?: Maybe<Scalars['String']>;
  transaction_not?: Maybe<Scalars['String']>;
  transaction_not_contains?: Maybe<Scalars['String']>;
  transaction_not_contains_nocase?: Maybe<Scalars['String']>;
  transaction_not_ends_with?: Maybe<Scalars['String']>;
  transaction_not_ends_with_nocase?: Maybe<Scalars['String']>;
  transaction_not_in?: Maybe<Array<Scalars['String']>>;
  transaction_not_starts_with?: Maybe<Scalars['String']>;
  transaction_not_starts_with_nocase?: Maybe<Scalars['String']>;
  transaction_starts_with?: Maybe<Scalars['String']>;
  transaction_starts_with_nocase?: Maybe<Scalars['String']>;
  withdrawnToken0?: Maybe<Scalars['BigDecimal']>;
  withdrawnToken0_gt?: Maybe<Scalars['BigDecimal']>;
  withdrawnToken0_gte?: Maybe<Scalars['BigDecimal']>;
  withdrawnToken0_in?: Maybe<Array<Scalars['BigDecimal']>>;
  withdrawnToken0_lt?: Maybe<Scalars['BigDecimal']>;
  withdrawnToken0_lte?: Maybe<Scalars['BigDecimal']>;
  withdrawnToken0_not?: Maybe<Scalars['BigDecimal']>;
  withdrawnToken0_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
  withdrawnToken1?: Maybe<Scalars['BigDecimal']>;
  withdrawnToken1_gt?: Maybe<Scalars['BigDecimal']>;
  withdrawnToken1_gte?: Maybe<Scalars['BigDecimal']>;
  withdrawnToken1_in?: Maybe<Array<Scalars['BigDecimal']>>;
  withdrawnToken1_lt?: Maybe<Scalars['BigDecimal']>;
  withdrawnToken1_lte?: Maybe<Scalars['BigDecimal']>;
  withdrawnToken1_not?: Maybe<Scalars['BigDecimal']>;
  withdrawnToken1_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
};

export enum PositionSnapshot_OrderBy {
  BlockNumber = 'blockNumber',
  CollectedFeesToken0 = 'collectedFeesToken0',
  CollectedFeesToken1 = 'collectedFeesToken1',
  DepositedToken0 = 'depositedToken0',
  DepositedToken1 = 'depositedToken1',
  FeeGrowthInside0LastX128 = 'feeGrowthInside0LastX128',
  FeeGrowthInside1LastX128 = 'feeGrowthInside1LastX128',
  Id = 'id',
  Liquidity = 'liquidity',
  Owner = 'owner',
  Pool = 'pool',
  PoolCollectedFeesToken0 = 'pool__collectedFeesToken0',
  PoolCollectedFeesToken1 = 'pool__collectedFeesToken1',
  PoolCollectedFeesUsd = 'pool__collectedFeesUSD',
  PoolCommunityFee0 = 'pool__communityFee0',
  PoolCommunityFee1 = 'pool__communityFee1',
  PoolCreatedAtBlockNumber = 'pool__createdAtBlockNumber',
  PoolCreatedAtTimestamp = 'pool__createdAtTimestamp',
  PoolFee = 'pool__fee',
  PoolFeeGrowthGlobal0X128 = 'pool__feeGrowthGlobal0X128',
  PoolFeeGrowthGlobal1X128 = 'pool__feeGrowthGlobal1X128',
  PoolFeesToken0 = 'pool__feesToken0',
  PoolFeesToken1 = 'pool__feesToken1',
  PoolFeesUsd = 'pool__feesUSD',
  PoolId = 'pool__id',
  PoolLiquidity = 'pool__liquidity',
  PoolLiquidityProviderCount = 'pool__liquidityProviderCount',
  PoolObservationIndex = 'pool__observationIndex',
  PoolSqrtPrice = 'pool__sqrtPrice',
  PoolTick = 'pool__tick',
  PoolTickSpacing = 'pool__tickSpacing',
  PoolToken0Price = 'pool__token0Price',
  PoolToken1Price = 'pool__token1Price',
  PoolTotalValueLockedMatic = 'pool__totalValueLockedMatic',
  PoolTotalValueLockedToken0 = 'pool__totalValueLockedToken0',
  PoolTotalValueLockedToken1 = 'pool__totalValueLockedToken1',
  PoolTotalValueLockedUsd = 'pool__totalValueLockedUSD',
  PoolTotalValueLockedUsdUntracked = 'pool__totalValueLockedUSDUntracked',
  PoolTxCount = 'pool__txCount',
  PoolUntrackedFeesUsd = 'pool__untrackedFeesUSD',
  PoolUntrackedVolumeUsd = 'pool__untrackedVolumeUSD',
  PoolVolumeToken0 = 'pool__volumeToken0',
  PoolVolumeToken1 = 'pool__volumeToken1',
  PoolVolumeUsd = 'pool__volumeUSD',
  Position = 'position',
  PositionCollectedFeesToken0 = 'position__collectedFeesToken0',
  PositionCollectedFeesToken1 = 'position__collectedFeesToken1',
  PositionCollectedToken0 = 'position__collectedToken0',
  PositionCollectedToken1 = 'position__collectedToken1',
  PositionDepositedToken0 = 'position__depositedToken0',
  PositionDepositedToken1 = 'position__depositedToken1',
  PositionFeeGrowthInside0LastX128 = 'position__feeGrowthInside0LastX128',
  PositionFeeGrowthInside1LastX128 = 'position__feeGrowthInside1LastX128',
  PositionId = 'position__id',
  PositionLiquidity = 'position__liquidity',
  PositionOwner = 'position__owner',
  PositionToken0Tvl = 'position__token0Tvl',
  PositionToken1Tvl = 'position__token1Tvl',
  PositionWithdrawnToken0 = 'position__withdrawnToken0',
  PositionWithdrawnToken1 = 'position__withdrawnToken1',
  Timestamp = 'timestamp',
  Transaction = 'transaction',
  TransactionBlockNumber = 'transaction__blockNumber',
  TransactionGasLimit = 'transaction__gasLimit',
  TransactionGasPrice = 'transaction__gasPrice',
  TransactionId = 'transaction__id',
  TransactionTimestamp = 'transaction__timestamp',
  WithdrawnToken0 = 'withdrawnToken0',
  WithdrawnToken1 = 'withdrawnToken1'
}

export type Position_Filter = {
  /** Filter for the block changed event. */
  _change_block?: Maybe<BlockChangedFilter>;
  and?: Maybe<Array<Maybe<Position_Filter>>>;
  collectedFeesToken0?: Maybe<Scalars['BigDecimal']>;
  collectedFeesToken0_gt?: Maybe<Scalars['BigDecimal']>;
  collectedFeesToken0_gte?: Maybe<Scalars['BigDecimal']>;
  collectedFeesToken0_in?: Maybe<Array<Scalars['BigDecimal']>>;
  collectedFeesToken0_lt?: Maybe<Scalars['BigDecimal']>;
  collectedFeesToken0_lte?: Maybe<Scalars['BigDecimal']>;
  collectedFeesToken0_not?: Maybe<Scalars['BigDecimal']>;
  collectedFeesToken0_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
  collectedFeesToken1?: Maybe<Scalars['BigDecimal']>;
  collectedFeesToken1_gt?: Maybe<Scalars['BigDecimal']>;
  collectedFeesToken1_gte?: Maybe<Scalars['BigDecimal']>;
  collectedFeesToken1_in?: Maybe<Array<Scalars['BigDecimal']>>;
  collectedFeesToken1_lt?: Maybe<Scalars['BigDecimal']>;
  collectedFeesToken1_lte?: Maybe<Scalars['BigDecimal']>;
  collectedFeesToken1_not?: Maybe<Scalars['BigDecimal']>;
  collectedFeesToken1_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
  collectedToken0?: Maybe<Scalars['BigDecimal']>;
  collectedToken0_gt?: Maybe<Scalars['BigDecimal']>;
  collectedToken0_gte?: Maybe<Scalars['BigDecimal']>;
  collectedToken0_in?: Maybe<Array<Scalars['BigDecimal']>>;
  collectedToken0_lt?: Maybe<Scalars['BigDecimal']>;
  collectedToken0_lte?: Maybe<Scalars['BigDecimal']>;
  collectedToken0_not?: Maybe<Scalars['BigDecimal']>;
  collectedToken0_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
  collectedToken1?: Maybe<Scalars['BigDecimal']>;
  collectedToken1_gt?: Maybe<Scalars['BigDecimal']>;
  collectedToken1_gte?: Maybe<Scalars['BigDecimal']>;
  collectedToken1_in?: Maybe<Array<Scalars['BigDecimal']>>;
  collectedToken1_lt?: Maybe<Scalars['BigDecimal']>;
  collectedToken1_lte?: Maybe<Scalars['BigDecimal']>;
  collectedToken1_not?: Maybe<Scalars['BigDecimal']>;
  collectedToken1_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
  depositedToken0?: Maybe<Scalars['BigDecimal']>;
  depositedToken0_gt?: Maybe<Scalars['BigDecimal']>;
  depositedToken0_gte?: Maybe<Scalars['BigDecimal']>;
  depositedToken0_in?: Maybe<Array<Scalars['BigDecimal']>>;
  depositedToken0_lt?: Maybe<Scalars['BigDecimal']>;
  depositedToken0_lte?: Maybe<Scalars['BigDecimal']>;
  depositedToken0_not?: Maybe<Scalars['BigDecimal']>;
  depositedToken0_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
  depositedToken1?: Maybe<Scalars['BigDecimal']>;
  depositedToken1_gt?: Maybe<Scalars['BigDecimal']>;
  depositedToken1_gte?: Maybe<Scalars['BigDecimal']>;
  depositedToken1_in?: Maybe<Array<Scalars['BigDecimal']>>;
  depositedToken1_lt?: Maybe<Scalars['BigDecimal']>;
  depositedToken1_lte?: Maybe<Scalars['BigDecimal']>;
  depositedToken1_not?: Maybe<Scalars['BigDecimal']>;
  depositedToken1_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
  feeGrowthInside0LastX128?: Maybe<Scalars['BigInt']>;
  feeGrowthInside0LastX128_gt?: Maybe<Scalars['BigInt']>;
  feeGrowthInside0LastX128_gte?: Maybe<Scalars['BigInt']>;
  feeGrowthInside0LastX128_in?: Maybe<Array<Scalars['BigInt']>>;
  feeGrowthInside0LastX128_lt?: Maybe<Scalars['BigInt']>;
  feeGrowthInside0LastX128_lte?: Maybe<Scalars['BigInt']>;
  feeGrowthInside0LastX128_not?: Maybe<Scalars['BigInt']>;
  feeGrowthInside0LastX128_not_in?: Maybe<Array<Scalars['BigInt']>>;
  feeGrowthInside1LastX128?: Maybe<Scalars['BigInt']>;
  feeGrowthInside1LastX128_gt?: Maybe<Scalars['BigInt']>;
  feeGrowthInside1LastX128_gte?: Maybe<Scalars['BigInt']>;
  feeGrowthInside1LastX128_in?: Maybe<Array<Scalars['BigInt']>>;
  feeGrowthInside1LastX128_lt?: Maybe<Scalars['BigInt']>;
  feeGrowthInside1LastX128_lte?: Maybe<Scalars['BigInt']>;
  feeGrowthInside1LastX128_not?: Maybe<Scalars['BigInt']>;
  feeGrowthInside1LastX128_not_in?: Maybe<Array<Scalars['BigInt']>>;
  id?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_lt?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
  liquidity?: Maybe<Scalars['BigInt']>;
  liquidity_gt?: Maybe<Scalars['BigInt']>;
  liquidity_gte?: Maybe<Scalars['BigInt']>;
  liquidity_in?: Maybe<Array<Scalars['BigInt']>>;
  liquidity_lt?: Maybe<Scalars['BigInt']>;
  liquidity_lte?: Maybe<Scalars['BigInt']>;
  liquidity_not?: Maybe<Scalars['BigInt']>;
  liquidity_not_in?: Maybe<Array<Scalars['BigInt']>>;
  or?: Maybe<Array<Maybe<Position_Filter>>>;
  owner?: Maybe<Scalars['Bytes']>;
  owner_contains?: Maybe<Scalars['Bytes']>;
  owner_gt?: Maybe<Scalars['Bytes']>;
  owner_gte?: Maybe<Scalars['Bytes']>;
  owner_in?: Maybe<Array<Scalars['Bytes']>>;
  owner_lt?: Maybe<Scalars['Bytes']>;
  owner_lte?: Maybe<Scalars['Bytes']>;
  owner_not?: Maybe<Scalars['Bytes']>;
  owner_not_contains?: Maybe<Scalars['Bytes']>;
  owner_not_in?: Maybe<Array<Scalars['Bytes']>>;
  pool?: Maybe<Scalars['String']>;
  pool_?: Maybe<Pool_Filter>;
  pool_contains?: Maybe<Scalars['String']>;
  pool_contains_nocase?: Maybe<Scalars['String']>;
  pool_ends_with?: Maybe<Scalars['String']>;
  pool_ends_with_nocase?: Maybe<Scalars['String']>;
  pool_gt?: Maybe<Scalars['String']>;
  pool_gte?: Maybe<Scalars['String']>;
  pool_in?: Maybe<Array<Scalars['String']>>;
  pool_lt?: Maybe<Scalars['String']>;
  pool_lte?: Maybe<Scalars['String']>;
  pool_not?: Maybe<Scalars['String']>;
  pool_not_contains?: Maybe<Scalars['String']>;
  pool_not_contains_nocase?: Maybe<Scalars['String']>;
  pool_not_ends_with?: Maybe<Scalars['String']>;
  pool_not_ends_with_nocase?: Maybe<Scalars['String']>;
  pool_not_in?: Maybe<Array<Scalars['String']>>;
  pool_not_starts_with?: Maybe<Scalars['String']>;
  pool_not_starts_with_nocase?: Maybe<Scalars['String']>;
  pool_starts_with?: Maybe<Scalars['String']>;
  pool_starts_with_nocase?: Maybe<Scalars['String']>;
  tickLower?: Maybe<Scalars['String']>;
  tickLower_?: Maybe<Tick_Filter>;
  tickLower_contains?: Maybe<Scalars['String']>;
  tickLower_contains_nocase?: Maybe<Scalars['String']>;
  tickLower_ends_with?: Maybe<Scalars['String']>;
  tickLower_ends_with_nocase?: Maybe<Scalars['String']>;
  tickLower_gt?: Maybe<Scalars['String']>;
  tickLower_gte?: Maybe<Scalars['String']>;
  tickLower_in?: Maybe<Array<Scalars['String']>>;
  tickLower_lt?: Maybe<Scalars['String']>;
  tickLower_lte?: Maybe<Scalars['String']>;
  tickLower_not?: Maybe<Scalars['String']>;
  tickLower_not_contains?: Maybe<Scalars['String']>;
  tickLower_not_contains_nocase?: Maybe<Scalars['String']>;
  tickLower_not_ends_with?: Maybe<Scalars['String']>;
  tickLower_not_ends_with_nocase?: Maybe<Scalars['String']>;
  tickLower_not_in?: Maybe<Array<Scalars['String']>>;
  tickLower_not_starts_with?: Maybe<Scalars['String']>;
  tickLower_not_starts_with_nocase?: Maybe<Scalars['String']>;
  tickLower_starts_with?: Maybe<Scalars['String']>;
  tickLower_starts_with_nocase?: Maybe<Scalars['String']>;
  tickUpper?: Maybe<Scalars['String']>;
  tickUpper_?: Maybe<Tick_Filter>;
  tickUpper_contains?: Maybe<Scalars['String']>;
  tickUpper_contains_nocase?: Maybe<Scalars['String']>;
  tickUpper_ends_with?: Maybe<Scalars['String']>;
  tickUpper_ends_with_nocase?: Maybe<Scalars['String']>;
  tickUpper_gt?: Maybe<Scalars['String']>;
  tickUpper_gte?: Maybe<Scalars['String']>;
  tickUpper_in?: Maybe<Array<Scalars['String']>>;
  tickUpper_lt?: Maybe<Scalars['String']>;
  tickUpper_lte?: Maybe<Scalars['String']>;
  tickUpper_not?: Maybe<Scalars['String']>;
  tickUpper_not_contains?: Maybe<Scalars['String']>;
  tickUpper_not_contains_nocase?: Maybe<Scalars['String']>;
  tickUpper_not_ends_with?: Maybe<Scalars['String']>;
  tickUpper_not_ends_with_nocase?: Maybe<Scalars['String']>;
  tickUpper_not_in?: Maybe<Array<Scalars['String']>>;
  tickUpper_not_starts_with?: Maybe<Scalars['String']>;
  tickUpper_not_starts_with_nocase?: Maybe<Scalars['String']>;
  tickUpper_starts_with?: Maybe<Scalars['String']>;
  tickUpper_starts_with_nocase?: Maybe<Scalars['String']>;
  token0?: Maybe<Scalars['String']>;
  token0Tvl?: Maybe<Scalars['BigDecimal']>;
  token0Tvl_gt?: Maybe<Scalars['BigDecimal']>;
  token0Tvl_gte?: Maybe<Scalars['BigDecimal']>;
  token0Tvl_in?: Maybe<Array<Scalars['BigDecimal']>>;
  token0Tvl_lt?: Maybe<Scalars['BigDecimal']>;
  token0Tvl_lte?: Maybe<Scalars['BigDecimal']>;
  token0Tvl_not?: Maybe<Scalars['BigDecimal']>;
  token0Tvl_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
  token0_?: Maybe<Token_Filter>;
  token0_contains?: Maybe<Scalars['String']>;
  token0_contains_nocase?: Maybe<Scalars['String']>;
  token0_ends_with?: Maybe<Scalars['String']>;
  token0_ends_with_nocase?: Maybe<Scalars['String']>;
  token0_gt?: Maybe<Scalars['String']>;
  token0_gte?: Maybe<Scalars['String']>;
  token0_in?: Maybe<Array<Scalars['String']>>;
  token0_lt?: Maybe<Scalars['String']>;
  token0_lte?: Maybe<Scalars['String']>;
  token0_not?: Maybe<Scalars['String']>;
  token0_not_contains?: Maybe<Scalars['String']>;
  token0_not_contains_nocase?: Maybe<Scalars['String']>;
  token0_not_ends_with?: Maybe<Scalars['String']>;
  token0_not_ends_with_nocase?: Maybe<Scalars['String']>;
  token0_not_in?: Maybe<Array<Scalars['String']>>;
  token0_not_starts_with?: Maybe<Scalars['String']>;
  token0_not_starts_with_nocase?: Maybe<Scalars['String']>;
  token0_starts_with?: Maybe<Scalars['String']>;
  token0_starts_with_nocase?: Maybe<Scalars['String']>;
  token1?: Maybe<Scalars['String']>;
  token1Tvl?: Maybe<Scalars['BigDecimal']>;
  token1Tvl_gt?: Maybe<Scalars['BigDecimal']>;
  token1Tvl_gte?: Maybe<Scalars['BigDecimal']>;
  token1Tvl_in?: Maybe<Array<Scalars['BigDecimal']>>;
  token1Tvl_lt?: Maybe<Scalars['BigDecimal']>;
  token1Tvl_lte?: Maybe<Scalars['BigDecimal']>;
  token1Tvl_not?: Maybe<Scalars['BigDecimal']>;
  token1Tvl_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
  token1_?: Maybe<Token_Filter>;
  token1_contains?: Maybe<Scalars['String']>;
  token1_contains_nocase?: Maybe<Scalars['String']>;
  token1_ends_with?: Maybe<Scalars['String']>;
  token1_ends_with_nocase?: Maybe<Scalars['String']>;
  token1_gt?: Maybe<Scalars['String']>;
  token1_gte?: Maybe<Scalars['String']>;
  token1_in?: Maybe<Array<Scalars['String']>>;
  token1_lt?: Maybe<Scalars['String']>;
  token1_lte?: Maybe<Scalars['String']>;
  token1_not?: Maybe<Scalars['String']>;
  token1_not_contains?: Maybe<Scalars['String']>;
  token1_not_contains_nocase?: Maybe<Scalars['String']>;
  token1_not_ends_with?: Maybe<Scalars['String']>;
  token1_not_ends_with_nocase?: Maybe<Scalars['String']>;
  token1_not_in?: Maybe<Array<Scalars['String']>>;
  token1_not_starts_with?: Maybe<Scalars['String']>;
  token1_not_starts_with_nocase?: Maybe<Scalars['String']>;
  token1_starts_with?: Maybe<Scalars['String']>;
  token1_starts_with_nocase?: Maybe<Scalars['String']>;
  transaction?: Maybe<Scalars['String']>;
  transaction_?: Maybe<Transaction_Filter>;
  transaction_contains?: Maybe<Scalars['String']>;
  transaction_contains_nocase?: Maybe<Scalars['String']>;
  transaction_ends_with?: Maybe<Scalars['String']>;
  transaction_ends_with_nocase?: Maybe<Scalars['String']>;
  transaction_gt?: Maybe<Scalars['String']>;
  transaction_gte?: Maybe<Scalars['String']>;
  transaction_in?: Maybe<Array<Scalars['String']>>;
  transaction_lt?: Maybe<Scalars['String']>;
  transaction_lte?: Maybe<Scalars['String']>;
  transaction_not?: Maybe<Scalars['String']>;
  transaction_not_contains?: Maybe<Scalars['String']>;
  transaction_not_contains_nocase?: Maybe<Scalars['String']>;
  transaction_not_ends_with?: Maybe<Scalars['String']>;
  transaction_not_ends_with_nocase?: Maybe<Scalars['String']>;
  transaction_not_in?: Maybe<Array<Scalars['String']>>;
  transaction_not_starts_with?: Maybe<Scalars['String']>;
  transaction_not_starts_with_nocase?: Maybe<Scalars['String']>;
  transaction_starts_with?: Maybe<Scalars['String']>;
  transaction_starts_with_nocase?: Maybe<Scalars['String']>;
  withdrawnToken0?: Maybe<Scalars['BigDecimal']>;
  withdrawnToken0_gt?: Maybe<Scalars['BigDecimal']>;
  withdrawnToken0_gte?: Maybe<Scalars['BigDecimal']>;
  withdrawnToken0_in?: Maybe<Array<Scalars['BigDecimal']>>;
  withdrawnToken0_lt?: Maybe<Scalars['BigDecimal']>;
  withdrawnToken0_lte?: Maybe<Scalars['BigDecimal']>;
  withdrawnToken0_not?: Maybe<Scalars['BigDecimal']>;
  withdrawnToken0_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
  withdrawnToken1?: Maybe<Scalars['BigDecimal']>;
  withdrawnToken1_gt?: Maybe<Scalars['BigDecimal']>;
  withdrawnToken1_gte?: Maybe<Scalars['BigDecimal']>;
  withdrawnToken1_in?: Maybe<Array<Scalars['BigDecimal']>>;
  withdrawnToken1_lt?: Maybe<Scalars['BigDecimal']>;
  withdrawnToken1_lte?: Maybe<Scalars['BigDecimal']>;
  withdrawnToken1_not?: Maybe<Scalars['BigDecimal']>;
  withdrawnToken1_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
};

export enum Position_OrderBy {
  CollectedFeesToken0 = 'collectedFeesToken0',
  CollectedFeesToken1 = 'collectedFeesToken1',
  CollectedToken0 = 'collectedToken0',
  CollectedToken1 = 'collectedToken1',
  DepositedToken0 = 'depositedToken0',
  DepositedToken1 = 'depositedToken1',
  FeeGrowthInside0LastX128 = 'feeGrowthInside0LastX128',
  FeeGrowthInside1LastX128 = 'feeGrowthInside1LastX128',
  Id = 'id',
  Liquidity = 'liquidity',
  Owner = 'owner',
  Pool = 'pool',
  PoolCollectedFeesToken0 = 'pool__collectedFeesToken0',
  PoolCollectedFeesToken1 = 'pool__collectedFeesToken1',
  PoolCollectedFeesUsd = 'pool__collectedFeesUSD',
  PoolCommunityFee0 = 'pool__communityFee0',
  PoolCommunityFee1 = 'pool__communityFee1',
  PoolCreatedAtBlockNumber = 'pool__createdAtBlockNumber',
  PoolCreatedAtTimestamp = 'pool__createdAtTimestamp',
  PoolFee = 'pool__fee',
  PoolFeeGrowthGlobal0X128 = 'pool__feeGrowthGlobal0X128',
  PoolFeeGrowthGlobal1X128 = 'pool__feeGrowthGlobal1X128',
  PoolFeesToken0 = 'pool__feesToken0',
  PoolFeesToken1 = 'pool__feesToken1',
  PoolFeesUsd = 'pool__feesUSD',
  PoolId = 'pool__id',
  PoolLiquidity = 'pool__liquidity',
  PoolLiquidityProviderCount = 'pool__liquidityProviderCount',
  PoolObservationIndex = 'pool__observationIndex',
  PoolSqrtPrice = 'pool__sqrtPrice',
  PoolTick = 'pool__tick',
  PoolTickSpacing = 'pool__tickSpacing',
  PoolToken0Price = 'pool__token0Price',
  PoolToken1Price = 'pool__token1Price',
  PoolTotalValueLockedMatic = 'pool__totalValueLockedMatic',
  PoolTotalValueLockedToken0 = 'pool__totalValueLockedToken0',
  PoolTotalValueLockedToken1 = 'pool__totalValueLockedToken1',
  PoolTotalValueLockedUsd = 'pool__totalValueLockedUSD',
  PoolTotalValueLockedUsdUntracked = 'pool__totalValueLockedUSDUntracked',
  PoolTxCount = 'pool__txCount',
  PoolUntrackedFeesUsd = 'pool__untrackedFeesUSD',
  PoolUntrackedVolumeUsd = 'pool__untrackedVolumeUSD',
  PoolVolumeToken0 = 'pool__volumeToken0',
  PoolVolumeToken1 = 'pool__volumeToken1',
  PoolVolumeUsd = 'pool__volumeUSD',
  TickLower = 'tickLower',
  TickLowerCollectedFeesToken0 = 'tickLower__collectedFeesToken0',
  TickLowerCollectedFeesToken1 = 'tickLower__collectedFeesToken1',
  TickLowerCollectedFeesUsd = 'tickLower__collectedFeesUSD',
  TickLowerCreatedAtBlockNumber = 'tickLower__createdAtBlockNumber',
  TickLowerCreatedAtTimestamp = 'tickLower__createdAtTimestamp',
  TickLowerFeeGrowthOutside0X128 = 'tickLower__feeGrowthOutside0X128',
  TickLowerFeeGrowthOutside1X128 = 'tickLower__feeGrowthOutside1X128',
  TickLowerFeesUsd = 'tickLower__feesUSD',
  TickLowerId = 'tickLower__id',
  TickLowerLiquidityGross = 'tickLower__liquidityGross',
  TickLowerLiquidityNet = 'tickLower__liquidityNet',
  TickLowerLiquidityProviderCount = 'tickLower__liquidityProviderCount',
  TickLowerPoolAddress = 'tickLower__poolAddress',
  TickLowerPrice0 = 'tickLower__price0',
  TickLowerPrice1 = 'tickLower__price1',
  TickLowerTickIdx = 'tickLower__tickIdx',
  TickLowerUntrackedVolumeUsd = 'tickLower__untrackedVolumeUSD',
  TickLowerVolumeToken0 = 'tickLower__volumeToken0',
  TickLowerVolumeToken1 = 'tickLower__volumeToken1',
  TickLowerVolumeUsd = 'tickLower__volumeUSD',
  TickUpper = 'tickUpper',
  TickUpperCollectedFeesToken0 = 'tickUpper__collectedFeesToken0',
  TickUpperCollectedFeesToken1 = 'tickUpper__collectedFeesToken1',
  TickUpperCollectedFeesUsd = 'tickUpper__collectedFeesUSD',
  TickUpperCreatedAtBlockNumber = 'tickUpper__createdAtBlockNumber',
  TickUpperCreatedAtTimestamp = 'tickUpper__createdAtTimestamp',
  TickUpperFeeGrowthOutside0X128 = 'tickUpper__feeGrowthOutside0X128',
  TickUpperFeeGrowthOutside1X128 = 'tickUpper__feeGrowthOutside1X128',
  TickUpperFeesUsd = 'tickUpper__feesUSD',
  TickUpperId = 'tickUpper__id',
  TickUpperLiquidityGross = 'tickUpper__liquidityGross',
  TickUpperLiquidityNet = 'tickUpper__liquidityNet',
  TickUpperLiquidityProviderCount = 'tickUpper__liquidityProviderCount',
  TickUpperPoolAddress = 'tickUpper__poolAddress',
  TickUpperPrice0 = 'tickUpper__price0',
  TickUpperPrice1 = 'tickUpper__price1',
  TickUpperTickIdx = 'tickUpper__tickIdx',
  TickUpperUntrackedVolumeUsd = 'tickUpper__untrackedVolumeUSD',
  TickUpperVolumeToken0 = 'tickUpper__volumeToken0',
  TickUpperVolumeToken1 = 'tickUpper__volumeToken1',
  TickUpperVolumeUsd = 'tickUpper__volumeUSD',
  Token0 = 'token0',
  Token0Tvl = 'token0Tvl',
  Token0Decimals = 'token0__decimals',
  Token0DerivedMatic = 'token0__derivedMatic',
  Token0FeesUsd = 'token0__feesUSD',
  Token0Id = 'token0__id',
  Token0IsSeer = 'token0__isSeer',
  Token0Name = 'token0__name',
  Token0PoolCount = 'token0__poolCount',
  Token0Symbol = 'token0__symbol',
  Token0TotalSupply = 'token0__totalSupply',
  Token0TotalValueLocked = 'token0__totalValueLocked',
  Token0TotalValueLockedUsd = 'token0__totalValueLockedUSD',
  Token0TotalValueLockedUsdUntracked = 'token0__totalValueLockedUSDUntracked',
  Token0TxCount = 'token0__txCount',
  Token0UntrackedVolumeUsd = 'token0__untrackedVolumeUSD',
  Token0Volume = 'token0__volume',
  Token0VolumeUsd = 'token0__volumeUSD',
  Token1 = 'token1',
  Token1Tvl = 'token1Tvl',
  Token1Decimals = 'token1__decimals',
  Token1DerivedMatic = 'token1__derivedMatic',
  Token1FeesUsd = 'token1__feesUSD',
  Token1Id = 'token1__id',
  Token1IsSeer = 'token1__isSeer',
  Token1Name = 'token1__name',
  Token1PoolCount = 'token1__poolCount',
  Token1Symbol = 'token1__symbol',
  Token1TotalSupply = 'token1__totalSupply',
  Token1TotalValueLocked = 'token1__totalValueLocked',
  Token1TotalValueLockedUsd = 'token1__totalValueLockedUSD',
  Token1TotalValueLockedUsdUntracked = 'token1__totalValueLockedUSDUntracked',
  Token1TxCount = 'token1__txCount',
  Token1UntrackedVolumeUsd = 'token1__untrackedVolumeUSD',
  Token1Volume = 'token1__volume',
  Token1VolumeUsd = 'token1__volumeUSD',
  Transaction = 'transaction',
  TransactionBlockNumber = 'transaction__blockNumber',
  TransactionGasLimit = 'transaction__gasLimit',
  TransactionGasPrice = 'transaction__gasPrice',
  TransactionId = 'transaction__id',
  TransactionTimestamp = 'transaction__timestamp',
  WithdrawnToken0 = 'withdrawnToken0',
  WithdrawnToken1 = 'withdrawnToken1'
}

export type Query = {
  __typename?: 'Query';
  /** Access to subgraph metadata */
  _meta?: Maybe<_Meta_>;
  algebraDayData?: Maybe<AlgebraDayData>;
  algebraDayDatas: Array<AlgebraDayData>;
  arbitrator?: Maybe<Arbitrator>;
  arbitratorMetadata?: Maybe<ArbitratorMetadata>;
  arbitratorMetadata_collection: Array<ArbitratorMetadata>;
  arbitrators: Array<Arbitrator>;
  block?: Maybe<Block>;
  blocks: Array<Block>;
  burn?: Maybe<Burn>;
  burns: Array<Burn>;
  collect?: Maybe<Collect>;
  collects: Array<Collect>;
  condition?: Maybe<Condition>;
  conditionalEvent?: Maybe<ConditionalEvent>;
  conditionalEvents: Array<ConditionalEvent>;
  conditions: Array<Condition>;
  curateMetadata?: Maybe<CurateMetadata>;
  curateMetadata_collection: Array<CurateMetadata>;
  deposit?: Maybe<Deposit>;
  deposits: Array<Deposit>;
  eternalFarming?: Maybe<EternalFarming>;
  eternalFarmings: Array<EternalFarming>;
  evidence?: Maybe<Evidence>;
  evidenceGroup?: Maybe<EvidenceGroup>;
  evidenceGroups: Array<EvidenceGroup>;
  evidenceMetadata?: Maybe<EvidenceMetadata>;
  evidenceMetadata_collection: Array<EvidenceMetadata>;
  evidences: Array<Evidence>;
  factories: Array<Factory>;
  factory?: Maybe<Factory>;
  feeHourData?: Maybe<FeeHourData>;
  feeHourDatas: Array<FeeHourData>;
  flash?: Maybe<Flash>;
  flashes: Array<Flash>;
  hasPaidAppealFee?: Maybe<HasPaidAppealFee>;
  hasPaidAppealFees: Array<HasPaidAppealFee>;
  image?: Maybe<Image>;
  images: Array<Image>;
  item?: Maybe<Item>;
  itemProp?: Maybe<ItemProp>;
  itemProps: Array<ItemProp>;
  itemSearch: Array<LItemMetadata>;
  items: Array<Item>;
  larbitrator?: Maybe<LArbitrator>;
  larbitrators: Array<LArbitrator>;
  lcontribution?: Maybe<LContribution>;
  lcontributions: Array<LContribution>;
  limitFarming?: Maybe<LimitFarming>;
  limitFarmings: Array<LimitFarming>;
  litem?: Maybe<LItem>;
  litemMetadata?: Maybe<LItemMetadata>;
  litemMetadata_collection: Array<LItemMetadata>;
  litemMetametadata?: Maybe<LItemMetametadata>;
  litemMetametadata_collection: Array<LItemMetametadata>;
  litems: Array<LItem>;
  lregistries: Array<LRegistry>;
  lregistry?: Maybe<LRegistry>;
  lregistryMetadata?: Maybe<LRegistryMetadata>;
  lregistryMetadata_collection: Array<LRegistryMetadata>;
  lrequest?: Maybe<LRequest>;
  lrequests: Array<LRequest>;
  lround?: Maybe<LRound>;
  lrounds: Array<LRound>;
  market?: Maybe<Market>;
  marketDayData?: Maybe<MarketDayData>;
  marketDayDatas: Array<MarketDayData>;
  marketHourData?: Maybe<MarketHourData>;
  marketHourDatas: Array<MarketHourData>;
  marketQuestion?: Maybe<MarketQuestion>;
  marketQuestions: Array<MarketQuestion>;
  markets: Array<Market>;
  marketsCount?: Maybe<MarketsCount>;
  marketsCounts: Array<MarketsCount>;
  metaEvidence?: Maybe<MetaEvidence>;
  metaEvidences: Array<MetaEvidence>;
  metaItemProp?: Maybe<MetaItemProp>;
  metaItemProps: Array<MetaItemProp>;
  mint?: Maybe<Mint>;
  mints: Array<Mint>;
  pool?: Maybe<Pool>;
  poolDayData?: Maybe<PoolDayData>;
  poolDayDatas: Array<PoolDayData>;
  poolFeeData?: Maybe<PoolFeeData>;
  poolFeeDatas: Array<PoolFeeData>;
  poolHourData?: Maybe<PoolHourData>;
  poolHourDatas: Array<PoolHourData>;
  poolPosition?: Maybe<PoolPosition>;
  poolPositions: Array<PoolPosition>;
  pools: Array<Pool>;
  position?: Maybe<Position>;
  positionSnapshot?: Maybe<PositionSnapshot>;
  positionSnapshots: Array<PositionSnapshot>;
  positions: Array<Position>;
  question?: Maybe<Question>;
  questions: Array<Question>;
  registries: Array<Registry>;
  registry?: Maybe<Registry>;
  registrySearch: Array<LRegistryMetadata>;
  request?: Maybe<Request>;
  requests: Array<Request>;
  reward?: Maybe<Reward>;
  rewards: Array<Reward>;
  round?: Maybe<Round>;
  rounds: Array<Round>;
  swap?: Maybe<Swap>;
  swaps: Array<Swap>;
  tick?: Maybe<Tick>;
  tickDayData?: Maybe<TickDayData>;
  tickDayDatas: Array<TickDayData>;
  tickHourData?: Maybe<TickHourData>;
  tickHourDatas: Array<TickHourData>;
  ticks: Array<Tick>;
  token?: Maybe<Token>;
  tokenDayData?: Maybe<TokenDayData>;
  tokenDayDatas: Array<TokenDayData>;
  tokenHourData?: Maybe<TokenHourData>;
  tokenHourDatas: Array<TokenHourData>;
  tokens: Array<Token>;
  transaction?: Maybe<Transaction>;
  transactions: Array<Transaction>;
};


export type Query_MetaArgs = {
  block?: Maybe<Block_Height>;
};


export type QueryAlgebraDayDataArgs = {
  block?: Maybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryAlgebraDayDatasArgs = {
  block?: Maybe<Block_Height>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<AlgebraDayData_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  skip?: Maybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: Maybe<AlgebraDayData_Filter>;
};


export type QueryArbitratorArgs = {
  block?: Maybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryArbitratorMetadataArgs = {
  block?: Maybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryArbitratorMetadata_CollectionArgs = {
  block?: Maybe<Block_Height>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<ArbitratorMetadata_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  skip?: Maybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: Maybe<ArbitratorMetadata_Filter>;
};


export type QueryArbitratorsArgs = {
  block?: Maybe<Block_Height>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Arbitrator_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  skip?: Maybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: Maybe<Arbitrator_Filter>;
};


export type QueryBlockArgs = {
  block?: Maybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryBlocksArgs = {
  block?: Maybe<Block_Height>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Block_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  skip?: Maybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: Maybe<Block_Filter>;
};


export type QueryBurnArgs = {
  block?: Maybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryBurnsArgs = {
  block?: Maybe<Block_Height>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Burn_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  skip?: Maybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: Maybe<Burn_Filter>;
};


export type QueryCollectArgs = {
  block?: Maybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryCollectsArgs = {
  block?: Maybe<Block_Height>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Collect_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  skip?: Maybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: Maybe<Collect_Filter>;
};


export type QueryConditionArgs = {
  block?: Maybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryConditionalEventArgs = {
  block?: Maybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryConditionalEventsArgs = {
  block?: Maybe<Block_Height>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<ConditionalEvent_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  skip?: Maybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: Maybe<ConditionalEvent_Filter>;
};


export type QueryConditionsArgs = {
  block?: Maybe<Block_Height>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Condition_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  skip?: Maybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: Maybe<Condition_Filter>;
};


export type QueryCurateMetadataArgs = {
  block?: Maybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryCurateMetadata_CollectionArgs = {
  block?: Maybe<Block_Height>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<CurateMetadata_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  skip?: Maybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: Maybe<CurateMetadata_Filter>;
};


export type QueryDepositArgs = {
  block?: Maybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryDepositsArgs = {
  block?: Maybe<Block_Height>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Deposit_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  skip?: Maybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: Maybe<Deposit_Filter>;
};


export type QueryEternalFarmingArgs = {
  block?: Maybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryEternalFarmingsArgs = {
  block?: Maybe<Block_Height>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<EternalFarming_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  skip?: Maybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: Maybe<EternalFarming_Filter>;
};


export type QueryEvidenceArgs = {
  block?: Maybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryEvidenceGroupArgs = {
  block?: Maybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryEvidenceGroupsArgs = {
  block?: Maybe<Block_Height>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<EvidenceGroup_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  skip?: Maybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: Maybe<EvidenceGroup_Filter>;
};


export type QueryEvidenceMetadataArgs = {
  block?: Maybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryEvidenceMetadata_CollectionArgs = {
  block?: Maybe<Block_Height>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<EvidenceMetadata_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  skip?: Maybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: Maybe<EvidenceMetadata_Filter>;
};


export type QueryEvidencesArgs = {
  block?: Maybe<Block_Height>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Evidence_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  skip?: Maybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: Maybe<Evidence_Filter>;
};


export type QueryFactoriesArgs = {
  block?: Maybe<Block_Height>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Factory_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  skip?: Maybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: Maybe<Factory_Filter>;
};


export type QueryFactoryArgs = {
  block?: Maybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryFeeHourDataArgs = {
  block?: Maybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryFeeHourDatasArgs = {
  block?: Maybe<Block_Height>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<FeeHourData_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  skip?: Maybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: Maybe<FeeHourData_Filter>;
};


export type QueryFlashArgs = {
  block?: Maybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryFlashesArgs = {
  block?: Maybe<Block_Height>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Flash_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  skip?: Maybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: Maybe<Flash_Filter>;
};


export type QueryHasPaidAppealFeeArgs = {
  block?: Maybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryHasPaidAppealFeesArgs = {
  block?: Maybe<Block_Height>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<HasPaidAppealFee_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  skip?: Maybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: Maybe<HasPaidAppealFee_Filter>;
};


export type QueryImageArgs = {
  block?: Maybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryImagesArgs = {
  block?: Maybe<Block_Height>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Image_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  skip?: Maybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: Maybe<Image_Filter>;
};


export type QueryItemArgs = {
  block?: Maybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryItemPropArgs = {
  block?: Maybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryItemPropsArgs = {
  block?: Maybe<Block_Height>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<ItemProp_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  skip?: Maybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: Maybe<ItemProp_Filter>;
};


export type QueryItemSearchArgs = {
  block?: Maybe<Block_Height>;
  first?: Maybe<Scalars['Int']>;
  skip?: Maybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  text: Scalars['String'];
  where?: Maybe<LItemMetadata_Filter>;
};


export type QueryItemsArgs = {
  block?: Maybe<Block_Height>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Item_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  skip?: Maybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: Maybe<Item_Filter>;
};


export type QueryLarbitratorArgs = {
  block?: Maybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryLarbitratorsArgs = {
  block?: Maybe<Block_Height>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<LArbitrator_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  skip?: Maybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: Maybe<LArbitrator_Filter>;
};


export type QueryLcontributionArgs = {
  block?: Maybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryLcontributionsArgs = {
  block?: Maybe<Block_Height>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<LContribution_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  skip?: Maybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: Maybe<LContribution_Filter>;
};


export type QueryLimitFarmingArgs = {
  block?: Maybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryLimitFarmingsArgs = {
  block?: Maybe<Block_Height>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<LimitFarming_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  skip?: Maybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: Maybe<LimitFarming_Filter>;
};


export type QueryLitemArgs = {
  block?: Maybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryLitemMetadataArgs = {
  block?: Maybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryLitemMetadata_CollectionArgs = {
  block?: Maybe<Block_Height>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<LItemMetadata_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  skip?: Maybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: Maybe<LItemMetadata_Filter>;
};


export type QueryLitemMetametadataArgs = {
  block?: Maybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryLitemMetametadata_CollectionArgs = {
  block?: Maybe<Block_Height>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<LItemMetametadata_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  skip?: Maybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: Maybe<LItemMetametadata_Filter>;
};


export type QueryLitemsArgs = {
  block?: Maybe<Block_Height>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<LItem_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  skip?: Maybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: Maybe<LItem_Filter>;
};


export type QueryLregistriesArgs = {
  block?: Maybe<Block_Height>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<LRegistry_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  skip?: Maybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: Maybe<LRegistry_Filter>;
};


export type QueryLregistryArgs = {
  block?: Maybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryLregistryMetadataArgs = {
  block?: Maybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryLregistryMetadata_CollectionArgs = {
  block?: Maybe<Block_Height>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<LRegistryMetadata_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  skip?: Maybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: Maybe<LRegistryMetadata_Filter>;
};


export type QueryLrequestArgs = {
  block?: Maybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryLrequestsArgs = {
  block?: Maybe<Block_Height>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<LRequest_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  skip?: Maybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: Maybe<LRequest_Filter>;
};


export type QueryLroundArgs = {
  block?: Maybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryLroundsArgs = {
  block?: Maybe<Block_Height>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<LRound_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  skip?: Maybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: Maybe<LRound_Filter>;
};


export type QueryMarketArgs = {
  block?: Maybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryMarketDayDataArgs = {
  block?: Maybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryMarketDayDatasArgs = {
  block?: Maybe<Block_Height>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<MarketDayData_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  skip?: Maybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: Maybe<MarketDayData_Filter>;
};


export type QueryMarketHourDataArgs = {
  block?: Maybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryMarketHourDatasArgs = {
  block?: Maybe<Block_Height>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<MarketHourData_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  skip?: Maybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: Maybe<MarketHourData_Filter>;
};


export type QueryMarketQuestionArgs = {
  block?: Maybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryMarketQuestionsArgs = {
  block?: Maybe<Block_Height>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<MarketQuestion_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  skip?: Maybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: Maybe<MarketQuestion_Filter>;
};


export type QueryMarketsArgs = {
  block?: Maybe<Block_Height>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Market_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  skip?: Maybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: Maybe<Market_Filter>;
};


export type QueryMarketsCountArgs = {
  block?: Maybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryMarketsCountsArgs = {
  block?: Maybe<Block_Height>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<MarketsCount_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  skip?: Maybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: Maybe<MarketsCount_Filter>;
};


export type QueryMetaEvidenceArgs = {
  block?: Maybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryMetaEvidencesArgs = {
  block?: Maybe<Block_Height>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<MetaEvidence_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  skip?: Maybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: Maybe<MetaEvidence_Filter>;
};


export type QueryMetaItemPropArgs = {
  block?: Maybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryMetaItemPropsArgs = {
  block?: Maybe<Block_Height>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<MetaItemProp_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  skip?: Maybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: Maybe<MetaItemProp_Filter>;
};


export type QueryMintArgs = {
  block?: Maybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryMintsArgs = {
  block?: Maybe<Block_Height>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Mint_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  skip?: Maybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: Maybe<Mint_Filter>;
};


export type QueryPoolArgs = {
  block?: Maybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryPoolDayDataArgs = {
  block?: Maybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryPoolDayDatasArgs = {
  block?: Maybe<Block_Height>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<PoolDayData_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  skip?: Maybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: Maybe<PoolDayData_Filter>;
};


export type QueryPoolFeeDataArgs = {
  block?: Maybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryPoolFeeDatasArgs = {
  block?: Maybe<Block_Height>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<PoolFeeData_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  skip?: Maybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: Maybe<PoolFeeData_Filter>;
};


export type QueryPoolHourDataArgs = {
  block?: Maybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryPoolHourDatasArgs = {
  block?: Maybe<Block_Height>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<PoolHourData_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  skip?: Maybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: Maybe<PoolHourData_Filter>;
};


export type QueryPoolPositionArgs = {
  block?: Maybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryPoolPositionsArgs = {
  block?: Maybe<Block_Height>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<PoolPosition_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  skip?: Maybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: Maybe<PoolPosition_Filter>;
};


export type QueryPoolsArgs = {
  block?: Maybe<Block_Height>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Pool_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  skip?: Maybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: Maybe<Pool_Filter>;
};


export type QueryPositionArgs = {
  block?: Maybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryPositionSnapshotArgs = {
  block?: Maybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryPositionSnapshotsArgs = {
  block?: Maybe<Block_Height>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<PositionSnapshot_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  skip?: Maybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: Maybe<PositionSnapshot_Filter>;
};


export type QueryPositionsArgs = {
  block?: Maybe<Block_Height>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Position_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  skip?: Maybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: Maybe<Position_Filter>;
};


export type QueryQuestionArgs = {
  block?: Maybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryQuestionsArgs = {
  block?: Maybe<Block_Height>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Question_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  skip?: Maybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: Maybe<Question_Filter>;
};


export type QueryRegistriesArgs = {
  block?: Maybe<Block_Height>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Registry_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  skip?: Maybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: Maybe<Registry_Filter>;
};


export type QueryRegistryArgs = {
  block?: Maybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryRegistrySearchArgs = {
  block?: Maybe<Block_Height>;
  first?: Maybe<Scalars['Int']>;
  skip?: Maybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  text: Scalars['String'];
  where?: Maybe<LRegistryMetadata_Filter>;
};


export type QueryRequestArgs = {
  block?: Maybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryRequestsArgs = {
  block?: Maybe<Block_Height>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Request_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  skip?: Maybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: Maybe<Request_Filter>;
};


export type QueryRewardArgs = {
  block?: Maybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryRewardsArgs = {
  block?: Maybe<Block_Height>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Reward_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  skip?: Maybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: Maybe<Reward_Filter>;
};


export type QueryRoundArgs = {
  block?: Maybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryRoundsArgs = {
  block?: Maybe<Block_Height>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Round_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  skip?: Maybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: Maybe<Round_Filter>;
};


export type QuerySwapArgs = {
  block?: Maybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QuerySwapsArgs = {
  block?: Maybe<Block_Height>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Swap_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  skip?: Maybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: Maybe<Swap_Filter>;
};


export type QueryTickArgs = {
  block?: Maybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryTickDayDataArgs = {
  block?: Maybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryTickDayDatasArgs = {
  block?: Maybe<Block_Height>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<TickDayData_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  skip?: Maybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: Maybe<TickDayData_Filter>;
};


export type QueryTickHourDataArgs = {
  block?: Maybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryTickHourDatasArgs = {
  block?: Maybe<Block_Height>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<TickHourData_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  skip?: Maybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: Maybe<TickHourData_Filter>;
};


export type QueryTicksArgs = {
  block?: Maybe<Block_Height>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Tick_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  skip?: Maybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: Maybe<Tick_Filter>;
};


export type QueryTokenArgs = {
  block?: Maybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryTokenDayDataArgs = {
  block?: Maybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryTokenDayDatasArgs = {
  block?: Maybe<Block_Height>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<TokenDayData_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  skip?: Maybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: Maybe<TokenDayData_Filter>;
};


export type QueryTokenHourDataArgs = {
  block?: Maybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryTokenHourDatasArgs = {
  block?: Maybe<Block_Height>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<TokenHourData_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  skip?: Maybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: Maybe<TokenHourData_Filter>;
};


export type QueryTokensArgs = {
  block?: Maybe<Block_Height>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Token_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  skip?: Maybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: Maybe<Token_Filter>;
};


export type QueryTransactionArgs = {
  block?: Maybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryTransactionsArgs = {
  block?: Maybe<Block_Height>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Transaction_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  skip?: Maybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: Maybe<Transaction_Filter>;
};

export type Question = {
  __typename?: 'Question';
  arbitration_occurred: Scalars['Boolean'];
  arbitrator: Scalars['Bytes'];
  /**  MarketQuestion's that have this Question as the baseQuestion  */
  baseQuestions: Array<MarketQuestion>;
  best_answer: Scalars['Bytes'];
  bond: Scalars['BigInt'];
  finalize_ts: Scalars['BigInt'];
  id: Scalars['ID'];
  index: Scalars['Int'];
  is_pending_arbitration: Scalars['Boolean'];
  /**  MarketQuestion's that have this Question as the current question  */
  marketQuestions: Array<MarketQuestion>;
  min_bond: Scalars['BigInt'];
  opening_ts: Scalars['BigInt'];
  timeout: Scalars['BigInt'];
};


export type QuestionBaseQuestionsArgs = {
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<MarketQuestion_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  skip?: Maybe<Scalars['Int']>;
  where?: Maybe<MarketQuestion_Filter>;
};


export type QuestionMarketQuestionsArgs = {
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<MarketQuestion_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  skip?: Maybe<Scalars['Int']>;
  where?: Maybe<MarketQuestion_Filter>;
};

export type Question_Filter = {
  /** Filter for the block changed event. */
  _change_block?: Maybe<BlockChangedFilter>;
  and?: Maybe<Array<Maybe<Question_Filter>>>;
  arbitration_occurred?: Maybe<Scalars['Boolean']>;
  arbitration_occurred_in?: Maybe<Array<Scalars['Boolean']>>;
  arbitration_occurred_not?: Maybe<Scalars['Boolean']>;
  arbitration_occurred_not_in?: Maybe<Array<Scalars['Boolean']>>;
  arbitrator?: Maybe<Scalars['Bytes']>;
  arbitrator_contains?: Maybe<Scalars['Bytes']>;
  arbitrator_gt?: Maybe<Scalars['Bytes']>;
  arbitrator_gte?: Maybe<Scalars['Bytes']>;
  arbitrator_in?: Maybe<Array<Scalars['Bytes']>>;
  arbitrator_lt?: Maybe<Scalars['Bytes']>;
  arbitrator_lte?: Maybe<Scalars['Bytes']>;
  arbitrator_not?: Maybe<Scalars['Bytes']>;
  arbitrator_not_contains?: Maybe<Scalars['Bytes']>;
  arbitrator_not_in?: Maybe<Array<Scalars['Bytes']>>;
  baseQuestions_?: Maybe<MarketQuestion_Filter>;
  best_answer?: Maybe<Scalars['Bytes']>;
  best_answer_contains?: Maybe<Scalars['Bytes']>;
  best_answer_gt?: Maybe<Scalars['Bytes']>;
  best_answer_gte?: Maybe<Scalars['Bytes']>;
  best_answer_in?: Maybe<Array<Scalars['Bytes']>>;
  best_answer_lt?: Maybe<Scalars['Bytes']>;
  best_answer_lte?: Maybe<Scalars['Bytes']>;
  best_answer_not?: Maybe<Scalars['Bytes']>;
  best_answer_not_contains?: Maybe<Scalars['Bytes']>;
  best_answer_not_in?: Maybe<Array<Scalars['Bytes']>>;
  bond?: Maybe<Scalars['BigInt']>;
  bond_gt?: Maybe<Scalars['BigInt']>;
  bond_gte?: Maybe<Scalars['BigInt']>;
  bond_in?: Maybe<Array<Scalars['BigInt']>>;
  bond_lt?: Maybe<Scalars['BigInt']>;
  bond_lte?: Maybe<Scalars['BigInt']>;
  bond_not?: Maybe<Scalars['BigInt']>;
  bond_not_in?: Maybe<Array<Scalars['BigInt']>>;
  finalize_ts?: Maybe<Scalars['BigInt']>;
  finalize_ts_gt?: Maybe<Scalars['BigInt']>;
  finalize_ts_gte?: Maybe<Scalars['BigInt']>;
  finalize_ts_in?: Maybe<Array<Scalars['BigInt']>>;
  finalize_ts_lt?: Maybe<Scalars['BigInt']>;
  finalize_ts_lte?: Maybe<Scalars['BigInt']>;
  finalize_ts_not?: Maybe<Scalars['BigInt']>;
  finalize_ts_not_in?: Maybe<Array<Scalars['BigInt']>>;
  id?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_lt?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
  index?: Maybe<Scalars['Int']>;
  index_gt?: Maybe<Scalars['Int']>;
  index_gte?: Maybe<Scalars['Int']>;
  index_in?: Maybe<Array<Scalars['Int']>>;
  index_lt?: Maybe<Scalars['Int']>;
  index_lte?: Maybe<Scalars['Int']>;
  index_not?: Maybe<Scalars['Int']>;
  index_not_in?: Maybe<Array<Scalars['Int']>>;
  is_pending_arbitration?: Maybe<Scalars['Boolean']>;
  is_pending_arbitration_in?: Maybe<Array<Scalars['Boolean']>>;
  is_pending_arbitration_not?: Maybe<Scalars['Boolean']>;
  is_pending_arbitration_not_in?: Maybe<Array<Scalars['Boolean']>>;
  marketQuestions_?: Maybe<MarketQuestion_Filter>;
  min_bond?: Maybe<Scalars['BigInt']>;
  min_bond_gt?: Maybe<Scalars['BigInt']>;
  min_bond_gte?: Maybe<Scalars['BigInt']>;
  min_bond_in?: Maybe<Array<Scalars['BigInt']>>;
  min_bond_lt?: Maybe<Scalars['BigInt']>;
  min_bond_lte?: Maybe<Scalars['BigInt']>;
  min_bond_not?: Maybe<Scalars['BigInt']>;
  min_bond_not_in?: Maybe<Array<Scalars['BigInt']>>;
  opening_ts?: Maybe<Scalars['BigInt']>;
  opening_ts_gt?: Maybe<Scalars['BigInt']>;
  opening_ts_gte?: Maybe<Scalars['BigInt']>;
  opening_ts_in?: Maybe<Array<Scalars['BigInt']>>;
  opening_ts_lt?: Maybe<Scalars['BigInt']>;
  opening_ts_lte?: Maybe<Scalars['BigInt']>;
  opening_ts_not?: Maybe<Scalars['BigInt']>;
  opening_ts_not_in?: Maybe<Array<Scalars['BigInt']>>;
  or?: Maybe<Array<Maybe<Question_Filter>>>;
  timeout?: Maybe<Scalars['BigInt']>;
  timeout_gt?: Maybe<Scalars['BigInt']>;
  timeout_gte?: Maybe<Scalars['BigInt']>;
  timeout_in?: Maybe<Array<Scalars['BigInt']>>;
  timeout_lt?: Maybe<Scalars['BigInt']>;
  timeout_lte?: Maybe<Scalars['BigInt']>;
  timeout_not?: Maybe<Scalars['BigInt']>;
  timeout_not_in?: Maybe<Array<Scalars['BigInt']>>;
};

export enum Question_OrderBy {
  ArbitrationOccurred = 'arbitration_occurred',
  Arbitrator = 'arbitrator',
  BaseQuestions = 'baseQuestions',
  BestAnswer = 'best_answer',
  Bond = 'bond',
  FinalizeTs = 'finalize_ts',
  Id = 'id',
  Index = 'index',
  IsPendingArbitration = 'is_pending_arbitration',
  MarketQuestions = 'marketQuestions',
  MinBond = 'min_bond',
  OpeningTs = 'opening_ts',
  Timeout = 'timeout'
}

export type Registry = {
  __typename?: 'Registry';
  /** The current removal meta evidence */
  clearingMetaEvidence: MetaEvidence;
  /** Connected TCR. Can be the 0 address. In practice, will never be null. */
  connectedTCR?: Maybe<Scalars['Bytes']>;
  /** The registry address */
  id: Scalars['ID'];
  /** The items submitted to this list */
  items: Array<Item>;
  /** The number of MetaEvidence event logs emitted. */
  metaEvidenceCount: Scalars['BigInt'];
  /** The number of items submitted to the list. */
  numberOfItems: Scalars['BigInt'];
  /** The current registration meta evidence */
  registrationMetaEvidence: MetaEvidence;
  /** The requests submitted to this list */
  requests: Array<Request>;
};


export type RegistryItemsArgs = {
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Item_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  skip?: Maybe<Scalars['Int']>;
  where?: Maybe<Item_Filter>;
};


export type RegistryRequestsArgs = {
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Request_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  skip?: Maybe<Scalars['Int']>;
  where?: Maybe<Request_Filter>;
};

export type Registry_Filter = {
  /** Filter for the block changed event. */
  _change_block?: Maybe<BlockChangedFilter>;
  and?: Maybe<Array<Maybe<Registry_Filter>>>;
  clearingMetaEvidence?: Maybe<Scalars['String']>;
  clearingMetaEvidence_?: Maybe<MetaEvidence_Filter>;
  clearingMetaEvidence_contains?: Maybe<Scalars['String']>;
  clearingMetaEvidence_contains_nocase?: Maybe<Scalars['String']>;
  clearingMetaEvidence_ends_with?: Maybe<Scalars['String']>;
  clearingMetaEvidence_ends_with_nocase?: Maybe<Scalars['String']>;
  clearingMetaEvidence_gt?: Maybe<Scalars['String']>;
  clearingMetaEvidence_gte?: Maybe<Scalars['String']>;
  clearingMetaEvidence_in?: Maybe<Array<Scalars['String']>>;
  clearingMetaEvidence_lt?: Maybe<Scalars['String']>;
  clearingMetaEvidence_lte?: Maybe<Scalars['String']>;
  clearingMetaEvidence_not?: Maybe<Scalars['String']>;
  clearingMetaEvidence_not_contains?: Maybe<Scalars['String']>;
  clearingMetaEvidence_not_contains_nocase?: Maybe<Scalars['String']>;
  clearingMetaEvidence_not_ends_with?: Maybe<Scalars['String']>;
  clearingMetaEvidence_not_ends_with_nocase?: Maybe<Scalars['String']>;
  clearingMetaEvidence_not_in?: Maybe<Array<Scalars['String']>>;
  clearingMetaEvidence_not_starts_with?: Maybe<Scalars['String']>;
  clearingMetaEvidence_not_starts_with_nocase?: Maybe<Scalars['String']>;
  clearingMetaEvidence_starts_with?: Maybe<Scalars['String']>;
  clearingMetaEvidence_starts_with_nocase?: Maybe<Scalars['String']>;
  connectedTCR?: Maybe<Scalars['Bytes']>;
  connectedTCR_contains?: Maybe<Scalars['Bytes']>;
  connectedTCR_gt?: Maybe<Scalars['Bytes']>;
  connectedTCR_gte?: Maybe<Scalars['Bytes']>;
  connectedTCR_in?: Maybe<Array<Scalars['Bytes']>>;
  connectedTCR_lt?: Maybe<Scalars['Bytes']>;
  connectedTCR_lte?: Maybe<Scalars['Bytes']>;
  connectedTCR_not?: Maybe<Scalars['Bytes']>;
  connectedTCR_not_contains?: Maybe<Scalars['Bytes']>;
  connectedTCR_not_in?: Maybe<Array<Scalars['Bytes']>>;
  id?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_lt?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
  items_?: Maybe<Item_Filter>;
  metaEvidenceCount?: Maybe<Scalars['BigInt']>;
  metaEvidenceCount_gt?: Maybe<Scalars['BigInt']>;
  metaEvidenceCount_gte?: Maybe<Scalars['BigInt']>;
  metaEvidenceCount_in?: Maybe<Array<Scalars['BigInt']>>;
  metaEvidenceCount_lt?: Maybe<Scalars['BigInt']>;
  metaEvidenceCount_lte?: Maybe<Scalars['BigInt']>;
  metaEvidenceCount_not?: Maybe<Scalars['BigInt']>;
  metaEvidenceCount_not_in?: Maybe<Array<Scalars['BigInt']>>;
  numberOfItems?: Maybe<Scalars['BigInt']>;
  numberOfItems_gt?: Maybe<Scalars['BigInt']>;
  numberOfItems_gte?: Maybe<Scalars['BigInt']>;
  numberOfItems_in?: Maybe<Array<Scalars['BigInt']>>;
  numberOfItems_lt?: Maybe<Scalars['BigInt']>;
  numberOfItems_lte?: Maybe<Scalars['BigInt']>;
  numberOfItems_not?: Maybe<Scalars['BigInt']>;
  numberOfItems_not_in?: Maybe<Array<Scalars['BigInt']>>;
  or?: Maybe<Array<Maybe<Registry_Filter>>>;
  registrationMetaEvidence?: Maybe<Scalars['String']>;
  registrationMetaEvidence_?: Maybe<MetaEvidence_Filter>;
  registrationMetaEvidence_contains?: Maybe<Scalars['String']>;
  registrationMetaEvidence_contains_nocase?: Maybe<Scalars['String']>;
  registrationMetaEvidence_ends_with?: Maybe<Scalars['String']>;
  registrationMetaEvidence_ends_with_nocase?: Maybe<Scalars['String']>;
  registrationMetaEvidence_gt?: Maybe<Scalars['String']>;
  registrationMetaEvidence_gte?: Maybe<Scalars['String']>;
  registrationMetaEvidence_in?: Maybe<Array<Scalars['String']>>;
  registrationMetaEvidence_lt?: Maybe<Scalars['String']>;
  registrationMetaEvidence_lte?: Maybe<Scalars['String']>;
  registrationMetaEvidence_not?: Maybe<Scalars['String']>;
  registrationMetaEvidence_not_contains?: Maybe<Scalars['String']>;
  registrationMetaEvidence_not_contains_nocase?: Maybe<Scalars['String']>;
  registrationMetaEvidence_not_ends_with?: Maybe<Scalars['String']>;
  registrationMetaEvidence_not_ends_with_nocase?: Maybe<Scalars['String']>;
  registrationMetaEvidence_not_in?: Maybe<Array<Scalars['String']>>;
  registrationMetaEvidence_not_starts_with?: Maybe<Scalars['String']>;
  registrationMetaEvidence_not_starts_with_nocase?: Maybe<Scalars['String']>;
  registrationMetaEvidence_starts_with?: Maybe<Scalars['String']>;
  registrationMetaEvidence_starts_with_nocase?: Maybe<Scalars['String']>;
  requests_?: Maybe<Request_Filter>;
};

export enum Registry_OrderBy {
  ClearingMetaEvidence = 'clearingMetaEvidence',
  ClearingMetaEvidenceUri = 'clearingMetaEvidence__URI',
  ClearingMetaEvidenceId = 'clearingMetaEvidence__id',
  ConnectedTcr = 'connectedTCR',
  Id = 'id',
  Items = 'items',
  MetaEvidenceCount = 'metaEvidenceCount',
  NumberOfItems = 'numberOfItems',
  RegistrationMetaEvidence = 'registrationMetaEvidence',
  RegistrationMetaEvidenceUri = 'registrationMetaEvidence__URI',
  RegistrationMetaEvidenceId = 'registrationMetaEvidence__id',
  Requests = 'requests'
}

export type Request = {
  __typename?: 'Request';
  /** The arbitrator trusted to solve disputes for this request. */
  arbitrator: Scalars['Bytes'];
  /** The extra data for the trusted arbitrator of this request. */
  arbitratorExtraData: Scalars['Bytes'];
  /** The address of the party that challenged the request */
  challenger: Scalars['Bytes'];
  /** The hash of the transaction that created this request. */
  creationTx: Scalars['Bytes'];
  /** The deposit that would be awarded to the challenger if challenge is successful */
  deposit: Scalars['BigInt'];
  /** ID of the dispute, if any. */
  disputeID: Scalars['BigInt'];
  /** The outcome of the dispute, if any. Note that unsuccessful appeal fundings can invert the arbitrator ruling (so this may differ from the ruling given by the arbitrator). */
  disputeOutcome: Ruling;
  /** True if a dispute was raised. */
  disputed: Scalars['Boolean'];
  /** The evidence group for this request. */
  evidenceGroup: EvidenceGroup;
  /** Only set if the request was settled by a dispute. Used by the twitter bot */
  finalRuling?: Maybe<Scalars['BigInt']>;
  /** <itemID>-<requestId> */
  id: Scalars['ID'];
  /** The item this request belongs to. */
  item: Item;
  /** The URI to the meta evidence used for this request. */
  metaEvidence: MetaEvidence;
  /** The total number of rounds on this request. */
  numberOfRounds: Scalars['BigInt'];
  /** The registry where this request was submitted. */
  registry: Registry;
  /** The address of the registry this item was submitted. Redundant with registry field to allow use in conditionals. */
  registryAddress: Scalars['Bytes'];
  /** Whether it was requested to add or remove the item to/from the list. */
  requestType: Status;
  /** The address of the party that made a request */
  requester: Scalars['Bytes'];
  /** The time the request was resolved. */
  resolutionTime: Scalars['BigInt'];
  /** The hash of the transaction that solved this request. */
  resolutionTx?: Maybe<Scalars['Bytes']>;
  /** True if the request was executed and/or any raised disputes were resolved. */
  resolved: Scalars['Boolean'];
  /** Tracks each round of a dispute in the form rounds[roundID]. */
  rounds: Array<Round>;
  /** Time when the request was made. Used to track when the challenge period ends. */
  submissionTime: Scalars['BigInt'];
};


export type RequestRoundsArgs = {
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Round_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  skip?: Maybe<Scalars['Int']>;
  where?: Maybe<Round_Filter>;
};

export type Request_Filter = {
  /** Filter for the block changed event. */
  _change_block?: Maybe<BlockChangedFilter>;
  and?: Maybe<Array<Maybe<Request_Filter>>>;
  arbitrator?: Maybe<Scalars['Bytes']>;
  arbitratorExtraData?: Maybe<Scalars['Bytes']>;
  arbitratorExtraData_contains?: Maybe<Scalars['Bytes']>;
  arbitratorExtraData_gt?: Maybe<Scalars['Bytes']>;
  arbitratorExtraData_gte?: Maybe<Scalars['Bytes']>;
  arbitratorExtraData_in?: Maybe<Array<Scalars['Bytes']>>;
  arbitratorExtraData_lt?: Maybe<Scalars['Bytes']>;
  arbitratorExtraData_lte?: Maybe<Scalars['Bytes']>;
  arbitratorExtraData_not?: Maybe<Scalars['Bytes']>;
  arbitratorExtraData_not_contains?: Maybe<Scalars['Bytes']>;
  arbitratorExtraData_not_in?: Maybe<Array<Scalars['Bytes']>>;
  arbitrator_contains?: Maybe<Scalars['Bytes']>;
  arbitrator_gt?: Maybe<Scalars['Bytes']>;
  arbitrator_gte?: Maybe<Scalars['Bytes']>;
  arbitrator_in?: Maybe<Array<Scalars['Bytes']>>;
  arbitrator_lt?: Maybe<Scalars['Bytes']>;
  arbitrator_lte?: Maybe<Scalars['Bytes']>;
  arbitrator_not?: Maybe<Scalars['Bytes']>;
  arbitrator_not_contains?: Maybe<Scalars['Bytes']>;
  arbitrator_not_in?: Maybe<Array<Scalars['Bytes']>>;
  challenger?: Maybe<Scalars['Bytes']>;
  challenger_contains?: Maybe<Scalars['Bytes']>;
  challenger_gt?: Maybe<Scalars['Bytes']>;
  challenger_gte?: Maybe<Scalars['Bytes']>;
  challenger_in?: Maybe<Array<Scalars['Bytes']>>;
  challenger_lt?: Maybe<Scalars['Bytes']>;
  challenger_lte?: Maybe<Scalars['Bytes']>;
  challenger_not?: Maybe<Scalars['Bytes']>;
  challenger_not_contains?: Maybe<Scalars['Bytes']>;
  challenger_not_in?: Maybe<Array<Scalars['Bytes']>>;
  creationTx?: Maybe<Scalars['Bytes']>;
  creationTx_contains?: Maybe<Scalars['Bytes']>;
  creationTx_gt?: Maybe<Scalars['Bytes']>;
  creationTx_gte?: Maybe<Scalars['Bytes']>;
  creationTx_in?: Maybe<Array<Scalars['Bytes']>>;
  creationTx_lt?: Maybe<Scalars['Bytes']>;
  creationTx_lte?: Maybe<Scalars['Bytes']>;
  creationTx_not?: Maybe<Scalars['Bytes']>;
  creationTx_not_contains?: Maybe<Scalars['Bytes']>;
  creationTx_not_in?: Maybe<Array<Scalars['Bytes']>>;
  deposit?: Maybe<Scalars['BigInt']>;
  deposit_gt?: Maybe<Scalars['BigInt']>;
  deposit_gte?: Maybe<Scalars['BigInt']>;
  deposit_in?: Maybe<Array<Scalars['BigInt']>>;
  deposit_lt?: Maybe<Scalars['BigInt']>;
  deposit_lte?: Maybe<Scalars['BigInt']>;
  deposit_not?: Maybe<Scalars['BigInt']>;
  deposit_not_in?: Maybe<Array<Scalars['BigInt']>>;
  disputeID?: Maybe<Scalars['BigInt']>;
  disputeID_gt?: Maybe<Scalars['BigInt']>;
  disputeID_gte?: Maybe<Scalars['BigInt']>;
  disputeID_in?: Maybe<Array<Scalars['BigInt']>>;
  disputeID_lt?: Maybe<Scalars['BigInt']>;
  disputeID_lte?: Maybe<Scalars['BigInt']>;
  disputeID_not?: Maybe<Scalars['BigInt']>;
  disputeID_not_in?: Maybe<Array<Scalars['BigInt']>>;
  disputeOutcome?: Maybe<Ruling>;
  disputeOutcome_in?: Maybe<Array<Ruling>>;
  disputeOutcome_not?: Maybe<Ruling>;
  disputeOutcome_not_in?: Maybe<Array<Ruling>>;
  disputed?: Maybe<Scalars['Boolean']>;
  disputed_in?: Maybe<Array<Scalars['Boolean']>>;
  disputed_not?: Maybe<Scalars['Boolean']>;
  disputed_not_in?: Maybe<Array<Scalars['Boolean']>>;
  evidenceGroup?: Maybe<Scalars['String']>;
  evidenceGroup_?: Maybe<EvidenceGroup_Filter>;
  evidenceGroup_contains?: Maybe<Scalars['String']>;
  evidenceGroup_contains_nocase?: Maybe<Scalars['String']>;
  evidenceGroup_ends_with?: Maybe<Scalars['String']>;
  evidenceGroup_ends_with_nocase?: Maybe<Scalars['String']>;
  evidenceGroup_gt?: Maybe<Scalars['String']>;
  evidenceGroup_gte?: Maybe<Scalars['String']>;
  evidenceGroup_in?: Maybe<Array<Scalars['String']>>;
  evidenceGroup_lt?: Maybe<Scalars['String']>;
  evidenceGroup_lte?: Maybe<Scalars['String']>;
  evidenceGroup_not?: Maybe<Scalars['String']>;
  evidenceGroup_not_contains?: Maybe<Scalars['String']>;
  evidenceGroup_not_contains_nocase?: Maybe<Scalars['String']>;
  evidenceGroup_not_ends_with?: Maybe<Scalars['String']>;
  evidenceGroup_not_ends_with_nocase?: Maybe<Scalars['String']>;
  evidenceGroup_not_in?: Maybe<Array<Scalars['String']>>;
  evidenceGroup_not_starts_with?: Maybe<Scalars['String']>;
  evidenceGroup_not_starts_with_nocase?: Maybe<Scalars['String']>;
  evidenceGroup_starts_with?: Maybe<Scalars['String']>;
  evidenceGroup_starts_with_nocase?: Maybe<Scalars['String']>;
  finalRuling?: Maybe<Scalars['BigInt']>;
  finalRuling_gt?: Maybe<Scalars['BigInt']>;
  finalRuling_gte?: Maybe<Scalars['BigInt']>;
  finalRuling_in?: Maybe<Array<Scalars['BigInt']>>;
  finalRuling_lt?: Maybe<Scalars['BigInt']>;
  finalRuling_lte?: Maybe<Scalars['BigInt']>;
  finalRuling_not?: Maybe<Scalars['BigInt']>;
  finalRuling_not_in?: Maybe<Array<Scalars['BigInt']>>;
  id?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_lt?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
  item?: Maybe<Scalars['String']>;
  item_?: Maybe<Item_Filter>;
  item_contains?: Maybe<Scalars['String']>;
  item_contains_nocase?: Maybe<Scalars['String']>;
  item_ends_with?: Maybe<Scalars['String']>;
  item_ends_with_nocase?: Maybe<Scalars['String']>;
  item_gt?: Maybe<Scalars['String']>;
  item_gte?: Maybe<Scalars['String']>;
  item_in?: Maybe<Array<Scalars['String']>>;
  item_lt?: Maybe<Scalars['String']>;
  item_lte?: Maybe<Scalars['String']>;
  item_not?: Maybe<Scalars['String']>;
  item_not_contains?: Maybe<Scalars['String']>;
  item_not_contains_nocase?: Maybe<Scalars['String']>;
  item_not_ends_with?: Maybe<Scalars['String']>;
  item_not_ends_with_nocase?: Maybe<Scalars['String']>;
  item_not_in?: Maybe<Array<Scalars['String']>>;
  item_not_starts_with?: Maybe<Scalars['String']>;
  item_not_starts_with_nocase?: Maybe<Scalars['String']>;
  item_starts_with?: Maybe<Scalars['String']>;
  item_starts_with_nocase?: Maybe<Scalars['String']>;
  metaEvidence?: Maybe<Scalars['String']>;
  metaEvidence_?: Maybe<MetaEvidence_Filter>;
  metaEvidence_contains?: Maybe<Scalars['String']>;
  metaEvidence_contains_nocase?: Maybe<Scalars['String']>;
  metaEvidence_ends_with?: Maybe<Scalars['String']>;
  metaEvidence_ends_with_nocase?: Maybe<Scalars['String']>;
  metaEvidence_gt?: Maybe<Scalars['String']>;
  metaEvidence_gte?: Maybe<Scalars['String']>;
  metaEvidence_in?: Maybe<Array<Scalars['String']>>;
  metaEvidence_lt?: Maybe<Scalars['String']>;
  metaEvidence_lte?: Maybe<Scalars['String']>;
  metaEvidence_not?: Maybe<Scalars['String']>;
  metaEvidence_not_contains?: Maybe<Scalars['String']>;
  metaEvidence_not_contains_nocase?: Maybe<Scalars['String']>;
  metaEvidence_not_ends_with?: Maybe<Scalars['String']>;
  metaEvidence_not_ends_with_nocase?: Maybe<Scalars['String']>;
  metaEvidence_not_in?: Maybe<Array<Scalars['String']>>;
  metaEvidence_not_starts_with?: Maybe<Scalars['String']>;
  metaEvidence_not_starts_with_nocase?: Maybe<Scalars['String']>;
  metaEvidence_starts_with?: Maybe<Scalars['String']>;
  metaEvidence_starts_with_nocase?: Maybe<Scalars['String']>;
  numberOfRounds?: Maybe<Scalars['BigInt']>;
  numberOfRounds_gt?: Maybe<Scalars['BigInt']>;
  numberOfRounds_gte?: Maybe<Scalars['BigInt']>;
  numberOfRounds_in?: Maybe<Array<Scalars['BigInt']>>;
  numberOfRounds_lt?: Maybe<Scalars['BigInt']>;
  numberOfRounds_lte?: Maybe<Scalars['BigInt']>;
  numberOfRounds_not?: Maybe<Scalars['BigInt']>;
  numberOfRounds_not_in?: Maybe<Array<Scalars['BigInt']>>;
  or?: Maybe<Array<Maybe<Request_Filter>>>;
  registry?: Maybe<Scalars['String']>;
  registryAddress?: Maybe<Scalars['Bytes']>;
  registryAddress_contains?: Maybe<Scalars['Bytes']>;
  registryAddress_gt?: Maybe<Scalars['Bytes']>;
  registryAddress_gte?: Maybe<Scalars['Bytes']>;
  registryAddress_in?: Maybe<Array<Scalars['Bytes']>>;
  registryAddress_lt?: Maybe<Scalars['Bytes']>;
  registryAddress_lte?: Maybe<Scalars['Bytes']>;
  registryAddress_not?: Maybe<Scalars['Bytes']>;
  registryAddress_not_contains?: Maybe<Scalars['Bytes']>;
  registryAddress_not_in?: Maybe<Array<Scalars['Bytes']>>;
  registry_?: Maybe<Registry_Filter>;
  registry_contains?: Maybe<Scalars['String']>;
  registry_contains_nocase?: Maybe<Scalars['String']>;
  registry_ends_with?: Maybe<Scalars['String']>;
  registry_ends_with_nocase?: Maybe<Scalars['String']>;
  registry_gt?: Maybe<Scalars['String']>;
  registry_gte?: Maybe<Scalars['String']>;
  registry_in?: Maybe<Array<Scalars['String']>>;
  registry_lt?: Maybe<Scalars['String']>;
  registry_lte?: Maybe<Scalars['String']>;
  registry_not?: Maybe<Scalars['String']>;
  registry_not_contains?: Maybe<Scalars['String']>;
  registry_not_contains_nocase?: Maybe<Scalars['String']>;
  registry_not_ends_with?: Maybe<Scalars['String']>;
  registry_not_ends_with_nocase?: Maybe<Scalars['String']>;
  registry_not_in?: Maybe<Array<Scalars['String']>>;
  registry_not_starts_with?: Maybe<Scalars['String']>;
  registry_not_starts_with_nocase?: Maybe<Scalars['String']>;
  registry_starts_with?: Maybe<Scalars['String']>;
  registry_starts_with_nocase?: Maybe<Scalars['String']>;
  requestType?: Maybe<Status>;
  requestType_in?: Maybe<Array<Status>>;
  requestType_not?: Maybe<Status>;
  requestType_not_in?: Maybe<Array<Status>>;
  requester?: Maybe<Scalars['Bytes']>;
  requester_contains?: Maybe<Scalars['Bytes']>;
  requester_gt?: Maybe<Scalars['Bytes']>;
  requester_gte?: Maybe<Scalars['Bytes']>;
  requester_in?: Maybe<Array<Scalars['Bytes']>>;
  requester_lt?: Maybe<Scalars['Bytes']>;
  requester_lte?: Maybe<Scalars['Bytes']>;
  requester_not?: Maybe<Scalars['Bytes']>;
  requester_not_contains?: Maybe<Scalars['Bytes']>;
  requester_not_in?: Maybe<Array<Scalars['Bytes']>>;
  resolutionTime?: Maybe<Scalars['BigInt']>;
  resolutionTime_gt?: Maybe<Scalars['BigInt']>;
  resolutionTime_gte?: Maybe<Scalars['BigInt']>;
  resolutionTime_in?: Maybe<Array<Scalars['BigInt']>>;
  resolutionTime_lt?: Maybe<Scalars['BigInt']>;
  resolutionTime_lte?: Maybe<Scalars['BigInt']>;
  resolutionTime_not?: Maybe<Scalars['BigInt']>;
  resolutionTime_not_in?: Maybe<Array<Scalars['BigInt']>>;
  resolutionTx?: Maybe<Scalars['Bytes']>;
  resolutionTx_contains?: Maybe<Scalars['Bytes']>;
  resolutionTx_gt?: Maybe<Scalars['Bytes']>;
  resolutionTx_gte?: Maybe<Scalars['Bytes']>;
  resolutionTx_in?: Maybe<Array<Scalars['Bytes']>>;
  resolutionTx_lt?: Maybe<Scalars['Bytes']>;
  resolutionTx_lte?: Maybe<Scalars['Bytes']>;
  resolutionTx_not?: Maybe<Scalars['Bytes']>;
  resolutionTx_not_contains?: Maybe<Scalars['Bytes']>;
  resolutionTx_not_in?: Maybe<Array<Scalars['Bytes']>>;
  resolved?: Maybe<Scalars['Boolean']>;
  resolved_in?: Maybe<Array<Scalars['Boolean']>>;
  resolved_not?: Maybe<Scalars['Boolean']>;
  resolved_not_in?: Maybe<Array<Scalars['Boolean']>>;
  rounds_?: Maybe<Round_Filter>;
  submissionTime?: Maybe<Scalars['BigInt']>;
  submissionTime_gt?: Maybe<Scalars['BigInt']>;
  submissionTime_gte?: Maybe<Scalars['BigInt']>;
  submissionTime_in?: Maybe<Array<Scalars['BigInt']>>;
  submissionTime_lt?: Maybe<Scalars['BigInt']>;
  submissionTime_lte?: Maybe<Scalars['BigInt']>;
  submissionTime_not?: Maybe<Scalars['BigInt']>;
  submissionTime_not_in?: Maybe<Array<Scalars['BigInt']>>;
};

export enum Request_OrderBy {
  Arbitrator = 'arbitrator',
  ArbitratorExtraData = 'arbitratorExtraData',
  Challenger = 'challenger',
  CreationTx = 'creationTx',
  Deposit = 'deposit',
  DisputeId = 'disputeID',
  DisputeOutcome = 'disputeOutcome',
  Disputed = 'disputed',
  EvidenceGroup = 'evidenceGroup',
  EvidenceGroupId = 'evidenceGroup__id',
  EvidenceGroupNumberOfEvidence = 'evidenceGroup__numberOfEvidence',
  FinalRuling = 'finalRuling',
  Id = 'id',
  Item = 'item',
  ItemData = 'item__data',
  ItemDisputed = 'item__disputed',
  ItemId = 'item__id',
  ItemItemId = 'item__itemID',
  ItemLatestChallenger = 'item__latestChallenger',
  ItemLatestRequestResolutionTime = 'item__latestRequestResolutionTime',
  ItemLatestRequestSubmissionTime = 'item__latestRequestSubmissionTime',
  ItemLatestRequester = 'item__latestRequester',
  ItemNumberOfRequests = 'item__numberOfRequests',
  ItemRegistryAddress = 'item__registryAddress',
  ItemStatus = 'item__status',
  MetaEvidence = 'metaEvidence',
  MetaEvidenceUri = 'metaEvidence__URI',
  MetaEvidenceId = 'metaEvidence__id',
  NumberOfRounds = 'numberOfRounds',
  Registry = 'registry',
  RegistryAddress = 'registryAddress',
  RegistryConnectedTcr = 'registry__connectedTCR',
  RegistryId = 'registry__id',
  RegistryMetaEvidenceCount = 'registry__metaEvidenceCount',
  RegistryNumberOfItems = 'registry__numberOfItems',
  RequestType = 'requestType',
  Requester = 'requester',
  ResolutionTime = 'resolutionTime',
  ResolutionTx = 'resolutionTx',
  Resolved = 'resolved',
  Rounds = 'rounds',
  SubmissionTime = 'submissionTime'
}

export type Reward = {
  __typename?: 'Reward';
  amount: Scalars['BigInt'];
  id: Scalars['ID'];
  owner: Scalars['Bytes'];
  rewardAddress: Scalars['Bytes'];
};

export type Reward_Filter = {
  /** Filter for the block changed event. */
  _change_block?: Maybe<BlockChangedFilter>;
  amount?: Maybe<Scalars['BigInt']>;
  amount_gt?: Maybe<Scalars['BigInt']>;
  amount_gte?: Maybe<Scalars['BigInt']>;
  amount_in?: Maybe<Array<Scalars['BigInt']>>;
  amount_lt?: Maybe<Scalars['BigInt']>;
  amount_lte?: Maybe<Scalars['BigInt']>;
  amount_not?: Maybe<Scalars['BigInt']>;
  amount_not_in?: Maybe<Array<Scalars['BigInt']>>;
  and?: Maybe<Array<Maybe<Reward_Filter>>>;
  id?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_lt?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
  or?: Maybe<Array<Maybe<Reward_Filter>>>;
  owner?: Maybe<Scalars['Bytes']>;
  owner_contains?: Maybe<Scalars['Bytes']>;
  owner_gt?: Maybe<Scalars['Bytes']>;
  owner_gte?: Maybe<Scalars['Bytes']>;
  owner_in?: Maybe<Array<Scalars['Bytes']>>;
  owner_lt?: Maybe<Scalars['Bytes']>;
  owner_lte?: Maybe<Scalars['Bytes']>;
  owner_not?: Maybe<Scalars['Bytes']>;
  owner_not_contains?: Maybe<Scalars['Bytes']>;
  owner_not_in?: Maybe<Array<Scalars['Bytes']>>;
  rewardAddress?: Maybe<Scalars['Bytes']>;
  rewardAddress_contains?: Maybe<Scalars['Bytes']>;
  rewardAddress_gt?: Maybe<Scalars['Bytes']>;
  rewardAddress_gte?: Maybe<Scalars['Bytes']>;
  rewardAddress_in?: Maybe<Array<Scalars['Bytes']>>;
  rewardAddress_lt?: Maybe<Scalars['Bytes']>;
  rewardAddress_lte?: Maybe<Scalars['Bytes']>;
  rewardAddress_not?: Maybe<Scalars['Bytes']>;
  rewardAddress_not_contains?: Maybe<Scalars['Bytes']>;
  rewardAddress_not_in?: Maybe<Array<Scalars['Bytes']>>;
};

export enum Reward_OrderBy {
  Amount = 'amount',
  Id = 'id',
  Owner = 'owner',
  RewardAddress = 'rewardAddress'
}

export type Round = {
  __typename?: 'Round';
  /** The total amount of appeal fees contributed to the challenger in this round. */
  amountPaidChallenger: Scalars['BigInt'];
  /** The total amount of appeal fees contributed to the requester in this round. */
  amountPaidRequester: Scalars['BigInt'];
  /** The time the appeal period ends, if in the appeal period. */
  appealPeriodEnd: Scalars['BigInt'];
  /** The time the appeal period starts, if in the appeal period. */
  appealPeriodStart: Scalars['BigInt'];
  /** Whether this round was appealed */
  appealed: Scalars['Boolean'];
  /** When this round was appealed, if it was appealed */
  appealedAt?: Maybe<Scalars['BigInt']>;
  /** The moment the round was created. */
  creationTime: Scalars['BigInt'];
  /** Sum of reimbursable fees and stake rewards available to the parties that made contributions to the side that ultimately wins a dispute. */
  feeRewards: Scalars['BigInt'];
  /** Whether the challenger is fully funded. */
  hasPaidChallenger: Scalars['Boolean'];
  /** Whether the requester is fully funded. */
  hasPaidRequester: Scalars['Boolean'];
  /** <itemID>-<requestID>-<roundID> */
  id: Scalars['ID'];
  /** The request to which this round belongs. */
  request: Request;
  /** The ruling given by the arbitrator. */
  ruling: Ruling;
  /** The time the round received the ruling. */
  rulingTime: Scalars['BigInt'];
  /** The tx hash of the moment the round was appealed */
  txHashAppealDecision?: Maybe<Scalars['Bytes']>;
  /** The tx hash of the moment appealing became possible */
  txHashAppealPossible?: Maybe<Scalars['Bytes']>;
};

export type Round_Filter = {
  /** Filter for the block changed event. */
  _change_block?: Maybe<BlockChangedFilter>;
  amountPaidChallenger?: Maybe<Scalars['BigInt']>;
  amountPaidChallenger_gt?: Maybe<Scalars['BigInt']>;
  amountPaidChallenger_gte?: Maybe<Scalars['BigInt']>;
  amountPaidChallenger_in?: Maybe<Array<Scalars['BigInt']>>;
  amountPaidChallenger_lt?: Maybe<Scalars['BigInt']>;
  amountPaidChallenger_lte?: Maybe<Scalars['BigInt']>;
  amountPaidChallenger_not?: Maybe<Scalars['BigInt']>;
  amountPaidChallenger_not_in?: Maybe<Array<Scalars['BigInt']>>;
  amountPaidRequester?: Maybe<Scalars['BigInt']>;
  amountPaidRequester_gt?: Maybe<Scalars['BigInt']>;
  amountPaidRequester_gte?: Maybe<Scalars['BigInt']>;
  amountPaidRequester_in?: Maybe<Array<Scalars['BigInt']>>;
  amountPaidRequester_lt?: Maybe<Scalars['BigInt']>;
  amountPaidRequester_lte?: Maybe<Scalars['BigInt']>;
  amountPaidRequester_not?: Maybe<Scalars['BigInt']>;
  amountPaidRequester_not_in?: Maybe<Array<Scalars['BigInt']>>;
  and?: Maybe<Array<Maybe<Round_Filter>>>;
  appealPeriodEnd?: Maybe<Scalars['BigInt']>;
  appealPeriodEnd_gt?: Maybe<Scalars['BigInt']>;
  appealPeriodEnd_gte?: Maybe<Scalars['BigInt']>;
  appealPeriodEnd_in?: Maybe<Array<Scalars['BigInt']>>;
  appealPeriodEnd_lt?: Maybe<Scalars['BigInt']>;
  appealPeriodEnd_lte?: Maybe<Scalars['BigInt']>;
  appealPeriodEnd_not?: Maybe<Scalars['BigInt']>;
  appealPeriodEnd_not_in?: Maybe<Array<Scalars['BigInt']>>;
  appealPeriodStart?: Maybe<Scalars['BigInt']>;
  appealPeriodStart_gt?: Maybe<Scalars['BigInt']>;
  appealPeriodStart_gte?: Maybe<Scalars['BigInt']>;
  appealPeriodStart_in?: Maybe<Array<Scalars['BigInt']>>;
  appealPeriodStart_lt?: Maybe<Scalars['BigInt']>;
  appealPeriodStart_lte?: Maybe<Scalars['BigInt']>;
  appealPeriodStart_not?: Maybe<Scalars['BigInt']>;
  appealPeriodStart_not_in?: Maybe<Array<Scalars['BigInt']>>;
  appealed?: Maybe<Scalars['Boolean']>;
  appealedAt?: Maybe<Scalars['BigInt']>;
  appealedAt_gt?: Maybe<Scalars['BigInt']>;
  appealedAt_gte?: Maybe<Scalars['BigInt']>;
  appealedAt_in?: Maybe<Array<Scalars['BigInt']>>;
  appealedAt_lt?: Maybe<Scalars['BigInt']>;
  appealedAt_lte?: Maybe<Scalars['BigInt']>;
  appealedAt_not?: Maybe<Scalars['BigInt']>;
  appealedAt_not_in?: Maybe<Array<Scalars['BigInt']>>;
  appealed_in?: Maybe<Array<Scalars['Boolean']>>;
  appealed_not?: Maybe<Scalars['Boolean']>;
  appealed_not_in?: Maybe<Array<Scalars['Boolean']>>;
  creationTime?: Maybe<Scalars['BigInt']>;
  creationTime_gt?: Maybe<Scalars['BigInt']>;
  creationTime_gte?: Maybe<Scalars['BigInt']>;
  creationTime_in?: Maybe<Array<Scalars['BigInt']>>;
  creationTime_lt?: Maybe<Scalars['BigInt']>;
  creationTime_lte?: Maybe<Scalars['BigInt']>;
  creationTime_not?: Maybe<Scalars['BigInt']>;
  creationTime_not_in?: Maybe<Array<Scalars['BigInt']>>;
  feeRewards?: Maybe<Scalars['BigInt']>;
  feeRewards_gt?: Maybe<Scalars['BigInt']>;
  feeRewards_gte?: Maybe<Scalars['BigInt']>;
  feeRewards_in?: Maybe<Array<Scalars['BigInt']>>;
  feeRewards_lt?: Maybe<Scalars['BigInt']>;
  feeRewards_lte?: Maybe<Scalars['BigInt']>;
  feeRewards_not?: Maybe<Scalars['BigInt']>;
  feeRewards_not_in?: Maybe<Array<Scalars['BigInt']>>;
  hasPaidChallenger?: Maybe<Scalars['Boolean']>;
  hasPaidChallenger_in?: Maybe<Array<Scalars['Boolean']>>;
  hasPaidChallenger_not?: Maybe<Scalars['Boolean']>;
  hasPaidChallenger_not_in?: Maybe<Array<Scalars['Boolean']>>;
  hasPaidRequester?: Maybe<Scalars['Boolean']>;
  hasPaidRequester_in?: Maybe<Array<Scalars['Boolean']>>;
  hasPaidRequester_not?: Maybe<Scalars['Boolean']>;
  hasPaidRequester_not_in?: Maybe<Array<Scalars['Boolean']>>;
  id?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_lt?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
  or?: Maybe<Array<Maybe<Round_Filter>>>;
  request?: Maybe<Scalars['String']>;
  request_?: Maybe<Request_Filter>;
  request_contains?: Maybe<Scalars['String']>;
  request_contains_nocase?: Maybe<Scalars['String']>;
  request_ends_with?: Maybe<Scalars['String']>;
  request_ends_with_nocase?: Maybe<Scalars['String']>;
  request_gt?: Maybe<Scalars['String']>;
  request_gte?: Maybe<Scalars['String']>;
  request_in?: Maybe<Array<Scalars['String']>>;
  request_lt?: Maybe<Scalars['String']>;
  request_lte?: Maybe<Scalars['String']>;
  request_not?: Maybe<Scalars['String']>;
  request_not_contains?: Maybe<Scalars['String']>;
  request_not_contains_nocase?: Maybe<Scalars['String']>;
  request_not_ends_with?: Maybe<Scalars['String']>;
  request_not_ends_with_nocase?: Maybe<Scalars['String']>;
  request_not_in?: Maybe<Array<Scalars['String']>>;
  request_not_starts_with?: Maybe<Scalars['String']>;
  request_not_starts_with_nocase?: Maybe<Scalars['String']>;
  request_starts_with?: Maybe<Scalars['String']>;
  request_starts_with_nocase?: Maybe<Scalars['String']>;
  ruling?: Maybe<Ruling>;
  rulingTime?: Maybe<Scalars['BigInt']>;
  rulingTime_gt?: Maybe<Scalars['BigInt']>;
  rulingTime_gte?: Maybe<Scalars['BigInt']>;
  rulingTime_in?: Maybe<Array<Scalars['BigInt']>>;
  rulingTime_lt?: Maybe<Scalars['BigInt']>;
  rulingTime_lte?: Maybe<Scalars['BigInt']>;
  rulingTime_not?: Maybe<Scalars['BigInt']>;
  rulingTime_not_in?: Maybe<Array<Scalars['BigInt']>>;
  ruling_in?: Maybe<Array<Ruling>>;
  ruling_not?: Maybe<Ruling>;
  ruling_not_in?: Maybe<Array<Ruling>>;
  txHashAppealDecision?: Maybe<Scalars['Bytes']>;
  txHashAppealDecision_contains?: Maybe<Scalars['Bytes']>;
  txHashAppealDecision_gt?: Maybe<Scalars['Bytes']>;
  txHashAppealDecision_gte?: Maybe<Scalars['Bytes']>;
  txHashAppealDecision_in?: Maybe<Array<Scalars['Bytes']>>;
  txHashAppealDecision_lt?: Maybe<Scalars['Bytes']>;
  txHashAppealDecision_lte?: Maybe<Scalars['Bytes']>;
  txHashAppealDecision_not?: Maybe<Scalars['Bytes']>;
  txHashAppealDecision_not_contains?: Maybe<Scalars['Bytes']>;
  txHashAppealDecision_not_in?: Maybe<Array<Scalars['Bytes']>>;
  txHashAppealPossible?: Maybe<Scalars['Bytes']>;
  txHashAppealPossible_contains?: Maybe<Scalars['Bytes']>;
  txHashAppealPossible_gt?: Maybe<Scalars['Bytes']>;
  txHashAppealPossible_gte?: Maybe<Scalars['Bytes']>;
  txHashAppealPossible_in?: Maybe<Array<Scalars['Bytes']>>;
  txHashAppealPossible_lt?: Maybe<Scalars['Bytes']>;
  txHashAppealPossible_lte?: Maybe<Scalars['Bytes']>;
  txHashAppealPossible_not?: Maybe<Scalars['Bytes']>;
  txHashAppealPossible_not_contains?: Maybe<Scalars['Bytes']>;
  txHashAppealPossible_not_in?: Maybe<Array<Scalars['Bytes']>>;
};

export enum Round_OrderBy {
  AmountPaidChallenger = 'amountPaidChallenger',
  AmountPaidRequester = 'amountPaidRequester',
  AppealPeriodEnd = 'appealPeriodEnd',
  AppealPeriodStart = 'appealPeriodStart',
  Appealed = 'appealed',
  AppealedAt = 'appealedAt',
  CreationTime = 'creationTime',
  FeeRewards = 'feeRewards',
  HasPaidChallenger = 'hasPaidChallenger',
  HasPaidRequester = 'hasPaidRequester',
  Id = 'id',
  Request = 'request',
  RequestArbitrator = 'request__arbitrator',
  RequestArbitratorExtraData = 'request__arbitratorExtraData',
  RequestChallenger = 'request__challenger',
  RequestCreationTx = 'request__creationTx',
  RequestDeposit = 'request__deposit',
  RequestDisputeId = 'request__disputeID',
  RequestDisputeOutcome = 'request__disputeOutcome',
  RequestDisputed = 'request__disputed',
  RequestFinalRuling = 'request__finalRuling',
  RequestId = 'request__id',
  RequestNumberOfRounds = 'request__numberOfRounds',
  RequestRegistryAddress = 'request__registryAddress',
  RequestRequestType = 'request__requestType',
  RequestRequester = 'request__requester',
  RequestResolutionTime = 'request__resolutionTime',
  RequestResolutionTx = 'request__resolutionTx',
  RequestResolved = 'request__resolved',
  RequestSubmissionTime = 'request__submissionTime',
  Ruling = 'ruling',
  RulingTime = 'rulingTime',
  TxHashAppealDecision = 'txHashAppealDecision',
  TxHashAppealPossible = 'txHashAppealPossible'
}

export enum Ruling {
  /** The arbitrator ruled in favor of the requester. */
  Accept = 'Accept',
  /** The arbitrator did not rule or refused to rule. */
  None = 'None',
  /** The arbitrator in favor of the challenger. */
  Reject = 'Reject'
}

export enum Status {
  /** The item is not registered on the TCR and there are no pending requests. */
  Absent = 'Absent',
  /** The item is registered on the TCR, but there is a pending removal request. These are sometimes also called removal requests. */
  ClearingRequested = 'ClearingRequested',
  /** The item is registered and there are no pending requests. */
  Registered = 'Registered',
  /** The item is not registered on the TCR, but there is a pending registration request. */
  RegistrationRequested = 'RegistrationRequested'
}

export type Swap = {
  __typename?: 'Swap';
  amount0: Scalars['BigDecimal'];
  amount1: Scalars['BigDecimal'];
  amountUSD: Scalars['BigDecimal'];
  id: Scalars['ID'];
  liquidity: Scalars['BigInt'];
  logIndex?: Maybe<Scalars['BigInt']>;
  origin: Scalars['Bytes'];
  pool: Pool;
  price: Scalars['BigInt'];
  recipient: Scalars['Bytes'];
  sender: Scalars['Bytes'];
  tick: Scalars['BigInt'];
  timestamp: Scalars['BigInt'];
  token0: Token;
  token1: Token;
  transaction: Transaction;
};

export type Swap_Filter = {
  /** Filter for the block changed event. */
  _change_block?: Maybe<BlockChangedFilter>;
  amount0?: Maybe<Scalars['BigDecimal']>;
  amount0_gt?: Maybe<Scalars['BigDecimal']>;
  amount0_gte?: Maybe<Scalars['BigDecimal']>;
  amount0_in?: Maybe<Array<Scalars['BigDecimal']>>;
  amount0_lt?: Maybe<Scalars['BigDecimal']>;
  amount0_lte?: Maybe<Scalars['BigDecimal']>;
  amount0_not?: Maybe<Scalars['BigDecimal']>;
  amount0_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
  amount1?: Maybe<Scalars['BigDecimal']>;
  amount1_gt?: Maybe<Scalars['BigDecimal']>;
  amount1_gte?: Maybe<Scalars['BigDecimal']>;
  amount1_in?: Maybe<Array<Scalars['BigDecimal']>>;
  amount1_lt?: Maybe<Scalars['BigDecimal']>;
  amount1_lte?: Maybe<Scalars['BigDecimal']>;
  amount1_not?: Maybe<Scalars['BigDecimal']>;
  amount1_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
  amountUSD?: Maybe<Scalars['BigDecimal']>;
  amountUSD_gt?: Maybe<Scalars['BigDecimal']>;
  amountUSD_gte?: Maybe<Scalars['BigDecimal']>;
  amountUSD_in?: Maybe<Array<Scalars['BigDecimal']>>;
  amountUSD_lt?: Maybe<Scalars['BigDecimal']>;
  amountUSD_lte?: Maybe<Scalars['BigDecimal']>;
  amountUSD_not?: Maybe<Scalars['BigDecimal']>;
  amountUSD_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
  and?: Maybe<Array<Maybe<Swap_Filter>>>;
  id?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_lt?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
  liquidity?: Maybe<Scalars['BigInt']>;
  liquidity_gt?: Maybe<Scalars['BigInt']>;
  liquidity_gte?: Maybe<Scalars['BigInt']>;
  liquidity_in?: Maybe<Array<Scalars['BigInt']>>;
  liquidity_lt?: Maybe<Scalars['BigInt']>;
  liquidity_lte?: Maybe<Scalars['BigInt']>;
  liquidity_not?: Maybe<Scalars['BigInt']>;
  liquidity_not_in?: Maybe<Array<Scalars['BigInt']>>;
  logIndex?: Maybe<Scalars['BigInt']>;
  logIndex_gt?: Maybe<Scalars['BigInt']>;
  logIndex_gte?: Maybe<Scalars['BigInt']>;
  logIndex_in?: Maybe<Array<Scalars['BigInt']>>;
  logIndex_lt?: Maybe<Scalars['BigInt']>;
  logIndex_lte?: Maybe<Scalars['BigInt']>;
  logIndex_not?: Maybe<Scalars['BigInt']>;
  logIndex_not_in?: Maybe<Array<Scalars['BigInt']>>;
  or?: Maybe<Array<Maybe<Swap_Filter>>>;
  origin?: Maybe<Scalars['Bytes']>;
  origin_contains?: Maybe<Scalars['Bytes']>;
  origin_gt?: Maybe<Scalars['Bytes']>;
  origin_gte?: Maybe<Scalars['Bytes']>;
  origin_in?: Maybe<Array<Scalars['Bytes']>>;
  origin_lt?: Maybe<Scalars['Bytes']>;
  origin_lte?: Maybe<Scalars['Bytes']>;
  origin_not?: Maybe<Scalars['Bytes']>;
  origin_not_contains?: Maybe<Scalars['Bytes']>;
  origin_not_in?: Maybe<Array<Scalars['Bytes']>>;
  pool?: Maybe<Scalars['String']>;
  pool_?: Maybe<Pool_Filter>;
  pool_contains?: Maybe<Scalars['String']>;
  pool_contains_nocase?: Maybe<Scalars['String']>;
  pool_ends_with?: Maybe<Scalars['String']>;
  pool_ends_with_nocase?: Maybe<Scalars['String']>;
  pool_gt?: Maybe<Scalars['String']>;
  pool_gte?: Maybe<Scalars['String']>;
  pool_in?: Maybe<Array<Scalars['String']>>;
  pool_lt?: Maybe<Scalars['String']>;
  pool_lte?: Maybe<Scalars['String']>;
  pool_not?: Maybe<Scalars['String']>;
  pool_not_contains?: Maybe<Scalars['String']>;
  pool_not_contains_nocase?: Maybe<Scalars['String']>;
  pool_not_ends_with?: Maybe<Scalars['String']>;
  pool_not_ends_with_nocase?: Maybe<Scalars['String']>;
  pool_not_in?: Maybe<Array<Scalars['String']>>;
  pool_not_starts_with?: Maybe<Scalars['String']>;
  pool_not_starts_with_nocase?: Maybe<Scalars['String']>;
  pool_starts_with?: Maybe<Scalars['String']>;
  pool_starts_with_nocase?: Maybe<Scalars['String']>;
  price?: Maybe<Scalars['BigInt']>;
  price_gt?: Maybe<Scalars['BigInt']>;
  price_gte?: Maybe<Scalars['BigInt']>;
  price_in?: Maybe<Array<Scalars['BigInt']>>;
  price_lt?: Maybe<Scalars['BigInt']>;
  price_lte?: Maybe<Scalars['BigInt']>;
  price_not?: Maybe<Scalars['BigInt']>;
  price_not_in?: Maybe<Array<Scalars['BigInt']>>;
  recipient?: Maybe<Scalars['Bytes']>;
  recipient_contains?: Maybe<Scalars['Bytes']>;
  recipient_gt?: Maybe<Scalars['Bytes']>;
  recipient_gte?: Maybe<Scalars['Bytes']>;
  recipient_in?: Maybe<Array<Scalars['Bytes']>>;
  recipient_lt?: Maybe<Scalars['Bytes']>;
  recipient_lte?: Maybe<Scalars['Bytes']>;
  recipient_not?: Maybe<Scalars['Bytes']>;
  recipient_not_contains?: Maybe<Scalars['Bytes']>;
  recipient_not_in?: Maybe<Array<Scalars['Bytes']>>;
  sender?: Maybe<Scalars['Bytes']>;
  sender_contains?: Maybe<Scalars['Bytes']>;
  sender_gt?: Maybe<Scalars['Bytes']>;
  sender_gte?: Maybe<Scalars['Bytes']>;
  sender_in?: Maybe<Array<Scalars['Bytes']>>;
  sender_lt?: Maybe<Scalars['Bytes']>;
  sender_lte?: Maybe<Scalars['Bytes']>;
  sender_not?: Maybe<Scalars['Bytes']>;
  sender_not_contains?: Maybe<Scalars['Bytes']>;
  sender_not_in?: Maybe<Array<Scalars['Bytes']>>;
  tick?: Maybe<Scalars['BigInt']>;
  tick_gt?: Maybe<Scalars['BigInt']>;
  tick_gte?: Maybe<Scalars['BigInt']>;
  tick_in?: Maybe<Array<Scalars['BigInt']>>;
  tick_lt?: Maybe<Scalars['BigInt']>;
  tick_lte?: Maybe<Scalars['BigInt']>;
  tick_not?: Maybe<Scalars['BigInt']>;
  tick_not_in?: Maybe<Array<Scalars['BigInt']>>;
  timestamp?: Maybe<Scalars['BigInt']>;
  timestamp_gt?: Maybe<Scalars['BigInt']>;
  timestamp_gte?: Maybe<Scalars['BigInt']>;
  timestamp_in?: Maybe<Array<Scalars['BigInt']>>;
  timestamp_lt?: Maybe<Scalars['BigInt']>;
  timestamp_lte?: Maybe<Scalars['BigInt']>;
  timestamp_not?: Maybe<Scalars['BigInt']>;
  timestamp_not_in?: Maybe<Array<Scalars['BigInt']>>;
  token0?: Maybe<Scalars['String']>;
  token0_?: Maybe<Token_Filter>;
  token0_contains?: Maybe<Scalars['String']>;
  token0_contains_nocase?: Maybe<Scalars['String']>;
  token0_ends_with?: Maybe<Scalars['String']>;
  token0_ends_with_nocase?: Maybe<Scalars['String']>;
  token0_gt?: Maybe<Scalars['String']>;
  token0_gte?: Maybe<Scalars['String']>;
  token0_in?: Maybe<Array<Scalars['String']>>;
  token0_lt?: Maybe<Scalars['String']>;
  token0_lte?: Maybe<Scalars['String']>;
  token0_not?: Maybe<Scalars['String']>;
  token0_not_contains?: Maybe<Scalars['String']>;
  token0_not_contains_nocase?: Maybe<Scalars['String']>;
  token0_not_ends_with?: Maybe<Scalars['String']>;
  token0_not_ends_with_nocase?: Maybe<Scalars['String']>;
  token0_not_in?: Maybe<Array<Scalars['String']>>;
  token0_not_starts_with?: Maybe<Scalars['String']>;
  token0_not_starts_with_nocase?: Maybe<Scalars['String']>;
  token0_starts_with?: Maybe<Scalars['String']>;
  token0_starts_with_nocase?: Maybe<Scalars['String']>;
  token1?: Maybe<Scalars['String']>;
  token1_?: Maybe<Token_Filter>;
  token1_contains?: Maybe<Scalars['String']>;
  token1_contains_nocase?: Maybe<Scalars['String']>;
  token1_ends_with?: Maybe<Scalars['String']>;
  token1_ends_with_nocase?: Maybe<Scalars['String']>;
  token1_gt?: Maybe<Scalars['String']>;
  token1_gte?: Maybe<Scalars['String']>;
  token1_in?: Maybe<Array<Scalars['String']>>;
  token1_lt?: Maybe<Scalars['String']>;
  token1_lte?: Maybe<Scalars['String']>;
  token1_not?: Maybe<Scalars['String']>;
  token1_not_contains?: Maybe<Scalars['String']>;
  token1_not_contains_nocase?: Maybe<Scalars['String']>;
  token1_not_ends_with?: Maybe<Scalars['String']>;
  token1_not_ends_with_nocase?: Maybe<Scalars['String']>;
  token1_not_in?: Maybe<Array<Scalars['String']>>;
  token1_not_starts_with?: Maybe<Scalars['String']>;
  token1_not_starts_with_nocase?: Maybe<Scalars['String']>;
  token1_starts_with?: Maybe<Scalars['String']>;
  token1_starts_with_nocase?: Maybe<Scalars['String']>;
  transaction?: Maybe<Scalars['String']>;
  transaction_?: Maybe<Transaction_Filter>;
  transaction_contains?: Maybe<Scalars['String']>;
  transaction_contains_nocase?: Maybe<Scalars['String']>;
  transaction_ends_with?: Maybe<Scalars['String']>;
  transaction_ends_with_nocase?: Maybe<Scalars['String']>;
  transaction_gt?: Maybe<Scalars['String']>;
  transaction_gte?: Maybe<Scalars['String']>;
  transaction_in?: Maybe<Array<Scalars['String']>>;
  transaction_lt?: Maybe<Scalars['String']>;
  transaction_lte?: Maybe<Scalars['String']>;
  transaction_not?: Maybe<Scalars['String']>;
  transaction_not_contains?: Maybe<Scalars['String']>;
  transaction_not_contains_nocase?: Maybe<Scalars['String']>;
  transaction_not_ends_with?: Maybe<Scalars['String']>;
  transaction_not_ends_with_nocase?: Maybe<Scalars['String']>;
  transaction_not_in?: Maybe<Array<Scalars['String']>>;
  transaction_not_starts_with?: Maybe<Scalars['String']>;
  transaction_not_starts_with_nocase?: Maybe<Scalars['String']>;
  transaction_starts_with?: Maybe<Scalars['String']>;
  transaction_starts_with_nocase?: Maybe<Scalars['String']>;
};

export enum Swap_OrderBy {
  Amount0 = 'amount0',
  Amount1 = 'amount1',
  AmountUsd = 'amountUSD',
  Id = 'id',
  Liquidity = 'liquidity',
  LogIndex = 'logIndex',
  Origin = 'origin',
  Pool = 'pool',
  PoolCollectedFeesToken0 = 'pool__collectedFeesToken0',
  PoolCollectedFeesToken1 = 'pool__collectedFeesToken1',
  PoolCollectedFeesUsd = 'pool__collectedFeesUSD',
  PoolCommunityFee0 = 'pool__communityFee0',
  PoolCommunityFee1 = 'pool__communityFee1',
  PoolCreatedAtBlockNumber = 'pool__createdAtBlockNumber',
  PoolCreatedAtTimestamp = 'pool__createdAtTimestamp',
  PoolFee = 'pool__fee',
  PoolFeeGrowthGlobal0X128 = 'pool__feeGrowthGlobal0X128',
  PoolFeeGrowthGlobal1X128 = 'pool__feeGrowthGlobal1X128',
  PoolFeesToken0 = 'pool__feesToken0',
  PoolFeesToken1 = 'pool__feesToken1',
  PoolFeesUsd = 'pool__feesUSD',
  PoolId = 'pool__id',
  PoolLiquidity = 'pool__liquidity',
  PoolLiquidityProviderCount = 'pool__liquidityProviderCount',
  PoolObservationIndex = 'pool__observationIndex',
  PoolSqrtPrice = 'pool__sqrtPrice',
  PoolTick = 'pool__tick',
  PoolTickSpacing = 'pool__tickSpacing',
  PoolToken0Price = 'pool__token0Price',
  PoolToken1Price = 'pool__token1Price',
  PoolTotalValueLockedMatic = 'pool__totalValueLockedMatic',
  PoolTotalValueLockedToken0 = 'pool__totalValueLockedToken0',
  PoolTotalValueLockedToken1 = 'pool__totalValueLockedToken1',
  PoolTotalValueLockedUsd = 'pool__totalValueLockedUSD',
  PoolTotalValueLockedUsdUntracked = 'pool__totalValueLockedUSDUntracked',
  PoolTxCount = 'pool__txCount',
  PoolUntrackedFeesUsd = 'pool__untrackedFeesUSD',
  PoolUntrackedVolumeUsd = 'pool__untrackedVolumeUSD',
  PoolVolumeToken0 = 'pool__volumeToken0',
  PoolVolumeToken1 = 'pool__volumeToken1',
  PoolVolumeUsd = 'pool__volumeUSD',
  Price = 'price',
  Recipient = 'recipient',
  Sender = 'sender',
  Tick = 'tick',
  Timestamp = 'timestamp',
  Token0 = 'token0',
  Token0Decimals = 'token0__decimals',
  Token0DerivedMatic = 'token0__derivedMatic',
  Token0FeesUsd = 'token0__feesUSD',
  Token0Id = 'token0__id',
  Token0IsSeer = 'token0__isSeer',
  Token0Name = 'token0__name',
  Token0PoolCount = 'token0__poolCount',
  Token0Symbol = 'token0__symbol',
  Token0TotalSupply = 'token0__totalSupply',
  Token0TotalValueLocked = 'token0__totalValueLocked',
  Token0TotalValueLockedUsd = 'token0__totalValueLockedUSD',
  Token0TotalValueLockedUsdUntracked = 'token0__totalValueLockedUSDUntracked',
  Token0TxCount = 'token0__txCount',
  Token0UntrackedVolumeUsd = 'token0__untrackedVolumeUSD',
  Token0Volume = 'token0__volume',
  Token0VolumeUsd = 'token0__volumeUSD',
  Token1 = 'token1',
  Token1Decimals = 'token1__decimals',
  Token1DerivedMatic = 'token1__derivedMatic',
  Token1FeesUsd = 'token1__feesUSD',
  Token1Id = 'token1__id',
  Token1IsSeer = 'token1__isSeer',
  Token1Name = 'token1__name',
  Token1PoolCount = 'token1__poolCount',
  Token1Symbol = 'token1__symbol',
  Token1TotalSupply = 'token1__totalSupply',
  Token1TotalValueLocked = 'token1__totalValueLocked',
  Token1TotalValueLockedUsd = 'token1__totalValueLockedUSD',
  Token1TotalValueLockedUsdUntracked = 'token1__totalValueLockedUSDUntracked',
  Token1TxCount = 'token1__txCount',
  Token1UntrackedVolumeUsd = 'token1__untrackedVolumeUSD',
  Token1Volume = 'token1__volume',
  Token1VolumeUsd = 'token1__volumeUSD',
  Transaction = 'transaction',
  TransactionBlockNumber = 'transaction__blockNumber',
  TransactionGasLimit = 'transaction__gasLimit',
  TransactionGasPrice = 'transaction__gasPrice',
  TransactionId = 'transaction__id',
  TransactionTimestamp = 'transaction__timestamp'
}

export type Tick = {
  __typename?: 'Tick';
  collectedFeesToken0: Scalars['BigDecimal'];
  collectedFeesToken1: Scalars['BigDecimal'];
  collectedFeesUSD: Scalars['BigDecimal'];
  createdAtBlockNumber: Scalars['BigInt'];
  createdAtTimestamp: Scalars['BigInt'];
  feeGrowthOutside0X128: Scalars['BigInt'];
  feeGrowthOutside1X128: Scalars['BigInt'];
  feesUSD: Scalars['BigDecimal'];
  id: Scalars['ID'];
  liquidityGross: Scalars['BigInt'];
  liquidityNet: Scalars['BigInt'];
  liquidityProviderCount: Scalars['BigInt'];
  pool: Pool;
  poolAddress?: Maybe<Scalars['String']>;
  price0: Scalars['BigDecimal'];
  price1: Scalars['BigDecimal'];
  tickIdx: Scalars['BigInt'];
  untrackedVolumeUSD: Scalars['BigDecimal'];
  volumeToken0: Scalars['BigDecimal'];
  volumeToken1: Scalars['BigDecimal'];
  volumeUSD: Scalars['BigDecimal'];
};

export type TickDayData = {
  __typename?: 'TickDayData';
  date: Scalars['Int'];
  feeGrowthOutside0X128: Scalars['BigInt'];
  feeGrowthOutside1X128: Scalars['BigInt'];
  feesUSD: Scalars['BigDecimal'];
  id: Scalars['ID'];
  liquidityGross: Scalars['BigInt'];
  liquidityNet: Scalars['BigInt'];
  pool: Pool;
  tick: Tick;
  volumeToken0: Scalars['BigDecimal'];
  volumeToken1: Scalars['BigDecimal'];
  volumeUSD: Scalars['BigDecimal'];
};

export type TickDayData_Filter = {
  /** Filter for the block changed event. */
  _change_block?: Maybe<BlockChangedFilter>;
  and?: Maybe<Array<Maybe<TickDayData_Filter>>>;
  date?: Maybe<Scalars['Int']>;
  date_gt?: Maybe<Scalars['Int']>;
  date_gte?: Maybe<Scalars['Int']>;
  date_in?: Maybe<Array<Scalars['Int']>>;
  date_lt?: Maybe<Scalars['Int']>;
  date_lte?: Maybe<Scalars['Int']>;
  date_not?: Maybe<Scalars['Int']>;
  date_not_in?: Maybe<Array<Scalars['Int']>>;
  feeGrowthOutside0X128?: Maybe<Scalars['BigInt']>;
  feeGrowthOutside0X128_gt?: Maybe<Scalars['BigInt']>;
  feeGrowthOutside0X128_gte?: Maybe<Scalars['BigInt']>;
  feeGrowthOutside0X128_in?: Maybe<Array<Scalars['BigInt']>>;
  feeGrowthOutside0X128_lt?: Maybe<Scalars['BigInt']>;
  feeGrowthOutside0X128_lte?: Maybe<Scalars['BigInt']>;
  feeGrowthOutside0X128_not?: Maybe<Scalars['BigInt']>;
  feeGrowthOutside0X128_not_in?: Maybe<Array<Scalars['BigInt']>>;
  feeGrowthOutside1X128?: Maybe<Scalars['BigInt']>;
  feeGrowthOutside1X128_gt?: Maybe<Scalars['BigInt']>;
  feeGrowthOutside1X128_gte?: Maybe<Scalars['BigInt']>;
  feeGrowthOutside1X128_in?: Maybe<Array<Scalars['BigInt']>>;
  feeGrowthOutside1X128_lt?: Maybe<Scalars['BigInt']>;
  feeGrowthOutside1X128_lte?: Maybe<Scalars['BigInt']>;
  feeGrowthOutside1X128_not?: Maybe<Scalars['BigInt']>;
  feeGrowthOutside1X128_not_in?: Maybe<Array<Scalars['BigInt']>>;
  feesUSD?: Maybe<Scalars['BigDecimal']>;
  feesUSD_gt?: Maybe<Scalars['BigDecimal']>;
  feesUSD_gte?: Maybe<Scalars['BigDecimal']>;
  feesUSD_in?: Maybe<Array<Scalars['BigDecimal']>>;
  feesUSD_lt?: Maybe<Scalars['BigDecimal']>;
  feesUSD_lte?: Maybe<Scalars['BigDecimal']>;
  feesUSD_not?: Maybe<Scalars['BigDecimal']>;
  feesUSD_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
  id?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_lt?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
  liquidityGross?: Maybe<Scalars['BigInt']>;
  liquidityGross_gt?: Maybe<Scalars['BigInt']>;
  liquidityGross_gte?: Maybe<Scalars['BigInt']>;
  liquidityGross_in?: Maybe<Array<Scalars['BigInt']>>;
  liquidityGross_lt?: Maybe<Scalars['BigInt']>;
  liquidityGross_lte?: Maybe<Scalars['BigInt']>;
  liquidityGross_not?: Maybe<Scalars['BigInt']>;
  liquidityGross_not_in?: Maybe<Array<Scalars['BigInt']>>;
  liquidityNet?: Maybe<Scalars['BigInt']>;
  liquidityNet_gt?: Maybe<Scalars['BigInt']>;
  liquidityNet_gte?: Maybe<Scalars['BigInt']>;
  liquidityNet_in?: Maybe<Array<Scalars['BigInt']>>;
  liquidityNet_lt?: Maybe<Scalars['BigInt']>;
  liquidityNet_lte?: Maybe<Scalars['BigInt']>;
  liquidityNet_not?: Maybe<Scalars['BigInt']>;
  liquidityNet_not_in?: Maybe<Array<Scalars['BigInt']>>;
  or?: Maybe<Array<Maybe<TickDayData_Filter>>>;
  pool?: Maybe<Scalars['String']>;
  pool_?: Maybe<Pool_Filter>;
  pool_contains?: Maybe<Scalars['String']>;
  pool_contains_nocase?: Maybe<Scalars['String']>;
  pool_ends_with?: Maybe<Scalars['String']>;
  pool_ends_with_nocase?: Maybe<Scalars['String']>;
  pool_gt?: Maybe<Scalars['String']>;
  pool_gte?: Maybe<Scalars['String']>;
  pool_in?: Maybe<Array<Scalars['String']>>;
  pool_lt?: Maybe<Scalars['String']>;
  pool_lte?: Maybe<Scalars['String']>;
  pool_not?: Maybe<Scalars['String']>;
  pool_not_contains?: Maybe<Scalars['String']>;
  pool_not_contains_nocase?: Maybe<Scalars['String']>;
  pool_not_ends_with?: Maybe<Scalars['String']>;
  pool_not_ends_with_nocase?: Maybe<Scalars['String']>;
  pool_not_in?: Maybe<Array<Scalars['String']>>;
  pool_not_starts_with?: Maybe<Scalars['String']>;
  pool_not_starts_with_nocase?: Maybe<Scalars['String']>;
  pool_starts_with?: Maybe<Scalars['String']>;
  pool_starts_with_nocase?: Maybe<Scalars['String']>;
  tick?: Maybe<Scalars['String']>;
  tick_?: Maybe<Tick_Filter>;
  tick_contains?: Maybe<Scalars['String']>;
  tick_contains_nocase?: Maybe<Scalars['String']>;
  tick_ends_with?: Maybe<Scalars['String']>;
  tick_ends_with_nocase?: Maybe<Scalars['String']>;
  tick_gt?: Maybe<Scalars['String']>;
  tick_gte?: Maybe<Scalars['String']>;
  tick_in?: Maybe<Array<Scalars['String']>>;
  tick_lt?: Maybe<Scalars['String']>;
  tick_lte?: Maybe<Scalars['String']>;
  tick_not?: Maybe<Scalars['String']>;
  tick_not_contains?: Maybe<Scalars['String']>;
  tick_not_contains_nocase?: Maybe<Scalars['String']>;
  tick_not_ends_with?: Maybe<Scalars['String']>;
  tick_not_ends_with_nocase?: Maybe<Scalars['String']>;
  tick_not_in?: Maybe<Array<Scalars['String']>>;
  tick_not_starts_with?: Maybe<Scalars['String']>;
  tick_not_starts_with_nocase?: Maybe<Scalars['String']>;
  tick_starts_with?: Maybe<Scalars['String']>;
  tick_starts_with_nocase?: Maybe<Scalars['String']>;
  volumeToken0?: Maybe<Scalars['BigDecimal']>;
  volumeToken0_gt?: Maybe<Scalars['BigDecimal']>;
  volumeToken0_gte?: Maybe<Scalars['BigDecimal']>;
  volumeToken0_in?: Maybe<Array<Scalars['BigDecimal']>>;
  volumeToken0_lt?: Maybe<Scalars['BigDecimal']>;
  volumeToken0_lte?: Maybe<Scalars['BigDecimal']>;
  volumeToken0_not?: Maybe<Scalars['BigDecimal']>;
  volumeToken0_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
  volumeToken1?: Maybe<Scalars['BigDecimal']>;
  volumeToken1_gt?: Maybe<Scalars['BigDecimal']>;
  volumeToken1_gte?: Maybe<Scalars['BigDecimal']>;
  volumeToken1_in?: Maybe<Array<Scalars['BigDecimal']>>;
  volumeToken1_lt?: Maybe<Scalars['BigDecimal']>;
  volumeToken1_lte?: Maybe<Scalars['BigDecimal']>;
  volumeToken1_not?: Maybe<Scalars['BigDecimal']>;
  volumeToken1_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
  volumeUSD?: Maybe<Scalars['BigDecimal']>;
  volumeUSD_gt?: Maybe<Scalars['BigDecimal']>;
  volumeUSD_gte?: Maybe<Scalars['BigDecimal']>;
  volumeUSD_in?: Maybe<Array<Scalars['BigDecimal']>>;
  volumeUSD_lt?: Maybe<Scalars['BigDecimal']>;
  volumeUSD_lte?: Maybe<Scalars['BigDecimal']>;
  volumeUSD_not?: Maybe<Scalars['BigDecimal']>;
  volumeUSD_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
};

export enum TickDayData_OrderBy {
  Date = 'date',
  FeeGrowthOutside0X128 = 'feeGrowthOutside0X128',
  FeeGrowthOutside1X128 = 'feeGrowthOutside1X128',
  FeesUsd = 'feesUSD',
  Id = 'id',
  LiquidityGross = 'liquidityGross',
  LiquidityNet = 'liquidityNet',
  Pool = 'pool',
  PoolCollectedFeesToken0 = 'pool__collectedFeesToken0',
  PoolCollectedFeesToken1 = 'pool__collectedFeesToken1',
  PoolCollectedFeesUsd = 'pool__collectedFeesUSD',
  PoolCommunityFee0 = 'pool__communityFee0',
  PoolCommunityFee1 = 'pool__communityFee1',
  PoolCreatedAtBlockNumber = 'pool__createdAtBlockNumber',
  PoolCreatedAtTimestamp = 'pool__createdAtTimestamp',
  PoolFee = 'pool__fee',
  PoolFeeGrowthGlobal0X128 = 'pool__feeGrowthGlobal0X128',
  PoolFeeGrowthGlobal1X128 = 'pool__feeGrowthGlobal1X128',
  PoolFeesToken0 = 'pool__feesToken0',
  PoolFeesToken1 = 'pool__feesToken1',
  PoolFeesUsd = 'pool__feesUSD',
  PoolId = 'pool__id',
  PoolLiquidity = 'pool__liquidity',
  PoolLiquidityProviderCount = 'pool__liquidityProviderCount',
  PoolObservationIndex = 'pool__observationIndex',
  PoolSqrtPrice = 'pool__sqrtPrice',
  PoolTick = 'pool__tick',
  PoolTickSpacing = 'pool__tickSpacing',
  PoolToken0Price = 'pool__token0Price',
  PoolToken1Price = 'pool__token1Price',
  PoolTotalValueLockedMatic = 'pool__totalValueLockedMatic',
  PoolTotalValueLockedToken0 = 'pool__totalValueLockedToken0',
  PoolTotalValueLockedToken1 = 'pool__totalValueLockedToken1',
  PoolTotalValueLockedUsd = 'pool__totalValueLockedUSD',
  PoolTotalValueLockedUsdUntracked = 'pool__totalValueLockedUSDUntracked',
  PoolTxCount = 'pool__txCount',
  PoolUntrackedFeesUsd = 'pool__untrackedFeesUSD',
  PoolUntrackedVolumeUsd = 'pool__untrackedVolumeUSD',
  PoolVolumeToken0 = 'pool__volumeToken0',
  PoolVolumeToken1 = 'pool__volumeToken1',
  PoolVolumeUsd = 'pool__volumeUSD',
  Tick = 'tick',
  TickCollectedFeesToken0 = 'tick__collectedFeesToken0',
  TickCollectedFeesToken1 = 'tick__collectedFeesToken1',
  TickCollectedFeesUsd = 'tick__collectedFeesUSD',
  TickCreatedAtBlockNumber = 'tick__createdAtBlockNumber',
  TickCreatedAtTimestamp = 'tick__createdAtTimestamp',
  TickFeeGrowthOutside0X128 = 'tick__feeGrowthOutside0X128',
  TickFeeGrowthOutside1X128 = 'tick__feeGrowthOutside1X128',
  TickFeesUsd = 'tick__feesUSD',
  TickId = 'tick__id',
  TickLiquidityGross = 'tick__liquidityGross',
  TickLiquidityNet = 'tick__liquidityNet',
  TickLiquidityProviderCount = 'tick__liquidityProviderCount',
  TickPoolAddress = 'tick__poolAddress',
  TickPrice0 = 'tick__price0',
  TickPrice1 = 'tick__price1',
  TickTickIdx = 'tick__tickIdx',
  TickUntrackedVolumeUsd = 'tick__untrackedVolumeUSD',
  TickVolumeToken0 = 'tick__volumeToken0',
  TickVolumeToken1 = 'tick__volumeToken1',
  TickVolumeUsd = 'tick__volumeUSD',
  VolumeToken0 = 'volumeToken0',
  VolumeToken1 = 'volumeToken1',
  VolumeUsd = 'volumeUSD'
}

export type TickHourData = {
  __typename?: 'TickHourData';
  feesUSD: Scalars['BigDecimal'];
  id: Scalars['ID'];
  liquidityGross: Scalars['BigInt'];
  liquidityNet: Scalars['BigInt'];
  periodStartUnix: Scalars['Int'];
  pool: Pool;
  tick: Tick;
  volumeToken0: Scalars['BigDecimal'];
  volumeToken1: Scalars['BigDecimal'];
  volumeUSD: Scalars['BigDecimal'];
};

export type TickHourData_Filter = {
  /** Filter for the block changed event. */
  _change_block?: Maybe<BlockChangedFilter>;
  and?: Maybe<Array<Maybe<TickHourData_Filter>>>;
  feesUSD?: Maybe<Scalars['BigDecimal']>;
  feesUSD_gt?: Maybe<Scalars['BigDecimal']>;
  feesUSD_gte?: Maybe<Scalars['BigDecimal']>;
  feesUSD_in?: Maybe<Array<Scalars['BigDecimal']>>;
  feesUSD_lt?: Maybe<Scalars['BigDecimal']>;
  feesUSD_lte?: Maybe<Scalars['BigDecimal']>;
  feesUSD_not?: Maybe<Scalars['BigDecimal']>;
  feesUSD_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
  id?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_lt?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
  liquidityGross?: Maybe<Scalars['BigInt']>;
  liquidityGross_gt?: Maybe<Scalars['BigInt']>;
  liquidityGross_gte?: Maybe<Scalars['BigInt']>;
  liquidityGross_in?: Maybe<Array<Scalars['BigInt']>>;
  liquidityGross_lt?: Maybe<Scalars['BigInt']>;
  liquidityGross_lte?: Maybe<Scalars['BigInt']>;
  liquidityGross_not?: Maybe<Scalars['BigInt']>;
  liquidityGross_not_in?: Maybe<Array<Scalars['BigInt']>>;
  liquidityNet?: Maybe<Scalars['BigInt']>;
  liquidityNet_gt?: Maybe<Scalars['BigInt']>;
  liquidityNet_gte?: Maybe<Scalars['BigInt']>;
  liquidityNet_in?: Maybe<Array<Scalars['BigInt']>>;
  liquidityNet_lt?: Maybe<Scalars['BigInt']>;
  liquidityNet_lte?: Maybe<Scalars['BigInt']>;
  liquidityNet_not?: Maybe<Scalars['BigInt']>;
  liquidityNet_not_in?: Maybe<Array<Scalars['BigInt']>>;
  or?: Maybe<Array<Maybe<TickHourData_Filter>>>;
  periodStartUnix?: Maybe<Scalars['Int']>;
  periodStartUnix_gt?: Maybe<Scalars['Int']>;
  periodStartUnix_gte?: Maybe<Scalars['Int']>;
  periodStartUnix_in?: Maybe<Array<Scalars['Int']>>;
  periodStartUnix_lt?: Maybe<Scalars['Int']>;
  periodStartUnix_lte?: Maybe<Scalars['Int']>;
  periodStartUnix_not?: Maybe<Scalars['Int']>;
  periodStartUnix_not_in?: Maybe<Array<Scalars['Int']>>;
  pool?: Maybe<Scalars['String']>;
  pool_?: Maybe<Pool_Filter>;
  pool_contains?: Maybe<Scalars['String']>;
  pool_contains_nocase?: Maybe<Scalars['String']>;
  pool_ends_with?: Maybe<Scalars['String']>;
  pool_ends_with_nocase?: Maybe<Scalars['String']>;
  pool_gt?: Maybe<Scalars['String']>;
  pool_gte?: Maybe<Scalars['String']>;
  pool_in?: Maybe<Array<Scalars['String']>>;
  pool_lt?: Maybe<Scalars['String']>;
  pool_lte?: Maybe<Scalars['String']>;
  pool_not?: Maybe<Scalars['String']>;
  pool_not_contains?: Maybe<Scalars['String']>;
  pool_not_contains_nocase?: Maybe<Scalars['String']>;
  pool_not_ends_with?: Maybe<Scalars['String']>;
  pool_not_ends_with_nocase?: Maybe<Scalars['String']>;
  pool_not_in?: Maybe<Array<Scalars['String']>>;
  pool_not_starts_with?: Maybe<Scalars['String']>;
  pool_not_starts_with_nocase?: Maybe<Scalars['String']>;
  pool_starts_with?: Maybe<Scalars['String']>;
  pool_starts_with_nocase?: Maybe<Scalars['String']>;
  tick?: Maybe<Scalars['String']>;
  tick_?: Maybe<Tick_Filter>;
  tick_contains?: Maybe<Scalars['String']>;
  tick_contains_nocase?: Maybe<Scalars['String']>;
  tick_ends_with?: Maybe<Scalars['String']>;
  tick_ends_with_nocase?: Maybe<Scalars['String']>;
  tick_gt?: Maybe<Scalars['String']>;
  tick_gte?: Maybe<Scalars['String']>;
  tick_in?: Maybe<Array<Scalars['String']>>;
  tick_lt?: Maybe<Scalars['String']>;
  tick_lte?: Maybe<Scalars['String']>;
  tick_not?: Maybe<Scalars['String']>;
  tick_not_contains?: Maybe<Scalars['String']>;
  tick_not_contains_nocase?: Maybe<Scalars['String']>;
  tick_not_ends_with?: Maybe<Scalars['String']>;
  tick_not_ends_with_nocase?: Maybe<Scalars['String']>;
  tick_not_in?: Maybe<Array<Scalars['String']>>;
  tick_not_starts_with?: Maybe<Scalars['String']>;
  tick_not_starts_with_nocase?: Maybe<Scalars['String']>;
  tick_starts_with?: Maybe<Scalars['String']>;
  tick_starts_with_nocase?: Maybe<Scalars['String']>;
  volumeToken0?: Maybe<Scalars['BigDecimal']>;
  volumeToken0_gt?: Maybe<Scalars['BigDecimal']>;
  volumeToken0_gte?: Maybe<Scalars['BigDecimal']>;
  volumeToken0_in?: Maybe<Array<Scalars['BigDecimal']>>;
  volumeToken0_lt?: Maybe<Scalars['BigDecimal']>;
  volumeToken0_lte?: Maybe<Scalars['BigDecimal']>;
  volumeToken0_not?: Maybe<Scalars['BigDecimal']>;
  volumeToken0_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
  volumeToken1?: Maybe<Scalars['BigDecimal']>;
  volumeToken1_gt?: Maybe<Scalars['BigDecimal']>;
  volumeToken1_gte?: Maybe<Scalars['BigDecimal']>;
  volumeToken1_in?: Maybe<Array<Scalars['BigDecimal']>>;
  volumeToken1_lt?: Maybe<Scalars['BigDecimal']>;
  volumeToken1_lte?: Maybe<Scalars['BigDecimal']>;
  volumeToken1_not?: Maybe<Scalars['BigDecimal']>;
  volumeToken1_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
  volumeUSD?: Maybe<Scalars['BigDecimal']>;
  volumeUSD_gt?: Maybe<Scalars['BigDecimal']>;
  volumeUSD_gte?: Maybe<Scalars['BigDecimal']>;
  volumeUSD_in?: Maybe<Array<Scalars['BigDecimal']>>;
  volumeUSD_lt?: Maybe<Scalars['BigDecimal']>;
  volumeUSD_lte?: Maybe<Scalars['BigDecimal']>;
  volumeUSD_not?: Maybe<Scalars['BigDecimal']>;
  volumeUSD_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
};

export enum TickHourData_OrderBy {
  FeesUsd = 'feesUSD',
  Id = 'id',
  LiquidityGross = 'liquidityGross',
  LiquidityNet = 'liquidityNet',
  PeriodStartUnix = 'periodStartUnix',
  Pool = 'pool',
  PoolCollectedFeesToken0 = 'pool__collectedFeesToken0',
  PoolCollectedFeesToken1 = 'pool__collectedFeesToken1',
  PoolCollectedFeesUsd = 'pool__collectedFeesUSD',
  PoolCommunityFee0 = 'pool__communityFee0',
  PoolCommunityFee1 = 'pool__communityFee1',
  PoolCreatedAtBlockNumber = 'pool__createdAtBlockNumber',
  PoolCreatedAtTimestamp = 'pool__createdAtTimestamp',
  PoolFee = 'pool__fee',
  PoolFeeGrowthGlobal0X128 = 'pool__feeGrowthGlobal0X128',
  PoolFeeGrowthGlobal1X128 = 'pool__feeGrowthGlobal1X128',
  PoolFeesToken0 = 'pool__feesToken0',
  PoolFeesToken1 = 'pool__feesToken1',
  PoolFeesUsd = 'pool__feesUSD',
  PoolId = 'pool__id',
  PoolLiquidity = 'pool__liquidity',
  PoolLiquidityProviderCount = 'pool__liquidityProviderCount',
  PoolObservationIndex = 'pool__observationIndex',
  PoolSqrtPrice = 'pool__sqrtPrice',
  PoolTick = 'pool__tick',
  PoolTickSpacing = 'pool__tickSpacing',
  PoolToken0Price = 'pool__token0Price',
  PoolToken1Price = 'pool__token1Price',
  PoolTotalValueLockedMatic = 'pool__totalValueLockedMatic',
  PoolTotalValueLockedToken0 = 'pool__totalValueLockedToken0',
  PoolTotalValueLockedToken1 = 'pool__totalValueLockedToken1',
  PoolTotalValueLockedUsd = 'pool__totalValueLockedUSD',
  PoolTotalValueLockedUsdUntracked = 'pool__totalValueLockedUSDUntracked',
  PoolTxCount = 'pool__txCount',
  PoolUntrackedFeesUsd = 'pool__untrackedFeesUSD',
  PoolUntrackedVolumeUsd = 'pool__untrackedVolumeUSD',
  PoolVolumeToken0 = 'pool__volumeToken0',
  PoolVolumeToken1 = 'pool__volumeToken1',
  PoolVolumeUsd = 'pool__volumeUSD',
  Tick = 'tick',
  TickCollectedFeesToken0 = 'tick__collectedFeesToken0',
  TickCollectedFeesToken1 = 'tick__collectedFeesToken1',
  TickCollectedFeesUsd = 'tick__collectedFeesUSD',
  TickCreatedAtBlockNumber = 'tick__createdAtBlockNumber',
  TickCreatedAtTimestamp = 'tick__createdAtTimestamp',
  TickFeeGrowthOutside0X128 = 'tick__feeGrowthOutside0X128',
  TickFeeGrowthOutside1X128 = 'tick__feeGrowthOutside1X128',
  TickFeesUsd = 'tick__feesUSD',
  TickId = 'tick__id',
  TickLiquidityGross = 'tick__liquidityGross',
  TickLiquidityNet = 'tick__liquidityNet',
  TickLiquidityProviderCount = 'tick__liquidityProviderCount',
  TickPoolAddress = 'tick__poolAddress',
  TickPrice0 = 'tick__price0',
  TickPrice1 = 'tick__price1',
  TickTickIdx = 'tick__tickIdx',
  TickUntrackedVolumeUsd = 'tick__untrackedVolumeUSD',
  TickVolumeToken0 = 'tick__volumeToken0',
  TickVolumeToken1 = 'tick__volumeToken1',
  TickVolumeUsd = 'tick__volumeUSD',
  VolumeToken0 = 'volumeToken0',
  VolumeToken1 = 'volumeToken1',
  VolumeUsd = 'volumeUSD'
}

export type Tick_Filter = {
  /** Filter for the block changed event. */
  _change_block?: Maybe<BlockChangedFilter>;
  and?: Maybe<Array<Maybe<Tick_Filter>>>;
  collectedFeesToken0?: Maybe<Scalars['BigDecimal']>;
  collectedFeesToken0_gt?: Maybe<Scalars['BigDecimal']>;
  collectedFeesToken0_gte?: Maybe<Scalars['BigDecimal']>;
  collectedFeesToken0_in?: Maybe<Array<Scalars['BigDecimal']>>;
  collectedFeesToken0_lt?: Maybe<Scalars['BigDecimal']>;
  collectedFeesToken0_lte?: Maybe<Scalars['BigDecimal']>;
  collectedFeesToken0_not?: Maybe<Scalars['BigDecimal']>;
  collectedFeesToken0_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
  collectedFeesToken1?: Maybe<Scalars['BigDecimal']>;
  collectedFeesToken1_gt?: Maybe<Scalars['BigDecimal']>;
  collectedFeesToken1_gte?: Maybe<Scalars['BigDecimal']>;
  collectedFeesToken1_in?: Maybe<Array<Scalars['BigDecimal']>>;
  collectedFeesToken1_lt?: Maybe<Scalars['BigDecimal']>;
  collectedFeesToken1_lte?: Maybe<Scalars['BigDecimal']>;
  collectedFeesToken1_not?: Maybe<Scalars['BigDecimal']>;
  collectedFeesToken1_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
  collectedFeesUSD?: Maybe<Scalars['BigDecimal']>;
  collectedFeesUSD_gt?: Maybe<Scalars['BigDecimal']>;
  collectedFeesUSD_gte?: Maybe<Scalars['BigDecimal']>;
  collectedFeesUSD_in?: Maybe<Array<Scalars['BigDecimal']>>;
  collectedFeesUSD_lt?: Maybe<Scalars['BigDecimal']>;
  collectedFeesUSD_lte?: Maybe<Scalars['BigDecimal']>;
  collectedFeesUSD_not?: Maybe<Scalars['BigDecimal']>;
  collectedFeesUSD_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
  createdAtBlockNumber?: Maybe<Scalars['BigInt']>;
  createdAtBlockNumber_gt?: Maybe<Scalars['BigInt']>;
  createdAtBlockNumber_gte?: Maybe<Scalars['BigInt']>;
  createdAtBlockNumber_in?: Maybe<Array<Scalars['BigInt']>>;
  createdAtBlockNumber_lt?: Maybe<Scalars['BigInt']>;
  createdAtBlockNumber_lte?: Maybe<Scalars['BigInt']>;
  createdAtBlockNumber_not?: Maybe<Scalars['BigInt']>;
  createdAtBlockNumber_not_in?: Maybe<Array<Scalars['BigInt']>>;
  createdAtTimestamp?: Maybe<Scalars['BigInt']>;
  createdAtTimestamp_gt?: Maybe<Scalars['BigInt']>;
  createdAtTimestamp_gte?: Maybe<Scalars['BigInt']>;
  createdAtTimestamp_in?: Maybe<Array<Scalars['BigInt']>>;
  createdAtTimestamp_lt?: Maybe<Scalars['BigInt']>;
  createdAtTimestamp_lte?: Maybe<Scalars['BigInt']>;
  createdAtTimestamp_not?: Maybe<Scalars['BigInt']>;
  createdAtTimestamp_not_in?: Maybe<Array<Scalars['BigInt']>>;
  feeGrowthOutside0X128?: Maybe<Scalars['BigInt']>;
  feeGrowthOutside0X128_gt?: Maybe<Scalars['BigInt']>;
  feeGrowthOutside0X128_gte?: Maybe<Scalars['BigInt']>;
  feeGrowthOutside0X128_in?: Maybe<Array<Scalars['BigInt']>>;
  feeGrowthOutside0X128_lt?: Maybe<Scalars['BigInt']>;
  feeGrowthOutside0X128_lte?: Maybe<Scalars['BigInt']>;
  feeGrowthOutside0X128_not?: Maybe<Scalars['BigInt']>;
  feeGrowthOutside0X128_not_in?: Maybe<Array<Scalars['BigInt']>>;
  feeGrowthOutside1X128?: Maybe<Scalars['BigInt']>;
  feeGrowthOutside1X128_gt?: Maybe<Scalars['BigInt']>;
  feeGrowthOutside1X128_gte?: Maybe<Scalars['BigInt']>;
  feeGrowthOutside1X128_in?: Maybe<Array<Scalars['BigInt']>>;
  feeGrowthOutside1X128_lt?: Maybe<Scalars['BigInt']>;
  feeGrowthOutside1X128_lte?: Maybe<Scalars['BigInt']>;
  feeGrowthOutside1X128_not?: Maybe<Scalars['BigInt']>;
  feeGrowthOutside1X128_not_in?: Maybe<Array<Scalars['BigInt']>>;
  feesUSD?: Maybe<Scalars['BigDecimal']>;
  feesUSD_gt?: Maybe<Scalars['BigDecimal']>;
  feesUSD_gte?: Maybe<Scalars['BigDecimal']>;
  feesUSD_in?: Maybe<Array<Scalars['BigDecimal']>>;
  feesUSD_lt?: Maybe<Scalars['BigDecimal']>;
  feesUSD_lte?: Maybe<Scalars['BigDecimal']>;
  feesUSD_not?: Maybe<Scalars['BigDecimal']>;
  feesUSD_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
  id?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_lt?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
  liquidityGross?: Maybe<Scalars['BigInt']>;
  liquidityGross_gt?: Maybe<Scalars['BigInt']>;
  liquidityGross_gte?: Maybe<Scalars['BigInt']>;
  liquidityGross_in?: Maybe<Array<Scalars['BigInt']>>;
  liquidityGross_lt?: Maybe<Scalars['BigInt']>;
  liquidityGross_lte?: Maybe<Scalars['BigInt']>;
  liquidityGross_not?: Maybe<Scalars['BigInt']>;
  liquidityGross_not_in?: Maybe<Array<Scalars['BigInt']>>;
  liquidityNet?: Maybe<Scalars['BigInt']>;
  liquidityNet_gt?: Maybe<Scalars['BigInt']>;
  liquidityNet_gte?: Maybe<Scalars['BigInt']>;
  liquidityNet_in?: Maybe<Array<Scalars['BigInt']>>;
  liquidityNet_lt?: Maybe<Scalars['BigInt']>;
  liquidityNet_lte?: Maybe<Scalars['BigInt']>;
  liquidityNet_not?: Maybe<Scalars['BigInt']>;
  liquidityNet_not_in?: Maybe<Array<Scalars['BigInt']>>;
  liquidityProviderCount?: Maybe<Scalars['BigInt']>;
  liquidityProviderCount_gt?: Maybe<Scalars['BigInt']>;
  liquidityProviderCount_gte?: Maybe<Scalars['BigInt']>;
  liquidityProviderCount_in?: Maybe<Array<Scalars['BigInt']>>;
  liquidityProviderCount_lt?: Maybe<Scalars['BigInt']>;
  liquidityProviderCount_lte?: Maybe<Scalars['BigInt']>;
  liquidityProviderCount_not?: Maybe<Scalars['BigInt']>;
  liquidityProviderCount_not_in?: Maybe<Array<Scalars['BigInt']>>;
  or?: Maybe<Array<Maybe<Tick_Filter>>>;
  pool?: Maybe<Scalars['String']>;
  poolAddress?: Maybe<Scalars['String']>;
  poolAddress_contains?: Maybe<Scalars['String']>;
  poolAddress_contains_nocase?: Maybe<Scalars['String']>;
  poolAddress_ends_with?: Maybe<Scalars['String']>;
  poolAddress_ends_with_nocase?: Maybe<Scalars['String']>;
  poolAddress_gt?: Maybe<Scalars['String']>;
  poolAddress_gte?: Maybe<Scalars['String']>;
  poolAddress_in?: Maybe<Array<Scalars['String']>>;
  poolAddress_lt?: Maybe<Scalars['String']>;
  poolAddress_lte?: Maybe<Scalars['String']>;
  poolAddress_not?: Maybe<Scalars['String']>;
  poolAddress_not_contains?: Maybe<Scalars['String']>;
  poolAddress_not_contains_nocase?: Maybe<Scalars['String']>;
  poolAddress_not_ends_with?: Maybe<Scalars['String']>;
  poolAddress_not_ends_with_nocase?: Maybe<Scalars['String']>;
  poolAddress_not_in?: Maybe<Array<Scalars['String']>>;
  poolAddress_not_starts_with?: Maybe<Scalars['String']>;
  poolAddress_not_starts_with_nocase?: Maybe<Scalars['String']>;
  poolAddress_starts_with?: Maybe<Scalars['String']>;
  poolAddress_starts_with_nocase?: Maybe<Scalars['String']>;
  pool_?: Maybe<Pool_Filter>;
  pool_contains?: Maybe<Scalars['String']>;
  pool_contains_nocase?: Maybe<Scalars['String']>;
  pool_ends_with?: Maybe<Scalars['String']>;
  pool_ends_with_nocase?: Maybe<Scalars['String']>;
  pool_gt?: Maybe<Scalars['String']>;
  pool_gte?: Maybe<Scalars['String']>;
  pool_in?: Maybe<Array<Scalars['String']>>;
  pool_lt?: Maybe<Scalars['String']>;
  pool_lte?: Maybe<Scalars['String']>;
  pool_not?: Maybe<Scalars['String']>;
  pool_not_contains?: Maybe<Scalars['String']>;
  pool_not_contains_nocase?: Maybe<Scalars['String']>;
  pool_not_ends_with?: Maybe<Scalars['String']>;
  pool_not_ends_with_nocase?: Maybe<Scalars['String']>;
  pool_not_in?: Maybe<Array<Scalars['String']>>;
  pool_not_starts_with?: Maybe<Scalars['String']>;
  pool_not_starts_with_nocase?: Maybe<Scalars['String']>;
  pool_starts_with?: Maybe<Scalars['String']>;
  pool_starts_with_nocase?: Maybe<Scalars['String']>;
  price0?: Maybe<Scalars['BigDecimal']>;
  price0_gt?: Maybe<Scalars['BigDecimal']>;
  price0_gte?: Maybe<Scalars['BigDecimal']>;
  price0_in?: Maybe<Array<Scalars['BigDecimal']>>;
  price0_lt?: Maybe<Scalars['BigDecimal']>;
  price0_lte?: Maybe<Scalars['BigDecimal']>;
  price0_not?: Maybe<Scalars['BigDecimal']>;
  price0_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
  price1?: Maybe<Scalars['BigDecimal']>;
  price1_gt?: Maybe<Scalars['BigDecimal']>;
  price1_gte?: Maybe<Scalars['BigDecimal']>;
  price1_in?: Maybe<Array<Scalars['BigDecimal']>>;
  price1_lt?: Maybe<Scalars['BigDecimal']>;
  price1_lte?: Maybe<Scalars['BigDecimal']>;
  price1_not?: Maybe<Scalars['BigDecimal']>;
  price1_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
  tickIdx?: Maybe<Scalars['BigInt']>;
  tickIdx_gt?: Maybe<Scalars['BigInt']>;
  tickIdx_gte?: Maybe<Scalars['BigInt']>;
  tickIdx_in?: Maybe<Array<Scalars['BigInt']>>;
  tickIdx_lt?: Maybe<Scalars['BigInt']>;
  tickIdx_lte?: Maybe<Scalars['BigInt']>;
  tickIdx_not?: Maybe<Scalars['BigInt']>;
  tickIdx_not_in?: Maybe<Array<Scalars['BigInt']>>;
  untrackedVolumeUSD?: Maybe<Scalars['BigDecimal']>;
  untrackedVolumeUSD_gt?: Maybe<Scalars['BigDecimal']>;
  untrackedVolumeUSD_gte?: Maybe<Scalars['BigDecimal']>;
  untrackedVolumeUSD_in?: Maybe<Array<Scalars['BigDecimal']>>;
  untrackedVolumeUSD_lt?: Maybe<Scalars['BigDecimal']>;
  untrackedVolumeUSD_lte?: Maybe<Scalars['BigDecimal']>;
  untrackedVolumeUSD_not?: Maybe<Scalars['BigDecimal']>;
  untrackedVolumeUSD_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
  volumeToken0?: Maybe<Scalars['BigDecimal']>;
  volumeToken0_gt?: Maybe<Scalars['BigDecimal']>;
  volumeToken0_gte?: Maybe<Scalars['BigDecimal']>;
  volumeToken0_in?: Maybe<Array<Scalars['BigDecimal']>>;
  volumeToken0_lt?: Maybe<Scalars['BigDecimal']>;
  volumeToken0_lte?: Maybe<Scalars['BigDecimal']>;
  volumeToken0_not?: Maybe<Scalars['BigDecimal']>;
  volumeToken0_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
  volumeToken1?: Maybe<Scalars['BigDecimal']>;
  volumeToken1_gt?: Maybe<Scalars['BigDecimal']>;
  volumeToken1_gte?: Maybe<Scalars['BigDecimal']>;
  volumeToken1_in?: Maybe<Array<Scalars['BigDecimal']>>;
  volumeToken1_lt?: Maybe<Scalars['BigDecimal']>;
  volumeToken1_lte?: Maybe<Scalars['BigDecimal']>;
  volumeToken1_not?: Maybe<Scalars['BigDecimal']>;
  volumeToken1_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
  volumeUSD?: Maybe<Scalars['BigDecimal']>;
  volumeUSD_gt?: Maybe<Scalars['BigDecimal']>;
  volumeUSD_gte?: Maybe<Scalars['BigDecimal']>;
  volumeUSD_in?: Maybe<Array<Scalars['BigDecimal']>>;
  volumeUSD_lt?: Maybe<Scalars['BigDecimal']>;
  volumeUSD_lte?: Maybe<Scalars['BigDecimal']>;
  volumeUSD_not?: Maybe<Scalars['BigDecimal']>;
  volumeUSD_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
};

export enum Tick_OrderBy {
  CollectedFeesToken0 = 'collectedFeesToken0',
  CollectedFeesToken1 = 'collectedFeesToken1',
  CollectedFeesUsd = 'collectedFeesUSD',
  CreatedAtBlockNumber = 'createdAtBlockNumber',
  CreatedAtTimestamp = 'createdAtTimestamp',
  FeeGrowthOutside0X128 = 'feeGrowthOutside0X128',
  FeeGrowthOutside1X128 = 'feeGrowthOutside1X128',
  FeesUsd = 'feesUSD',
  Id = 'id',
  LiquidityGross = 'liquidityGross',
  LiquidityNet = 'liquidityNet',
  LiquidityProviderCount = 'liquidityProviderCount',
  Pool = 'pool',
  PoolAddress = 'poolAddress',
  PoolCollectedFeesToken0 = 'pool__collectedFeesToken0',
  PoolCollectedFeesToken1 = 'pool__collectedFeesToken1',
  PoolCollectedFeesUsd = 'pool__collectedFeesUSD',
  PoolCommunityFee0 = 'pool__communityFee0',
  PoolCommunityFee1 = 'pool__communityFee1',
  PoolCreatedAtBlockNumber = 'pool__createdAtBlockNumber',
  PoolCreatedAtTimestamp = 'pool__createdAtTimestamp',
  PoolFee = 'pool__fee',
  PoolFeeGrowthGlobal0X128 = 'pool__feeGrowthGlobal0X128',
  PoolFeeGrowthGlobal1X128 = 'pool__feeGrowthGlobal1X128',
  PoolFeesToken0 = 'pool__feesToken0',
  PoolFeesToken1 = 'pool__feesToken1',
  PoolFeesUsd = 'pool__feesUSD',
  PoolId = 'pool__id',
  PoolLiquidity = 'pool__liquidity',
  PoolLiquidityProviderCount = 'pool__liquidityProviderCount',
  PoolObservationIndex = 'pool__observationIndex',
  PoolSqrtPrice = 'pool__sqrtPrice',
  PoolTick = 'pool__tick',
  PoolTickSpacing = 'pool__tickSpacing',
  PoolToken0Price = 'pool__token0Price',
  PoolToken1Price = 'pool__token1Price',
  PoolTotalValueLockedMatic = 'pool__totalValueLockedMatic',
  PoolTotalValueLockedToken0 = 'pool__totalValueLockedToken0',
  PoolTotalValueLockedToken1 = 'pool__totalValueLockedToken1',
  PoolTotalValueLockedUsd = 'pool__totalValueLockedUSD',
  PoolTotalValueLockedUsdUntracked = 'pool__totalValueLockedUSDUntracked',
  PoolTxCount = 'pool__txCount',
  PoolUntrackedFeesUsd = 'pool__untrackedFeesUSD',
  PoolUntrackedVolumeUsd = 'pool__untrackedVolumeUSD',
  PoolVolumeToken0 = 'pool__volumeToken0',
  PoolVolumeToken1 = 'pool__volumeToken1',
  PoolVolumeUsd = 'pool__volumeUSD',
  Price0 = 'price0',
  Price1 = 'price1',
  TickIdx = 'tickIdx',
  UntrackedVolumeUsd = 'untrackedVolumeUSD',
  VolumeToken0 = 'volumeToken0',
  VolumeToken1 = 'volumeToken1',
  VolumeUsd = 'volumeUSD'
}


export type Token = {
  __typename?: 'Token';
  decimals: Scalars['BigInt'];
  derivedMatic: Scalars['BigDecimal'];
  feesUSD: Scalars['BigDecimal'];
  id: Scalars['ID'];
  isSeer: Scalars['Boolean'];
  market?: Maybe<Market>;
  name: Scalars['String'];
  poolCollateral?: Maybe<Pool>;
  poolCount: Scalars['BigInt'];
  pools0: Array<Pool>;
  pools1: Array<Pool>;
  symbol: Scalars['String'];
  tokenDayData: Array<TokenDayData>;
  totalSupply: Scalars['BigInt'];
  totalValueLocked: Scalars['BigDecimal'];
  totalValueLockedUSD: Scalars['BigDecimal'];
  totalValueLockedUSDUntracked: Scalars['BigDecimal'];
  txCount: Scalars['BigInt'];
  untrackedVolumeUSD: Scalars['BigDecimal'];
  volume: Scalars['BigDecimal'];
  volumeUSD: Scalars['BigDecimal'];
  whitelistPools: Array<Pool>;
};


export type TokenPools0Args = {
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Pool_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  skip?: Maybe<Scalars['Int']>;
  where?: Maybe<Pool_Filter>;
};


export type TokenPools1Args = {
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Pool_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  skip?: Maybe<Scalars['Int']>;
  where?: Maybe<Pool_Filter>;
};


export type TokenTokenDayDataArgs = {
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<TokenDayData_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  skip?: Maybe<Scalars['Int']>;
  where?: Maybe<TokenDayData_Filter>;
};


export type TokenWhitelistPoolsArgs = {
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Pool_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  skip?: Maybe<Scalars['Int']>;
  where?: Maybe<Pool_Filter>;
};

export type TokenDayData = {
  __typename?: 'TokenDayData';
  close: Scalars['BigDecimal'];
  date: Scalars['Int'];
  feesUSD: Scalars['BigDecimal'];
  high: Scalars['BigDecimal'];
  id: Scalars['ID'];
  low: Scalars['BigDecimal'];
  open: Scalars['BigDecimal'];
  priceUSD: Scalars['BigDecimal'];
  token: Token;
  totalValueLocked: Scalars['BigDecimal'];
  totalValueLockedUSD: Scalars['BigDecimal'];
  untrackedVolumeUSD: Scalars['BigDecimal'];
  volume: Scalars['BigDecimal'];
  volumeUSD: Scalars['BigDecimal'];
};

export type TokenDayData_Filter = {
  /** Filter for the block changed event. */
  _change_block?: Maybe<BlockChangedFilter>;
  and?: Maybe<Array<Maybe<TokenDayData_Filter>>>;
  close?: Maybe<Scalars['BigDecimal']>;
  close_gt?: Maybe<Scalars['BigDecimal']>;
  close_gte?: Maybe<Scalars['BigDecimal']>;
  close_in?: Maybe<Array<Scalars['BigDecimal']>>;
  close_lt?: Maybe<Scalars['BigDecimal']>;
  close_lte?: Maybe<Scalars['BigDecimal']>;
  close_not?: Maybe<Scalars['BigDecimal']>;
  close_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
  date?: Maybe<Scalars['Int']>;
  date_gt?: Maybe<Scalars['Int']>;
  date_gte?: Maybe<Scalars['Int']>;
  date_in?: Maybe<Array<Scalars['Int']>>;
  date_lt?: Maybe<Scalars['Int']>;
  date_lte?: Maybe<Scalars['Int']>;
  date_not?: Maybe<Scalars['Int']>;
  date_not_in?: Maybe<Array<Scalars['Int']>>;
  feesUSD?: Maybe<Scalars['BigDecimal']>;
  feesUSD_gt?: Maybe<Scalars['BigDecimal']>;
  feesUSD_gte?: Maybe<Scalars['BigDecimal']>;
  feesUSD_in?: Maybe<Array<Scalars['BigDecimal']>>;
  feesUSD_lt?: Maybe<Scalars['BigDecimal']>;
  feesUSD_lte?: Maybe<Scalars['BigDecimal']>;
  feesUSD_not?: Maybe<Scalars['BigDecimal']>;
  feesUSD_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
  high?: Maybe<Scalars['BigDecimal']>;
  high_gt?: Maybe<Scalars['BigDecimal']>;
  high_gte?: Maybe<Scalars['BigDecimal']>;
  high_in?: Maybe<Array<Scalars['BigDecimal']>>;
  high_lt?: Maybe<Scalars['BigDecimal']>;
  high_lte?: Maybe<Scalars['BigDecimal']>;
  high_not?: Maybe<Scalars['BigDecimal']>;
  high_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
  id?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_lt?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
  low?: Maybe<Scalars['BigDecimal']>;
  low_gt?: Maybe<Scalars['BigDecimal']>;
  low_gte?: Maybe<Scalars['BigDecimal']>;
  low_in?: Maybe<Array<Scalars['BigDecimal']>>;
  low_lt?: Maybe<Scalars['BigDecimal']>;
  low_lte?: Maybe<Scalars['BigDecimal']>;
  low_not?: Maybe<Scalars['BigDecimal']>;
  low_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
  open?: Maybe<Scalars['BigDecimal']>;
  open_gt?: Maybe<Scalars['BigDecimal']>;
  open_gte?: Maybe<Scalars['BigDecimal']>;
  open_in?: Maybe<Array<Scalars['BigDecimal']>>;
  open_lt?: Maybe<Scalars['BigDecimal']>;
  open_lte?: Maybe<Scalars['BigDecimal']>;
  open_not?: Maybe<Scalars['BigDecimal']>;
  open_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
  or?: Maybe<Array<Maybe<TokenDayData_Filter>>>;
  priceUSD?: Maybe<Scalars['BigDecimal']>;
  priceUSD_gt?: Maybe<Scalars['BigDecimal']>;
  priceUSD_gte?: Maybe<Scalars['BigDecimal']>;
  priceUSD_in?: Maybe<Array<Scalars['BigDecimal']>>;
  priceUSD_lt?: Maybe<Scalars['BigDecimal']>;
  priceUSD_lte?: Maybe<Scalars['BigDecimal']>;
  priceUSD_not?: Maybe<Scalars['BigDecimal']>;
  priceUSD_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
  token?: Maybe<Scalars['String']>;
  token_?: Maybe<Token_Filter>;
  token_contains?: Maybe<Scalars['String']>;
  token_contains_nocase?: Maybe<Scalars['String']>;
  token_ends_with?: Maybe<Scalars['String']>;
  token_ends_with_nocase?: Maybe<Scalars['String']>;
  token_gt?: Maybe<Scalars['String']>;
  token_gte?: Maybe<Scalars['String']>;
  token_in?: Maybe<Array<Scalars['String']>>;
  token_lt?: Maybe<Scalars['String']>;
  token_lte?: Maybe<Scalars['String']>;
  token_not?: Maybe<Scalars['String']>;
  token_not_contains?: Maybe<Scalars['String']>;
  token_not_contains_nocase?: Maybe<Scalars['String']>;
  token_not_ends_with?: Maybe<Scalars['String']>;
  token_not_ends_with_nocase?: Maybe<Scalars['String']>;
  token_not_in?: Maybe<Array<Scalars['String']>>;
  token_not_starts_with?: Maybe<Scalars['String']>;
  token_not_starts_with_nocase?: Maybe<Scalars['String']>;
  token_starts_with?: Maybe<Scalars['String']>;
  token_starts_with_nocase?: Maybe<Scalars['String']>;
  totalValueLocked?: Maybe<Scalars['BigDecimal']>;
  totalValueLockedUSD?: Maybe<Scalars['BigDecimal']>;
  totalValueLockedUSD_gt?: Maybe<Scalars['BigDecimal']>;
  totalValueLockedUSD_gte?: Maybe<Scalars['BigDecimal']>;
  totalValueLockedUSD_in?: Maybe<Array<Scalars['BigDecimal']>>;
  totalValueLockedUSD_lt?: Maybe<Scalars['BigDecimal']>;
  totalValueLockedUSD_lte?: Maybe<Scalars['BigDecimal']>;
  totalValueLockedUSD_not?: Maybe<Scalars['BigDecimal']>;
  totalValueLockedUSD_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
  totalValueLocked_gt?: Maybe<Scalars['BigDecimal']>;
  totalValueLocked_gte?: Maybe<Scalars['BigDecimal']>;
  totalValueLocked_in?: Maybe<Array<Scalars['BigDecimal']>>;
  totalValueLocked_lt?: Maybe<Scalars['BigDecimal']>;
  totalValueLocked_lte?: Maybe<Scalars['BigDecimal']>;
  totalValueLocked_not?: Maybe<Scalars['BigDecimal']>;
  totalValueLocked_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
  untrackedVolumeUSD?: Maybe<Scalars['BigDecimal']>;
  untrackedVolumeUSD_gt?: Maybe<Scalars['BigDecimal']>;
  untrackedVolumeUSD_gte?: Maybe<Scalars['BigDecimal']>;
  untrackedVolumeUSD_in?: Maybe<Array<Scalars['BigDecimal']>>;
  untrackedVolumeUSD_lt?: Maybe<Scalars['BigDecimal']>;
  untrackedVolumeUSD_lte?: Maybe<Scalars['BigDecimal']>;
  untrackedVolumeUSD_not?: Maybe<Scalars['BigDecimal']>;
  untrackedVolumeUSD_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
  volume?: Maybe<Scalars['BigDecimal']>;
  volumeUSD?: Maybe<Scalars['BigDecimal']>;
  volumeUSD_gt?: Maybe<Scalars['BigDecimal']>;
  volumeUSD_gte?: Maybe<Scalars['BigDecimal']>;
  volumeUSD_in?: Maybe<Array<Scalars['BigDecimal']>>;
  volumeUSD_lt?: Maybe<Scalars['BigDecimal']>;
  volumeUSD_lte?: Maybe<Scalars['BigDecimal']>;
  volumeUSD_not?: Maybe<Scalars['BigDecimal']>;
  volumeUSD_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
  volume_gt?: Maybe<Scalars['BigDecimal']>;
  volume_gte?: Maybe<Scalars['BigDecimal']>;
  volume_in?: Maybe<Array<Scalars['BigDecimal']>>;
  volume_lt?: Maybe<Scalars['BigDecimal']>;
  volume_lte?: Maybe<Scalars['BigDecimal']>;
  volume_not?: Maybe<Scalars['BigDecimal']>;
  volume_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
};

export enum TokenDayData_OrderBy {
  Close = 'close',
  Date = 'date',
  FeesUsd = 'feesUSD',
  High = 'high',
  Id = 'id',
  Low = 'low',
  Open = 'open',
  PriceUsd = 'priceUSD',
  Token = 'token',
  TokenDecimals = 'token__decimals',
  TokenDerivedMatic = 'token__derivedMatic',
  TokenFeesUsd = 'token__feesUSD',
  TokenId = 'token__id',
  TokenIsSeer = 'token__isSeer',
  TokenName = 'token__name',
  TokenPoolCount = 'token__poolCount',
  TokenSymbol = 'token__symbol',
  TokenTotalSupply = 'token__totalSupply',
  TokenTotalValueLocked = 'token__totalValueLocked',
  TokenTotalValueLockedUsd = 'token__totalValueLockedUSD',
  TokenTotalValueLockedUsdUntracked = 'token__totalValueLockedUSDUntracked',
  TokenTxCount = 'token__txCount',
  TokenUntrackedVolumeUsd = 'token__untrackedVolumeUSD',
  TokenVolume = 'token__volume',
  TokenVolumeUsd = 'token__volumeUSD',
  TotalValueLocked = 'totalValueLocked',
  TotalValueLockedUsd = 'totalValueLockedUSD',
  UntrackedVolumeUsd = 'untrackedVolumeUSD',
  Volume = 'volume',
  VolumeUsd = 'volumeUSD'
}

export type TokenHourData = {
  __typename?: 'TokenHourData';
  close: Scalars['BigDecimal'];
  feesUSD: Scalars['BigDecimal'];
  high: Scalars['BigDecimal'];
  id: Scalars['ID'];
  low: Scalars['BigDecimal'];
  open: Scalars['BigDecimal'];
  periodStartUnix: Scalars['Int'];
  priceUSD: Scalars['BigDecimal'];
  token: Token;
  totalValueLocked: Scalars['BigDecimal'];
  totalValueLockedUSD: Scalars['BigDecimal'];
  untrackedVolumeUSD: Scalars['BigDecimal'];
  volume: Scalars['BigDecimal'];
  volumeUSD: Scalars['BigDecimal'];
};

export type TokenHourData_Filter = {
  /** Filter for the block changed event. */
  _change_block?: Maybe<BlockChangedFilter>;
  and?: Maybe<Array<Maybe<TokenHourData_Filter>>>;
  close?: Maybe<Scalars['BigDecimal']>;
  close_gt?: Maybe<Scalars['BigDecimal']>;
  close_gte?: Maybe<Scalars['BigDecimal']>;
  close_in?: Maybe<Array<Scalars['BigDecimal']>>;
  close_lt?: Maybe<Scalars['BigDecimal']>;
  close_lte?: Maybe<Scalars['BigDecimal']>;
  close_not?: Maybe<Scalars['BigDecimal']>;
  close_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
  feesUSD?: Maybe<Scalars['BigDecimal']>;
  feesUSD_gt?: Maybe<Scalars['BigDecimal']>;
  feesUSD_gte?: Maybe<Scalars['BigDecimal']>;
  feesUSD_in?: Maybe<Array<Scalars['BigDecimal']>>;
  feesUSD_lt?: Maybe<Scalars['BigDecimal']>;
  feesUSD_lte?: Maybe<Scalars['BigDecimal']>;
  feesUSD_not?: Maybe<Scalars['BigDecimal']>;
  feesUSD_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
  high?: Maybe<Scalars['BigDecimal']>;
  high_gt?: Maybe<Scalars['BigDecimal']>;
  high_gte?: Maybe<Scalars['BigDecimal']>;
  high_in?: Maybe<Array<Scalars['BigDecimal']>>;
  high_lt?: Maybe<Scalars['BigDecimal']>;
  high_lte?: Maybe<Scalars['BigDecimal']>;
  high_not?: Maybe<Scalars['BigDecimal']>;
  high_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
  id?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_lt?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
  low?: Maybe<Scalars['BigDecimal']>;
  low_gt?: Maybe<Scalars['BigDecimal']>;
  low_gte?: Maybe<Scalars['BigDecimal']>;
  low_in?: Maybe<Array<Scalars['BigDecimal']>>;
  low_lt?: Maybe<Scalars['BigDecimal']>;
  low_lte?: Maybe<Scalars['BigDecimal']>;
  low_not?: Maybe<Scalars['BigDecimal']>;
  low_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
  open?: Maybe<Scalars['BigDecimal']>;
  open_gt?: Maybe<Scalars['BigDecimal']>;
  open_gte?: Maybe<Scalars['BigDecimal']>;
  open_in?: Maybe<Array<Scalars['BigDecimal']>>;
  open_lt?: Maybe<Scalars['BigDecimal']>;
  open_lte?: Maybe<Scalars['BigDecimal']>;
  open_not?: Maybe<Scalars['BigDecimal']>;
  open_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
  or?: Maybe<Array<Maybe<TokenHourData_Filter>>>;
  periodStartUnix?: Maybe<Scalars['Int']>;
  periodStartUnix_gt?: Maybe<Scalars['Int']>;
  periodStartUnix_gte?: Maybe<Scalars['Int']>;
  periodStartUnix_in?: Maybe<Array<Scalars['Int']>>;
  periodStartUnix_lt?: Maybe<Scalars['Int']>;
  periodStartUnix_lte?: Maybe<Scalars['Int']>;
  periodStartUnix_not?: Maybe<Scalars['Int']>;
  periodStartUnix_not_in?: Maybe<Array<Scalars['Int']>>;
  priceUSD?: Maybe<Scalars['BigDecimal']>;
  priceUSD_gt?: Maybe<Scalars['BigDecimal']>;
  priceUSD_gte?: Maybe<Scalars['BigDecimal']>;
  priceUSD_in?: Maybe<Array<Scalars['BigDecimal']>>;
  priceUSD_lt?: Maybe<Scalars['BigDecimal']>;
  priceUSD_lte?: Maybe<Scalars['BigDecimal']>;
  priceUSD_not?: Maybe<Scalars['BigDecimal']>;
  priceUSD_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
  token?: Maybe<Scalars['String']>;
  token_?: Maybe<Token_Filter>;
  token_contains?: Maybe<Scalars['String']>;
  token_contains_nocase?: Maybe<Scalars['String']>;
  token_ends_with?: Maybe<Scalars['String']>;
  token_ends_with_nocase?: Maybe<Scalars['String']>;
  token_gt?: Maybe<Scalars['String']>;
  token_gte?: Maybe<Scalars['String']>;
  token_in?: Maybe<Array<Scalars['String']>>;
  token_lt?: Maybe<Scalars['String']>;
  token_lte?: Maybe<Scalars['String']>;
  token_not?: Maybe<Scalars['String']>;
  token_not_contains?: Maybe<Scalars['String']>;
  token_not_contains_nocase?: Maybe<Scalars['String']>;
  token_not_ends_with?: Maybe<Scalars['String']>;
  token_not_ends_with_nocase?: Maybe<Scalars['String']>;
  token_not_in?: Maybe<Array<Scalars['String']>>;
  token_not_starts_with?: Maybe<Scalars['String']>;
  token_not_starts_with_nocase?: Maybe<Scalars['String']>;
  token_starts_with?: Maybe<Scalars['String']>;
  token_starts_with_nocase?: Maybe<Scalars['String']>;
  totalValueLocked?: Maybe<Scalars['BigDecimal']>;
  totalValueLockedUSD?: Maybe<Scalars['BigDecimal']>;
  totalValueLockedUSD_gt?: Maybe<Scalars['BigDecimal']>;
  totalValueLockedUSD_gte?: Maybe<Scalars['BigDecimal']>;
  totalValueLockedUSD_in?: Maybe<Array<Scalars['BigDecimal']>>;
  totalValueLockedUSD_lt?: Maybe<Scalars['BigDecimal']>;
  totalValueLockedUSD_lte?: Maybe<Scalars['BigDecimal']>;
  totalValueLockedUSD_not?: Maybe<Scalars['BigDecimal']>;
  totalValueLockedUSD_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
  totalValueLocked_gt?: Maybe<Scalars['BigDecimal']>;
  totalValueLocked_gte?: Maybe<Scalars['BigDecimal']>;
  totalValueLocked_in?: Maybe<Array<Scalars['BigDecimal']>>;
  totalValueLocked_lt?: Maybe<Scalars['BigDecimal']>;
  totalValueLocked_lte?: Maybe<Scalars['BigDecimal']>;
  totalValueLocked_not?: Maybe<Scalars['BigDecimal']>;
  totalValueLocked_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
  untrackedVolumeUSD?: Maybe<Scalars['BigDecimal']>;
  untrackedVolumeUSD_gt?: Maybe<Scalars['BigDecimal']>;
  untrackedVolumeUSD_gte?: Maybe<Scalars['BigDecimal']>;
  untrackedVolumeUSD_in?: Maybe<Array<Scalars['BigDecimal']>>;
  untrackedVolumeUSD_lt?: Maybe<Scalars['BigDecimal']>;
  untrackedVolumeUSD_lte?: Maybe<Scalars['BigDecimal']>;
  untrackedVolumeUSD_not?: Maybe<Scalars['BigDecimal']>;
  untrackedVolumeUSD_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
  volume?: Maybe<Scalars['BigDecimal']>;
  volumeUSD?: Maybe<Scalars['BigDecimal']>;
  volumeUSD_gt?: Maybe<Scalars['BigDecimal']>;
  volumeUSD_gte?: Maybe<Scalars['BigDecimal']>;
  volumeUSD_in?: Maybe<Array<Scalars['BigDecimal']>>;
  volumeUSD_lt?: Maybe<Scalars['BigDecimal']>;
  volumeUSD_lte?: Maybe<Scalars['BigDecimal']>;
  volumeUSD_not?: Maybe<Scalars['BigDecimal']>;
  volumeUSD_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
  volume_gt?: Maybe<Scalars['BigDecimal']>;
  volume_gte?: Maybe<Scalars['BigDecimal']>;
  volume_in?: Maybe<Array<Scalars['BigDecimal']>>;
  volume_lt?: Maybe<Scalars['BigDecimal']>;
  volume_lte?: Maybe<Scalars['BigDecimal']>;
  volume_not?: Maybe<Scalars['BigDecimal']>;
  volume_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
};

export enum TokenHourData_OrderBy {
  Close = 'close',
  FeesUsd = 'feesUSD',
  High = 'high',
  Id = 'id',
  Low = 'low',
  Open = 'open',
  PeriodStartUnix = 'periodStartUnix',
  PriceUsd = 'priceUSD',
  Token = 'token',
  TokenDecimals = 'token__decimals',
  TokenDerivedMatic = 'token__derivedMatic',
  TokenFeesUsd = 'token__feesUSD',
  TokenId = 'token__id',
  TokenIsSeer = 'token__isSeer',
  TokenName = 'token__name',
  TokenPoolCount = 'token__poolCount',
  TokenSymbol = 'token__symbol',
  TokenTotalSupply = 'token__totalSupply',
  TokenTotalValueLocked = 'token__totalValueLocked',
  TokenTotalValueLockedUsd = 'token__totalValueLockedUSD',
  TokenTotalValueLockedUsdUntracked = 'token__totalValueLockedUSDUntracked',
  TokenTxCount = 'token__txCount',
  TokenUntrackedVolumeUsd = 'token__untrackedVolumeUSD',
  TokenVolume = 'token__volume',
  TokenVolumeUsd = 'token__volumeUSD',
  TotalValueLocked = 'totalValueLocked',
  TotalValueLockedUsd = 'totalValueLockedUSD',
  UntrackedVolumeUsd = 'untrackedVolumeUSD',
  Volume = 'volume',
  VolumeUsd = 'volumeUSD'
}

export type Token_Filter = {
  /** Filter for the block changed event. */
  _change_block?: Maybe<BlockChangedFilter>;
  and?: Maybe<Array<Maybe<Token_Filter>>>;
  decimals?: Maybe<Scalars['BigInt']>;
  decimals_gt?: Maybe<Scalars['BigInt']>;
  decimals_gte?: Maybe<Scalars['BigInt']>;
  decimals_in?: Maybe<Array<Scalars['BigInt']>>;
  decimals_lt?: Maybe<Scalars['BigInt']>;
  decimals_lte?: Maybe<Scalars['BigInt']>;
  decimals_not?: Maybe<Scalars['BigInt']>;
  decimals_not_in?: Maybe<Array<Scalars['BigInt']>>;
  derivedMatic?: Maybe<Scalars['BigDecimal']>;
  derivedMatic_gt?: Maybe<Scalars['BigDecimal']>;
  derivedMatic_gte?: Maybe<Scalars['BigDecimal']>;
  derivedMatic_in?: Maybe<Array<Scalars['BigDecimal']>>;
  derivedMatic_lt?: Maybe<Scalars['BigDecimal']>;
  derivedMatic_lte?: Maybe<Scalars['BigDecimal']>;
  derivedMatic_not?: Maybe<Scalars['BigDecimal']>;
  derivedMatic_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
  feesUSD?: Maybe<Scalars['BigDecimal']>;
  feesUSD_gt?: Maybe<Scalars['BigDecimal']>;
  feesUSD_gte?: Maybe<Scalars['BigDecimal']>;
  feesUSD_in?: Maybe<Array<Scalars['BigDecimal']>>;
  feesUSD_lt?: Maybe<Scalars['BigDecimal']>;
  feesUSD_lte?: Maybe<Scalars['BigDecimal']>;
  feesUSD_not?: Maybe<Scalars['BigDecimal']>;
  feesUSD_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
  id?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_lt?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
  isSeer?: Maybe<Scalars['Boolean']>;
  isSeer_in?: Maybe<Array<Scalars['Boolean']>>;
  isSeer_not?: Maybe<Scalars['Boolean']>;
  isSeer_not_in?: Maybe<Array<Scalars['Boolean']>>;
  market?: Maybe<Scalars['String']>;
  market_?: Maybe<Market_Filter>;
  market_contains?: Maybe<Scalars['String']>;
  market_contains_nocase?: Maybe<Scalars['String']>;
  market_ends_with?: Maybe<Scalars['String']>;
  market_ends_with_nocase?: Maybe<Scalars['String']>;
  market_gt?: Maybe<Scalars['String']>;
  market_gte?: Maybe<Scalars['String']>;
  market_in?: Maybe<Array<Scalars['String']>>;
  market_lt?: Maybe<Scalars['String']>;
  market_lte?: Maybe<Scalars['String']>;
  market_not?: Maybe<Scalars['String']>;
  market_not_contains?: Maybe<Scalars['String']>;
  market_not_contains_nocase?: Maybe<Scalars['String']>;
  market_not_ends_with?: Maybe<Scalars['String']>;
  market_not_ends_with_nocase?: Maybe<Scalars['String']>;
  market_not_in?: Maybe<Array<Scalars['String']>>;
  market_not_starts_with?: Maybe<Scalars['String']>;
  market_not_starts_with_nocase?: Maybe<Scalars['String']>;
  market_starts_with?: Maybe<Scalars['String']>;
  market_starts_with_nocase?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  name_contains?: Maybe<Scalars['String']>;
  name_contains_nocase?: Maybe<Scalars['String']>;
  name_ends_with?: Maybe<Scalars['String']>;
  name_ends_with_nocase?: Maybe<Scalars['String']>;
  name_gt?: Maybe<Scalars['String']>;
  name_gte?: Maybe<Scalars['String']>;
  name_in?: Maybe<Array<Scalars['String']>>;
  name_lt?: Maybe<Scalars['String']>;
  name_lte?: Maybe<Scalars['String']>;
  name_not?: Maybe<Scalars['String']>;
  name_not_contains?: Maybe<Scalars['String']>;
  name_not_contains_nocase?: Maybe<Scalars['String']>;
  name_not_ends_with?: Maybe<Scalars['String']>;
  name_not_ends_with_nocase?: Maybe<Scalars['String']>;
  name_not_in?: Maybe<Array<Scalars['String']>>;
  name_not_starts_with?: Maybe<Scalars['String']>;
  name_not_starts_with_nocase?: Maybe<Scalars['String']>;
  name_starts_with?: Maybe<Scalars['String']>;
  name_starts_with_nocase?: Maybe<Scalars['String']>;
  or?: Maybe<Array<Maybe<Token_Filter>>>;
  poolCollateral?: Maybe<Scalars['String']>;
  poolCollateral_?: Maybe<Pool_Filter>;
  poolCollateral_contains?: Maybe<Scalars['String']>;
  poolCollateral_contains_nocase?: Maybe<Scalars['String']>;
  poolCollateral_ends_with?: Maybe<Scalars['String']>;
  poolCollateral_ends_with_nocase?: Maybe<Scalars['String']>;
  poolCollateral_gt?: Maybe<Scalars['String']>;
  poolCollateral_gte?: Maybe<Scalars['String']>;
  poolCollateral_in?: Maybe<Array<Scalars['String']>>;
  poolCollateral_lt?: Maybe<Scalars['String']>;
  poolCollateral_lte?: Maybe<Scalars['String']>;
  poolCollateral_not?: Maybe<Scalars['String']>;
  poolCollateral_not_contains?: Maybe<Scalars['String']>;
  poolCollateral_not_contains_nocase?: Maybe<Scalars['String']>;
  poolCollateral_not_ends_with?: Maybe<Scalars['String']>;
  poolCollateral_not_ends_with_nocase?: Maybe<Scalars['String']>;
  poolCollateral_not_in?: Maybe<Array<Scalars['String']>>;
  poolCollateral_not_starts_with?: Maybe<Scalars['String']>;
  poolCollateral_not_starts_with_nocase?: Maybe<Scalars['String']>;
  poolCollateral_starts_with?: Maybe<Scalars['String']>;
  poolCollateral_starts_with_nocase?: Maybe<Scalars['String']>;
  poolCount?: Maybe<Scalars['BigInt']>;
  poolCount_gt?: Maybe<Scalars['BigInt']>;
  poolCount_gte?: Maybe<Scalars['BigInt']>;
  poolCount_in?: Maybe<Array<Scalars['BigInt']>>;
  poolCount_lt?: Maybe<Scalars['BigInt']>;
  poolCount_lte?: Maybe<Scalars['BigInt']>;
  poolCount_not?: Maybe<Scalars['BigInt']>;
  poolCount_not_in?: Maybe<Array<Scalars['BigInt']>>;
  pools0_?: Maybe<Pool_Filter>;
  pools1_?: Maybe<Pool_Filter>;
  symbol?: Maybe<Scalars['String']>;
  symbol_contains?: Maybe<Scalars['String']>;
  symbol_contains_nocase?: Maybe<Scalars['String']>;
  symbol_ends_with?: Maybe<Scalars['String']>;
  symbol_ends_with_nocase?: Maybe<Scalars['String']>;
  symbol_gt?: Maybe<Scalars['String']>;
  symbol_gte?: Maybe<Scalars['String']>;
  symbol_in?: Maybe<Array<Scalars['String']>>;
  symbol_lt?: Maybe<Scalars['String']>;
  symbol_lte?: Maybe<Scalars['String']>;
  symbol_not?: Maybe<Scalars['String']>;
  symbol_not_contains?: Maybe<Scalars['String']>;
  symbol_not_contains_nocase?: Maybe<Scalars['String']>;
  symbol_not_ends_with?: Maybe<Scalars['String']>;
  symbol_not_ends_with_nocase?: Maybe<Scalars['String']>;
  symbol_not_in?: Maybe<Array<Scalars['String']>>;
  symbol_not_starts_with?: Maybe<Scalars['String']>;
  symbol_not_starts_with_nocase?: Maybe<Scalars['String']>;
  symbol_starts_with?: Maybe<Scalars['String']>;
  symbol_starts_with_nocase?: Maybe<Scalars['String']>;
  tokenDayData_?: Maybe<TokenDayData_Filter>;
  totalSupply?: Maybe<Scalars['BigInt']>;
  totalSupply_gt?: Maybe<Scalars['BigInt']>;
  totalSupply_gte?: Maybe<Scalars['BigInt']>;
  totalSupply_in?: Maybe<Array<Scalars['BigInt']>>;
  totalSupply_lt?: Maybe<Scalars['BigInt']>;
  totalSupply_lte?: Maybe<Scalars['BigInt']>;
  totalSupply_not?: Maybe<Scalars['BigInt']>;
  totalSupply_not_in?: Maybe<Array<Scalars['BigInt']>>;
  totalValueLocked?: Maybe<Scalars['BigDecimal']>;
  totalValueLockedUSD?: Maybe<Scalars['BigDecimal']>;
  totalValueLockedUSDUntracked?: Maybe<Scalars['BigDecimal']>;
  totalValueLockedUSDUntracked_gt?: Maybe<Scalars['BigDecimal']>;
  totalValueLockedUSDUntracked_gte?: Maybe<Scalars['BigDecimal']>;
  totalValueLockedUSDUntracked_in?: Maybe<Array<Scalars['BigDecimal']>>;
  totalValueLockedUSDUntracked_lt?: Maybe<Scalars['BigDecimal']>;
  totalValueLockedUSDUntracked_lte?: Maybe<Scalars['BigDecimal']>;
  totalValueLockedUSDUntracked_not?: Maybe<Scalars['BigDecimal']>;
  totalValueLockedUSDUntracked_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
  totalValueLockedUSD_gt?: Maybe<Scalars['BigDecimal']>;
  totalValueLockedUSD_gte?: Maybe<Scalars['BigDecimal']>;
  totalValueLockedUSD_in?: Maybe<Array<Scalars['BigDecimal']>>;
  totalValueLockedUSD_lt?: Maybe<Scalars['BigDecimal']>;
  totalValueLockedUSD_lte?: Maybe<Scalars['BigDecimal']>;
  totalValueLockedUSD_not?: Maybe<Scalars['BigDecimal']>;
  totalValueLockedUSD_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
  totalValueLocked_gt?: Maybe<Scalars['BigDecimal']>;
  totalValueLocked_gte?: Maybe<Scalars['BigDecimal']>;
  totalValueLocked_in?: Maybe<Array<Scalars['BigDecimal']>>;
  totalValueLocked_lt?: Maybe<Scalars['BigDecimal']>;
  totalValueLocked_lte?: Maybe<Scalars['BigDecimal']>;
  totalValueLocked_not?: Maybe<Scalars['BigDecimal']>;
  totalValueLocked_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
  txCount?: Maybe<Scalars['BigInt']>;
  txCount_gt?: Maybe<Scalars['BigInt']>;
  txCount_gte?: Maybe<Scalars['BigInt']>;
  txCount_in?: Maybe<Array<Scalars['BigInt']>>;
  txCount_lt?: Maybe<Scalars['BigInt']>;
  txCount_lte?: Maybe<Scalars['BigInt']>;
  txCount_not?: Maybe<Scalars['BigInt']>;
  txCount_not_in?: Maybe<Array<Scalars['BigInt']>>;
  untrackedVolumeUSD?: Maybe<Scalars['BigDecimal']>;
  untrackedVolumeUSD_gt?: Maybe<Scalars['BigDecimal']>;
  untrackedVolumeUSD_gte?: Maybe<Scalars['BigDecimal']>;
  untrackedVolumeUSD_in?: Maybe<Array<Scalars['BigDecimal']>>;
  untrackedVolumeUSD_lt?: Maybe<Scalars['BigDecimal']>;
  untrackedVolumeUSD_lte?: Maybe<Scalars['BigDecimal']>;
  untrackedVolumeUSD_not?: Maybe<Scalars['BigDecimal']>;
  untrackedVolumeUSD_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
  volume?: Maybe<Scalars['BigDecimal']>;
  volumeUSD?: Maybe<Scalars['BigDecimal']>;
  volumeUSD_gt?: Maybe<Scalars['BigDecimal']>;
  volumeUSD_gte?: Maybe<Scalars['BigDecimal']>;
  volumeUSD_in?: Maybe<Array<Scalars['BigDecimal']>>;
  volumeUSD_lt?: Maybe<Scalars['BigDecimal']>;
  volumeUSD_lte?: Maybe<Scalars['BigDecimal']>;
  volumeUSD_not?: Maybe<Scalars['BigDecimal']>;
  volumeUSD_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
  volume_gt?: Maybe<Scalars['BigDecimal']>;
  volume_gte?: Maybe<Scalars['BigDecimal']>;
  volume_in?: Maybe<Array<Scalars['BigDecimal']>>;
  volume_lt?: Maybe<Scalars['BigDecimal']>;
  volume_lte?: Maybe<Scalars['BigDecimal']>;
  volume_not?: Maybe<Scalars['BigDecimal']>;
  volume_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
  whitelistPools?: Maybe<Array<Scalars['String']>>;
  whitelistPools_?: Maybe<Pool_Filter>;
  whitelistPools_contains?: Maybe<Array<Scalars['String']>>;
  whitelistPools_contains_nocase?: Maybe<Array<Scalars['String']>>;
  whitelistPools_not?: Maybe<Array<Scalars['String']>>;
  whitelistPools_not_contains?: Maybe<Array<Scalars['String']>>;
  whitelistPools_not_contains_nocase?: Maybe<Array<Scalars['String']>>;
};

export enum Token_OrderBy {
  Decimals = 'decimals',
  DerivedMatic = 'derivedMatic',
  FeesUsd = 'feesUSD',
  Id = 'id',
  IsSeer = 'isSeer',
  Market = 'market',
  MarketBlockNumber = 'market__blockNumber',
  MarketBlockTimestamp = 'market__blockTimestamp',
  MarketConditionId = 'market__conditionId',
  MarketCreator = 'market__creator',
  MarketFactory = 'market__factory',
  MarketFinalizeTs = 'market__finalizeTs',
  MarketHasAnswers = 'market__hasAnswers',
  MarketId = 'market__id',
  MarketIndex = 'market__index',
  MarketLowerBound = 'market__lowerBound',
  MarketMarketName = 'market__marketName',
  MarketOpeningTs = 'market__openingTs',
  MarketOutcomesSupply = 'market__outcomesSupply',
  MarketParentCollectionId = 'market__parentCollectionId',
  MarketParentOutcome = 'market__parentOutcome',
  MarketPayoutReported = 'market__payoutReported',
  MarketQuestionId = 'market__questionId',
  MarketQuestionsInArbitration = 'market__questionsInArbitration',
  MarketTemplateId = 'market__templateId',
  MarketTotalValueLockedUsd = 'market__totalValueLockedUSD',
  MarketTotalValueLockedUsdUntracked = 'market__totalValueLockedUSDUntracked',
  MarketTransactionHash = 'market__transactionHash',
  MarketType = 'market__type',
  MarketUntrackedVolumeUsd = 'market__untrackedVolumeUSD',
  MarketUpperBound = 'market__upperBound',
  MarketVolume = 'market__volume',
  MarketVolumeUsd = 'market__volumeUSD',
  Name = 'name',
  PoolCollateral = 'poolCollateral',
  PoolCollateralCollectedFeesToken0 = 'poolCollateral__collectedFeesToken0',
  PoolCollateralCollectedFeesToken1 = 'poolCollateral__collectedFeesToken1',
  PoolCollateralCollectedFeesUsd = 'poolCollateral__collectedFeesUSD',
  PoolCollateralCommunityFee0 = 'poolCollateral__communityFee0',
  PoolCollateralCommunityFee1 = 'poolCollateral__communityFee1',
  PoolCollateralCreatedAtBlockNumber = 'poolCollateral__createdAtBlockNumber',
  PoolCollateralCreatedAtTimestamp = 'poolCollateral__createdAtTimestamp',
  PoolCollateralFee = 'poolCollateral__fee',
  PoolCollateralFeeGrowthGlobal0X128 = 'poolCollateral__feeGrowthGlobal0X128',
  PoolCollateralFeeGrowthGlobal1X128 = 'poolCollateral__feeGrowthGlobal1X128',
  PoolCollateralFeesToken0 = 'poolCollateral__feesToken0',
  PoolCollateralFeesToken1 = 'poolCollateral__feesToken1',
  PoolCollateralFeesUsd = 'poolCollateral__feesUSD',
  PoolCollateralId = 'poolCollateral__id',
  PoolCollateralLiquidity = 'poolCollateral__liquidity',
  PoolCollateralLiquidityProviderCount = 'poolCollateral__liquidityProviderCount',
  PoolCollateralObservationIndex = 'poolCollateral__observationIndex',
  PoolCollateralSqrtPrice = 'poolCollateral__sqrtPrice',
  PoolCollateralTick = 'poolCollateral__tick',
  PoolCollateralTickSpacing = 'poolCollateral__tickSpacing',
  PoolCollateralToken0Price = 'poolCollateral__token0Price',
  PoolCollateralToken1Price = 'poolCollateral__token1Price',
  PoolCollateralTotalValueLockedMatic = 'poolCollateral__totalValueLockedMatic',
  PoolCollateralTotalValueLockedToken0 = 'poolCollateral__totalValueLockedToken0',
  PoolCollateralTotalValueLockedToken1 = 'poolCollateral__totalValueLockedToken1',
  PoolCollateralTotalValueLockedUsd = 'poolCollateral__totalValueLockedUSD',
  PoolCollateralTotalValueLockedUsdUntracked = 'poolCollateral__totalValueLockedUSDUntracked',
  PoolCollateralTxCount = 'poolCollateral__txCount',
  PoolCollateralUntrackedFeesUsd = 'poolCollateral__untrackedFeesUSD',
  PoolCollateralUntrackedVolumeUsd = 'poolCollateral__untrackedVolumeUSD',
  PoolCollateralVolumeToken0 = 'poolCollateral__volumeToken0',
  PoolCollateralVolumeToken1 = 'poolCollateral__volumeToken1',
  PoolCollateralVolumeUsd = 'poolCollateral__volumeUSD',
  PoolCount = 'poolCount',
  Pools0 = 'pools0',
  Pools1 = 'pools1',
  Symbol = 'symbol',
  TokenDayData = 'tokenDayData',
  TotalSupply = 'totalSupply',
  TotalValueLocked = 'totalValueLocked',
  TotalValueLockedUsd = 'totalValueLockedUSD',
  TotalValueLockedUsdUntracked = 'totalValueLockedUSDUntracked',
  TxCount = 'txCount',
  UntrackedVolumeUsd = 'untrackedVolumeUSD',
  Volume = 'volume',
  VolumeUsd = 'volumeUSD',
  WhitelistPools = 'whitelistPools'
}

export type Transaction = {
  __typename?: 'Transaction';
  blockNumber: Scalars['BigInt'];
  burns: Array<Burn>;
  collects: Array<Collect>;
  flashed: Array<Flash>;
  gasLimit: Scalars['BigInt'];
  gasPrice: Scalars['BigInt'];
  id: Scalars['ID'];
  mints: Array<Mint>;
  swaps: Array<Swap>;
  timestamp: Scalars['BigInt'];
};


export type TransactionBurnsArgs = {
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Burn_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  skip?: Maybe<Scalars['Int']>;
  where?: Maybe<Burn_Filter>;
};


export type TransactionCollectsArgs = {
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Collect_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  skip?: Maybe<Scalars['Int']>;
  where?: Maybe<Collect_Filter>;
};


export type TransactionFlashedArgs = {
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Flash_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  skip?: Maybe<Scalars['Int']>;
  where?: Maybe<Flash_Filter>;
};


export type TransactionMintsArgs = {
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Mint_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  skip?: Maybe<Scalars['Int']>;
  where?: Maybe<Mint_Filter>;
};


export type TransactionSwapsArgs = {
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Swap_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  skip?: Maybe<Scalars['Int']>;
  where?: Maybe<Swap_Filter>;
};

export type Transaction_Filter = {
  /** Filter for the block changed event. */
  _change_block?: Maybe<BlockChangedFilter>;
  and?: Maybe<Array<Maybe<Transaction_Filter>>>;
  blockNumber?: Maybe<Scalars['BigInt']>;
  blockNumber_gt?: Maybe<Scalars['BigInt']>;
  blockNumber_gte?: Maybe<Scalars['BigInt']>;
  blockNumber_in?: Maybe<Array<Scalars['BigInt']>>;
  blockNumber_lt?: Maybe<Scalars['BigInt']>;
  blockNumber_lte?: Maybe<Scalars['BigInt']>;
  blockNumber_not?: Maybe<Scalars['BigInt']>;
  blockNumber_not_in?: Maybe<Array<Scalars['BigInt']>>;
  burns_?: Maybe<Burn_Filter>;
  collects_?: Maybe<Collect_Filter>;
  flashed_?: Maybe<Flash_Filter>;
  gasLimit?: Maybe<Scalars['BigInt']>;
  gasLimit_gt?: Maybe<Scalars['BigInt']>;
  gasLimit_gte?: Maybe<Scalars['BigInt']>;
  gasLimit_in?: Maybe<Array<Scalars['BigInt']>>;
  gasLimit_lt?: Maybe<Scalars['BigInt']>;
  gasLimit_lte?: Maybe<Scalars['BigInt']>;
  gasLimit_not?: Maybe<Scalars['BigInt']>;
  gasLimit_not_in?: Maybe<Array<Scalars['BigInt']>>;
  gasPrice?: Maybe<Scalars['BigInt']>;
  gasPrice_gt?: Maybe<Scalars['BigInt']>;
  gasPrice_gte?: Maybe<Scalars['BigInt']>;
  gasPrice_in?: Maybe<Array<Scalars['BigInt']>>;
  gasPrice_lt?: Maybe<Scalars['BigInt']>;
  gasPrice_lte?: Maybe<Scalars['BigInt']>;
  gasPrice_not?: Maybe<Scalars['BigInt']>;
  gasPrice_not_in?: Maybe<Array<Scalars['BigInt']>>;
  id?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_lt?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
  mints_?: Maybe<Mint_Filter>;
  or?: Maybe<Array<Maybe<Transaction_Filter>>>;
  swaps_?: Maybe<Swap_Filter>;
  timestamp?: Maybe<Scalars['BigInt']>;
  timestamp_gt?: Maybe<Scalars['BigInt']>;
  timestamp_gte?: Maybe<Scalars['BigInt']>;
  timestamp_in?: Maybe<Array<Scalars['BigInt']>>;
  timestamp_lt?: Maybe<Scalars['BigInt']>;
  timestamp_lte?: Maybe<Scalars['BigInt']>;
  timestamp_not?: Maybe<Scalars['BigInt']>;
  timestamp_not_in?: Maybe<Array<Scalars['BigInt']>>;
};

export enum Transaction_OrderBy {
  BlockNumber = 'blockNumber',
  Burns = 'burns',
  Collects = 'collects',
  Flashed = 'flashed',
  GasLimit = 'gasLimit',
  GasPrice = 'gasPrice',
  Id = 'id',
  Mints = 'mints',
  Swaps = 'swaps',
  Timestamp = 'timestamp'
}

export type _Block_ = {
  __typename?: '_Block_';
  /** The hash of the block */
  hash?: Maybe<Scalars['Bytes']>;
  /** The block number */
  number: Scalars['Int'];
  /** The hash of the parent block */
  parentHash?: Maybe<Scalars['Bytes']>;
  /** Integer representation of the timestamp stored in blocks for the chain */
  timestamp?: Maybe<Scalars['Int']>;
};

/** The type for the top-level _meta field */
export type _Meta_ = {
  __typename?: '_Meta_';
  /**
   * Information about a specific subgraph block. The hash of the block
   * will be null if the _meta field has a block constraint that asks for
   * a block number. It will be filled if the _meta field has no block constraint
   * and therefore asks for the latest  block
   */
  block: _Block_;
  /** The deployment ID */
  deployment: Scalars['String'];
  /** If `true`, the subgraph encountered indexing errors at some past block */
  hasIndexingErrors: Scalars['Boolean'];
};

export enum _SubgraphErrorPolicy_ {
  /** Data will be returned even if the subgraph has indexing errors */
  Allow = 'allow',
  /** If the subgraph has indexing errors, data will be omitted. The default. */
  Deny = 'deny'
}

export type AllV3TicksQueryVariables = Exact<{
  poolAddress: Scalars['String'];
  skip: Scalars['Int'];
}>;


export type AllV3TicksQuery = (
  { __typename?: 'Query' }
  & { ticks: Array<(
    { __typename?: 'Tick' }
    & Pick<Tick, 'tickIdx' | 'liquidityNet' | 'price0' | 'price1'>
  )> }
);

export type FeeTierDistributionQueryVariables = Exact<{
  token0: Scalars['String'];
  token1: Scalars['String'];
}>;


export type FeeTierDistributionQuery = (
  { __typename?: 'Query' }
  & { _meta?: Maybe<(
    { __typename?: '_Meta_' }
    & { block: (
      { __typename?: '_Block_' }
      & Pick<_Block_, 'number'>
    ) }
  )>, asToken0: Array<(
    { __typename?: 'Pool' }
    & Pick<Pool, 'fee' | 'totalValueLockedToken0' | 'totalValueLockedToken1'>
  )>, asToken1: Array<(
    { __typename?: 'Pool' }
    & Pick<Pool, 'fee' | 'totalValueLockedToken0' | 'totalValueLockedToken1'>
  )> }
);

export type LimitFarmQueryVariables = Exact<{
  time?: Maybe<Scalars['BigInt']>;
}>;


export type LimitFarmQuery = (
  { __typename?: 'Query' }
  & { limitFarmings: Array<(
    { __typename?: 'LimitFarming' }
    & Pick<LimitFarming, 'startTime' | 'endTime'>
  )> }
);

export type EternalFarmQueryVariables = Exact<{ [key: string]: never; }>;


export type EternalFarmQuery = (
  { __typename?: 'Query' }
  & { eternalFarmings: Array<(
    { __typename?: 'EternalFarming' }
    & Pick<EternalFarming, 'startTime' | 'endTime'>
  )> }
);

export type FetchRewardsQueryVariables = Exact<{
  account?: Maybe<Scalars['Bytes']>;
}>;


export type FetchRewardsQuery = (
  { __typename?: 'Query' }
  & { rewards: Array<(
    { __typename?: 'Reward' }
    & Pick<Reward, 'id' | 'rewardAddress' | 'amount' | 'owner'>
  )> }
);

export type FetchTokenQueryVariables = Exact<{
  tokenId: Scalars['ID'];
}>;


export type FetchTokenQuery = (
  { __typename?: 'Query' }
  & { tokens: Array<(
    { __typename?: 'Token' }
    & Pick<Token, 'id' | 'symbol' | 'name' | 'decimals'>
  )> }
);

export type FetchLimitQueryVariables = Exact<{
  limitFarmingId: Scalars['ID'];
}>;


export type FetchLimitQuery = (
  { __typename?: 'Query' }
  & { limitFarmings: Array<(
    { __typename?: 'LimitFarming' }
    & Pick<LimitFarming, 'id' | 'rewardToken' | 'bonusRewardToken' | 'pool' | 'startTime' | 'endTime' | 'reward' | 'bonusReward' | 'multiplierToken' | 'createdAtTimestamp' | 'tier1Multiplier' | 'tier2Multiplier' | 'tier3Multiplier' | 'tokenAmountForTier1' | 'tokenAmountForTier2' | 'tokenAmountForTier3' | 'enterStartTime' | 'isDetached'>
  )> }
);

export type EternalFarmingsQueryVariables = Exact<{
  farmId: Scalars['ID'];
}>;


export type EternalFarmingsQuery = (
  { __typename?: 'Query' }
  & { eternalFarmings: Array<(
    { __typename?: 'EternalFarming' }
    & Pick<EternalFarming, 'id' | 'isDetached' | 'rewardToken' | 'bonusRewardToken' | 'rewardRate' | 'bonusRewardRate' | 'startTime' | 'endTime' | 'virtualPool' | 'multiplierToken' | 'tokenAmountForTier1' | 'tokenAmountForTier2' | 'tokenAmountForTier3' | 'tier1Multiplier' | 'tier2Multiplier' | 'tier3Multiplier'>
    & { pool: (
      { __typename?: 'Pool' }
      & Pick<Pool, 'id'>
    ) }
  )> }
);

export type EternalFarmingsFromPoolsQueryVariables = Exact<{
  pools: Array<Scalars['String']> | Scalars['String'];
  currentTime: Scalars['BigInt'];
}>;


export type EternalFarmingsFromPoolsQuery = (
  { __typename?: 'Query' }
  & { eternalFarmings: Array<(
    { __typename?: 'EternalFarming' }
    & Pick<EternalFarming, 'id' | 'rewardToken' | 'bonusRewardToken' | 'startTime' | 'endTime' | 'reward' | 'bonusReward' | 'rewardRate' | 'bonusRewardRate' | 'isDetached'>
    & { pool: (
      { __typename?: 'Pool' }
      & Pick<Pool, 'id'>
      & { market0?: Maybe<(
        { __typename?: 'Market' }
        & Pick<Market, 'id' | 'marketName' | 'wrappedTokensString'>
        & { image: Array<(
          { __typename?: 'Image' }
          & Pick<Image, 'id' | 'cidMarket' | 'cidOutcomes'>
        )>, tokens: Array<(
          { __typename?: 'Token' }
          & Pick<Token, 'id' | 'name'>
        )> }
      )>, market1?: Maybe<(
        { __typename?: 'Market' }
        & Pick<Market, 'id' | 'marketName' | 'wrappedTokensString'>
        & { image: Array<(
          { __typename?: 'Image' }
          & Pick<Image, 'id' | 'cidMarket' | 'cidOutcomes'>
        )>, tokens: Array<(
          { __typename?: 'Token' }
          & Pick<Token, 'id' | 'name'>
        )> }
      )> }
    ) }
  )> }
);

export type LimitFarmingsFromPoolsQueryVariables = Exact<{
  pools: Array<Scalars['Bytes']> | Scalars['Bytes'];
  currentTime: Scalars['BigInt'];
}>;


export type LimitFarmingsFromPoolsQuery = (
  { __typename?: 'Query' }
  & { limitFarmings: Array<(
    { __typename?: 'LimitFarming' }
    & Pick<LimitFarming, 'id' | 'createdAtTimestamp' | 'rewardToken' | 'bonusReward' | 'bonusRewardToken' | 'pool' | 'startTime' | 'endTime' | 'reward' | 'multiplierToken' | 'tokenAmountForTier1' | 'tokenAmountForTier2' | 'tokenAmountForTier3' | 'tier1Multiplier' | 'tier2Multiplier' | 'tier3Multiplier' | 'enterStartTime' | 'isDetached'>
  )> }
);

export type FetchPoolQueryVariables = Exact<{
  poolId: Scalars['ID'];
}>;


export type FetchPoolQuery = (
  { __typename?: 'Query' }
  & { pools: Array<(
    { __typename?: 'Pool' }
    & Pick<Pool, 'id' | 'fee' | 'sqrtPrice' | 'liquidity' | 'tick' | 'feesUSD' | 'untrackedFeesUSD'>
    & { token0: (
      { __typename?: 'Token' }
      & Pick<Token, 'id' | 'decimals' | 'symbol'>
    ), token1: (
      { __typename?: 'Token' }
      & Pick<Token, 'id' | 'decimals' | 'symbol'>
    ), market0?: Maybe<(
      { __typename?: 'Market' }
      & Pick<Market, 'id' | 'marketName' | 'wrappedTokensString'>
      & { image: Array<(
        { __typename?: 'Image' }
        & Pick<Image, 'id' | 'cidMarket' | 'cidOutcomes'>
      )>, tokens: Array<(
        { __typename?: 'Token' }
        & Pick<Token, 'id' | 'name'>
      )> }
    )>, market1?: Maybe<(
      { __typename?: 'Market' }
      & Pick<Market, 'id' | 'marketName' | 'wrappedTokensString'>
      & { image: Array<(
        { __typename?: 'Image' }
        & Pick<Image, 'id' | 'cidMarket' | 'cidOutcomes'>
      )>, tokens: Array<(
        { __typename?: 'Token' }
        & Pick<Token, 'id' | 'name'>
      )> }
    )> }
  )> }
);

export type FetchPoolsByIdsQueryVariables = Exact<{
  poolIds: Array<Scalars['ID']> | Scalars['ID'];
}>;


export type FetchPoolsByIdsQuery = (
  { __typename?: 'Query' }
  & { pools: Array<(
    { __typename?: 'Pool' }
    & Pick<Pool, 'id' | 'fee' | 'sqrtPrice' | 'liquidity' | 'tick' | 'feesUSD' | 'untrackedFeesUSD' | 'totalValueLockedUSD'>
    & { token0: (
      { __typename?: 'Token' }
      & Pick<Token, 'id' | 'decimals' | 'symbol'>
    ), token1: (
      { __typename?: 'Token' }
      & Pick<Token, 'id' | 'decimals' | 'symbol'>
    ), market0?: Maybe<(
      { __typename?: 'Market' }
      & Pick<Market, 'id' | 'marketName' | 'wrappedTokensString'>
      & { image: Array<(
        { __typename?: 'Image' }
        & Pick<Image, 'id' | 'cidMarket' | 'cidOutcomes'>
      )>, tokens: Array<(
        { __typename?: 'Token' }
        & Pick<Token, 'id' | 'name'>
      )> }
    )>, market1?: Maybe<(
      { __typename?: 'Market' }
      & Pick<Market, 'id' | 'marketName' | 'wrappedTokensString'>
      & { image: Array<(
        { __typename?: 'Image' }
        & Pick<Image, 'id' | 'cidMarket' | 'cidOutcomes'>
      )>, tokens: Array<(
        { __typename?: 'Token' }
        & Pick<Token, 'id' | 'name'>
      )> }
    )> }
  )> }
);

export type FetchTokensByIdsQueryVariables = Exact<{
  tokenIds: Array<Scalars['ID']> | Scalars['ID'];
}>;


export type FetchTokensByIdsQuery = (
  { __typename?: 'Query' }
  & { tokens: Array<(
    { __typename?: 'Token' }
    & Pick<Token, 'id' | 'symbol' | 'name' | 'decimals' | 'derivedMatic'>
  )> }
);

export type FeeHourDataQueryVariables = Exact<{
  pool: Scalars['String'];
  startTimestamp: Scalars['BigInt'];
  endTimestamp: Scalars['BigInt'];
}>;


export type FeeHourDataQuery = (
  { __typename?: 'Query' }
  & { feeHourDatas: Array<(
    { __typename?: 'FeeHourData' }
    & Pick<FeeHourData, 'id' | 'pool' | 'fee' | 'changesCount' | 'timestamp' | 'minFee' | 'maxFee' | 'startFee' | 'endFee'>
  )> }
);

export type LastFeeHourDataQueryVariables = Exact<{
  pool: Scalars['String'];
}>;


export type LastFeeHourDataQuery = (
  { __typename?: 'Query' }
  & { feeHourDatas: Array<(
    { __typename?: 'FeeHourData' }
    & Pick<FeeHourData, 'id' | 'pool' | 'fee' | 'changesCount' | 'timestamp' | 'minFee' | 'maxFee' | 'startFee' | 'endFee'>
  )> }
);

export type LastNotEmptyHourDataQueryVariables = Exact<{
  pool: Scalars['String'];
  timestamp: Scalars['BigInt'];
}>;


export type LastNotEmptyHourDataQuery = (
  { __typename?: 'Query' }
  & { feeHourDatas: Array<(
    { __typename?: 'FeeHourData' }
    & Pick<FeeHourData, 'id' | 'pool' | 'fee' | 'changesCount' | 'timestamp' | 'minFee' | 'maxFee' | 'startFee' | 'endFee'>
  )> }
);

export type LastNotEmptyPoolHourDataQueryVariables = Exact<{
  pool: Scalars['ID'];
  timestamp: Scalars['Int'];
}>;


export type LastNotEmptyPoolHourDataQuery = (
  { __typename?: 'Query' }
  & { poolHourDatas: Array<(
    { __typename?: 'PoolHourData' }
    & Pick<PoolHourData, 'periodStartUnix' | 'volumeUSD' | 'tvlUSD' | 'feesUSD' | 'untrackedVolumeUSD' | 'token1Price' | 'token0Price'>
  )> }
);

export type LastPoolHourDataQueryVariables = Exact<{
  pool: Scalars['ID'];
}>;


export type LastPoolHourDataQuery = (
  { __typename?: 'Query' }
  & { poolHourDatas: Array<(
    { __typename?: 'PoolHourData' }
    & Pick<PoolHourData, 'periodStartUnix' | 'volumeUSD' | 'tvlUSD' | 'feesUSD' | 'untrackedVolumeUSD'>
  )> }
);

export type PoolHourDataQueryVariables = Exact<{
  pool: Scalars['ID'];
  startTimestamp: Scalars['Int'];
  endTimestamp: Scalars['Int'];
}>;


export type PoolHourDataQuery = (
  { __typename?: 'Query' }
  & { poolHourDatas: Array<(
    { __typename?: 'PoolHourData' }
    & Pick<PoolHourData, 'periodStartUnix' | 'volumeUSD' | 'tvlUSD' | 'feesUSD' | 'untrackedVolumeUSD' | 'token0Price' | 'token1Price'>
  )> }
);

export type LastEventQueryVariables = Exact<{ [key: string]: never; }>;


export type LastEventQuery = (
  { __typename?: 'Query' }
  & { limitFarmings: Array<(
    { __typename?: 'LimitFarming' }
    & Pick<LimitFarming, 'createdAtTimestamp' | 'id' | 'startTime' | 'endTime'>
  )> }
);

export type FutureEventsQueryVariables = Exact<{
  timestamp: Scalars['BigInt'];
}>;


export type FutureEventsQuery = (
  { __typename?: 'Query' }
  & { limitFarmings: Array<(
    { __typename?: 'LimitFarming' }
    & Pick<LimitFarming, 'id' | 'createdAtTimestamp' | 'rewardToken' | 'bonusReward' | 'bonusRewardToken' | 'pool' | 'startTime' | 'endTime' | 'reward' | 'tier1Multiplier' | 'tier2Multiplier' | 'tier3Multiplier' | 'tokenAmountForTier1' | 'tokenAmountForTier2' | 'tokenAmountForTier3' | 'multiplierToken' | 'enterStartTime' | 'isDetached'>
  )> }
);

export type CurrentEventsQueryVariables = Exact<{
  startTime: Scalars['BigInt'];
  endTime: Scalars['BigInt'];
}>;


export type CurrentEventsQuery = (
  { __typename?: 'Query' }
  & { limitFarmings: Array<(
    { __typename?: 'LimitFarming' }
    & Pick<LimitFarming, 'id' | 'rewardToken' | 'bonusReward' | 'bonusRewardToken' | 'pool' | 'startTime' | 'endTime' | 'reward' | 'tier1Multiplier' | 'tier2Multiplier' | 'tier3Multiplier' | 'tokenAmountForTier1' | 'tokenAmountForTier2' | 'tokenAmountForTier3' | 'enterStartTime' | 'multiplierToken' | 'isDetached'>
  )> }
);

export type TransferedPositionsQueryVariables = Exact<{
  account?: Maybe<Scalars['Bytes']>;
}>;


export type TransferedPositionsQuery = (
  { __typename?: 'Query' }
  & { deposits: Array<(
    { __typename?: 'Deposit' }
    & Pick<Deposit, 'id' | 'owner' | 'L2tokenId' | 'onFarmingCenter'>
    & { pool: (
      { __typename?: 'Pool' }
      & Pick<Pool, 'id' | 'totalValueLockedUSD'>
      & { token0: (
        { __typename?: 'Token' }
        & Pick<Token, 'id' | 'symbol' | 'decimals'>
      ), token1: (
        { __typename?: 'Token' }
        & Pick<Token, 'id' | 'symbol' | 'decimals'>
      ), market0?: Maybe<(
        { __typename?: 'Market' }
        & Pick<Market, 'id' | 'marketName' | 'wrappedTokensString' | 'totalValueLockedUSD'>
        & { image: Array<(
          { __typename?: 'Image' }
          & Pick<Image, 'id' | 'cidMarket' | 'cidOutcomes'>
        )>, tokens: Array<(
          { __typename?: 'Token' }
          & Pick<Token, 'id' | 'name'>
        )> }
      )>, market1?: Maybe<(
        { __typename?: 'Market' }
        & Pick<Market, 'id' | 'marketName' | 'wrappedTokensString' | 'totalValueLockedUSD'>
        & { image: Array<(
          { __typename?: 'Image' }
          & Pick<Image, 'id' | 'cidMarket' | 'cidOutcomes'>
        )>, tokens: Array<(
          { __typename?: 'Token' }
          & Pick<Token, 'id' | 'name'>
        )> }
      )> }
    ), limitFarming?: Maybe<(
      { __typename?: 'LimitFarming' }
      & Pick<LimitFarming, 'id'>
    )>, eternalFarming?: Maybe<(
      { __typename?: 'EternalFarming' }
      & Pick<EternalFarming, 'id'>
    )> }
  )> }
);

export type HasTransferedPositionsQueryVariables = Exact<{
  account: Scalars['Bytes'];
}>;


export type HasTransferedPositionsQuery = (
  { __typename?: 'Query' }
  & { deposits: Array<(
    { __typename?: 'Deposit' }
    & Pick<Deposit, 'id'>
  )> }
);

export type PositionsOnEternalFarmingQueryVariables = Exact<{
  account: Scalars['Bytes'];
}>;


export type PositionsOnEternalFarmingQuery = (
  { __typename?: 'Query' }
  & { deposits: Array<(
    { __typename?: 'Deposit' }
    & Pick<Deposit, 'id' | 'owner' | 'L2tokenId' | 'onFarmingCenter' | 'enteredInEternalFarming'>
    & { pool: (
      { __typename?: 'Pool' }
      & Pick<Pool, 'id' | 'totalValueLockedUSD'>
      & { token0: (
        { __typename?: 'Token' }
        & Pick<Token, 'id' | 'symbol' | 'decimals'>
      ), token1: (
        { __typename?: 'Token' }
        & Pick<Token, 'id' | 'symbol' | 'decimals'>
      ), market0?: Maybe<(
        { __typename?: 'Market' }
        & Pick<Market, 'id' | 'marketName' | 'wrappedTokensString' | 'totalValueLockedUSD'>
        & { image: Array<(
          { __typename?: 'Image' }
          & Pick<Image, 'id' | 'cidMarket' | 'cidOutcomes'>
        )>, tokens: Array<(
          { __typename?: 'Token' }
          & Pick<Token, 'id' | 'name'>
        )> }
      )>, market1?: Maybe<(
        { __typename?: 'Market' }
        & Pick<Market, 'id' | 'marketName' | 'wrappedTokensString' | 'totalValueLockedUSD'>
        & { image: Array<(
          { __typename?: 'Image' }
          & Pick<Image, 'id' | 'cidMarket' | 'cidOutcomes'>
        )>, tokens: Array<(
          { __typename?: 'Token' }
          & Pick<Token, 'id' | 'name'>
        )> }
      )> }
    ), eternalFarming?: Maybe<(
      { __typename?: 'EternalFarming' }
      & Pick<EternalFarming, 'id'>
    )> }
  )> }
);

export type TransferedPositionsForPoolQueryVariables = Exact<{
  account: Scalars['Bytes'];
  pool: Scalars['ID'];
}>;


export type TransferedPositionsForPoolQuery = (
  { __typename?: 'Query' }
  & { deposits: Array<(
    { __typename?: 'Deposit' }
    & Pick<Deposit, 'id' | 'owner' | 'L2tokenId' | 'onFarmingCenter' | 'enteredInEternalFarming' | 'tokensLockedLimit' | 'tokensLockedEternal' | 'tierLimit' | 'tierEternal'>
    & { pool: (
      { __typename?: 'Pool' }
      & Pick<Pool, 'id' | 'totalValueLockedUSD'>
      & { token0: (
        { __typename?: 'Token' }
        & Pick<Token, 'id' | 'symbol' | 'decimals'>
      ), token1: (
        { __typename?: 'Token' }
        & Pick<Token, 'id' | 'symbol' | 'decimals'>
      ), market0?: Maybe<(
        { __typename?: 'Market' }
        & Pick<Market, 'id' | 'marketName' | 'wrappedTokensString' | 'totalValueLockedUSD'>
        & { image: Array<(
          { __typename?: 'Image' }
          & Pick<Image, 'id' | 'cidMarket' | 'cidOutcomes'>
        )>, tokens: Array<(
          { __typename?: 'Token' }
          & Pick<Token, 'id' | 'name'>
        )> }
      )>, market1?: Maybe<(
        { __typename?: 'Market' }
        & Pick<Market, 'id' | 'marketName' | 'wrappedTokensString' | 'totalValueLockedUSD'>
        & { image: Array<(
          { __typename?: 'Image' }
          & Pick<Image, 'id' | 'cidMarket' | 'cidOutcomes'>
        )>, tokens: Array<(
          { __typename?: 'Token' }
          & Pick<Token, 'id' | 'name'>
        )> }
      )> }
    ), limitFarming?: Maybe<(
      { __typename?: 'LimitFarming' }
      & Pick<LimitFarming, 'id'>
    )>, eternalFarming?: Maybe<(
      { __typename?: 'EternalFarming' }
      & Pick<EternalFarming, 'id'>
    )> }
  )> }
);

export type PositionsOnFarmingQueryVariables = Exact<{
  account: Scalars['Bytes'];
  pool: Scalars['ID'];
}>;


export type PositionsOnFarmingQuery = (
  { __typename?: 'Query' }
  & { deposits: Array<(
    { __typename?: 'Deposit' }
    & Pick<Deposit, 'id'>
  )> }
);

export type FullPositionsPriceRangeQueryVariables = Exact<{
  account?: Maybe<Scalars['Bytes']>;
  pool: Scalars['String'];
  positions: Array<Scalars['ID']> | Scalars['ID'];
}>;


export type FullPositionsPriceRangeQuery = (
  { __typename?: 'Query' }
  & { q1: Array<(
    { __typename?: 'Position' }
    & Pick<Position, 'owner' | 'liquidity' | 'id'>
    & { transaction: (
      { __typename?: 'Transaction' }
      & Pick<Transaction, 'timestamp'>
    ), tickLower: (
      { __typename?: 'Tick' }
      & Pick<Tick, 'price0' | 'price1'>
    ), tickUpper: (
      { __typename?: 'Tick' }
      & Pick<Tick, 'price0' | 'price1'>
    ), token0: (
      { __typename?: 'Token' }
      & Pick<Token, 'decimals'>
    ), token1: (
      { __typename?: 'Token' }
      & Pick<Token, 'decimals'>
    ) }
  )>, q2: Array<(
    { __typename?: 'Position' }
    & Pick<Position, 'owner' | 'liquidity' | 'id'>
    & { transaction: (
      { __typename?: 'Transaction' }
      & Pick<Transaction, 'timestamp'>
    ), tickLower: (
      { __typename?: 'Tick' }
      & Pick<Tick, 'price0' | 'price1'>
    ), tickUpper: (
      { __typename?: 'Tick' }
      & Pick<Tick, 'price0' | 'price1'>
    ), token0: (
      { __typename?: 'Token' }
      & Pick<Token, 'decimals'>
    ), token1: (
      { __typename?: 'Token' }
      & Pick<Token, 'decimals'>
    ) }
  )> }
);

export type InfiniteFarmsQueryVariables = Exact<{
  endTime: Scalars['BigInt'];
}>;


export type InfiniteFarmsQuery = (
  { __typename?: 'Query' }
  & { eternalFarmings: Array<(
    { __typename?: 'EternalFarming' }
    & Pick<EternalFarming, 'id' | 'rewardToken' | 'bonusRewardToken' | 'startTime' | 'endTime' | 'reward' | 'bonusReward' | 'rewardRate' | 'bonusRewardRate' | 'tokenAmountForTier1' | 'tokenAmountForTier2' | 'tokenAmountForTier3' | 'tier1Multiplier' | 'tier2Multiplier' | 'tier3Multiplier' | 'multiplierToken'>
    & { pool: (
      { __typename?: 'Pool' }
      & Pick<Pool, 'id'>
      & { market0?: Maybe<(
        { __typename?: 'Market' }
        & Pick<Market, 'id' | 'marketName' | 'totalValueLockedUSD' | 'wrappedTokensString'>
        & { image: Array<(
          { __typename?: 'Image' }
          & Pick<Image, 'id' | 'cidMarket' | 'cidOutcomes'>
        )>, tokens: Array<(
          { __typename?: 'Token' }
          & Pick<Token, 'id' | 'name'>
        )> }
      )>, market1?: Maybe<(
        { __typename?: 'Market' }
        & Pick<Market, 'id' | 'marketName' | 'totalValueLockedUSD' | 'wrappedTokensString'>
        & { image: Array<(
          { __typename?: 'Image' }
          & Pick<Image, 'id' | 'cidMarket' | 'cidOutcomes'>
        )>, tokens: Array<(
          { __typename?: 'Token' }
          & Pick<Token, 'id' | 'name'>
        )> }
      )> }
    ) }
  )> }
);

export type TopPoolsQueryVariables = Exact<{ [key: string]: never; }>;


export type TopPoolsQuery = (
  { __typename?: 'Query' }
  & { pools: Array<(
    { __typename?: 'Pool' }
    & Pick<Pool, 'id'>
  )> }
);

export type GetPoolsFromAddressesHistoricalQueryVariables = Exact<{
  pools: Array<Scalars['ID']> | Scalars['ID'];
  blockNumber: Scalars['Int'];
}>;


export type GetPoolsFromAddressesHistoricalQuery = (
  { __typename?: 'Query' }
  & { pools: Array<(
    { __typename?: 'Pool' }
    & Pick<Pool, 'id' | 'fee' | 'liquidity' | 'sqrtPrice' | 'tick' | 'token0Price' | 'token1Price' | 'volumeUSD' | 'txCount' | 'totalValueLockedToken0' | 'totalValueLockedToken1' | 'totalValueLockedUSD' | 'totalValueLockedUSDUntracked' | 'untrackedVolumeUSD' | 'feesUSD'>
    & { token0: (
      { __typename?: 'Token' }
      & Pick<Token, 'id' | 'symbol' | 'name' | 'decimals' | 'derivedMatic'>
    ), token1: (
      { __typename?: 'Token' }
      & Pick<Token, 'id' | 'symbol' | 'name' | 'decimals' | 'derivedMatic'>
    ) }
  )> }
);

export type GetPoolsFromAddressesLatestQueryVariables = Exact<{
  pools: Array<Scalars['ID']> | Scalars['ID'];
}>;


export type GetPoolsFromAddressesLatestQuery = (
  { __typename?: 'Query' }
  & { pools: Array<(
    { __typename?: 'Pool' }
    & Pick<Pool, 'id' | 'fee' | 'liquidity' | 'sqrtPrice' | 'tick' | 'token0Price' | 'token1Price' | 'volumeUSD' | 'txCount' | 'totalValueLockedToken0' | 'totalValueLockedToken1' | 'totalValueLockedUSD' | 'totalValueLockedUSDUntracked' | 'untrackedVolumeUSD' | 'feesUSD'>
    & { token0: (
      { __typename?: 'Token' }
      & Pick<Token, 'id' | 'symbol' | 'name' | 'decimals' | 'derivedMatic'>
    ), token1: (
      { __typename?: 'Token' }
      & Pick<Token, 'id' | 'symbol' | 'name' | 'decimals' | 'derivedMatic'>
    ) }
  )> }
);

export type TopTokensQueryVariables = Exact<{ [key: string]: never; }>;


export type TopTokensQuery = (
  { __typename?: 'Query' }
  & { tokens: Array<(
    { __typename?: 'Token' }
    & Pick<Token, 'id'>
  )> }
);

export type GetTokensFromAddressesHistoricalQueryVariables = Exact<{
  tokens: Array<Scalars['ID']> | Scalars['ID'];
  blockNumber: Scalars['Int'];
}>;


export type GetTokensFromAddressesHistoricalQuery = (
  { __typename?: 'Query' }
  & { tokens: Array<(
    { __typename?: 'Token' }
    & Pick<Token, 'id' | 'symbol' | 'name' | 'derivedMatic' | 'volumeUSD' | 'volume' | 'txCount' | 'totalValueLocked' | 'untrackedVolumeUSD' | 'feesUSD' | 'totalValueLockedUSD' | 'totalValueLockedUSDUntracked'>
  )> }
);

export type GetTokensFromAddressesLatestQueryVariables = Exact<{
  tokens: Array<Scalars['ID']> | Scalars['ID'];
}>;


export type GetTokensFromAddressesLatestQuery = (
  { __typename?: 'Query' }
  & { tokens: Array<(
    { __typename?: 'Token' }
    & Pick<Token, 'id' | 'symbol' | 'name' | 'derivedMatic' | 'volumeUSD' | 'volume' | 'txCount' | 'totalValueLocked' | 'untrackedVolumeUSD' | 'feesUSD' | 'totalValueLockedUSD' | 'totalValueLockedUSDUntracked'>
  )> }
);

export type TotalStatsHistoricalQueryVariables = Exact<{
  blockNumber: Scalars['Int'];
}>;


export type TotalStatsHistoricalQuery = (
  { __typename?: 'Query' }
  & { factories: Array<(
    { __typename?: 'Factory' }
    & Pick<Factory, 'totalVolumeUSD' | 'untrackedVolumeUSD' | 'totalValueLockedUSD' | 'totalValueLockedUSDUntracked' | 'txCount' | 'totalFeesUSD'>
  )> }
);

export type TotalStatsLatestQueryVariables = Exact<{ [key: string]: never; }>;


export type TotalStatsLatestQuery = (
  { __typename?: 'Query' }
  & { factories: Array<(
    { __typename?: 'Factory' }
    & Pick<Factory, 'totalVolumeUSD' | 'untrackedVolumeUSD' | 'totalValueLockedUSD' | 'totalValueLockedUSDUntracked' | 'txCount' | 'totalFeesUSD'>
  )> }
);

export type GetBlockByTimestampRangeQueryVariables = Exact<{
  timestamp_gt: Scalars['BigInt'];
  timestamp_lt: Scalars['BigInt'];
}>;


export type GetBlockByTimestampRangeQuery = (
  { __typename?: 'Query' }
  & { blocks: Array<(
    { __typename?: 'Block' }
    & Pick<Block, 'number'>
  )> }
);

export type SurroundingTicksQueryVariables = Exact<{
  poolAddress: Scalars['String'];
  tickIdxLowerBound: Scalars['BigInt'];
  tickIdxUpperBound: Scalars['BigInt'];
  skip: Scalars['Int'];
}>;


export type SurroundingTicksQuery = (
  { __typename?: 'Query' }
  & { ticks: Array<(
    { __typename?: 'Tick' }
    & Pick<Tick, 'tickIdx' | 'liquidityGross' | 'liquidityNet' | 'price0' | 'price1'>
  )> }
);

export type PopularPoolsQueryVariables = Exact<{ [key: string]: never; }>;


export type PopularPoolsQuery = (
  { __typename?: 'Query' }
  & { pools: Array<(
    { __typename?: 'Pool' }
    & { token0: (
      { __typename?: 'Token' }
      & Pick<Token, 'id'>
    ), token1: (
      { __typename?: 'Token' }
      & Pick<Token, 'id'>
    ) }
  )> }
);

export type EternalFarmingsByIdsQueryVariables = Exact<{
  farmIds: Array<Scalars['ID']> | Scalars['ID'];
}>;


export type EternalFarmingsByIdsQuery = (
  { __typename?: 'Query' }
  & { eternalFarmings: Array<(
    { __typename?: 'EternalFarming' }
    & Pick<EternalFarming, 'id' | 'isDetached' | 'rewardToken' | 'bonusRewardToken' | 'rewardRate' | 'bonusRewardRate' | 'startTime' | 'endTime' | 'virtualPool' | 'multiplierToken' | 'tokenAmountForTier1' | 'tokenAmountForTier2' | 'tokenAmountForTier3' | 'tier1Multiplier' | 'tier2Multiplier' | 'tier3Multiplier'>
    & { pool: (
      { __typename?: 'Pool' }
      & Pick<Pool, 'id'>
    ) }
  )> }
);


export const AllV3TicksDocument = `
    query allV3Ticks($poolAddress: String!, $skip: Int!) {
  ticks(
    first: 1000
    skip: $skip
    where: {poolAddress: $poolAddress}
    orderBy: tickIdx
  ) {
    tickIdx
    liquidityNet
    price0
    price1
  }
}
    `;
export const FeeTierDistributionDocument = `
    query feeTierDistribution($token0: String!, $token1: String!) {
  _meta {
    block {
      number
    }
  }
  asToken0: pools(
    orderBy: totalValueLockedToken0
    orderDirection: desc
    where: {token0: $token0, token1: $token1}
  ) {
    fee
    totalValueLockedToken0
    totalValueLockedToken1
  }
  asToken1: pools(
    orderBy: totalValueLockedToken0
    orderDirection: desc
    where: {token0: $token1, token1: $token0}
  ) {
    fee
    totalValueLockedToken0
    totalValueLockedToken1
  }
}
    `;
export const LimitFarmDocument = `
    query limitFarm($time: BigInt) {
  limitFarmings(
    orderBy: createdAtTimestamp
    orderDirection: desc
    first: 1
    where: {startTime_gt: $time, isDetached: false}
  ) {
    startTime
    endTime
  }
}
    `;
export const EternalFarmDocument = `
    query eternalFarm {
  eternalFarmings(where: {isDetached: false}, first: 1) {
    startTime
    endTime
  }
}
    `;
export const FetchRewardsDocument = `
    query fetchRewards($account: Bytes) {
  rewards(orderBy: amount, orderDirection: desc, where: {owner: $account}) {
    id
    rewardAddress
    amount
    owner
  }
}
    `;
export const FetchTokenDocument = `
    query fetchToken($tokenId: ID!) {
  tokens(where: {id: $tokenId}) {
    id
    symbol
    name
    decimals
  }
}
    `;
export const FetchLimitDocument = `
    query fetchLimit($limitFarmingId: ID!) {
  limitFarmings(where: {id: $limitFarmingId}) {
    id
    rewardToken
    bonusRewardToken
    pool
    startTime
    endTime
    reward
    bonusReward
    multiplierToken
    createdAtTimestamp
    tier1Multiplier
    tier2Multiplier
    tier3Multiplier
    tokenAmountForTier1
    tokenAmountForTier2
    tokenAmountForTier3
    enterStartTime
    isDetached
  }
}
    `;
export const EternalFarmingsDocument = `
    query eternalFarmings($farmId: ID!) {
  eternalFarmings(where: {id: $farmId}) {
    id
    isDetached
    pool {
      id
    }
    rewardToken
    bonusRewardToken
    rewardRate
    bonusRewardRate
    startTime
    endTime
    virtualPool
    multiplierToken
    tokenAmountForTier1
    tokenAmountForTier2
    tokenAmountForTier3
    tier1Multiplier
    tier2Multiplier
    tier3Multiplier
  }
}
    `;
export const EternalFarmingsFromPoolsDocument = `
    query eternalFarmingsFromPools($pools: [String!]!, $currentTime: BigInt!) {
  eternalFarmings(
    where: {pool_in: $pools, isDetached: false, endTime_gt: $currentTime, endTimeImplied_gt: $currentTime}
  ) {
    id
    rewardToken
    bonusRewardToken
    pool {
      id
      market0 {
        id
        marketName
        image {
          id
          cidMarket
          cidOutcomes
        }
        wrappedTokensString
        tokens {
          id
          name
        }
      }
      market1 {
        id
        marketName
        image {
          id
          cidMarket
          cidOutcomes
        }
        wrappedTokensString
        tokens {
          id
          name
        }
      }
    }
    startTime
    endTime
    reward
    bonusReward
    rewardRate
    bonusRewardRate
    isDetached
  }
}
    `;
export const LimitFarmingsFromPoolsDocument = `
    query limitFarmingsFromPools($pools: [Bytes!]!, $currentTime: BigInt!) {
  limitFarmings(
    where: {pool_in: $pools, isDetached: false, endTime_gt: $currentTime}
  ) {
    id
    createdAtTimestamp
    rewardToken
    bonusReward
    bonusRewardToken
    pool
    startTime
    endTime
    reward
    multiplierToken
    tokenAmountForTier1
    tokenAmountForTier2
    tokenAmountForTier3
    tier1Multiplier
    tier2Multiplier
    tier3Multiplier
    enterStartTime
    isDetached
  }
}
    `;
export const FetchPoolDocument = `
    query fetchPool($poolId: ID!) {
  pools(where: {id: $poolId}) {
    id
    fee
    token0 {
      id
      decimals
      symbol
    }
    token1 {
      id
      decimals
      symbol
    }
    sqrtPrice
    liquidity
    tick
    feesUSD
    untrackedFeesUSD
    market0 {
      id
      marketName
      wrappedTokensString
      image {
        id
        cidMarket
        cidOutcomes
      }
      tokens {
        id
        name
      }
    }
    market1 {
      id
      marketName
      wrappedTokensString
      image {
        id
        cidMarket
        cidOutcomes
      }
      tokens {
        id
        name
      }
    }
  }
}
    `;
export const FetchPoolsByIdsDocument = `
    query fetchPoolsByIds($poolIds: [ID!]!) {
  pools(where: {id_in: $poolIds}) {
    id
    fee
    token0 {
      id
      decimals
      symbol
    }
    token1 {
      id
      decimals
      symbol
    }
    sqrtPrice
    liquidity
    tick
    feesUSD
    untrackedFeesUSD
    totalValueLockedUSD
    market0 {
      id
      marketName
      wrappedTokensString
      image {
        id
        cidMarket
        cidOutcomes
      }
      tokens {
        id
        name
      }
    }
    market1 {
      id
      marketName
      wrappedTokensString
      image {
        id
        cidMarket
        cidOutcomes
      }
      tokens {
        id
        name
      }
    }
  }
}
    `;
export const FetchTokensByIdsDocument = `
    query fetchTokensByIds($tokenIds: [ID!]!) {
  tokens(where: {id_in: $tokenIds}) {
    id
    symbol
    name
    decimals
    derivedMatic
  }
}
    `;
export const FeeHourDataDocument = `
    query feeHourData($pool: String!, $startTimestamp: BigInt!, $endTimestamp: BigInt!) {
  feeHourDatas(
    first: 1000
    where: {pool: $pool, timestamp_gte: $startTimestamp, timestamp_lte: $endTimestamp}
  ) {
    id
    pool
    fee
    changesCount
    timestamp
    minFee
    maxFee
    startFee
    endFee
  }
}
    `;
export const LastFeeHourDataDocument = `
    query lastFeeHourData($pool: String!) {
  feeHourDatas(
    first: 1
    orderBy: timestamp
    orderDirection: desc
    where: {pool: $pool}
  ) {
    id
    pool
    fee
    changesCount
    timestamp
    minFee
    maxFee
    startFee
    endFee
  }
}
    `;
export const LastNotEmptyHourDataDocument = `
    query lastNotEmptyHourData($pool: String!, $timestamp: BigInt!) {
  feeHourDatas(
    first: 1
    orderBy: timestamp
    orderDirection: desc
    where: {pool: $pool, timestamp_lt: $timestamp}
  ) {
    id
    pool
    fee
    changesCount
    timestamp
    minFee
    maxFee
    startFee
    endFee
  }
}
    `;
export const LastNotEmptyPoolHourDataDocument = `
    query lastNotEmptyPoolHourData($pool: ID!, $timestamp: Int!) {
  poolHourDatas(
    first: 1
    orderBy: periodStartUnix
    orderDirection: desc
    where: {pool_: {id: $pool}, periodStartUnix_lt: $timestamp}
  ) {
    periodStartUnix
    volumeUSD
    tvlUSD
    feesUSD
    untrackedVolumeUSD
    token1Price
    token0Price
  }
}
    `;
export const LastPoolHourDataDocument = `
    query lastPoolHourData($pool: ID!) {
  poolHourDatas(
    first: 1
    where: {pool_: {id: $pool}}
    orderBy: periodStartUnix
    orderDirection: desc
  ) {
    periodStartUnix
    volumeUSD
    tvlUSD
    feesUSD
    untrackedVolumeUSD
  }
}
    `;
export const PoolHourDataDocument = `
    query poolHourData($pool: ID!, $startTimestamp: Int!, $endTimestamp: Int!) {
  poolHourDatas(
    first: 1000
    where: {pool_: {id: $pool}, periodStartUnix_gte: $startTimestamp, periodStartUnix_lte: $endTimestamp}
    orderBy: periodStartUnix
    orderDirection: asc
    subgraphError: allow
  ) {
    periodStartUnix
    volumeUSD
    tvlUSD
    feesUSD
    untrackedVolumeUSD
    token0Price
    token1Price
  }
}
    `;
export const LastEventDocument = `
    query lastEvent {
  limitFarmings(
    first: 1
    orderDirection: desc
    orderBy: createdAtTimestamp
    where: {isDetached: false}
  ) {
    createdAtTimestamp
    id
    startTime
    endTime
  }
}
    `;
export const FutureEventsDocument = `
    query futureEvents($timestamp: BigInt!) {
  limitFarmings(
    orderBy: startTime
    orderDirection: asc
    where: {startTime_gt: $timestamp, isDetached: false}
  ) {
    id
    createdAtTimestamp
    rewardToken
    bonusReward
    bonusRewardToken
    pool
    startTime
    endTime
    reward
    tier1Multiplier
    tier2Multiplier
    tier3Multiplier
    tokenAmountForTier1
    tokenAmountForTier2
    tokenAmountForTier3
    multiplierToken
    enterStartTime
    isDetached
  }
}
    `;
export const CurrentEventsDocument = `
    query currentEvents($startTime: BigInt!, $endTime: BigInt!) {
  limitFarmings(
    orderBy: endTime
    orderDirection: desc
    where: {startTime_lte: $startTime, endTime_gt: $endTime, isDetached: false}
  ) {
    id
    rewardToken
    bonusReward
    bonusRewardToken
    pool
    startTime
    endTime
    reward
    tier1Multiplier
    tier2Multiplier
    tier3Multiplier
    tokenAmountForTier1
    tokenAmountForTier2
    tokenAmountForTier3
    enterStartTime
    multiplierToken
    isDetached
  }
}
    `;
export const TransferedPositionsDocument = `
    query transferedPositions($account: Bytes) {
  deposits(
    orderBy: id
    orderDirection: desc
    where: {owner: $account, onFarmingCenter: true}
  ) {
    id
    owner
    pool {
      id
      token0 {
        id
        symbol
        decimals
      }
      token1 {
        id
        symbol
        decimals
      }
      totalValueLockedUSD
      market0 {
        id
        marketName
        wrappedTokensString
        totalValueLockedUSD
        image {
          id
          cidMarket
          cidOutcomes
        }
        tokens {
          id
          name
        }
      }
      market1 {
        id
        marketName
        wrappedTokensString
        totalValueLockedUSD
        image {
          id
          cidMarket
          cidOutcomes
        }
        tokens {
          id
          name
        }
      }
    }
    L2tokenId
    limitFarming {
      id
    }
    eternalFarming {
      id
    }
    onFarmingCenter
  }
}
    `;
export const HasTransferedPositionsDocument = `
    query hasTransferedPositions($account: Bytes!) {
  deposits(first: 1, where: {owner: $account, onFarmingCenter: true}) {
    id
  }
}
    `;
export const PositionsOnEternalFarmingDocument = `
    query positionsOnEternalFarming($account: Bytes!) {
  deposits(
    orderBy: id
    orderDirection: desc
    where: {owner: $account, onFarmingCenter: true, eternalFarming_not: null}
  ) {
    id
    owner
    pool {
      id
      token0 {
        id
        symbol
        decimals
      }
      token1 {
        id
        symbol
        decimals
      }
      totalValueLockedUSD
      market0 {
        id
        marketName
        wrappedTokensString
        totalValueLockedUSD
        image {
          id
          cidMarket
          cidOutcomes
        }
        tokens {
          id
          name
        }
      }
      market1 {
        id
        marketName
        wrappedTokensString
        totalValueLockedUSD
        image {
          id
          cidMarket
          cidOutcomes
        }
        tokens {
          id
          name
        }
      }
    }
    L2tokenId
    eternalFarming {
      id
    }
    onFarmingCenter
    enteredInEternalFarming
  }
}
    `;
export const TransferedPositionsForPoolDocument = `
    query transferedPositionsForPool($account: Bytes!, $pool: ID!) {
  deposits(
    orderBy: id
    orderDirection: desc
    where: {owner: $account, pool_: {id: $pool}, liquidity_not: "0"}
  ) {
    id
    owner
    pool {
      id
      token0 {
        id
        symbol
        decimals
      }
      token1 {
        id
        symbol
        decimals
      }
      totalValueLockedUSD
      market0 {
        id
        marketName
        wrappedTokensString
        totalValueLockedUSD
        image {
          id
          cidMarket
          cidOutcomes
        }
        tokens {
          id
          name
        }
      }
      market1 {
        id
        marketName
        wrappedTokensString
        totalValueLockedUSD
        image {
          id
          cidMarket
          cidOutcomes
        }
        tokens {
          id
          name
        }
      }
    }
    L2tokenId
    limitFarming {
      id
    }
    eternalFarming {
      id
    }
    onFarmingCenter
    enteredInEternalFarming
    tokensLockedLimit
    tokensLockedEternal
    tierLimit
    tierEternal
  }
}
    `;
export const PositionsOnFarmingDocument = `
    query positionsOnFarming($account: Bytes!, $pool: ID!) {
  deposits(
    orderBy: id
    orderDirection: desc
    where: {owner: $account, pool_: {id: $pool}, onFarmingCenter: true}
  ) {
    id
  }
}
    `;
export const FullPositionsPriceRangeDocument = `
    query fullPositionsPriceRange($account: Bytes, $pool: String!, $positions: [ID!]!) {
  q1: positions(where: {owner: $account, pool: $pool}) {
    owner
    liquidity
    id
    transaction {
      timestamp
    }
    tickLower {
      price0
      price1
    }
    tickUpper {
      price0
      price1
    }
    token0 {
      decimals
    }
    token1 {
      decimals
    }
  }
  q2: positions(where: {id_in: $positions}) {
    owner
    liquidity
    id
    transaction {
      timestamp
    }
    tickLower {
      price0
      price1
    }
    tickUpper {
      price0
      price1
    }
    token0 {
      decimals
    }
    token1 {
      decimals
    }
  }
}
    `;
export const InfiniteFarmsDocument = `
    query infiniteFarms($endTime: BigInt!) {
  eternalFarmings(
    where: {isDetached: false, endTime_gt: $endTime, reward_gt: 0, endTimeImplied_gt: $endTime}
  ) {
    id
    rewardToken
    bonusRewardToken
    pool {
      id
      market0 {
        id
        marketName
        totalValueLockedUSD
        wrappedTokensString
        image {
          id
          cidMarket
          cidOutcomes
        }
        tokens {
          id
          name
        }
      }
      market1 {
        id
        marketName
        totalValueLockedUSD
        wrappedTokensString
        image {
          id
          cidMarket
          cidOutcomes
        }
        tokens {
          id
          name
        }
      }
    }
    startTime
    endTime
    reward
    bonusReward
    rewardRate
    bonusRewardRate
    tokenAmountForTier1
    tokenAmountForTier2
    tokenAmountForTier3
    tier1Multiplier
    tier2Multiplier
    tier3Multiplier
    multiplierToken
  }
}
    `;
export const TopPoolsDocument = `
    query topPools {
  pools(
    first: 100
    orderBy: totalValueLockedUSD
    orderDirection: desc
    subgraphError: allow
  ) {
    id
  }
}
    `;
export const GetPoolsFromAddressesHistoricalDocument = `
    query getPoolsFromAddressesHistorical($pools: [ID!]!, $blockNumber: Int!) {
  pools(
    where: {id_in: $pools}
    block: {number: $blockNumber}
    orderBy: totalValueLockedUSD
    orderDirection: desc
    subgraphError: allow
  ) {
    id
    fee
    liquidity
    sqrtPrice
    tick
    token0 {
      id
      symbol
      name
      decimals
      derivedMatic
    }
    token1 {
      id
      symbol
      name
      decimals
      derivedMatic
    }
    token0Price
    token1Price
    volumeUSD
    txCount
    totalValueLockedToken0
    totalValueLockedToken1
    totalValueLockedUSD
    totalValueLockedUSDUntracked
    untrackedVolumeUSD
    feesUSD
  }
}
    `;
export const GetPoolsFromAddressesLatestDocument = `
    query getPoolsFromAddressesLatest($pools: [ID!]!) {
  pools(
    where: {id_in: $pools}
    orderBy: totalValueLockedUSD
    orderDirection: desc
    subgraphError: allow
  ) {
    id
    fee
    liquidity
    sqrtPrice
    tick
    token0 {
      id
      symbol
      name
      decimals
      derivedMatic
    }
    token1 {
      id
      symbol
      name
      decimals
      derivedMatic
    }
    token0Price
    token1Price
    volumeUSD
    txCount
    totalValueLockedToken0
    totalValueLockedToken1
    totalValueLockedUSD
    totalValueLockedUSDUntracked
    untrackedVolumeUSD
    feesUSD
  }
}
    `;
export const TopTokensDocument = `
    query topTokens {
  tokens(
    first: 50
    orderBy: totalValueLockedUSD
    orderDirection: desc
    subgraphError: allow
  ) {
    id
  }
}
    `;
export const GetTokensFromAddressesHistoricalDocument = `
    query getTokensFromAddressesHistorical($tokens: [ID!]!, $blockNumber: Int!) {
  tokens(
    where: {id_in: $tokens}
    block: {number: $blockNumber}
    orderBy: totalValueLockedUSD
    orderDirection: desc
    subgraphError: allow
  ) {
    id
    symbol
    name
    derivedMatic
    volumeUSD
    volume
    txCount
    totalValueLocked
    untrackedVolumeUSD
    feesUSD
    totalValueLockedUSD
    totalValueLockedUSDUntracked
  }
}
    `;
export const GetTokensFromAddressesLatestDocument = `
    query getTokensFromAddressesLatest($tokens: [ID!]!) {
  tokens(
    where: {id_in: $tokens}
    orderBy: totalValueLockedUSD
    orderDirection: desc
    subgraphError: allow
  ) {
    id
    symbol
    name
    derivedMatic
    volumeUSD
    volume
    txCount
    totalValueLocked
    untrackedVolumeUSD
    feesUSD
    totalValueLockedUSD
    totalValueLockedUSDUntracked
  }
}
    `;
export const TotalStatsHistoricalDocument = `
    query totalStatsHistorical($blockNumber: Int!) {
  factories(block: {number: $blockNumber}) {
    totalVolumeUSD
    untrackedVolumeUSD
    totalValueLockedUSD
    totalValueLockedUSDUntracked
    txCount
    totalFeesUSD
  }
}
    `;
export const TotalStatsLatestDocument = `
    query totalStatsLatest {
  factories {
    totalVolumeUSD
    untrackedVolumeUSD
    totalValueLockedUSD
    totalValueLockedUSDUntracked
    txCount
    totalFeesUSD
  }
}
    `;
export const GetBlockByTimestampRangeDocument = `
    query getBlockByTimestampRange($timestamp_gt: BigInt!, $timestamp_lt: BigInt!) {
  blocks(
    first: 1
    orderBy: timestamp
    orderDirection: desc
    where: {timestamp_gt: $timestamp_gt, timestamp_lt: $timestamp_lt}
  ) {
    number
  }
}
    `;
export const SurroundingTicksDocument = `
    query surroundingTicks($poolAddress: String!, $tickIdxLowerBound: BigInt!, $tickIdxUpperBound: BigInt!, $skip: Int!) {
  ticks(
    subgraphError: allow
    first: 1000
    skip: $skip
    where: {poolAddress: $poolAddress, tickIdx_lte: $tickIdxUpperBound, tickIdx_gte: $tickIdxLowerBound}
  ) {
    tickIdx
    liquidityGross
    liquidityNet
    price0
    price1
  }
}
    `;
export const PopularPoolsDocument = `
    query popularPools {
  pools(orderBy: totalValueLockedUSD, orderDirection: desc, first: 6) {
    token0 {
      id
    }
    token1 {
      id
    }
  }
}
    `;
export const EternalFarmingsByIdsDocument = `
    query eternalFarmingsByIds($farmIds: [ID!]!) {
  eternalFarmings(where: {id_in: $farmIds}) {
    id
    isDetached
    pool {
      id
    }
    rewardToken
    bonusRewardToken
    rewardRate
    bonusRewardRate
    startTime
    endTime
    virtualPool
    multiplierToken
    tokenAmountForTier1
    tokenAmountForTier2
    tokenAmountForTier3
    tier1Multiplier
    tier2Multiplier
    tier3Multiplier
  }
}
    `;

const injectedRtkApi = api.injectEndpoints({
  endpoints: (build) => ({
    allV3Ticks: build.query<AllV3TicksQuery, AllV3TicksQueryVariables>({
      query: (variables) => ({ document: AllV3TicksDocument, variables })
    }),
    feeTierDistribution: build.query<FeeTierDistributionQuery, FeeTierDistributionQueryVariables>({
      query: (variables) => ({ document: FeeTierDistributionDocument, variables })
    }),
    limitFarm: build.query<LimitFarmQuery, LimitFarmQueryVariables | void>({
      query: (variables) => ({ document: LimitFarmDocument, variables })
    }),
    eternalFarm: build.query<EternalFarmQuery, EternalFarmQueryVariables | void>({
      query: (variables) => ({ document: EternalFarmDocument, variables })
    }),
    fetchRewards: build.query<FetchRewardsQuery, FetchRewardsQueryVariables | void>({
      query: (variables) => ({ document: FetchRewardsDocument, variables })
    }),
    fetchToken: build.query<FetchTokenQuery, FetchTokenQueryVariables>({
      query: (variables) => ({ document: FetchTokenDocument, variables })
    }),
    fetchLimit: build.query<FetchLimitQuery, FetchLimitQueryVariables>({
      query: (variables) => ({ document: FetchLimitDocument, variables })
    }),
    eternalFarmings: build.query<EternalFarmingsQuery, EternalFarmingsQueryVariables>({
      query: (variables) => ({ document: EternalFarmingsDocument, variables })
    }),
    eternalFarmingsFromPools: build.query<EternalFarmingsFromPoolsQuery, EternalFarmingsFromPoolsQueryVariables>({
      query: (variables) => ({ document: EternalFarmingsFromPoolsDocument, variables })
    }),
    limitFarmingsFromPools: build.query<LimitFarmingsFromPoolsQuery, LimitFarmingsFromPoolsQueryVariables>({
      query: (variables) => ({ document: LimitFarmingsFromPoolsDocument, variables })
    }),
    fetchPool: build.query<FetchPoolQuery, FetchPoolQueryVariables>({
      query: (variables) => ({ document: FetchPoolDocument, variables })
    }),
    fetchPoolsByIds: build.query<FetchPoolsByIdsQuery, FetchPoolsByIdsQueryVariables>({
      query: (variables) => ({ document: FetchPoolsByIdsDocument, variables })
    }),
    fetchTokensByIds: build.query<FetchTokensByIdsQuery, FetchTokensByIdsQueryVariables>({
      query: (variables) => ({ document: FetchTokensByIdsDocument, variables })
    }),
    feeHourData: build.query<FeeHourDataQuery, FeeHourDataQueryVariables>({
      query: (variables) => ({ document: FeeHourDataDocument, variables })
    }),
    lastFeeHourData: build.query<LastFeeHourDataQuery, LastFeeHourDataQueryVariables>({
      query: (variables) => ({ document: LastFeeHourDataDocument, variables })
    }),
    lastNotEmptyHourData: build.query<LastNotEmptyHourDataQuery, LastNotEmptyHourDataQueryVariables>({
      query: (variables) => ({ document: LastNotEmptyHourDataDocument, variables })
    }),
    lastNotEmptyPoolHourData: build.query<LastNotEmptyPoolHourDataQuery, LastNotEmptyPoolHourDataQueryVariables>({
      query: (variables) => ({ document: LastNotEmptyPoolHourDataDocument, variables })
    }),
    lastPoolHourData: build.query<LastPoolHourDataQuery, LastPoolHourDataQueryVariables>({
      query: (variables) => ({ document: LastPoolHourDataDocument, variables })
    }),
    poolHourData: build.query<PoolHourDataQuery, PoolHourDataQueryVariables>({
      query: (variables) => ({ document: PoolHourDataDocument, variables })
    }),
    lastEvent: build.query<LastEventQuery, LastEventQueryVariables | void>({
      query: (variables) => ({ document: LastEventDocument, variables })
    }),
    futureEvents: build.query<FutureEventsQuery, FutureEventsQueryVariables>({
      query: (variables) => ({ document: FutureEventsDocument, variables })
    }),
    currentEvents: build.query<CurrentEventsQuery, CurrentEventsQueryVariables>({
      query: (variables) => ({ document: CurrentEventsDocument, variables })
    }),
    transferedPositions: build.query<TransferedPositionsQuery, TransferedPositionsQueryVariables | void>({
      query: (variables) => ({ document: TransferedPositionsDocument, variables })
    }),
    hasTransferedPositions: build.query<HasTransferedPositionsQuery, HasTransferedPositionsQueryVariables>({
      query: (variables) => ({ document: HasTransferedPositionsDocument, variables })
    }),
    positionsOnEternalFarming: build.query<PositionsOnEternalFarmingQuery, PositionsOnEternalFarmingQueryVariables>({
      query: (variables) => ({ document: PositionsOnEternalFarmingDocument, variables })
    }),
    transferedPositionsForPool: build.query<TransferedPositionsForPoolQuery, TransferedPositionsForPoolQueryVariables>({
      query: (variables) => ({ document: TransferedPositionsForPoolDocument, variables })
    }),
    positionsOnFarming: build.query<PositionsOnFarmingQuery, PositionsOnFarmingQueryVariables>({
      query: (variables) => ({ document: PositionsOnFarmingDocument, variables })
    }),
    fullPositionsPriceRange: build.query<FullPositionsPriceRangeQuery, FullPositionsPriceRangeQueryVariables>({
      query: (variables) => ({ document: FullPositionsPriceRangeDocument, variables })
    }),
    infiniteFarms: build.query<InfiniteFarmsQuery, InfiniteFarmsQueryVariables>({
      query: (variables) => ({ document: InfiniteFarmsDocument, variables })
    }),
    topPools: build.query<TopPoolsQuery, TopPoolsQueryVariables | void>({
      query: (variables) => ({ document: TopPoolsDocument, variables })
    }),
    getPoolsFromAddressesHistorical: build.query<GetPoolsFromAddressesHistoricalQuery, GetPoolsFromAddressesHistoricalQueryVariables>({
      query: (variables) => ({ document: GetPoolsFromAddressesHistoricalDocument, variables })
    }),
    getPoolsFromAddressesLatest: build.query<GetPoolsFromAddressesLatestQuery, GetPoolsFromAddressesLatestQueryVariables>({
      query: (variables) => ({ document: GetPoolsFromAddressesLatestDocument, variables })
    }),
    topTokens: build.query<TopTokensQuery, TopTokensQueryVariables | void>({
      query: (variables) => ({ document: TopTokensDocument, variables })
    }),
    getTokensFromAddressesHistorical: build.query<GetTokensFromAddressesHistoricalQuery, GetTokensFromAddressesHistoricalQueryVariables>({
      query: (variables) => ({ document: GetTokensFromAddressesHistoricalDocument, variables })
    }),
    getTokensFromAddressesLatest: build.query<GetTokensFromAddressesLatestQuery, GetTokensFromAddressesLatestQueryVariables>({
      query: (variables) => ({ document: GetTokensFromAddressesLatestDocument, variables })
    }),
    totalStatsHistorical: build.query<TotalStatsHistoricalQuery, TotalStatsHistoricalQueryVariables>({
      query: (variables) => ({ document: TotalStatsHistoricalDocument, variables })
    }),
    totalStatsLatest: build.query<TotalStatsLatestQuery, TotalStatsLatestQueryVariables | void>({
      query: (variables) => ({ document: TotalStatsLatestDocument, variables })
    }),
    getBlockByTimestampRange: build.query<GetBlockByTimestampRangeQuery, GetBlockByTimestampRangeQueryVariables>({
      query: (variables) => ({ document: GetBlockByTimestampRangeDocument, variables })
    }),
    surroundingTicks: build.query<SurroundingTicksQuery, SurroundingTicksQueryVariables>({
      query: (variables) => ({ document: SurroundingTicksDocument, variables })
    }),
    popularPools: build.query<PopularPoolsQuery, PopularPoolsQueryVariables | void>({
      query: (variables) => ({ document: PopularPoolsDocument, variables })
    }),
    eternalFarmingsByIds: build.query<EternalFarmingsByIdsQuery, EternalFarmingsByIdsQueryVariables>({
      query: (variables) => ({ document: EternalFarmingsByIdsDocument, variables })
    }),
  }),
});

export { injectedRtkApi as api };
export const { useAllV3TicksQuery, useLazyAllV3TicksQuery, useFeeTierDistributionQuery, useLazyFeeTierDistributionQuery, useLimitFarmQuery, useLazyLimitFarmQuery, useEternalFarmQuery, useLazyEternalFarmQuery, useFetchRewardsQuery, useLazyFetchRewardsQuery, useFetchTokenQuery, useLazyFetchTokenQuery, useFetchLimitQuery, useLazyFetchLimitQuery, useEternalFarmingsQuery, useLazyEternalFarmingsQuery, useEternalFarmingsFromPoolsQuery, useLazyEternalFarmingsFromPoolsQuery, useLimitFarmingsFromPoolsQuery, useLazyLimitFarmingsFromPoolsQuery, useFetchPoolQuery, useLazyFetchPoolQuery, useFetchPoolsByIdsQuery, useLazyFetchPoolsByIdsQuery, useFetchTokensByIdsQuery, useLazyFetchTokensByIdsQuery, useFeeHourDataQuery, useLazyFeeHourDataQuery, useLastFeeHourDataQuery, useLazyLastFeeHourDataQuery, useLastNotEmptyHourDataQuery, useLazyLastNotEmptyHourDataQuery, useLastNotEmptyPoolHourDataQuery, useLazyLastNotEmptyPoolHourDataQuery, useLastPoolHourDataQuery, useLazyLastPoolHourDataQuery, usePoolHourDataQuery, useLazyPoolHourDataQuery, useLastEventQuery, useLazyLastEventQuery, useFutureEventsQuery, useLazyFutureEventsQuery, useCurrentEventsQuery, useLazyCurrentEventsQuery, useTransferedPositionsQuery, useLazyTransferedPositionsQuery, useHasTransferedPositionsQuery, useLazyHasTransferedPositionsQuery, usePositionsOnEternalFarmingQuery, useLazyPositionsOnEternalFarmingQuery, useTransferedPositionsForPoolQuery, useLazyTransferedPositionsForPoolQuery, usePositionsOnFarmingQuery, useLazyPositionsOnFarmingQuery, useFullPositionsPriceRangeQuery, useLazyFullPositionsPriceRangeQuery, useInfiniteFarmsQuery, useLazyInfiniteFarmsQuery, useTopPoolsQuery, useLazyTopPoolsQuery, useGetPoolsFromAddressesHistoricalQuery, useLazyGetPoolsFromAddressesHistoricalQuery, useGetPoolsFromAddressesLatestQuery, useLazyGetPoolsFromAddressesLatestQuery, useTopTokensQuery, useLazyTopTokensQuery, useGetTokensFromAddressesHistoricalQuery, useLazyGetTokensFromAddressesHistoricalQuery, useGetTokensFromAddressesLatestQuery, useLazyGetTokensFromAddressesLatestQuery, useTotalStatsHistoricalQuery, useLazyTotalStatsHistoricalQuery, useTotalStatsLatestQuery, useLazyTotalStatsLatestQuery, useGetBlockByTimestampRangeQuery, useLazyGetBlockByTimestampRangeQuery, useSurroundingTicksQuery, useLazySurroundingTicksQuery, usePopularPoolsQuery, useLazyPopularPoolsQuery, useEternalFarmingsByIdsQuery, useLazyEternalFarmingsByIdsQuery } = injectedRtkApi;

