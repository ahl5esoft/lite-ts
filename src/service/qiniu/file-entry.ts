import { basename } from 'path';

import { QiniuFileFactory } from './file-factory';
import { IFileEntry } from '../../contract';

export class QiniuFileEntry implements IFileEntry {
    public static errNotImplemented = new Error('未实现');

    public name: string;

    public constructor(
        public path: string,
        protected fileFactory: QiniuFileFactory,
        protected bucket: string,
    ) {
        this.name = basename(path);
    }

    public async exists() {
        const bucketManager = await this.fileFactory.bucketManager;
        return new Promise<boolean>((s, f) => {
            bucketManager.stat(this.bucket, this.path, (err, _, resInfo) => {
                if (err)
                    return f(err);

                s(resInfo.statusCode == 200);
            });
        });
    }

    public async moveTo() {
        throw QiniuFileEntry.errNotImplemented;
    }

    public async remove() {
        throw QiniuFileEntry.errNotImplemented;
    }
}