import { Db, MongoClient } from 'mongodb';

/**
 * mongo数据池
 */
export class MongoPool {
    private m_Client: MongoClient;
    /**
     * 客户端
     */
    public get client() {
        return new Promise<MongoClient>(async (s, f) => {
            this.m_Client ??= new MongoClient(this.m_Url);

            try {
                await this.m_Client.connect();
            } catch (ex) {
                return f(ex);
            }

            s(this.m_Client);
        });
    }

    private m_Db: Db;
    /**
     * 数据库
     */
    public get db() {
        return new Promise<Db>(async (s, f) => {
            if (!this.m_Db) {
                try {
                    const client = await this.client;
                    this.m_Db = client.db(this.m_Name);
                } catch (ex) {
                    return f(ex);
                }
            }

            s(this.m_Db);
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
}
