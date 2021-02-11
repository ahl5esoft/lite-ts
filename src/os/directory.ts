import { existsSync, mkdir, readdir, rmdir, stat, Stats } from 'fs';
import { dirname, join } from 'path';
import { promisify } from 'util';

import { OSFile } from './file';
import { DirectoryBase } from '../io/directory-base';
import { IONodeBase } from '../io/node-base';

const mkdirAction = promisify(mkdir);
const readdirFunc = promisify(readdir);
const rmdirAction = promisify(rmdir);
const statFunc = promisify(stat);

export class OSDirectory extends DirectoryBase {
    public async childDirectories(): Promise<OSDirectory[]> {
        return this.children((stat): boolean => stat.isDirectory(), OSDirectory);
    }

    public async childFiles(): Promise<OSFile[]> {
        return this.children((stat): boolean => stat.isFile(), OSFile);
    }

    public async exists(): Promise<boolean> {
        return existsSync(this.path);
    }

    public async mk(): Promise<void> {
        const isExist = await this.exists();
        if (isExist) {
            return;
        }

        await new OSDirectory(dirname(this.path)).mk();

        await mkdirAction(this.path);
    }

    public async mv(dstDirPath: string): Promise<void> {
        const dstDir = new OSDirectory(dstDirPath);
        let isExist = await dstDir.exists();
        if (isExist) {
            throw new Error(`目录已经存在: ${dstDirPath}`);
        }

        isExist = await this.exists();
        if (!isExist) {
            return;
        }

        await dstDir.mk();

        const directories = await this.childDirectories();
        for (const r of directories) {
            await r.mv(join(dstDirPath, r.name));
        }

        const files = await this.childFiles();
        for (const r of files) {
            await r.mv(join(dstDirPath, r.name));
        }

        await this.rm();
    }

    public async rm(): Promise<void> {
        let ok = await this.exists();
        if (!ok) {
            return;
        }

        const directories = await this.childDirectories();
        for (const r of directories) {
            await r.rm();
        }

        const files = await this.childFiles();
        for (const r of files) {
            await r.rm();
        }

        await rmdirAction(this.path);
    }

    private async children<T extends IONodeBase>(
        checkFunc: (stat: Stats) => boolean,
        Node: new (path: string) => T
    ): Promise<T[]> {
        const isExist = await this.exists();
        if (!isExist) {
            return [];
        }

        let children: T[] = [];
        const files = await readdirFunc(this.path);
        for (const r of files) {
            const nodePath = join(this.path, r);
            const nodeStat = await statFunc(nodePath);
            if (checkFunc(nodeStat)) {
                children.push(new Node(nodePath));
            }
        }
        return children;
    }
}
