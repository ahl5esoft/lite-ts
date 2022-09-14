import { contract } from '../model';

/**
 * 远程调用接口
 */
export abstract class RpcBase {
    /**
     * 创建错误函数
     * 
     * @param errorCode 错误码
     * @param data 数据
     */
    public static buildErrorFunc: (errorCode: number, data: any) => Error;

    /**
     * 请求体
     */
    protected body: any;
    /**
     * 头数据
     */
    protected header: { [key: string]: string; };

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
    public async call<T>(route: string) {
        const resp = await this.callWithoutThrow<T>(route);
        if (resp.err)
            throw RpcBase.buildErrorFunc(resp.err, resp.data);

        return resp;
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
        this.body = v;
        return this;
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
        this.header = v;
        return this;
    }

    /**
     * 调用(不会抛出异常)
     * 
     * @param route 路由
     * 
     * @example
     * ```typescript
     *  const rpc: RpcBase;
     *  const resp = await rpc.callWithoutThrow<T>('/app/api');
     *  // resp is IApiDyanmicResponse<T>
     * ```
     */
    public abstract callWithoutThrow<T>(route: string): Promise<contract.IApiDyanmicResponse<T>>;
}