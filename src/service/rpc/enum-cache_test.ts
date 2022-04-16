import { deepStrictEqual } from 'assert';

import { RpcEnumCache as Self } from './enum-cache';
import { Mock } from '../assert';
import { ICache, NowTimeBase, RpcBase } from '../../contract';

describe('src/service/rpc/enum-cache.ts', () => {
    describe('.cache[protected]', () => {
        it('ok', async () => {
            const mockNowTime = new Mock<NowTimeBase>();
            const mockRpc = new Mock<RpcBase>();
            const self = new Self(mockNowTime.actual, mockRpc.actual, 'app');

            mockNowTime.expectReturn(
                r => r.unix(),
                Date.now()
            );

            mockRpc.expectReturn(
                r => r.call(`/app/ih/find-all-enums`),
                {
                    data: []
                }
            );

            const res = Reflect.get(self, 'cache') as ICache;
            await res.get('');
        });
    });

    describe('.flush()', () => {
        it('ok', () => {
            const self = new Self(null, null, null);

            const mockCache = new Mock<ICache>();
            Reflect.set(self, 'm_Cache', mockCache.actual);

            mockCache.expected.flush();

            self.flush();
        });
    });

    describe('.get<T>(key: string)', () => {
        it('ok', async () => {
            const self = new Self(null, null, null);

            const mockCache = new Mock<ICache>();
            Reflect.set(self, 'm_Cache', mockCache.actual);

            mockCache.expectReturn(
                r => r.get(''),
                []
            );

            const res = await self.get('');
            deepStrictEqual(res, []);
        });
    });
});