import { credentials } from '@grpc/grpc-js';

import { getRpcProto } from './proto';
import { IGrpcJsRequset } from './request';
import { IRpcCallOption, LoadBalanceBase, RpcBase } from '../../contract';
import { contract, enum_ } from '../../model';

export class GrpcJsRpc extends RpcBase {
    public constructor(
        private m_LoadBalance: LoadBalanceBase,
        private m_ProtoFilePath: string,
    ) {
        super();
    }

    public async callWithoutThrow<T>(v: IRpcCallOption) {
        const proto = getRpcProto(this.m_ProtoFilePath);
        const routeArgs = v.route.split('/');
        const url = await this.m_LoadBalance.getUrl(routeArgs[1], v.header?.[enum_.Header.env])
        return new Promise<contract.IApiDyanmicResponse<T>>((s, f) => {
            new proto.RpcService(
                url,
                credentials.createInsecure()
            ).call({
                json: JSON.stringify({
                    api: routeArgs.pop(),
                    app: routeArgs[1],
                    body: v.body,
                    header: v.header
                } as IGrpcJsRequset)
            }, (err: Error, resp: any) => {
                if (err)
                    return f(err);

                s(
                    JSON.parse(resp.json)
                );
            });
        });
    }
}