import { deepStrictEqual } from 'assert';

import { JsonParser as Self } from './json-parser';

describe('src/service/string/json-parser.ts', () => {
    describe('.parse(text: string)', () => {
        it('ok', async () => {
            const self = new Self();
            const res = await self.parse('[1,2,3]');
            deepStrictEqual(res, [1, 2, 3]);
        });
    });
});