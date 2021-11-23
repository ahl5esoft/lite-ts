import { validate } from 'class-validator';
import { Express } from 'express';

import { IApi, IApiResponse, ILog, model, service } from '../..';

export function buildPostExpressOption(
    routeRule: string,
    buildLogFunc: () => ILog,
    getApiFunc: (log: ILog, req: any) => Promise<IApi>,
): service.ExpressOption {
    return function (app: Express) {
        app.post(routeRule, async (req: any, resp: any) => {
            const log = buildLogFunc();
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
                    throw new service.CustomError(model.enum_.ErrorCode.verify);
                }

                res.data = await api.call();
            } catch (ex) {
                if (ex instanceof service.CustomError) {
                    res.data = ex.data;
                    res.err = ex.code;
                } else {
                    res.err = model.enum_.ErrorCode.panic;
                    log.error(ex);
                }
            }
            resp.json(res);
        });
    }
}