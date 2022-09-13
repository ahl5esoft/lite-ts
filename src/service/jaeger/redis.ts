import { opentracing } from 'jaeger-client';

import { ITraceable, RedisBase } from '../../contract';
import { contract } from '../../model';

/**
 * jeager redis
 */
export class JeagerRedis extends RedisBase implements ITraceable<RedisBase> {
    private m_TracerSpan: opentracing.Span;

    /**
     * 构造函数
     * 
     * @param m_Redis redis实例
     * @param parentTracerSpan 父跟踪范围
     */
    public constructor(
        private m_Redis: RedisBase,
        parentTracerSpan?: opentracing.Span
    ) {
        super();

        this.m_TracerSpan = parentTracerSpan ? opentracing.globalTracer().startSpan('redis', {
            childOf: parentTracerSpan
        }) : null;
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

    public async geoadd(key: string, ...values: contract.IRedisGeo[]) {
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

    public async incrBy(key: string, increment: number) {
        return this.exec('incrBy', [key, increment], {
            key,
            increment
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

    /**
     * 跟踪
     * 
     * @param parentSpan 父范围
     */
    public withTrace(parentSpan: any) {
        return parentSpan ? new JeagerRedis(this.m_Redis, parentSpan) : this;
    }

    /**
     * 执行
     * 
     * @param cmd 命令
     * @param args 参数
     * @param logData 日志数据
     */
    private async exec(cmd: string, args: any[], logData: { [key: string]: any; }) {
        try {
            const res = await this.m_Redis[cmd].bind(this.m_Redis).apply(this.m_Redis, args);

            this.m_TracerSpan?.setTag?.(opentracing.Tags.COMPONENT, cmd)?.log?.({
                ...logData,
                result: res
            });

            return res;
        } catch (ex) {
            this.m_TracerSpan?.log?.({
                err: ex
            })?.setTag?.(opentracing.Tags.ERROR, true);

            throw ex;
        } finally {
            this.m_TracerSpan?.finish?.();
        }
    }
}