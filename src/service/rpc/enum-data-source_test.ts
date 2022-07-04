import { deepStrictEqual } from 'assert';

import { Mock } from '../assert';
import { RpcBase } from '../../contract';

import { RpcEnumDataSource as Self } from './enum-data-source';
import { global } from '../../model';

describe('src/service/rpc/load-enum-data-source.ts', () => {
    describe('.loadRpcEnumDataSrouce(rpc: RpcBase, sep: string)', () => {
        it('ok', async () => {
            const mockRpc = new Mock<RpcBase>();
            const self = new Self(mockRpc.actual, 'app', '-');

            mockRpc.expectReturn(
                r => r.call<global.Enum[]>(`/app/ih/find-all-enums`),
                {
                    err: 0,
                    data: [{
                        id: 'a',
                        items: [{
                            value: 1,
                        }, {
                            value: 2
                        }]
                    }]
                }
            );

            const res = await self.findEnums();
            deepStrictEqual(
                Object.keys(res),
                ['a']
            );
            deepStrictEqual(
                Object.keys(res['a']),
                ['1', '2']
            );
        });
    });
});