import bent from 'bent';

import { IRpcCallOption, LoadBalanceBase, RpcBase } from '../../contract';
import { contract, enum_ } from '../../model';

export class BentRpc extends RpcBase {
    public constructor(
        private m_LoadBalance: LoadBalanceBase,
    ) {
        super();
    }

    public async callWithoutThrow<T>(v: IRpcCallOption) {
        const routeArgs = v.route.split('/');
        const url = await this.m_LoadBalance.getUrl(routeArgs[1], v.header?.[enum_.Header.env]);
        const resp = await bent<bent.Json>(url, 'json', 'POST', 200)(`/ih/${routeArgs.pop()}`, v.body, v.header);
        return resp as contract.IApiDyanmicResponse<T>;
    }
}