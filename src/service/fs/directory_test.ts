import { deepStrictEqual, ok, strictEqual } from 'assert';
import { existsSync } from 'fs';
import { mkdir, rm, rmdir, writeFile } from 'fs/promises';
import { join } from 'path';

import { FsDirectory as Self } from './directory';
import { FsFile } from './file';

describe('src/service/fs/directory.ts', () => {
    describe('.create()', () => {
        it('ok', async () => {
            const dirname = 'dir-create';
            const self = new Self(null, dirname);

            await self.create();

            const isExist = existsSync(dirname);
            ok(isExist);

            await rmdir(dirname);
        });
    });

    describe('.findDirectories()', () => {
        it('ok', async () => {
            const dirname = 'dir-findDirectories';
            await mkdir(dirname);

            await writeFile(
                join(dirname, 'file'),
                'hello'
            );

            await mkdir(
                join(dirname, 'dir')
            );

            const res = await new Self(null, dirname).findDirectories();
            strictEqual(res.length, 1);
            strictEqual(res[0].constructor, Self);

            await rm(dirname, {
                force: true,
                recursive: true,
            });
        });
    });

    describe('.findFiles()', () => {
        it('ok', async () => {
            const dirname = 'dir-findFiles';
            await mkdir(dirname);

            await writeFile(
                join(dirname, 'file'),
                'hello'
            );

            await mkdir(
                join(dirname, 'dir')
            );

            const res = await new Self(null, dirname).findFiles();
            strictEqual(res.length, 1);
            strictEqual(res[0].constructor, FsFile);

            await rm(dirname, {
                force: true,
                recursive: true,
            });
        });
    });

    describe('.read()', () => {
        it('ok', async () => {
            const dirname = 'read-it';
            await mkdir(dirname);
            await mkdir(
                join(dirname, 'a')
            );
            await writeFile(
                join(dirname, 'b.txt'),
                'test'
            );

            const res = await new Self(null, dirname).read();
            await rm(dirname, {
                force: true,
                recursive: true,
            });

            deepStrictEqual(res, ['a', 'b.txt']);
        });
    });

    describe('.remove()', () => {
        it('ok', async () => {
            const dirname = 'dir-remove';
            await mkdir(dirname);

            await writeFile(
                join(dirname, 'file'),
                'hello'
            );

            await mkdir(
                join(dirname, 'dir')
            );

            const self = new Self(null, dirname);
            await self.remove();

            const ok = existsSync(dirname);
            strictEqual(ok, false);
        });
    });
});