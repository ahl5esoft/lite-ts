import { deepStrictEqual, strictEqual } from 'assert';
import { Mock } from 'lite-ts-mock';

import { CacheEnum as Self } from './enum';
import { valueTypeOpenRewardsReduce } from '../value-type';
import { CacheBase } from '../../contract';
import { enum_ } from '../../model';

describe('src/service/cache/enum.ts', () => {
    describe('.items', () => {
        it('ok', async () => {
            const mockCache = new Mock<CacheBase>();
            const self = new Self(mockCache.actual, enum_.ValueTypeData);

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
            const self = new Self(mockCache.actual, enum_.ValueTypeData);

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

    describe('.getReduce<TReduce>(typer: new () => TReduce)', () => {
        it('ok', async () => {
            const mockCache = new Mock<CacheBase>({
                updateOn: 11
            });
            const self = new Self(mockCache.actual, enum_.ValueTypeData, {
                [enum_.ValueTypeOpenRewards.name]: valueTypeOpenRewardsReduce,
            });

            mockCache.expectReturn(
                r => r.get(enum_.ValueTypeData.name),
                {
                    1: {
                        entry: {
                            openRewards: [{}],
                            value: 1,
                        } as enum_.ValueTypeData
                    }
                }
            );

            const res = await self.getReduce(enum_.ValueTypeOpenRewards);
            deepStrictEqual(res, {
                1: [{}]
            });
        });

        it('无数据', async () => {
            const mockCache = new Mock<CacheBase>({
                updateOn: 11
            });
            const self = new Self(mockCache.actual, enum_.ValueTypeData, {
                [enum_.ValueTypeOpenRewards.name]: valueTypeOpenRewardsReduce,
            });

            mockCache.expectReturn(
                r => r.get(enum_.ValueTypeData.name),
                {}
            );

            const res = await self.getReduce(enum_.ValueTypeOpenRewards);
            deepStrictEqual(res, {});
        });
    });
});