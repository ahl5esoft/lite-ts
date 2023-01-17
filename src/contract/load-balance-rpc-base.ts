import { ConfigLoaderBase } from './config-loader-base';
import { RpcBase } from './rpc-base';
import { config, enum_ } from '../model';

/**
 * 负载均衡rpc
 */
export abstract class LoadBalanceRpcBase extends RpcBase {
    private m_GetTimeFunc = () => Date.now();

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
            throw new Error(`缺少config.LoadBalance[${this.m_Protocol}]`);

        if (!cfg[this.m_Protocol][app])
            throw new Error(`缺少config.LoadBalance[${this.m_Protocol}][${app}]`);

        this.header ??= {};
        const env = this.header[enum_.Header.env] ?? '';
        const v = cfg[this.m_Protocol][app][env];
        if (!v)
            throw new Error(`缺少config.LoadBalance[${this.m_Protocol}][${app}][${env}]`);

        if (typeof v == 'string')
            return v;

        if (v?.percent?.[1] > 0)
            return this.m_GetTimeFunc() % 100 < v?.percent?.[1] ? v.percent[0] : v.default;

        throw new Error(`缺少config.LoadBalance[${this.m_Protocol}][${app}][${env}].percent`);
    }
}