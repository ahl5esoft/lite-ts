import { ConnectConfig } from 'ssh2';

import { SftpInvoker } from './sftp-invoker';
import { SftpIODirectory } from './sftp-io-directory';
import { SftpIOFile } from './sftp-io-file';
import { IOFactoryBase } from '../..';

interface IStat {
    isDirectory(): boolean;
}

export class Ssh2SftpIOFactory extends IOFactoryBase {
    private m_Invoker: SftpInvoker;

    public constructor(
        private m_FsIOFactory: IOFactoryBase,
        config: ConnectConfig
    ) {
        super();

        this.m_Invoker = new SftpInvoker(config);
    }

    public async build(...paths: string[]) {
        const stat = await this.m_Invoker.call<IStat>(
            r => r.stat,
            paths.join('/')
        );
        return stat.isDirectory() ? this.buildDirectory(...paths) : this.buildFile(...paths);
    }

    public buildDirectory(...paths: string[]) {
        return new SftpIODirectory(this.m_FsIOFactory, this, this.m_Invoker, paths);
    }

    public buildFile(...paths: string[]) {
        return new SftpIOFile(this.m_Invoker, paths);
    }

    public async close() {
        await this.m_Invoker.close();
    }
}