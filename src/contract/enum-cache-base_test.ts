import { deepStrictEqual, strictEqual } from 'assert';

import { EnumCacheBase } from './enum-cache-base';
import { global } from '../model';

class Self extends EnumCacheBase {
    public constructor(
        private m_Entries: global.Enum[]
    ) {
        super('-', null, null);
    }

    public withTrace() {
        return this;
    }

    protected async find() {
        return this.m_Entries;
    }
}

describe('src/contract/enum-cache-base.ts', () => {
    describe('.findEnums()', () => {
        it('ok', async () => {
            const arg3Expects = [{
                value: 1,
            }, {
                value: 2
            }];
            EnumCacheBase.buildItemFunc = (arg1: string, arg2: string, arg3: any) => {
                strictEqual(arg1, 'a');
                strictEqual(arg2, '-');
                deepStrictEqual(
                    arg3,
                    arg3Expects.shift()
                );
                return null;
            };

            const self = new Self([{
                id: 'a',
                items: [{
                    value: 1,
                }, {
                    value: 2,
                }]
            }]);
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