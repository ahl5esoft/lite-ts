import { opentracing } from 'jaeger-client';

import { ITraceable, RpcBase } from '../../contract';

/**
 * rpc代理
 */
export class RpcProxy extends RpcBase implements ITraceable<RpcBase> {

    /**
     * 构造函数
     * 
     * @param m_BuildRpcFunc 创建rpc函数
     * @param m_TracerSpan 跟踪范围
     */
    public constructor(
        private m_BuildRpcFunc: (tracerSpan: any) => RpcBase,
        private m_TracerSpan?: opentracing.Tracer,
    ) {
        super();
    }

    /**
     * 调用
     * 
     * @param route 路由
     */
    public call<T>(route: string) {
        return this.m_BuildRpcFunc(this.m_TracerSpan).call<T>(route);
    }

    /**
     * 调用
     * 
     * @param route 路由
     */
    public callWithoutThrow<T>(route: string) {
        return this.m_BuildRpcFunc(this.m_TracerSpan).callWithoutThrow<T>(route);
    }

    /**
     * 设置body
     * 
     * @param v 值
     */
    public setBody(v: any) {
        return this.m_BuildRpcFunc(this.m_TracerSpan).setBody(v);
    }

    /**
     * 设置请求头
     * 
     * @param v 值
     */
    public setHeader(v: { [key: string]: string; }) {
        return this.m_BuildRpcFunc(this.m_TracerSpan).setHeader(v);
    }

    /**
     * 跟踪
     * 
     * @param tracerSpan 跟踪范围
     */
    public withTrace(tracerSpan: any) {
        return tracerSpan ? new RpcProxy(
            this.m_BuildRpcFunc,
            tracerSpan
        ) : this;
    }
}