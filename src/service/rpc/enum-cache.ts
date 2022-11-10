import { EnumCacheBase } from '../enum';
import { TracerStrategy } from '../tracer';
import { RedisBase, RpcBase } from '../../contract';
import { global } from '../../model';

/**
 * rpc枚举缓存
 */
export class RpcEnumCache extends EnumCacheBase {
    /**
     * 构造函数
     * 
     * @param m_Rpc 远程过程调用
     * @param m_App 应用
     * @param redis redis
     * @param cacheKey 缓存键
     * @param sep 分隔符
     */
    public constructor(
        private m_Rpc: RpcBase,
        private m_App: string,
        redis: RedisBase,
        cacheKey: string,
        sep: string,
    ) {
        super(sep, redis, cacheKey);
    }

    /**
     * 跟踪
     * 
     * @param parentSpan 父范围
     */
    public withTrace(parentSpan: any) {
        return parentSpan ? new RpcEnumCache(
            new TracerStrategy(this.m_Rpc).withTrace(parentSpan),
            this.m_App,
            new TracerStrategy(this.redis).withTrace(parentSpan),
            this.cacheKey,
            this.sep
        ) : this;
    }

    /**
     * 查询
     */
    protected async find() {
        return await this.m_Rpc.call<global.Enum[]>({
            route: `/${this.m_App}/find-all-enums`
        });
    }
}
