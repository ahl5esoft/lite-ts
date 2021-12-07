import { IValueInterceptor } from './i-value-interceptor';

export abstract class ValueInterceptorFactoryBase {
    public abstract build(targetType: number, valueType: number): IValueInterceptor;
}