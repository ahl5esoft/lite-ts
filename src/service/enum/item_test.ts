import { strictEqual } from 'assert';

import { EnumItem as Self } from './item';

describe('src/service/mongo/enum-item.ts', () => {
    describe('.encodingKey', () => {
        it('ok', () => {
            const data = {
                key: 'k',
                value: 1
            };
            const enumName = 'test';
            const res = new Self(data, enumName, '_').encodingKey;
            strictEqual(res, `${enumName}_${data.value}`);
        });
    });

    describe('.getCustomEncodingKey(attr: string)', () => {
        it('ok', () => {
            const data = {
                key: 'k',
                value: 1
            };
            const enumName = 'test';
            const attr = 'att';
            const res = new Self(data, enumName, '_').getCustomEncodingKey(attr);
            strictEqual(res, `${enumName}_${data.value}_${attr}`);
        });
    });
});