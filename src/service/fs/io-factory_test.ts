import { strictEqual } from 'assert';

import { IODirectory } from './io-directory';
import { FSIOFactory } from './io-factory';
import { IOFile } from './io-file';

describe('src/service/fs/io-factory.ts', () => {
    describe('.build(...pathArgs: string[]): Promise<IONodeBase>', () => {
        it('dir', async () => {
            const ioFactory = new FSIOFactory();
            const dir = new IODirectory(ioFactory, ['build-test-dir']);
            await dir.create();

            const res = await ioFactory.build(dir.path);

            await dir.remove();

            strictEqual(res.constructor.name, IODirectory.name);
        });

        it('file', async () => {
            const ioFactory = new FSIOFactory();
            const file = new IOFile(ioFactory, ['test-build-file.txt']);
            await file.write('xxx');

            const res = await ioFactory.build(file.path);

            await file.remove();

            strictEqual(res.constructor.name, IOFile.name);
        });
    });
});
