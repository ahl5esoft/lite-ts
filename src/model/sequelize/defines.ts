import { DataType, ModelAttributeColumnOptions } from 'sequelize';

/**
 * 定义字段
 */
export const defines: {
    [model: string]: {
        [field: string]: DataType | ModelAttributeColumnOptions<any>;
    };
} = {};

/**
 * 数据库表名
 */
export const tables: {
    [model: string]: string;
} = {};