import { DataType, ModelAttributeColumnOptions } from 'sequelize';

/**
 * 定义字段
 */
export const defines: {
    [model: string]: {
        [field: string]: DataType | ModelAttributeColumnOptions<any>
    }
} = {};