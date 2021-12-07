import { ValueInterceptorFactory } from './interceptor-factory';
import { IValueInterceptor } from '../..';

export function ValueIntercept(targetType: number, valueType: number) {
    return function (ctor: new () => IValueInterceptor) {
        ValueInterceptorFactory.register(targetType, valueType, ctor);
    };
}