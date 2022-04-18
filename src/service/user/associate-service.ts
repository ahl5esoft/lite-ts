/**
 * 缓存关联存储服务
 */
export class UserAssociateService {
    /**
     * 关联数据缓存
     */
    private m_Associates: { [key: string]: any[] } = {};

    /**
     * 构造函数
     * 
     * @param m_FindFuncs 获取数据函数
     */
    public constructor(
        private m_FindFuncs: { [key: string]: () => Promise<any[]> }
    ) { }

    /**
     * 添加关联数据
     * 
     * @param key 键
     * @param entry 实体
     */
    public add(key: string, entry: any) {
        this.m_Associates[key] ??= [];
        this.m_Associates[key].push(entry);
    }

    /**
     * 获取满足条件的数据
     * 
     * @param key 键
     * @param predicate 断言
     */
    public async find<T>(key: string, predicate: (r: T) => boolean) {
        const findFunc = this.m_FindFuncs[key];
        if (!findFunc)
            throw new Error(`UserAssociateService.find: ${key}`);

        if (!this.m_Associates[key])
            this.m_Associates[key] = await findFunc();

        return this.m_Associates[key].filter(predicate);
    }

    /**
     * 获取并清除满足条件的数据
     * 
     * @param key 键
     * @param predicate 断言
     */
    public async findAndClear<T>(key: string, predicate: (r: T) => boolean) {
        const entries = await this.find(key, predicate);
        this.m_Associates[key] = this.m_Associates[key].filter(r => {
            return !predicate(r);
        });
        return entries;
    }
}