import { ok, strictEqual } from 'assert';

import { IORedis, RedisLock as Self } from '../../../plugin/redis';

const cfg = {
    host: '127.0.0.1',
    port: 6379,
};
const redis = new IORedis(cfg);

describe('plugin/redis/lock.ts', (): void => {
    after(() => {
        redis.close();
    });

    describe('.lock(key: string, time: number): Promise<IActionAsync>', (): void => {
        it('ok', async (): Promise<void> => {
            const self = new Self(redis);
            let unlock = await self.lock('ok', 5);
            ok(unlock);

            unlock = await self.lock('ok', 5);
            strictEqual(unlock, null);
        });

        it('ok and unlock', async (): Promise<void> => {
            const self = new Self(redis);
            let unlock = await self.lock('ok and unlock', 5);
            ok(unlock);

            await unlock();

            unlock = await self.lock('ok and unlock', 5);
            ok(unlock);
        });
    });
});
