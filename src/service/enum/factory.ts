import { opentracing } from 'jaeger-client';

import { TracerStrategy } from '../tracer';
import { EnumFactoryBase, ITraceable } from '../../contract';
import { enum_ } from '../../model';

export class EnumFactory extends EnumFactoryBase implements ITraceable<EnumFactoryBase> {
    public constructor(
        private m_ParentTracerSpan: opentracing.Span,
        private m_Enum: { [name: string]: any },
    ) {
        super();
    }

    public build<T extends enum_.ItemData>(typer: new () => T) {
        if (this.m_Enum[typer.name])
            return new TracerStrategy(this.m_Enum[typer.name]).withTrace(this.m_ParentTracerSpan);

        throw new Error(`${EnumFactory.name}.build: 未注册${typer.name}`);
    }

    public withTrace(parentSpan: opentracing.Span) {
        return parentSpan ? new EnumFactory(parentSpan, this.m_Enum) : this;
    }
}