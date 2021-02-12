import { strictEqual } from 'assert';

import { DirectoryBase, FileBase, IOFactoryBase } from '../../src/io';
import { ReadmeHandler } from '../../version/readme-handler';

describe('version/readme-handler.ts', (): void => {
    describe('.handle(): Promise<void>', (): void => {
        it('ok', async (): Promise<void> => {
            const dirPath = 'dir';
            const filename = 'README.md'

            const mockFile: FileBase = {
                readString: async (): Promise<string> => {
                    return '# ![Version](https://img.shields.io/badge/version-0.0.0-green.svg)';
                },
                write: async (text: string): Promise<void> => {
                    strictEqual(text, '# ![Version](https://img.shields.io/badge/version-1.1.1-green.svg)');
                }
            } as any;
            const mockIOFactory: IOFactoryBase = {
                buildFile: (...args: string[]): FileBase => {
                    return args[0] == dirPath && args[1] == filename ? mockFile : null;
                }
            } as any;
            const mockDir: DirectoryBase = {
                path: dirPath,
            } as any;
            await new ReadmeHandler(mockIOFactory, mockDir, '1.1.1').handle();
        });
    });
});