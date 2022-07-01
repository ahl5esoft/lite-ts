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
    /**
     * 观察耗时
     * 
     * @param title 标题
     * @param func 函数
     */
    public abstract stopWatch<T>(title: string, func: () => Promise<T>): Promise<T>;
    /**
     * 尝试执行函数
     * 
     * @param action 函数
     * @param count 尝试次数
     * @param interval 尝试间隔
     */
    public abstract try(action: () => Promise<void>, count: number, interval?: number): Promise<void>;
}