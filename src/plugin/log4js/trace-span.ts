import { Logger } from 'log4js';

import { StringGeneratorBase } from '../../object';
import { TraceSpanBase } from '../../runtime';
import { NowTimeBase } from '../../time';

export class Log4JSTraceSpan extends TraceSpanBase {
    public constructor(
        private m_Logger: Logger,
        nowTime: NowTimeBase,
        stringGenerator: StringGeneratorBase,
    ) {
        super(nowTime, stringGenerator);
    }

    public async onEnd(labels: { [key: string]: any }) {
        this.m_Logger.trace(labels);
    }
}