import { SftpInvoker } from './sftp-invoker';
import { SftpIODirectory as Self } from './sftp-io-directory';
import { Mock, mockAny } from '../assert';
import { IODirectoryBase, IOFactoryBase } from '../..';

describe('src/service/ssh2/sftp-io-directory.ts', () => {
    describe('.create()', () => {
        it('ok', async () => {
            const mockSshIOFactory = new Mock<IOFactoryBase>();
            const mockInvoker = new Mock<SftpInvoker>();
            const self = new Self(null, mockSshIOFactory.actual, mockInvoker.actual, ['a', 'b']);

            Reflect.set(self, 'exists', () => {
                return true;
            });

            const mockSshParentDir = new Mock<IODirectoryBase>();
            mockSshIOFactory.expectReturn(
                r => r.buildDirectory('b'),
                mockSshParentDir.actual
            );

            mockSshParentDir.expected.create();

            mockInvoker.expected.call(mockAny, ['a/b']);

            await self.create();
        });
    });
});