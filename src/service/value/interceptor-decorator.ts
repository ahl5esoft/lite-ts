import { valueInterceptorCtor } from './interceptor-metadata';
import { IValueInterceptor } from '../../contract';

/**
 * 数值拦截装饰器
 * 
 * @param valueType 数值类型
 */
export function ValueIntercept(valueType: number) {
    return function (ctor: new () => IValueInterceptor) {
        valueInterceptorCtor[valueType] = ctor;
    };
}