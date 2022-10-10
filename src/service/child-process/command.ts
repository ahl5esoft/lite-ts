import { ChildProcessWithoutNullStreams, CommonSpawnOptions, spawn } from 'child_process';

import { CommandBase, ICommandOption, ICommandResult } from '../../contract';

interface IChildProcessCommandOption extends ICommandOption {
    ignoreStderr?: boolean;
    ignoreStdout?: boolean;
}

class CommandResult implements ICommandResult {
    public code: number;
    public errBf: string[] = [];
    public outBf: string[] = [];

    public get stderr() {
        return this.errBf.join('');
    }

    public get stdout() {
        return this.outBf.join('');
    }
}

export class ChildProcessCommand extends CommandBase {
    public async exec(v: IChildProcessCommandOption) {
        const opt: CommonSpawnOptions = {};
        if (v.cwd)
            opt.cwd = v.cwd;
        if (v.timeout)
            opt.timeout = v.timeout;

        const res = new CommandResult();
        let child: ChildProcessWithoutNullStreams;
        child = v.args.reduce((memo, r) => {
            if (r == '|')
                memo.push([]);
            else
                memo[memo.length - 1].push(r);
            return memo;
        }, [[]]).reduce((memo, r) => {
            const [name, ...tempArgs] = r;
            let cp: ChildProcessWithoutNullStreams;
            if (memo) {
                cp = spawn(name, tempArgs, {
                    ...opt,
                    stdio: ['pipe', 'pipe', 'pipe']
                });
                memo.stdout.pipe(cp.stdin);
            } else {
                cp = spawn(name, tempArgs, opt);
            }
            return cp;
        }, child);
        child.stderr.setEncoding('utf8').on('data', chunk => {
            if (v.ignoreStderr)
                return;

            res.errBf.push(
                chunk.toString()
            );
        });
        child.stdout.setEncoding('utf8').on('data', chunk => {
            if (v.ignoreStdout)
                return;

            res.outBf.push(
                chunk.toString()
            );
        });

        let timeout: NodeJS.Timeout;
        if (v.timeout > 0) {
            timeout = setTimeout(() => {
                res.code = -1;
                child.kill('SIGKILL');
            }, v.timeout);
        }

        return new Promise<ICommandResult>((s, f) => {
            child.on('error', err => {
                if (timeout)
                    clearTimeout(timeout);

                f(err);
            }).on('exit', code => {
                if (timeout)
                    clearTimeout(timeout);

                if (!res.code)
                    res.code = code;

                s(res);
            });
        });
    }
}