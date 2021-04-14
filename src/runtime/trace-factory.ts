import { Trace } from './trace';
import { TraceSpanBase } from './trace-span-base';
import { StringGeneratorBase } from '../object';

export class TraceFactory {
    public constructor(
        private m_StringGenerator: StringGeneratorBase,
        private m_CreateSpanFunc: (trace: Trace, name: string, parentID: string) => TraceSpanBase
    ) { }

    public build(traceID: string): Trace {
        return new Trace(this.m_StringGenerator, this.m_CreateSpanFunc, traceID);
    }
}