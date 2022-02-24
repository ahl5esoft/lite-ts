import { defines } from './defines';

/**
 * Sequelize字段定义装饰器
 * 
 * @param define 字段定义
 */
export function Field(define: string): PropertyDecorator {
    return (target: any, field: string) => {
        if (!defines[target.constructor.name])
            defines[target.constructor.name] = {};

        defines[target.constructor.name][field] = define;
    };
}