import { strictEqual } from 'assert';

import { Mock, NowTimeBase, StringGeneratorBase, Trace, TraceSpanBase } from '../../../src';

describe('src/runtime/trace.ts', () => {
    describe('.beginSpan(name: string, parentID: string): Promise<TraceSpanBase>', () => {
        it('parentID有效', async () => {
            const mockTraceSpan = new Mock<TraceSpanBase>();
            const mockNowTime = new Mock<NowTimeBase>();
            const mockStringGenerator = new Mock<StringGeneratorBase>();
            const traceID = 't-id';
            const self = new Trace(() => {
                return mockTraceSpan.actual;
            }, traceID, mockNowTime.actual, mockStringGenerator.actual);

            const spanName = 'span-name';
            mockTraceSpan.expected.addLabel('name', spanName);

            const spanParentID = 'span-parent';
            mockTraceSpan.expected.addLabel('parentID', spanParentID);

            const unixNano = 5 * 1000 * 1000;
            mockNowTime.expectReturn(
                r => r.unixNano(),
                unixNano
            );

            mockTraceSpan.expected.addLabel('beganOn', 5);

            mockTraceSpan.expected.addLabel('traceID', traceID);

            const span = await self.beginSpan(spanName, spanParentID);
            strictEqual(span, mockTraceSpan.actual);
        });

        it('parentID无效', async () => {
            const mockTraceSpan = new Mock<TraceSpanBase>();
            const mockNowTime = new Mock<NowTimeBase>();
            const mockStringGenerator = new Mock<StringGeneratorBase>();
            const traceID = 't-id';
            const self = new Trace(() => {
                return mockTraceSpan.actual;
            }, traceID, mockNowTime.actual, mockStringGenerator.actual);

            const spanName = 'span-name';
            mockTraceSpan.expected.addLabel('name', spanName);

            const unixNano = 5 * 1000 * 1000;
            mockNowTime.expectReturn(
                r => r.unixNano(),
                unixNano
            );

            mockTraceSpan.expected.addLabel('beganOn', 5);

            mockTraceSpan.expected.addLabel('traceID', traceID);

            const span = await self.beginSpan(spanName, '');
            strictEqual(span, mockTraceSpan.actual);
        });
    });
});