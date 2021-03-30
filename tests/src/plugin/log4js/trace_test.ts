import { strictEqual } from 'assert';

import { Mock, StringGeneratorBase } from '../../../../src';
import { Trace } from '../../../../src/plugin/log4js/trace';

describe('src/plugin/log4js/trace.ts', () => {
    describe('.startSpan(parentID?: string): Promise<TraceLogSpanBase>', () => {
        it('ok', async () => {
            const mockIDGenerator = new Mock<StringGeneratorBase>();
            const self = new Trace(mockIDGenerator.actual, null, null, 'trace');

            const spanID = 'span';
            mockIDGenerator.expectReturn(
                r => r.generate(),
                spanID
            );

            const span = await self.createSpan('p');
            strictEqual(
                Reflect.get(span, 'm_SpanID'),
                spanID
            );
            strictEqual(
                Reflect.get(span, 'm_ParentID'),
                'p'
            );
            strictEqual(
                Reflect.get(span, 'm_TraceID'),
                'trace'
            );
        });
    });
});