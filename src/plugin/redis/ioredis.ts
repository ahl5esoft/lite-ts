import Ioredis from 'ioredis';

import { GeoAddMessage, RedisBase } from './base';
import { CallbackType, IPublisher, ISubscriber } from '../pubsub';

type RedisType = Ioredis.Cluster | Ioredis.Redis;

export class IORedisAdapter extends RedisBase implements IPublisher, ISubscriber {
    private m_SubCallbacks: { [key: string]: (message: string) => Promise<void>; } = {};

    private m_Client: RedisType;
    protected get client(): RedisType {
        if (this.m_Client == null)
            this.m_Client = this.m_Opt instanceof Array ? new Ioredis.Cluster(this.m_Opt) : new Ioredis(this.m_Opt);

        return this.m_Client;
    }

    private m_Sub: RedisType;
    protected get sub(): RedisType {
        if (this.m_Sub == null) {
            this.m_Sub = this.m_Opt instanceof Array ? new Ioredis.Cluster(this.m_Opt) : new Ioredis(this.m_Opt);
            this.m_Sub.on('message', (channel: string, message: string) => {
                if (this.m_SubCallbacks[channel])
                    this.m_SubCallbacks[channel](message).catch(console.log);
            });
        }

        return this.m_Sub;
    }

    public constructor(private m_Opt: Ioredis.RedisOptions | Ioredis.ClusterNode[]) {
        super();
    }

    public close() {
        this.client?.disconnect();
        this.sub?.disconnect();
    }

    public async del(key: string) {
        await this.client.del(key);
    }

    public async exists(key: string): Promise<boolean> {
        const count = await this.client.exists(key);
        return count > 0;
    }

    public async expire(key: string, seconds: number) {
        await this.client.expire(key, seconds);
    }

    public async get(key: string): Promise<string> {
        return this.client.get(key);
    }

    public async geoadd(key: string, ...messages: GeoAddMessage[]): Promise<number> {
        let args = messages.reduce((memo: any[], r): any[] => {
            memo.push(r.longitude, r.latitude, r.member);
            return memo;
        }, []);
        return (this.client as any).geoadd(key, ...args);
    }

    public async geopos(key: string, ...members: string[]): Promise<[number, number][]> {
        const res = await (this.client as any).geopos(key, ...members);
        return res.map((r: [string, string]): [number, number] => {
            return [parseFloat(r[0]), parseFloat(r[1])];
        });
    }

    public async hdel(key: string, ...fields: string[]): Promise<number> {
        return this.client.hdel(key, fields);
    }

    public async hget(key: string, field: string): Promise<string> {
        return this.client.hget(key, field);
    }

    public async hgetall(key: string): Promise<{ [key: string]: string; }> {
        return await this.client.hgetall(key);
    }

    public async hlen(key: string): Promise<number> {
        return this.client.hlen(key);
    }

    public async hkeys(key: string): Promise<string[]> {
        return this.client.hkeys(key);
    }

    public async hset(key: string, field: string, value: string) {
        await this.client.hset(key, field, value);
    }

    public async hsetnx(key: string, field: string, value: string): Promise<boolean> {
        const res = await this.client.hsetnx(key, field, value);
        return res == 1;
    }

    public async incr(key: string): Promise<number> {
        return await this.client.incr(key);
    }

    public async lpop(key: string): Promise<string> {
        return this.client.lpop(key);
    }

    public async lpush(key: string, ...values: string[]): Promise<number> {
        return this.client.lpush(key, ...values);
    }

    public async lrange(key: string, start: number, stop: number): Promise<string[]> {
        return this.client.lrange(key, start, stop);
    }

    public async mget(...keys: string[]): Promise<string[]> {
        return this.client.mget(...keys);
    }

    public async publish(channel: string, message: any) {
        if (typeof message != 'string')
            message = JSON.stringify(message);
        await this.client.publish(channel, message);
    }

    public async rpop(key: string): Promise<string> {
        return this.client.rpop(key);
    }

    public async rpush(key: string, ...values: string[]): Promise<number> {
        return this.client.rpush(key, ...values);
    }

    public async set(key: string, value: string, ...args: any[]): Promise<boolean> {
        const res = await this.client.set(key, value, ...args);
        return res === 'OK';
    }

    public async subscribe(channel: string, callback: CallbackType) {
        this.m_SubCallbacks[channel] = callback;
        await this.sub.subscribe(channel);
    }

    public async time(): Promise<[string, string]> {
        return this.client.time();
    }

    public async ttl(key: string): Promise<number> {
        return this.client.ttl(key);
    }

    public async unsubscribe(...channels: string[]): Promise<void> {
        channels.forEach(r => {
            delete this.m_SubCallbacks[r];
        });
        await this.sub.unsubscribe(channels);
    }
}
