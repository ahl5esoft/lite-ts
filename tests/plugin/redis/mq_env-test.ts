import { strictEqual } from 'assert';
import { IORedis, RedisMQ } from '../../../plugin/redis';

const cfg = {
    host: '127.0.0.1',
    port: 6379,
};
const redis = new IORedis(cfg);

describe('plugin/redis/mq.ts', (): void => {
    after(() => {
        redis.close();
    });

    describe('.publish(channel: string, message: any): Promise<void>', (): void => {
        const channel = 'test-publish';
        it('ok', async (): Promise<void> => {
            const task = new Promise((s): void => {
                redis.subscribe([channel], s);
            });

            let err: Error;
            try {
                await new RedisMQ(redis).publish(channel, [1, 2, 3]);
            } catch (ex) {
                err = ex;
            }
            strictEqual(err, undefined);
            strictEqual(
                await task,
                '[1,2,3]'
            );
        });
    });
});