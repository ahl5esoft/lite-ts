import { notStrictEqual, strictEqual } from 'assert';

import { RpcValueService as Self } from './value-service';
import { Mock } from '../assert';
import { CustomError } from '../error';
import { RpcBase } from '../../contract';

describe('src/service/rpc/value-service.ts', () => {
    describe('.update(_: IUnitOfWork, values: IValueData[])', () => {
        it('err', async () => {
            const mockRpc = new Mock<RpcBase>();
            const userID = 'uid';
            const self = new Self(null, mockRpc.actual, userID, null, null);

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
                {
                    err: 1,
                    data: 'err'
                }
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
            notStrictEqual(err, undefined);
            strictEqual(err.code, 1);
            strictEqual(err.data, 'err');
        });

        it('ok', async () => {
            const mockRpc = new Mock<RpcBase>();
            const userID = 'uid';
            const self = new Self(null, mockRpc.actual, userID, null, null);

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