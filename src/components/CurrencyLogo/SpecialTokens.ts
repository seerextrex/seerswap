import WdogeLogo from '../../assets/images/doge-logo.png'


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
    }
}
