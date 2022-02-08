import { notStrictEqual, strictEqual } from 'assert';

import { ChildProcessCommand as Self } from './command';

describe('src/service/child-process/command.ts', () => {
    describe('.exec(name: string, ...args: any[])', () => {
        it('ok', async () => {
            const res = await new Self().exec('node', '-v');
            strictEqual(res.code, 0);
            strictEqual(res.err, '');
            notStrictEqual(res.out, '');
        });

        it('ignore return', async () => {
            const res = await new Self().setExtra({
                ignoreReturn: true
            }).exec('node', '-v');
            strictEqual(res.code, 0);
            strictEqual(res.err, '');
            strictEqual(res.out, '');
        });

        it('pipe', async () => {
            const res = await new Self().exec('tasklist', '|', 'find', '');
            strictEqual(res.code, 1);
            strictEqual(res.err, '');
            strictEqual(res.out, '');
        });

        it('timeout', async () => {
            const res = await new Self().setTimeout(1000).exec('node');
            strictEqual(res.code, -1);
            strictEqual(res.err, '');
            strictEqual(res.out, '');
        });
    });

    describe('.setDir(v: string)', () => {
        it('ok', async () => {
            const res = await new Self().setDir(
                process.cwd()
            ).exec('more', 'README.md');
            strictEqual(res.code, 0);
            strictEqual(res.err, '');
            notStrictEqual(res.out, '');
        });
    });
});
