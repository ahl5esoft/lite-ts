import { deepStrictEqual } from 'assert';

import { PushFeishuLog as Self } from './feishu-log';
import { request } from '../../model';

describe('src/service/push/feishu-log.ts', () => {
    describe('.convertToPushMessage(labels: [string, any][])[protected]', () => {
        it('error', () => {
            const self = new Self(null);

            const fn = Reflect.get(self, 'convertToPushMessage') as (labels: [string, any][]) => request.FeishuPostPush[][];
            const err = new Error('test');
            const res = fn([
                ['', err]
            ]);
            deepStrictEqual(res, [
                [{
                    tag: 'text',
                    text: ['错误', err.message].join(': ')
                }],
                [{
                    tag: 'text',
                    text: ['堆栈', err.stack].join(': ')
                }]
            ] as request.FeishuPostPush[][]);
        });

        it('ok', () => {
            const self = new Self(null);

            const fn = Reflect.get(self, 'convertToPushMessage') as (labels: [string, any][]) => request.FeishuPostPush[][];
            const res = fn([
                ['a', 'b']
            ]);
            deepStrictEqual(res, [
                [{
                    tag: 'text',
                    text: 'a: b'
                }]
            ] as request.FeishuPostPush[][]);
        });
    });
});