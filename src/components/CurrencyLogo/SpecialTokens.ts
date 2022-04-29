// @ts-ignore
import AlgebraLogo from '../../assets/images/algebra-logo.png'
// @ts-ignore
import USDCLogo from '../../assets/svg/usd-coin-usdc-logo.svg'
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
import HSMLogo from '../../assets/images/hsm-logo.png'

interface SpecialTokensInterface {
    [key: string]: {
        name: string
        logo: string
    }
}

export const specialTokens: SpecialTokensInterface = {
    ['0xafc507028f15b33071226faa315525131f8326f1']: {
        name: 'USDC',
        logo: USDCLogo
    },
    ['0xe0eed4d7b02b5ec02e2b4bef2755fd47f14bb7b4']: {
        name: 'ALGB',
        logo: AlgebraLogo
    },
    ['0x5e716825c2368000df026372173b4c4dc2ce8a8b']: {
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
    },
    ['0x77ec58f36f3d1a9cf8694fc5c544b04b8c9639dd']: {
        name: 'HSM',
        logo: HSMLogo
    }
}
