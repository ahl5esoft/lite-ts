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
     * @param m_BuildFuncs 创建枚举函数数组
     * @param m_ParentSpan 父跟踪范围
     */
    public constructor(
        private m_BuildFuncs: { [key: string]: () => any; },
        private m_ParentSpan?: opentracing.Span,
    ) {
        super();
    }

    /**
     * 创建枚举
     * 
     * @param model 枚举模型
     */
    public build<T extends contract.IEnumItem>(model: new () => T) {
        if (model.name in this.m_BuildFuncs) {
            return new TracerStrategy(
                this.m_BuildFuncs[model.name]()
            ).withTrace(this.m_ParentSpan);
        }

        throw new Error(`缺少创建函数: ${model.name}`);
    }

    /**
     * 跟踪
     * 
     * @param parentSpan 父跟踪范围
     */
    public withTrace(parentSpan: any) {
        return parentSpan ? new EnumFactory(this.m_BuildFuncs, parentSpan) : this;
    }
}