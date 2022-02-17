import { ReactNode } from 'react'
import { AutoColumn } from '../../components/Column'
import { TYPE } from '../../theme'

export function EmptyState({ message }: { message: ReactNode }) {
    return (
        <AutoColumn style={{ minHeight: 200, justifyContent: 'center', alignItems: 'center' }}>
            <TYPE.body>{message}</TYPE.body>
        </AutoColumn>
    )
}
