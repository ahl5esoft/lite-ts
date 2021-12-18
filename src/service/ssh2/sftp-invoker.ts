import { Client, ConnectConfig, SFTPWrapper } from 'ssh2';

export interface ISftpInvoker {
    call<T>(getActionFunc: (sftp: SFTPWrapper) => (...args: any[]) => void, ...args: any[]): Promise<T>;
    close(): Promise<void>;
}

export class SftpInvoker implements ISftpInvoker {
    private m_Client: Client;
    private m_Sftp: SFTPWrapper;

    public constructor(private m_Config: ConnectConfig) { }

    public async call<T>(getActionFunc: (sftp: SFTPWrapper) => (...args: any[]) => void, ...args: any[]) {
        const sftp = await this.getSftp();
        return new Promise<T>((s, f) => {
            args.push((res: any) => {
                if (res instanceof Error)
                    return f(res);

                s(res as T);
            });
            getActionFunc(sftp).bind(sftp)(...args);
        });
    }

    public async close() {
        const sftp = await this.getSftp();
        sftp.end();

        const client = await this.getClient();
        client.end();
    }

    private async getClient() {
        if (!this.m_Client) {
            this.m_Client = new Client();
            await new Promise<void>(s => {
                this.m_Client.on('ready', s).connect(this.m_Config);
            });
        }

        return this.m_Client;
    }

    private async getSftp() {
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