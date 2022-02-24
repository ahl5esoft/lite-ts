import { Sequelize, Transaction } from 'sequelize';

import { SequelizeModelPool } from './model-pool';
import { UnitOfWorkRepositoryBase } from '../..';

/**
 * sequelize工作单元仓储
 */
export class SequelizeUnitOfWork extends UnitOfWorkRepositoryBase {
    /**
     * 函数
     */
    private m_Actons: ((tx: Transaction) => Promise<void>)[] = [];

    /**
     * 构造函数
     * 
     * @param m_Seq Sequelize对象
     * @param m_SeqModelPool Sequelize模型池
     */
    public constructor(
        private m_Seq: Sequelize,
        private m_SeqModelPool: SequelizeModelPool,
    ) {
        super();
    }

    /**
     * 提交事务
     */
    public async commit() {
        const tx = await this.m_Seq.transaction();
        try {
            for (const r of this.m_Actons)
                await r(tx);

            await tx.commit();
        } catch (ex) {
            await tx.rollback();
            throw ex;
        }
    }

    /**
     * 注册新增
     * 
     * @param model 模型
     * @param entry 实体
     */
    public registerAdd(model: Function, entry: any) {
        this.m_Actons.push(async tx => {
            await this.m_SeqModelPool.get(model).create(entry, {
                transaction: tx
            });
        });
    }

    /**
     * 注册删除
     * 
     * @param model 模型
     * @param entry 实体
     */
    public registerRemove(model: Function, entry: any): void {
        this.m_Actons.push(async tx => {
            await this.m_SeqModelPool.get(model).destroy({
                transaction: tx,
                where: {
                    id: entry.id
                },
            });
        });
    }

    /**
     * 注册更新
     * 
     * @param model 模型
     * @param entry 实体
     */
    public registerSave(model: Function, entry: any): void {
        this.m_Actons.push(async tx => {
            await this.m_SeqModelPool.get(model).update(entry, {
                transaction: tx,
                where: {
                    id: entry.id
                },
            });
        });
    }
}