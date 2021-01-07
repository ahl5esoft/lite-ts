import { ok } from 'assert';

import { IDGenerator } from '../../../../plugin/db/mongo';

const reg = /^[a-zA-Z0-9]{20,32}$/;

describe('src/plugin/db/mongo/id-generator.ts', (): void => {
    describe('.generate(): Promise<string>', (): void => {
        it('ok', async (): Promise<void> => {
            const res = await new IDGenerator().generate();
            ok(
                reg.test(res)
            );
        });
    });
});
