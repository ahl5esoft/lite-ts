import { ChildProcessWithoutNullStreams, CommonSpawnOptions, spawn } from 'child_process';

import { CommandResult } from '../command';
import { ICommand, ICommandResult } from '../../contract';

export class ChildProcessCommand implements ICommand {
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
                    ...opt,
                    stdio: ['pipe', 'pipe', 'pipe']
                });
                memo.stdout.pipe(cp.stdin);
            } else {
                cp = spawn(name, args, opt);
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
        if (this.m_Timeout > 0) {
            setTimeout(() => {
                res.code = -1;
                child.kill('SIGKILL');
            }, this.m_Timeout);
        }

        return new Promise<ICommandResult>((s, f) => {
            child.on('error', f);

            child.on('exit', code => {
                if (typeof code == 'number')
                    res.code = code;
                s(res);
            });
        });
    }

    public setDir(v: string) {
        this.m_Dir = v;
        return this;
    }

    public setExtra(v: any) {
        this.m_Extra = v;
        return this;
    }

    public setTimeout(v: number) {
        this.m_Timeout = v;
        return this;
    }
}