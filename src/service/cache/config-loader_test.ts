import { deepStrictEqual } from 'assert';
import { Mock } from 'lite-ts-mock';

import { CacheConfigLoader as Self } from './config-loader';
import { CacheBase } from '../../contract';
import { config } from '../../model';

describe('src/service/cache/config-loader.ts', () => {
    describe('.load<T>(ctor: new () => T)', () => {
        it('ok', async () => {
            const mockCache = new Mock<CacheBase>();
            const self = new Self(mockCache.actual);

            mockCache.expectReturn(
                r => r.get(config.Default.name),
                {}
            );

            const res = await self.load(config.Default);
            deepStrictEqual(res, {});
        });
    });
});