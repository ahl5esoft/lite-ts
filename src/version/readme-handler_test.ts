import { ReadmeHandler } from './readme-handler';
import { IOFileBase } from '../contract';
import { Mock } from '../service/assert';

describe('src/tool/version/readme-handler.ts', () => {
    describe('.handle(): Promise<void>', () => {
        it('ok', async (): Promise<void> => {
            const mockFile = new Mock<IOFileBase>();

            mockFile.expectReturn(
                r => r.readString(),
                '# ![Version](https://img.shields.io/badge/version-1.1.1-green.svg)'
            );

            mockFile.expected.write('# ![Version](https://img.shields.io/badge/version-1.1.2-green.svg)');

            await new ReadmeHandler(mockFile.actual, '0.0.1').handle();
        });
    });
});