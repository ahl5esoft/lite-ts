import bent from 'bent';
import { opentracing } from 'jaeger-client';

import { BentDefaultRpc } from './default-rpc';
import { BentTracerRpc } from './tracer-rpc';
import { ITraceable, RpcBase } from '../../contract';

/**
 * 远程过程调用对象(基于bent实现)
 */
export class BentRpc extends RpcBase implements ITraceable<RpcBase> {
    /**
     * 创建rpc
     */
    private m_BuildFunc = (postFunc: bent.RequestFunction<bent.Json>) => new BentDefaultRpc(postFunc);
    /**
     * post请求函数
     */
    private m_PostFunc: bent.RequestFunction<bent.Json>;

    /**
     * 构造函数
     * 
     * @param url 服务基地址
     */
    public constructor(url: string) {
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
     *  const resp = await rpc.call<T>('/服务名/端/api名');
     *  // resp is IApiDyanmicResponse<T>, 如果resp.err有效则会抛错
     * ```
     */
    public call<T>(route: string) {
        return this.m_BuildFunc(this.m_PostFunc).call<T>(route);
    }

    /**
     * 调用
     * 
     * @param route 路由
     * 
     * @example
     * ```typescript
     *  const rpc: RpcBase;
     *  const resp = await rpc.callWithoutThrow<T>('/服务名/端/api名');
     *  // resp is IApiDyanmicResponse<T>
     * ```
     */
    public callWithoutThrow<T>(route: string) {
        return this.m_BuildFunc(this.m_PostFunc).callWithoutThrow<T>(route);
    }

    /**
     * 设置body
     * 
     * @param v 值
     * 
     * @example
     * ```typescript
     *  const rpc: RpcBase;
     *  rpc.setBody({ ... });
     * ```
     */
    public setBody(v: any) {
        return this.m_BuildFunc(this.m_PostFunc).setBody(v);
    }

    /**
     * 设置请求头
     * 
     * @param v 值
     * 
     * @example
     * ```typescript
     *  const rpc: RpcBase;
     *  rpc.setHeader({ ... });
     * ```
     */
    public setHeader(v: { [key: string]: string; }) {
        return this.m_BuildFunc(this.m_PostFunc).setHeader(v);
    }

    /**
     * 跟踪
     * 
     * @param parentSpan 父跟踪范围
     */
    public withTrace(parentSpan: any) {
        if (!parentSpan)
            return this;

        const rpc = new BentRpc('');
        rpc.m_PostFunc = this.m_PostFunc;

        const tracer = opentracing.globalTracer();
        const tracerSpan = tracer.startSpan('rpc', {
            childOf: parentSpan,
        });
        rpc.m_BuildFunc = (postFunc: bent.RequestFunction<bent.Json>) => new BentTracerRpc(tracer, tracerSpan, postFunc);

        return rpc;
    }
}