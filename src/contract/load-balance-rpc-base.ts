import { ConfigLoaderBase } from './config-loader-base';
import { RpcBase } from './rpc-base';
import { config, enum_ } from '../model';

/**
 * 负载均衡rpc
 */
export abstract class LoadBalanceRpcBase extends RpcBase {
    /**
     * 构造函数
     * 
     * @param configLoader 配置加载器
     * @param m_Protocol 协议
     */
    public constructor(
        protected configLoader: ConfigLoaderBase,
        private m_Protocol: 'http' | 'grpc',
    ) {
        super();
    }

    /**
     * 获取地址
     * 
     * @param app 应用
     */
    protected async getUrl(app: string) {
        const cfg = await this.configLoader.load(config.LoadBalance);
        if (!cfg[this.m_Protocol])
            throw new Error(`缺少http负载: ${this.m_Protocol}`);

        if (!cfg[this.m_Protocol][app])
            throw new Error(`缺少http负载: ${this.m_Protocol}[${app}]`);

        this.header ??= {};
        const env = this.header[enum_.Header.env] ?? '';
        if (!cfg[this.m_Protocol][app][env])
            throw new Error(`缺少http负载: ${this.m_Protocol}[${app}][${env || '""'}]`);

        return cfg[this.m_Protocol][app][env];
    }
}