import { TraceSpanBase } from './trace-span-base';
import { StringGeneratorBase } from '../object';

export class Trace {
    public constructor(
        private m_StringGenerator: StringGeneratorBase,
        private m_CreateSpanFunc: (trace: Trace, name: string, parentID: string) => TraceSpanBase,
        private m_ID: string,
    ) { }

    public async beginSpan(name: string, parentID: string): Promise<TraceSpanBase> {
        const span = this.m_CreateSpanFunc(this, name, parentID);
        await span.begin();
        return span;
    }

    public async getID(): Promise<string> {
        if (!this.m_ID)
            this.m_ID = await this.m_StringGenerator.generate();

        return this.m_ID;
    }
}