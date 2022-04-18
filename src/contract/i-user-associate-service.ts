/**
 * 用户关联服务
 */
export interface IUserAssociateService {
    /**
     * 添加关联数据
     * 
     * @param key 键
     * @param entry 实体
     */
    add(key: string, entry: any): Promise<void>;
    /**
     * 获取满足条件的数据
     * 
     * @param key 键
     * @param predicate 断言
     */
    find<T>(key: string, predicate: (r: T) => boolean): Promise<T[]>;
    /**
     * 获取并清除满足条件的数据
     * 
     * @param key 键
     * @param predicate 断言
     */
    findAndClear<T>(key: string, predicate: (r: T) => boolean): Promise<T[]>;
}