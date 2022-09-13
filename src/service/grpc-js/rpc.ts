import { credentials } from '@grpc/grpc-js';

import { getRpcProto } from './proto';
import { IGrpcJsRequset } from './request';
import { ConfigLoaderBase, RpcBase } from '../../contract';
import { config, contract } from '../../model';

/**
 * grpc
 */
export class GrpcJsRpc extends RpcBase {
    /**
     * 请求体
     */
    private m_Body: any;
    /**
     * 头数据
     */
    private m_Header: { [key: string]: string; };

    /**
     * 构造函数
     * 
     * @param m_ConfigLoader 配置加载器
     * @param m_ProtoFilePath proto文件地址
     */
    public constructor(
        private m_ConfigLoader: ConfigLoaderBase,
        private m_ProtoFilePath: string,
    ) {
        super();
    }

    /**
     * 调用
     * 
     * @param route 路由
     */
    public async callWithoutThrow<T>(route: string) {
        const proto = getRpcProto(this.m_ProtoFilePath);
        const routeArgs = route.split('/');
        const cfg = await this.m_ConfigLoader.load(config.LoadBalance);
        if (!cfg.grpc?.[routeArgs[1]])
            throw new Error(`缺少grpc负载: ${routeArgs[1]}`);

        return new Promise<contract.IApiDyanmicResponse<T>>((s, f) => {
            new proto.RpcService(
                cfg.grpc[routeArgs[1]],
                credentials.createInsecure()
            ).call({
                json: JSON.stringify({
                    api: routeArgs.pop(),
                    app: routeArgs[1],
                    body: this.m_Body,
                    header: this.m_Header
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

    /**
     * 设置body
     * 
     * @param v 值
     */
    public setBody(v: any) {
        this.m_Body = v;
        return this;
    }

    /**
     * 设置请求头
     * 
     * @param v 值
     */
    public setHeader(v: { [key: string]: string; }) {
        this.m_Header = v;
        return this;
    }
}