import { opentracing } from 'jaeger-client';

import { IRpcCallOption, ITraceable, RpcBase } from '../../contract';

export class JaegerClientRpc extends RpcBase implements ITraceable<RpcBase> {
    private m_Tracer = opentracing.globalTracer();
    private m_TracerSpan: opentracing.Span;

    public constructor(
        private m_BuildRpcFunc: () => RpcBase,
        tracerSpan: opentracing.Span,
    ) {
        super();

        this.m_TracerSpan = tracerSpan ? this.m_Tracer.startSpan('rpc', {
            childOf: tracerSpan,
        }) : null;
    }

    public async callWithoutThrow<T>(v: IRpcCallOption) {
        v.header ??= {};

        if (this.m_TracerSpan) {
            this.m_TracerSpan.log(v);
            this.m_Tracer.inject(this.m_TracerSpan, opentracing.FORMAT_HTTP_HEADERS, v.header);
        }

        const resp = await this.m_BuildRpcFunc().callWithoutThrow<T>(v);

        if (this.m_TracerSpan) {
            this.m_TracerSpan.log({
                result: resp
            });
            if (resp.err)
                this.m_TracerSpan.setTag(opentracing.Tags.ERROR, true);

            this.m_TracerSpan.finish();
        }

        return resp;
    }

    public withTrace(parentSpan: any) {
        return parentSpan ? new JaegerClientRpc(this.m_BuildRpcFunc, parentSpan) : this;
    }
}