import { Server, ServerCredentials } from '@grpc/grpc-js';
import { validate } from 'class-validator';
import { opentracing } from 'jaeger-client';
import moment from 'moment';

import { getRpcProto } from './proto';
import { CustomError } from '../error';
import { TracerStrategy } from '../tracer';
import { ApiFactoryBase, IApiPort } from '../../contract';
import { contract, enum_ } from '../../model';

interface IRequset {
    api: string;
    app: string;
    endpoint: string;
    header: { [key: string]: string };
    body: { [key: string]: any };
}

export class GrpcJsApiPort implements IApiPort {
    public constructor(
        private m_ApiFactory: ApiFactoryBase,
        private m_Port: number,
        private m_Project: string,
        private m_Version: string,
        private m_ProtoFilePath: string,
    ) { }

    public async listen() {
        const server = new Server();

        const proto = getRpcProto(this.m_ProtoFilePath);
        server.addService(proto.RpcService.service, {
            call: async (msg: any, callback: any) => {
                let tracerSpan: opentracing.Span;
                let apiResp: contract.IApiResponse = {
                    data: null,
                    err: 0,
                };
                try {
                    const req = JSON.parse(msg.request.json) as IRequset;
                    const tracer = opentracing.globalTracer();
                    const parentSpan = tracer.extract(opentracing.FORMAT_HTTP_HEADERS, req.header);
                    tracerSpan = tracer.startSpan(
                        ['', req.app, req.endpoint, req.api].join('/'),
                        {
                            childOf: parentSpan,
                            tags: {
                                [opentracing.Tags.SPAN_KIND]: opentracing.Tags.SPAN_KIND_RPC_CLIENT,
                                [opentracing.Tags.HTTP_METHOD]: 'gRpc',
                            }
                        }
                    );

                    const api = this.m_ApiFactory.build(req.endpoint, req.api);
                    Object.keys(api).forEach(r => {
                        api[r] = new TracerStrategy(api[r]).withTrace(tracerSpan);
                    });

                    Object.keys(req.body).forEach(r => {
                        if (r in api)
                            return;

                        api[r] = req.body[r];
                    });

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
                }
                catch (ex) {
                    if (ex instanceof CustomError) {
                        apiResp.data = ex.data;
                        apiResp.err = ex.code;
                    } else {
                        apiResp.err = enum_.ErrorCode.panic;

                        tracerSpan.log({
                            err: ex
                        });
                    }

                    tracerSpan?.setTag?.(opentracing.Tags.ERROR, true);
                } finally {
                    callback(null, {
                        json: JSON.stringify(apiResp)
                    });

                    tracerSpan.finish();
                }
            }
        });
        await new Promise<void>((s, f) => {
            server.bindAsync(
                `0.0.0.0:${this.m_Port}`,
                ServerCredentials.createInsecure(),
                err => {
                    if (err)
                        return f(err);

                    s();
                }
            );
        });

        console.log(`grpcjs >> ${this.m_Project}(v${this.m_Version})[${moment().format('YYYY-MM-DD HH:mm:ss')}]: ${this.m_Port}`);
        server.start();
    }
}