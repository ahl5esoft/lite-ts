import { ok, strictEqual } from 'assert';
import moment from 'moment';

import { RedisNowTime as Self } from './now-time';
import { IoredisAdapter } from '../ioredis';

const cfg = {
    host: '127.0.0.1',
    port: 6379,
};
const redis = new IoredisAdapter(cfg);

describe('src/service/redis/now-time.ts', (): void => {
    describe('.isSameDayUnix(unixTime: number)', () => {
        it('ok', async () => {
            const endDayUnix = moment().endOf('day').unix();
            const res = await new Self(redis).isSameDayUnix(endDayUnix);
            strictEqual(res, true);
        });

        it('不同天', async () => {
            const endDayUnix = moment().endOf('day').unix();
            const res = await new Self(redis).isSameDayUnix(endDayUnix + 1);
            strictEqual(res, false);
        });
    });

    describe('.unix()', (): void => {
        it('ok', async (): Promise<void> => {
            const self = new Self(redis);
            const unix = await self.unix();
            ok(Math.floor(Date.now() / 1000) - unix < 5);
        });
    });

    describe('.unixNano()', (): void => {
        it('ok', async (): Promise<void> => {
            const self = new Self(redis);
            const nanoUnix = (await self.unixNano()).toString();
            const unix = parseInt(nanoUnix.substr(0, 13));
            ok(Date.now() - unix < 5);
            strictEqual(nanoUnix.length, 19);
        });
    });
});