import { Logger } from 'log4js';

import { TraceSpan } from './trace-span';
import { StringGeneratorBase } from '../../object';
import { TraceBase, TraceSpanBase } from '../../runtime';
import { NowTimeBase } from '../../time';

export class Trace extends TraceBase {
    public constructor(
        private m_IDGenerator: StringGeneratorBase,
        private m_Logger: Logger,
        private m_NowTime: NowTimeBase,
        private m_TraceID: string
    ) {
        super();
    }

    public async createSpan(parentID: string): Promise<TraceSpanBase> {
        const spanID = await this.m_IDGenerator.generate();
        return new TraceSpan(this.m_Logger, this.m_NowTime, parentID, spanID, this.m_TraceID);
    }
}