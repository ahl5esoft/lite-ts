import bent from 'bent';

import { ConfigLoaderBase, LoadBalanceRpcBase } from '../../contract';
import { contract, enum_ } from '../../model';

/**
 * 远程过程调用对象(基于bent实现)
 */
export class BentRpc extends LoadBalanceRpcBase {
    /**
     * 构造函数
     * 
     * @param configLoader 配置加载器
     */
    public constructor(
        configLoader: ConfigLoaderBase,
    ) {
        super(configLoader, 'http');
    }

    /**
     * 调用
     * 
     * @param route 路由
     */
    public async callWithoutThrow<T>(route: string) {
        const routeArgs = route.split('/');
        const url = await this.getUrl(routeArgs[1]);
        try {
            const resp = await bent<bent.Json>(url, 'json', 'POST', 200)(`/ih/${routeArgs.pop()}`, this.body, this.header);
            return resp as contract.IApiDyanmicResponse<T>;
        } catch (err) {
            return {
                err: enum_.ErrorCode.timeout,
                data: err.message
            };
        }
    }
}