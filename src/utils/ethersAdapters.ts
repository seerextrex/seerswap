import { type PublicClient, type WalletClient } from 'viem';
import { BrowserProvider, JsonRpcSigner, JsonRpcProvider } from 'ethers';
import AlgebraConfig from 'algebra.config';

// Cache providers to prevent creating multiple instances - use different maps for different provider types
const jsonRpcProviderCache = new Map<number, JsonRpcProvider>();
const browserProviderCache = new Map<number, BrowserProvider>();
const signerCache = new Map<string, JsonRpcSigner>();

// Production-mode logger that only logs in development
const logger = {
    debug: (process.env.NODE_ENV === 'development')
        ? (...args: any[]) => console.debug(...args)
        : () => { },
    warn: (...args: any[]) => console.warn(...args),
    error: (...args: any[]) => console.error(...args),
};

// Note: JsonRpcProvider might be an alternative if a direct RPC URL is preferred and available.
// import { JsonRpcProvider, BrowserProvider, JsonRpcSigner } from 'ethers';

/**
 * Converts a wagmi PublicClient to an ethers Provider
 * Uses caching to prevent unnecessary provider recreation
 */
export function publicClientToProvider(publicClient: PublicClient) {
    const { chain, transport } = publicClient;
    if (!chain) {
        throw new Error('Chain not found in PublicClient');
    }

    // Create network object for provider
    const network = {
        chainId: chain.id,
        name: chain.name,
        ensAddress: chain.contracts?.ensRegistry?.address,
    };

    try {
        // For Gnosis chain (id 100), use the RPC URL from AlgebraConfig
        if (chain.id === 100) {
            // Check if we have a cached provider
            if (jsonRpcProviderCache.has(chain.id)) {
                return jsonRpcProviderCache.get(chain.id)!;
            }

            const rpcUrl = AlgebraConfig.CHAIN_PARAMS.rpcURL;
            if (!rpcUrl) {
                throw new Error(`Gnosis RPC URL not found in AlgebraConfig`);
            }
            const provider = new JsonRpcProvider(rpcUrl, network);
            jsonRpcProviderCache.set(chain.id, provider);
            logger.debug(`Created JsonRpcProvider for Gnosis chain using RPC URL from AlgebraConfig`);
            return provider;
        }
        // If it's a standard HTTP transport
        else if (transport.type === 'http' || transport.type === 'webSocket') {
            // Check if we have a cached provider
            if (jsonRpcProviderCache.has(chain.id)) {
                return jsonRpcProviderCache.get(chain.id)!;
            }

            // Use the transport URL if available
            const urls = (transport as any).urls || [];
            if (urls.length > 0) {
                const provider = new JsonRpcProvider(urls[0], network);
                jsonRpcProviderCache.set(chain.id, provider);
                logger.debug(`Created JsonRpcProvider using URL from transport: ${urls[0]}`);
                return provider;
            }
        }

        // For EIP-1193 compatible providers or window.ethereum fallback
        // Check if we have a cached provider
        if (browserProviderCache.has(chain.id)) {
            return browserProviderCache.get(chain.id)!;
        }

        // For EIP-1193 compatible providers
        if (typeof transport === 'object' && transport !== null && 'request' in transport) {
            const provider = new BrowserProvider(transport as any, network);
            browserProviderCache.set(chain.id, provider);
            logger.debug(`Created BrowserProvider from EIP-1193 transport`);
            return provider;
        }
        // Last resort: try window.ethereum
        else if (window.ethereum) {
            const provider = new BrowserProvider(window.ethereum as any, network);
            browserProviderCache.set(chain.id, provider);
            logger.debug(`Created BrowserProvider from window.ethereum`);
            return provider;
        }

        // No viable provider available
        throw new Error(`Cannot initialize ethers Provider for chain ${chain.name}`);
    } catch (error) {
        logger.error(`Error creating provider for chain ${chain.id}:`, error);
        throw error;
    }
}

/**
 * Converts a wagmi WalletClient to an ethers Signer
 * Uses caching to prevent unnecessary signer recreation
 */
export function walletClientToSigner(walletClient: WalletClient) {
    const { account, chain, transport } = walletClient;
    if (!account) {
        throw new Error('Account not found in WalletClient');
    }
    if (!chain) {
        throw new Error('Chain not found in WalletClient');
    }

    // Create a cache key using chain ID and account address
    const cacheKey = `${chain.id}-${account.address}`;

    // Return cached signer if it exists
    if (signerCache.has(cacheKey)) {
        return signerCache.get(cacheKey)!;
    }

    try {
        // Create network object for provider
        const network = {
            chainId: chain.id,
            name: chain.name,
            ensAddress: chain.contracts?.ensRegistry?.address,
        };

        // Create provider from transport
        const provider = new BrowserProvider(transport as any, network);

        // Create signer from provider and account
        const signer = new JsonRpcSigner(provider, account.address);

        // Cache the signer
        signerCache.set(cacheKey, signer);

        return signer;
    } catch (error) {
        logger.error(`Error creating signer for account ${account.address} on chain ${chain.id}:`, error);
        throw error;
    }
}

/**
 * Clears provider and signer caches
 * Useful when changing networks or accounts
 */
export function clearProviderCache() {
    jsonRpcProviderCache.clear();
    browserProviderCache.clear();
    signerCache.clear();
    logger.debug('Provider and signer caches cleared');
} 