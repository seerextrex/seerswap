import { FunctionFragment, Interface } from "ethers";
import { Contract } from "ethers";
import { useEffect, useMemo, useRef } from "react";
import { useAppDispatch, useAppSelector } from "state/hooks";
import { useAccount } from "wagmi";
import { useBlockNumber } from "../application/hooks";
import { addMulticallListeners, ListenerOptions, removeMulticallListeners } from "./actions";
export type { ListenerOptions };
import { Call, parseCallKey, toCallKey } from "./utils";

export interface Result extends ReadonlyArray<any> {
    readonly [key: string]: any;
}

type MethodArg = string | number | bigint;
type MethodArgs = Array<MethodArg | MethodArg[]>;

type OptionalMethodInputs = Array<MethodArg | MethodArg[] | undefined> | undefined;

function isMethodArg(x: unknown): x is MethodArg {
    return typeof x === 'bigint' || typeof x === 'string' || typeof x === 'number';
}

function isValidMethodArgs(x: unknown): x is MethodArgs | undefined {
    return x === undefined || (Array.isArray(x) && x.every((xi) => isMethodArg(xi) || (Array.isArray(xi) && xi.every(isMethodArg))));
}

interface CallResult {
    readonly valid: boolean;
    readonly data: string | undefined;
    readonly blockNumber: number | undefined;
}

const INVALID_RESULT: CallResult = { valid: false, blockNumber: undefined, data: undefined };

// use this options object
export const NEVER_RELOAD: ListenerOptions = {
    blocksPerFetch: Infinity,
};

// the lowest level call for subscribing to contract data
function useCallsData(calls: (Call | undefined)[], { blocksPerFetch }: ListenerOptions = { blocksPerFetch: 1 }, methodName?: string): CallResult[] {
    const { chain } = useAccount();
    const chainId = chain?.id;
    const callResults = useAppSelector((state) => state.multicall.callResults);
    const dispatch = useAppDispatch();

    const serializedCallKeys: string = useMemo(
        () =>
            JSON.stringify(
                calls
                    ?.filter((c): c is Call => Boolean(c))
                    ?.map(toCallKey)
                    ?.sort() ?? []
            ),
        [calls]
    );

    // update listeners when there is an actual change that persists for at least 100ms
    useEffect(() => {
        const callKeys: string[] = JSON.parse(serializedCallKeys);
        if (!chainId || callKeys.length === 0) return undefined;
        const calls = callKeys.map((key) => parseCallKey(key));

        dispatch(
            addMulticallListeners({
                chainId,
                calls,
                options: { blocksPerFetch },
            })
        );

        return () => {
            dispatch(
                removeMulticallListeners({
                    chainId,
                    calls,
                    options: { blocksPerFetch },
                })
            );
        };
    }, [chainId, dispatch, blocksPerFetch, serializedCallKeys]);

    return useMemo(
        () =>
            calls.map<CallResult>((call) => {
                if (!chainId || !call) return INVALID_RESULT;

                const result = callResults[chainId]?.[toCallKey(call)];
                let data;

                if (result?.data && result?.data !== "0x") {
                    data = result.data;
                } else {
                    // console.error(result, result?.data, call)
                }

                return { valid: true, data, blockNumber: result?.blockNumber };
            }),
        [callResults, calls, chainId]
    );
}

interface CallState {
    readonly valid: boolean;
    // the result, or undefined if loading or errored/no data
    readonly result: Result | undefined;
    // true if the result has never been fetched
    readonly loading: boolean;
    // true if the result is not for the latest block
    readonly syncing: boolean;
    // true if the call was made and is synced, but the return data is invalid
    readonly error: boolean;
}

const INVALID_CALL_STATE: CallState = {
    valid: false,
    result: undefined,
    loading: false,
    syncing: false,
    error: false,
};
const LOADING_CALL_STATE: CallState = {
    valid: true,
    result: undefined,
    loading: true,
    syncing: true,
    error: false,
};

