import { opentracing } from 'jaeger-client';
import Container from 'typedi';

import { valueInterceptorMetadata } from './interceptor-metadata';
import { NullValueInterceptor } from './null-interceptor';
import { TracerStrategy } from '../tracer';
import { EnumFactoryBase, ITraceable, ValueInterceptorFactoryBase } from '../../contract';
import { contract, enum_ } from '../../model';

/**
 * null数值拦截器
 */
const nullValueInterceptor = new NullValueInterceptor();
/**
 * 数值拦截器工厂
 */
export class ValueInterceptorFactory extends ValueInterceptorFactoryBase implements ITraceable<ValueInterceptorFactoryBase> {
    /**
     * 构造函数
     * 
     * @param m_EnumFactory 枚举工厂
     * @param m_ParentSpan 父跟踪范围
     */
    public constructor(
        private m_EnumFactory: EnumFactoryBase,
        private m_ParentSpan?: opentracing.Span
    ) {
        super();
    }

    /**
     * 创建数值拦截器
     * 
     * @param value 数值
     */
    public async build(value: contract.IValue) {
        if (value.isSkipIntercept)
            return nullValueInterceptor;

        if (!valueInterceptorMetadata.valueType[value.valueType]) {
            const allValueTypeItem = await this.m_EnumFactory.build(enum_.ValueTypeData).allItem;
            if (allValueTypeItem[value.valueType]) {
                for (const r of valueInterceptorMetadata.predicates) {
                    const ok = r.predicate(allValueTypeItem[value.valueType].data);
                    if (ok)
                        valueInterceptorMetadata.valueType[value.valueType] = r.ctor;
                }
            }
        }

        if (valueInterceptorMetadata.valueType[value.valueType]) {
            const interceptor = Container.get(valueInterceptorMetadata.valueType[value.valueType]);
            Container.remove(valueInterceptorMetadata.valueType[value.valueType]);

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
        return parentSpan ? new ValueInterceptorFactory(
            new TracerStrategy(this.m_EnumFactory).withTrace(parentSpan),
            parentSpan,
        ) : this;
    }
}