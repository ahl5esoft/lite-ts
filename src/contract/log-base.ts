/**
 * 日志
 */
export abstract class LogBase {
    /**
     * 增加标签
     * 
     * @param k 键
     * @param v 值
     */
    public abstract addLabel(k: string, v: any): LogBase;

    /**
     * 以debug输出
     */
    public abstract debug(): void;

    /**
     * 以error输出
     * 
     * @param err 错误对象
     */
    public abstract error(err: Error): void;

    /**
     * 以info输出
     */
    public abstract info(): void;

    /**
     * 以warning输出
     */
    public abstract warning(): void;
}