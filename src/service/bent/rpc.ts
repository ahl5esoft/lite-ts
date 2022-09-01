import bent from 'bent';

import { RpcBase } from '../../contract';
import { contract } from '../../model';

/**
 * 远程过程调用对象(基于bent实现)
 */
export class BentRpc extends RpcBase {
    /**
     * 请求体
     */
    private m_Body: any;
    /**
     * 头数据
     */
    private m_Header: { [key: string]: string; };

    /**
     * 构造函数
     * 
     * @param m_Url 服务基地址
     */
    public constructor(
        private m_Url: string
    ) {
        super();
    }

    /**
     * 调用
     * 
     * @param route 路由
     */
    public async callWithoutThrow<T>(route: string) {
        const routeArgs = route.split('/');
        if (routeArgs.length == 3)
            routeArgs.splice(2, 0, 'ih');
        route = routeArgs.join('/');
        const resp = await bent(this.m_Url, 'json', 'POST', 200)(route, this.m_Body, this.m_Header || {});
        return resp as contract.IApiDyanmicResponse<T>;
    }

    /**
     * 设置body
     * 
     * @param v 值
     */
    public setBody(v: any) {
        this.m_Body = v;
        return this;
    }

    /**
     * 设置请求头
     * 
     * @param v 值
     */
    public setHeader(v: { [key: string]: string; }) {
        this.m_Header = v;
        return this;
    }
}