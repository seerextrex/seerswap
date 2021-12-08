import ReactGA from 'react-ga'
import { isMobile } from 'utils/userAgent'

const GOOGLE_ANALYTICS_ID: string | undefined = process.env.REACT_APP_GOOGLE_ANALYTICS_ID
if (typeof GOOGLE_ANALYTICS_ID === 'string') {
    console.log('HERE')
    ReactGA.initialize(GOOGLE_ANALYTICS_ID, {
        gaOptions: {
            storage: 'none',
            storeGac: false,
        },
    })
    ReactGA.set({
        anonymizeIp: true,
        customBrowserType: !isMobile
            ? 'desktop'
            : 'web3' in window || 'ethereum' in window
                ? 'mobileWeb3'
                : 'mobileRegular',
    })
} else {
    console.log('HERE 2')
    ReactGA.initialize('test', { testMode: true, debug: true })
}