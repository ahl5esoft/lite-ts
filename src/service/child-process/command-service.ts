import { CommonOptions, exec, spawn } from 'child_process';
import { promisify } from 'util';

import { ICommandService } from '../../contract';

const execPromise = promisify(exec);

export class ChildProcessCommandService implements ICommandService {
    private m_Dir: string;
    private m_Extra: any;
    private m_Timeout: number;

    public constructor(private m_Args: any[]) { }

    public async exec(): Promise<string> {
        const opt: CommonOptions = {};
        if (this.m_Dir)
            opt.cwd = this.m_Dir;
        if (this.m_Timeout)
            opt.timeout = this.m_Timeout;

        const [name, ...args] = this.m_Args;
        const isExec = args.some(r => {
            return r == '|';
        });
        if (isExec) {
            try {
                const res = await execPromise(
                    [name, ...args].join(' '),
                    opt,
                );
                return this.m_Extra && this.m_Extra.ignoreReturn ? '' : res.stdout;
            } catch {
                return '';
            }
        }

        const child = spawn(name, args, opt);
        let bf: string[] = [];

        child.stderr.setEncoding('utf8').on('data', chunk => {
            if (this.m_Extra && this.m_Extra.ignoreReturn)
                return;

            bf.push(
                chunk.toString()
            );
        });

        child.stdout.setEncoding('utf8').on('data', chunk => {
            if (this.m_Extra && this.m_Extra.ignoreReturn)
                return;

            bf.push(
                chunk.toString()
            );
        });

        return new Promise((s, f) => {
            child.on('error', f);

            child.on('exit', code => {
                if (code === 0) {
                    s(
                        bf.join('')
                    );
                } else {
                    const message = JSON.stringify({
                        cmd: [name, ...args].join(' '),
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