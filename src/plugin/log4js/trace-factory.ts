import { addLayout, configure, getLogger } from 'log4js';

import { Trace } from './trace';
import { StringGeneratorBase } from '../../object';
import { TraceBase, TraceFactoryBase } from '../../runtime';
import { NowTimeBase } from '../../time';

export class Log4JSTraceFactory extends TraceFactoryBase {
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

    public async build(traceID: string): Promise<TraceBase> {
        if (!traceID)
            traceID = await this.m_IDGenerator.generate();

        return new Trace(
            this.m_IDGenerator,
            getLogger(),
            this.m_NowTime,
            traceID
        );
    }
}