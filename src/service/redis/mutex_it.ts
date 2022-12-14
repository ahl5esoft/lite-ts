import { ok, strictEqual } from 'assert';

import { RedisMutex as Self } from './mutex';
import { Mock } from '../assert';
import { IoredisAdapter } from '../ioredis';
import { ThreadBase } from '../../contract';

const cfg = {
    host: '127.0.0.1',
    port: 6379,
};
const redis = new IoredisAdapter(cfg);

describe('src/service/redis/lock.ts', () => {
    after(() => {
        redis.close();
    });

    describe('.lock(opt: RedisMutexOption)', () => {
        it('once', async () => {
            const self = new Self(redis, null);
            let unlock = await self.lock({
                key: 'ok',
                timeoutSeconds: 5
            });
            ok(unlock);

            unlock = await self.lock({
                key: 'ok',
                timeoutSeconds: 5
            });
            strictEqual(unlock, null);
        });

        it('once and unlock', async () => {
            const self = new Self(redis, null);
            let unlock = await self.lock({
                key: 'ok and unlock',
                timeoutSeconds: 5
            });
            ok(unlock);

            await unlock();

            unlock = await self.lock({
                key: 'ok and unlock',
                timeoutSeconds: 5
            });
            ok(unlock);
        });

        it('wait', async () => {
            const mockThread = new Mock<ThreadBase>();
            const self = new Self(redis, mockThread.actual);

            const res = await self.lock({
                key: 'test-wait-lock'
            });
            ok(res);

            const ttl = await redis.ttl('test-wait-lock');
            strictEqual(ttl, 10);

            await redis.del('test-wait-lock');
        });

        it('wait err', async () => {
            const mockThread = new Mock<ThreadBase>();
            const self = new Self(redis, mockThread.actual);

            await redis.set('test-wait-lock-err', 'ok', 'ex', 5, 'nx');

            mockThread.expected.sleepRange(100, 300);

            let err: Error;
            try {
                await self.lock({
                    key: 'test-wait-lock-err',
                    tryCount: 1,
                });
            } catch (ex) {
                err = ex;
            }
            strictEqual(err, Self.errWaitLock);
        });
    });
});
