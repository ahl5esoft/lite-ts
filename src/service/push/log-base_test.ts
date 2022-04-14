import { deepStrictEqual, strictEqual } from 'assert';

import { PushLogBase } from './log-base';
import { Mock } from '../assert';
import { IPush } from '../../contract';

class Self extends PushLogBase {
    protected convertToPushMessage(labels: [string, any][]) {
        return labels;
    }
}

describe('src/service/push/log-base.ts', () => {
    describe('.addLabel(k: string, v: string)', () => {
        it('ok', () => {
            const self = new Self(null);

            self.addLabel('a', 'b');

            const res = Reflect.get(self, 'm_Labels');
            deepStrictEqual(res, [
                ['a', 'b']
            ]);
        });
    });

    describe('.debug()', () => {
        it('ok', async () => {
            const self = new Self(null);

            let isSendCalled = false;
            Reflect.set(self, 'send', () => {
                isSendCalled = true;
                return Promise.resolve('');
            });

            self.debug();

            strictEqual(isSendCalled, true);
        });
    });

    describe('.error(err: Error)', () => {
        it('ok', async () => {
            const self = new Self(null);

            let isSendCalled = false;
            Reflect.set(self, 'send', () => {
                isSendCalled = true;
                return Promise.resolve('');
            });

            const err = new Error('test');
            self.error(err);

            strictEqual(isSendCalled, true);

            const res = Reflect.get(self, 'm_Labels');
            deepStrictEqual(res, [
                ['', err]
            ]);
        });
    });

    describe('.send()[private]', () => {
        it('ok', async () => {
            const mockPush = new Mock<IPush>();
            const self = new Self(mockPush.actual);

            self.addLabel('a', 'b');

            mockPush.expected.push([
                ['a', 'b']
            ]);

            const fn = Reflect.get(self, 'send').bind(self) as () => Promise<void>;
            await fn();
        });
    });
});