import { CacheBase } from './cache-base';
import { IEnumItem } from './i-enum-item';
import { RedisBase } from './redis-base';
import { global } from '../model';

export abstract class EnumCacheBase extends CacheBase {
    public static buildItemFunc: (name: string, sep: string, itemEntry: any) => IEnumItem<any>;

    public constructor(
        protected sep: string,
        redis: RedisBase,
        cacheKey: string,
    ) {
        super(redis, cacheKey);
    }

    protected async load() {
        const entries = await this.find();
        return entries.reduce((memo, r) => {
            memo[r.id] = r.items.reduce((memo, cr) => {
                memo[cr.value] = EnumCacheBase.buildItemFunc(r.id, this.sep, cr);
                return memo;
            }, {});
            return memo;
        }, {});
    }

    protected abstract find(): Promise<global.Enum[]>;
}