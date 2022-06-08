import { IValueInterceptor } from '../../contract';

/**
 * 数值拦截构造器
 */
export const valueInterceptorCtor: { [valueType: number]: new () => IValueInterceptor } = {};