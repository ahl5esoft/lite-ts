import { deepStrictEqual } from 'assert';

import { Mock, NowTimeBase, StringGeneratorBase, TraceSpanBase } from '../../../src';

class TestTraceSpan extends TraceSpanBase {
    public labels: { [key: string]: any } = {};

    protected async onEnd(labels: { [key: string]: any }) {
        this.labels = labels;
    }
}

describe('src/runtime/trace-span-base.ts', () => {
    describe('.addLabel(key: string, value: any)', () => {
        it('ok', () => {
            const self = new TestTraceSpan(null, null);
            self.addLabel('k', 'v');

            const res = Reflect.get(self, 'm_Labels');
            deepStrictEqual(res, {
                k: 'v'
            });
        });
    });

    describe('.end()', () => {
        it('ok', async () => {
            const mockNowTime = new Mock<NowTimeBase>();
            const mockStringGenerator = new Mock<StringGeneratorBase>();

            const unixNano = 8 * 1000 * 1000;
            mockNowTime.expectReturn(
                r => r.unixNano(),
                unixNano
            );

            const id = 'id';
            mockStringGenerator.expectReturn(
                r => r.generate(),
                id
            );

            const self = new TestTraceSpan(mockNowTime.actual, mockStringGenerator.actual);
            await self.end();

            const res = Reflect.get(self, 'm_Labels');
            deepStrictEqual(res, {
                endedOn: 8,
                id: id
            });
            deepStrictEqual(res, self.labels);
        });
    });
});