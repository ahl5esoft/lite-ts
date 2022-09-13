import bent from 'bent';

import { ConfigLoaderBase } from '../../contract';

/**
 * 配置加载器
 */
export class BentConfigLoader extends ConfigLoaderBase {
    /**
     * 获取函数
     */
    private m_GetFunc: bent.RequestFunction<bent.Json>;

    /**
     * 构造函数
     * 
     * @param cdnUrl cdn地址
     */
    public constructor(
        cdnUrl: string
    ) {
        super();

        this.m_GetFunc = bent(cdnUrl, 'json', 'GET', 200);
    }

    /**
     * 加载
     * 
     * @param ctor 模型
     */
    public async load<T>(ctor: new () => T) {
        try {
            return await this.m_GetFunc(`/${ctor.name}.json`) as T;
        } catch { }
    }
}