import { CacheBase, EnumFactoryBase, ValueTypeServiceBase } from '../../contract';
import { enum_ } from '../../model';

/**
 * 缓存数值类型服务
 */
export class CacheValueTypeSerivce extends ValueTypeServiceBase {
    /**
     * 更新时间
     */
    private m_UpdateOn = 0;

    /**
     * 构造函数
     * 
     * @param m_PropCahce 道具缓存
     * @param m_EnumFactory 枚举工厂
     * @param m_ReduceFunc 聚合函数
     */
    public constructor(
        private m_PropCahce: CacheBase,
        private m_EnumFactory: EnumFactoryBase,
        private m_ReduceFunc: { [key: string]: (memo: any, item: enum_.ValueTypeData) => any },
    ) {
        super();

        m_ReduceFunc.openRewards = (memo, r) => {
            if (r.openRewards)
                memo[r.value] = r.openRewards;

            return memo;
        };
        m_ReduceFunc.rewardAddition = (memo, r) => {
            if (r.rewardAddition) {
                memo[r.rewardAddition.valueType] ??= {};
                memo[r.rewardAddition.valueType][r.rewardAddition.rewardValueType] = r.value;
            }

            return memo;
        };
    }

    /**
     * 获取数据
     * 
     * @param key 键
     */
    public async get<T>(key: string) {
        await this.reset();
        return this[key] as T;
    }

    /**
     * 重置
     */
    private async reset() {
        if (this.m_UpdateOn == this.m_PropCahce.updateOn)
            return;

        this.m_UpdateOn = this.m_PropCahce.updateOn;

        const items = await this.m_EnumFactory.build(enum_.ValueTypeData).items;
        for (const r of items) {
            for (const [k, v] of Object.entries(this.m_ReduceFunc)) {
                this[k] ??= {};
                this[k] = v(this[k], r.data);
            }
        }
    }
}