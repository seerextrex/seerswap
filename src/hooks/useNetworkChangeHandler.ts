import { useCallback, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { clearProviderCache } from '../utils/ethersAdapters';

// Define the ethereum window type
interface EthereumWindow extends Window {
    ethereum?: {
        on: (event: string, callback: any) => void;
        removeListener: (event: string, callback: any) => void;
    };
}

/**
 * A hook that handles network and account changes
 * Clears provider and signer caches when network or account changes
 */
export function useNetworkChangeHandler() {
    const { address, chain } = useAccount();

    // Handle network or account changes
    const handleNetworkOrAccountChange = useCallback(() => {
        // Clear provider and signer caches
        clearProviderCache();
    }, []);

    // Listen for chain changes
    useEffect(() => {
        handleNetworkOrAccountChange();
    }, [chain?.id, handleNetworkOrAccountChange]);

    // Listen for address changes
    useEffect(() => {
        handleNetworkOrAccountChange();
    }, [address, handleNetworkOrAccountChange]);

    // Listen for window.ethereum events
    useEffect(() => {
        const ethereum = (window as EthereumWindow).ethereum;
        if (!ethereum) return;

        const handleChainChanged = () => {
            handleNetworkOrAccountChange();
        };

        const handleAccountsChanged = () => {
            handleNetworkOrAccountChange();
        };

        ethereum.on('chainChanged', handleChainChanged);
        ethereum.on('accountsChanged', handleAccountsChanged);

        return () => {
            ethereum.removeListener('chainChanged', handleChainChanged);
            ethereum.removeListener('accountsChanged', handleAccountsChanged);
        };
    }, [handleNetworkOrAccountChange]);

    return null;
} 