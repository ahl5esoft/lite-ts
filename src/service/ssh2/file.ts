import { extname } from 'path';

import { Ssh2FileEntryBase } from './file-entry-base';
import { Ssh2FileFactory } from './file-factory';
import { IFile } from '../../contract';

export class Ssh2File extends Ssh2FileEntryBase implements IFile {
    public ext: string;

    public constructor(
        factory: Ssh2FileFactory,
        path: string,
    ) {
        super(factory, path);

        this.ext = extname(this.path);
    }

    public async moveTo(v: any) {
        if (v.constructor.name == 'FsFile') {
            await this.factory.invokeSftp<void>(
                r => r.fastGet,
                this.path,
                (v as IFile).path,
            );
            await this.remove();
        } else {
            throw new Error(`${this.constructor.name}.moveTo: 暂不支持`);
        }
    }

    public async read() {
        throw Ssh2FileEntryBase.errNotImplemented;
        return null;
    }

    public async readJson() {
        throw Ssh2FileEntryBase.errNotImplemented;
        return null;
    }

    public async readString() {
        throw Ssh2FileEntryBase.errNotImplemented;
        return null;
    }

    public async readYaml() {
        throw Ssh2FileEntryBase.errNotImplemented;
        return null;
    }

    public remove() {
        return this.factory.invokeSftp<void>(r => r.unlink, this.path);
    }

    public async write() {
        throw Ssh2FileEntryBase.errNotImplemented;
    }
}