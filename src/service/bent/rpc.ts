import bent from 'bent';

import { IApiResponse, RpcBase } from '../..';

class Wrapper extends RpcBase {
    private m_Body: any;
    private m_Header: { [key: string]: string; };

    public constructor(
        private m_PostFunc: bent.RequestFunction<bent.Json>
    ) {
        super();
    }

    public async call(route: string) {
        const res = await this.m_PostFunc(route, this.m_Body, this.m_Header);
        return res as IApiResponse;
    }

    public setBody(v: any) {
        this.m_Body = v;
        return this;
    }

    public setHeader(v: { [key: string]: string; }) {
        this.m_Header = v;
        return this;
    }
}

/**
 * 远程过程调用对象(基于bent实现)
 */
export class BentRpc extends RpcBase {
    /**
     * post请求函数
     */
    private m_PostFunc: bent.RequestFunction<bent.Json>;

    /**
     * 构造函数
     * 
     * @param url 服务基地址
     */
    public constructor(
        url: string
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
        return new Wrapper(this.m_PostFunc).call(route);
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
        const wrapper = new Wrapper(this.m_PostFunc);
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
        const wrapper = new Wrapper(this.m_PostFunc);
        wrapper.setHeader(v);
        return wrapper;
    }
}