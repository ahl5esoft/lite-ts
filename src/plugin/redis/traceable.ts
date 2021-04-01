import { ITraceable, TraceFactoryBase } from '../../runtime';
import { GeoAddMessage, RedisBase } from './base';

export class TraceableRedis extends RedisBase implements ITraceable {
    public traceID: string;

    public traceSpanID: string;

    public constructor(
        private m_Redis: RedisBase,
        private m_TraceFactory: TraceFactoryBase
    ) {
        super();
    }

    public close() {
        this.m_Redis.close();
    }

    public async del(key: string) {
        return this.exec('del', [key], () => {
            return this.m_Redis.del(key);
        });
    }

    public async exists(key: string): Promise<boolean> {
        return this.exec('exists', [key], () => {
            return this.m_Redis.exists(key);
        });
    }

    public async expire(key: string, seconds: number) {
        return this.exec('expire', [key, seconds], () => {
            return this.m_Redis.expire(key, seconds);
        });
    }

    public async get(key: string): Promise<string> {
        return this.exec('get', [key], () => {
            return this.m_Redis.get(key);
        });
    }

    public async geoadd(key: string, ...messages: GeoAddMessage[]): Promise<number> {
        return this.exec('geoadd', [key, messages], () => {
            return this.m_Redis.geoadd(key, ...messages);
        });
    }

    public async geopos(key: string, ...members: string[]): Promise<[number, number][]> {
        return this.exec('geopos', [key, members], () => {
            return this.m_Redis.geopos(key, ...members);
        });
    }

    public async hdel(key: string, ...fields: string[]): Promise<number> {
        return this.exec('hdel', [key, fields], () => {
            return this.m_Redis.hdel(key, ...fields);
        });
    }

    public async hget(key: string, field: string): Promise<string> {
        return this.exec('hget', [key, field], () => {
            return this.m_Redis.hget(key, field);
        });
    }

    public async hgetall(key: string): Promise<{ [key: string]: string; }> {
        return this.exec('hgetall', [key], () => {
            return this.m_Redis.hgetall(key);
        });
    }

    public async hlen(key: string): Promise<number> {
        return this.exec('hlen', [key], () => {
            return this.m_Redis.hlen(key);
        });
    }

    public async hkeys(key: string): Promise<string[]> {
        return this.exec('hkeys', [key], () => {
            return this.m_Redis.hkeys(key);
        });
    }

    public async hset(key: string, field: string, value: string) {
        return this.exec('hset', [key, field, value], () => {
            return this.m_Redis.hset(key, field, value);
        });
    }

    public async hsetnx(key: string, field: string, value: string): Promise<boolean> {
        return this.exec('hsetnx', [key, field, value], () => {
            return this.m_Redis.hsetnx(key, field, value);
        });
    }

    public async incr(key: string): Promise<number> {
        return this.exec('incr', [key], () => {
            return this.m_Redis.incr(key);
        });
    }

    public async lpop(key: string): Promise<string> {
        return this.exec('lpop', [key], () => {
            return this.m_Redis.lpop(key);
        });
    }

    public async lpush(key: string, ...values: string[]): Promise<number> {
        return this.exec('lpush', [key, values], () => {
            return this.m_Redis.lpush(key, ...values);
        });
    }

    public async lrange(key: string, start: number, stop: number): Promise<string[]> {
        return this.exec('lrange', [key, start, stop], () => {
            return this.m_Redis.lrange(key, start, stop);
        });
    }

    public async mget(...keys: string[]): Promise<string[]> {
        return this.exec('mget', [keys], () => {
            return this.m_Redis.mget(...keys);
        });
    }

    public async rpop(key: string): Promise<string> {
        return this.exec('rpop', [key], () => {
            return this.m_Redis.rpop(key);
        });
    }

    public async rpush(key: string, ...values: string[]): Promise<number> {
        return this.exec('rpush', [key, values], () => {
            return this.m_Redis.rpush(key, ...values);
        });
    }

    public async set(key: string, value: string, ...args: any[]): Promise<boolean> {
        return this.exec('set', [key, value, args], () => {
            return this.m_Redis.set(key, value, ...args);
        });
    }

    public async time(): Promise<[string, string]> {
        return this.exec('time', null, () => {
            return this.m_Redis.time();
        });
    }

    public async ttl(key: string): Promise<number> {
        return this.exec('ttl', [key], () => {
            return this.m_Redis.ttl(key);
        });
    }

    private async exec<T>(name: string, args: any[], fn: () => Promise<T>): Promise<T> {
        const trace = this.m_TraceFactory.build(this.traceID);
        const traceSpan = trace.createSpan(this.traceSpanID);
        await traceSpan.begin('redis');
        traceSpan.addLabel('action', name);
        if (args)
            traceSpan.addLabel('args', args);
        return fn().finally(() => {
            traceSpan.end().catch(console.log);
        });
    }
}