import { existsSync, mkdir, readdir, rmdir, stat, Stats } from 'fs';
import { dirname, join } from 'path';
import { promisify } from 'util';

import { FSFile } from './file';
import { IODirectoryBase, IOFileBase, IONodeBase } from '../../contract';

const mkdirAction = promisify(mkdir);
const readdirFunc = promisify(readdir);
const rmdirAction = promisify(rmdir);
const statFunc = promisify(stat);

export class FSDirectory extends IODirectoryBase {
    public async create() {
        const isExist = await this.exists();
        if (isExist)
            return;

        await new FSDirectory(
            dirname(this.path)
        ).create();

        await mkdirAction(this.path);
    }

    public async exists() {
        return existsSync(this.path);
    }

    public async findDirectories(): Promise<IODirectoryBase[]> {
        return this.children(
            (stat): boolean => stat.isDirectory(),
            FSDirectory
        );
    }

    public async findFiles(): Promise<IOFileBase[]> {
        return this.children(
            (stat): boolean => stat.isFile(),
            FSFile
        );
    }

    public async copyTo(dstDirPath: string) {
        const dstDir = new FSDirectory(dstDirPath);
        let isExist = await dstDir.exists();
        if (isExist)
            throw new Error(`目录已经存在: ${dstDirPath}`);

        isExist = await this.exists();
        if (!isExist)
            return;

        await dstDir.create();

        const directories = await this.findDirectories();
        for (const r of directories) {
            await r.copyTo(
                join(dstDirPath, r.name)
            );
        }

        const files = await this.findFiles();
        for (const r of files) {
            await r.copyTo(
                join(dstDirPath, r.name)
            );
        }
    }

    public async move(dstDirPath: string) {
        await this.copyTo(dstDirPath);

        await this.remove();
    }

    public async remove() {
        let ok = await this.exists();
        if (!ok)
            return;

        const directories = await this.findDirectories();
        for (const r of directories)
            await r.remove();

        const files = await this.findFiles();
        for (const r of files)
            await r.remove();

        await rmdirAction(this.path);
    }

    private async children<T extends IONodeBase>(
        checkFunc: (stat: Stats) => boolean,
        Node: new (path: string) => T
    ) {
        const isExist = await this.exists();
        if (!isExist)
            return [];

        let children: T[] = [];
        const files = await readdirFunc(this.path);
        for (const r of files) {
            const nodePath = join(this.path, r);
            const nodeStat = await statFunc(nodePath);
            if (checkFunc(nodeStat)) {
                children.push(
                    new Node(nodePath)
                );
            }
        }
        return children;
    }
}
