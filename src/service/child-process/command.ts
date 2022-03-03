import { ChildProcessWithoutNullStreams, CommonSpawnOptions, spawn } from 'child_process';

import { CommandResult } from '../command';
import { CommandBase, ICommandResult } from '../..';

class CommandWrapper implements CommandBase {
    private m_Dir: string;
    private m_Extra: any;
    private m_Timeout: number;

    public async exec(...args: string[]) {
        const opt: CommonSpawnOptions = {};
        if (this.m_Dir)
            opt.cwd = this.m_Dir;
        if (this.m_Timeout)
            opt.timeout = this.m_Timeout;

        const res = new CommandResult();
        let child: ChildProcessWithoutNullStreams;
        child = args.reduce((memo, r) => {
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

        let timeout: NodeJS.Timeout;
        if (this.m_Timeout > 0) {
            timeout = setTimeout(() => {
                res.code = -1;
                child.kill('SIGKILL');
            }, this.m_Timeout);
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

/**
 * 命令对象(基于child_process实现)
 */
export class ChildProcessCommand extends CommandBase {
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
    public async exec(...args: string[]) {
        return await new CommandWrapper().exec(...args);
    }

    /**
     * 设置目录路径
     * 
     * @param v 目录路径
     * 
     * @example
     * ```typescript
     *  const cmdFactory: CommandFactoryBase;
     *  const res = await cmdFactory.build(类型, ['ls']).setDir('/usr/local').exec();
     *  // res = { code: 0, out: '/usr/local下文件列表' }
     * ```
     */
    public setDir(v: string) {
        const wrapper = new CommandWrapper();
        wrapper.setDir(v);
        return wrapper;
    }

    /**
     * 设置扩展对象
     * 
     * @param v 扩展对象
     */
    public setExtra(v: any) {
        const wrapper = new CommandWrapper();
        wrapper.setExtra(v);
        return wrapper;
    }

    /**
     * 设置超时时间
     * 
     * @param v 超时时间, 单位: ms
     * 
     * @example
     * ```typescript
     *  const cmdFactory: CommandFactoryBase;
     *  const res = await cmdFactory.build(类型, ['node']).setTimeout(1000).exec();
     *  // 1秒后完成, res = { code: -1 }
     * ```
     */
    public setTimeout(v: number) {
        const wrapper = new CommandWrapper();
        wrapper.setTimeout(v);
        return wrapper;
    }
}