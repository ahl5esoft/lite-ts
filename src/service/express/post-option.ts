import { validate } from 'class-validator';
import { Express } from 'express';

import { ExpressOption } from './option';
import { CustomError } from '../error';
import { IApi, IApiResponse, ILog, LogFactoryBase } from '../..';
import { enum_ } from '../../model';

export function buildPostExpressOption(
    logFactory: LogFactoryBase,
    getApiFunc: (log: ILog, req: any) => Promise<IApi>
): ExpressOption {
    return function (app: Express) {
        app.post('/:endpoint/:api', async (req: any, resp: any) => {
            const log = logFactory.build().addLabel('route', req.path);
            let res: IApiResponse = {
                data: null,
                err: 0,
            };
            try {
                let api = await getApiFunc(log, req);
                if (req.body) {
                    Object.keys(req.body).forEach(r => {
                        if (r in api)
                            return;

                        api[r] = req.body[r];
                    });
                }

                const validationErrors = await validate(api);
                if (validationErrors.length) {
                    log.addLabel('validate', validationErrors);
                    throw new CustomError(enum_.ErrorCode.verify);
                }

                res.data = await api.call();
            } catch (ex) {
                if (ex instanceof CustomError) {
                    res.data = ex.data;
                    res.err = ex.code;
                } else {
                    res.err = enum_.ErrorCode.panic;
                    log.error(ex);
                }
            }
            resp.json(res);
        });
    }
}