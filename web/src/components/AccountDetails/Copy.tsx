import React from 'react'
import useCopyClipboard from '../../hooks/useCopyClipboard'
import { CheckCircle, Copy } from 'react-feather'
import { Trans } from '@lingui/macro'
import { CopyIcon, TransactionStatusText } from './styled'

export default function CopyHelper(props: { toCopy: string; children?: React.ReactNode }) {
    const [isCopied, setCopied] = useCopyClipboard()

    return (
        <button className={'bg-t br-0 fs-085 c-p f f-ac p-0 mr-05'} onClick={() => setCopied(props.toCopy)}>
            {isCopied ? (
                <span className={'f f-ac mr-025'}>
                    <CheckCircle size={'1rem'} stroke={'var(--primary)'}/>
                    <span className={'ml-025'}>
                        <Trans>Copied</Trans>
                    </span>
                </span>
            ) : (
                <span className={'mr-025'}>
                    <Copy size={'1rem'} stroke={'var(--primary)'} />
                </span>
            )}
            <span className={'hover-line'}>
                {isCopied ? '' : props.children}
            </span>
        </button>
    )
}
