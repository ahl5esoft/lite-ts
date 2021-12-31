/**
 * 命令执行结果
 */
export interface ICommandResult {
    /**
     * 结果代码, -1: 超时
     */
    code: number;

    /**
     * 错误信息
     */
    err: string;

    /**
     * 输出信息
     */
    out: string;
}