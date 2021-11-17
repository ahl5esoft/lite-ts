import { Client, ConnectConfig } from 'ssh2';

import { CommandBase, CommandResult } from '../command';

export class Ssh2Command extends CommandBase {
    public constructor(
        private m_Config: ConnectConfig,
        private m_Args: string[]
    ) {
        super();
    }

    public async exec() {
        const client = new Client();
        await new Promise<void>(s => {
            client.on('ready', s).connect(this.m_Config);
        });

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
                    }).on('data', (bf: Buffer) => {
                        res.outBf.push(
                            bf.toString('utf8')
                        );
                    }).stderr.on('data', (bf: Buffer) => {
                        res.errBf.push(
                            bf.toString('utf8')
                        );
                    });
                }
            );
        });

        client.end();
        return res;
    }
}