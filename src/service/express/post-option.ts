import { Express } from 'express';

import { ExpressOption } from './option';
import { APIFactory, APIOption } from '../api';
import { DefaultLogFactory } from '../default';
import { CustomError } from '../error';
import { IAPIResponse } from '../../contract';
import { enum_ } from '../../model';

export function expressPostOption(apiFactory: APIFactory, logFactory: DefaultLogFactory, ...options: APIOption[]): ExpressOption {
    return function (app: Express) {
        app.post('/:endpoint/:api', async (req: any, resp: any) => {
            let res: IAPIResponse = {
                data: null,
                err: 0,
            };
            try {
                let api = apiFactory.build(req.params.endpoint, req.params.api);
                for (const r of options)
                    await r(api, req);

                res.data = await api.call();
            } catch (ex) {
                if (ex instanceof CustomError) {
                    res.data = ex.data;
                    res.err = ex.code;
                } else {
                    res.err = enum_.ErrorCode.panic;
                    logFactory.build().addLabel('path', req.path).error(ex);
                }
            }
            resp.json(res);
        });
    }
}