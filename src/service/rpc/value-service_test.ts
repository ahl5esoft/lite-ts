import { strictEqual } from 'assert';

import { RpcValueService as Self } from './value-service';
import { Mock, mockAny } from '../assert';
import { CustomError } from '../error';
import { IUserAssociateService, RpcBase, UserServiceBase } from '../../contract';
import { enum_, global } from '../../model';

describe('src/service/rpc/value-service.ts', () => {
    describe('.update(_: IUnitOfWork, values: contract.IValue[])', () => {
        it('ok', async () => {
            const mockAssociateService = new Mock<IUserAssociateService>();
            const mockUserService = new Mock<UserServiceBase>({
                associateService: mockAssociateService.actual
            });
            const mockRpc = new Mock<RpcBase>();
            const self = new Self(mockRpc.actual, {
                app: 'test',
                value: 1
            } as enum_.TargetTypeData, {
                no: 2
            } as global.UserTargetValue, null, mockUserService.actual, null);

            mockAssociateService.expectReturn(
                r => r.find(`${global.UserTargetValue.name}-1`, mockAny),
                []
            );

            mockRpc.expectReturn(
                r => r.call({
                    body: {
                        no: 2,
                        values: [{
                            count: 1,
                            valueType: 11
                        }]
                    },
                    route: `/test/${Self.updateRoute}`
                }),
                {}
            );

            let err: CustomError;
            try {
                await self.update(null, [{
                    count: 1,
                    valueType: 11
                }]);
            } catch (ex) {
                err = ex;
            }
            strictEqual(err, undefined);
        });
    });
});