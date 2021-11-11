import { Client, ConnectConfig, SFTPWrapper } from 'ssh2';

import { IOFile } from './io-file';
import { IOFactoryBase } from '../..';

export class Ssh2IOFactory extends IOFactoryBase {
    private m_Client: Client;
    private m_Sftp: SFTPWrapper;

    public constructor(
        private m_Config: ConnectConfig
    ) {
        super();
    }

    public async build() {
        return null;
    }

    public buildDirectory() {
        return null;
    }

    public buildFile(...paths: string[]) {
        return new IOFile(this, ...paths);
    }

    public async close() {
        const sftp = await this.getSftp();
        sftp.end();

        const client = await this.getClient();
        client.end();
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
                client.sftp((err, sftp) => {
                    if (err)
                        return f(err);

                    s(sftp);
                });
            });
        }

        return this.m_Sftp;
    }
}