import { Logger } from 'log4js';

import { TraceSpan } from './trace-span';
import { StringGeneratorBase } from '../../object';
import { TraceBase, TraceSpanBase } from '../../runtime';
import { NowTimeBase } from '../../time';

export class Trace extends TraceBase {
    public constructor(
        stringGenerator: StringGeneratorBase,
        private m_Logger: Logger,
        private m_NowTime: NowTimeBase,
        traceID: string
    ) {
        super(stringGenerator, traceID);
    }

    public async createSpan(parentID: string): Promise<TraceSpanBase> {
        const traceID = await this.getID();
        return new TraceSpan(this.m_Logger, this.m_NowTime, parentID, this.stringGenerator, traceID);
    }
}