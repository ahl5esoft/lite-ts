import { opentracing } from 'jaeger-client';

import { TracerStrategy } from '../tracer';
import { EnumFactoryBase, ITraceable, IUnitOfWork, ValueServiceBase } from '../../contract';
import { enum_, global } from '../../model';

export class EnumFactory extends EnumFactoryBase implements ITraceable<EnumFactoryBase> {
    public constructor(
        private m_ParentTracerSpan: opentracing.Span,
        private m_AbEnum: { [name: string]: any },
        private m_Enum: { [name: string]: any },
    ) {
        super();
    }

    public build<T extends enum_.ItemData>(typer: new () => T) {
        if (this.m_Enum[typer.name])
            return new TracerStrategy(this.m_Enum[typer.name]).withTrace(this.m_ParentTracerSpan);

        throw new Error(`${EnumFactory.name}.build: 未注册${typer.name}`);
    }

    public async buildWithAb<T extends enum_.ItemData>(
        uow: IUnitOfWork,
        userValueService: ValueServiceBase<global.UserValue>,
        typer: new () => T,
    ) {
        const abItem = await (this as EnumFactoryBase).build(enum_.AbTestData).get(r => {
            return r.enumName == typer.name;
        });
        if (!abItem)
            return this.build(typer);

        const ok = await userValueService.checkConditions(uow, abItem.entry.conditions);
        return ok ? new TracerStrategy(
            this.m_AbEnum[typer.name],
        ).withTrace(this.m_ParentTracerSpan) : this.build(typer);
    }

    public withTrace(parentSpan: opentracing.Span) {
        return parentSpan ? new EnumFactory(parentSpan, this.m_AbEnum, this.m_Enum) : this;
    }
}