import { notStrictEqual, strictEqual } from 'assert';

import { ChildProcessCommand as Self } from './command';

describe('src/service/child-process/command.ts', () => {
    describe('.exec(v: IChildProcessCommandOption)', () => {
        it('ok', async () => {
            const res = await new Self().exec({
                args: ['node', '-v']
            });
            strictEqual(res.code, 0);
            strictEqual(res.stderr, '');
            notStrictEqual(res.stdout, '');
        });

        it('ignore return', async () => {
            const res = await new Self().exec({
                args: ['node', '-v'],
                ignoreStdout: true,
                ignoreStderr: true
            });
            strictEqual(res.code, 0);
            strictEqual(res.stderr, '');
            strictEqual(res.stdout, '');
        });

        it('pipe', async () => {
            const res = await new Self().exec({
                args: ['tasklist', '|', 'find', '']
            });
            strictEqual(res.code, 1);
            strictEqual(res.stderr, '');
            strictEqual(res.stdout, '');
        });

        it('timeout', async () => {
            const res = await new Self().exec({
                args: ['node'],
                timeout: 1000
            });
            strictEqual(res.code, -1);
            strictEqual(res.stderr, '');
            strictEqual(res.stdout, '');
        });

        it('cwd', async () => {
            const res = await new Self().exec({
                args: ['more', 'README.md'],
                cwd: process.cwd()
            });
            strictEqual(res.code, 0);
            strictEqual(res.stderr, '');
            notStrictEqual(res.stdout, '');
        });
    });
});
