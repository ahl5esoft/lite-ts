import { deepStrictEqual, strictEqual } from 'assert';
import { existsSync } from 'fs';
import { readFile, unlink, writeFile } from 'fs/promises';

import { FsFile as Self } from './file';

describe('src/service/fs/file.ts', () => {
    describe('.read<T>()', () => {
        it('ok', async () => {
            const filename = 'file-read-string';
            const self = new Self(null, filename);

            Reflect.set(self, 'readString', () => {
                return JSON.stringify({
                    number: 100,
                    string: 'hello',
                });
            });

            const res = await self.read<{
                number: number,
                string: string
            }>();
            deepStrictEqual(res, {
                number: 100,
                string: 'hello',
            });
        });
    });

    describe('.readString()', () => {
        it('ok', async () => {
            const filename = 'file-read-string';
            const self = new Self(null, filename);

            try {
                await unlink(filename);
            } catch { }
            await writeFile(filename, 'hello-world');

            const res = await self.readString();
            strictEqual(res, 'hello-world');

            await unlink(filename);
        });
    });

    describe('.readYaml<T>()', () => {
        it('ok', async () => {
            const filename = 'file-read-string';
            const self = new Self(null, filename);

            Reflect.set(self, 'readString', () => {
                return `number: 100
string: hello`
            });

            const res = await self.readYaml<{
                number: number,
                string: string
            }>();
            deepStrictEqual(res, {
                number: 100,
                string: 'hello',
            });
        });
    });

    describe('.remove()', () => {
        it('ok', async () => {
            const filename = 'file-remove';
            const self = new Self(null, filename);

            await writeFile(filename, 'hello');

            await self.remove();

            const ok = existsSync(filename);
            strictEqual(ok, false);
        });
    });

    describe('.write(v: any)', () => {
        it('string', async () => {
            const filePath = 'test-file-write-string';
            const self = new Self(null, filePath);

            await self.write('str');

            const res = await readFile(filePath, 'utf-8');
            strictEqual(res, 'str');

            await unlink(filePath);
        });
    });
});