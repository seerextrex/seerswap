import React from 'react'
import useCopyClipboard from '../../hooks/useCopyClipboard'
import { CheckCircle, Copy } from 'react-feather'
import { Trans } from '@lingui/macro'
import { CopyIcon, TransactionStatusText } from './styled'

export default function CopyHelper(props: { toCopy: string; children?: React.ReactNode }) {
    const [isCopied, setCopied] = useCopyClipboard()

    return (
        <CopyIcon onClick={() => setCopied(props.toCopy)}>
            {isCopied ? (
                <TransactionStatusText>
                    <CheckCircle size={'16'} />
                    <TransactionStatusText>
                        <Trans>Copied</Trans>
                    </TransactionStatusText>
                </TransactionStatusText>
            ) : (
                <TransactionStatusText>
                    <Copy size={'16'} stroke={'#080064'} />
                </TransactionStatusText>
            )}
            {isCopied ? '' : props.children}
        </CopyIcon>
    )
}
