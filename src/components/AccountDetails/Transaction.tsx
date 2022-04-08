import { CheckCircle, Triangle, X } from 'react-feather'
import { useActiveWeb3React } from '../../hooks/web3'
import { useAllTransactions } from '../../state/transactions/hooks'
import { ExplorerDataType, getExplorerLink } from '../../utils/getExplorerLink'
import Loader from '../Loader'
import { useAppDispatch } from '../../state/hooks'
import { clearOneTransaction } from '../../state/transactions/actions'
import { ExternalLink } from '../../theme'


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
        <ExternalLink
            href={getExplorerLink(chainId, hash, ExplorerDataType.TRANSACTION)}
        >
            <span className={'hover-line'}>{summary ?? hash} ↗</span>
            <div className={'f'}>
                <div className={`c-${pending ? 'p' : success ? 'g' : 'r'} pos-r z-10`}>
                    {pending ? <Loader /> : success ? <CheckCircle size='1rem' /> : <Triangle size='1rem' />}
                </div>
                <div className={'ml-025 c-r pos-r z-10'} onClick={(e) => {
                    e.preventDefault()
                    dispatch(clearOneTransaction({ chainId, hash }))
                }}>
                    <X size={'16'} />
                </div>
            </div>
        </ExternalLink>
    )
}
