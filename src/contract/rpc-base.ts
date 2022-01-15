import { IApiResponse } from './i-api-response';

interface IRpcResponse<T> extends IApiResponse {
    data: T;
}

/**
 * 远程调用接口
 */
export abstract class RpcBase {
    /**
     * 调用
     * 
     * @param route 路由
     */
    public abstract call<T>(route: string): Promise<IRpcResponse<T>>;

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