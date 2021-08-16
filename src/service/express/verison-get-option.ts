import { Express } from 'express';

import { ExpressOption } from './option';
import { APIResponse } from '../../model/response';

export function expressVersionGetOption(version: string): ExpressOption {
    return function (app: Express) {
        app.get('/inside/version', (_: any, resp: any) => {
            let res = new APIResponse();
            res.data = version;
            resp.json(res);
        });
    }
}