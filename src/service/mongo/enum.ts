import { TracerStrategy } from '../tracer';
import { DbFactoryBase, ICache, IEnum, IEnumItem, IEnumItemData, ITraceable, IUnitOfWork } from '../../contract';
import { global } from '../../model';

/**
 * mongo枚举
 */
export class MongoEnum<T extends IEnumItemData> implements IEnum<T>, ITraceable<IEnum<T>> {
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
        private m_DbFactory: DbFactoryBase,
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
     * 更新枚举数据
     * 
     * @param data 枚举数据
     * @param uow 工作单元
     */
    public async update(data: T, uow?: IUnitOfWork) {
        const items = await this.items;
        const newEnumItems = items.map(r => {
            if (data.value == r.data.value) {
                return {
                    ...r.data,
                    ...data
                };
            }
            return r.data;
        });
        const db = this.m_DbFactory.db(global.Enum, uow);
        const enums = await db.query().where({
            id: this.m_Name
        }).toArray();
        if (enums?.length) {
            await db.save({
                id: this.m_Name,
                items: newEnumItems
            });
        }
        this.m_Cache.flush();
    }

    /**
     * 跟踪
     * 
     * @param parentSpan 父跟踪范围
     */
    public withTrace(parentSpan: any) {
        return new MongoEnum(
            new TracerStrategy(this.m_Cache).withTrace(parentSpan),
            this.m_DbFactory,
            this.m_Name,
        ) as IEnum<T>;
    }
}