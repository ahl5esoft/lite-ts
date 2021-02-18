import { spawn, SpawnOptionsWithoutStdio } from 'child_process';

import { CmdBase } from './cmd-base';

type ExecOption = (cmd: OSCmd) => void;

export class OSCmd extends CmdBase {
    private m_Args: string[] = [];
    public set args(value: string[]) {
        this.m_Args = value;
    }

    private m_Cmd: string = '';
    public set cmd(value: string) {
        this.m_Cmd = value;
    }

    private m_IgnoreReturn = false;
    public set ignoreReturn(value: boolean) {
        this.m_IgnoreReturn = value;
    }

    private m_Opt: SpawnOptionsWithoutStdio = {};
    public set opt(value: SpawnOptionsWithoutStdio) {
        this.m_Opt = value;
    }

    public async exec(...opts: ExecOption[]): Promise<string> {
        for (const r of opts)
            r(this);

        const child = spawn(this.m_Cmd, this.m_Args, this.m_Opt);
        let bf: string[] = [];

        child.stderr.setEncoding('utf8').on('data', (chunk: any): void => {
            if (this.m_IgnoreReturn)
                return;

            bf.push(
                chunk.toString()
            );
        });

        child.stdout.setEncoding('utf8').on('data', (chunk: any): void => {
            if (this.m_IgnoreReturn)
                return;

            bf.push(
                chunk.toString()
            );
        });

        return new Promise((s, f) => {
            child.on('error', f);

            child.on('exit', (code: number): void => {
                this.args = [];
                this.cmd = '';
                this.ignoreReturn = false;
                this.opt = {};

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

export function argsOption(...values: string[]): ExecOption {
    return (cmd: OSCmd): void => {
        cmd.args = values;
    };
}

export function cmdOption(value: string): ExecOption {
    return (cmd: OSCmd): void => {
        cmd.cmd = value;
    };
}

export function ignoreReturnOption(): ExecOption {
    return (cmd: OSCmd): void => {
        cmd.ignoreReturn = true;
    };
}

export function spawnOptionOption(value: SpawnOptionsWithoutStdio): ExecOption {
    return (cmd: OSCmd): void => {
        cmd.opt = value;
    };
}