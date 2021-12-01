import { IValueInterceptorService } from './i-value-interceptor-service';

export abstract class ValueInterceptorFactoryBase {
    public abstract build(targetType: number, valueType: number): IValueInterceptorService;
}