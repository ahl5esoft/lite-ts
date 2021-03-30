import { Logger } from 'log4js';

import { TraceLogSpanBase } from '../../log';
import { NowTimeBase } from '../../time';

export class TraceLogSpan extends TraceLogSpanBase {
    private m_Labels: { [key: string]: any; } = {};

    public constructor(
        private m_Logger: Logger,
        private m_NowTime: NowTimeBase,
        private m_ParentID: string,
        private m_SpanID: string,
        private m_TraceID: string
    ) {
        super();
    }

    public addLabel(key: string, value: any) {
        this.m_Labels[key] = value;
    }

    public async begin(name: string) {
        this.addLabel('name', name);

        const unixNano = await this.m_NowTime.unixNano();
        this.addLabel(
            'beganOn',
            Math.floor(unixNano / 1000 / 1000)
        );
    }

    public async end() {
        const unixNano = await this.m_NowTime.unixNano();
        this.addLabel(
            'endedOn',
            Math.floor(unixNano / 1000 / 1000)
        );

        this.m_Logger.trace({
            labels: this.m_Labels,
            parentID: this.m_ParentID,
            spanID: this.m_SpanID,
            traceID: this.m_TraceID,
        });
    }
}