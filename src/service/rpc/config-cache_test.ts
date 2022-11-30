import { deepStrictEqual } from 'assert';

import { RpcConfigCache as Self } from './config-cache';
import { Mock } from '../assert';
import { RpcBase } from '../../contract';
import { global } from '../../model';

describe('src/service/rpc/config-cache.ts', () => {
    describe('.load()', () => {
        it('ok', async () => {
            const mockRpc = new Mock<RpcBase>();
            const self = new Self('app', '', null, mockRpc.actual);

            mockRpc.expectReturn(
                r => r.call<global.Enum[]>(`/app/find-all-config`),
                {
                    err: 0,
                    data: [{
                        id: 'a',
                        items: {
                            value: 1
                        }
                    }]
                }
            );

            const fn = Reflect.get(self, 'load').bind(self) as () => Promise<{ [key: string]: any; }>;
            const res = await fn();
            deepStrictEqual(
                res,
                {
                    a: {
                        value: 1
                    }
                }
            );
        });
    });
});