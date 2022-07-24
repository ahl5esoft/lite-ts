import { deepStrictEqual, strictEqual } from 'assert';

import { DbUserValueService as Self } from './user-value-service';
import { Mock } from '../assert';
import { IUnitOfWork, NowTimeBase, UserServiceBase } from '../../contract';
import { contract } from '../../model';

describe('src/service/user/value-service.ts', () => {
    describe('.getNow(uow: IUnitOfWork)', () => {
        it('数值', async () => {
            const self = new Self(null, 1, null, null, null, null, null);

            const mockUow = new Mock<IUnitOfWork>();
            Reflect.set(self, 'getCount', (arg: IUnitOfWork, arg1: number) => {
                strictEqual(arg, mockUow.actual);
                strictEqual(arg1, 1);
                return 11;
            });

            const res = await self.getNow(mockUow.actual);
            strictEqual(res, 11);
        });

        it('NowTime', async () => {
            const mockNowTime = new Mock<NowTimeBase>();
            const self = new Self(null, 1, null, null, mockNowTime.actual, null, null);

            const mockUow = new Mock<IUnitOfWork>();
            Reflect.set(self, 'getCount', (arg: IUnitOfWork, arg1: number) => {
                strictEqual(arg, mockUow.actual);
                strictEqual(arg1, 1);
                return 0;
            });

            mockNowTime.expectReturn(
                r => r.unix(),
                99
            );

            const res = await self.getNow(mockUow.actual);
            strictEqual(res, 99);
        });
    });

    describe('.updateByRewards(uow: IUnitOfWork, rewards: contract.IReward[][], source: string)', () => {
        it('', async () => {
            const userID = 'user-id';
            const self = new Self({
                userID: userID
            } as UserServiceBase, 0, null, null, null, null, null);

            const source = 'test';
            const rewards = [
                [{
                    count: 11,
                    valueType: 1
                }],
                [{
                    count: 22,
                    valueType: 2,
                    weight: 999
                }, {
                    count: 222,
                    valueType: 2,
                    weight: 1
                }]
            ] as contract.IReward[][];
            const expectRes = [{
                count: 11,
                source: source,
                valueType: 1
            }, {
                count: 22,
                source: source,
                valueType: 2
            }];
            Reflect.set(self, 'update', (arg: IUnitOfWork, arg1: contract.IValue[]) => {
                deepStrictEqual(
                    [arg, arg1],
                    [
                        null,
                        expectRes
                    ]
                )
            });

            const res = await self.updateByRewards(null, source, rewards);
            deepStrictEqual(res, expectRes);
        });
    });
});