import { IUnitOfWork } from './i-unit-of-work';

/**
 * 工作单元仓储
 */
export interface IUnitOfWorkRepository extends IUnitOfWork {
    /**
     * 注册新增
     * 
     * @param table 表
     * @param entry 实体
     */
    registerAdd(table: string, entry: any): void;

    /**
     * 注册删除
     * 
     * @param table 表
     * @param entry 实体
     */
    registerRemove(table: string, entry: any): void;
    
    /**
     * 注册更新
     * 
     * @param table 表
     * @param entry 实体
     */
    registerSave(table: string, entry: any): void;
}