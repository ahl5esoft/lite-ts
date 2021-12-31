/**
 * 关联表存储服务
 */
export interface IAssociateStorageService {
    /**
     * 增加关联
     * 
     * @param model 表模型函数
     * @param entry 试图
     */
    add<T>(model: new () => T, entry: T): void;

    /**
     * 清除关联
     * 
     * @param model 表模型函数
     * @param filterFunc 筛选函数
     */
    clear<T>(model: new () => T, filterFunc: (r: T) => boolean): void;

    /**
     * 获取关联数据
     * 
     * @param model 表模型函数
     * @param filterFunc 筛选函数
     */
    find<T>(model: new () => T, filterFunc: (r: T) => boolean): Promise<T[]>;
}