import { addLayout, configure, getLogger } from 'log4js';

import { TraceLog } from './trace-log';
import { TraceLogBase, TraceLogFactoryBase } from '../../log';
import { StringGeneratorBase } from '../../object';
import { NowTimeBase } from '../../time';

export class Log4JSTraceLogFactory extends TraceLogFactoryBase {
    public constructor(
        private m_IDGenerator: StringGeneratorBase,
        private m_NowTime: NowTimeBase
    ) {
        super();

        addLayout('json', () => {
            return e => {
                return JSON.stringify(e.data);
            };
        });
        configure({
            appenders: {
                out: {
                    alwaysIncludePattern: true,
                    filename: 'log/trace',
                    layout: {
                        type: 'json',
                    },
                    pattern: '.yyyy-MM-dd',
                    type: 'dateFile',
                }
            },
            categories: {
                default: {
                    appenders: ['out'],
                    level: 'trace'
                }
            }
        });
    }

    public async build(traceID: string): Promise<TraceLogBase> {
        if (!traceID)
            traceID = await this.m_IDGenerator.generate();

        return new TraceLog(
            this.m_IDGenerator,
            getLogger(),
            this.m_NowTime,
            traceID
        );
    }
}