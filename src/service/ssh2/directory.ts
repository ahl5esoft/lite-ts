import { FileEntry, Stats } from 'ssh2';

import { Ssh2File } from './file';
import { Ssh2FileEntryBase } from './file-entry-base';
import { Ssh2FileFactory } from './file-factory';
import { IDirectory, IFile, IFileEntryMoveToOption } from '../../contract';

export class Ssh2Directory extends Ssh2FileEntryBase implements IDirectory {
    public constructor(
        fileFactory: Ssh2FileFactory,
        path: string,
    ) {
        super(path, fileFactory);
    }

    public create() {
        return this.fileFactory.invokeSftp<void>(r => r.mkdir, this.path);
    }

    public async findDirectories() {
        return this.scan<IDirectory>(async (stats, path) => {
            return stats.isDirectory() ? new Ssh2Directory(this.fileFactory, path) : null;
        });
    }

    public async findFiles() {
        return this.scan<IFile>(async (stats, path) => {
            return stats.isFile() ? new Ssh2File(this.fileFactory, path) : null;
        });
    }

    public async moveTo(v: IFileEntryMoveToOption) {
        if (v.isLocal) {
            console.log(v.paths)
            await this.fileFactory.fsFileFactory.buildDirectory(...v.paths).create();
            await this.scan<void>(async (stats, path) => {
                const fileEntry = stats.isDirectory() ? new Ssh2Directory(this.fileFactory, path) : new Ssh2File(this.fileFactory, path);
                await fileEntry.moveTo({
                    isLocal: true,
                    paths: v.paths.concat(fileEntry.name)
                });
            });
            await this.fileFactory.invokeSftp(r => r.rmdir, this.path);
        } else {
            throw new Error(`${this.constructor.name}.moveTo: 暂不支持isLocal=false`);
        }
    }

    public async remove() {
        await this.scan((stats, path) => {
            const fileEntry = stats.isDirectory() ? new Ssh2Directory(this.fileFactory, path) : new Ssh2File(this.fileFactory, path);
            return fileEntry.remove();
        });
        await this.fileFactory.invokeSftp(r => r.rmdir, this.path);
    }

    private async scan<T>(buildFunc: (stats: Stats, path: string) => Promise<T>) {
        const entries = await this.fileFactory.invokeSftp<FileEntry[]>(r => r.readdir, this.path);
        const res: T[] = [];
        for (const r of entries) {
            const path = [this.path, r.filename].join('/');
            const stats = await this.fileFactory.invokeSftp<Stats>(r => r.stat, path);
            const fileEntry = await buildFunc(stats, path);
            if (fileEntry)
                res.push(fileEntry);
        }
        return res;
    }
}