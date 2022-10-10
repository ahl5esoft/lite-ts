import { RpcUserValueService as Self } from './user-value-service';
import { Mock } from '../assert';
import { RpcBase, UserServiceBase } from '../../contract';
import { enum_ } from '../../model';

describe('src/service/rpc/user-value-service.ts', () => {
    describe('.update(uow: IUnitOfWork, values: contract.IValue[])', () => {
        it('ok', async () => {
            const userID = 'uid';
            const mockUserService = new Mock<UserServiceBase>({
                userID
            });
            const mockRpc = new Mock<RpcBase>();
            const self = new Self(mockRpc.actual, {
                app: 'prop'
            } as enum_.TargetTypeData, null, null, mockUserService.actual, 0);

            mockRpc.expectReturn(
                r => r.call({
                    body: {
                        userID,
                        values: [{
                            count: 1,
                            valueType: 11
                        }]
                    },
                    route: `/prop/${Self.updateRoute}`
                }),
                {}
            );

            await self.update(null, [{
                count: 1,
                valueType: 11
            }]);
        });
    });
});