import { strictEqual } from 'assert';
import { existsSync } from 'fs';
import { mkdir, rm, unlink, writeFile } from 'fs/promises';
import { join } from 'path';

import { FsFileEntryBase } from './file-entry-base';

class Self extends FsFileEntryBase {
    public async remove() { }
}

describe('src/service/fs/file-entry-base.ts', () => {
    describe('.moveTo(...paths: string[])', () => {
        it('dir', async () => {
            const srcDirname = 'dir-move-to-src';
            await mkdir(srcDirname);
            await writeFile(
                join(srcDirname, 'file'),
                'file-1'
            );

            const dstDirname = 'dir-move-to-dst';
            await new Self(srcDirname).moveTo({
                paths: [dstDirname]
            });

            strictEqual(
                existsSync(srcDirname),
                false
            );
            strictEqual(
                existsSync(dstDirname),
                true
            );

            await rm(dstDirname, {
                force: true,
                recursive: true,
            });
        });

        it('file', async () => {
            const srcFilename = 'file-move-to-src';
            await writeFile(srcFilename, 'src');

            const dstFilename = 'file-move-to-dst';
            await new Self(srcFilename).moveTo({
                paths: [dstFilename]
            });

            strictEqual(
                existsSync(srcFilename),
                false
            );
            strictEqual(
                existsSync(dstFilename),
                true
            );

            await unlink(dstFilename);
        });
    });
});