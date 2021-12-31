import { IApiResponse } from './i-api-response';

/**
 * 远程调用接口
 */
export abstract class RpcBase {
    /**
     * 调用
     * 
     * @param route 路由
     */
    public abstract call(route: string): Promise<IApiResponse>;

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