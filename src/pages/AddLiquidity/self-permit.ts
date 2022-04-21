import { BigintIsh, Token } from '@uniswap/sdk-core'
import { Interface } from '@ethersproject/abi'
//@ts-ignore
import { abi } from '@uniswap/v3-periphery/artifacts/contracts/interfaces/ISelfPermit.sol/ISelfPermit.json'
import JSBI from 'jsbi'

function toHex(bigintIsh: BigintIsh) {
    const bigInt = JSBI.BigInt(bigintIsh)
    let hex = bigInt.toString(16)
    if (hex.length % 2 !== 0) {
        hex = `0${hex}`
    }
    return `0x${hex}`
}

export interface StandardPermitArguments {
    v: 0 | 1 | 27 | 28
    r: string
    s: string
    amount: BigintIsh
    deadline: BigintIsh
}

export interface AllowedPermitArguments {
    v: 0 | 1 | 27 | 28
    r: string
    s: string
    nonce: BigintIsh
    expiry: BigintIsh
}

export type PermitOptions = StandardPermitArguments | AllowedPermitArguments

function isAllowedPermit(permitOptions: PermitOptions): permitOptions is AllowedPermitArguments {
    return 'nonce' in permitOptions
}

export abstract class SelfPermit {
    public static INTERFACE: Interface = new Interface(abi)

    protected constructor() {
        console.log()
    }

    protected static encodePermit(token: Token, options: PermitOptions) {
        return isAllowedPermit(options)
            ? SelfPermit.INTERFACE.encodeFunctionData('selfPermitAllowed', [
                token.address,
                toHex(options.nonce),
                toHex(options.expiry),
                options.v,
                options.r,
                options.s
            ])
            : SelfPermit.INTERFACE.encodeFunctionData('selfPermit', [
                token.address,
                toHex(options.amount),
                toHex(options.deadline),
                options.v,
                options.r,
                options.s
            ])
    }
}
