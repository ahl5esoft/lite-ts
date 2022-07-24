import { contract } from '../model';

/**
 * Redis接口
 */
export abstract class RedisBase {
    /**
     * 弹出列表左边项(阻塞)
     * 
     * @param timeout 等待时间
     * @param keys 弹出列表数组
     */
    public abstract blpop(timeout: number, ...keys: string[]): Promise<[string, string]>;

    /**
     * 弹出列表右边的项(阻塞)
     * 
     * @param timeout 等待时间
     * @param keys 弹出列表数组
     */
    public abstract brpop(timeout: number, ...keys: string[]): Promise<[string, string]>;

    /**
     * 关闭
     */
    public abstract close(): void;

    /**
     * 删除
     * 
     * @param key 键
     */
    public abstract del(key: string): Promise<void>;

    /**
     * 判断键是否存在
     * 
     * @param key 键
     */
    public abstract exists(key: string): Promise<boolean>;

    /**
     * 设置过期时间
     * 
     * @param key 键
     * @param seconds 秒数
     */
    public abstract expire(key: string, seconds: number): Promise<void>;

    /**
     * 获取键的字符串
     * 
     * @param key 键
     */
    public abstract get(key: string): Promise<string>;

    /**
     * 增加geo
     * 
     * @param key 键
     * @param datas geo数据数组 
     */
    public abstract geoadd(key: string, ...datas: contract.IRedisGeo[]): Promise<number>;

    /**
     * 获取坐标
     * 
     * @param key 键
     * @param members 成员
     */
    public abstract geopos(key: string, ...members: string[]): Promise<[number, number][]>;

    /**
     * 删除hash字段
     * 
     * @param key 键
     * @param fields 字段
     */
    public abstract hdel(key: string, ...fields: string[]): Promise<number>;

    /**
     * 获取hash值
     * 
     * @param key 键
     * @param field 字段
     */
    public abstract hget(key: string, field: string): Promise<string>;

    /**
     * 获取hash
     * 
     * @param key 键
     */
    public abstract hgetall(key: string): Promise<{ [key: string]: string }>;

    /**
     * hash长度
     * 
     * @param key 键
     */
    public abstract hlen(key: string): Promise<number>;

    /**
     * 获取hash所有键
     * 
     * @param key 键
     */
    public abstract hkeys(key: string): Promise<string[]>;

    /**
     * 设置hash字段的值
     * 
     * @param key 键
     * @param field 字段
     * @param value 值
     */
    public abstract hset(key: string, field: string, value: string): Promise<void>;

    /**
     * 设置hash不存在的字段的值
     * 
     * @param key 键
     * @param field 字段
     * @param value 值
     */
    public abstract hsetnx(key: string, field: string, value: string): Promise<boolean>;

    /**
     * 自增+1
     * 
     * @param key 键
     */
    public abstract incr(key: string): Promise<number>;

    /**
     * 自增(+n)
     * 
     * @param key 键
     * @param increment 自增值
     */
    public abstract incrBy(key: string, increment: number): Promise<number>;

    /**
     * 查询键
     * 
     * @param pattern 匹配模式
     */
    public abstract keys(pattern: string): Promise<string[]>;

    /**
     * 弹出列表左边项
     * 
     * @param key 键
     */
    public abstract lpop(key: string): Promise<string>;

    /**
     * 从列表左边插入项
     * 
     * @param key 键
     * @param values 项数组
     */
    public abstract lpush(key: string, ...values: string[]): Promise<number>;

    /**
     * 获取列表下标区间的项
     * 
     * @param key 键
     * @param start 开始下标
     * @param stop 结束下标, -1最后一个, -2最后第二个
     */
    public abstract lrange(key: string, start: number, stop: number): Promise<string[]>;

    /**
     * 获取多个字符串键的值
     * 
     * @param keys 键数组
     */
    public abstract mget(...keys: string[]): Promise<string[]>;

    /**
     * 从列表右边弹出
     * 
     * @param key 键
     */
    public abstract rpop(key: string): Promise<string>;

    /**
     * 从列表右边插入
     * 
     * @param key 键
     * @param values 值数组
     */
    public abstract rpush(key: string, ...values: string[]): Promise<number>;

    /**
     * 设置字符串键的值
     * 
     * @param key 键
     * @param value 值
     * @param args 扩展参数
     */
    public abstract set(key: string, value: string, ...args: any[]): Promise<boolean>;

    /**
     * 获取redis时间
     */
    public abstract time(): Promise<[string, string]>;

    /**
     * 获取键的剩余生存时间
     * 
     * @param key 键
     */
    public abstract ttl(key: string): Promise<number>;
}