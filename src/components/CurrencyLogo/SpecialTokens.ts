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

interface SpecialTokensInterface {
    [key: string]: {
        name: string
        logo: string
    }
}

export const specialTokens: SpecialTokensInterface = {
    ['0xb7ddc6414bf4f5515b52d8bdd69973ae205ff101']: {
        name: 'WDOGE',
        logo: WdogeLogo
    },
    ['0xb44a9b6905af7c801311e8f4e76932ee959c663c']: {
        name: 'Ether',
        logo: EthLogo
    },
    ['0x765277eebeca2e31912c9946eae1021199b39c61']: {
        name: 'USDC',
        logo: USDCLogo
    },
    ['0xe3f5a90f9cb311505cd691a46596599aa1a0ad7d']: {
        name: 'USDT',
        logo: USDTLogo
    },
    ['0xfa9343c3897324496a05fc75abed6bac29f8a40f']: {
        name: 'WBTC',
        logo: WBTCLogo
    },
    ['0x582daef1f36d6009f64b74519cfd612a8467be18']: {
        name: 'DD',
        logo: DDLogo
    },
    ['0xb12c13e66ade1f72f71834f2fc5082db8c091358']: {
        name: 'QUICK',
        logo: QuickNewLogo
    },
    ['0xdc42728b0ea910349ed3c6e1c9dc06b5fb591f98']: {
        name: 'MATIC',
        logo: MaticLogo
    },
    ['0x7b4328c127b85369d9f82ca0503b000d09cf9180']: {
        name: 'Dogechain Token',
        logo: DCLogo
    },
    ['0xf480f38c366daac4305dc484b2ad7a496ff00cea']: {
        name: 'Dogira',
        logo: DogiraLogo
    },
    ['0x91cd28e57b92e34124c4540ee376c581d188b53e']: {
        name: 'DCGod',
        logo: DCGODLogo,
    }
}