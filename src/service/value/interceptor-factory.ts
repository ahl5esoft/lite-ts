import { opentracing } from 'jaeger-client';
import Container from 'typedi';

import { valueInterceptorMetadata } from './interceptor-metadata';
import { NullValueInterceptor } from './null-interceptor';
import { TracerStrategy } from '../tracer';
import { EnumFactoryBase, ITraceable, ValueInterceptorFactoryBase } from '../../contract';
import { contract, enum_ } from '../../model';

const nullValueInterceptor = new NullValueInterceptor();

export class ValueInterceptorFactory extends ValueInterceptorFactoryBase implements ITraceable<ValueInterceptorFactoryBase> {
    public constructor(
        protected enumFactory: EnumFactoryBase,
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
            const allValueTypeItem = await this.enumFactory.build(enum_.ValueTypeData).allItem;
            if (allValueTypeItem[value.valueType]) {
                for (const r of valueInterceptorMetadata.predicates) {
                    const ok = r.predicate(allValueTypeItem[value.valueType].entry);
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
            new TracerStrategy(this.enumFactory).withTrace(parentSpan),
            parentSpan,
        ) : this;
    }
}