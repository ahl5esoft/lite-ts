import { opentracing } from 'jaeger-client';

import { TracerStrategy } from '../tracer';
import { EnumFactoryBase, ITraceable } from '../../contract';
import { contract } from '../../model';

/**
 * 枚举工厂
 */
export class EnumFactory extends EnumFactoryBase implements ITraceable<EnumFactoryBase> {
    /**
     * 构造函数
     * 
     * @param m_ParentTracerSpan 父跟踪范围
     * @param m_Enum 枚举字典
     */
    public constructor(
        private m_ParentTracerSpan: opentracing.Span,
        private m_Enum: { [name: string]: any },
    ) {
        super();
    }

    /**
     * 创建枚举
     * 
     * @param model 枚举模型
     */
    public build<T extends contract.IEnumItem>(model: new () => T) {
        if (this.m_Enum[model.name])
            return new TracerStrategy(this.m_Enum[model.name]).withTrace(this.m_ParentTracerSpan);

        throw new Error(`缺少创建函数: ${model.name}`);
    }

    /**
     * 跟踪
     * 
     * @param parentSpan 父跟踪范围
     */
    public withTrace(parentSpan: any) {
        return parentSpan ? new EnumFactory(parentSpan, this.m_Enum) : this;
    }
}