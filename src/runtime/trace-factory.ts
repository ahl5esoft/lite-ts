import { Trace } from './trace';
import { TraceSpanBase } from './trace-span-base';
import { StringGeneratorBase } from '../object';
import { NowTimeBase } from '../time';

export class TraceFactory {
    public constructor(
        private m_CreateSpanFunc: () => TraceSpanBase,
        private m_NowTime: NowTimeBase,
        private m_StringGenerator: StringGeneratorBase,
    ) { }

    public build(traceID: string): Trace {
        return new Trace(this.m_CreateSpanFunc, traceID, this.m_NowTime, this.m_StringGenerator);
    }
}