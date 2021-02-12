import { deepStrictEqual } from 'assert';

import { FileBase } from '../../src/io';
import { JsonFileHandler } from '../../version/json-file-handler';

describe('version/json-file-handler.ts', (): void => {
    describe('.handle(): Promise<void>', (): void => {
        it('ok', async (): Promise<void> => {
            const mockDir = {
                path: 'dir'
            } as any;
            const filename = 'package.json';
            const version = '1.1.0';
            const entry = {
                version: '0.0.0'
            };
            const mockFile = {
                exists: async (): Promise<boolean> => {
                    return false;
                },
                readJSON: async (): Promise<any> => {
                    return entry;
                },
                write: async (content: any): Promise<void> => {
                    deepStrictEqual(content, {
                        version: version
                    });
                }
            } as any;
            const mockIOFactory = {
                buildFile: (...args: string[]): FileBase => {
                    deepStrictEqual(args, [mockDir.path, filename]);
                    return mockFile;
                }
            } as any;

            await new JsonFileHandler(mockIOFactory, mockDir, filename, version).handle();
        });
    });
});