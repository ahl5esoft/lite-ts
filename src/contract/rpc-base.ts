import { IRpcCallOption } from './i-rpc-call-option';
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
     * @example
     * ```typescript
     *  const rpc: RpcBase;
     *  const resp = await rpc.call<T>('/服务名/端/api名');
     *  // resp is IApiDyanmicResponse<T>, 如果resp.err有效则会抛错
     * ```
     */
    public async call<T>(v: IRpcCallOption) {
        const resp = await this.callWithoutThrow<T>(v);
        if (resp.err)
            throw RpcBase.buildErrorFunc(resp.err, resp.data);

        return resp;
    }

    /**
     * @example
     * ```typescript
     *  const rpc: RpcBase;
     *  const resp = await rpc.callWithoutThrow<T>('/app/api');
     *  // resp is IApiDyanmicResponse<T>
     * ```
     */
    public abstract callWithoutThrow<T>(v: IRpcCallOption): Promise<contract.IApiDyanmicResponse<T>>;
}