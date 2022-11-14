import { strictEqual } from 'assert';
import { readFile } from 'fs/promises';

import { Ssh2FileFactory } from './file-factory';
import { FsFileFactory } from '../fs';
import { FsFile } from '../fs/file';

const fsFileFileFactory = new FsFileFactory();
const fileFactory = new Ssh2FileFactory(fsFileFileFactory, {
    host: '127.0.0.1',
    username: 'devops',
});

describe('src/service/ssh2/file.ts', () => {
    describe('.moveTo(v: any)', () => {
        it.only(FsFile.name, async () => {
            const file = fsFileFileFactory.buildFile('move-to-it.json');
            await fileFactory.invokeSftp<void>(r => r.writeFile, `/mnt/fengling/devops/${file.name}`, 'test');

            const self = fileFactory.buildFile(`/mnt/fengling/devops/${file.name}`);
            await self.moveTo(file);

            const res = await readFile(file.name, 'utf-8');
            await file.remove();
            strictEqual(res, 'test');

            const isExist = await fileFactory.invokeSftp<boolean>(r => r.exists, `/mnt/fengling/devops/${file.name}`);
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