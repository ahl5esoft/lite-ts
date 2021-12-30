import { SftpInvoker } from './sftp-invoker';
import { SftpIOFile } from './sftp-io-file';
import { IODirectoryBase, IOFactoryBase, IONodeBase } from '../..';

export class SftpIODirectory extends IODirectoryBase {
    public constructor(
        private m_FsIOFactory: IOFactoryBase,
        private m_IOFactory: IOFactoryBase,
        private m_SftpInvoker: SftpInvoker,
        private m_Paths: string[]
    ) {
        super([
            m_Paths.join('/')
        ]);
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
        if (!this.path)
            return;

        const isExist = await this.exists();
        if (isExist)
            return;

        if (this.m_Paths.length > 1) {
            const paths = [...this.m_Paths];
            paths.pop();
            await this.m_IOFactory.buildDirectory(...paths).create();
        }

        await this.m_SftpInvoker.call<void>(r => r.mkdir, this.path);
    }

    public async exists() {
        return this.m_SftpInvoker.call<boolean>(r => r.exists, this.path);
    }

    public async findDirectories() {
        return this.findChildren(SftpIODirectory);
    }

    public async findFiles() {
        return this.findChildren(SftpIOFile);
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

        await this.m_SftpInvoker.call<void>(r => r.rmdir, this.path);
    }

    private async findChildren<T extends IONodeBase>(ctor: new (...args: any[]) => T) {
        const isExist = await this.exists();
        if (!isExist)
            return [];

        const files = await this.m_SftpInvoker.call<{
            filename: string
        }[]>(r => r.readdir, this.path);
        const nodes: T[] = [];
        for (const r of files) {
            const node = await this.m_IOFactory.build(this.path, r.filename);
            if (node instanceof ctor)
                nodes.push(node);
        }
        return nodes;
    }
}