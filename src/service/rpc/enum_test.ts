import { deepStrictEqual, strictEqual } from 'assert';

import { RpcEnum as Self } from './enum';
import { Mock } from '../assert';
import { RpcBase } from '../../contract';

describe('src/service/rpc/enum.ts', () => {
    describe('.items', () => {
        it('ok', async () => {
            const mockRpc = new Mock<RpcBase>();
            const enumName = 'enum-name';
            const route = '/find-enums';
            const self = new Self(mockRpc.actual, enumName, route);

            mockRpc.expectReturn(
                r => r.setBody({
                    name: enumName
                }),
                mockRpc.actual
            );

            const itemDatas = [{
                value: 1
            }, {
                value: 2
            }];
            mockRpc.expectReturn(
                r => r.call(route),
                {
                    data: itemDatas
                }
            );

            const res = await self.items;
            strictEqual(res.length, 2);
            deepStrictEqual(
                res.map(r => {
                    return r.data;
                }),
                itemDatas
            );
        });
    });
});