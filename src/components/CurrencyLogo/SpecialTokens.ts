// @ts-ignore
import AlgebraLogo from '../../assets/images/algebra-logo.png'
// @ts-ignore
import USDCLogo from '../../assets/images/usdc-logo.png'
// @ts-ignore
import WMATICLogo from '../../assets/images/matic-logo.png'
// @ts-ignore
import EtherLogo from '../../assets/images/ether-logo.png'
// @ts-ignore
import USDTLogo from '../../assets/images/USDT-logo.png'
// @ts-ignore
import RBCLogo from '../../assets/images/rubic-logo.png'
// @ts-ignore
import HarmonyLogo from '../../assets/images/harmony-logo.png'
// @ts-ignore
import IrisLogo from '../../assets/images/iris-logo.png'

interface SpecialTokensInterface {
    [key: string]: {
        name: string
        logo: string
    }
}

export const specialTokens: SpecialTokensInterface = {
    ['0x2791bca1f2de4661ed88a30c99a7a9449aa84174']: {
        name: 'USDC',
        logo: USDCLogo
    },
    ['0x0169ec1f8f639b32eec6d923e24c2a2ff45b9dd6']: {
        name: 'ALGB',
        logo: AlgebraLogo
    },
    ['0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270']: {
        name: 'WMATIC',
        logo: WMATICLogo
    },
    ['0x7ceb23fd6bc0add59e62ac25578270cff1b9f619']: {
        name: 'WETH',
        logo: EtherLogo
    },
    ['0xc2132d05d31c914a87c6611c10748aeb04b58e8f']: {
        name: 'USDT',
        logo: USDTLogo
    },
    ['0xc3cffdaf8f3fdf07da6d5e3a89b8723d5e385ff8']: {
        name: 'RBC',
        logo: RBCLogo
    },
    ['0xdab35042e63e93cc8556c9bae482e5415b5ac4b1']: {
        name: 'IRIS',
        logo: IrisLogo
    },
    ['0x6b7a87899490ece95443e979ca9485cbe7e71522']: {
        name: 'ONE',
        logo: HarmonyLogo
    }
}
