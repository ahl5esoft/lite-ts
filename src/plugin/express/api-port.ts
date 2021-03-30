import { json } from 'body-parser';
import express from 'express';
import { Server } from 'http';
import moment from 'moment';

import { APIFactory, IAPIPort } from '../../api';
import { ITraceable, TraceFactoryBase, traceKey, traceSpanKey } from '../../runtime';

export class ExpressAPIPort implements IAPIPort {
    private m_Server: Server;

    public constructor(
        private m_APIFactory: APIFactory,
        private m_Project: string,
        private m_Port: number,
        private m_TraceFactory: TraceFactoryBase,
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
            const traceID = req.headers[traceKey] as string;
            const trace = await this.m_TraceFactory.build(traceID);
            const traceSpanID = req.headers[traceSpanKey] as string;
            const traceSpan = await trace.createSpan(traceSpanID);
            await traceSpan.begin(`${this.m_Project}/${req.params.endpoint}/${req.params.api}`);

            const api = this.m_APIFactory.build(req.params.endpoint, req.params.api);
            if (typeof req.body == 'string')
                req.body = JSON.parse(req.body);
            Object.keys(req.body || {}).forEach(r => {
                api[r] = req.body[r];
            });

            traceSpan.addLabel('body', req.body);

            const res = await api.getResposne();

            Object.values(api).forEach(r => {
                if ('traceID' in r && 'traceSpanID' in r) {
                    (r as ITraceable).traceID = traceID;
                    (r as ITraceable).traceSpanID = traceSpanID;
                }
            });

            traceSpan.addLabel('resp', res);

            resp.json(res);

            await traceSpan.end();
        }).listen(...listenArgs);
    }
}