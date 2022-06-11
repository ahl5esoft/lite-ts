/**
 * 工作单元(事务)
 */
export interface IUnitOfWork {
    /**
     * 提交事务
     */
    commit(): Promise<void>;

    /**
     * 注册事务提交后执行的方法
     * 
     * @param action 方法
     * @param key 相同键会覆盖
     */
    registerAfter(action: () => Promise<void>, key?: string): void;
}
