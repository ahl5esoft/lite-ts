import { strictEqual } from 'assert';

import { OSDirectory, OSFile } from '../../../io/os';
import { ReadmeHandler } from '../../../main/version/readme-handler';

describe('src/main/version/readme-handler.ts', (): void => {
    describe('.handling(ctx: Context): Promise<void>', (): void => {
        it('ok', async (): Promise<void> => {
            const dir = new OSDirectory(__dirname, 'readme-handler');
            await dir.create();

            const readme = new OSFile(dir.path, ReadmeHandler.filename);
            await readme.write('# ![Version](https://img.shields.io/badge/version-0.0.0-green.svg)');

            let err: Error;
            try {
                await new ReadmeHandler().handle({
                    rootDir: dir,
                    version: '5.0.1'
                });
            } catch (ex) {
                err = ex;
            }

            const text = await readme.readString();
            await dir.remove();

            strictEqual(err, undefined);

            strictEqual(text, '# ![Version](https://img.shields.io/badge/version-5.0.1-green.svg)');
        });
    });
});