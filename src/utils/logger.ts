/**
 * Custom logger that can be easily toggled off in production
 * Provides same interface as console but can be controlled globally
 */

// Set this to false to disable all debug logs in production
const DEBUG_ENABLED = process.env.NODE_ENV === 'development';

/**
 * Logger utility that wraps console functions but can be disabled in production
 */
const logger = {
    // Always enabled logs (errors, warnings)
    error: (...args: any[]) => console.error(...args),
    warn: (...args: any[]) => console.warn(...args),

    // Development-only logs (can be toggled off)
    log: DEBUG_ENABLED ? (...args: any[]) => console.log(...args) : () => { },
    debug: DEBUG_ENABLED ? (...args: any[]) => console.debug(...args) : () => { },
    info: DEBUG_ENABLED ? (...args: any[]) => console.info(...args) : () => { },

    // Create a named logger for specific components
    create: (namespace: string) => ({
        error: (...args: any[]) => console.error(`[${namespace}]`, ...args),
        warn: (...args: any[]) => console.warn(`[${namespace}]`, ...args),
        log: DEBUG_ENABLED ? (...args: any[]) => console.log(`[${namespace}]`, ...args) : () => { },
        debug: DEBUG_ENABLED ? (...args: any[]) => console.debug(`[${namespace}]`, ...args) : () => { },
        info: DEBUG_ENABLED ? (...args: any[]) => console.info(`[${namespace}]`, ...args) : () => { },
    }),

    // Enable all logs (for debugging)
    enableAll: () => {
        Object.defineProperty(logger, 'log', { value: (...args: any[]) => console.log(...args) });
        Object.defineProperty(logger, 'debug', { value: (...args: any[]) => console.debug(...args) });
        Object.defineProperty(logger, 'info', { value: (...args: any[]) => console.info(...args) });
    },

    // Disable non-critical logs (for production)
    disableDebugLogs: () => {
        Object.defineProperty(logger, 'log', { value: () => { } });
        Object.defineProperty(logger, 'debug', { value: () => { } });
        Object.defineProperty(logger, 'info', { value: () => { } });
    },
};

export default logger; 