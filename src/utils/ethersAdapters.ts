import { type PublicClient, type WalletClient } from 'viem';
import { BrowserProvider, JsonRpcSigner, JsonRpcProvider } from 'ethers';
import AlgebraConfig from 'algebra.config';

// Note: JsonRpcProvider might be an alternative if a direct RPC URL is preferred and available.
// import { JsonRpcProvider, BrowserProvider, JsonRpcSigner } from 'ethers';

export function publicClientToProvider(publicClient: PublicClient) {
    const { chain, transport } = publicClient;
    if (!chain) {
        throw new Error('Chain not found in PublicClient');
    }
    const network = {
        chainId: chain.id,
        name: chain.name,
        ensAddress: chain.contracts?.ensRegistry?.address,
    };

    // Check if the current publicClient's chain is Gnosis (id 100)
    // and use the specific RPC URL from AlgebraConfig.
    // This logic would need to be expanded if supporting multiple chains with different RPCs.
    if ((transport.type === 'http' || transport.type === 'webSocket') && chain.id === 100) { // Gnosis chain ID
        const rpcUrl = AlgebraConfig.CHAIN_PARAMS.rpcURL;
        if (!rpcUrl) {
            throw new Error(`Gnosis RPC URL not found in AlgebraConfig for chain ${chain.id} to initialize JsonRpcProvider`);
        }
        return new JsonRpcProvider(rpcUrl, network);
    }

    // If it's a fallback or another EIP-1193 compatible transport (like from a browser wallet injection)
    // Check for EIP-1193 'request' method as a heuristic, or rely on window.ethereum.
    // The 'transport' object from usePublicClient (if not http/ws) might itself be the EIP-1193 provider.
    if (transport.type === 'fallback' || (typeof transport === 'object' && transport !== null && 'request' in transport)) {
        const eip1193Provider = (typeof transport === 'object' && transport !== null && 'request' in transport) ? transport : window.ethereum;
        if (!eip1193Provider) {
            // This case should be rare if a wallet is connected or window.ethereum is present
            console.warn("EIP-1193 provider not available from transport or window.ethereum for BrowserProvider. Attempting specific RPC if Gnosis.");
            if (chain.id === 100 && AlgebraConfig.CHAIN_PARAMS.rpcURL) { // Gnosis Chain ID
                return new JsonRpcProvider(AlgebraConfig.CHAIN_PARAMS.rpcURL, network);
            }
            throw new Error("EIP-1193 provider not available and no fallback RPC configured.");
        }
        return new BrowserProvider(eip1193Provider as any, network);
    }

    // Last resort: if transport type is unknown, try window.ethereum if available.
    console.warn(`Unknown or incompatible transport type: ${transport['type']} for chain ${chain.name}. Attempting to use window.ethereum if available.`);
    if (window.ethereum) {
        return new BrowserProvider(window.ethereum as any, network);
    }

    // If truly no way to get a provider (e.g. http transport for a non-gnosis chain without explicit RPC url handling)
    // Or if window.ethereum is not available for some reason.
    throw new Error(`Cannot initialize ethers Provider for chain ${chain.name} with transport type ${transport['type']}. No suitable EIP-1193 provider or RPC URL found.`);
}

export function walletClientToSigner(walletClient: WalletClient) {
    const { account, chain, transport } = walletClient;
    if (!account) {
        throw new Error('Account not found in WalletClient');
    }
    if (!chain) {
        throw new Error('Chain not found in WalletClient');
    }
    const network = {
        chainId: chain.id,
        name: chain.name,
        ensAddress: chain.contracts?.ensRegistry?.address,
    };
    // transport from WalletClient should be an EIP-1193 provider from the actual wallet
    // (e.g., MetaMask, WalletConnect's provider)
    const provider = new BrowserProvider(transport as any, network);
    const signer = new JsonRpcSigner(provider, account.address);
    return signer;
} 