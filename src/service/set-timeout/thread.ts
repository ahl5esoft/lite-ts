import moment from 'moment';

import { ThreadBase } from '../../contract';

export class SetTimeoutThread extends ThreadBase {
    public async sleep(ms: number) {
        if (ms < 0)
            throw new Error('ms不能小于0');

        await new Promise<void>(s => {
            setTimeout(() => {
                s();
            }, ms);
        });
    }

    public async sleepRange(minMs: number, maxMs: number) {
        if (minMs < 0 || maxMs < 0)
            throw new Error('minMs或maxMs不能小于0');

        const ms = Math.floor(
            Math.random() * (maxMs - minMs)
        );
        await this.sleep(minMs + ms);
    }

    public async stopWatch<T>(title: string, func: () => Promise<T>) {
        const begin = moment();
        const res = await func();
        console.log(
            title,
            moment().diff(begin, 'second', true)
        );
        return res;
    }

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