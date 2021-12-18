import { unlink } from 'fs/promises';

import { ISftpInvoker } from './sftp-invoker';
import { IOFileBase } from '../..';

export class SftpIOFile extends IOFileBase {
    public constructor(
        private m_Invoker: ISftpInvoker,
        paths: string[]
    ) {
        super([
            paths.join('/')
        ]);
    }

    public async copyTo(dstPath: string) {
        await this.m_Invoker.call<void>(r => r.fastPut, this.path, dstPath);
    }

    public async exists() {
        return this.m_Invoker.call<boolean>(r => r.exists, this.path);
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
        return this.m_Invoker.call<void>(r => r.unlink, this.path);
    }

    public async write(): Promise<void> {
        return
    }
}