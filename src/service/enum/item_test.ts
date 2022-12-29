import { strictEqual } from 'assert';

import { EnumItem as Self } from './item';

describe('src/service/mongo/enum-item.ts', () => {
    describe('.langKey', () => {
        it('ok', () => {
            const entry = {
                key: 'k',
                value: 1
            };
            const enumName = 'test';
            const res = new Self(entry, enumName).langKey;
            strictEqual(res, `${enumName}:${entry.value}`);
        });
    });

    describe('.getCustomEncodingKey(attr: string)', () => {
        it('ok', () => {
            const entry = {
                key: 'k',
                value: 1
            };
            const enumName = 'test';
            const attr = 'att';
            const res = new Self(entry, enumName).getCustomLangKey(attr);
            strictEqual(res, `${enumName}:${entry.value}:${attr}`);
        });
    });
});