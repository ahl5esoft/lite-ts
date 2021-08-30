import { Express } from 'express';

import { ExpressOption } from './option';
import { IAPIResponse } from '../../contract';

export function expressVersionGetOption(version: string): ExpressOption {
    return function (app: Express) {
        app.get('/inside/version', (_: any, resp: any) => {
            resp.json({
                data: version,
                err: 0,
            } as IAPIResponse);
        });
    }
}