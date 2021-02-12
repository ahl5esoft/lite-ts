import { spawn } from 'child_process';

import { CmdBase } from './cmd-base';

class OSCmdExecOption {
    public cmd: string;

    public args?: any[];

    public opt?: any;
}

export class OSCmd extends CmdBase {
    public async exec(opt: OSCmdExecOption): Promise<string> {
        return await this.execute(opt, true);
    }

    public async execWithoutReturn(opt: OSCmdExecOption): Promise<void> {
        await this.execute(opt, false);
    }

    private async execute(opt: OSCmdExecOption, hasReturn: boolean): Promise<string> {
        const child = spawn(opt.cmd, opt.args, opt.opt);
        let bf: string[] = [];

        child.stderr.setEncoding('utf8').on('data', (chunk: any): void => {
            if (hasReturn) {
                bf.push(
                    chunk.toString()
                );
            }
        });

        child.stdout.setEncoding('utf8').on('data', (chunk: any): void => {
            if (hasReturn) {
                bf.push(
                    chunk.toString()
                );
            }
        });

        return new Promise((s, f) => {
            child.on('error', f);

            child.on('exit', (code: number): void => {
                if (code === 0) {
                    s(
                        bf.join('')
                    );
                } else {
                    const message = JSON.stringify({
                        code: code,
                        stderr: bf.join(''),
                    });
                    f(
                        new Error(message)
                    );
                }
            });
        });
    }
}
