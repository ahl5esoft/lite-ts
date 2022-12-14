import { strictEqual } from 'assert';
import { mkdir, rm, writeFile } from 'fs/promises';

import { FsDirectory as Self } from './directory';
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

describe('src/service/fs/directory.ts', () => {
    describe('.moveTo(v: any)', () => {
        it('IDirectory', async () => {
            await mkdir('zomball');
            await mkdir('zomball/test');
            await mkdir('zomball/test/move-to-it');
            await mkdir('zomball/test/move-to-it/a');
            await writeFile('zomball/test/move-to-it/a/a.txt', 'aa');
            await writeFile('zomball/test/move-to-it/b.txt', 'bb');

            await new Self(null, 'zomball/test/move-to-it').moveTo(
                qiniuFileFactory.buildDirectory('zomball/test/move-to-it')
            );

            const bucketManager = await qiniuFileFactory.bucketManager;
            let resA: boolean;
            let resB: boolean;
            try {
                resA = await new Promise<boolean>(async (s, f) => {
                    bucketManager.stat('zomball', 'test/move-to-it/a/a.txt', (err, _, resInfo) => {
                        if (err)
                            return f(err);

                        s(resInfo.statusCode == 200);
                    });
                });

                resB = await new Promise<boolean>(async (s, f) => {
                    bucketManager.stat('zomball', 'test/move-to-it/b.txt', (err, _, resInfo) => {
                        if (err)
                            return f(err);

                        s(resInfo.statusCode == 200);
                    });
                });
            } finally {
                await rm('zomball', {
                    force: true,
                    recursive: true,
                });

                await new Promise<void>(async s => {
                    bucketManager.delete('zomball', 'test/move-to-it/a/a.txt', () => {
                        s();
                    });
                });
                await new Promise<void>(async s => {
                    bucketManager.delete('zomball', 'test/move-to-it/b.txt', () => {
                        s();
                    });
                });
            }
            strictEqual(resA, true);
            strictEqual(resB, true);
        });
    });
});