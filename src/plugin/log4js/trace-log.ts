import { Logger } from 'log4js';

import { TraceLogSpan } from './trace-log-span';
import { TraceLogBase, TraceLogSpanBase } from '../../log';
import { StringGeneratorBase } from '../../object';
import { NowTimeBase } from '../../time';

export class TraceLog extends TraceLogBase {
    public constructor(
        private m_IDGenerator: StringGeneratorBase,
        private m_Logger: Logger,
        private m_NowTime: NowTimeBase,
        private m_TraceID: string
    ) {
        super();
    }

    public async createSpan(parentID?: string): Promise<TraceLogSpanBase> {
        const spanID = await this.m_IDGenerator.generate();
        return new TraceLogSpan(this.m_Logger, this.m_NowTime, parentID, spanID, this.m_TraceID);
    }
}