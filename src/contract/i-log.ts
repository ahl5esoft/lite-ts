/**
 * 日志接口
 */
export interface ILog {
    /**
     * 增加标签
     * 
     * @param k 键
     * @param v 值
     */
    addLabel(k: string, v: any): this;

    /**
     * 以debug输出
     */
    debug(): void;

    /**
     * 以error输出
     * 
     * @param err 错误对象
     */
    error(err: Error): void;

    /**
     * 以info输出
     */
    info(): void;

    /**
     * 以warning输出
     */
    warning(): void;
}