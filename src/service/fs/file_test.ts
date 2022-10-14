import { strictEqual } from 'assert';
import { readFile, unlink } from 'fs/promises';

import { FsFile as Self } from './file';

describe('src/service/fs/file.ts', () => {
    describe('.write(v: any)', () => {
        it('string', async () => {
            const filePath = 'test-file-write-string';
            const self = new Self(filePath);

            await self.write('str');

            const res = await readFile(filePath, 'utf-8');
            strictEqual(res, 'str');

            await unlink(filePath);
        });
    });
});