import { opentracing } from 'jaeger-client';
import Container from 'typedi';

import { ITraceable, IValueInterceptor, ValueInterceptorFactoryBase } from '../..';

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
 * 数值拦截器构造器
 */
const valueInterceptorCtors: { [key: number]: { [key: number]: new () => IValueInterceptor } } = {};

/**
 * 数值拦截器工厂
 */
export class ValueInterceptorFactory extends ValueInterceptorFactoryBase implements ITraceable {
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
     * @param targetType 目标类型
     * @param valueType 数值类型
     */
    public build(targetType: number, valueType: number): IValueInterceptor {
        const valueTypeCtors = valueInterceptorCtors[targetType];
        if (valueTypeCtors) {
            const ctor = valueTypeCtors[valueType];
            if (ctor) {
                const interceptor = Container.get(ctor);
                Container.remove(ctor);

                const tracer = interceptor as any as ITraceable;
                return tracer.withTrace ? tracer.withTrace(this.m_ParentSpan) : interceptor;
            }
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

    /**
     * 注册数值拦截器
     * 
     * @param targetType 目标类型
     * @param valueType 数值类型
     * @param ctor 构造函数
     */
    public static register(targetType: number, valueType: number, ctor: new () => IValueInterceptor) {
        if (!(targetType in valueInterceptorCtors))
            valueInterceptorCtors[targetType] = {};

        valueInterceptorCtors[targetType][valueType] = ctor;
    }
}