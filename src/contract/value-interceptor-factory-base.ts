import { IValueInterceptor } from './i-value-interceptor';

/**
 * 数值拦截器工厂
 */
export abstract class ValueInterceptorFactoryBase {
    /**
     * 创建数值拦截器
     * 
     * @param targetType 目标类型
     * @param valueType 数值类型
     */
    public abstract build(targetType: number, valueType: number): IValueInterceptor;
}