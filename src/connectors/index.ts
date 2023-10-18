import { CoinbaseWallet } from "@web3-react/coinbase-wallet";
import { initializeConnector, Web3ReactHooks } from "@web3-react/core";
import { GnosisSafe } from "@web3-react/gnosis-safe";
import { MetaMask } from "@web3-react/metamask";
import { Network } from "@web3-react/network";
import { Connector } from "@web3-react/types";
import { WalletConnect } from "@web3-react/walletconnect-v2";
import { useMemo } from "react";

import SWAPR_LOGO_URL from "../assets/images/swapr-logo.svg";
import algebraConfig from "../algebra.config";

export enum Wallet {
    INJECTED = "INJECTED",
    COINBASE_WALLET = "COINBASE_WALLET",
    WALLET_CONNECT = "WALLET_CONNECT",
    NETWORK = "NETWORK",
    GNOSIS_SAFE = "GNOSIS_SAFE",
}

export const BACKFILLABLE_WALLETS = [Wallet.COINBASE_WALLET, Wallet.WALLET_CONNECT, Wallet.INJECTED];
export const SELECTABLE_WALLETS = [...BACKFILLABLE_WALLETS];

function onError(error: Error) {
    console.debug(`web3-react error: ${error}`);
}

export function getWalletForConnector(connector: Connector) {
    switch (connector) {
        case injected:
            return Wallet.INJECTED;
        case coinbaseWallet:
            return Wallet.COINBASE_WALLET;
        case walletConnect:
            return Wallet.WALLET_CONNECT;
        case network:
            return Wallet.NETWORK;
        case gnosisSafe:
            return Wallet.GNOSIS_SAFE;
        default:
            throw Error("unsupported connector");
    }
}

export function getConnectorForWallet(wallet: Wallet) {
    switch (wallet) {
        case Wallet.INJECTED:
            return injected;
        case Wallet.COINBASE_WALLET:
            return coinbaseWallet;
        case Wallet.WALLET_CONNECT:
            return walletConnect;
        case Wallet.NETWORK:
            return network;
        case Wallet.GNOSIS_SAFE:
            return gnosisSafe;
    }
}

function getHooksForWallet(wallet: Wallet) {
    switch (wallet) {
        case Wallet.INJECTED:
            return injectedHooks;
        case Wallet.COINBASE_WALLET:
            return coinbaseWalletHooks;
        case Wallet.WALLET_CONNECT:
            return walletConnectHooks;
        case Wallet.NETWORK:
            return networkHooks;
        case Wallet.GNOSIS_SAFE:
            return gnosisSafeHooks;
    }
}

const rpcUrlMap = { [algebraConfig.CHAIN_PARAMS.chainId]: algebraConfig.CHAIN_PARAMS.rpcURL };

export const [network, networkHooks] = initializeConnector<Network>((actions) => new Network({ actions, urlMap: rpcUrlMap, defaultChainId: algebraConfig.CHAIN_PARAMS.chainId }));

export const [injected, injectedHooks] = initializeConnector<MetaMask>((actions) => new MetaMask({ actions, onError }));

export const [gnosisSafe, gnosisSafeHooks] = initializeConnector<GnosisSafe>((actions) => new GnosisSafe({ actions }));

export const [walletConnect, walletConnectHooks] = initializeConnector<WalletConnect>(
    (actions) =>
        new WalletConnect({
            actions,
            options: {
                projectId: process.env.REACT_APP_WALLET_CONNECT_PROJECT_ID as string,
                chains: [algebraConfig.CHAIN_PARAMS.chainId],
                rpcMap: rpcUrlMap,
                showQrModal: true,
                optionalMethods: ["eth_signTypedData", "eth_signTypedData_v4", "eth_sign", "eth_sendTransaction"],
                qrModalOptions: {
                    themeVariables: {
                        "--wcm-z-index": "199",
                    },
                },
            },
            onError,
        })
);

export const [coinbaseWallet, coinbaseWalletHooks] = initializeConnector<CoinbaseWallet>(
    (actions) =>
        new CoinbaseWallet({
            actions,
            options: {
                url: algebraConfig.CHAIN_PARAMS.rpcURL,
                appName: "Swapr Liquidity",
                appLogoUrl: SWAPR_LOGO_URL,
            },
            onError,
        })
);

interface ConnectorListItem {
    connector: Connector;
    hooks: Web3ReactHooks;
}

function getConnectorListItemForWallet(wallet: Wallet) {
    return {
        connector: getConnectorForWallet(wallet),
        hooks: getHooksForWallet(wallet),
    };
}

export function useConnectors(selectedWallet: Wallet | undefined) {
    return useMemo(() => {
        const connectors: ConnectorListItem[] = [{ connector: gnosisSafe, hooks: gnosisSafeHooks }];
        if (selectedWallet) {
            connectors.push(getConnectorListItemForWallet(selectedWallet));
        }
        connectors.push(...SELECTABLE_WALLETS.filter((wallet) => wallet !== selectedWallet).map(getConnectorListItemForWallet));
        connectors.push({ connector: network, hooks: networkHooks });
        const web3ReactConnectors: [Connector, Web3ReactHooks][] = connectors.map(({ connector, hooks }) => [connector, hooks]);
        return web3ReactConnectors;
    }, [selectedWallet]);
}
