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
                targetNo: undefined,
                targetType: undefined,
                valueType: 4,
            }, {
                count: 3,
                source: 'test',
                targetNo: undefined,
                targetType: undefined,
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
                targetNo: undefined,
                targetType: undefined,
                valueType: 3,
            }]);
        });
    });

    describe(`.preview(uow: IUnitOfWork, rewards: contract.IReward[][], scene = '')`, () => {
        it('ok', async () => {
            const mockEnumFactory = new Mock<EnumFactoryBase>();
            const mockUserService = new Mock<UserServiceBase>();
            const self = new Self(mockEnumFactory.actual, mockUserService.actual);

            const mockRandSeedService = new Mock<IUserRandSeedService>();
            mockUserService.expectReturn(
                r => r.getRandSeedService('test'),
                mockRandSeedService.actual
            );

            const mockEnum = new Mock<IEnum<enum_.ValueTypeData>>();
            mockEnumFactory.expectReturn(
                r => r.build(enum_.ValueTypeData),
                mockEnum.actual
            );

            mockRandSeedService.expectReturn(
                r => r.get(null, 2, 0),
                11
            );

            mockEnum.expectReturn(
                r => r.getByValue(1),
                {
                    data: {
                        openRewards: [
                            [{
                                count: 4,
                                valueType: 3,
                                weight: 1
                            }, {
                                count: 6,
                                valueType: 5,
                                weight: 1
                            },]
                        ]
                    } as enum_.ValueTypeData
                }
            );

            mockRandSeedService.expectReturn(
                r => r.get(null, 1, 2),
                0
            );

            mockEnum.expectReturn(
                r => r.getByValue(3),
                null
            );

            mockRandSeedService.expectReturn(
                r => r.get(null, 1, 3),
                1
            );

            mockEnum.expectReturn(
                r => r.getByValue(5),
                null
            );

            const res = await self.preview(null, [
                [{
                    count: 10,
                    source: 't2',
                    valueType: 1,
                    weight: 1
                }, {
                    count: 2,
                    source: 't2',
                    valueType: 1,
                    weight: 9
                }]
            ], 'test');
            deepStrictEqual(res, [{
                count: 4,
                valueType: 3
            }, {
                count: 6,
                valueType: 5
            }]);
        });
    });
});