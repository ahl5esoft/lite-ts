import { APICallerBase, Mock, TraceableAPICaller, TraceBase, TraceFactoryBase, TraceSpanBase } from '../../../src';
import { traceKey, traceSpanKey } from '../../../src/runtime/trace-base';

describe('src/api/traceable-caller.ts', () => {
    describe('.call<T>(route: string, ms?: number): Promise<T>', () => {
        it('ok', async () => {
            const mockAPICaller = new Mock<APICallerBase>();
            const mockTraceFactory = new Mock<TraceFactoryBase>();
            const self = new TraceableAPICaller(mockAPICaller.actual, mockTraceFactory.actual);
            self.traceID = 'trace-id';
            self.traceSpanID = 'span-id';

            const route = 'route';
            const ms = 100;
            const mockTrace = new Mock<TraceBase>();
            mockTraceFactory.expectReturn(
                r => r.build(self.traceID),
                mockTrace.actual
            );

            mockTrace.expectReturn(
                r => r.getID(),
                self.traceID
            );

            const mockTraceSpan = new Mock<TraceSpanBase>();
            mockTrace.expectReturn(
                r => r.createSpan(self.traceSpanID),
                mockTraceSpan.actual
            );

            const spanID = 'call-span-id';
            mockTraceSpan.expectReturn(
                r => r.getID(),
                spanID
            );

            mockTraceSpan.expected.begin('api-caller');

            mockTraceSpan.expected.addLabel('action', 'call');

            mockTraceSpan.expected.addLabel('route', route);

            mockAPICaller.expectReturn(
                r => r.setHeaders({
                    [traceKey]: self.traceID,
                    [traceSpanKey]: spanID
                }),
                mockAPICaller.actual
            );

            mockAPICaller.expectReturn(
                r => r.setBody({}),
                mockAPICaller.actual
            );

            mockAPICaller.expectReturn(
                r => r.call(route, ms),
                {
                    finally: cb => {
                        cb();
                    }
                }
            );

            mockTraceSpan.expectReturn(
                r => r.end(),
                {
                    catch: () => { }
                }
            );

            await self.call(route, ms);
        });
    });

    describe('.voidCall(route: string)', () => {
        it('ok', async () => {
            const mockAPICaller = new Mock<APICallerBase>();
            const mockTraceFactory = new Mock<TraceFactoryBase>();
            const self = new TraceableAPICaller(mockAPICaller.actual, mockTraceFactory.actual);
            self.traceID = 'trace-id';
            self.traceSpanID = 'span-id';

            const route = 'route';
            const mockTrace = new Mock<TraceBase>();
            mockTraceFactory.expectReturn(
                r => r.build(self.traceID),
                mockTrace.actual
            );

            mockTrace.expectReturn(
                r => r.getID(),
                self.traceID
            );

            const mockTraceSpan = new Mock<TraceSpanBase>();
            mockTrace.expectReturn(
                r => r.createSpan(self.traceSpanID),
                mockTraceSpan.actual
            );

            const spanID = 'call-span-id';
            mockTraceSpan.expectReturn(
                r => r.getID(),
                spanID
            );

            mockTraceSpan.expected.begin('api-caller');

            mockTraceSpan.expected.addLabel('action', 'voidCall');

            mockTraceSpan.expected.addLabel('route', route);

            mockAPICaller.expectReturn(
                r => r.setHeaders({
                    [traceKey]: self.traceID,
                    [traceSpanKey]: spanID
                }),
                mockAPICaller.actual
            );

            mockAPICaller.expectReturn(
                r => r.setBody({}),
                mockAPICaller.actual
            );

            mockAPICaller.expectReturn(
                r => r.voidCall(route),
                {
                    finally: cb => {
                        cb();
                    }
                }
            );

            mockTraceSpan.expectReturn(
                r => r.end(),
                {
                    catch: () => { }
                }
            );

            await self.voidCall(route);
        });
    });
});