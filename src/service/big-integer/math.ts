import { MathBase, Integer } from '../../contract';

export class BigIntegerMath extends MathBase {
    public abs(a: Integer) {
        if (typeof a == 'number')
            return Math.abs(a);

        const ok = this.lt(a, 0);
        return ok ? (-BigInt(a)).toString() : a;
    }

    public add(a: Integer, b: Integer) {
        if (typeof a == 'number' && typeof b == 'number')
            return a + b;

        return (BigInt(a) + BigInt(b)).toString();
    }

    public divide(a: Integer, b: Integer) {
        if (typeof a == 'number' && typeof b == 'number')
            return parseInt((a / b).toString());

        return (BigInt(a) / BigInt(b)).toString();
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

        return BigInt(a) >= BigInt(b);
    }

    public gt(a: Integer, b: Integer) {
        if (a == null || b == null)
            return false;

        if (typeof a == 'number' && typeof b == 'number')
            return a > b;

        return BigInt(a) > BigInt(b);
    }

    public lt(a: Integer, b: Integer) {
        if (a == null || b == null)
            return false;

        if (typeof a == 'number' && typeof b == 'number')
            return a < b;

        return BigInt(a) < BigInt(b);
    }

    public lte(a: Integer, b: Integer) {
        if (a == null || b == null)
            return false;

        if (typeof a == 'number' && typeof b == 'number')
            return a <= b;

        return BigInt(a) <= BigInt(b);
    }

    public mod(a: Integer, b: Integer) {
        if (typeof a == 'number' && typeof b == 'number')
            return a % b;

        return (BigInt(a) % BigInt(b)).toString();
    }

    public multiply(a: Integer, b: Integer) {
        if (typeof a == 'number' && typeof b == 'number')
            return a * b;

        return (BigInt(a) * BigInt(b)).toString();
    }

    public subtract(a: Integer, b: Integer) {
        if (typeof a == 'number' && typeof b == 'number')
            return a - b;

        return (BigInt(a) / BigInt(b)).toString();
    }
}