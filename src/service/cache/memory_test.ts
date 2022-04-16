import { deepStrictEqual, strictEqual } from 'assert';

import { MemoryCache as Self } from './memory';
import { Mock } from '../assert';
import { NowTimeBase } from '../../contract';

describe('src/service/cache/memory-cache.ts', () => {
    describe('.flush()', () => {
        it('ok', () => {
            const self = new Self(null, null);

            Reflect.set(self, 'm_LastLoadedOn', 100);

            self.flush();

            const res = Reflect.get(self, 'm_LastLoadedOn');
            strictEqual(res, 0);
        });
    });

    describe('.get(key: string)', () => {
        it('ok', async () => {
            const mockNowTime = new Mock<NowTimeBase>();
            const cache = {
                'test': []
            };
            let callLoadCount = 0;
            const self = new Self(mockNowTime.actual, async () => {
                callLoadCount++;
                return cache;
            }, 1);

            mockNowTime.expectReturn(
                r => r.unix(),
                5
            );

            let res = await self.get(
                Object.keys(cache)[0]
            );
            deepStrictEqual(res, []);

            mockNowTime.expectReturn(
                r => r.unix(),
                5
            );

            res = await self.get(
                Object.keys(cache)[0]
            );
            deepStrictEqual(res, []);
            strictEqual(callLoadCount, 1);
        });
    });
});