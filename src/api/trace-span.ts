import { APICallerBase } from './caller-base';
import { StringGeneratorBase } from '../object';
import { TraceSpanBase } from '../runtime';
import { NowTimeBase } from '../time';

export class APICallerTraceSpan extends TraceSpanBase {
    public constructor(
        private m_APICaller: APICallerBase,
        nowTime: NowTimeBase,
        stringGenerator: StringGeneratorBase
    ) {
        super(nowTime, stringGenerator);
    }

    protected async onEnd(labels: { [key: string]: any }) {
        await this.m_APICaller.setBody(labels).voidCall('lite-log/internal/add-trace-span');
    }
}