function toCallState(callResult: CallResult | undefined, contractInterface: Interface | undefined, fragment: FunctionFragment | undefined, latestBlockNumber: number | undefined): CallState {
    if (!callResult) return INVALID_CALL_STATE;
    const { valid, data, blockNumber } = callResult;
    if (!valid) return INVALID_CALL_STATE;
    if (valid && !blockNumber) return LOADING_CALL_STATE;
    if (!contractInterface || !fragment || !latestBlockNumber) return LOADING_CALL_STATE;
    const success = data && data.length > 2;
    const syncing = (blockNumber ?? 0) < latestBlockNumber;
    let result: Result | undefined = undefined;

    if (success && data) {
        try {
            result = contractInterface.decodeFunctionResult(fragment, data);
        } catch (error) {
            console.debug("Result data parsing failed", fragment, data);
            return {
                valid: true,
                loading: false,
                error: true,
                syncing,
                result,
            };
        }
    }

    return {
        valid: true,
        loading: false,
        syncing,
        result: result,
        error: !success,
    };
}

// THIS FUNCTION SHOULD REMAIN AS IS
function shallowArrayEquals<T>(a: T[], b: T[], compareFn: (x: T, y: T) => boolean): boolean {
    if (a === b) return true;
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
        if (!compareFn(a[i], b[i])) return false;
    }
    return true;
}

// NEW FUNCTION for comparing Result objects
function shallowResultEquals(a: Result | undefined, b: Result | undefined): boolean {
    if (a === b) return true; // Same reference or both undefined
    if (!a || !b) return false; // One is undefined, the other is not
    // Ethers.js Result type is array-like with named properties.
    // Check array part length and content
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
        if (typeof a[i] === 'bigint' && typeof b[i] === 'bigint') {
            if (a[i] !== b[i]) return false;
        } else if (a[i] !== b[i]) {
            // For other primitives or non-identical objects (by reference)
            return false;
        }
    }

    // Check named non-numeric properties
    const aKeys = Object.keys(a).filter(key => isNaN(Number(key)));
    const bKeys = Object.keys(b).filter(key => isNaN(Number(key)));

    if (aKeys.length !== bKeys.length) return false;

    for (const key of aKeys) {
        if (!b.hasOwnProperty(key)) return false;
        if (typeof a[key] === 'bigint' && typeof b[key] === 'bigint') {
            if (a[key] !== b[key]) return false;
        } else if (a[key] !== b[key]) {
            return false;
        }
    }
    return true;
}

function shallowCallStateEquals(a: CallState, b: CallState): boolean {
    if (a === b) return true;
    // Compare key properties
    return (
        a.valid === b.valid &&
        a.loading === b.loading &&
        a.syncing === b.syncing &&
        a.error === b.error &&
        shallowResultEquals(a.result, b.result) // MODIFIED: Use new function here
    );
}

export function useSingleContractMultipleData(
    contract: Contract | null | undefined,
    methodName: string,
    callInputs: OptionalMethodInputs[],
    options: Partial<ListenerOptions> & { gasRequired?: number } = {}
): CallState[] {
    const fragment = useMemo(() => contract?.interface?.getFunction(methodName) ?? undefined, [contract, methodName]);

    const blocksPerFetch = options?.blocksPerFetch;
    const gasRequired = options?.gasRequired;

    const calls = useMemo(
        () =>
            contract && fragment && callInputs?.length > 0 && callInputs.every((inputs) => isValidMethodArgs(inputs))
                ? callInputs.map<Call>((inputs) => {
                    return {
                        address: contract.target as string,
                        callData: contract.interface.encodeFunctionData(fragment, inputs),
                        ...(gasRequired ? { gasRequired } : {}),
                    };
                })
                : [],
        [contract, fragment, callInputs, gasRequired]
    );

    const results = useCallsData(calls, blocksPerFetch ? { blocksPerFetch } : undefined, methodName);

    const latestBlockNumber = useBlockNumber();

    const previousResultsRef = useRef<CallState[] | undefined>();

    const newCallStates = useMemo(() => {
        return results.map((result) => toCallState(result, contract?.interface, fragment, latestBlockNumber));
    }, [fragment, contract, results, latestBlockNumber]);

    // Stabilize the returned array reference
    if (previousResultsRef.current && shallowArrayEquals(previousResultsRef.current, newCallStates, shallowCallStateEquals)) {
        return previousResultsRef.current;
    }
    previousResultsRef.current = newCallStates;
    return newCallStates;
}

