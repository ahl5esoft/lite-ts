import { deepStrictEqual } from 'assert';

import { CacheValueTypeSerivce as Self } from './value-type-service';
import { Mock } from '../assert';
import { CacheBase, EnumFactoryBase, IEnum } from '../../contract';
import { enum_ } from '../../model';

describe('src/service/cache/value-type-service.ts', () => {
    describe('.get<T>(key: string)', () => {
        it('ok', async () => {
            const mockCache = new Mock<CacheBase>({
                isExpired: [true, 999]
            });
            const mockEnumFactory = new Mock<EnumFactoryBase>();
            const self = new Self(mockCache.actual, mockEnumFactory.actual, {});

            const mockEnum = new Mock<IEnum<enum_.ValueTypeData>>({
                items: [{
                    data: {
                        openRewards: [{}],
                        value: 1,
                    } as enum_.ValueTypeData
                }]
            });
            mockEnumFactory.expectReturn(
                r => r.build(enum_.ValueTypeData),
                mockEnum.actual
            );

            const res = await self.get('openRewards');
            deepStrictEqual(res, {
                1: [{}]
            });
        });
    });
});