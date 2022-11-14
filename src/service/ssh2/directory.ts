import { FileEntry, Stats } from 'ssh2';

import { Ssh2File } from './file';
import { Ssh2FileEntryBase } from './file-entry-base';
import { Ssh2FileFactory } from './file-factory';
import { IDirectory, IFile, IFileEntry } from '../../contract';

export class Ssh2Directory extends Ssh2FileEntryBase implements IDirectory {
    public constructor(
        factory: Ssh2FileFactory,
        path: string,
    ) {
        super(factory, path);
    }

    public async create() {
        const isExist = await this.exists();
        if (isExist)
            return;

        return this.factory.invokeSftp<void>(r => r.mkdir, this.path);
    }

    public async findDirectories() {
        return this.scan<IDirectory>(async (stats, path) => {
            return stats.isDirectory() ? new Ssh2Directory(this.factory, path) : null;
        });
    }

    public async findFiles() {
        return this.scan<IFile>(async (stats, path) => {
            return stats.isFile() ? new Ssh2File(this.factory, path) : null;
        });
    }

    public async moveTo(v: any) {
        if (v.constructor.name == 'FsDirectory') {
            await (v as IDirectory).create();
            await this.scan<void>(async (stats, path) => {
                let fileEntry: IFileEntry;
                let fsFileEntry = v as IFileEntry;
                if (stats.isDirectory()) {
                    fileEntry = new Ssh2Directory(this.factory, path);
                    fsFileEntry = this.factory.fsFileFactory.buildDirectory(fsFileEntry.path, fileEntry.name);
                } else {
                    fileEntry = new Ssh2File(this.factory, path);
                    fsFileEntry = this.factory.fsFileFactory.buildFile(fsFileEntry.path, fileEntry.name);
                }
                await fileEntry.moveTo(fsFileEntry);
            });
            await this.factory.invokeSftp(r => r.rmdir, this.path);
        } else {
            throw new Error(`${this.constructor.name}.moveTo: 暂不支持`);
        }
    }

    public async read() {
        const entries = await this.factory.invokeSftp<FileEntry[]>(r => r.readdir, this.path);
        return entries.map(r => r.filename);
    }

    public async remove() {
        await this.scan((stats, path) => {
            const fileEntry = stats.isDirectory() ? new Ssh2Directory(this.factory, path) : new Ssh2File(this.factory, path);
            return fileEntry.remove();
        });
        await this.factory.invokeSftp(r => r.rmdir, this.path);
    }

    private async scan<T>(buildFunc: (stats: Stats, path: string) => Promise<T>) {
        const entries = await this.factory.invokeSftp<FileEntry[]>(r => r.readdir, this.path);
        const res: T[] = [];
        for (const r of entries) {
            const path = [this.path, r.filename].join('/');
            const stats = await this.factory.invokeSftp<Stats>(r => r.stat, path);
            const fileEntry = await buildFunc(stats, path);
            if (fileEntry)
                res.push(fileEntry);
        }
        return res;
    }
}