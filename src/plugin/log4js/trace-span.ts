import { Logger } from 'log4js';

import { StringGeneratorBase } from '../../object';
import { Trace, TraceSpanBase } from '../../runtime';
import { NowTimeBase } from '../../time';

export class Log4JSTraceSpan extends TraceSpanBase {
    public constructor(
        private m_Logger: Logger,
        nowTime: NowTimeBase,
        stringGenerator: StringGeneratorBase,
        trace: Trace,
        name: string,
        parentID: string,
    ) {
        super(nowTime, stringGenerator, trace, name, parentID);
    }

    public async end() {
        this.m_Logger.trace(
            await this.getEntry()
        );
    }
}