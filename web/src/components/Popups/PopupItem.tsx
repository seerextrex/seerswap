import { useCallback, useEffect } from 'react'
import { PopupContent } from '../../state/application/actions'
import { useRemovePopup } from '../../state/application/hooks'
import TransactionPopup from './TransactionPopup'
import './index.scss'
import { X } from 'react-feather'

interface PopupItemProps {
    removeAfterMs: number | null
    content: PopupContent
    popKey: string
}

export default function PopupItem({ removeAfterMs, content, popKey }: PopupItemProps) {
    const removePopup = useRemovePopup()
    const removeThisPopup = useCallback(() => removePopup(popKey), [popKey, removePopup])
    useEffect(() => {
        if (removeAfterMs === null) return undefined

        const timeout = setTimeout(() => {
            removeThisPopup()
        }, removeAfterMs)

        return () => {
            clearTimeout(timeout)
        }
    }, [removeAfterMs, removeThisPopup])

    let popupContent
    if ('txn' in content) {
        const {
            txn: { hash, success, summary }
        } = content
        popupContent = <TransactionPopup hash={hash} success={success} summary={summary} />
    }

    return (
        <div className={'popup w-100 br-8 pos-r p-1'}>
            <span className={'popup__close'} onClick={removeThisPopup}>
                <X color={'var(--dark-gray)'} />
            </span>
            {popupContent}
        </div>
    )
}
