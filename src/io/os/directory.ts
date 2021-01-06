import { existsSync, Stats } from 'fs';
import { mkdir, readdir, rmdir, stat } from 'fs/promises';
import { dirname, join } from 'path';

import { File } from './file';
import { DirectoryBase } from '../directory-base';
import { NodeBase } from '../node-base';

export class Directory extends DirectoryBase {
    public async create(): Promise<void> {
        const isExist = await this.isExist();
        if (isExist)
            return;

        await new Directory(
            dirname(this.path)
        ).create();

        await mkdir(this.path);
    }

    public async findDirectories(): Promise<Directory[]> {
        return this.find((stat): boolean => {
            return stat.isDirectory();
        }, Directory);
    }

    public async findFiles(): Promise<File[]> {
        return this.find((stat): boolean => {
            return stat.isFile();
        }, File);
    }

    public async isExist(): Promise<boolean> {
        return existsSync(this.path);
    }

    public async move(dstDirPath: string): Promise<void> {
        const dstDir = new Directory(dstDirPath);
        let isExist = await dstDir.isExist();
        if (isExist)
            throw new Error(`目录已经存在: ${dstDirPath}`);

        isExist = await this.isExist();
        if (!isExist)
            return;

        await dstDir.create();

        const directories = await this.findDirectories();
        for (const r of directories) {
            await r.move(
                join(dstDirPath, r.name)
            );
        }

        const files = await this.findFiles();
        for (const r of files) {
            await r.move(
                join(dstDirPath, r.name)
            );
        }

        await this.remove();
    }

    public async remove(): Promise<void> {
        let ok = await this.isExist();
        if (!ok)
            return;

        const directories = await this.findDirectories();
        for (const r of directories) {
            await r.remove();
        }

        const files = await this.findFiles();
        for (const r of files) {
            await r.remove();
        }

        await rmdir(this.path);
    }

    private async find<T extends NodeBase>(
        checkFunc: (stat: Stats) => boolean,
        ctor: new (path: string) => T
    ): Promise<T[]> {
        const isExist = await this.isExist();
        if (!isExist)
            return [];

        let children: T[] = [];
        const files = await readdir(this.path);
        for (const r of files) {
            const nodePath = join(this.path, r);
            const nodeStat = await stat(nodePath);
            if (checkFunc(nodeStat)) {
                children.push(
                    new ctor(nodePath)
                );
            }
        }
        return children;
    }
}
