import { deepStrictEqual, strictEqual } from 'assert';

import { Ssh2FileFactory } from './file-factory';
import { FsFileFactory } from '../fs';

const fsFileFileFactory = new FsFileFactory();
const fileFactory = new Ssh2FileFactory(fsFileFileFactory, {
    host: '127.0.0.1',
    username: 'devops',
});

describe('src/service/ssh2/directory.ts', () => {
    describe('.create()', () => {
        it('ok', async () => {
            const dirPath = '/mnt/fengling/devops/create-it';
            await fileFactory.buildDirectory(dirPath).create();

            const res = await fileFactory.invokeSftp<boolean>(r => r.exists, dirPath);
            strictEqual(res, true);

            await fileFactory.invokeSftp<void>(r => r.rmdir, dirPath);
        });
    });

    describe('.findDirectories()', () => {
        it('ok', async () => {
            const dirPath = '/mnt/fengling/devops/findDirectories-it';
            await fileFactory.invokeSftp<void>(r => r.mkdir, dirPath);
            await fileFactory.invokeSftp<void>(r => r.mkdir, `${dirPath}/it`, 'test');

            const self = fileFactory.buildDirectory(dirPath);
            const res = await self.findDirectories();

            await fileFactory.invokeSftp<void>(r => r.rmdir, `${dirPath}/it`);
            await fileFactory.invokeSftp<void>(r => r.rmdir, dirPath);

            deepStrictEqual(res.length, 1);
        });
    });

    describe('.findFiles()', () => {
        it('ok', async () => {
            const dirPath = '/mnt/fengling/devops/findFiles-it';
            await fileFactory.invokeSftp<void>(r => r.mkdir, dirPath);
            await fileFactory.invokeSftp<void>(r => r.writeFile, `${dirPath}/it.txt`, 'test');

            const self = fileFactory.buildDirectory(dirPath);
            const res = await self.findFiles();

            await fileFactory.invokeSftp<void>(r => r.unlink, `${dirPath}/it.txt`);
            await fileFactory.invokeSftp<void>(r => r.rmdir, dirPath);

            deepStrictEqual(res.length, 1);
        });
    });

    describe('.moveTo(v: IFileEntryMoveToOption)', () => {
        it('isLocal = true', async () => {
            const remoteDir = '/mnt/fengling/devops/dir-move-to-it';
            await fileFactory.invokeSftp<void>(r => r.mkdir, remoteDir);
            await fileFactory.invokeSftp<void>(r => r.mkdir, `${remoteDir}/a`);
            await fileFactory.invokeSftp<void>(r => r.writeFile, `${remoteDir}/a/a.txt`, 'is a');
            await fileFactory.invokeSftp<void>(r => r.writeFile, `${remoteDir}/b.txt`, 'is b');

            const localPath = 'move-to-it';
            await fileFactory.buildDirectory(remoteDir).moveTo({
                isLocal: true,
                paths: [localPath],
            });

            const aIsExist = await fsFileFileFactory.buildFile(localPath, 'a', 'a.txt').exists();
            const bIsExist = await fsFileFileFactory.buildFile(localPath, 'b.txt').exists();
            const isExist = await fileFactory.invokeSftp<boolean>(r => r.exists, remoteDir);

            await fsFileFileFactory.buildDirectory(localPath).remove();

            strictEqual(aIsExist, true);
            strictEqual(bIsExist, true);
            strictEqual(isExist, false);
        });
    });
});