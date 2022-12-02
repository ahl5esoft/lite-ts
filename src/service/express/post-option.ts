import { validate } from 'class-validator';
import { Express, Request, Response } from 'express';
import { opentracing } from 'jaeger-client';

import { CustomError } from '../error';
import { TracerStrategy } from '../tracer';
import { IApi, IApiSession, LogBase } from '../../contract';
import { contract, enum_ } from '../../model';

/**
 * 创建post ExpressOption
 * 
 * @param log 日志
 * @param routeRule 路由规则
 * @param getApiFunc 获取api函数
 * @param logFilterFunc 日志过滤函数
 */
export function buildPostExpressOption(
    log: LogBase,
    routeRule: string,
    getApiFunc: (req: any) => Promise<IApi>,
    logFilterFunc?: (route: string) => boolean,
) {
    return function (app: Express) {
        app.post(routeRule, async (req: Request, resp: Response) => {
            const tracer = opentracing.globalTracer();
            const parentSpan = tracer.extract(opentracing.FORMAT_HTTP_HEADERS, req.headers);
            const tracerSpan = parentSpan ? tracer.startSpan(req.path, {
                childOf: parentSpan,
                tags: {
                    [opentracing.Tags.SPAN_KIND]: opentracing.Tags.SPAN_KIND_RPC_SERVER,
                    [opentracing.Tags.HTTP_METHOD]: req.method,
                }
            }) : null;

            const cLog = log.addLabel('route', req.path);

            let apiResp: contract.IApiResponse = {
                data: null,
                err: 0,
            };
            try {
                const api = await getApiFunc(req);
                const session = api as any as IApiSession;
                if (session.initSession)
                    await session.initSession(req);

                Object.keys(api).forEach(r => {
                    api[r] = new TracerStrategy(api[r]).withTrace(tracerSpan);
                });

                for (const r of ['body', 'headers']) {
                    if (r in req) {
                        if (r == 'body') {
                            Object.keys(req.body).forEach(r => {
                                if (r in api)
                                    return;

                                api[r] = req.body[r];
                            });
                        }

                        cLog.addLabel(r, req[r]);
                        tracerSpan?.log?.({
                            [r]: req[r],
                        });
                    }
                }

                const validationErrors = await validate(api);
                if (validationErrors.length) {
                    tracerSpan?.log?.({
                        validate: validationErrors.map(r => {
                            return {
                                arg: r.property,
                                rules: r.constraints
                            };
                        })
                    });
                    throw new CustomError(enum_.ErrorCode.verify);
                }

                apiResp.data = await api.call();
            } catch (ex) {
                if (ex instanceof CustomError) {
                    apiResp.data = ex.data;
                    apiResp.err = ex.code;
                } else {
                    apiResp.err = enum_.ErrorCode.panic;

                    cLog.error(ex);
                    tracerSpan?.log?.({
                        err: ex
                    });
                }

                tracerSpan?.setTag?.(opentracing.Tags.ERROR, true);
            } finally {
                if (!apiResp.err) {
                    if (!logFilterFunc || !logFilterFunc(req.path))
                        cLog.addLabel('response', apiResp).info();
                }

                tracerSpan?.log?.({
                    result: apiResp
                });

                resp.json(apiResp);

                tracerSpan?.finish?.();
            }
        });
    };
}