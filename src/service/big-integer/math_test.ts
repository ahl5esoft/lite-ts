import { strictEqual } from 'assert';

import { BigIntegerMath as Self } from './math';

describe('src/service/big-integer/math.ts', () => {
    describe('.abs(a: Integer)', () => {
        it('ok', async () => {
            const self = new Self();

            const numAbs = self.abs(-10);
            strictEqual(numAbs, 10);

            const bigintAbs = self.abs('-100000000000000000000000');
            strictEqual(bigintAbs, '100000000000000000000000');
        });
    });

    describe('.add(a: Integer, b: Integer)', () => {
        it('ok', async () => {
            const self = new Self();

            const numAbs = self.add(-10, 100);
            strictEqual(numAbs, 90);

            const bigintAbs = self.add('100000000000000000000000', 1000);
            strictEqual(bigintAbs, '100000000000000000001000');
        });
    });

    describe('.divide(a: Integer, b: Integer)', () => {
        it('ok', async () => {
            const self = new Self();

            const numAbs = self.divide(22201, 100);
            strictEqual(numAbs, 222);

            const bigintAbs = self.divide('100000000000000000000000', 1000);
            strictEqual(bigintAbs, '100000000000000000000');
        });
    });

    describe('.eq(a: Integer, b: Integer)', () => {
        it('ok', async () => {
            const self = new Self();

            const numAbs = self.eq(22201, 100);
            strictEqual(numAbs, false);

            const bigintAbs = self.eq('1001', 1001);
            strictEqual(bigintAbs, true);
        });
    });

    describe('.gte(a: Integer, b: Integer)', () => {
        it('ok', async () => {
            const self = new Self();

            const numAbs = self.gte(22201, 100);
            strictEqual(numAbs, true);

            const bigintAbs = self.gte('1001', 1001);
            strictEqual(bigintAbs, true);
        });
    });

    describe('.gt(a: Integer, b: Integer)', () => {
        it('ok', async () => {
            const self = new Self();

            const numAbs = self.gt(22201, 100);
            strictEqual(numAbs, true);

            const bigintAbs = self.gt('1001', 1001);
            strictEqual(bigintAbs, false);
        });
    });

    describe('.lt(a: Integer, b: Integer)', () => {
        it('ok', async () => {
            const self = new Self();

            const numAbs = self.lt(22201, 100);
            strictEqual(numAbs, false);

            const bigintAbs = self.lt('1001', 1001);
            strictEqual(bigintAbs, false);
        });
    });

    describe('.lte(a: Integer, b: Integer)', () => {
        it('ok', async () => {
            const self = new Self();

            const numAbs = self.lte(22201, 100);
            strictEqual(numAbs, false);

            const bigintAbs = self.lte('1001', 1001);
            strictEqual(bigintAbs, true);
        });
    });

    describe('.mod(a: Integer, b: Integer)', () => {
        it('ok', async () => {
            const self = new Self();

            const numAbs = self.mod(22201, 100);
            strictEqual(numAbs, 1);

            const bigintAbs = self.mod('1001', 1001);
            strictEqual(bigintAbs, '0');
        });
    });

    describe('.multiply(a: Integer, b: Integer)', () => {
        it('ok', async () => {
            const self = new Self();

            const numAbs = self.multiply(22201, 100);
            strictEqual(numAbs, 2220100);

            const bigintAbs = self.multiply('1001', 1001);
            strictEqual(bigintAbs, '1002001');
        });
    });
});