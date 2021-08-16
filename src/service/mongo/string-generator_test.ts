import { ok, strictEqual } from 'assert';

import { MongoStringGenerator as Self } from './string-generator';

describe('src/service/mongo/string-generator.ts', () => {
    describe('.generate(): Promise<string>', () => {
        it('ok', async () => {
            const res = await new Self().generate();
            strictEqual(typeof res, 'string');
            ok(res);
        });
    });
});