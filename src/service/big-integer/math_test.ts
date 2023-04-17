import { strictEqual } from 'assert';

import { BigIntegerMath as Self } from './math';

describe('src/service/big-integer/math.ts', () => {
    describe('.abs(a: Integer)', () => {
        it('ok', async () => {
            const self = new Self();

            const numRes = self.abs(-10);
            strictEqual(numRes, 10);

            const bigintRes = self.abs('-100000000000000000000000');
            strictEqual(bigintRes, '100000000000000000000000');
        });

        it('小数', async () => {
            const self = new Self();

            const numRes = self.abs('-10.12');
            strictEqual(numRes, '10');
        });
    });

    describe('.add(a: Integer, b: Integer)', () => {
        it('ok', async () => {
            const self = new Self();

            const numRes = self.add(-10, 100);
            strictEqual(numRes, 90);

            const bigintRes = self.add('100000000000000000000000', 1000);
            strictEqual(bigintRes, '100000000000000000001000');
        });

        it('科学计数法', async () => {
            const self = new Self();

            const res = self.add('100', 1.1e+20);
            strictEqual(res, '110000000000000000100');
        });
    });

    describe('.divide(a: Integer, b: Integer)', () => {
        it('ok', async () => {
            const self = new Self();

            const numRes = self.divide(22201, 100);
            strictEqual(numRes, 222.01);

            const bigintRes = self.divide('100000000000000000000000', 1000);
            strictEqual(bigintRes, '100000000000000000000');
        });
    });

    describe('.eq(a: Integer, b: Integer)', () => {
        it('ok', async () => {
            const self = new Self();

            const numRes = self.eq(22201, 100);
            strictEqual(numRes, false);

            const bigintRes = self.eq('1001', 1001);
            strictEqual(bigintRes, true);
        });
    });

    describe('.gte(a: Integer, b: Integer)', () => {
        it('ok', async () => {
            const self = new Self();

            const numRes = self.gte(22201, 100);
            strictEqual(numRes, true);

            const bigintRes = self.gte('1001', 1001);
            strictEqual(bigintRes, true);
        });
    });

    describe('.gt(a: Integer, b: Integer)', () => {
        it('ok', async () => {
            const self = new Self();

            const numRes = self.gt(22201, 100);
            strictEqual(numRes, true);

            const bigintRes = self.gt('1001', 1001);
            strictEqual(bigintRes, false);
        });
    });

    describe('.lt(a: Integer, b: Integer)', () => {
        it('ok', async () => {
            const self = new Self();

            const numRes = self.lt(22201, 100);
            strictEqual(numRes, false);

            const bigintRes = self.lt('1001', 1001);
            strictEqual(bigintRes, false);
        });
    });

    describe('.lte(a: Integer, b: Integer)', () => {
        it('ok', async () => {
            const self = new Self();

            const numRes = self.lte(22201, 100);
            strictEqual(numRes, false);

            const bigintRes = self.lte('1001', 1001);
            strictEqual(bigintRes, true);
        });
    });

    describe('.mod(a: Integer, b: Integer)', () => {
        it('ok', async () => {
            const self = new Self();

            const numRes = self.mod(22201, 100);
            strictEqual(numRes, 1);

            const bigintRes = self.mod('1001', 1001);
            strictEqual(bigintRes, '0');
        });
    });

    describe('.multiply(a: Integer, b: Integer)', () => {
        it('ok', async () => {
            const self = new Self();

            const numRes = self.multiply(22201, 100);
            strictEqual(numRes, 2220100);

            const bigintRes = self.multiply('1001', 1001);
            strictEqual(bigintRes, '1002001');
        });

        it('科学计数法', async () => {
            const self = new Self();

            const res = self.multiply(155, Math.pow(1.0053, 10000));
            strictEqual(res, 1.4033217213822456e+25);
        });
    });

    describe('.pow(a: Integer, b: number)', () => {
        it('ok', async () => {
            const self = new Self();

            const numRes = self.pow(100, 3);
            strictEqual(numRes, 1000000);

            const bigintRes = self.pow('10000', 4);
            strictEqual(bigintRes, '10000000000000000');
        });
    });

    describe('.subtract(a: Integer, b: Integer)', () => {
        it('ok', async () => {
            const self = new Self();

            const numRes = self.subtract(22201, 100);
            strictEqual(numRes, 22101);

            const bigintRes = self.subtract('1001', 1001);
            strictEqual(bigintRes, '0');
        });

        it('科学计数法', async () => {
            const self = new Self();

            const numRes1 = self.subtract('1e+10', 1e+9);
            strictEqual(numRes1, '9000000000');

            const numRes2 = self.subtract('100000000000000000000000000', 1.4033217213822456e+25);
            strictEqual(numRes2, '85966782786177544000000000');
        });
    });
});