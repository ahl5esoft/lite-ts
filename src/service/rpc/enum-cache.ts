import { MemoryCache } from '../cache';
import { EnumItem } from '../enum';
import { TracerStrategy } from '../tracer';
import { ICache, ITraceable, NowTimeBase, RpcBase } from '../../contract';
import { global } from '../../model';

/**
 * rpc枚举缓存
 */
export class RpcEnumCache implements ICache, ITraceable<ICache> {
    private m_Cache: ICache;
    /**
     * 缓存
     */
    protected get cache() {
        if (!this.m_Cache) {
            this.m_Cache = new MemoryCache(this.m_NowTime, async () => {
                const resp = await this.m_Rpc.call<global.Enum[]>(`/${this.m_App}/ih/find-all-enums`);
                return resp.data.reduce((memo, r) => {
                    memo[r.id] = r.items.map(cr => {
                        return new EnumItem(cr, r.id, this.m_Sep);
                    });
                    return memo;
                }, {});
            });
        }

        return this.m_Cache;
    }

    /**
     * 构造函数
     * 
     * @param m_NowTime 当前时间
     * @param m_Rpc 远程过程调用
     * @param m_App 应用
     * @param m_Sep 分隔符, 默认: '-'
     */
    public constructor(
        private m_NowTime: NowTimeBase,
        private m_Rpc: RpcBase,
        private m_App: string,
        private m_Sep = '-'
    ) { }

    /**
     * 清空
     */
    public flush() {
        this.cache.flush();
    }

    /**
     * 获取
     * 
     * @param key 键
     */
    public async get<T>(key: string) {
        return this.cache.get<T>(key);
    }

    /**
     * 跟踪
     * 
     * @param parentSpan 父跟踪范围
     */
    public withTrace(parentSpan: any) {
        return new RpcEnumCache(
            this.m_NowTime,
            new TracerStrategy(this.m_Rpc).withTrace(parentSpan),
            this.m_App,
            this.m_Sep
        );
    }
}