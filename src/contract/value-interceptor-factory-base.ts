import { IValueInterceptor } from './i-value-interceptor';
import { contract } from '../model';

export abstract class ValueInterceptorFactoryBase {
    public abstract build(value: contract.IValue): Promise<IValueInterceptor>;
}