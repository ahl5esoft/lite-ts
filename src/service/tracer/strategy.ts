import { opentracing } from 'jaeger-client';
import { ITraceable } from '../../contract';

export class TracerStrategy<T> implements ITraceable<T> {
    public constructor(
        private m_Origin: T
    ) { }

    public withTrace(parentSpan: opentracing.Span) {
        const tracer = this.m_Origin as any as ITraceable<T>;
        return tracer.withTrace && parentSpan ? tracer.withTrace(parentSpan) : this.m_Origin;
    }
}