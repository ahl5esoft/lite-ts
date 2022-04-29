import { strictEqual } from 'assert';

import { RpcValueService as Self } from './value-service';
import { Mock } from '../assert';
import { CustomError } from '../error';
import { RpcBase } from '../../contract';
import { enum_ } from '../../model';

describe('src/service/rpc/value-service.ts', () => {
    describe('.update(_: IUnitOfWork, values: IValueData[])', () => {
        it('ok', async () => {
            const mockRpc = new Mock<RpcBase>();
            const self = new Self(null, {
                app: 'test'
            } as enum_.TargetTypeData, mockRpc.actual, null, null);

            mockRpc.expectReturn(
                r => r.setBody({
                    values: [{
                        count: 1,
                        valueType: 11
                    }]
                }),
                mockRpc.actual
            );

            mockRpc.expectReturn(
                r => r.call('/test/ih/update-values-by-user-id'),
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