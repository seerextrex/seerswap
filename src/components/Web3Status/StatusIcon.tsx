import { AbstractConnector } from '@web3-react/abstract-connector'
import { injected } from '../../connectors'
import Identicon from '../Identicon'

export function StatusIcon({ connector }: { connector: AbstractConnector }) {
    if (connector === injected) {
        return <Identicon />
    }
    return null
}
