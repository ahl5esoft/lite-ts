import { ok, strictEqual } from 'assert';

import { OSCmd } from '../../../src/os';

describe('src/lib/os/cmd/os.ts', (): void => {
    describe('.exec(opt: OSCmdExecOption): Promise<string>', (): void => {
        it('ok', async (): Promise<void> => {
            const self = new OSCmd();
            const res = await self.exec({
                cmd: 'node',
                args: ['-v'],
            });
            ok(res);
        });
    });

    describe('.execWithoutReturn(opt: OSCmdExecOption): Promise<void>', (): void => {
        it('ok', async (): Promise<void> => {
            const self = new OSCmd();
            const res = await self.execWithoutReturn({
                cmd: 'node',
                args: ['-v'],
            });
            strictEqual(res, undefined);
        });
    });
});
