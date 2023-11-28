import WXDAI_LOGO from "./assets/images/wxdai.png";
import XDAI_LOGO from "./assets/images/xdai.png";
import USDC_LOGO from "./assets/images/usdc.png";
import WETH_LOGO from "./assets/images/weth.png";
import SWAPR_LOGO from "./assets/images/swapr.png";
import WBTC_LOGO from "./assets/images/wbtc.png";
import GNO_LOGO from "./assets/images/gno.png";

export default {
    CHAIN_PARAMS: {
        chainId: 100,
        chainIdHex: "0x64",
        chainName: "Gnosis Chain",
        nativeCurrency: { name: "XDAI", symbol: "XDAI", decimals: 18, logo: XDAI_LOGO },
        wrappedNativeCurrency: { name: "Wrapped XDAI", symbol: "WXDAI", decimals: 18, address: "0xe91D153E0b41518A2Ce8Dd3D7944Fa863463a97d", logo: WXDAI_LOGO },
        rpcURL: "https://rpc.gnosis.gateway.fm",
        blockExplorerURL: "https://gnosisscan.io",
        blockExplorerDomain: "gnosisscan.io",
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
            ["0xe91D153E0b41518A2Ce8Dd3D7944Fa863463a97d"]: WXDAI_LOGO,
            ["0x532801ed6f82fffd2dab70a19fc2d7b2772c4f4b"]: SWAPR_LOGO,
            ["0x6a023ccd1ff6f2045c3309768ead9e68f978f6e1"]: WETH_LOGO,
            ["0x9c58bacc331c9aa871afd802db6379a98e80cedb"]: GNO_LOGO,
            ["0x8e5bbbb09ed1ebde8674cda39a0c169401db4252"]: WBTC_LOGO,
            ["0xddafbb505ad214d7b80b1f830fccc89b60fb7a83"]: USDC_LOGO,
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
        infoURL: "https://api.thegraph.com/subgraphs/name/swaprhq/algebra-v19",
        farmingURL: "https://api.thegraph.com/subgraphs/name/swaprhq/algebrafarming-v19",
        blocklyticsURL: "https://api.thegraph.com/subgraphs/name/swaprhq/algebrablocks-v19",
    },

    API: {
        eternalFarmsAPR: "https://algebra.swaprhq.io/api/APR/eternalFarmings/",
        limitFarmsAPR: "https://algebra.swaprhq.io/api/APR/limitFarmings/",
        eternalFarmsTVL: "https://algebra.swaprhq.io/api/TVL/eternalFarmings/",
        limitFarmsTVL: "https://algebra.swaprhq.io/api/TVL/limitFarmings/",
        poolsAPR: "https://algebra.swaprhq.io/api/APR/pools/",
    },

    MISC: {
        title: "Liqudity | Swapr",
        description: "Concetraded liquidity on Gnosis Chain",
        appURL: "https://swapr.liquidity.eth.limo",
    },
};
