import { extname } from 'path';

import { Ssh2FileEntryBase } from './file-entry-base';
import { Ssh2FileFactory } from './file-factory';
import { IFile, IFileEntryMoveToOption } from '../../contract';

export class Ssh2File extends Ssh2FileEntryBase implements IFile {
    public ext: string;

    public constructor(
        fileFactory: Ssh2FileFactory,
        path: string,
    ) {
        super(path, fileFactory);

        this.ext = extname(this.path);
    }

    public async moveTo(v: IFileEntryMoveToOption) {
        if (v.isLocal) {
            await this.fileFactory.invokeSftp<void>(
                r => r.fastGet,
                this.path,
                this.fileFactory.fsFileFactory.buildFile(...v.paths).path,
            );
            await this.remove();
        } else {
            throw new Error(`${this.constructor.name}.moveTo: 暂不支持isLocal=false`);
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
        return this.fileFactory.invokeSftp<void>(r => r.unlink, this.path);
    }

    public async write() {
        throw Ssh2FileEntryBase.errNotImplemented;
    }
}