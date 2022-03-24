import { ok } from 'assert';

import { MathStringGenerator as Self } from './string-generator';

describe('src/service/math/string-generator.ts', () => {
    describe('.generate()', () => {
        it('十进制', async () => {
            const self = new Self(10, 4);
            const res = await self.generate();
            ok(
                /^\d{4}$/.test(res)
            );
        });
    });
});