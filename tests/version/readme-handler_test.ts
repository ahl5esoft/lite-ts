import { strictEqual } from 'assert';

import { FileBase } from '../../src/io';
import { ReadmeHandler } from '../../version/readme-handler';

describe('version/readme-handler.ts', () => {
    describe('.handle(): Promise<void>', () => {
        it('ok', async (): Promise<void> => {
            const mockFile: FileBase = {
                readString: async (): Promise<string> => {
                    return '# ![Version](https://img.shields.io/badge/version-0.0.0-green.svg)';
                },
                write: async (text: string): Promise<void> => {
                    strictEqual(text, '# ![Version](https://img.shields.io/badge/version-1.1.1-green.svg)');
                }
            } as any;
            await new ReadmeHandler(mockFile, '1.1.1').handle();
        });
    });
});