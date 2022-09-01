/**
 * 日志
 */
export abstract class LogBase {
    /**
     * 增加标签
     * 
     * @param k 键
     * @param v 值
     * 
     * @example
     * ```
     * const log: LogBase;
     * log.addLabel('key', 'value');
     * ```
     */
    public abstract addLabel(k: string, v: any): LogBase;

    /**
     * 以debug输出
     * 
     * @example
     * ```
     * const log: LogBase;
     * log.debug();
     * ```
     */
    public abstract debug(): void;

    /**
     * 以error输出
     * 
     * @param err 错误对象
     * 
     * @example
     * ```
     * const log: LogBase;
     * const err: error;
     * log.error(err);
     * ```
     */
    public abstract error(err: Error): void;

    /**
     * 以info输出
     * 
     * @example
     * ```
     * const log: LogBase;
     * log.info();
     * ```
     */
    public abstract info(): void;

    /**
     * 以warning输出
     * 
     * @example
     * ```
     * const log: LogBase;
     * log.warning();
     * ```
     */
    public abstract warning(): void;
}