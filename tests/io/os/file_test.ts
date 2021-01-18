import { deepStrictEqual, ok, strictEqual } from 'assert';
import { existsSync } from 'fs';
import { mkdir, readFile, rmdir, unlink, writeFile } from 'fs/promises';
import { dirname, extname, join } from 'path';

import { OSFile as Self } from '../../../io/os';

describe('io/os/file.ts', (): void => {
    describe('.ext', (): void => {
        it('ok', async (): Promise<void> => {
            const name = `file-name.txt`;
            const res = new Self(__dirname, name).ext;
            strictEqual(
                res,
                extname(name)
            );
        });
    });

    describe('.name', (): void => {
        it('ok', async () => {
            const name = `file-name.txt`;
            const res = new Self(__dirname, name).name;
            strictEqual(res, name);
        });
    });

    describe('.isExist(): Promise<boolean>', (): void => {
        it('not exist', async (): Promise<void> => {
            const res = await new Self(__dirname, `file-exists-not-exist.txt`).isExist();
            strictEqual(res, false);
        });

        it('ok', async (): Promise<void> => {
            const file = new Self(__dirname, `file-exists-ok.txt`);
            await writeFile(file.path, '');

            const res = await file.isExist();
            await unlink(file.path);

            ok(res);
        });
    });

    describe('.move(dstFilePath: string): Promise<void>', (): void => {
        it('src path not exists', async (): Promise<void> => {
            const file = new Self(__dirname, 'file-mv-src-path-not-exists');
            let err: Error;
            try {
                await file.move('');
            } catch (ex) {
                err = ex;
            }
            strictEqual(err, undefined);
        });


        it('dst path not exists', async (): Promise<void> => {
            let srcPath = join(__dirname, 'file-mv-dst-path-not-exists-src');
            await mkdir(srcPath);

            srcPath = join(srcPath, 'dir');
            await mkdir(srcPath);

            srcPath = join(srcPath, 'file.txt');
            await writeFile(srcPath, 'src');

            let dstPath = join(__dirname, 'file-mv-dst-path-not-exists-dst', 'dir', 'file.txt');

            const self = new Self(srcPath);
            let err: Error;
            try {
                await self.move(dstPath);
            } catch (ex) {
                err = ex;
            }

            strictEqual(err, undefined);

            let isExist = existsSync(dstPath);
            ok(isExist);
            await unlink(dstPath);

            dstPath = dirname(dstPath);
            await rmdir(dstPath);

            dstPath = dirname(dstPath);
            await rmdir(dstPath);

            isExist = await self.isExist();
            strictEqual(isExist, false);

            await self.remove();

            srcPath = dirname(srcPath);
            await rmdir(srcPath);

            srcPath = dirname(srcPath);
            await rmdir(srcPath);
        });

        it('dst path is exist', async (): Promise<void> => {
            const dstPath = join(__dirname, 'file-mv-dst-path-is-exists-dst');
            await writeFile(dstPath, 'dst');

            const self = new Self('');
            let err: Error;
            try {
                await self.move(dstPath);
            } catch (ex) {
                err = ex;
            }

            await unlink(dstPath);

            ok(err);
        });
    });

    describe('.readJSON<T>(): Promise<T>', (): void => {
        it('ok', async (): Promise<void> => {
            const file = new Self(__dirname, `file-readJSON.txt`);
            const arr = [1, 2, 3, 4];
            await writeFile(
                file.path,
                JSON.stringify(arr)
            );

            const res = await file.readJSON<number[]>();

            await unlink(file.path);

            deepStrictEqual(res, arr);
        });
    });

    describe('.readString(): Promise<string>', (): void => {
        it('ok', async (): Promise<void> => {
            const file = new Self(__dirname, `file-readString`);
            const text = 'readString';
            await writeFile(file.path, text);

            const res = await file.readString();
            await unlink(file.path);

            strictEqual(res, text);
        });
    });

    describe('.remove(): Promise<void>', (): void => {
        it('not exist', async (): Promise<void> => {
            let err: Error;
            try {
                await new Self(__dirname, `file-rm-not-exist.txt`).remove();
            } catch (ex) {
                err = ex;
            }

            strictEqual(err, undefined);
        });

        it('ok', async (): Promise<void> => {
            const file = new Self(__dirname, `file-rm-ok.txt`);
            await writeFile(file.path, '');

            let err: Error;
            try {
                await file.remove();
            } catch (ex) {
                err = ex;
            }

            strictEqual(err, undefined);

            const ok = await file.isExist();
            strictEqual(ok, false);
        });
    });

    describe('.write(content: any): Promise<void>', (): void => {
        it('ok', async (): Promise<void> => {
            const file = new Self(__dirname, `file-write`);
            const text = 'writeString';
            await file.write(text);

            const res = await readFile(file.path, 'utf8');
            strictEqual(res, text);

            await unlink(file.path);
        });

        it('obj', async (): Promise<void> => {
            const file = new Self(__dirname, `file-write`);
            const obj = {
                a: 1,
                b: 2,
            };
            await file.write(obj);

            const res = await readFile(file.path, 'utf8');

            await unlink(file.path);

            strictEqual(
                res,
                JSON.stringify(obj)
            );
        });
    });
});
