import { deepStrictEqual } from 'assert';

import { DbUserRewardService as Self } from './user-reward-service';
import { Mock } from '../assert';
import { EnumFactoryBase, IEnum, IUserRandSeedService, UserServiceBase } from '../../contract';
import { enum_ } from '../../model';

describe('src/service/db/user-reward-service.ts', () => {
    describe('.findResults(uow: IUnitOfWork, rewards: IRewardData[][], scene?: string)', () => {
        it('固定', async () => {
            const mockEnumFactory = new Mock<EnumFactoryBase>();
            const mockUserService = new Mock<UserServiceBase>();
            const self = new Self(mockEnumFactory.actual, mockUserService.actual);

            const mockRandSeedService = new Mock<IUserRandSeedService>();
            mockUserService.expectReturn(
                r => r.getRandSeedService(''),
                mockRandSeedService.actual
            );

            const mockEnum = new Mock<IEnum<enum_.ValueTypeData>>();
            mockEnumFactory.expectReturn(
                r => r.build(enum_.ValueTypeData),
                mockEnum.actual
            );

            mockEnum.expectReturn(
                r => r.getByValue(1),
                {
                    data: {
                        openRewards: [
                            [{
                                count: 3,
                                valueType: 4,
                            }]
                        ]
                    } as enum_.ValueTypeData
                }
            );

            mockUserService.expectReturn(
                r => r.getRandSeedService(''),
                mockRandSeedService.actual
            );

            mockEnumFactory.expectReturn(
                r => r.build(enum_.ValueTypeData),
                mockEnum.actual
            );

            mockEnum.expectReturn(
                r => r.getByValue(4),
                null
            );

            mockUserService.expectReturn(
                r => r.getRandSeedService(''),
                mockRandSeedService.actual
            );

            mockEnumFactory.expectReturn(
                r => r.build(enum_.ValueTypeData),
                mockEnum.actual
            );

            mockEnum.expectReturn(
                r => r.getByValue(4),
                null
            );

            const res = await self.findResults(null, [
                [{
                    count: 2,
                    valueType: 1
                }]
            ], 'test');
            deepStrictEqual(res, [{
                count: 3,
                source: 'test',
                valueType: 4,
            }, {
                count: 3,
                source: 'test',
                valueType: 4,
            }]);
        });

        it('权重', async () => {
            const mockEnumFactory = new Mock<EnumFactoryBase>();
            const mockUserService = new Mock<UserServiceBase>();
            const self = new Self(mockEnumFactory.actual, mockUserService.actual);

            const mockRandSeedService = new Mock<IUserRandSeedService>();
            mockUserService.expectReturn(
                r => r.getRandSeedService(''),
                mockRandSeedService.actual
            );

            const mockEnum = new Mock<IEnum<enum_.ValueTypeData>>();
            mockEnumFactory.expectReturn(
                r => r.build(enum_.ValueTypeData),
                mockEnum.actual
            );

            mockRandSeedService.expectReturn(
                r => r.use(null, 2),
                11
            );

            mockEnum.expectReturn(
                r => r.getByValue(3),
                null
            );

            const res = await self.findResults(null, [
                [{
                    count: 2,
                    source: 't2',
                    valueType: 1,
                    weight: 10
                }, {
                    count: 2,
                    source: 't2',
                    valueType: 3,
                    weight: 11
                }]
            ], 'test');
            deepStrictEqual(res, [{
                count: 2,
                source: 't2',
                valueType: 3,
            }]);
        });
    });
});