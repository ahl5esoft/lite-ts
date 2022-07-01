import bent from 'bent';
import { opentracing } from 'jaeger-client';

import { BentDefaultRpc } from './default-rpc';

/**
 * 包装器
 */
export class BentTracerRpc extends BentDefaultRpc {
    /**
     * 构造函数
     * 
     * @param m_Tracer 跟踪
     * @param m_TracerSpan 父跟踪范围
     * @param postFunc 请求函数
     */
    public constructor(
        private m_Tracer: opentracing.Tracer,
        private m_TracerSpan: opentracing.Span,
        postFunc: bent.RequestFunction<bent.Json>,
    ) {
        super(postFunc);
    }

    /**
     * 调用(不抛出异常)
     * 
     * @param route 路由
     */
    public async callWithoutThrow<T>(route: string) {
        this.m_TracerSpan.setTag('route', route).log({
            body: this.body,
        });

        const header = this.header || {};
        this.m_Tracer.inject(this.m_TracerSpan, opentracing.FORMAT_HTTP_HEADERS, header);
        this.m_TracerSpan.log({ header });
        this.header = header;

        try {
            const resp = await super.callWithoutThrow<T>(route);
            this.m_TracerSpan.log({
                result: resp
            });
            if (resp.err)
                this.m_TracerSpan.setTag(opentracing.Tags.ERROR, true);

            return resp;
        } catch (ex) {
            this.m_TracerSpan.log({
                err: ex
            }).setTag(opentracing.Tags.ERROR, true);
            throw ex;
        } finally {
            this.m_TracerSpan.finish();
        }
    }
}