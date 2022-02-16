import { validate } from 'class-validator';
import { Express, Request, Response } from 'express';
import { opentracing } from 'jaeger-client';

import { CustomError } from '..';
import { IApi, IApiResponse, ILog, ITraceable, model } from '../..';

/**
 * 创建post ExpressOption
 * 
 * @param routeRule 路由规则
 * @param buildLogFunc 创建log函数
 * @param getApiFunc 获取api函数
 */
export function buildPostExpressOption(
    routeRule: string,
    buildLogFunc: () => ILog,
    getApiFunc: (log: ILog, req: any) => Promise<IApi>,
) {
    return function (app: Express) {
        app.post(routeRule, async (req: Request, resp: Response) => {
            const tracer = opentracing.globalTracer();
            const span = tracer.startSpan(req.path, {
                childOf: tracer.extract(opentracing.FORMAT_HTTP_HEADERS, req.headers),
                tags: {
                    [opentracing.Tags.SPAN_KIND]: opentracing.Tags.SPAN_KIND_RPC_SERVER,
                    [opentracing.Tags.HTTP_METHOD]: req.method,
                }
            });
            span.log({
                headers: req.headers
            });

            const log = buildLogFunc();
            let res: IApiResponse = {
                data: null,
                err: 0,
            };
            try {
                let api = await getApiFunc(log, req);
                for (const r of Object.keys(api)) {
                    const childTracer = api[r] as ITraceable;
                    if (childTracer.withTrace)
                        api[r] = childTracer.withTrace(span);
                }

                if (req.body) {
                    span.log({
                        body: req.body
                    });
                    Object.keys(req.body).forEach(r => {
                        if (r in api)
                            return;

                        api[r] = req.body[r];
                    });
                }

                const validationErrors = await validate(api);
                if (validationErrors.length) {
                    span.log({
                        validate: validationErrors.map(r => {
                            return {
                                arg: r.property,
                                rules: r.constraints
                            };
                        })
                    });
                    throw new CustomError(model.enum_.ErrorCode.verify);
                }

                res.data = await api.call();
            } catch (ex) {
                if (ex instanceof CustomError) {
                    res.data = ex.data;
                    res.err = ex.code;
                } else {
                    res.err = model.enum_.ErrorCode.panic;
                    log.error(ex);
                }
                span.setTag(opentracing.Tags.ERROR, true);
            }
            finally {
                resp.json(res);
                span.log({
                    result: res
                }).finish();
            }
        });
    }
}