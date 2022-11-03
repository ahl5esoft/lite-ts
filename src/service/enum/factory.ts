import { opentracing } from 'jaeger-client';

import { TracerStrategy } from '../tracer';
import { EnumFactoryBase, ITraceable } from '../../contract';
import { contract } from '../../model';

export class EnumFactory extends EnumFactoryBase implements ITraceable<EnumFactoryBase> {
    public constructor(
        private m_ParentTracerSpan: opentracing.Span,
        private m_Enum: { [name: string]: any },
    ) {
        super();
    }

    public build<T extends contract.IEnumItem>(model: new () => T) {
        if (this.m_Enum[model.name])
            return new TracerStrategy(this.m_Enum[model.name]).withTrace(this.m_ParentTracerSpan);

        throw new Error(`缺少创建函数: ${model.name}`);
    }

    public withTrace(parentSpan: any) {
        return parentSpan ? new EnumFactory(parentSpan, this.m_Enum) : this;
    }
}