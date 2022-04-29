import { deepStrictEqual } from 'assert';

import { RpcUserValueService as Self } from './user-value-service';
import { Mock } from '../assert';
import { RpcBase } from '../../contract';

describe('src/service/rpc/user-value-service.ts', () => {
    describe('.update(_: IUnitOfWork, values: IValueData[])', () => {
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
            const self = new Self(null, mockRpc.actual, userID, null, null);

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