import { deepStrictEqual } from 'assert';

import { RpcUserPortraitService as Self } from './user-portrait-service';
import { Mock } from '../assert';
import { RpcBase } from '../../contract';
import { global } from '../../model';

describe('src/service/rpc/user-portrait-service.ts', () => {
    describe('.find<T>(field: string, userID?: string)', () => {
        it('ok', async () => {
            const mockRpc = new Mock<RpcBase>();
            const self = new Self(mockRpc.actual, 'user-id');

            mockRpc.expectReturn(
                r => r.setBody({
                    field: 'prop',
                    userID: 'uid',
                }),
                mockRpc.actual
            );

            mockRpc.expectReturn(
                r => r.callWithoutThrow('/portrait/get'),
                {
                    data: []
                }
            );

            const res = await self.find<global.UserValue>('prop', 'uid');
            deepStrictEqual(res, []);

            const cache = Reflect.get(self, 'm_Cache');
            deepStrictEqual(cache, {
                'uid': {
                    prop: []
                }
            });
        });
    });

    describe('.remove(field: string, userID?: string)', () => {
        it('ok', async () => {
            const mockRpc = new Mock<RpcBase>();
            const self = new Self(mockRpc.actual, 'user-id');

            Reflect.set(self, 'm_Cache', {
                'user-id': {
                    prop: []
                }
            })

            mockRpc.expectReturn(
                r => r.setBody({
                    field: 'prop',
                    userID: 'user-id',
                }),
                mockRpc.actual
            );

            mockRpc.expectReturn(
                r => r.callWithoutThrow('/portrait/remove'),
                {
                    data: []
                }
            );

            await self.remove('prop');

            const cache = Reflect.get(self, 'm_Cache');
            deepStrictEqual(cache, {
                'user-id': {}
            });
        });
    });
});