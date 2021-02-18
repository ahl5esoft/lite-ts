export abstract class RedisBase {
    public abstract close(): void;
    public abstract del(key: string): Promise<void>;
    public abstract exists(key: string): Promise<boolean>;
    public abstract expire(key: string, seconds: number): Promise<void>;
    public abstract get(key: string): Promise<string>;
    public abstract geoadd(key: string, ...messages: GeoAddMessage[]): Promise<number>;
    public abstract geopos(key: string, ...members: string[]): Promise<[number, number][]>;
    public abstract hdel(key: string, ...fields: string[]): Promise<number>;
    public abstract hget(key: string, field: string): Promise<string>;
    public abstract hgetall(key: string): Promise<{ [key: string]: string }>;
    public abstract hlen(key: string): Promise<number>;
    public abstract hkeys(key: string): Promise<string[]>;
    public abstract hset(key: string, field: string, value: string): Promise<void>;
    public abstract hsetnx(key: string, field: string, value: string): Promise<boolean>;
    public abstract incr(key: string): Promise<number>;
    public abstract lpop(key: string): Promise<string>;
    public abstract lpush(key: string, ...values: string[]): Promise<number>;
    public abstract lrange(key: string, start: number, stop: number): Promise<string[]>;
    public abstract mget(...keys: string[]): Promise<string[]>;
    public abstract rpop(key: string): Promise<string>;
    public abstract rpush(key: string, ...values: string[]): Promise<number>;
    public abstract set(key: string, value: string, ...args: any[]): Promise<boolean>;
    public abstract time(): Promise<[string, string]>;
    public abstract ttl(key: string): Promise<number>;
}

export class GeoAddMessage {
    public latitude: number;

    public longitude: number;
    
    public member: string;
}