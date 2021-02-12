import { strictEqual } from 'assert';

import { OSDirectory, OSFactory, OSFile } from '../../../src/os';

describe('src/lib/io/os/index.ts', (): void => {
    describe('.build(...pathArgs: string[]): Promise<IONodeBase>', (): void => {
        it('dir', async (): Promise<void> => {
            const dir = new OSDirectory(__dirname, 'build-test-dir');
            await dir.create();

            const res = await new OSFactory().build(dir.path);

            await dir.remove();

            strictEqual(res.constructor.name, 'OSDirectory');
        });

        it('file', async (): Promise<void> => {
            const file = new OSFile(__dirname, 'test-build-file.txt');
            await file.write('xxx');

            const res = await new OSFactory().build(file.path);

            await file.remove();

            strictEqual(res.constructor.name, 'OSFile');
        });
    });
});
