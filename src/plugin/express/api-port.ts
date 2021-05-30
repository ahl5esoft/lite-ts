import express from 'express';

import {  IAPIPort } from '../../api';7
import { ExpressOption } from './option';

export class ExpressAPIPort implements IAPIPort {   
    public constructor(
        private m_Options: ExpressOption[]
    ) { }

    public async listen() {
        const app = express();
        for (let r of this.m_Options)
            r(app);
        // this.m_Server = express().use(
        //     json()
        // ).post('/:endpoint/:api', async (req, resp) => {
        //     const trace = this.m_TraceFactory.build(req.headers[traceKey] as string);
        //     const traceSpan = await trace.beginSpan('express-api-port', req.headers[traceSpanKey] as string);
        //     traceSpan.addLabel('params', req.params);
        //     traceSpan.addLabel('body', req.body);

        //     const api = this.m_APIFactory.build(req.params.endpoint, req.params.api);
        //     for (const r of Object.keys(api)) {
        //         if (typeof api[r] == 'object' && 'traceID' in api[r] && 'traceSpanID' in api[r]) {
        //             (api[r] as ITraceable).traceID = await trace.getID();
        //             (api[r] as ITraceable).traceSpanID = await traceSpan.getID();
        //         } else if (r in req.body) {
        //             api[r] = req.body[r];
        //         }
        //     }

        //     const res = await api.getResposne(traceSpan);
        //     resp.json(res);

        //     await traceSpan.end();
        // }).listen(...this.m_ListenArgs);
    }
}