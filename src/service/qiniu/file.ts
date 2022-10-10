import { existsSync } from 'fs';
import { unlink, writeFile } from 'fs/promises';
import { extname, join } from 'path';
import * as qiniu from 'qiniu';

import { QiniuFileEntry } from './file-entry';
import { QiniuFileFactory } from './file-factory';
import { IFile } from '../../contract';

const extOfMimeType = {
    '.json': 'application/json',
    '.html': 'text/html',
};

export class QiniuFile extends QiniuFileEntry implements IFile {
    public constructor(
        private m_FileFactory: QiniuFileFactory,
        private m_Bucket: string,
        path: string,
    ) {
        super(path);
    }

    public async exists() {
        const bucketManager = await this.m_FileFactory.bucketManager;
        return new Promise<boolean>((s, f) => {
            bucketManager.stat(this.m_Bucket, this.path, (err, _, resInfo) => {
                if (err)
                    return f(err);

                s(resInfo.statusCode == 200);
            });
        });
    }

    public async write(v: any) {
        const name = await this.m_FileFactory.stringGenerator.generate();
        const ext = extname(this.path);
        const tempPath = join(__dirname, name + ext);
        try {
            if (typeof v == 'string')
                await writeFile(tempPath, v);

            const isExist = existsSync(tempPath);
            if (!isExist)
                return;

            const uploader = await this.m_FileFactory.formUploader;
            const token = await this.m_FileFactory.getToken(this.m_Bucket, this.path);
            const putExtra = new qiniu.form_up.PutExtra();
            putExtra.mimeType = extOfMimeType[ext];
            await new Promise<void>((s, f) => {
                uploader.putFile(token, this.path, tempPath, putExtra, (err, _, resInfo) => {
                    if (err)
                        return f(err);

                    if (resInfo.statusCode != 200)
                        return f(`上传七牛失败: ${this.m_Bucket}, ${this.path}`);

                    s();
                });
            });
        } finally {
            await unlink(tempPath);
        }
    }
}