import { ModelStatic, Sequelize } from 'sequelize';

import { model } from '../..';

/**
 * Sequelize模型管理
 */
export class SequelizeModelPool {
    /**
     * seq模型
     */
    private m_Models = {};

    /**
     * 构造函数
     * 
     * @param m_Seq Sequelize实例
     */
    public constructor(
        private m_Seq: Sequelize
    ) { }

    /**
     * 获取Sequelize模型
     * 
     * @param modelName 模型名
     */
    public get(modelName: string) {
        if (!this.m_Models[modelName]) {
            const fields = model.sequelize.defines[modelName];
            if (!fields)
                throw new Error(`缺少模型: ${modelName}`);

            this.m_Models[modelName] = this.m_Seq.define(model.sequelize.tables[modelName] ?? modelName, fields, {
                timestamps: false
            });
        }

        return this.m_Models[modelName] as ModelStatic<any>;
    }
}