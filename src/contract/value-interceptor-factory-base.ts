import { IValueInterceptor } from './i-value-interceptor';
import { contract } from '../model';

/**
 * 数值拦截器工厂
 */
export abstract class ValueInterceptorFactoryBase {
    /**
     * 创建数值拦截器
     * 
     * @param value 数值
     */
    public abstract build(value: contract.IValue): Promise<IValueInterceptor>;
}