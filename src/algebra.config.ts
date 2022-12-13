import WDOGE_LOGO from './assets/images/doge-logo.png'
import USDC_LOGO from './assets/svg/usd-coin-usdc-logo.svg'
import ETH_LOGO from './assets/images/ether-logo.png'

export default {

    CHAIN_PARAMS: {
        chainId: 2000,
        chainIdHex: "0x7D0",
        chainName: "Dogechain",
        wrappedNativeCurrency: { name: "WDOGE", symbol: "WDOGE", decimals: 18, address: "0xB7ddC6414bf4F5515b52D8BdD69973Ae205ff101", logo: WDOGE_LOGO },
        rpcURL: "https://dogechain.ankr.com",
        blockExplorerURL: "explorer.dogechain.dog",
    },

    // Token addresses should be in lowercase
    DEFAULT_TOKEN_LIST: {
        // Tokens, which would be displayed on the top of Token Selector Modal
        defaultTokens: {
            ["0x765277eebeca2e31912c9946eae1021199b39c61"]: { name: "USDC", symbol: "USDC", decimals: 6 },
            ["0xb44a9b6905af7c801311e8f4e76932ee959c663c"]: { name: "Ethereum", symbol: "ETH", decimals: 18 },
        },
        // Tokens, which would be used for creating multihop routes
        tokensForMultihop: {
            ["0x765277eebeca2e31912c9946eae1021199b39c61"]: { name: "USDC", symbol: "USDC", decimals: 6 },
            ["0xb44a9b6905af7c801311e8f4e76932ee959c663c"]: { name: "Ethereum", symbol: "ETH", decimals: 18 },
        },
        tokensLogos: {
            ["0x765277eebeca2e31912c9946eae1021199b39c61"]: USDC_LOGO,
            ["0xb44a9b6905af7c801311e8f4e76932ee959c663c"]: ETH_LOGO
        },
        stableTokens: {
            ["0x765277eebeca2e31912c9946eae1021199b39c61"]: { name: "USDC", symbol: "USDC", decimals: 6 },
        },
        stableTokenForUSDPrice: { address: "0x765277eebeca2e31912c9946eae1021199b39c61", name: "USDC", symbol: "USDC", decimals: 6 },
        // Real tokens and their possible fake names. Used for token launch safety
        filterForScamTokens: {
            tokensForCheck: {
                ["DD"]: "0x582daef1f36d6009f64b74519cfd612a8467be18",
                ["DC"]: "0x7b4328c127b85369d9f82ca0503b000d09cf9180"
            },
            possibleFakeNames: [
                {
                    names: ['Doge Dragon', 'DogeDragon', 'Dragon Doge', 'DragonDoge'],
                    realAddress: "0x582daef1f36d6009f64b74519cfd612a8467be18"
                },
                {
                    names: ['Dogechain Token', 'DogeChain Token', 'Dogechain', 'DogeChain'],
                    realAddresses: "0x7b4328c127b85369d9f82ca0503b000d09cf9180"
                }
            ]
        }
    },

    V3_CONTRACTS: {
        POOL_DEPLOYER_ADDRESS: "0x56c2162254b0E4417288786eE402c2B41d4e181e",
        FACTORY_ADDRESS: "0xd2480162Aa7F02Ead7BF4C127465446150D58452",
        QUOTER_ADDRESS: "0xd8E1E7009802c914b0d39B31Fc1759A865b727B1",
        SWAP_ROUTER_ADDRESS: "0x4aE2bD0666c76C7f39311b9B3e39b53C8D7C43Ea",
        NONFUNGIBLE_POSITION_MANAGER_ADDRESS: "0x0b012055F770AE7BB7a8303968A7Fb6088A2296e",
        MULTICALL_ADDRESS: "0x23602819a9E2B1C8eC7605356D5b0F1FBB10ddA5",
        MIGRATOR_ADDRESS: "0xB9aFAa5c407DdebA5098193F31CE23D21cFD9657",
        FARMING_CENTER_ADDRESS: "0x82831E9565cb574375596eFc090da465283E22A4",
        LIMIT_FARMING_ADDRESS: "0x481FcFa00Ee6b2384FF0B3c3b5b29aD911c1AAA7",
        ETERNAL_FARMING_ADDRESS: "0xC712F63E4D57ED1684FB4b428a1DFF10e3338F25",
        POOL_INIT_CODE_HASH: "0x6ec6c9c8091d160c0aa74b2b14ba9c1717e95093bd3ac085cee99a49aab294a4"
    },

    SUBGRAPH: {
        infoURL: "https://dogechain-graph.algebra.finance/subgraphs/name/quickswap/dogechain-info",
        farmingURL: "https://dogechain-graph.algebra.finance/subgraphs/name/quickswap/dogechain-farming",
        blocklyticsURL: "https://dogechain-graph.algebra.finance/subgraphs/name/quickswap/dogechain-blocklytics"
    },

    API: {
        eternalFarmsAPR: "https://api.algebra.finance/api/APR/eternalFarmings/?network=Dogechain-Quickswap",
        limitFarmsAPR: "https://api.algebra.finance/api/APR/limitFarmings/",
        eternalFarmsTVL: "https://api.algebra.finance/api/TVL/eternalFarmings/?network=Dogechain-Quickswap",
        limitFarmsTVL: "https://api.algebra.finance/api/TVL/limitFarmings/",
        poolsAPR: "https://api.algebra.finance/api/APR/pools/?network=Dogechain-Quickswap"
    },

    MISC: {
        title: "Dogechain",
        description: "Swap and provide liquidity on Dogechain",
        appURL: "dogechain.quickswap.exchange"
    }
}