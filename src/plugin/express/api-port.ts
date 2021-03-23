import { json } from 'body-parser';
import express from 'express';
import { Server } from 'http';
import moment from 'moment';

import { APIFactory, IAPIPort } from '../../api';

export class ExpressAPIPort implements IAPIPort {
    private m_Server: Server;

    public constructor(
        private m_APIFactory: APIFactory,
        private m_Project: string,
        private m_Port: number,
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
            const api = this.m_APIFactory.build(req.params.endpoint, req.params.api);
            if (typeof req.body == 'string')
                req.body = JSON.parse(req.body);
            Object.keys(req.body || {}).forEach(r => {
                api[r] = req.body[r];
            });
            const res = await api.getResposne();
            resp.json(res);
        }).listen(...listenArgs);
    }
}