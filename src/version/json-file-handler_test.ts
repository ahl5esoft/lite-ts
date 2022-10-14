import { JsonFileHandler } from './json-file-handler';
import { IFile } from '../contract';
import { Mock } from '../service';

describe('src/tool/version/json-file-handler.ts', (): void => {
    describe('.handle(): Promise<void>', (): void => {
        it('ok', async (): Promise<void> => {
            const mockFile = new Mock<IFile>();
            mockFile.expectReturn(
                r => r.exists(),
                true
            );

            mockFile.expectReturn(
                r => r.read(),
                {
                    version: '1.1.1'
                }
            );

            const version = '0.0.1';
            mockFile.expected.write(
                JSON.stringify({
                    version: '1.1.2'
                }, null, '\t'),
            );

            await new JsonFileHandler(mockFile.actual, version).handle();
        });
    });
});