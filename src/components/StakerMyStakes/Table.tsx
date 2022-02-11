// import { IsActive } from './IsActive'
// import CurrencyLogo from '../CurrencyLogo'
// import Loader from '../Loader'
// import { ChevronsUp, Send } from 'react-feather'
// import { getProgress } from '../../utils/getProgress'
// import { useStakerHandlers } from '../../hooks/useStakerHandlers'
// import { getCountdownTime } from '../../utils/time'
// import { CheckOut } from './CheckOut'
// import { FarmingType } from '../../models/enums'
// import {
//     EventEndTime,
//     EventProgress,
//     EventProgressInner,
//     MoreButton,
//     NFTPositionDescription,
//     NFTPositionIcon,
//     NFTPositionIndex,
//     NFTPositionLink,
//     PositionCard,
//     PositionCardBody,
//     PositionCardEvent,
//     PositionCardEventTitle,
//     PositionCardHeader,
//     PositionCardMock,
//     PositionCardStats,
//     PositionCardStatsItem,
//     PositionCardStatsItemTitle,
//     PositionCardStatsItemValue,
//     PositionCardStatsItemWrapper,
//     PositionNotDepositedText,
//     StakeActions,
//     StakeBottomWrapper,
//     StakeButton,
//     StakeCountdownProgress,
//     StakeCountdownWrapper,
//     StakePool,
//     TimeWrapper,
//     TokensNames
// } from './styled'
// import { formatReward } from '../../utils/formatReward'
// import { useLocation } from 'react-router'
// import { Token } from '@uniswap/sdk-core'
// import { useCallback, useEffect, useMemo, useState } from 'react'
// import { Deposit, RewardInterface, UnstakingInterface } from '../../models/interfaces'
// import { useAllTransactions } from '../../state/transactions/hooks'
// import { isAddress } from '@ethersproject/address'
//
// interface TableProps {
//     positions: any[]
//     unstaking: any
//     setUnstaking: any
//     setSendModal: any
//     gettingReward: any
//     setGettingReward: any
//     now: any
//     eternalCollectReward: any
//     setEternalCollectReward: any,
//     claimRewardHash: any,
//     confirmed: any,
//     shallowPositions: any,
//     setShallowPositions: any,
//     recipient: any
//     data: any,
//     sending: any
//     setSending: any
// }
//
// export function Table({
//     positions,
//     setSendModal,
//     now,
//     shallowPositions,
//     recipient,
//     data,
//     setShallowPositions,
//     sending,
//     setSending
// }: TableProps) {
//     const { hash } = useLocation()
//
//     const {
//         eternalCollectRewardHandler,
//         withdrawHandler,
//         exitHandler,
//         claimRewardsHandler,
//         claimRewardHash,
//         sendNFTL2Hash,
//         eternalCollectRewardHash,
//         withdrawnHash
//     } = useStakerHandlers() || {}
//
//
//
//     return (
//         <>
//
//         </>
//     )
// }
