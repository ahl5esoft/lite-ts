import { deepStrictEqual, strictEqual } from 'assert';

import { RpcUserValueService as Self } from './user-value-service';
import { Mock } from '../assert';
import { IUnitOfWork, NowTimeBase, RpcBase } from '../../contract';

describe('src/service/rpc/user-value-service.ts', () => {
    describe('.getNow(uow: IUnitOfWork)', () => {
        it('数值', async () => {
            const self = new Self(null, null, 1, null, null, null);

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
            const self = new Self(null, null, 1, null, null, mockNowTime.actual);

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

    describe('.update(_: IUnitOfWork, values: IValueData[])', () => {
        it('ok', async () => {
            const mockRpc = new Mock<RpcBase>();
            const userID = 'uid';
            const self = new Self(null, mockRpc.actual, 0, userID, null, null);

            mockRpc.expectReturn(
                r => r.setBody({
                    userID,
                    values: [{
                        count: 1,
                        valueType: 11
                    }]
                }),
                mockRpc.actual
            );

            mockRpc.expectReturn(
                r => r.call('/prop/ih/update-values-by-user-id'),
                {}
            );

            await self.update(null, [{
                count: 1,
                valueType: 11
            }]);
        });
    });

    describe('.updateByRewards(_: IUnitOfWork, source: string, rewards: IRewardData[][])', () => {
        it('ok', async () => {
            const mockRpc = new Mock<RpcBase>();
            const userID = 'uid';
            const self = new Self(null, mockRpc.actual, 0, userID, null, null);

            const source = 'test'
            mockRpc.expectReturn(
                r => r.setBody({
                    rewards: [[]],
                    source,
                    userID,
                }),
                mockRpc.actual
            );

            mockRpc.expectReturn(
                r => r.call('/prop/ih/update-user-value-by-rewards'),
                {
                    data: [{}]
                }
            );

            const res = await self.updateByRewards(null, source, [[]]);
            deepStrictEqual(res, [{}]);
        });
    });
});