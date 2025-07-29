import BCSPX_LOGO from "./assets/images/bcspx-logo.svg";
import WXDAI_LOGO from "./assets/images/wxdai.png";
import XDAI_LOGO from "./assets/images/xdai.png";
import USDC_LOGO from "./assets/images/usdc.png";
import WETH_LOGO from "./assets/images/weth.png";
import WBTC_LOGO from "./assets/images/wbtc.png";
import EURE_LOGO from "./assets/images/eure-logo.svg";
import SDAI_LOGO from "./assets/images/sdai-logo.svg";
import EURA_LOGO from "./assets/images/eura-logo.svg";
import WSTETH_LOGO from "./assets/images/wsteth-logo.svg";
import PNK_LOGO from "./assets/images/pnk-logo.svg";

const SUBGRAPH_API_KEY = process.env.REACT_APP_SUBGRAPH_API_KEY || "";

export default {
    CHAIN_PARAMS: {
        chainId: 100,
        chainIdHex: "0x64",
        chainName: "Gnosis",
        nativeCurrency: { name: "xDAI", symbol: "XDAI", decimals: 18, logo: XDAI_LOGO },
        wrappedNativeCurrency: { name: "Wrapped XDAI", symbol: "WXDAI", decimals: 18, address: "0xe91D153E0b41518A2Ce8Dd3D7944Fa863463a97d", logo: WXDAI_LOGO },
        rpcURL: "https://rpc.gnosis.gateway.fm",
        blockExplorerURL: "https://gnosisscan.io",
        blockExplorerDomain: "gnosisscan.io",
    },

    // Token addresses should be in lowercase
    DEFAULT_TOKEN_LIST: {
        // Tokens, which would be displayed on the top of Token Selector Modal
        defaultTokens: {
            //xdai, sdai
            ["0xaf204776c7245bf4147c2612bf6e5972ee483701"]: {
                name: "Savings xDAI",
                symbol: "sDAI",
                decimals: 18,
            }

            /*
            ["0x6A023CCd1ff6F2045C3309768eAd9E68F978f6e1"]: {
                name: "Wrapped Ether on Gnosis chain",
                symbol: "WETH",
                decimals: 18,
            },
            ["0xDDAfbb505ad214D7b80b1f830fcCc89B60fb7A83"]: {
                name: "USD//C on Gnosis",
                symbol: "USDC",
                decimals: 6,
            },
            ["0x1e2c4fb7ede391d116e6b41cd0608260e8801d59"]: {
                name: "Backed CSPX",
                symbol: "bCSPX",
                decimals: 18,
            },*/
        },
        // Tokens, which would be used for creating multihop routes
        tokensForMultihop: {
        },
        tokensLogos: {
            ["0x1e2c4fb7ede391d116e6b41cd0608260e8801d59"]: BCSPX_LOGO,
            ["0xe91D153E0b41518A2Ce8Dd3D7944Fa863463a97d"]: WXDAI_LOGO,
            ["0x6a023ccd1ff6f2045c3309768ead9e68f978f6e1"]: WETH_LOGO,
            ["0x8e5bbbb09ed1ebde8674cda39a0c169401db4252"]: WBTC_LOGO,
            ["0xddafbb505ad214d7b80b1f830fccc89b60fb7a83"]: USDC_LOGO,
            ["0xcb444e90d8198415266c6a2724b7900fb12fc56e"]: EURE_LOGO,
            ["0xaf204776c7245bf4147c2612bf6e5972ee483701"]: SDAI_LOGO,
            ["0x4b1e2c2762667331bc91648052f646d1b0d35984"]: EURA_LOGO,
            ["0x6c76971f98945ae98dd7d4dfca8711ebea946ea6"]: WSTETH_LOGO,
            ["0x37b60f4e9a31a64ccc0024dce7d0fd07eaa0f7b3"]: PNK_LOGO,
            ["0x2a22f9c3b484c3629090FeED35F17Ff8F88f76F0"]: USDC_LOGO, // USDC.e (bridged)
        },
        stableTokens: {
            ["0xDDAfbb505ad214D7b80b1f830fcCc89B60fb7A83"]: { name: "USD//C on Gnosis", symbol: "USDC", decimals: 6 },
        },
        stableTokenForUSDPrice: { address: "0xDDAfbb505ad214D7b80b1f830fcCc89B60fb7A83", name: "USD//C on Gnosis", symbol: "USDC", decimals: 6 },
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
        blocklyticsURL: `https://gateway.thegraph.com/api/${SUBGRAPH_API_KEY}/subgraphs/id/FSFGfeobVFdtoWnGkULtLQ5vYu38tc9BxYR1e1yXjVPZ`,
        infoURL: `https://api.studio.thegraph.com/query/111511/seer-swap/version/latest`,
        farmingURL: `https://api.studio.thegraph.com/query/111511/seer-swap/version/latest`,
    },

    API: {
        eternalFarmsAPR: "https://algebra.swaprhq.io/api/APR/eternalFarmings/?network=gnosis",
        limitFarmsAPR: "https://algebra.swaprhq.io/api/APR/limitFarmings/?network=gnosis",
        eternalFarmsTVL: "https://algebra.swaprhq.io/api/TVL/eternalFarmings/?network=gnosis",
        limitFarmsTVL: "https://algebra.swaprhq.io/api/TVL/limitFarmings/?network=gnosis",
        poolsAPR: "https://algebra.swaprhq.io/api/APR/pools/?network=gnosis",
    },

    MISC: {
        title: "Liqudity | SeerSwap",
        description: "Trade and provide liquidity on SeerSwap",
        appURL: "https://app.seerswap.org",
    },
};
