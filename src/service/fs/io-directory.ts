import { existsSync, mkdir, readdir, rmdir } from 'fs';
import { dirname, join } from 'path';
import { promisify } from 'util';

import { FSIOFactory } from '.';
import { IOFile } from './io-file';
import { IODirectoryBase, IONodeBase } from '../../contract';

const mkdirAction = promisify(mkdir);
const readdirFunc = promisify(readdir);
const rmdirAction = promisify(rmdir);

export class IODirectory extends IODirectoryBase {
    public constructor(
        private m_IOFactory: FSIOFactory,
        ...paths: string[]
    ) {
        super(...paths);
    }

    public async create() {
        const isExist = await this.exists();
        if (isExist)
            return;

        await this.m_IOFactory.buildDirectory(
            dirname(this.path),
        ).create();

        await mkdirAction(this.path);
    }

    public async exists() {
        return existsSync(this.path);
    }

    public async findDirectories() {
        return this.findChildren(IODirectory);
    }

    public async findFiles() {
        return this.findChildren(IOFile);
    }

    public async copyTo(dstDirPath: string) {
        const dstDir = this.m_IOFactory.buildDirectory(dstDirPath);
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

    private async findChildren<T extends IONodeBase>(ctor: new (...args: any[]) => T) {
        const isExist = await this.exists();
        if (!isExist)
            return [];

        let children: T[] = [];
        const files = await readdirFunc(this.path);
        for (const r of files) {
            const node = await this.m_IOFactory.build(this.path, r);
            if (node instanceof ctor)
                children.push(node);
        }
        return children;
    }
}
