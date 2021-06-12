import { Express } from 'express';

import { ExpressOption } from './option';
import { APIResponse } from '../../api';

export function expressGetVersionOption(version: string): ExpressOption {
    return function (app: Express) {
        app.get('/open/get-version', (_, resp) => {
            let res = new APIResponse();
            res.data = version;
            resp.json(res);
        });
    }
}