import { strictEqual } from 'assert';

import { RpcUserValueService as Self } from './user-value-service';
import { Mock } from '../assert';
import { IUnitOfWork, NowTimeBase, RpcBase, UserServiceBase } from '../../contract';
import { enum_ } from '../../model';

describe('src/service/rpc/user-value-service.ts', () => {
    describe('.getNow(uow: IUnitOfWork)', () => {
        it('数值', async () => {
            const self = new Self(null, null, {} as enum_.TargetTypeData, 1, null, null);

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
            const self = new Self(null, null, {} as enum_.TargetTypeData, 1, null, mockNowTime.actual);

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

    describe('.update(uow: IUnitOfWork, values: contract.IValue[])', () => {
        it('ok', async () => {
            const userID = 'uid';
            const mockUserService = new Mock<UserServiceBase>({
                userID
            });
            const mockRpc = new Mock<RpcBase>();
            const self = new Self(mockUserService.actual, mockRpc.actual, {
                app: 'prop'
            } as enum_.TargetTypeData, 0, null, null);

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
                r => r.call(`/prop/${Self.updateRoute}`),
                {}
            );

            await self.update(null, [{
                count: 1,
                valueType: 11
            }]);
        });
    });
});