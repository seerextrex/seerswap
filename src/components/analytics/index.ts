import ReactGA from 'react-ga'
import TagManager from 'react-gtm-module'

import { isMobile } from 'utils/userAgent'

const GOOGLE_ANALYTICS_ID: string | undefined = 'UA-238335198-1'

const tagManagerArgs = {
    gtmId: 'GTM-5544TNR'
}

if (typeof GOOGLE_ANALYTICS_ID === 'string') {
    ReactGA.initialize(GOOGLE_ANALYTICS_ID, {
        gaOptions: {
            storage: 'none',
            storeGac: false
        }
    })
    ReactGA.set({
        anonymizeIp: true,
        customBrowserType: !isMobile
            ? 'desktop'
            : 'web3' in window || 'ethereum' in window
                ? 'mobileWeb3'
                : 'mobileRegular'
    })
} else {
    ReactGA.initialize('test', { testMode: true, debug: true })
}

TagManager.initialize(tagManagerArgs)
