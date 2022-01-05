import { IAssociateStorageService } from '../..';

/**
 * 缓存关联存储服务
 */
export class CacheAssociateStorageService implements IAssociateStorageService {
    /**
     * 关联数据缓存
     */
    private m_Associates: { [key: string]: any } = {};

    /**
     * 构造函数
     * 
     * @param m_FindFuncs 获取数据函数
     */
    public constructor(
        private m_FindFuncs: { [key: string]: () => Promise<any> }
    ) { }

    /**
     * 添加关联数据
     * 
     * @param model 模型
     * @param entry 实体
     */
    public add<T>(model: new () => T, entry: T) {
        if (!(model.name in this.m_Associates))
            this.m_Associates[model.name] = [];

        this.m_Associates[model.name].push(entry);
    }

    /**
     * 清除满足条件的数据
     * 
     * @param model 模型
     * @param filterFunc 过滤函数
     */
    public clear<T>(model: new () => T, filterFunc: (r: T) => boolean) {
        if (model.name in this.m_Associates) {
            this.m_Associates[model.name] = (this.m_Associates[model.name] as T[]).filter(r => {
                return !filterFunc(r);
            });
        }
    }

    /**
     * 获取满足条件的数据
     * 
     * @param model 模型
     * @param filterFunc 过滤函数=
     */
    public async find<T>(model: new () => T, filterFunc: (r: T) => boolean) {
        const findFunc = this.m_FindFuncs[model.name];
        if (!findFunc)
            throw new Error(`缺少获取函数: ${model.name}`);

        if (!this.m_Associates[model.name])
            this.m_Associates[model.name] = await findFunc();

        return (this.m_Associates[model.name] as T[]).filter(filterFunc);
    }
}