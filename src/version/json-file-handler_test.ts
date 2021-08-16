import { JsonFileHandler } from './json-file-handler';
import { IOFileBase } from '../contract';
import { Mock } from '../service/assert';

describe('src/tool/version/json-file-handler.ts', (): void => {
    describe('.handle(): Promise<void>', (): void => {
        it('ok', async (): Promise<void> => {
            const mockFile = new Mock<IOFileBase>();

            mockFile.expectReturn(
                r => r.exists(),
                true
            );

            mockFile.expectReturn(
                r => r.readJSON(),
                {
                    version: '1.1.1'
                }
            );

            const version = '0.0.1';
            mockFile.expected.write({
                version: '1.1.2'
            });

            await new JsonFileHandler(mockFile.actual, version).handle();
        });
    });
});