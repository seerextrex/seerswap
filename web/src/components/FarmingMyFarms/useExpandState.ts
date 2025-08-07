import { useState, useCallback, useMemo } from 'react';

export interface UseExpandStateResult {
    // State getters
    isExpanded: (key: string) => boolean;
    expandedKeys: Set<string>;
    
    // State setters
    toggle: (key: string) => void;
    expand: (key: string) => void;
    collapse: (key: string) => void;
    expandAll: (keys: string[]) => void;
    collapseAll: () => void;
    
    // Batch operations
    expandMultiple: (keys: string[]) => void;
    collapseMultiple: (keys: string[]) => void;
}

/**
 * Custom hook for managing expand/collapse state
 * Consolidates multiple Set<string> states into a single manageable interface
 */
export function useExpandState(initialExpanded: string[] = []): UseExpandStateResult {
    const [expandedKeys, setExpandedKeys] = useState<Set<string>>(
        new Set(initialExpanded)
    );
    
    const isExpanded = useCallback((key: string) => {
        return expandedKeys.has(key);
    }, [expandedKeys]);
    
    const toggle = useCallback((key: string) => {
        setExpandedKeys(prev => {
            const newSet = new Set(prev);
            if (newSet.has(key)) {
                newSet.delete(key);
            } else {
                newSet.add(key);
            }
            return newSet;
        });
    }, []);
    
    const expand = useCallback((key: string) => {
        setExpandedKeys(prev => {
            if (prev.has(key)) return prev;
            const newSet = new Set(prev);
            newSet.add(key);
            return newSet;
        });
    }, []);
    
    const collapse = useCallback((key: string) => {
        setExpandedKeys(prev => {
            if (!prev.has(key)) return prev;
            const newSet = new Set(prev);
            newSet.delete(key);
            return newSet;
        });
    }, []);
    
    const expandAll = useCallback((keys: string[]) => {
        setExpandedKeys(new Set(keys));
    }, []);
    
    const collapseAll = useCallback(() => {
        setExpandedKeys(new Set());
    }, []);
    
    const expandMultiple = useCallback((keys: string[]) => {
        setExpandedKeys(prev => {
            const newSet = new Set(prev);
            keys.forEach(key => newSet.add(key));
            return newSet;
        });
    }, []);
    
    const collapseMultiple = useCallback((keys: string[]) => {
        setExpandedKeys(prev => {
            const newSet = new Set(prev);
            keys.forEach(key => newSet.delete(key));
            return newSet;
        });
    }, []);
    
    return {
        isExpanded,
        expandedKeys,
        toggle,
        expand,
        collapse,
        expandAll,
        collapseAll,
        expandMultiple,
        collapseMultiple,
    };
}

/**
 * Hook for managing hierarchical expand state (markets, child markets, outcomes)
 */
export interface HierarchicalExpandState {
    markets: UseExpandStateResult;
    childMarkets: UseExpandStateResult;
    outcomes: UseExpandStateResult;
    
    // Convenience methods
    toggleMarket: (marketKey: string) => void;
    toggleChildMarket: (childKey: string) => void;
    toggleOutcome: (outcomeKey: string) => void;
    expandAllHierarchy: (marketKeys: string[], childKeys: string[], outcomeKeys?: string[]) => void;
    collapseAllHierarchy: () => void;
}

export function useHierarchicalExpandState(): HierarchicalExpandState {
    const markets = useExpandState();
    const childMarkets = useExpandState();
    const outcomes = useExpandState();
    
    const expandAllHierarchy = useCallback((
        marketKeys: string[],
        childKeys: string[],
        outcomeKeys: string[] = []
    ) => {
        markets.expandAll(marketKeys);
        childMarkets.expandAll(childKeys);
        if (outcomeKeys.length > 0) {
            outcomes.expandAll(outcomeKeys);
        }
    }, [markets, childMarkets, outcomes]);
    
    const collapseAllHierarchy = useCallback(() => {
        markets.collapseAll();
        childMarkets.collapseAll();
        outcomes.collapseAll();
    }, [markets, childMarkets, outcomes]);
    
    return {
        markets,
        childMarkets,
        outcomes,
        toggleMarket: markets.toggle,
        toggleChildMarket: childMarkets.toggle,
        toggleOutcome: outcomes.toggle,
        expandAllHierarchy,
        collapseAllHierarchy,
    };
}