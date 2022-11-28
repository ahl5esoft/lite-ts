import { DataType, ModelAttributeColumnOptions } from 'sequelize';

import { defines, tables } from './defines';

/**
 * Sequelize字段定义装饰器
 * 
 * @param define 字段定义
 */
export function Field(define: DataType | ModelAttributeColumnOptions<any>): PropertyDecorator {
    return (target: any, field: string) => {
        if (!defines[target.constructor.name])
            defines[target.constructor.name] = {};

        if (typeof define == 'function' || typeof define == 'string') {
            define = {
                allowNull: false,
                type: define,
            };
        } else {
            (define as ModelAttributeColumnOptions<any>).allowNull = false;
        }

        defines[target.constructor.name][field] = define;
    };
}

/**
 * Sequelize表定义装饰器
 * 
 * @param name 字段定义
 */
export function Table(name: string): PropertyDecorator {
    return (target: any) => {
        tables[target.constructor.name] = name;
    };
}