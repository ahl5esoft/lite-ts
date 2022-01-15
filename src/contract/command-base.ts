import { ICommandResult } from './i-command-result';

/**
 * 命令行基类
 */
export abstract class CommandBase {
    /**
     * 执行命令
     */
    public abstract exec(): Promise<ICommandResult>;

    /**
     * 设置命令执行时的路径
     * 
     * @param path 路径
     */
    public abstract setDir(path: string): CommandBase;

    /**
     * 设置扩展值(不同类型命令的扩展参数)
     * 
     * @param v 扩展值
     */
    public abstract setExtra(v: any): CommandBase;

    /**
     * 设置执行超时时间
     * 
     * @param ms 毫秒数
     */
    public abstract setTimeout(ms: number): CommandBase;
}