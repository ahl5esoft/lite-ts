import { deepStrictEqual } from 'assert';
import { Logger } from 'log4js';

import { Mock, NowTimeBase } from '../../../../src';
import { TraceLogSpan } from '../../../../src/plugin/log4js/trace-log-span';

describe('src/plugin/log4js/trace-log-span.ts', () => {
    describe('.addLabel(key: string, value: any)', () => {
        it('ok', () => {
            const self = new TraceLogSpan(null, null, '', '', '');
            self.addLabel('k', 'v');

            const res = Reflect.get(self, 'm_Labels');
            deepStrictEqual(res, {
                k: 'v'
            });
        });
    });

    describe('.begin(action: string)', () => {
        it('ok', async () => {
            const mockNowTime = new Mock<NowTimeBase>();
            const self = new TraceLogSpan(null, mockNowTime.actual, '', '', '');

            const nowUnix = 99;
            mockNowTime.expectReturn(
                r => r.unix(),
                nowUnix
            );

            await self.begin('test');

            const res = Reflect.get(self, 'm_Labels');
            deepStrictEqual(res, {
                action: 'test',
                beganOn: nowUnix
            });
        });
    });

    describe('.end()', () => {
        it('ok', async () => {
            const mockLogger = new Mock<Logger>();
            const mockNowTime = new Mock<NowTimeBase>();
            const self = new TraceLogSpan(mockLogger.actual, mockNowTime.actual, 'parent', 'span', 'trace');

            const nowUnix = 999;
            mockNowTime.expectReturn(
                r => r.unix(),
                nowUnix
            );

            mockLogger.expected.trace({
                labels: {
                    endedOn: nowUnix,
                },
                parentID: 'parent',
                spanID: 'span',
                traceID: 'trace'
            });

            await self.end();
        });
    });
});