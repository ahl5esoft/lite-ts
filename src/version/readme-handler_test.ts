import { ReadmeHandler } from './readme-handler';
import { IFile } from '../contract';
import { Mock } from '../service/assert';

describe('src/version/readme-handler.ts', () => {
    describe('.handle()', () => {
        it('ok', async () => {
            const mockFile = new Mock<IFile>();

            mockFile.expectReturn(
                r => r.readString(),
                '# ![Version](https://img.shields.io/badge/version-1.1.1-green.svg)'
            );

            mockFile.expected.write('# ![Version](https://img.shields.io/badge/version-1.1.2-green.svg)');

            await new ReadmeHandler(mockFile.actual, '0.0.1').handle();
        });
    });
});