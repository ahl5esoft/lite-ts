import bent from 'bent';
import { opentracing } from 'jaeger-client';

import { IApiResponse, ITraceable, RpcBase } from '../..';

/**
 * 包装器
 */
class Wrapper extends RpcBase {
    /**
     * body数据
     */
    private m_Body: any;
    /**
     * 头数据
     */
    private m_Header: { [key: string]: string; };

    private m_Span: opentracing.Span;
    /**
     * 跟踪范围
     */
    protected get span() {
        if (!this.m_Span) {
            this.m_Span = this.tracer.startSpan('rpc', {
                childOf: this.m_ParentSpan
            });
        }

        return this.m_Span;
    }

    private m_Tracer: opentracing.Tracer;
    /**
     * 跟踪
     */
    protected get tracer() {
        if (!this.m_Tracer)
            this.m_Tracer = opentracing.globalTracer();

        return this.m_Tracer;
    }

    /**
     * 构造函数
     * 
     * @param m_PostFunc 请求函数
     * @param m_ParentSpan 父跟踪范围
     */
    public constructor(
        private m_PostFunc: bent.RequestFunction<bent.Json>,
        private m_ParentSpan: opentracing.Span
    ) {
        super();
    }

    public async call(route: string) {
        const header = this.m_Header || {};
        this.tracer.inject(this.span, opentracing.FORMAT_HTTP_HEADERS, header);
        const res = await this.m_PostFunc(route, this.m_Body, header);
        this.span.setTag('route', route).log({
            result: res
        }).finish();
        return res as IApiResponse;
    }

    public setBody(v: any) {
        this.span.log({
            body: v
        });
        this.m_Body = v;
        return this;
    }

    public setHeader(v: { [key: string]: string; }) {
        this.span.log({
            header: v
        });
        this.m_Header = v;
        return this;
    }
}

/**
 * 远程过程调用对象(基于bent实现)
 */
export class BentRpc extends RpcBase implements ITraceable {
    /**
     * post请求函数
     */
    private m_PostFunc: bent.RequestFunction<bent.Json>;

    /**
     * 构造函数
     * 
     * @param url 服务基地址
     * @param m_ParentSpan 父跟踪范围
     */
    public constructor(
        url: string,
        private m_ParentSpan?: opentracing.Span
    ) {
        super();

        this.m_PostFunc = bent(url, 'json', 'POST', 200);
    }

    /**
     * 调用
     * 
     * @param route 路由
     * 
     * @example
     * ```typescript
     *  const rpc: RpcBase;
     *  const res = await rpc.call('/服务名/端/api名');
     *  // res is IApiResponse
     * ```
     */
    public call(route: string) {
        return new Wrapper(this.m_PostFunc, this.m_ParentSpan).call(route);
    }

    /**
     * 设置body
     * 
     * @param v body值
     * 
     * @returns 远程过程调用对象
     * 
     * @example
     * ```typescript
     *  const rpc: RpcBase;
     *  const res = await rpc.setBody({ ... }).call('/服务名/端/api名');
     *  // res is IApiResponse
     * ```
     */
    public setBody(v: any) {
        const wrapper = new Wrapper(this.m_PostFunc, this.m_ParentSpan);
        wrapper.setBody(v);
        return wrapper;
    }

    /**
     * 设置请求头
     * 
     * @param v 请求头
     * 
     * @returns 远程过程调用对象
     * 
     * @example
     * ```typescript
     *  const rpc: RpcBase;
     *  const res = await rpc.setHeader({ ... }).call('/服务名/端/api名');
     *  // res is IApiResponse
     * ```
     */
    public setHeader(v: { [key: string]: string; }) {
        const wrapper = new Wrapper(this.m_PostFunc, this.m_ParentSpan);
        wrapper.setHeader(v);
        return wrapper;
    }

    /**
     * 跟踪
     * 
     * @param parentSpan 父跟踪范围
     */
    public withTrace(parentSpan: any) {
        const rpc = new BentRpc('', parentSpan);
        rpc.m_PostFunc = this.m_PostFunc;
        return rpc;
    }
}