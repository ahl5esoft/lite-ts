import { strictEqual } from 'assert';
import { unlink } from 'fs/promises';
import * as qiniu from 'qiniu';

import { QiniuFile as Self } from './file';
import { QiniuFileFactory } from './file-factory';
import { FsFileFactory } from '../fs';

const fileFactory = new QiniuFileFactory(async () => {
    return {
        accessKey: '',
        secretKey: '',
        useCdnDomain: true,
        useHttpsDomain: false,
        zone: 'Zone_z2',
    };
});

describe('src/service/qiniu/file.ts', () => {
    describe('.exists()', () => {
        it('file', async () => {
            const self = new Self(fileFactory, ['zomball', 'test', 'ttt.txt']);
            const res = await self.exists();
            strictEqual(res, true);
        });
    });

    describe('.remove()', () => {
        it('file', async () => {
            const bucket = 'zomball';
            const filePath = 'test/remove-it.txt';
            const token = await fileFactory.getToken(bucket, filePath);
            const putExtra = new qiniu.form_up.PutExtra();
            const uploader = await fileFactory.formUploader;
            await new Promise<void>((s, f) => {
                uploader.put(token, filePath, 'test', putExtra, (err: Error, _: any, resInfo: any) => {
                    if (err)
                        return f(err);

                    if (resInfo.statusCode != 200)
                        return f(`上传七牛失败`);

                    s();
                });
            });

            const self = new Self(fileFactory, [
                bucket,
                ...filePath.split('/')
            ]);
            await self.remove();

            const bucketManager = await fileFactory.bucketManager;
            let res: boolean;
            let err: Error;
            try {
                res = await new Promise<boolean>(async (s, f) => {
                    bucketManager.stat(bucket, filePath, (err, _, resInfo) => {
                        if (err)
                            return f(err);

                        s(resInfo.statusCode == 200);
                    });
                });

                await new Promise<void>(async s => {
                    bucketManager.delete(bucket, filePath, () => {
                        s();
                    });
                });
            } catch (ex) {
                err = ex;
            }
            strictEqual(res, false);
            strictEqual(err, null);
        });
    });

    describe('.write(v: any)', () => {
        it('string', async () => {
            const self = new Self(fileFactory, ['zomball', 'write-string-it.json']);
            await self.write('hello');

            const bucketManager = await fileFactory.bucketManager;
            let err: Error;
            try {
                await new Promise<string>(async (_, f) => {
                    bucketManager.delete('zomball', 'write-string-it.json', err => {
                        f(err);
                    });
                });
            } catch (ex) {
                err = ex;
            }
            strictEqual(err, null);
        });

        it('FsFile', async () => {
            const filename = 'write-fs-file-it.txt';
            const self = new Self(fileFactory, ['zomball', filename]);

            const file = new FsFileFactory().buildFile(__dirname, filename);
            await file.write('hello');

            await self.write(file);

            await unlink(file.path);

            const bucketManager = await fileFactory.bucketManager;
            let err: Error;
            try {
                await new Promise<string>(async (_, f) => {
                    bucketManager.delete('zomball', filename, err => {
                        f(err);
                    });
                });
            } catch (ex) {
                err = ex;
            }
            strictEqual(err, null);
        });
    });
});