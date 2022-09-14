import { opentracing } from 'jaeger-client';

import { ITraceable, RpcBase } from '../../contract';

/**
 * 包装器
 */
export class TracerRpc extends RpcBase implements ITraceable<RpcBase> {
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
     * @param m_BuildRpcFunc 创建rpc函数
     * @param tracerSpan 父跟踪范围
     */
    public constructor(
        private m_BuildRpcFunc: () => RpcBase,
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
    public async callWithoutThrow<T>(route: string) {
        this.header ??= {};

        if (this.m_TracerSpan) {
            this.m_TracerSpan.log({
                route: route
            });
            this.m_Tracer.inject(this.m_TracerSpan, opentracing.FORMAT_HTTP_HEADERS, this.header);
        }

        const resp = await this.m_BuildRpcFunc().setBody(this.body).setHeader(this.header).callWithoutThrow<T>(route);

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
        super.setBody(v);

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
        super.setHeader(v);

        this.m_TracerSpan?.log?.({
            header: v
        });

        return this;
    }

    /**
     * 跟踪
     * 
     * @param parentSpan 父范围
     */
    public withTrace(parentSpan: any) {
        return parentSpan ? new TracerRpc(this.m_BuildRpcFunc, parentSpan) : this;
    }
}