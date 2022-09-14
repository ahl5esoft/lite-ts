import { credentials } from '@grpc/grpc-js';

import { getRpcProto } from './proto';
import { IGrpcJsRequset } from './request';
import { ConfigLoaderBase, LoadBalanceRpcBase } from '../../contract';
import { contract } from '../../model';

/**
 * grpc
 */
export class GrpcJsRpc extends LoadBalanceRpcBase {
    /**
     * 构造函数
     * 
     * @param m_ProtoFilePath proto文件地址
     * @param configLoader 配置加载器
     */
    public constructor(
        private m_ProtoFilePath: string,
        configLoader: ConfigLoaderBase,
    ) {
        super(configLoader, 'grpc');
    }

    /**
     * 调用
     * 
     * @param route 路由
     */
    public async callWithoutThrow<T>(route: string) {
        const proto = getRpcProto(this.m_ProtoFilePath);
        const routeArgs = route.split('/');
        const url = await this.getUrl(routeArgs[1])
        return new Promise<contract.IApiDyanmicResponse<T>>((s, f) => {
            new proto.RpcService(
                url,
                credentials.createInsecure()
            ).call({
                json: JSON.stringify({
                    api: routeArgs.pop(),
                    app: routeArgs[1],
                    body: this.body,
                    header: this.header
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