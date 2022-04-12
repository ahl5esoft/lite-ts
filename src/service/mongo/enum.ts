import { ICache, IEnum, IEnumItem, IEnumItemData, ITraceable } from '../../contract';

/**
 * mongo枚举
 */
export class MongoEnum<T extends IEnumItemData> implements IEnum<T>, ITraceable {
    /**
     * 所有枚举项
     */
    public get items() {
        return new Promise<IEnumItem<T>[]>(async (s, f) => {
            try {
                const res = await this.m_Cache.get<IEnumItem<T>[]>(this.m_Name);
                s(res ?? []);
            } catch (ex) {
                f(ex);
            }
        });
    }

    /**
     * 构造函数
     * 
     * @param m_Cache 缓存
     * @param m_Name 枚举名
     */
    public constructor(
        private m_Cache: ICache,
        private m_Name: string,
    ) { }

    /**
     * 获取第一个满足条件的项
     * 
     * @param predicate 断言
     */
    public async get(predicate: (data: T) => boolean) {
        const items = await this.items;
        return items.find(r => {
            return predicate(r.data);
        });
    }

    /**
     * 跟踪
     * 
     * @param parentSpan 父跟踪范围
     */
    public withTrace(parentSpan: any) {
        return new MongoEnum(
            (this.m_Cache as any as ITraceable)?.withTrace(parentSpan) ?? this.m_Cache,
            this.m_Name,
        );
    }
}