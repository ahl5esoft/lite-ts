import { ICommandResult } from './i-command-result';

/**
 * 命令接口
 */
export interface ICommand {
    /**
     * 执行命令
     * 
     * @example
     * ```typescript
     *  const cmdFactory: CommandFactoryBase;
     *  const res = await cmdFactory.build(命令类型, ['node', '-v']).exec();
     *  // res = node版本号
     * ```
     */
    exec(): Promise<ICommandResult>;

    /**
     * 设置命令执行时的路径
     * 
     * @param path 路径
     * 
     * @example
     * ```typescript
     *  const cmdFactory: CommandFactoryBase
     *  const res = await cmdFactory.build(命令类型, ['ls']).setDir('/usr/local').exec();
     *  // res = /usr/local下所有文件
     * ```
     */
    setDir(path: string): this;

    /**
     * 设置扩展值(不同类型命令的扩展参数)
     * 
     * @param v 扩展值
     */
    setExtra(v: any): this;

    /**
     * 设置执行超时时间
     * 
     * @param ms 毫秒数
     */
    setTimeout(ms: number): this;
}