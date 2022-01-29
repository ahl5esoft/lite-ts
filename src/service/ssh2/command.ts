import { Client, ConnectConfig } from 'ssh2';

import { CommandResult } from '../command';
import { CommandBase } from '../../contract';

class CommandWrapper extends CommandBase {
    private m_Extra: any;

    public constructor(
        private m_Config: ConnectConfig
    ) {
        super();
    }

    public async exec(...args: string[][]) {
        const client = new Client();
        await new Promise<void>(s => {
            client.on('ready', s).connect(this.m_Config);
        });

        const res = new CommandResult();
        await new Promise<void>((s, f) => {
            client.exec(
                args.join('\n'),
                (err, channel) => {
                    if (err)
                        return f(err);

                    channel.on('close', (code: number) => {
                        res.code = code;
                        s();
                    }).on('data', (bf: Buffer) => {
                        const line = bf.toString('utf8');
                        if (this.m_Extra && 'console' in this.m_Extra)
                            console.log('out >> ', line);

                        res.outBf.push(line);
                    }).stderr.on('data', (bf: Buffer) => {
                        const line = bf.toString('utf8');
                        if (this.m_Extra && 'console' in this.m_Extra)
                            console.log('err >> ', line);

                        res.errBf.push(line);
                    });
                }
            );
        });

        client.end();
        return res;
    }

    public setDir() {
        return this;
    }

    public setExtra(v: any) {
        this.m_Extra = v;
        return this;
    }

    public setTimeout() {
        return this;
    }
}

export class Ssh2Command extends CommandBase {
    public constructor(
        private m_Config: ConnectConfig
    ) {
        super();
    }
    /**
     * 执行命令
     * 
     * @example
     * ```typescript
     *  const cmdFactory: CommandFactoryBase;
     *  const res = await cmdFactory.build(类型, ['node', '-v']).setTimeout(1000).exec();
     *  // res = { code: 0, out: 'node版本号', err: '系统未安装node时报错内容' }
     * ```
     */
    public async exec(...args: string[][]) {
        return await new CommandWrapper(this.m_Config).exec(...args);
    }

    /**
     * 设置目录路径
     */
    public setDir() {
        return new CommandWrapper(this.m_Config);
    }

    /**
     * 设置扩展对象
     * 
     * @param v 扩展对象
     */
    public setExtra(v: any) {
        const wrapper = new CommandWrapper(this.m_Config);
        wrapper.setExtra(v);
        return wrapper;
    }

    /**
     * 设置超时时间
     */
    public setTimeout() {
        return new CommandWrapper(this.m_Config);
    }
}