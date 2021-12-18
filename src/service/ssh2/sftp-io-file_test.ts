import { ISftpInvoker } from './sftp-invoker';
import { SftpIOFile as Self } from './sftp-io-file';
import { Mock, mockAny } from '../assert';
import { strictEqual } from 'assert';
import { join } from 'path';
import { writeFile } from 'fs/promises';
import { existsSync } from 'fs';

describe('src/service/ssh2/sftp-io-file.ts', () => {
    describe('.copyTo(dstPath: string)', () => {
        it('ok', async () => {
            const mockInvoker = new Mock<ISftpInvoker>();
            const self = new Self(mockInvoker.actual, ['copyTo', 'src']);

            const dstPath = '/copyTo/dst';
            mockInvoker.expected.call(mockAny, 'copyTo/src', dstPath);

            await self.copyTo(dstPath);
        });
    });

    describe('.exists()', () => {
        it('ok', async () => {
            const mockInvoker = new Mock<ISftpInvoker>();
            const self = new Self(mockInvoker.actual, ['exists', 'file']);

            mockInvoker.expectReturn(
                r => r.call(mockAny, 'exists/file'),
                true
            );

            const res = await self.exists();
            strictEqual(res, true);
        });
    });

    describe('.move(dstPath: string)', () => {
        it('ok', async () => {
            const srcPath = join(
                process.cwd(),
                'move-src.txt'
            );
            await writeFile(srcPath, 'text');

            const mockInvoker = new Mock<ISftpInvoker>();
            const self = new Self(mockInvoker.actual, [srcPath]);

            const dstPath = 'move-dst';
            mockInvoker.expectReturn(
                r => r.call(mockAny, srcPath, dstPath),
                true
            );

            await self.move(dstPath);

            const isExist = existsSync(srcPath);
            strictEqual(isExist, false);
        });
    });

    describe('.remove()', () => {
        it('ok', async () => {
            const mockInvoker = new Mock<ISftpInvoker>();
            const self = new Self(mockInvoker.actual, ['remove', 'file']);

            mockInvoker.expectReturn(
                r => r.call(mockAny, 'remove/file'),
                true
            );

            await self.remove();
        });
    });
});