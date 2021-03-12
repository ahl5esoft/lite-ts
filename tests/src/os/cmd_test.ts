import { notStrictEqual, ok, strictEqual } from 'assert';

import { OSCmd } from '../../../src/os';

const self = new OSCmd();

describe('src/lib/os/cmd/os.ts', () => {
    describe('.exec(name: string, ...args: any[]): Promise<string>', () => {
        it('ok', async () => {
            const res = await self.exec('node', '-v');
            ok(res);
        });

        it('ignore return', async () => {
            self.ignoreReturn = true;
            const res = await self.exec('node', '-v');
            strictEqual(res, '');
        });

        it('pipe', async () => {
            const res = await self.exec('tasklist', '|', 'find', '\"redis\"');
            notStrictEqual(res, '');
        });
    });
});
