import bent from 'bent';

import { CustomError } from '../error';
import { IApiDyanmicResponse, RpcBase } from '../../contract';

/**
 * 包装器
 */
export class BentDefaultRpc extends RpcBase {
    /**
     * 请求体
     */
    protected body: any;
    /**
     * 头数据
     */
    protected header: { [key: string]: string; };

    /**
     * 构造函数
     * 
     * @param postFunc 请求函数
     */
    public constructor(
        protected postFunc: bent.RequestFunction<bent.Json>,
    ) {
        super();
    }

    /**
     * 调用
     * 
     * @param route 路由
     */
    public async call<T>(route: string) {
        const resp = await this.callWithoutThrow<T>(route);
        if (resp.err)
            throw new CustomError(resp.err, resp.data);

        return resp;
    }

    /**
     * 调用(不抛异常)
     * 
     * @param route 路由
     */
    public async callWithoutThrow<T>(route: string) {
        const routeArgs = route.split('/');
        if (routeArgs.length == 2)
            routeArgs.splice(1, 0, 'ih');
        route = routeArgs.join('/');
        const resp = await this.postFunc(route, this.body, this.header || {});
        return resp as IApiDyanmicResponse<T>;
    }

    /**
     * 设置请求体
     * 
     * @param v 值
     */
    public setBody(v: any) {
        this.body = v;
        return this;
    }

    /**
     * 设置头
     * 
     * @param v 值
     */
    public setHeader(v: { [key: string]: string; }) {
        this.header = v;
        return this;
    }
}