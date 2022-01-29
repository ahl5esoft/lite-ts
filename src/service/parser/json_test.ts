import { deepStrictEqual, ok } from 'assert';

import { JsonParser as Self } from './json';

describe('src/service/parser/json.ts', () => {
    describe('.parse(text: string)', () => {
        it('ok', async () => {
            const self = new Self();
            const res = await self.parse('[1,2,3]');
            deepStrictEqual(res, [1, 2, 3]);
        });

        it('err', async () => {
            const self = new Self();
            const res = await self.parse('123[sd]');
            ok('err' in res);
        });
    });
});