import bent from 'bent';

import { LoadBalanceBase, RpcBase } from '../../contract';
import { contract, enum_ } from '../../model';

export class BentRpc extends RpcBase {
    public constructor(
        private m_LoadBalance: LoadBalanceBase,
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
        const url = await this.m_LoadBalance.getUrl(routeArgs[1], this.header?.[enum_.Header.env]);
        const resp = await bent<bent.Json>(url, 'json', 'POST', 200)(`/ih/${routeArgs.pop()}`, this.body, this.header);
        return resp as contract.IApiDyanmicResponse<T>;
    }
}