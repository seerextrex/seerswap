import WDOGE_LOGO from "./assets/images/doge-logo.png";
import USDC_LOGO from "./assets/svg/usd-coin-usdc-logo.svg";
import ETH_LOGO from "./assets/images/ether-logo.png";

export default {
    CHAIN_PARAMS: {
        chainId: 100,
        chainIdHex: "0x64",
        chainName: "Gnosis Chain",
        wrappedNativeCurrency: { name: "Wrapped XDAI", symbol: "WXDAI", decimals: 18, address: "0xe91D153E0b41518A2Ce8Dd3D7944Fa863463a97d", logo: WDOGE_LOGO },
        rpcURL: "https://rpc.gnosis.gateway.fm",
        blockExplorerURL: "gnosisscan.io",
    },

    // Token addresses should be in lowercase
    DEFAULT_TOKEN_LIST: {
        // Tokens, which would be displayed on the top of Token Selector Modal
        defaultTokens: {
            ["0x532801ED6f82FFfD2DAB70A19fC2d7B2772C4f4b"]: {
                name: "Swapr on Gnosis chain",
                symbol: "SWPR",
                decimals: 18,
            },
            ["0x6A023CCd1ff6F2045C3309768eAd9E68F978f6e1"]: {
                name: "Wrapped Ether on Gnosis chain",
                symbol: "WETH",
                decimals: 18,
            },
            ["0x9C58BAcC331c9aa871AFD802DB6379a98e80CEdb"]: {
                name: "Gnosis Token on Gnosis chain",
                symbol: "GNO",
                decimals: 18,
            },
            ["0x8e5bBbb09Ed1ebdE8674Cda39A0c169401db4252"]: {
                name: "Wrapped BTC on Gnosis",
                symbol: "WBTC",
                decimals: 8,
            },
            ["0xDDAfbb505ad214D7b80b1f830fcCc89B60fb7A83"]: {
                name: "USD//C on Gnosis",
                symbol: "USDC",
                decimals: 6,
            },
        },
        // Tokens, which would be used for creating multihop routes
        tokensForMultihop: {
            ["0x6A023CCd1ff6F2045C3309768eAd9E68F978f6e1"]: {
                name: "Wrapped Ether on Gnosis chain",
                symbol: "WETH",
                decimals: 18,
            },
            ["0x9C58BAcC331c9aa871AFD802DB6379a98e80CEdb"]: {
                name: "Gnosis Token on Gnosis chain",
                symbol: "GNO",
                decimals: 18,
            },
            ["0xDDAfbb505ad214D7b80b1f830fcCc89B60fb7A83"]: {
                name: "USD//C on Gnosis",
                symbol: "USDC",
                decimals: 6,
            },
        },
        tokensLogos: {
            ["0x6A023CCd1ff6F2045C3309768eAd9E68F978f6e1"]: ETH_LOGO,
            ["0xDDAfbb505ad214D7b80b1f830fcCc89B60fb7A83"]: USDC_LOGO,
        },
        stableTokens: {
            ["0xDDAfbb505ad214D7b80b1f830fcCc89B60fb7A83"]: { name: "USD//C on Gnosis", symbol: "USDC", decimals: 6 },
        },
        stableTokenForUSDPrice: { address: "0xDDAfbb505ad214D7b80b1f830fcCc89B60fb7A83", name: "USD//C on Gnosis", symbol: "USDC", decimals: 6 },
        // Real tokens and their possible fake names. Used for token launch safety
        filterForScamTokens: {
            tokensForCheck: {
                ["DD"]: "0x582daef1f36d6009f64b74519cfd612a8467be18",
                ["DC"]: "0x7b4328c127b85369d9f82ca0503b000d09cf9180",
            },
            possibleFakeNames: [
                {
                    names: ["Doge Dragon", "DogeDragon", "Dragon Doge", "DragonDoge"],
                    realAddress: "0x582daef1f36d6009f64b74519cfd612a8467be18",
                },
                {
                    names: ["Dogechain Token", "DogeChain Token", "Dogechain", "DogeChain"],
                    realAddresses: "0x7b4328c127b85369d9f82ca0503b000d09cf9180",
                },
            ],
        },
    },

    V3_CONTRACTS: {
        POOL_DEPLOYER_ADDRESS: "0xC1b576AC6Ec749d5Ace1787bF9Ec6340908ddB47",
        FACTORY_ADDRESS: "0xA0864cCA6E114013AB0e27cbd5B6f4c8947da766",
        QUOTER_ADDRESS: "0xcBaD9FDf0D2814659Eb26f600EFDeAF005Eda0F7",
        SWAP_ROUTER_ADDRESS: "0xfFB643E73f280B97809A8b41f7232AB401a04ee1",
        NONFUNGIBLE_POSITION_MANAGER_ADDRESS: "0x91fD594c46D8B01E62dBDeBed2401dde01817834",
        MULTICALL_ADDRESS: "0xc4B85BaF01cD7D1C8F08a8539ba96C205782BBcf",
        MIGRATOR_ADDRESS: "",
        FARMING_CENTER_ADDRESS: "0xDe51dDF1aE7d5BBD7bF1A0e40aAA1F6C12579106",
        LIMIT_FARMING_ADDRESS: "0xA01e2785d2D04cC0a09Bde9C3eA49Bf0aD7811F2",
        ETERNAL_FARMING_ADDRESS: "0x607BbfD4CEbd869AaD04331F8a2AD0C3C396674b",
        POOL_INIT_CODE_HASH: "0xbce37a54eab2fcd71913a0d40723e04238970e7fc1159bfd58ad5b79531697e7",
    },

    SUBGRAPH: {
        infoURL: "https://dogechain-graph.algebra.finance/subgraphs/name/quickswap/dogechain-info",
        farmingURL: "https://dogechain-graph.algebra.finance/subgraphs/name/quickswap/dogechain-farming",
        blocklyticsURL: "https://dogechain-graph.algebra.finance/subgraphs/name/quickswap/dogechain-blocklytics",
    },

    API: {
        eternalFarmsAPR: "https://api.algebra.finance/api/APR/eternalFarmings/?network=Dogechain-Quickswap",
        limitFarmsAPR: "https://api.algebra.finance/api/APR/limitFarmings/",
        eternalFarmsTVL: "https://api.algebra.finance/api/TVL/eternalFarmings/?network=Dogechain-Quickswap",
        limitFarmsTVL: "https://api.algebra.finance/api/TVL/limitFarmings/",
        poolsAPR: "https://api.algebra.finance/api/APR/pools/?network=Dogechain-Quickswap",
    },

    MISC: {
        title: "Liqudity | Swapr",
        description: "Concetraded liquidity on Gnosis Chain",
        appURL: "swapr.eth.limo",
    },
};
