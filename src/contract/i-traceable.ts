import { opentracing } from 'jaeger-client';

export interface ITraceable<T> {
    withTrace(parentSpan: opentracing.Span): T;
}