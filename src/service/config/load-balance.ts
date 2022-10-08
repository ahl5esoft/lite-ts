import { ConfigLoaderBase, LoadBalanceBase } from '../../contract';
import { config } from '../../model';

export class ConfigLoadBalance extends LoadBalanceBase {
    private m_GetTimeFunc = () => Date.now();

    public constructor(
        private m_ConfigLoader: ConfigLoaderBase,
        private m_Protocol: 'grpc' | 'http',
    ) {
        super();
    }

    public async getUrl(app: string, env: string) {
        const cfg = await this.m_ConfigLoader.load(config.LoadBalance);
        if (!cfg[this.m_Protocol])
            throw new Error(`缺少config.LoadBalance[${this.m_Protocol}]`);

        if (!cfg[this.m_Protocol][app])
            throw new Error(`缺少config.LoadBalance[${this.m_Protocol}][${app}]`);

        env ??= '';
        const v = cfg[this.m_Protocol][app][env];
        if (!v)
            throw new Error(`缺少config.LoadBalance[${this.m_Protocol}][${app}][${env}]`);

        if (typeof v == 'string')
            return v;

        if (v?.mod?.[1] > 0)
            return this.m_GetTimeFunc() % v.mod[1] == 0 ? v.mod[0] : v.default;

        throw new Error(`缺少config.LoadBalance[${this.m_Protocol}][${app}][${env}].mod`);
    }
}