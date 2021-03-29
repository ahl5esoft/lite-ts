import { json } from 'body-parser';
import express from 'express';
import { Server } from 'http';
import moment from 'moment';

import { APIFactory, IAPIPort } from '../../api';
import { TraceLogFactoryBase } from '../../log';

export class ExpressAPIPort implements IAPIPort {
    public static traceHeaderKey = '$trace';

    private m_Server: Server;

    public constructor(
        private m_APIFactory: APIFactory,
        private m_Project: string,
        private m_Port: number,
        private m_TraceLogFactory: TraceLogFactoryBase,
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
            const traceLog = await this.m_TraceLogFactory.build(req.headers[ExpressAPIPort.traceHeaderKey] as string);
            const span = await traceLog.createSpan();
            await span.begin(`${this.m_Project}/${req.params.endpoint}/${req.params.api}`);

            const api = this.m_APIFactory.build(req.params.endpoint, req.params.api);
            if (typeof req.body == 'string')
                req.body = JSON.parse(req.body);
            Object.keys(req.body || {}).forEach(r => {
                api[r] = req.body[r];
            });

            span.addLabel('body', req.body);

            const res = await api.getResposne();

            span.addLabel('resp', res);

            resp.json(res);

            await span.end();
        }).listen(...listenArgs);
    }
}