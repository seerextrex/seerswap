import { BigNumber } from '@ethersproject/bignumber'
import { calculateGasMargin } from './calculateGasMargin'

describe('#calculateGasMargin', () => {
    it('adds 20% gas for mainnet', () => {
        expect(calculateGasMargin(100, 1000n).toString()).toEqual('1200')
        expect(calculateGasMargin(100, 50n).toString()).toEqual('60')
    })

    it('adds no gas for other chains', () => {
        expect(calculateGasMargin(69, 1000n).toString()).toEqual('1000')
        expect(calculateGasMargin(69, 50n).toString()).toEqual('50')
    })
})
