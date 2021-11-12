import { Ssh2IOFactory } from '.';
import { IOFile } from './io-file';
import { IODirectoryBase, IOFactoryBase, IONodeBase } from '../..';

export class IODirectory extends IODirectoryBase {
    public constructor(
        private m_FsIOFactory: IOFactoryBase,
        private m_IOFactory: Ssh2IOFactory,
        ...paths: string[]
    ) {
        super(...paths);
    }

    public async copyTo(dstPath: string) {
        const fsDir = this.m_FsIOFactory.buildDirectory(this.path);
        const isExist = await fsDir.exists();
        if (!isExist)
            return;

        await this.m_IOFactory.buildDirectory(dstPath).create();

        const fsDirs = await fsDir.findDirectories();
        for (const r of fsDirs) {
            await this.m_IOFactory.buildDirectory(r.path).copyTo(
                this.m_IOFactory.buildDirectory(dstPath, r.name).path
            );
        }

        const fsFiles = await fsDir.findFiles();
        for (const r of fsFiles) {
            await this.m_IOFactory.buildFile(r.path).copyTo(
                this.m_IOFactory.buildFile(dstPath, r.name).path
            );
        }
    }

    public async create() {
        const isExist = await this.exists();
        if (isExist)
            return;

        const sftp = await this.m_IOFactory.getSftp();
        return new Promise<void>((s, f) => {
            sftp.mkdir(this.path, err => {
                if (err instanceof Error)
                    return f(err);

                s();
            });
        });
    }

    public async exists() {
        return this.m_IOFactory.exists(this.path);
    }

    public async findDirectories() {
        return this.findChildren(IODirectory);
    }

    public async findFiles() {
        return this.findChildren(IOFile);
    }

    public async move(dstPath: string) {
        await this.copyTo(dstPath);
        await this.m_FsIOFactory.buildDirectory(this.path).remove();
    }

    public async remove() {
        const isExist = await this.exists();
        if (!isExist)
            return;

        const childDirs = await this.findDirectories();
        for (const r of childDirs)
            await r.remove();

        const childFiles = await this.findFiles();
        for (const r of childFiles)
            await r.remove();

        const sftp = await this.m_IOFactory.getSftp();
        return new Promise<void>((s, f) => {
            sftp.rmdir(this.path, err => {
                if (err instanceof Error)
                    return f(err);

                s();
            });
        });
    }

    private async findChildren<T extends IONodeBase>(ctor: new (...args: any[]) => T) {
        const isExist = await this.exists();
        if (!isExist)
            return [];

        const sftp = await this.m_IOFactory.getSftp();
        const filenames = await new Promise<string[]>((s, f) => {
            sftp.readdir(this.path, (err, res) => {
                if (err)
                    return f(err);

                s(
                    res.map(r => {
                        return r.filename
                    })
                );
            });
        });

        const nodes: T[] = [];
        for (const r of filenames) {
            const node = await this.m_IOFactory.build(this.path, r);
            if (node instanceof ctor)
                nodes.push(node);
        }
        return nodes;
    }
}