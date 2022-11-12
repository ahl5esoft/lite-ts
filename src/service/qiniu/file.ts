import { extname } from 'path';
import * as qiniu from 'qiniu';

import { QiniuFileEntry } from './file-entry';
import { QiniuFileFactory } from './file-factory';
import { IFile } from '../../contract';

const extOfMimeType = {
    '.json': 'application/json',
    '.html': 'text/html',
};

export class QiniuFile extends QiniuFileEntry implements IFile {
    private m_Ext: string;
    public get ext() {
        this.m_Ext ??= extname(this.path);
        return this.m_Ext;
    }

    public constructor(
        fileFactory: QiniuFileFactory,
        bucket: string,
        path: string,
    ) {
        super(path, fileFactory, bucket);
    }

    public async read() {
        throw QiniuFileEntry.errNotImplemented;
        return null;
    }

    public async readString() {
        throw QiniuFileEntry.errNotImplemented;
        return '';
    }

    public async readYaml() {
        throw QiniuFileEntry.errNotImplemented;
        return null;
    }

    public async write(v: any) {
        const ext = extname(this.path);
        const uploader = await this.fileFactory.formUploader;
        const token = await this.fileFactory.getToken(this.bucket, this.path);
        const putExtra = new qiniu.form_up.PutExtra();
        putExtra.mimeType = extOfMimeType[ext];
        await new Promise<void>((s, f) => {
            uploader.put(token, this.path, v, putExtra, (err, _, resInfo) => {
                if (err)
                    return f(err);

                if (resInfo.statusCode != 200)
                    return f(`上传七牛失败: ${this.bucket}, ${this.path}`);

                s();
            });
        });
    }
}