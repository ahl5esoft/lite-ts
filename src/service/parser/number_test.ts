import { strictEqual } from 'assert';

import { NumberParser as Self } from './number';

describe('src/service/parser/number.ts', () => {
    describe('.parse(text: string)', () => {
        it('int', async () => {
            const self = new Self();
            const res = await self.parse('111');
            strictEqual(res, 111);
        });

        it('-int', async () => {
            const self = new Self();
            const res = await self.parse('-112');
            strictEqual(res, -112);
        });

        it('小数', async () => {
            const self = new Self();
            const res = await self.parse('1.23');
            strictEqual(res, 1.23);
        });
    });
});