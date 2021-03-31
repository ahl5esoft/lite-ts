import { deepStrictEqual } from 'assert';
import { Logger } from 'log4js';

import { Mock, NowTimeBase, StringGeneratorBase, TraceBase } from '../../../../src';
import { TraceSpan } from '../../../../src/plugin/log4js/trace-span';

describe('src/plugin/log4js/trace-span.ts', () => {
    describe('.addLabel(key: string, value: any)', () => {
        it('ok', () => {
            const self = new TraceSpan(null, null, '', null, null);
            self.addLabel('k', 'v');

            const res = Reflect.get(self, 'm_Labels');
            deepStrictEqual(res, {
                k: 'v'
            });
        });
    });

    describe('.begin(name: string)', () => {
        it('ok', async () => {
            const mockNowTime = new Mock<NowTimeBase>();
            const self = new TraceSpan(null, mockNowTime.actual, '', null, null);

            const unixNano = 99;
            mockNowTime.expectReturn(
                r => r.unixNano(),
                unixNano * 1000 * 1000
            );

            await self.begin('test');

            const res = Reflect.get(self, 'm_Labels');
            deepStrictEqual(res, {
                name: 'test',
                beganOn: unixNano
            });
        });
    });

    describe('.end()', () => {
        it('ok', async () => {
            const mockLogger = new Mock<Logger>();
            const mockNowTime = new Mock<NowTimeBase>();
            const mockStringGenerator = new Mock<StringGeneratorBase>();
            const mockTrace = new Mock<TraceBase>();
            const self = new TraceSpan(mockLogger.actual, mockNowTime.actual, 'parent', mockStringGenerator.actual, mockTrace.actual);

            const unixNano = 999;
            mockNowTime.expectReturn(
                r => r.unixNano(),
                unixNano * 1000 * 1000
            );

            const spanID = 'span';
            mockStringGenerator.expectReturn(
                r => r.generate(),
                spanID
            );

            const traceID = 'trace';
            mockTrace.expectReturn(
                r => r.getID(),
                traceID
            );

            mockLogger.expected.trace({
                labels: {
                    endedOn: unixNano,
                },
                parentID: 'parent',
                spanID: spanID,
                traceID: traceID
            });

            await self.end();
        });
    });
});