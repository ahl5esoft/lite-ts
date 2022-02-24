import { Client, ClientOptions } from '@elastic/elasticsearch';

/**
 * es元数据管理
 */
export class ElasticSearchPool {
    /**
     * 索引
     */
    private m_Indexes: string[];

    private m_Client: Client;
    /**
     * es客户端
     */
    public get client() {
        if (!this.m_Client)
            this.m_Client = new Client(this.m_Cfg);

        return this.m_Client;
    }

    /**
     * 构造函数
     * 
     * @param m_Cfg es配置
     * @param m_Project 项目
     */
    public constructor(
        private m_Cfg: ClientOptions,
        private m_Project: string,
    ) { }

    /**
     * 获取索引
     * 
     * @param model 模型
     */
    public async getIndex(model: Function) {
        const index = [this.m_Project, model.name.toLowerCase()].join('.');
        if (!this.m_Indexes) {
            const res = await this.client.indices.recovery();
            this.m_Indexes = Object.keys(res);
        }

        if (!this.m_Indexes.includes(index)) {
            await this.client.indices.create({
                index: index,
            });
            this.m_Indexes.push(index);
        }

        return index;
    }
}