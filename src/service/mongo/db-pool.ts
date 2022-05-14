import { MongoClient } from 'mongodb';

/**
 * mongo数据池
 */
export class MongoDbPool {
    private m_Client: MongoClient;
    /**
     * 客户端
     */
    public get client() {
        return new Promise<MongoClient>(async (s, f) => {
            if (!this.m_Client) {
                this.m_Client = new MongoClient(this.m_Url, {
                    poolSize: 100,
                    useNewUrlParser: true,
                    useUnifiedTopology: true,
                });
            }

            if (!this.m_Client.isConnected()) {
                try {
                    await this.m_Client.connect();
                } catch (ex) {
                    return f(ex);
                }
            }

            s(this.m_Client);
        });
    }

    /**
     * 构造函数
     * 
     * @param m_Name 数据名
     * @param m_Url 连接地址
     */
    public constructor(
        private m_Name: string,
        private m_Url: string,
    ) { }

    /**
     * 获取数据表
     */
    public async getDb() {
        const client = await this.client;
        return client.db(this.m_Name);
    }
}
