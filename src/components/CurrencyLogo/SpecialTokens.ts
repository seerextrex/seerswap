import WdogeLogo from '../../assets/images/doge-logo.png'
import OmnomLogo from '../../assets/images/omnom-logo.png'


interface SpecialTokensInterface {
    [key: string]: {
        name: string
        logo: string
    }
}

export const specialTokens: SpecialTokensInterface = {
    ['0xe3fca919883950c5cd468156392a6477ff5d18de']: {
        name: 'OMNOM',
        logo: OmnomLogo
    },
    ['0xb7ddc6414bf4f5515b52d8bdd69973ae205ff101']: {
        name: 'WDOGE',
        logo: WdogeLogo
    }
}
