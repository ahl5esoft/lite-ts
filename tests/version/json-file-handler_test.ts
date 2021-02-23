import { deepStrictEqual } from 'assert';

import { JsonFileHandler } from '../../version/json-file-handler';

describe('version/json-file-handler.ts', (): void => {
    describe('.handle(): Promise<void>', (): void => {
        it('ok', async (): Promise<void> => {
            const version = '1.1.0';
            const mockFile: any = {
                exists: () => {
                    return true;
                },
                readJSON: () => {
                    return {
                        version: '0.0.1'
                    };
                },
                write: res => {
                    deepStrictEqual(res, {
                        version: version
                    });
                }
            };
            await new JsonFileHandler(mockFile, version).handle();
        });
    });
});