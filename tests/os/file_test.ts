import { deepStrictEqual, ok, strictEqual } from 'assert';
import { existsSync, mkdir, readFile, rmdir, unlink, writeFile } from 'fs';
import { dirname, extname, join } from 'path';
import { promisify } from 'util';

import { OSFile as Self } from '../../src/os/file';

describe('src/lib/io/os/file', (): void => {
    describe('.ext', (): void => {
        it.only('ok', async (): Promise<void> => {
            const name = `file-name-${Date.now()}.txt`;
            strictEqual(new Self(__dirname, name).ext, extname(name));
        });
    });

    describe('.name', (): void => {
        it('ok', async () => {
            const name = `file-name-${Date.now()}.txt`;
            strictEqual(new Self(__dirname, name).name, name);
        });
    });

    describe('.exists(): Promise<boolean>', (): void => {
        it('not exist', async (): Promise<void> => {
            const filePath = join(__dirname, `file-exists-not-exist-${Date.now()}.txt`);
            const res = await new Self(filePath).exists();
            strictEqual(res, false);
        });

        it('ok', async (): Promise<void> => {
            const filePath = join(__dirname, `file-exists-ok-${Date.now()}.txt`);
            await promisify(writeFile)(filePath, '');

            const res = await new Self(filePath).exists();
            ok(res);

            await promisify(unlink)(filePath);
        });
    });

    describe('.mv(dstPath: string): Promise<void>', (): void => {
        it('src path not exists', async (): Promise<void> => {
            const srcPath = join(__dirname, 'file-mv-src-path-not-exists');
            let err: Error = undefined;
            try {
                await new Self(srcPath).mv('');
            } catch (ex) {
                err = ex;
            }
            strictEqual(err, undefined);
        });

        it('dst path not exists', async (): Promise<void> => {
            let srcPath = join(__dirname, 'file-mv-dst-path-not-exists-src');
            await promisify(mkdir)(srcPath);

            srcPath = join(srcPath, 'dir');
            await promisify(mkdir)(srcPath);

            srcPath = join(srcPath, 'file.txt');
            await promisify(writeFile)(srcPath, 'src');

            let dstPath = join(__dirname, 'file-mv-dst-path-not-exists-dst', 'dir', 'file.txt');

            const self = new Self(srcPath);
            let err: Error;
            try {
                await self.mv(dstPath);
            } catch (ex) {
                err = ex;
            }

            strictEqual(err, undefined);

            let isExist = existsSync(dstPath);
            ok(isExist);
            await promisify(unlink)(dstPath);

            dstPath = dirname(dstPath);
            await promisify(rmdir)(dstPath);

            dstPath = dirname(dstPath);
            await promisify(rmdir)(dstPath);

            isExist = await self.exists();
            strictEqual(isExist, false);

            await self.rm();

            srcPath = dirname(srcPath);
            await promisify(rmdir)(srcPath);

            srcPath = dirname(srcPath);
            await promisify(rmdir)(srcPath);
        });

        it('dst path is exist', async (): Promise<void> => {
            const dstPath = join(__dirname, 'file-mv-dst-path-is-exists-dst');
            await promisify(writeFile)(dstPath, 'dst');

            const self = new Self('');
            let err: Error;
            try {
                await self.mv(dstPath);
            } catch (ex) {
                err = ex;
            }

            ok(err);

            await promisify(unlink)(dstPath);
        });
    });

    describe('.readJSON(): Promise<any>', (): void => {
        it('ok', async (): Promise<void> => {
            const file = new Self(__dirname, `file-readJSON-${Date.now()}.txt`);
            const obj = {
                id: 'test',
                name: 'readJSON',
            };
            await file.write(obj);

            const res = await file.readJSON();

            await file.rm();

            deepStrictEqual(res, obj);
        });
    });

    describe('.readString(): Promise<string>', (): void => {
        it('ok', async (): Promise<void> => {
            const filePath = join(__dirname, `file-readString-${Date.now()}`);
            const text = 'readString';
            await promisify(writeFile)(filePath, text);

            const res = await new Self(filePath).readString();
            strictEqual(res, text);

            await promisify(unlink)(filePath);
        });
    });

    describe('.rm(): Promise<void>', (): void => {
        it('not exist', async (): Promise<void> => {
            const filePath = join(__dirname, `file-rm-not-exist-${Date.now()}.txt`);
            let err: Error;
            try {
                await new Self(filePath).rm();
            } catch (ex) {
                err = ex;
            }

            strictEqual(err, undefined);
        });

        it('ok', async (): Promise<void> => {
            const filePath = join(__dirname, `file-rm-ok-${Date.now()}.txt`);
            await promisify(writeFile)(filePath, '');

            const file = new Self(filePath);
            let err: Error;
            try {
                await file.rm();
            } catch (ex) {
                err = ex;
            }

            strictEqual(err, undefined);

            const ok = await file.exists();
            strictEqual(ok, false);
        });
    });

    describe('.writeString(text: string): Promise<void>', (): void => {
        it('ok', async (): Promise<void> => {
            const filePath = join(__dirname, `file-writeString-${Date.now()}`);
            const text = 'writeString';
            await new Self(filePath).write(text);

            const res = await promisify(readFile)(filePath, 'utf8');
            strictEqual(res, text);

            await promisify(unlink)(filePath);
        });

        it('obj', async (): Promise<void> => {
            const filePath = join(__dirname, `file-writeString-${Date.now()}`);
            const obj = {
                a: 1,
                b: 2,
            };
            await new Self(filePath).write(obj);

            const res = await promisify(readFile)(filePath, 'utf8');

            await promisify(unlink)(filePath);

            strictEqual(res, JSON.stringify(obj, null, '\t'));
        });
    });
});
