import { strictEqual } from 'assert';

import { PushMarkdownLog as Self } from './markdown-log';

describe('src/service/push/markdown-log.ts', () => {
    describe('.convertToPushMessage(labels: [string, any][])[protected]', () => {
        it('ok', () => {
            const self = new Self(null);

            const fn = Reflect.get(self, 'convertToPushMessage') as (labels: [string, any][]) => string;
            const err = new Error('test');
            const res = fn([
                ['', err]
            ]);
            strictEqual(res, `> ${err.message}\n> ${err.stack}`);
        });

        it('ok', () => {
            const self = new Self(null);

            const fn = Reflect.get(self, 'convertToPushMessage') as (labels: [string, any][]) => string;
            const res = fn([
                ['a', 'b']
            ]);
            strictEqual(res, '- a: b');
        });
    });
});