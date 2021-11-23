import { strictEqual } from 'assert';

import { EnumItem as Self } from './enum-item';

describe('src/service/mongo/enum-item.ts', () => {
    describe('.encodingKey', () => {
        it('ok', () => {
            const data = {
                key: 'k',
                value: 1
            };
            const enumName = 'test';
            const res = new Self(data, enumName).encodingKey;
            strictEqual(res, `enum-${enumName}-${data.value}`);
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
            const res = new Self(data, enumName).getCustomEncodingKey(attr);
            strictEqual(res, `enum-${enumName}-${attr}-${data.value}`);
        });
    });
});