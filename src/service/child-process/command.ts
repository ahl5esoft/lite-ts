import { ChildProcessWithoutNullStreams, CommonSpawnOptions, spawn } from 'child_process';

import { ICommand, ICommandResult } from '../../contract';

class CommandResult implements ICommandResult {
    public code: number;
    public errBf: string[] = [];
    public outBf: string[] = [];

    public get err() {
        return this.errBf.join('');
    }

    public get out() {
        return this.outBf.join('');
    }
}

export class Command implements ICommand {
    private m_Dir: string;
    private m_Extra: any;
    private m_Timeout: number;

    public constructor(private m_Args: string[][]) { }

    public async exec() {
        const opt: CommonSpawnOptions = {};
        if (this.m_Dir)
            opt.cwd = this.m_Dir;
        if (this.m_Timeout)
            opt.timeout = this.m_Timeout;

        const res = new CommandResult();
        let child: ChildProcessWithoutNullStreams;
        child = this.m_Args.reduce((memo, r) => {
            const [name, ...args] = r;
            let cp: ChildProcessWithoutNullStreams;
            if (memo) {
                cp = spawn(name, args, {
                    stdio: ['pipe', 'pipe', 'pipe']
                });
                memo.stdout.pipe(cp.stdin);
            } else {
                cp = spawn(name, args);
            }
            return cp;
        }, child);
        child.stderr.setEncoding('utf8').on('data', chunk => {
            if (this.m_Extra?.ignoreReturn)
                return;

            res.errBf.push(
                chunk.toString()
            );
        });
        child.stdout.setEncoding('utf8').on('data', chunk => {
            if (this.m_Extra?.ignoreReturn)
                return;

            res.outBf.push(
                chunk.toString()
            );
        });

        return new Promise<ICommandResult>((s, f) => {
            child.on('error', f);

            child.on('exit', code => {
                res.code = code;
                s(res);
            });
        });
    }

    public setDir(v: string): this {
        this.m_Dir = v;
        return this;
    }

    public setExtra(v: any): this {
        this.m_Extra = v;
        return this;
    }

    public setTimeout(v: number): this {
        this.m_Timeout = v;
        return this;
    }
}