import { strictEqual } from 'assert';

import { IODirectory } from './io-directory';
import { FSIOFactory } from './io-factory';
import { IOFile } from './io-file';

describe('src/service/fs/io-factory.ts', () => {
    describe('.build(...pathArgs: string[]): Promise<IONodeBase>', () => {
        it('dir', async () => {
            const dir = new IODirectory(__dirname, 'build-test-dir');
            await dir.create();

            const res = await new FSIOFactory().build(dir.path);

            await dir.remove();

            strictEqual(res.constructor.name, IODirectory.name);
        });

        it('file', async () => {
            const file = new IOFile(__dirname, 'test-build-file.txt');
            await file.write('xxx');

            const res = await new FSIOFactory().build(file.path);

            await file.remove();

            strictEqual(res.constructor.name, IOFile.name);
        });
    });
});
