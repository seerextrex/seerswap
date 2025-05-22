/**
 * Utility functions to help clean up WalletConnect sessions and prevent duplicate instances
 */

/**
 * Cleans up any stale or orphaned WalletConnect sessions from localStorage
 * This helps prevent the multiple popup issue by ensuring old sessions are removed
 */
export function cleanupWalletConnectSessions(): void {
    try {
        // Look for WalletConnect related items in localStorage
        const walletConnectKeys: string[] = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && (
                key.startsWith('wc@2:') ||
                key.startsWith('wagmi.') ||
                key.startsWith('walletconnect') ||
                key.includes('walletlink')
            )) {
                walletConnectKeys.push(key);
            }
        }

        // Keep track of active sessions based on timestamp
        const now = Date.now();
        const oneHourAgo = now - (60 * 60 * 1000);

        // Check each key and remove stale ones
        walletConnectKeys.forEach(key => {
            try {
                const data = JSON.parse(localStorage.getItem(key) || '{}');

                // If the session has a timestamp more than an hour old, or lacks expected properties, remove it
                if (
                    !data ||
                    (data.timestamp && data.timestamp < oneHourAgo) ||
                    (key.startsWith('wc@2:') && (!data.pairingTopic || !data.sessionTopic))
                ) {
                    localStorage.removeItem(key);
                    console.log(`Cleaned up stale WalletConnect session: ${key}`);
                }
            } catch (e) {
                // If we can't parse the data, it's likely corrupted
                localStorage.removeItem(key);
                console.log(`Removed corrupted WalletConnect session: ${key}`);
            }
        });
    } catch (error) {
        console.error('Error cleaning up WalletConnect sessions:', error);
    }
}

/**
 * Helper function to handle connection errors
 * @param error - The error from a failed connection attempt
 */
export function handleWalletConnectError(error: any): void {
    console.error('WalletConnect error:', error);

    // If the error is related to an existing session, clean up sessions
    if (
        error?.message?.includes('Session already exists') ||
        error?.message?.includes('Pairing already exists') ||
        error?.message?.includes('Missing or invalid') ||
        error?.message?.includes('duplicate')
    ) {
        cleanupWalletConnectSessions();
    }
}

// Cleanup on initial load
cleanupWalletConnectSessions(); 