import { opentracing } from 'jaeger-client';

import { RpcBase } from '../../contract';

/**
 * 包装器
 */
export class TracerRpc extends RpcBase {
    /**
     * 跟踪
     */
    private m_Tracer = opentracing.globalTracer();
    /**
     * 跟踪范围
     */
    private m_TracerSpan: opentracing.Span;

    /**
     * 构造函数
     * 
     * @param m_Rpc 远程过程调用
     * @param tracerSpan 父跟踪范围
     */
    public constructor(
        private m_Rpc: RpcBase,
        tracerSpan: opentracing.Span,
    ) {
        super();

        this.m_TracerSpan = tracerSpan ? this.m_Tracer.startSpan('rpc', {
            childOf: tracerSpan,
        }) : null;
    }

    /**
     * 调用
     * 
     * @param route 路由
     */
    public call<T>(route: string) {
        this.m_TracerSpan?.log?.({
            route: route
        });

        try {
            return this.m_Rpc.call<T>(route);
        } finally {
            this.m_TracerSpan?.finish?.();
        }
    }

    /**
     * 调用
     * 
     * @param route 路由
     */
    public async callWithoutThrow<T>(route: string) {
        this.m_TracerSpan?.log?.({
            route: route
        });

        const resp = await this.m_Rpc.callWithoutThrow<T>(route);

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

    /**
     * 设置body
     * 
     * @param v 值
     */
    public setBody(v: any) {
        this.m_Rpc.setBody(v);

        this.m_TracerSpan?.log?.({
            body: v
        });

        return this;
    }

    /**
     * 设置请求头
     * 
     * @param v 值
     */
    public setHeader(v: { [key: string]: string; }) {
        if (this.m_TracerSpan)
            this.m_Tracer.inject(this.m_TracerSpan, opentracing.FORMAT_HTTP_HEADERS, v);

        this.m_Rpc.setHeader(v);

        this.m_TracerSpan?.log?.({
            header: v
        });

        return this;
    }
}