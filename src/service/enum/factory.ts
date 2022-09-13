import { opentracing } from 'jaeger-client';

import { TracerStrategy } from '../tracer';
import { EnumFactoryBase, ITraceable } from '../../contract';
import { contract } from '../../model';

/**
 * 枚举工厂
 */
export class EnumFactory extends EnumFactoryBase implements ITraceable<EnumFactoryBase> {
    /**
     * 枚举
     */
    private m_Enums: { [name: string]: any } = {};

    /**
     * 构造函数
     * 
     * @param m_ParentTracerSpan 父跟踪范围
     * @param m_BuildFuncs 创建枚举函数数组
     */
    public constructor(
        private m_ParentTracerSpan: opentracing.Span,
        private m_BuildFuncs: { [key: string]: () => any; },
    ) {
        super();
    }

    /**
     * 创建枚举
     * 
     * @param model 枚举模型
     */
    public build<T extends contract.IEnumItem>(model: new () => T) {
        if (model.name in this.m_BuildFuncs)
            this.m_Enums[model.name] ??= this.m_BuildFuncs[model.name]();

        if (this.m_Enums[model.name])
            return new TracerStrategy(this.m_Enums[model.name]).withTrace(this.m_ParentTracerSpan);

        throw new Error(`缺少创建函数: ${model.name}`);
    }

    /**
     * 跟踪
     * 
     * @param parentSpan 父跟踪范围
     */
    public withTrace(parentSpan: any) {
        if (parentSpan) {
            const enumFactory = new EnumFactory(parentSpan, this.m_BuildFuncs);
            enumFactory.m_Enums = this.m_Enums;
            return enumFactory;
        }

        return this;
    }
}