import { AbstractConnector } from '@web3-react/abstract-connector'
import { injected, walletconnector } from '../../connectors'
import Identicon from '../Identicon'
import WalletConnectImg from '../../assets/images/walletConnectionIcon.svg'

export function StatusIcon({ connector }: { connector: AbstractConnector }) {
    if (connector === injected) {
        return <Identicon />
    }
    if (connector === walletconnector) {
        return <img style={{ width: '18px', height: '18px' }} src={WalletConnectImg} alt='' />
    }
    return null
}
