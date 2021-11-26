import { notStrictEqual, strictEqual } from 'assert';

import { ChildProcessCommand as Self } from './command';

describe('src/service/child-process/command.ts', () => {
    describe('.exec(name: string, ...args: any[])', () => {
        it('ok', async () => {
            const res = await new Self([
                ['node', '-v']
            ]).exec();
            strictEqual(res.code, 0);
            strictEqual(res.err, '');
            notStrictEqual(res.out, '');
        });

        it('ignore return', async () => {
            const res = await new Self([
                ['node', '-v']
            ]).setExtra({
                ignoreReturn: true
            }).exec();
            strictEqual(res.code, 0);
            strictEqual(res.err, '');
            strictEqual(res.out, '');
        });

        it('pipe', async () => {
            const res = await new Self([
                ['tasklist'],
                ['find', '']
            ]).exec();
            strictEqual(res.code, 1);
            strictEqual(res.err, '');
            strictEqual(res.out, '');
        });

        it('timeout', async () => {
            const res = await new Self([
                ['node']
            ]).setTimeout(1000).exec();
            strictEqual(res.code, -1);
            strictEqual(res.err, '');
            strictEqual(res.out, '');
        });
    });

    describe('.setDir(v: string)', () => {
        it('ok', async () => {
            const res = await new Self([
                ['more', 'README.md']
            ]).setDir(
                process.cwd()
            ).exec();
            strictEqual(res.code, 0);
            strictEqual(res.err, '');
            notStrictEqual(res.out, '');
        });
    });
});
