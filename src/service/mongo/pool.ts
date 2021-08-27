import { MongoClient } from 'mongodb';

export class Pool {
    private m_Client: MongoClient;

    public constructor(private m_Name: string, private m_Url: string) { }

    public async getClient() {
        if (!this.m_Client) {
            this.m_Client = new MongoClient(this.m_Url, {
                poolSize: 100,
                useNewUrlParser: true,
                useUnifiedTopology: true,
            });
        }

        if (!this.m_Client.isConnected())
            await this.m_Client.connect();

        return this.m_Client;
    }

    public async getDb() {
        const client = await this.getClient();
        return client.db(this.m_Name);
    }
}
