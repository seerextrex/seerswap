import JSBI from 'jsbi'
import { BigintIsh, Rounding } from '@uniswap/sdk-core'
import invariant from 'tiny-invariant'
import _Decimal from 'decimal.js-light'
// @ts-ignore
import _Big, { RoundingMode } from 'big.js'
// @ts-ignore
import toFormat from 'toformat'


const Decimal = toFormat(_Decimal)
const Big = toFormat(_Big)

const toSignificantRounding = {
    [Rounding.ROUND_DOWN]: Decimal.ROUND_DOWN,
    [Rounding.ROUND_HALF_UP]: Decimal.ROUND_HALF_UP,
    [Rounding.ROUND_UP]: Decimal.ROUND_UP
}

const toFixedRounding = {
    [Rounding.ROUND_DOWN]: RoundingMode.RoundDown,
    [Rounding.ROUND_HALF_UP]: RoundingMode.RoundHalfUp,
    [Rounding.ROUND_UP]: RoundingMode.RoundUp
}

export class Fraction {
    public readonly numerator: JSBI
    public readonly denominator: JSBI

    public constructor(numerator: BigintIsh, denominator: BigintIsh = JSBI.BigInt(1)) {
        this.numerator = JSBI.BigInt(numerator)
        this.denominator = JSBI.BigInt(denominator)
    }

    // performs floor division
    public get quotient(): JSBI {
        return JSBI.divide(this.numerator, this.denominator)
    }

    // remainder after floor division
    public get remainder(): Fraction {
        return new Fraction(JSBI.remainder(this.numerator, this.denominator), this.denominator)
    }

    private static tryParseFraction(fractionish: BigintIsh | Fraction): Fraction {
        if (fractionish instanceof JSBI || typeof fractionish === 'number' || typeof fractionish === 'string')
            return new Fraction(fractionish)

        if ('numerator' in fractionish && 'denominator' in fractionish) return fractionish
        throw new Error('Could not parse fraction')
    }

    public invert(): Fraction {
        return new Fraction(this.denominator, this.numerator)
    }

    public add(other: Fraction | BigintIsh): Fraction {
        const otherParsed = Fraction.tryParseFraction(other)
        if (JSBI.equal(this.denominator, otherParsed.denominator)) {
            return new Fraction(JSBI.add(this.numerator, otherParsed.numerator), this.denominator)
        }
        return new Fraction(
            JSBI.add(
                JSBI.multiply(this.numerator, otherParsed.denominator),
                JSBI.multiply(otherParsed.numerator, this.denominator)
            ),
            JSBI.multiply(this.denominator, otherParsed.denominator)
        )
    }

    public subtract(other: Fraction | BigintIsh): Fraction {
        const otherParsed = Fraction.tryParseFraction(other)
        if (JSBI.equal(this.denominator, otherParsed.denominator)) {
            return new Fraction(JSBI.subtract(this.numerator, otherParsed.numerator), this.denominator)
        }
        return new Fraction(
            JSBI.subtract(
                JSBI.multiply(this.numerator, otherParsed.denominator),
                JSBI.multiply(otherParsed.numerator, this.denominator)
            ),
            JSBI.multiply(this.denominator, otherParsed.denominator)
        )
    }

    public lessThan(other: Fraction | BigintIsh): boolean {
        const otherParsed = Fraction.tryParseFraction(other)
        return JSBI.lessThan(
            JSBI.multiply(this.numerator, otherParsed.denominator),
            JSBI.multiply(otherParsed.numerator, this.denominator)
        )
    }

    public equalTo(other: Fraction | BigintIsh): boolean {
        const otherParsed = Fraction.tryParseFraction(other)
        return JSBI.equal(
            JSBI.multiply(this.numerator, otherParsed.denominator),
            JSBI.multiply(otherParsed.numerator, this.denominator)
        )
    }

    public greaterThan(other: Fraction | BigintIsh): boolean {
        const otherParsed = Fraction.tryParseFraction(other)
        return JSBI.greaterThan(
            JSBI.multiply(this.numerator, otherParsed.denominator),
            JSBI.multiply(otherParsed.numerator, this.denominator)
        )
    }

    public multiply(other: Fraction | BigintIsh): Fraction {
        const otherParsed = Fraction.tryParseFraction(other)
        return new Fraction(
            JSBI.multiply(this.numerator, otherParsed.numerator),
            JSBI.multiply(this.denominator, otherParsed.denominator)
        )
    }

    public divide(other: Fraction | BigintIsh): Fraction {
        const otherParsed = Fraction.tryParseFraction(other)
        return new Fraction(
            JSBI.multiply(this.numerator, otherParsed.denominator),
            JSBI.multiply(this.denominator, otherParsed.numerator)
        )
    }

    public toSignificant(
        significantDigits: number,
        format: any = { groupSeparator: '' },
        rounding: Rounding = Rounding.ROUND_HALF_UP
    ): string {
        invariant(Number.isInteger(significantDigits), `${significantDigits} is not an integer.`)
        invariant(significantDigits > 0, `${significantDigits} is not positive.`)

        Decimal.set({ precision: significantDigits + 1, rounding: toSignificantRounding[rounding] })
        const quotient = new Decimal(this.numerator.toString())
            .div(this.denominator.toString())
            .toSignificantDigits(significantDigits)
        return quotient.toFormat(quotient.decimalPlaces(), format)
    }

    public toFixed(
        decimalPlaces: number,
        format: any = { groupSeparator: '' },
        rounding: Rounding = Rounding.ROUND_HALF_UP
    ): string {
        invariant(Number.isInteger(decimalPlaces), `${decimalPlaces} is not an integer.`)
        invariant(decimalPlaces >= 0, `${decimalPlaces} is negative.`)

        Big.DP = decimalPlaces
        Big.RM = toFixedRounding[rounding]
        return new Big(this.numerator.toString()).div(this.denominator.toString()).toFormat(decimalPlaces, format)
    }
}


const ONE_HUNDRED = new Fraction(JSBI.BigInt(100))

/**
 * Converts a fraction to a percent
 * @param fraction the fraction to convert
 */
function toPercent(fraction: Fraction): Percent {
    return new Percent(fraction.numerator, fraction.denominator)
}

export class Percent extends Fraction {
    /**
     * This boolean prevents a fraction from being interpreted as a Percent
     */
    public readonly isPercent: true = true

    add(other: Fraction | BigintIsh): Percent {
        return toPercent(super.add(other))
    }

    subtract(other: Fraction | BigintIsh): Percent {
        return toPercent(super.subtract(other))
    }

    multiply(other: Fraction | BigintIsh): Percent {
        return toPercent(super.multiply(other))
    }

    divide(other: Fraction | BigintIsh): Percent {
        return toPercent(super.divide(other))
    }

    public toSignificant(significantDigits = 5, format?: any, rounding?: Rounding): string {
        return super.multiply(ONE_HUNDRED).toSignificant(significantDigits, format, rounding)
    }

    public toFixed(decimalPlaces = 2, format?: any, rounding?: Rounding): string {
        return super.multiply(ONE_HUNDRED).toFixed(decimalPlaces, format, rounding)
    }
}
