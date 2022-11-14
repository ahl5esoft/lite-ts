import { basename } from 'path';

import { QiniuFileFactory } from './file-factory';
import { IFileEntry } from '../../contract';

export abstract class QiniuFileEntryBase implements IFileEntry {
    public static errNotImplemented = new Error('未实现');

    public name: string;
    public path: string;
    protected bucket: string;
    protected relativePath: string;

    public constructor(
        public factory: QiniuFileFactory,
        paths: string[],
    ) {
        if (paths.length == 1)
            paths = paths[0].split('/');
        this.path = paths.join('/');
        this.bucket = paths.shift();
        this.relativePath = paths.join('/');
        this.name = basename(this.path);
    }

    public async moveTo() {
        throw QiniuFileEntryBase.errNotImplemented;
    }

    public abstract exists(): Promise<boolean>;
    public abstract remove(): Promise<void>;
}