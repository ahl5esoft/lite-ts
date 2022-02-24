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
     * @param modelCtor 模型
     */
    public get(modelCtor: Function) {
        if (!this.m_Models[modelCtor.name]) {
            const fields = model.sequelize.defines[modelCtor.name];
            if (!fields)
                throw new Error(`缺少模型: ${modelCtor.name}`);

            this.m_Models[modelCtor.name] = this.m_Seq.define(modelCtor.name, fields, {
                timestamps: false
            });
        }

        return this.m_Models[modelCtor.name] as ModelStatic<any>;
    }
}