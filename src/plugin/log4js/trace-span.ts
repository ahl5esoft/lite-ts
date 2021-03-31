import { Logger } from 'log4js';
import { StringGeneratorBase } from '../../object';

import { TraceBase, TraceSpanBase } from '../../runtime';
import { NowTimeBase } from '../../time';

export class TraceSpan extends TraceSpanBase {
    private m_Labels: { [key: string]: any; } = {};

    public constructor(
        private m_Logger: Logger,
        private m_NowTime: NowTimeBase,
        private m_ParentID: string,
        stringGenerator: StringGeneratorBase,
        private m_Trace: TraceBase
    ) {
        super(stringGenerator);
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
            spanID: await this.getID(),
            traceID: await this.m_Trace.getID()
        });
    }
}