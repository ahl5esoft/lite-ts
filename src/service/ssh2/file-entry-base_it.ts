import { strictEqual } from 'assert';

import { Ssh2FileEntryBase } from './file-entry-base';
import { Ssh2FileFactory } from './file-factory';
import { FsFileFactory } from '../fs';

class Self extends Ssh2FileEntryBase {
    public async moveTo() { }
    public async remove() { }
}

const fsFileFileFactory = new FsFileFactory();
const fileFactory = new Ssh2FileFactory(fsFileFileFactory, {
    host: '127.0.0.1',
    username: 'devops',
});

describe('src/service/ssh2/file-entry-base.ts', () => {
    describe('.exists()', () => {
        it('dir', async () => {
            const path = '/mnt/fengling/devops/exists-dir-it';
            await fileFactory.invokeSftp<void>(r => r.mkdir, path);

            const self = new Self(fileFactory, path);
            let res = await self.exists();
            strictEqual(res, true);

            await fileFactory.invokeSftp<void>(r => r.rmdir, path);

            res = await self.exists();
            strictEqual(res, false);
        });

        it('file', async () => {
            const path = '/mnt/fengling/devops/exists-file-it';
            await fileFactory.invokeSftp<void>(r => r.writeFile, path, 'it');

            const self = new Self(fileFactory, path);
            let res = await self.exists();
            strictEqual(res, true);

            await fileFactory.invokeSftp<void>(r => r.unlink, path);

            res = await self.exists();
            strictEqual(res, false);
        });
    });
});