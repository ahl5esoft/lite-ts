import { Client, ConnectConfig, SFTPWrapper } from 'ssh2';

import { IODirectory } from './io-directory';
import { IOFile } from './io-file';
import { IOFactoryBase } from '../..';

export class Ssh2IOFactory extends IOFactoryBase {
    private m_Client: Client;
    private m_Sftp: SFTPWrapper;

    public constructor(
        private m_FsIOFactory: IOFactoryBase,
        private m_Config: ConnectConfig
    ) {
        super();
    }

    public async build(...paths: string[]) {
        const path = paths.join('/');
        const sftp = await this.getSftp();
        const isDir = await new Promise<boolean>((s, f) => {
            sftp.stat(path, (err, res) => {
                if (err)
                    return f(err);

                s(
                    res.isDirectory()
                );
            });
        });
        return isDir ? new IODirectory(this.m_FsIOFactory, this, path) : new IOFile(this, path);
    }

    public buildDirectory(...paths: string[]) {
        return new IODirectory(
            this.m_FsIOFactory,
            this,
            paths.join('/')
        );
    }

    public buildFile(...paths: string[]) {
        return new IOFile(
            this,
            paths.join('/')
        );
    }

    public async close() {
        const sftp = await this.getSftp();
        sftp.end();

        const client = await this.getClient();
        client.end();
    }

    public async exists(path: string) {
        const sftp = await this.getSftp();
        return new Promise<boolean>((s, f) => {
            sftp.exists(path, res => {
                if (res instanceof Error)
                    return f(res);

                s(res);
            });
        });
    }

    public async getClient() {
        if (!this.m_Client) {
            this.m_Client = new Client();
            await new Promise<void>(s => {
                this.m_Client.on('ready', s).connect(this.m_Config)
            });
        }

        return this.m_Client;
    }

    public async getSftp() {
        if (!this.m_Sftp) {
            const client = await this.getClient();
            this.m_Sftp = await new Promise<SFTPWrapper>((s, f) => {
                client.sftp((err, res) => {
                    if (err)
                        return f(err);

                    s(res);
                });
            });
        }

        return this.m_Sftp;
    }
}