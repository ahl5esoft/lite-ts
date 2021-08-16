import { CommonOptions, exec, spawn } from 'child_process';
import { promisify } from 'util';
import { CommandServiceBase } from '../../contract';

const execPromise = promisify(exec);

export class ChildProcessCommandService extends CommandServiceBase {
    public constructor(args: any[]) {
        super(args);
    }

    public async exec(): Promise<string> {
        const opt: CommonOptions = {};
        if (this.dirPath)
            opt.cwd = this.dirPath;
        if (this.expires)
            opt.timeout = this.expires;

        const [name, ...args] = this.args;
        const isExec = args.some(r => {
            return r == '|';
        });
        if (isExec) {
            try {
                const res = await execPromise(
                    [name, ...args].join(' '),
                    opt,
                );
                return this.extra && this.extra.ignoreReturn ? '' : res.stdout;
            } catch {
                return '';
            }
        }

        const child = spawn(name, args, opt);
        let bf: string[] = [];

        child.stderr.setEncoding('utf8').on('data', chunk => {
            if (this.extra && this.extra.ignoreReturn)
                return;

            bf.push(
                chunk.toString()
            );
        });

        child.stdout.setEncoding('utf8').on('data', chunk => {
            if (this.extra && this.extra.ignoreReturn)
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
}