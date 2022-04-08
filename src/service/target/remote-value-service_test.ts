import { notStrictEqual, strictEqual } from 'assert';

import { TargetRemoteValueService as Self } from './remote-value-service';
import { Mock } from '../assert';
import { CustomError } from '../error';
import { RpcBase } from '../..';
import { enum_ } from '../../model';

describe('src/service/target/remote-value-service.ts', () => {
    describe('.update(_: IUnitOfWork, values: IValueData[])', () => {
        it('err', async () => {
            const mockRpc = new Mock<RpcBase>();
            const targetTypeData = {
                app: 'test'
            } as enum_.TargetTypeData;
            const userID = 'uid';
            const self = new Self(mockRpc.actual, targetTypeData, userID, null, null);

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
                r => r.call(`/${targetTypeData.app}/ih/update-values-by-user-id`),
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
            const targetTypeData = {
                app: 'test'
            } as enum_.TargetTypeData;
            const userID = 'uid';
            const self = new Self(mockRpc.actual, targetTypeData, userID, null, null);

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
                r => r.call(`/${targetTypeData.app}/ih/update-values-by-user-id`),
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