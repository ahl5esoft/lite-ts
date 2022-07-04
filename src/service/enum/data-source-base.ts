import { EnumItem } from './item';
import { global } from '../../model';

/**
 * 枚举数据源基类
 */
export abstract class EnumDataSourceBase {
    /**
     * 构造函数
     * 
     * @param m_Sep 分隔符
     */
    public constructor(
        private m_Sep: string,
    ) { }

    /**
     * 获取枚举
     */
    public async findEnums() {
        const entries = await this.load();
        return entries.reduce((memo, r) => {
            memo[r.id] = r.items.reduce((memo, cr) => {
                memo[cr.value] = new EnumItem(cr, r.id, this.m_Sep);
                return memo;
            }, {});
            return memo;
        }, {});
    }

    /**
     * 加载
     */
    protected abstract load(): Promise<global.Enum[]>;
}