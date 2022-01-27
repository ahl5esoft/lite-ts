import { ThreadBase } from '../..';

/**
 * 线程实现
 */
export class SetTimeoutThread extends ThreadBase {
    /**
     * 休眠
     * 
     * @param ms 时间
     */
    public async sleep(ms: number) {
        if (ms < 0)
            throw new Error('ms不能小于0');

        await new Promise<void>(s => {
            setTimeout(() => {
                s();
            }, ms);
        });
    }

    /**
     * 休眠(区间)
     * 
     * @param minMs 最小时间
     * @param maxMs 最大时间
     */
    public async sleepRange(minMs: number, maxMs: number) {
        if (minMs < 0 || maxMs < 0)
            throw new Error('minMs或maxMs不能小于0');

        const ms = Math.floor(
            Math.random() * (maxMs - minMs)
        );
        await new Promise<void>(s => {
            setTimeout(() => {
                s();
            }, minMs + ms);
        });
    }
}