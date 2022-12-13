import WdogeLogo from '../../assets/images/doge.png'
import EthLogo from '../../assets/images/ether-logo.png'
import USDTLogo from '../../assets/images/USDT-logo.png'
import USDCLogo from '../../assets/svg/usd-coin-usdc-logo.svg'
import WBTCLogo from '../../assets/images/wbtc-logo.png'
import DDLogo from '../../assets/svg/dragon-doge-logo.svg'
import QuickNewLogo from '../../assets/svg/quick-new-logo.svg'
import MaticLogo from '../../assets/images/matic-logo.png'
import DCLogo from '../../assets/images/doge-logo.png'
import DogiraLogo from '../../assets/images/dogira.jpg'
import DCGODLogo from '../../assets/images/dcgod-logo.png'
import MAILogo from '../../assets/images/mai.png'

import AlgebraConfig from "algebra.config"

interface SpecialTokensInterface {
    [key: string]: string
}

export const specialTokens: SpecialTokensInterface = Object.entries(AlgebraConfig.DEFAULT_TOKEN_LIST.tokensLogos).reduce((acc, [address, logo]) => ({
    ...acc,
    [address]: logo
}), {})
