import { BentDelegateRpc } from './delegate-rpc';
import { LoadBalanceBase } from '../../contract';
import { enum_ } from '../../model';

export class BentLoadBalanceRpc extends BentDelegateRpc {
    public constructor(
        loadBalance: LoadBalanceBase,
    ) {
        super(async v => {
            const routeArgs = v.route.split('/');
            return {
                api: routeArgs.pop(),
                baseUrl: await loadBalance.getUrl(routeArgs[1], v.header?.[enum_.Header.env])
            };
        });
    }
}