import { Mock } from 'lite-ts-mock';

import { JsonFileHandler } from './json-file-handler';
import { IFile } from '../contract';

describe('src/version/json-file-handler.ts', () => {
    describe('.handle()', () => {
        it('ok', async () => {
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