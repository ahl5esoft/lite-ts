import { json } from 'body-parser';
import express from 'express';
import { Server } from 'http';
import moment from 'moment';

import { APIFactory, IAPIPort } from '../../api';
import { ITraceable, TraceFactory, traceKey, traceSpanKey } from '../../runtime';

export class ExpressAPIPort implements IAPIPort {
    private m_Server: Server;

    public constructor(
        private m_APIFactory: APIFactory,
        private m_Project: string,
        private m_Port: number,
        private m_TraceFactory: TraceFactory,
        private m_Version: string
    ) { }

    public close() {
        this.m_Server.close();
    }

    public async listen() {
        const listenArgs: any[] = [this.m_Port, () => {
            console.log(`${this.m_Project}(v${this.m_Version})[${moment().format('YYYY-MM-DD HH:mm:ss')}]: ${this.m_Port}`);
        }];
        if (process.platform == 'win32')
            listenArgs.splice(1, 0, '127.0.0.1');

        this.m_Server = express().use(
            json()
        ).post('/:endpoint/:api', async (req, resp) => {
            const trace = this.m_TraceFactory.build(req.headers[traceKey] as string);
            const traceSpan = await trace.beginSpan('express-api-port', req.headers[traceSpanKey] as string);
            traceSpan.addLabel('params', req.params);
            traceSpan.addLabel('body', req.body);

            const api = this.m_APIFactory.build(req.params.endpoint, req.params.api);
            for (const r of Object.keys(api)) {
                if (typeof api[r] == 'object' && 'traceID' in api[r] && 'traceSpanID' in api[r]) {
                    (api[r] as ITraceable).traceID = await trace.getID();
                    (api[r] as ITraceable).traceSpanID = await traceSpan.getID();
                } else if (r in req.body) {
                    api[r] = req.body[r];
                }
            }

            const res = await api.getResposne(traceSpan);
            resp.json(res);

            await traceSpan.end();
        }).listen(...listenArgs);
    }
}