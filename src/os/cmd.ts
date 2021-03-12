import { CommonOptions, exec, spawn } from 'child_process';
import { promisify } from 'util';

import { CmdBase } from './cmd-base';

const execPromise = promisify(exec);

export class OSCmd extends CmdBase {
    public async exec(name: string, ...args: any[]): Promise<string> {
        const opt: CommonOptions = {};
        if (this.dir)
            opt.cwd = this.dir;
        if (this.ms)
            opt.timeout = this.ms;

        const isExec = args.some(r => {
            return r == '|';
        });
        if (isExec) {
            const res = await execPromise(
                [name, ...args].join(' '),
                opt,
            );
            return this.ignoreReturn ? '' : res.stdout;
        }

        const child = spawn(name, args, opt);
        let bf: string[] = [];

        child.stderr.setEncoding('utf8').on('data', chunk => {
            if (this.ignoreReturn)
                return;

            bf.push(
                chunk.toString()
            );
        });

        child.stdout.setEncoding('utf8').on('data', chunk => {
            if (this.ignoreReturn)
                return;

            bf.push(
                chunk.toString()
            );
        });

        return new Promise((s, f) => {
            child.on('error', f);

            child.on('exit', code => {
                this.reset();

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
}