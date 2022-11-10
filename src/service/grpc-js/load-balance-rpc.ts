import { GrpcJsDelegateRpc } from './delegate-rpc';
import { LoadBalanceBase } from '../../contract';
import { enum_ } from '../../model';

export class GrpcJsLoadBalanceRpc extends GrpcJsDelegateRpc {
    public constructor(
        loadBalance: LoadBalanceBase,
        protoFilePath: string,
    ) {
        super(protoFilePath, async v => {
            const routeArgs = v.route.split('/');
            if (routeArgs.length == 3)
                routeArgs.splice(0, 2, 'ih');
            return {
                api: routeArgs[3],
                app: routeArgs[1],
                baseUrl: await loadBalance.getUrl(routeArgs[1], v.header?.[enum_.Header.env]),
                endpoint: routeArgs[2],
            }
        });
    }
}