import { MathBase, Integer } from '../../contract';

export class BigIntegerMath extends MathBase {

    public static reg = /(\d(\.\d+)?)e\+(\d+)/;

    public abs(a: Integer) {
        if (typeof a == 'number')
            return Math.abs(a);

        const ok = this.lt(a, 0);
        return ok ? (-this.toBigInt(a)).toString() : a;
    }

    public add(a: Integer, b: Integer) {
        if (typeof a == 'number' && typeof b == 'number')
            return a + b;

        return (this.toBigInt(a) + this.toBigInt(b)).toString();
    }

    public divide(a: Integer, b: Integer) {
        if (typeof a == 'number' && typeof b == 'number')
            return a / b;

        return (this.toBigInt(a) / this.toBigInt(b)).toString();
    }

    public eq(a: Integer, b: Integer) {
        if (a == null || b == null)
            return false;

        return a == b;
    }

    public gte(a: Integer, b: Integer) {
        if (a == null || b == null)
            return false;

        if (typeof a == 'number' && typeof b == 'number')
            return a >= b;

        return this.toBigInt(a) >= this.toBigInt(b);
    }

    public gt(a: Integer, b: Integer) {
        if (a == null || b == null)
            return false;

        if (typeof a == 'number' && typeof b == 'number')
            return a > b;

        return this.toBigInt(a) > this.toBigInt(b);
    }

    public lt(a: Integer, b: Integer) {
        if (a == null || b == null)
            return false;

        if (typeof a == 'number' && typeof b == 'number')
            return a < b;

        return this.toBigInt(a) < this.toBigInt(b);
    }

    public lte(a: Integer, b: Integer) {
        if (a == null || b == null)
            return false;

        if (typeof a == 'number' && typeof b == 'number')
            return a <= b;

        return this.toBigInt(a) <= this.toBigInt(b);
    }

    public mod(a: Integer, b: Integer) {
        if (typeof a == 'number' && typeof b == 'number')
            return a % b;

        return (this.toBigInt(a) % this.toBigInt(b)).toString();
    }

    public multiply(a: Integer, b: Integer) {
        if (typeof a == 'number' && typeof b == 'number')
            return a * b;

        return (this.toBigInt(a) * this.toBigInt(b)).toString();
    }

    public pow(a: Integer, b: number) {
        if (typeof a == 'number')
            return Math.pow(a, b);

        const aInt = this.toBigInt(a);
        let result = aInt;
        for (let i = 1; i < b; i++)
            result = result * aInt;
        return result.toString();
    }

    public subtract(a: Integer, b: Integer) {
        if (typeof a == 'number' && typeof b == 'number')
            return a - b;

        return (this.toBigInt(a) - this.toBigInt(b)).toString();
    }

    private toBigInt(a: Integer) {
        let numStr = a.toString();
        if (numStr.includes('e+')) {
            const match = numStr.match(BigIntegerMath.reg);
            if (!match)
                throw new Error(`错误的数字格式: ${a}`);

            const [_, num, __, exponent] = match;
            const index = num.indexOf('.');
            if (index >= 0)
                numStr = num.replace('.', '').padEnd(Number(exponent) + index, '0');
            else
                numStr = num.padEnd(Number(exponent) + num.length, '0');
        }

        return BigInt(numStr);
    }
}