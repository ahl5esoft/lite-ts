import { TraceSpanBase } from './trace-span-base';
import { StringGeneratorBase } from '../object';
import { NowTimeBase } from '../time';

export class Trace {
    public constructor(
        private m_CreateSpanFunc: () => TraceSpanBase,
        private m_ID: string,
        private m_NowTime: NowTimeBase,
        private m_StringGenerator: StringGeneratorBase,
    ) { }

    public async beginSpan(name: string, parentID: string): Promise<TraceSpanBase> {
        const span = this.m_CreateSpanFunc();
        span.addLabel('name', name);
        if (parentID)
            span.addLabel('parentID', parentID);
        const unixNano = await this.m_NowTime.unixNano();
        span.addLabel(
            'beganOn',
            Math.floor(unixNano / 1000 / 1000)
        );
        span.addLabel(
            'traceID',
            await this.getID()
        );
        return span;
    }

    public async getID(): Promise<string> {
        if (!this.m_ID)
            this.m_ID = await this.m_StringGenerator.generate();

        return this.m_ID;
    }
}