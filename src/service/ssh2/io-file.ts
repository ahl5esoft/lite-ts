import { unlink } from 'fs/promises';

import { Ssh2IOFactory } from './io-factory';
import { IOFileBase } from '../..';

export class IOFile extends IOFileBase {
    public constructor(
        private m_IOFactory: Ssh2IOFactory,
        ...paths: string[]
    ) {
        super(...paths);
    }

    public async copyTo(dstPath: string) {
        const sftp = await this.m_IOFactory.getSftp();
        return new Promise<void>((s, f) => {
            sftp.fastPut(this.path, dstPath, err => {
                if (err)
                    return f(err);

                s();
            })
        });
    }

    public async exists() {
        return this.m_IOFactory.exists(this.path);
    }

    public async move(dstPath: string) {
        await this.copyTo(dstPath);
        await unlink(this.path);
    }

    public async readJSON<T>(): Promise<T> {
        return
    }

    public async readString(): Promise<string> {
        return
    }

    public async remove() {
        const sftp = await this.m_IOFactory.getSftp();
        return new Promise<void>((s, f) => {
            sftp.unlink(this.path, res => {
                if (res instanceof Error)
                    return f(res);

                s();
            });
        });
    }

    public async write(): Promise<void> {
        return
    }
}