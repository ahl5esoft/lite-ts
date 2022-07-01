import moment from 'moment';
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
        await this.sleep(minMs + ms);
    }

    /**
     * 观察耗时
     * 
     * @param title 标题
     * @param func 函数
     */
    public async stopWatch<T>(title: string, func: () => Promise<T>) {
        const begin = moment();
        const res = await func();
        console.log(
            title,
            moment().diff(begin, 'second', true)
        );
        return res;
    }

    /**
     * 尝试一些次数
     * 
     * @param action 函数
     * @param count 尝试次数
     * @param interval 间隔, 默认: 5s
     */
    public async try(action: () => Promise<void>, count: number, interval = 5 * 1000) {
        let err: Error;
        for (let i = 0; i < count; i++) {
            if (i)
                await this.sleep(interval);

            try {
                await action();
                err = null;
                break;
            } catch (ex) {
                err = ex;
            }
        }
        if (err)
            throw err;
    }
}