import { strictEqual } from 'assert';
import { mkdir, rm, writeFile } from 'fs/promises';

import { FsFile as Self } from './file';
import { QiniuFileFactory } from '../qiniu';

const qiniuFileFactory = new QiniuFileFactory(async () => {
    return {
        accessKey: '',
        secretKey: '',
        useCdnDomain: true,
        useHttpsDomain: false,
        zone: 'Zone_z2',
    };
});

describe('src/service/fs/file.ts', () => {
    describe('.moveTo(v: any)', () => {
        it('七牛', async () => {
            await mkdir('zomball');
            await mkdir('zomball/test');
            await writeFile('zomball/test/move-to-it.txt', 'test');

            const self = new Self(null, 'zomball/test/move-to-it.txt');
            await self.moveTo(
                qiniuFileFactory.buildFile('zomball/test/move-to-it.txt')
            );

            const bucketManager = await qiniuFileFactory.bucketManager;
            let res: boolean;
            let err: Error;
            try {
                res = await new Promise<boolean>(async (s, f) => {
                    bucketManager.stat('zomball', 'test/move-to-it.txt', (err, _, resInfo) => {
                        if (err)
                            return f(err);

                        s(resInfo.statusCode == 200);
                    });
                });
            } finally {
                await new Promise<string>(async (_, f) => {
                    bucketManager.delete('zomball', 'test/move-to-it.txt', f);
                });

                await rm('zomball', {
                    force: true,
                    recursive: true,
                });
            }
            strictEqual(res, true);
            strictEqual(err, null);
        });
    });
});