import { opentracing } from 'jaeger-client';
import Container from 'typedi';

import { valueInterceptorCtor } from './interceptor-metadata';
import { TracerStrategy } from '../tracer';
import { ITraceable, IValueInterceptor, ValueInterceptorFactoryBase } from '../../contract';

/**
 * null数值拦截器
 */
const nullValueInterceptor: IValueInterceptor = {
    after: async () => { },
    before: async () => {
        return false;
    }
};

/**
 * 数值拦截器工厂
 */
export class ValueInterceptorFactory extends ValueInterceptorFactoryBase implements ITraceable<ValueInterceptorFactoryBase> {
    /**
     * 构造函数
     * 
     * @param m_ParentSpan 父跟踪范围
     */
    public constructor(
        private m_ParentSpan?: opentracing.Span
    ) {
        super();
    }

    /**
     * 创建数值拦截器
     * 
     * @param valueType 数值类型
     */
    public build(valueType: number) {
        const ctor = valueInterceptorCtor[valueType];
        if (ctor) {
            const interceptor = Container.get(ctor);
            Container.remove(ctor);

            return new TracerStrategy(interceptor).withTrace(this.m_ParentSpan);
        }

        return nullValueInterceptor;
    }

    /**
     * 跟踪
     * 
     * @param parentSpan 父跟踪范围
     */
    public withTrace(parentSpan: any) {
        return new ValueInterceptorFactory(parentSpan);
    }
}