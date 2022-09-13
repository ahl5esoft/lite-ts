import bent from 'bent';

import { ConfigLoaderBase, RpcBase } from '../../contract';
import { config, contract } from '../../model';

/**
 * 远程过程调用对象(基于bent实现)
 */
export class BentRpc extends RpcBase {
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
     */
    public constructor(
        private m_ConfigLoader: ConfigLoaderBase,
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
        const cfg = await this.m_ConfigLoader.load(config.LoadBalance);
        if (!cfg.http?.[routeArgs[1]])
            throw new Error(`缺少http负载: ${routeArgs[1]}`);

        const resp = await bent(cfg.http[routeArgs[1]], 'json', 'POST', 200)(`/ih/${routeArgs.pop()}`, this.m_Body, this.m_Header || {});
        return resp as contract.IApiDyanmicResponse<T>;
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