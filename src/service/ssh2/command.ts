import { Client, ConnectConfig } from 'ssh2';

import { CommandBase, CommandResult } from '../command';

export class Ssh2Command extends CommandBase {
    private m_Client: Client;

    public constructor(
        private m_Config: ConnectConfig,
        private m_Args: string[]
    ) {
        super();
    }

    public async exec() {
        const client = await this.getClient();
        const res = new CommandResult();
        await new Promise<void>((s, f) => {
            client.exec(
                this.m_Args.join('\n'),
                (err, channel) => {
                    if (err)
                        return f(err);

                    channel.on('close', (code: number) => {
                        res.code = code;
                        s();
                    }).on('data', (s: string) => {
                        res.outBf.push(s);
                    }).stderr.on('data', (s: string) => {
                        res.errBf.push(s);
                    });
                }
            );
        });
        return res;
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
}