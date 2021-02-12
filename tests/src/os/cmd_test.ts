import { ok, strictEqual } from 'assert';

import { argsOption, cmdOption, ignoreReturnOption, OSCmd } from '../../../src/os';

const self = new OSCmd();

describe('src/lib/os/cmd/os.ts', (): void => {
    describe('.exec(opt: OSCmdExecOption): Promise<string>', (): void => {
        it('ok', async (): Promise<void> => {
            const res = await self.exec(
                cmdOption('node'),
                argsOption('-v'),
            );
            ok(res);
        });

        it.only('ignore return', async (): Promise<void> => {
            const res = await self.exec(
                cmdOption('node'),
                argsOption('-v'),
                ignoreReturnOption(),
            );
            strictEqual(res, '');
        });
    });
});
