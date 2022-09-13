import { EnumItem } from './item';
import { CacheBase, RedisBase } from '../../contract';
import { global } from '../../model';

/**
 * 枚举缓存基类
 */
export abstract class EnumCacheBase extends CacheBase {
    /**
     * 构造函数
     * 
     * @param sep 分隔符
     * @param redis redis
     * @param cacheKey 缓存键
     */
    public constructor(
        protected sep: string,
        redis: RedisBase,
        cacheKey: string,
    ) {
        super(redis, cacheKey);
    }

    /**
     * 获取枚举
     */
    protected async load() {
        const entries = await this.find();
        return entries.reduce((memo, r) => {
            memo[r.id] = r.items.reduce((memo, cr) => {
                memo[cr.value] = new EnumItem(cr, r.id, this.sep);
                return memo;
            }, {});
            return memo;
        }, {});
    }

    /**
     * 加载
     */
    protected abstract find(): Promise<global.Enum[]>;
}