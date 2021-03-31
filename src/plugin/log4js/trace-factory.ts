import { addLayout, configure, getLogger } from 'log4js';

import { Trace } from './trace';
import { StringGeneratorBase } from '../../object';
import { TraceBase, TraceFactoryBase } from '../../runtime';
import { NowTimeBase } from '../../time';

export class Log4JSTraceFactory extends TraceFactoryBase {
    public constructor(
        private m_StringGenerator: StringGeneratorBase,
        private m_NowTime: NowTimeBase
    ) {
        super();

        addLayout('json', () => {
            return e => {
                return JSON.stringify(e.data[0]);
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

    public build(traceID: string): TraceBase {
        return new Trace(
            this.m_StringGenerator,
            getLogger(),
            this.m_NowTime,
            traceID
        );
    }
}