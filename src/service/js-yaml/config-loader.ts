import { load } from 'js-yaml';

import { ConfigLoaderBase, IOFileBase } from '../..';

/**
 * js-yaml配置加载器
 */
export class JsYamlConfigLoader extends ConfigLoaderBase {
    /**
     * yaml文档
     */
    private m_Doc: any;

    /**
     * 构造函数
     * 
     * @param m_File yaml文件
     */
    public constructor(
        private m_File: IOFileBase,
    ) {
        super();
    }

    /**
     * 加载配置
     * 
     * @param ctor 构造函数
     */
    public async load<T>(ctor: new () => T) {
        if (!this.m_Doc) {
            const yml = await this.m_File.readString();
            this.m_Doc = load(yml);
        }

        return this.m_Doc[ctor.name] as T;
    }
}