import { notStrictEqual, ok, strictEqual } from 'assert';

import { Command as Self } from './command';

describe('src/service/child-process/command-service.ts', () => {
    describe('.exec(name: string, ...args: any[]): Promise<string>', () => {
        it('ok', async () => {
            const res = await new Self(['node', '-v']).exec();
            notStrictEqual(res, '');
        });

        it('ignore return', async () => {
            const res = await new Self(['node', '-v']).setExtra({
                ignoreReturn: true
            }).exec();
            strictEqual(res, '');
        });

        it('pipe', async () => {
            const res = await new Self(['tasklist', '|', 'find', `/"redis/"`]).exec();
            strictEqual(res, '');
        });

        it('pipe(没有结果)', async () => {
            const res = await new Self(['tasklist', '|', 'find', `/"ssaw/"`]).exec();
            strictEqual(res, '');
        });

        it('timeout', async () => {
            let err: Error;
            try {
                await new Self(['timeout', 5]).setTimeout(10).exec();
            } catch (ex) {
                err = ex;
            } finally {
                notStrictEqual(err, undefined);
                ok(
                    err.message.startsWith(`{"cmd":"timeout 5","code":1,"stderr":"`)
                );
            }
        });
    });
});
