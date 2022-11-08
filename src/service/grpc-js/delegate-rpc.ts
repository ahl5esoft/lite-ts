import { credentials } from '@grpc/grpc-js';

import { getRpcProto } from './proto';
import { IGrpcJsRequset } from './request';
import { IRpcCallOption, RpcBase } from '../../contract';
import { contract } from '../../model';

export class GrpcJsDelegateRpc extends RpcBase {
    public constructor(
        private m_ProtoFilePath: string,
        private m_GetRequestFunc: (v: IRpcCallOption) => Promise<{
            api: string;
            app: string;
            baseUrl: string;
        }>,
    ) {
        super();
    }

    public async callWithoutThrow<T>(v: IRpcCallOption) {
        const proto = getRpcProto(this.m_ProtoFilePath);
        const req = await this.m_GetRequestFunc(v);
        return new Promise<contract.IApiDyanmicResponse<T>>((s, f) => {
            new proto.RpcService(
                req.baseUrl,
                credentials.createInsecure()
            ).call({
                json: JSON.stringify({
                    api: req.api,
                    app: req.app,
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