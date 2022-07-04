import { deepStrictEqual } from 'assert';

import { EnumDataSourceBase } from './data-source-base';
import { global } from '../../model';

class Self extends EnumDataSourceBase {
    public constructor(
        private m_Entries: global.Enum[]
    ) {
        super('-');
    }

    protected async load() {
        return this.m_Entries;
    }
}

describe('src/service/enum/data-source-base.ts', () => {
    describe('.findEnums()', () => {
        it('ok', async () => {
            const res = await new Self([{
                id: 'a',
                items: [{
                    value: 1,
                }, {
                    value: 2,
                }]
            }]).findEnums();
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