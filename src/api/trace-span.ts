import { APICallerBase } from './caller-base';
import { StringGeneratorBase } from '../object';
import { Trace, TraceSpanBase } from '../runtime';
import { NowTimeBase } from '../time';

export class APICallerTraceSpan extends TraceSpanBase {
    public constructor(
        private m_APICaller: APICallerBase,
        nowTime: NowTimeBase,
        stringGenerator: StringGeneratorBase,
        trace: Trace,
        name: string,
        parentID: string
    ) {
        super(nowTime, stringGenerator, trace, name, parentID);
    }

    public async end() {
        const entry = await this.getEntry();
        await this.m_APICaller.setBody(entry).voidCall('lite-log/server/add-trace-span');
    }
}