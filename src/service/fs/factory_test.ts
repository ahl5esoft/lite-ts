import { strictEqual } from 'assert';

import { FSDirectory } from './directory';
import { FSFactory } from './factory';
import { FSFile } from './file';

describe('src/service/fs/factory.ts', () => {
    describe('.build(...pathArgs: string[]): Promise<IONodeBase>', () => {
        it('dir', async () => {
            const dir = new FSDirectory(__dirname, 'build-test-dir');
            await dir.create();

            const res = await new FSFactory().build(dir.path);

            await dir.remove();

            strictEqual(res.constructor.name, FSDirectory.name);
        });

        it('file', async () => {
            const file = new FSFile(__dirname, 'test-build-file.txt');
            await file.write('xxx');

            const res = await new FSFactory().build(file.path);

            await file.remove();

            strictEqual(res.constructor.name, FSFile.name);
        });
    });
});
