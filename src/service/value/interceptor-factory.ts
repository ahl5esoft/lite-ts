import { opentracing } from 'jaeger-client';
import Container from 'typedi';

import { valueInterceptorMetadata } from './interceptor-metadata';
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
    public async build(valueType: number) {
        if (!valueInterceptorMetadata.valueType[valueType]) {
            for (const r of valueInterceptorMetadata.predicates) {
                const ok = await r.predicate(valueType);
                if (ok)
                    valueInterceptorMetadata.valueType[valueType] = r.ctor;
            }
        }

        if (valueInterceptorMetadata.valueType[valueType]) {
            const interceptor = Container.get(valueInterceptorMetadata.valueType[valueType]);
            Container.remove(valueInterceptorMetadata.valueType[valueType]);

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
        return parentSpan ? new ValueInterceptorFactory(parentSpan) : this;
    }
}