import { deepStrictEqual, ok, strictEqual } from 'assert';
import { existsSync, readFile } from 'fs';
import { mkdir, rmdir, unlink, writeFile } from 'fs/promises';
import { join } from 'path';
import { promisify } from 'util';

import { OSDirectory as Self } from '../../../io/os';

describe('io/os/directory.ts', (): void => {
    describe('.create(): Promise<void>', (): void => {
        it('parent exists', async (): Promise<void> => {
            const self = new Self(__dirname, 'create');
            await self.create();

            const isExist = existsSync(self.path);

            await rmdir(self.path);

            ok(isExist);
        });

        it('parent not exists', async (): Promise<void> => {
            const self = new Self(__dirname, 'parent', 'create');
            await self.create();

            const isExist = existsSync(self.path);

            await rmdir(self.path);
            await rmdir(
                join(self.path, '..')
            );

            ok(isExist);
        });
    });

    describe('.findDirectories(): Promise<Directory[]>', (): void => {
        it('ok', async (): Promise<void> => {
            const dirPath = join(__dirname, 'findDirectories');
            await mkdir(dirPath);

            const childDirA = join(dirPath, 'd-a');
            await mkdir(childDirA);

            const childDirB = join(dirPath, 'd-b');
            await mkdir(childDirB);

            const fileA = join(dirPath, 'f-a.txt');
            await writeFile(fileA, 'a');

            const res = await new Self(dirPath).findDirectories();
            await rmdir(childDirA);
            await rmdir(childDirB);
            await unlink(fileA);
            await rmdir(dirPath);

            strictEqual(res.length, 2);
            deepStrictEqual(
                res.map((r): string => {
                    return r.name;
                }),
                ['d-a', 'd-b']
            );
        });
    });

    describe('.findFiles(): Promise<File[]>', (): void => {
        it('ok', async (): Promise<void> => {
            const dirPath = join(__dirname, 'childFiles');
            await mkdir(dirPath);

            const childDirA = join(dirPath, 'd-a');
            await mkdir(childDirA);

            const childDirB = join(dirPath, 'd-b');
            await mkdir(childDirB);

            const fileA = join(dirPath, 'f-a.txt');
            await writeFile(fileA, 'a');

            const res = await new Self(dirPath).findFiles();

            await rmdir(childDirA);
            await rmdir(childDirB);
            await unlink(fileA);
            await rmdir(dirPath);

            strictEqual(res.length, 1);
            deepStrictEqual(
                res.map((r): string => {
                    return r.name;
                }),
                ['f-a.txt']
            );
        });
    });

    describe('isExist(): Promise<boolean>', (): void => {
        it('ok', async (): Promise<void> => {
            const dirPath = join(__dirname, 'directory-exsits-ok');
            await mkdir(dirPath);

            const res = await new Self(dirPath).isExist();
            ok(res);

            await rmdir(dirPath);
        });

        it('not exist', async (): Promise<void> => {
            const dirPath = join(__dirname, 'directory-exsits-not-exist');
            const res = await new Self(dirPath).isExist();
            strictEqual(res, false);
        });
    });

    describe('.move(dstDirPath: string): Promise<void>', (): void => {
        it('ok', async (): Promise<void> => {
            const srcPath = join(__dirname, 'directory-mv-src-path-ok-src');
            await mkdir(srcPath);
            await writeFile(
                join(srcPath, 'file.txt'),
                'one'
            );
            await mkdir(
                join(srcPath, 'dir')
            );

            const dstPath = join(__dirname, 'directory-mv-src-path-ok-dst');
            await new Self(srcPath).move(dstPath);

            const dstFilePath = join(dstPath, 'file.txt');
            let isExist = existsSync(dstFilePath);

            const fileContent = await promisify(readFile)(dstFilePath, 'utf8');

            isExist = existsSync(
                join(dstPath, 'dir')
            );

            await unlink(
                join(dstPath, 'file.txt')
            );
            await rmdir(
                join(dstPath, 'dir')
            );
            await rmdir(dstPath);

            ok(isExist);
            strictEqual(fileContent, 'one');
            ok(isExist);
        });
    });

    describe('.remove(): Promise<void>', (): void => {
        it('has file', async (): Promise<void> => {
            const dirPath = join(__dirname, 'directory-rm-has-file');
            await mkdir(dirPath);

            const filePath = join(dirPath, 'file-a.txt');
            await writeFile(filePath, '');

            await new Self(dirPath).remove();

            let res = existsSync(filePath);
            strictEqual(res, false);

            res = existsSync(dirPath);
            strictEqual(res, false);
        });

        it('has dir and file', async (): Promise<void> => {
            const dirPath = join(__dirname, 'directory-rm-has-file');
            await mkdir(dirPath);

            const filePath = join(dirPath, 'file-a.txt');
            await writeFile(filePath, '');

            const childDirPath = join(dirPath, 'dir');
            await mkdir(childDirPath);

            const childFilePath = join(childDirPath, 'file-b.txt');
            await writeFile(childFilePath, '');

            await new Self(dirPath).remove();

            let res = existsSync(childFilePath);
            strictEqual(res, false);

            res = existsSync(childDirPath);
            strictEqual(res, false);

            res = existsSync(filePath);
            strictEqual(res, false);

            res = existsSync(dirPath);
            strictEqual(res, false);
        });

        it.only('not exists', async (): Promise<void> => {
            let err: Error;
            try {
                await new Self(__dirname, 'directory-rm-not-exists').remove();
            } catch (ex) {
                err = ex;
            }
            strictEqual(err, undefined);
        });
    });
});
