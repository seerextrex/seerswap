import { CurrencyAmount, Token } from '@uniswap/sdk-core'
import { useMemo } from 'react'
import { useReadContract } from 'wagmi'
import { erc20Abi } from 'viem'
import usePrevious from './usePrevious'

export function useTokenAllowance(token?: Token, owner?: string, spender?: string): CurrencyAmount<Token> | undefined {
    const { data: allowance, isLoading, isError } = useReadContract({
        address: token?.address as `0x${string}` | undefined,
        abi: erc20Abi,
        functionName: 'allowance',
        args: owner && spender ? [owner as `0x${string}`, spender as `0x${string}`] : undefined,
        query: {
            enabled: !!token && !!owner && !!spender,
        }
    })

    const prevAllowance = usePrevious(allowance)

    const _allowance = useMemo(() => {
        if (isLoading || isError) return undefined
        if (!prevAllowance) return allowance
        if (allowance === undefined && prevAllowance !== undefined) return prevAllowance
        return allowance
    }, [allowance, isLoading, isError, prevAllowance])

    return useMemo(
        () => (token && _allowance !== undefined ? CurrencyAmount.fromRawAmount(token, _allowance.toString()) : undefined),
        [token, _allowance]
    )
}
