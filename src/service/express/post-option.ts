import { validate } from 'class-validator';
import { Express, Request, Response } from 'express';
import { opentracing } from 'jaeger-client';

import { CustomError } from '../error';
import { TracerStrategy } from '../tracer';
import { CryptoBase, IApi, IApiSession, LogFactoryBase } from '../../contract';
import { contract, enum_ } from '../../model';

export function expressPostOption(
    authCrypto: CryptoBase,
    logFactory: LogFactoryBase,
    routeRule: string,
    getApiFunc: (req: Request) => Promise<IApi>,
    getAuthDataFunc: (req: Request, token: string) => Promise<any>,
) {
    return function (app: Express) {
        app.post(routeRule, async (req: Request, resp: Response) => {
            const tracer = opentracing.globalTracer();
            const tracerSpan = tracer.startSpan(req.path, {
                childOf: tracer.extract(opentracing.FORMAT_HTTP_HEADERS, req.headers),
                tags: {
                    [opentracing.Tags.SPAN_KIND]: opentracing.Tags.SPAN_KIND_RPC_SERVER,
                    [opentracing.Tags.HTTP_METHOD]: req.method,
                }
            });
            const log = logFactory.build().addLabel('route', req.path);

            let apiResp: contract.IApiResponse = {
                data: null,
                err: 0,
            };
            try {
                const authToken = req.header(enum_.Header.authToken);
                if (authToken && authCrypto) {
                    const userAuth = await getAuthDataFunc(req, authToken);
                    req.headers[enum_.Header.authData] = await authCrypto.encrypt(
                        JSON.stringify(userAuth)
                    );
                    req.headers[enum_.Header.authToken] = '';
                }

                const api = await getApiFunc(req);
                const session = api as any as IApiSession;
                if (session.initSession)
                    await session.initSession(req);

                Object.keys(api).forEach(r => {
                    api[r] = new TracerStrategy(api[r]).withTrace(tracerSpan);
                });

                for (const r of ['body', 'headers']) {
                    if (r in req) {
                        const keys = Object.keys(req[r]);
                        if (!keys.length)
                            continue;

                        if (r == 'body') {
                            Object.keys(req[r]).forEach(cr => {
                                if (cr in api)
                                    return;

                                api[cr] = req[r][cr];
                            });
                        }

                        log.addLabel(r, req[r]);
                        tracerSpan.log({
                            [r]: req[r],
                        });
                    }
                }

                const validationErrors = await validate(api);
                if (validationErrors.length) {
                    tracerSpan.log({
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

                    log.error(ex);
                    tracerSpan.log({
                        err: ex
                    });
                }

                tracerSpan.setTag(opentracing.Tags.ERROR, true);
            }
            finally {
                if (!apiResp.err)
                    log.addLabel('response', apiResp).info();

                tracerSpan.log({
                    result: apiResp
                });

                resp.json(apiResp);

                tracerSpan.finish();
            }
        });
    }
}