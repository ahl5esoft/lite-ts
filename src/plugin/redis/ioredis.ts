import Ioredis from 'ioredis';

import { GeoAddMessage, RedisBase } from './base';

export class IORedisAdapter extends RedisBase {
    private m_Client: Ioredis.Cluster | Ioredis.Redis;

    public constructor(arg: Ioredis.RedisOptions | Ioredis.ClusterNode[]) {
        super();

        this.m_Client = arg instanceof Array ? new Ioredis.Cluster(arg) : new Ioredis(arg);
    }

    public close(): void {
        this.m_Client.disconnect();
    }

    public async del(key: string): Promise<void> {
        await this.m_Client.del(key);
    }

    public async exists(key: string): Promise<boolean> {
        const count = await this.m_Client.exists(key);
        return count > 0;
    }

    public async expire(key: string, seconds: number): Promise<void> {
        await this.m_Client.expire(key, seconds);
    }

    public async get(key: string): Promise<string> {
        return this.m_Client.get(key);
    }

    public async geoadd(key: string, ...messages: GeoAddMessage[]): Promise<number> {
        let args = messages.reduce((memo: any[], r): any[] => {
            memo.push(r.longitude, r.latitude, r.member);
            return memo;
        }, []);
        return (this.m_Client as any).geoadd(key, ...args);
    }

    public async geopos(key: string, ...members: string[]): Promise<[number, number][]> {
        const res = await (this.m_Client as any).geopos(key, ...members);
        return res.map((r: [string, string]): [number, number] => {
            return [parseFloat(r[0]), parseFloat(r[1])];
        });
    }

    public async hdel(key: string, ...fields: string[]): Promise<number> {
        return this.m_Client.hdel(key, fields);
    }

    public async hget(key: string, field: string): Promise<string> {
        return this.m_Client.hget(key, field);
    }

    public async hgetall(key: string): Promise<{ [key: string]: string; }> {
        return await this.m_Client.hgetall(key);
    }

    public async hlen(key: string): Promise<number> {
        return this.m_Client.hlen(key);
    }

    public async hkeys(key: string): Promise<string[]> {
        return this.m_Client.hkeys(key);
    }

    public async hset(key: string, field: string, value: string): Promise<void> {
        await this.m_Client.hset(key, field, value);
    }

    public async hsetnx(key: string, field: string, value: string): Promise<boolean> {
        const res = await this.m_Client.hsetnx(key, field, value);
        return res == 1;
    }

    public async incr(key: string): Promise<number> {
        return await this.m_Client.incr(key);
    }

    public async lpop(key: string): Promise<string> {
        return this.m_Client.lpop(key);
    }

    public async lpush(key: string, ...values: string[]): Promise<number> {
        return this.m_Client.lpush(key, ...values);
    }

    public async lrange(key: string, start: number, stop: number): Promise<string[]> {
        return this.m_Client.lrange(key, start, stop);
    }

    public async mget(...keys: string[]): Promise<string[]> {
        return this.m_Client.mget(...keys);
    }

    public async rpop(key: string): Promise<string> {
        return this.m_Client.rpop(key);
    }

    public async rpush(key: string, ...values: string[]): Promise<number> {
        return this.m_Client.rpush(key, ...values);
    }

    public async set(key: string, value: string, ...args: any[]): Promise<boolean> {
        const res = await this.m_Client.set(key, value, ...args);
        return res === 'OK';
    }

    public async time(): Promise<[string, string]> {
        return this.m_Client.time();
    }

    public async ttl(key: string): Promise<number> {
        return this.m_Client.ttl(key);
    }
}
