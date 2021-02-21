import { ok, strictEqual } from 'assert';

import { MongoStringGenerator } from '../../../../src/plugin/mongo';

describe('src/plugin/mongo/string-generator.ts', () => {
    describe('.generate(): Promise<string>', () => {
        it('ok', async () => {
            const res = await new MongoStringGenerator().generate();
            strictEqual(typeof res, 'string');
            ok(res);
        });
    });
});