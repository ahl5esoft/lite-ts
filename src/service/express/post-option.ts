import { validate } from 'class-validator';
import { Express, Request, Response } from 'express';
import { opentracing } from 'jaeger-client';

import { CustomError } from '../error';
import { TracerStrategy } from '../tracer';
import { IApi, IApiResponse, IApiSession, LogBase } from '../../contract';
import { enum_ } from '../../model';

/**
 * 创建post ExpressOption
 * 
 * @param log 日志
 * @param routeRule 路由规则
 * @param getApiFunc 获取api函数
 */
export function buildPostExpressOption(
    log: LogBase,
    routeRule: string,
    getApiFunc: (req: any) => Promise<IApi>,
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

            let res: IApiResponse = {
                data: null,
                err: 0,
            };
            try {
                const api = await getApiFunc(req);
                const session = api as any as IApiSession;
                if (session.initSession)
                    await session.initSession(req);

                Object.keys(api).forEach(r => {
                    api[r] = new TracerStrategy(api[r]).withTrace(span);
                });

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
                    throw new CustomError(enum_.ErrorCode.verify);
                }

                res.data = await api.call();
            } catch (ex) {
                if (ex instanceof CustomError) {
                    res.data = ex.data;
                    res.err = ex.code;
                } else {
                    res.err = enum_.ErrorCode.panic;
                    log.addLabel('route', req.path).error(ex);
                    span.log({
                        err: ex
                    });
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