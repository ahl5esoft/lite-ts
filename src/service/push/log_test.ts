import { PushLog as Self } from './log';
import { Mock } from '..';
import { IPush } from '../..';

describe('src/service/push/log.ts', () => {
    describe('.error(err: Error)', () => {
        it('ok', () => {
            const mockPush = new Mock<IPush>();

            const err = new Error('堆栈');
            mockPush.expected.push(
                [
                    '- 标题: 异常',
                    '- k: v',
                    `> ${err.message}`,
                    `> ${err.stack}`
                ].join('\n')
            );

            const self = new Self(mockPush.actual);
            self.addLabel('标题', '异常').addLabel('k', 'v').error(err);
        });
    });
});