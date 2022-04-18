import { IUnitOfWork } from '../../contract';

/**
 * 工作单元基类
 */
export abstract class UnitOfWorkBase implements IUnitOfWork {
    /**
     * 提交后执行的函数
     */
    private m_AfterActions: (() => Promise<void>)[] = [];

    /**
     * 提交
     */
    public async commit() {
        await this.onCommit();

        for (const r of this.m_AfterActions)
            await r();
        this.m_AfterActions = [];
    }

    /**
     * 提交事务
     */
    protected abstract onCommit(): Promise<void>;

    /**
     * 注册提交后函数
     * 
     * @param action 函数
     */
    public registerAfter(action: () => Promise<void>) {
        this.m_AfterActions.push(action);
    }
}