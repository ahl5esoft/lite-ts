import { opentracing } from 'jaeger-client';

import { IRedisGeoData, RedisBase } from '../..';

export class JeagerRedis extends RedisBase {
    private m_Span: opentracing.Span;
    protected get span() {
        if (!this.m_Span) {
            this.m_Span = opentracing.globalTracer().startSpan('redis', {
                childOf: this.m_ParentSpan
            });
        }

        return this.m_Span;
    }

    public constructor(
        private m_Redis: RedisBase,
        private m_ParentSpan?: opentracing.Span
    ) {
        super();
    }

    public async blpop(timeout: number, ...keys: string[]) {
        return await this.exec('blpop', [timeout, ...keys], {
            keys,
            timeout,
        });
    }

    public async brpop(timeout: number, ...keys: string[]) {
        return await this.exec('brpop', [timeout, ...keys], {
            keys,
            timeout,
        });
    }

    public close() {
        this.m_Redis.close();
    }

    public async del(key: string) {
        return await this.exec('del', [key], {
            key
        });
    }

    public async exists(key: string) {
        return await this.exec('exists', [key], {
            key
        });
    }

    public async expire(key: string, seconds: number) {
        return await this.exec('expire', [key, seconds], {
            key,
            seconds
        });
    }

    public async get(key: string) {
        return await this.exec('get', [key], {
            key
        });
    }

    public async geoadd(key: string, ...values: IRedisGeoData[]) {
        return await this.exec('geoadd', [key, ...values], {
            key,
            values
        });
    }

    public async geopos(key: string, ...members: string[]) {
        return await this.exec('geopos', [key, ...members], {
            key,
            members
        });
    }

    public async hdel(key: string, ...fields: string[]) {
        return await this.exec('hdel', [key, ...fields], {
            key,
            fields
        });
    }

    public async hget(key: string, field: string) {
        return await this.exec('hget', [key, field], {
            key,
            field
        });
    }

    public async hgetall(key: string) {
        return await this.exec('hgetall', [key], {
            key
        });
    }

    public async hlen(key: string) {
        return await this.exec('hlen', [key], {
            key
        });
    }

    public async hkeys(key: string) {
        return await this.exec('hkeys', [key], {
            key
        });
    }

    public async hset(key: string, field: string, value: string) {
        return await this.exec('hset', [key, field, value], {
            field,
            key,
            value
        });
    }

    public async hsetnx(key: string, field: string, value: string) {
        return await this.exec('hsetnx', [key, field, value], {
            field,
            key,
            value
        });
    }

    public async incr(key: string) {
        return await this.exec('incr', [key], {
            key
        });
    }

    public async keys(pattern: string) {
        return await this.exec('keys', [pattern], {
            pattern
        });
    }

    public async lpop(key: string) {
        return await this.exec('lpop', [key], {
            key
        });
    }

    public async lpush(key: string, ...values: string[]) {
        return await this.exec('lpush', [key, ...values], {
            key,
            values
        });
    }

    public async lrange(key: string, start: number, stop: number) {
        return await this.exec('lrange', [key, start, stop], {
            key,
            start,
            stop
        });
    }

    public async mget(...keys: string[]) {
        return await this.exec('mget', keys, {
            keys
        });
    }

    public async rpop(key: string) {
        return await this.exec('rpop', [key], {
            key
        });
    }

    public async rpush(key: string, ...values: string[]) {
        return await this.exec('rpush', [key, ...values], {
            key,
            values
        });
    }

    public async set(key: string, value: string, ...args: any[]) {
        return await this.exec('set', [key, value, ...args], {
            args,
            key,
            value,
        });
    }

    public async time() {
        return this.m_Redis.time();
    }

    public async ttl(key: string) {
        return this.m_Redis.ttl(key);
    }

    private async exec(cmd: string, args: any[], logData: { [key: string]: any; }) {
        try {
            const res = await this.m_Redis[cmd].bind(this.m_Redis).apply(this.m_Redis, args);
            this.span.setTag(opentracing.Tags.COMPONENT, cmd).log({
                ...logData,
                result: res
            });
            return res;
        } catch (ex) {
            throw ex;
        } finally {
            this.span.finish();
        }
    }
}