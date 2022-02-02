import { CheckCircle, X, Triangle } from 'react-feather'
import { useActiveWeb3React } from '../../hooks/web3'
import { useAllTransactions } from '../../state/transactions/hooks'
import { ExplorerDataType, getExplorerLink } from '../../utils/getExplorerLink'
import { RowFixed } from '../Row'
import Loader from '../Loader'
import { useAppDispatch } from '../../state/hooks'
import { clearOneTransaction } from '../../state/transactions/actions'
import {
  TransactionWrapper,
  TransactionsStatusText,
  TransIconWrapper,
  TransCloseIcon,
  IconsWrapper,
  TransactionState
} from './styled'


export default function Transaction({ hash }: { hash: string }) {
  const { chainId } = useActiveWeb3React()
  const allTransactions = useAllTransactions()
  const dispatch = useAppDispatch()

  const tx = allTransactions?.[hash]
  const summary = tx?.summary
  const pending = !tx?.receipt
  const success = !pending && tx && (tx.receipt?.status === 1 || typeof tx.receipt?.status === 'undefined')

  if (!chainId) return null

  return (
    <TransactionWrapper>
      <TransactionState
        href={getExplorerLink(chainId, hash, ExplorerDataType.TRANSACTION)}
        pending={pending}
        success={success}
      >
        <RowFixed>
          <TransactionsStatusText>{summary ?? hash} ↗</TransactionsStatusText>
        </RowFixed>
        <IconsWrapper>
          <TransIconWrapper pending={pending} success={success}>
            {pending ? <Loader /> : success ? <CheckCircle size='16' /> : <Triangle size='16' />}
          </TransIconWrapper>
          <TransCloseIcon onClick={(e) => {
            e.preventDefault()
            dispatch(clearOneTransaction({ chainId, hash }))
          }}>
            <X size={'16'} />
          </TransCloseIcon>
        </IconsWrapper>
      </TransactionState>
    </TransactionWrapper>
  )
}
