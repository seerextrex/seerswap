/**
 * Utility functions for handling BigInt conversions consistently across the application
 */

/**
 * Safely converts any value to a BigInt
 * Handles ethers v5 BigNumber, strings, numbers, and existing BigInts
 * Returns BigInt(0) for invalid or undefined values
 */
export const safeConvertToBigInt = (value: any): bigint => {
    if (value === undefined || value === null) return BigInt(0);

    if (typeof value === 'bigint') return value;

    // Handle ethers v5 BigNumber objects which have a toString method
    if (value && typeof value.toString === 'function') {
        try {
            return BigInt(value.toString());
        } catch (e) {
            console.warn("Failed to convert value to BigInt:", value, e);
            return BigInt(0);
        }
    }

    // Handle strings and numbers
    try {
        return BigInt(value);
    } catch (e) {
        console.warn("Failed to convert value to BigInt directly:", value, e);
        return BigInt(0);
    }
};

/**
 * Safely compares two BigInt values, handling undefined and conversion
 */
export const areBigIntsEqual = (a: any, b: any): boolean => {
    if (a === b) return true;
    const aBigInt = safeConvertToBigInt(a);
    const bBigInt = safeConvertToBigInt(b);
    return aBigInt === bBigInt;
};

/**
 * Deep equality check for objects containing BigInts
 * More efficient than JSON.stringify comparison
 */
export const deepEqual = (obj1: any, obj2: any): boolean => {
    if (obj1 === obj2) return true;
    if (obj1 === null || obj2 === null) return false;
    if (obj1 === undefined || obj2 === undefined) return false;

    if (typeof obj1 === 'bigint' && typeof obj2 === 'bigint') {
        return obj1 === obj2;
    }

    if (typeof obj1 !== 'object' || typeof obj2 !== 'object') {
        return obj1 === obj2;
    }

    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);

    if (keys1.length !== keys2.length) return false;

    return keys1.every(key =>
        keys2.includes(key) && deepEqual(obj1[key], obj2[key])
    );
};

/**
 * Creates a stable array of BigInts for use in dependency arrays
 */
export const createStableBigIntArray = (arr: any[]): string => {
    if (!arr || !Array.isArray(arr)) return '';
    return arr.map(val => safeConvertToBigInt(val).toString()).join(',');
}; 