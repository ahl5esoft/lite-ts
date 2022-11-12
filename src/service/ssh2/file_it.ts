import { strictEqual } from 'assert';
import { readFile, unlink } from 'fs/promises';

import { Ssh2FileFactory } from './file-factory';
import { FsFileFactory } from '../fs';

const fsFileFileFactory = new FsFileFactory();
const fileFactory = new Ssh2FileFactory(fsFileFileFactory, {
    host: '127.0.0.1',
    username: 'devops',
});

describe('src/service/ssh2/file.ts', () => {
    describe('.moveTo(v: IFileEntryMoveToOption)', () => {
        it('isLocal = true', async () => {
            const filename = 'move-to_it.json';
            await fileFactory.invokeSftp<void>(r => r.writeFile, `/mnt/fengling/devops/${filename}`, 'test');

            const self = fileFactory.buildFile(`/mnt/fengling/devops/${filename}`);
            await self.moveTo({
                isLocal: true,
                paths: [filename],
            });

            const res = await readFile(filename, 'utf-8');
            await unlink(filename);
            strictEqual(res, 'test');

            const isExist = await fileFactory.invokeSftp<boolean>(r => r.exists, `/mnt/fengling/devops/${filename}`);
            strictEqual(isExist, false);
        });
    });

    describe('.remove()', () => {
        it('ok', async () => {
            const path = '/mnt/fengling/devops/remove-file';
            await fileFactory.invokeSftp<void>(r => r.writeFile, path, 'tt');

            await fileFactory.buildFile(path).remove();

            const res = await fileFactory.invokeSftp<boolean>(r => r.exists, path);
            strictEqual(res, false);
        });
    });
});