import { notStrictEqual, strictEqual } from 'assert';

import { ChildProcessCommandService as Self } from './command-service';

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
    });
});
