import { ok, strictEqual } from 'assert';

import { RedisLock as Self } from './lock';
import { IoredisAdapter } from '../ioredis';

const cfg = {
    host: '127.0.0.1',
    port: 6379,
};
const redis = new IoredisAdapter(cfg);

describe('src/service/redis/lock.ts', () => {
    after(() => {
        redis.close();
    });

    describe('.lock(key: string, time: number): Promise<IActionAsync>', () => {
        it('ok', async () => {
            const self = new Self(redis);
            let unlock = await self.lock('ok', 5);
            ok(unlock);

            unlock = await self.lock('ok', 5);
            strictEqual(unlock, null);
        });

        it('ok and unlock', async () => {
            const self = new Self(redis);
            let unlock = await self.lock('ok and unlock', 5);
            ok(unlock);

            await unlock();

            unlock = await self.lock('ok and unlock', 5);
            ok(unlock);
        });
    });
});
