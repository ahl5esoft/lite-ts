import { deepStrictEqual } from 'assert';
import { Mock } from 'lite-ts-mock';

import { RpcEnumCache as Self } from './enum-cache';
import { EnumCacheBase, RpcBase } from '../../contract';
import { global } from '../../model';

describe('src/service/rpc/enum-cache.ts', () => {
    describe('.load()', () => {
        it('ok', async () => {
            EnumCacheBase.buildItemFunc = () => {
                return null;
            };

            const mockRpc = new Mock<RpcBase>();
            const self = new Self(mockRpc.actual, 'app', {}, null, '');

            mockRpc.expectReturn(
                r => r.call<global.Enum[]>({
                    body: {},
                    route: `/app/find-all-enums`
                }),
                [{
                    id: 'a',
                    items: [{
                        value: 1,
                    }, {
                        value: 2
                    }]
                }]
            );

            const fn = Reflect.get(self, 'load').bind(self) as () => Promise<{ [key: string]: any }>;
            const res = await fn();
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