import { ValueInterceptorFactory } from './interceptor-factory';
import { IValueInterceptorService } from '../..';

export function ValueIntercept(targetType: number, valueType: number) {
    return function (ctor: new () => IValueInterceptorService) {
        ValueInterceptorFactory.register(targetType, valueType, ctor);
    };
}