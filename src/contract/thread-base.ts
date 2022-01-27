/**
 * 线程基类
 */
export abstract class ThreadBase {
    /**
     * 休眠
     * 
     * @param ms 时间
     */
    public abstract sleep(ms: number): Promise<void>;
    /**
     * 休眠(区间)
     * 
     * @param minMs 最小时间
     * @param maxMs 最大时间
     */
    public abstract sleepRange(minMs: number, maxMs: number): Promise<void>;
}