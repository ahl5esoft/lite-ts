import { deepStrictEqual } from 'assert';

import { EnumCacheBase } from './cache-base';
import { global } from '../../model';

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

describe('src/service/enum/data-source-base.ts', () => {
    describe('.findEnums()', () => {
        it('ok', async () => {
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