import { IApiDyanmicResponse } from './i-api-dynamic-response';

/**
 * 远程调用接口
 */
export abstract class RpcBase {
    /**
     * 调用
     * 
     * @param route 路由
     */
    public abstract call<T>(route: string): Promise<IApiDyanmicResponse<T>>;
    /**
     * 调用(不会抛出异常)
     * 
     * @param route 路由
     */
    public abstract callWithoutError<T>(route: string): Promise<IApiDyanmicResponse<T>>;
    /**
     * 设置body
     * 
     * @param v body值
     */
    public abstract setBody(v: any): RpcBase;
    /**
     * 设置头部
     * 
     * @param v 头部值
     */
    public abstract setHeader(v: { [key: string]: string }): RpcBase;
}