import { extname } from 'path';
import * as qiniu from 'qiniu';

import { QiniuFileEntryBase } from './file-entry-base';
import { QiniuFileFactory } from './file-factory';
import { IFile } from '../../contract';

const extOfMimeType = {
    '.json': 'application/json',
    '.html': 'text/html',
};

export class QiniuFile extends QiniuFileEntryBase implements IFile {
    private m_Ext: string;
    public get ext() {
        this.m_Ext ??= extname(this.relativePath);
        return this.m_Ext;
    }

    public constructor(
        factory: QiniuFileFactory,
        paths: string[],
    ) {
        super(factory, paths);
    }

    public async exists() {
        const bucketManager = await this.factory.bucketManager;
        return new Promise<boolean>((s, f) => {
            bucketManager.stat(this.bucket, this.relativePath, (err, _, resInfo) => {
                if (err)
                    return f(err);

                s(resInfo.statusCode == 200);
            });
        });
    }

    public async read() {
        throw QiniuFileEntryBase.errNotImplemented;
        return null;
    }

    public async readString() {
        throw QiniuFileEntryBase.errNotImplemented;
        return '';
    }

    public async readYaml() {
        throw QiniuFileEntryBase.errNotImplemented;
        return null;
    }

    public async remove() {
        const bucketManager = await this.factory.bucketManager;
        return new Promise<void>((s, f) => {
            bucketManager.delete(this.bucket, this.relativePath, err => {
                if (err)
                    return f(err);

                return s();
            });
        });
    }

    public async write(v: any) {
        const ext = extname(this.relativePath);
        const token = await this.factory.getToken(this.bucket, this.relativePath);
        const putExtra = new qiniu.form_up.PutExtra();
        if (extOfMimeType[ext])
            putExtra.mimeType = extOfMimeType[ext];

        let method = 'put';
        if (v.constructor.name == 'FsFile') {
            method = 'putFile';
            v = (v as IFile).path;
        }

        const uploader = await this.factory.formUploader;
        await new Promise<void>((s, f) => {
            uploader[method](token, this.relativePath, v, putExtra, (err: Error, _: any, resInfo: any) => {
                if (err)
                    return f(err);

                if (resInfo.statusCode != 200)
                    return f(`上传七牛失败: ${this.path}`);

                s();
            });
        });
    }
}