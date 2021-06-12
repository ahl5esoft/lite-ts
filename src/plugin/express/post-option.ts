import { Express } from 'express';

import { ExpressOption } from './option';
import { APIFactory, APIOption, APIResponse } from '../../api';
import { CustomError, ErrorCode } from '../../error';
import { LogFactory } from '../../log';

export function expressPostOption(apiFactory: APIFactory, logFactory: LogFactory, ...options: APIOption[]): ExpressOption {
    return function (app: Express) {
        app.post('/:endpoint/:api', async (req, resp) => {
            let api = apiFactory.build(req.params.endpoint, req.params.api);
            let res = new APIResponse();
            try {
                for (const r of options)
                    await r(api, req);

                res.data = await api.call();
            } catch (ex) {
                if (ex instanceof CustomError) {
                    res.err = ex.code;
                    if (ex.code == ErrorCode.Custom)
                        res.data = ex.data;
                } else {
                    res.err = ErrorCode.Panic;
                    logFactory.build().title('express-post').desc(req.path).error(ex);
                }
            }
            resp.json(res);
        });
    }
}