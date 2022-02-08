import ReactGA from 'react-ga'
import TagManager from 'react-gtm-module'

import { isMobile } from 'utils/userAgent'

const GOOGLE_ANALYTICS_ID: string | undefined = 'UA-213558502-3'

const tagManagerArgs = {
    gtmId: 'GTM-MD63ZMK'
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
