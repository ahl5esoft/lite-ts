import { deepStrictEqual, strictEqual } from 'assert';

import { CacheEnum as Self } from './enum';
import { Mock } from '../assert';
import { CacheBase } from '../../contract';
import { enum_ } from '../../model';

describe('src/service/cache/enum.ts', () => {
    describe('.items', () => {
        it('ok', async () => {
            const mockCache = new Mock<CacheBase>();
            const self = new Self(mockCache.actual, enum_.ValueTypeData.name);

            mockCache.expectReturn(
                r => r.get(enum_.ValueTypeData.name),
                {}
            );

            const res = await self.items;
            deepStrictEqual(res, []);
        });
    });

    describe('.get(predicate: (data: global.IEnumItemData) => boolean)', () => {
        it('ok', async () => {
            const mockCache = new Mock<CacheBase>();
            const self = new Self(mockCache.actual, enum_.ValueTypeData.name);

            mockCache.expectReturn(
                r => r.get(enum_.ValueTypeData.name),
                []
            );

            const res = await self.get(r => {
                return r.key == '';
            });
            strictEqual(res, undefined);
        });
    });
});