export function useMultipleContractSingleData(
    addresses: (string | undefined)[],
    contractInterface: Interface,
    methodName: string,
    callInputs?: OptionalMethodInputs,
    options?: Partial<ListenerOptions> & { gasRequired?: number }
): CallState[] {
    const fragment = useMemo(() => contractInterface.getFunction(methodName) ?? undefined, [contractInterface, methodName]);

    const blocksPerFetch = options?.blocksPerFetch;
    const gasRequired = options?.gasRequired;

    const callData: string | undefined = useMemo(() => {
        if (!fragment) return undefined;
        if (fragment.inputs.length > 0 && callInputs === undefined) return undefined;
        if (!isValidMethodArgs(callInputs) && fragment.inputs.length > 0) return undefined;

        return contractInterface.encodeFunctionData(fragment, callInputs);
    }, [callInputs, contractInterface, fragment]);

    const calls = useMemo(
        () =>
            fragment && addresses && addresses.length > 0 && callData
                ? addresses.map<Call | undefined>((address) => {
                    return address && callData
                        ? {
                            address,
                            callData,
                            ...(gasRequired ? { gasRequired } : {}),
                        }
                        : undefined;
                })
                : [],
        [addresses, callData, fragment, gasRequired]
    );

    const results = useCallsData(calls, blocksPerFetch ? { blocksPerFetch } : undefined);

    const latestBlockNumber = useBlockNumber();
    const previousResultsRef = useRef<CallState[] | undefined>();

    const newCallStates = useMemo(() => {
        return results.map((result) => toCallState(result, contractInterface, fragment, latestBlockNumber));
    }, [fragment, results, contractInterface, latestBlockNumber]);

    // Stabilize the returned array reference
    if (previousResultsRef.current && shallowArrayEquals(previousResultsRef.current, newCallStates, shallowCallStateEquals)) {
        return previousResultsRef.current;
    }
    previousResultsRef.current = newCallStates;
    return newCallStates;
}

export function useSingleCallResult(
    contract: Contract | null | undefined,
    methodName: string,
    inputs?: OptionalMethodInputs,
    options?: Partial<ListenerOptions> & { gasRequired?: number }
): CallState {
    const fragment = useMemo(() => contract?.interface?.getFunction(methodName) ?? undefined, [contract, methodName]);

    const blocksPerFetch = options?.blocksPerFetch;
    const gasRequired = options?.gasRequired;

    const call = useMemo<Call | undefined>(
        () =>
            contract && fragment && isValidMethodArgs(inputs)
                ? {
                    address: contract.target as string,
                    callData: contract.interface.encodeFunctionData(fragment, inputs),
                    ...(gasRequired ? { gasRequired } : {}),
                }
                : undefined,
        [contract, fragment, inputs, gasRequired]
    );

    const result = useCallsData([call], blocksPerFetch ? { blocksPerFetch } : undefined)[0];
    const latestBlockNumber = useBlockNumber();

    const previousResultRef = useRef<CallState | undefined>();

    const newCallState = useMemo(() => {
        return toCallState(result, contract?.interface, fragment, latestBlockNumber)
    }, [result, contract, fragment, latestBlockNumber]);

    // Stabilize the returned object reference
    if (previousResultRef.current && shallowCallStateEquals(previousResultRef.current, newCallState)) {
        return previousResultRef.current;
    }
    previousResultRef.current = newCallState;
    return newCallState;
}
